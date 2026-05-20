import apiClient from "../lib/apiClient.js";

// Helper to map Express JSON rows to Appwrite-style documents
function mapProduct(p) {
    if (!p) return null;
    return {
        ...p,
        $id: String(p.id),
        imageId: p.image_url,
        userId: String(p.user_id),
        sellerName: p.sellerName || p.sellername || "Unknown Seller",
        sellerAvatar: p.sellerAvatar || p.selleravatar || null,
        $createdAt: p.created_at,
    };
}

export class ProductService {
    // ---------------------------
    // CREATE PRODUCT
    // ---------------------------
    async createProduct(data) {
        try {
            const formData = new FormData();
            formData.append("title", data.title);
            formData.append("price", data.price);
            formData.append("category", data.category);
            formData.append("condition", data.condition || "");
            formData.append("location", data.location || "");
            formData.append("description", data.description);
            if (data.status) formData.append("status", data.status);

            // The AddItem component uploads file first and passes the raw file object back to us here via our dummy uploadFile below
            if (data.imageId && data.imageId instanceof File) {
                formData.append("productImage", data.imageId);
            }

            const response = await apiClient.post('/products/sell-product', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return mapProduct(response.data?.data);
        } catch (error) {
            console.log("ProductService :: createProduct :: error", error);
            return null;
        }
    }

    // ---------------------------
    // UPDATE PRODUCT
    // ---------------------------
    async updateProduct(productId, updates) {
        try {
            const formData = new FormData();
            Object.keys(updates).forEach(key => {
                // If a new raw file was passed as imageId, append it properly
                if (key === 'imageId' && updates[key] instanceof File) {
                    formData.append("productImage", updates[key]);
                } else if (key !== 'imageId' && key !== 'userId' && key !== 'sellerName' && key !== '$id' && key !== '$createdAt') {
                    formData.append(key, updates[key]);
                }
            });

            const response = await apiClient.patch(`/products/${productId}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return mapProduct(response.data?.data);
        } catch (error) {
            console.log("ProductService :: updateProduct :: error", error);
        }
    }

    // ---------------------------
    // DELETE PRODUCT
    // ---------------------------
    async deleteProduct(productId) {
        try {
            await apiClient.delete(`/products/${productId}`);
            return true;
        } catch (error) {
            console.log("ProductService :: deleteProduct :: error", error);
            return false;
        }
    }

    // ---------------------------
    // GET SINGLE PRODUCT
    // ---------------------------
    async getProduct(productId) {
        try {
            const response = await apiClient.get(`/products/${productId}`);
            return mapProduct(response.data?.data);
        } catch (error) {
            console.log("ProductService :: getProduct :: error", error);
            return false;
        }
    }

    // ---------------------------
    // GET ALL PRODUCTS (with pagination only - filtering happens client-side)
    // ---------------------------
    async getProducts(page = 1, limit = 20) {
        try {
            const response = await apiClient.get(`/products?page=${page}&limit=${limit}`);
            const data = response.data?.data || {};
            const products = Array.isArray(data.documents) ? data.documents.map(mapProduct) : [];
            return {
                documents: products,
                total: data.total || 0,
                page: data.page || page,
                totalPages: data.totalPages || 1,
                hasNext: data.hasNext || false
            };
        } catch (error) {
            console.log("ProductService :: getProducts :: error", error);
            return { documents: [], total: 0, page: 1, totalPages: 1, hasNext: false };
        }
    }

    // ---------------------------
    // FILE UPLOAD (MOCKED)
    // ---------------------------
    async uploadFile(file) {
        // Mock to return the file object wrapped in $id so components pass it to createProduct/updateProduct
        return { $id: file };
    }

    // ---------------------------
    // DELETE FILE (MOCKED)
    // ---------------------------
    async deleteFile() {
        return true;
    }

    // ---------------------------
    // FILE PREVIEW URL
    // ---------------------------
    getFileView(fileId) {
        if (fileId instanceof File) return URL.createObjectURL(fileId);
        // Backend returns direct Cloudinary URLs in image_url, and we map it to imageId (which is what fileId is)
        return fileId;
    }

    // ---------------------------
    // STUB INCREMENT VIEWS
    // ---------------------------
    async incrementViews() {
        return true;
    }

    // ---------------------------
    // STUB UPDATE FAVORITE COUNT
    // ---------------------------
    async updateFavoriteCount() {
        return true;
    }

    // ---------------------------
    // GET MY PRODUCTS (for profile)
    // ---------------------------
    async getMyProducts() {
        try {
            const response = await apiClient.get('/products/my');
            const data = response.data?.data || [];
            return {
                documents: Array.isArray(data) ? data.map(mapProduct) : []
            };
        } catch (error) {
            console.log("ProductService :: getMyProducts :: error", error);
            return { documents: [] };
        }
    }
}

const productService = new ProductService();
export default productService;
