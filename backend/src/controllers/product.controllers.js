import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { sql } from "../db/index.js";
import { uploadOnCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js";

// ============================================
// USER PRODUCT CONTROLLERS
// ============================================
const createProduct = asyncHandler(async (req, res) => {

    const userId = req.user.id;
    const { title, price, category, condition, location, description } = req.body;

    // ===== INPUT VALIDATION =====
    // Validate title
    if (!title || typeof title !== 'string' || title.trim().length === 0) {
        throw new ApiError(400, "Title is required");
    }
    if (title.length > 255) {
        throw new ApiError(400, "Title must be less than 255 characters");
    }

    // Validate price (must be positive number)
    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum <= 0) {
        throw new ApiError(400, "Price must be a positive number");
    }
    if (priceNum > 1000000) {
        throw new ApiError(400, "Price is too high");
    }

    // Validate category
    const allowedCategories = ['electronics', 'books', 'clothing', 'furniture', 'other', 'vehicles', 'services'];
    if (!allowedCategories.includes(category)) {
        throw new ApiError(400, "Invalid category");
    }

    // Validate condition
    const allowedConditions = ['new', 'like-new', 'good', 'fair', 'poor'];
    if (!allowedConditions.includes(condition)) {
        throw new ApiError(400, "Invalid condition");
    }

    // Validate description length
    if (description && description.length > 5000) {
        throw new ApiError(400, "Description too long (max 5000 characters)");
    }

    // Validate location length
    if (location && location.length > 255) {
        throw new ApiError(400, "Location too long");
    }

    // Validate image exists
    const productImageLocalPath = req.files?.productImage?.[0]?.path;
    if (!productImageLocalPath) {
        throw new ApiError(400, "Product image is required");
    }

    let productImageUrl = null;
    let productImagePublicId = null;

    // Upload product image to Cloudinary
    const uploadedProductImage = await uploadOnCloudinary(productImageLocalPath);
    productImageUrl = uploadedProductImage.secure_url;
    productImagePublicId = uploadedProductImage.public_id;

    // Create product in the database
    const newProduct = await sql`
        INSERT INTO products (title, price, category, condition, location, description, status, listing_status, user_id, image_url, image_public_id)
        VALUES (${title}, ${price}, ${category}, ${condition}, ${location}, ${description}, 'pending', 'active', ${userId}, ${productImageUrl}, ${productImagePublicId})
        RETURNING *
    `;

    return res.status(201).json(new ApiResponse(201, newProduct[0], "Product created successfully"));


});

const getProducts = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    // Single query: fetch products + total count via window function
    const rows = await sql`
        SELECT p.*, u.username as "sellerName", u.avatar as "sellerAvatar",
               COUNT(*) OVER() AS total_count
        FROM products p
        LEFT JOIN users u ON p.user_id = u.id
        WHERE p.status = 'approved' AND p.listing_status = 'active'
        ORDER BY p.created_at DESC
        LIMIT ${limit} OFFSET ${offset}
    `;

    const total = rows.length > 0 ? parseInt(rows[0].total_count) : 0;
    // Strip the total_count field from each row
    const products = rows.map(({ total_count, ...rest }) => rest);

    return res.status(200).json(new ApiResponse(200, {
        documents: products,
        total,
        page,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit)
    }, "Products fetched successfully"));
});

const getProductById = asyncHandler(async (req, res) => {

    const { id } = req.params;
    const userId = req.user?.id; // may be undefined for unauthenticated

    // Fetch product details by ID
    const product = await sql`
        SELECT p.*, u.username as "sellerName", u.avatar as "sellerAvatar"
        FROM products p
        LEFT JOIN users u ON p.user_id = u.id
        WHERE p.id = ${id}
    `;

    if (product.length === 0) {
        throw new ApiError(404, "Product not found");
    }

    // If user is not the owner, only allow if product is approved AND active
    if (userId && product[0].user_id !== userId) {
        if (product[0].status !== 'approved' || product[0].listing_status !== 'active') {
            throw new ApiError(404, "Product not found");
        }
    }

    return res.status(200).json(new ApiResponse(200, product[0], "Product fetched successfully"));
});

const updateProduct = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const productId = req.params.id;
    const { title, price, category, condition, location, description, listing_status } = req.body;
    const productImageLocalPath = req.files?.productImage?.[0]?.path;

    if (!productId) {
        throw new ApiError(400, "Product ID is required");
    }

    const product = await sql`
        SELECT * FROM products WHERE id = ${productId} AND user_id = ${userId}
    `;

    if (product.length === 0) {
        throw new ApiError(404, "Product not found");
    }

    const current = product[0];

    // Determine new values (partial update - only use provided values)
    const newTitle = title !== undefined ? title : current.title;
    const newPrice = price !== undefined ? price : current.price;
    const newCategory = category !== undefined ? category : current.category;
    const newCondition = condition !== undefined ? condition : current.condition;
    const newLocation = location !== undefined ? location : current.location;
    const newDescription = description !== undefined ? description : current.description;
    let newImageUrl = current.image_url;
    let newImagePublicId = current.image_public_id;
    const newListingStatus = (listing_status && ['active', 'sold', 'archived'].includes(listing_status))
        ? listing_status
        : current.listing_status;

    // Handle image upload if provided
    if (productImageLocalPath) {
        if (current.image_public_id) {
            await deleteFromCloudinary(current.image_public_id);
        }
        const uploaded = await uploadOnCloudinary(productImageLocalPath);
        newImageUrl = uploaded.secure_url;
        newImagePublicId = uploaded.public_id;
    }

    // Validate only if these fields are being changed
    if (title !== undefined && (!newTitle?.trim() || newTitle.length > 255)) {
        throw new ApiError(400, "Invalid title");
    }
    if (price !== undefined) {
        const priceNum = parseFloat(newPrice);
        if (isNaN(priceNum) || priceNum <= 0) {
            throw new ApiError(400, "Price must be a positive number");
        }
    }
    if (category !== undefined && !newCategory?.trim()) {
        throw new ApiError(400, "Category cannot be empty");
    }
    if (condition !== undefined && !newCondition?.trim()) {
        throw new ApiError(400, "Condition cannot be empty");
    }

    // Update database
    const updatedProduct = await sql`
        UPDATE products
        SET
            title = ${newTitle},
            price = ${newPrice},
            category = ${newCategory},
            condition = ${newCondition},
            location = ${newLocation},
            description = ${newDescription},
            image_url = ${newImageUrl},
            image_public_id = ${newImagePublicId},
            listing_status = ${newListingStatus},
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ${productId} AND user_id = ${userId}
        RETURNING *
    `;

    return res.status(200).json(new ApiResponse(200, updatedProduct[0], "Product updated successfully"));
});

const deleteProduct = asyncHandler(async (req, res) => {
    // Delete product by ID
    const userId = req.user.id;
    const productId = req.params.id;

    if (!productId) {
        throw new ApiError(400, "Product ID is required");
    }
    const product = await sql`
        select * from products where id = ${productId} and user_id = ${userId}
    `;

    if (product.length === 0) {
        throw new ApiError(404, "Product not found");
    }
    // Delete product image from Cloudinary if it exists
    const deletedproduct = await deleteFromCloudinary(product[0].image_public_id);

    if (deletedproduct.result !== "ok" && deletedproduct.result !== "not found") {
        return res.status(500).json(new ApiResponse(500, null, "Failed to delete product image from Cloudinary"));
    }

    // Delete the product from the database
    const deletedProduct = await sql`
        DELETE FROM products WHERE id = ${productId} AND user_id = ${userId} RETURNING *
    `;

    return res.status(200).json(new ApiResponse(200, deletedProduct[0], "Product deleted successfully"));

});


// ============================================
// ADMIN PRODUCT CONTROLLERS
// ============================================

const approveProduct = asyncHandler(async (req, res) => {

    const { id: productId } = req.params;

    if (!productId) {
        throw new ApiError(400, "Product ID is required");
    }
    const product = await sql`
        select * from products where id = ${productId} and status = 'pending'
    `;

    if (product.length === 0) {
        throw new ApiError(404, "Product not found or not pending");
    }

    const approvedProduct = await sql`
        UPDATE products
        SET status = 'approved'
        WHERE id = ${productId}
        RETURNING *
    `;

    return res.status(200).json(new ApiResponse(200, approvedProduct[0], "Product approved successfully"));

});

const rejectProduct = asyncHandler(async (req, res) => {

    const { id: productId } = req.params;

    if (!productId) {
        throw new ApiError(400, "Product ID is required");
    }

    const product = await sql`
        select * from products where id = ${productId} and status = 'pending'
    `;

    if (product.length === 0) {
        throw new ApiError(404, "Product not found or not pending");
    }

    const rejectedProduct = await sql`
        UPDATE products
        SET status = 'rejected'
        WHERE id = ${productId}
        RETURNING *
    `;

    return res.status(200).json(new ApiResponse(200, rejectedProduct[0], "Product rejected successfully"));
});

const getAllProducts = asyncHandler(async (req, res) => {
    // Fetch all products regardless of status

    const products = await sql`
        SELECT p.*, u.username as "sellerName", u.avatar as "sellerAvatar"
        FROM products p
        LEFT JOIN users u ON p.user_id = u.id
        ORDER BY p.created_at DESC
    `;
    return res.status(200).json(new ApiResponse(200, products, "All products fetched successfully"));
});

const getPendingProducts = asyncHandler(async (req, res) => {
    // Fetch pending products
    const products = await sql`
        SELECT p.*, u.username as "sellerName", u.avatar as "sellerAvatar"
        FROM products p
        LEFT JOIN users u ON p.user_id = u.id
        WHERE p.status = 'pending' ORDER BY p.created_at DESC
    `;
    return res.status(200).json(new ApiResponse(200, products, "Pending products fetched successfully"));
});

const getApprovedProducts = asyncHandler(async (req, res) => {
    // Fetch approved products

    const products = await sql`
        SELECT p.*, u.username as "sellerName", u.avatar as "sellerAvatar"
        FROM products p
        LEFT JOIN users u ON p.user_id = u.id
        WHERE p.status = 'approved' ORDER BY p.created_at DESC
    `;
    return res.status(200).json(new ApiResponse(200, products, "Approved products fetched successfully"));
});

const getRejectedProducts = asyncHandler(async (req, res) => {
    // Fetch rejected products
    const products = await sql`
        SELECT p.*, u.username as "sellerName", u.avatar as "sellerAvatar"
        FROM products p
        LEFT JOIN users u ON p.user_id = u.id
        WHERE p.status = 'rejected' ORDER BY p.created_at DESC
    `;
    return res.status(200).json(new ApiResponse(200, products, "Rejected products fetched successfully"));
});

const getMyProducts = asyncHandler(async (req, res) => {
    // Fetch all products for the current user (any status, any listing_status)
    const userId = req.user.id;
    const products = await sql`
        SELECT p.*, u.username as "sellerName", u.avatar as "sellerAvatar"
        FROM products p
        LEFT JOIN users u ON p.user_id = u.id
        WHERE p.user_id = ${userId}
        ORDER BY p.created_at DESC
    `;
    return res.status(200).json(new ApiResponse(200, products, "My products fetched successfully"));
});


export {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    approveProduct,
    rejectProduct,
    getAllProducts,
    getPendingProducts,
    getApprovedProducts,
    getRejectedProducts,
    getMyProducts
};