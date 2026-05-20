import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { sql } from "../db/index.js";


const addToFavorites = asyncHandler(async (req, res) => {

    const { productId } = req.params;
    const userId = req.user.id;


    if (!productId) {
        throw new ApiError(400, "Product ID is required");
    }
    const product = await sql`
        select * from products where id = ${productId} and status = 'approved'
    `;
    if (product.length === 0) {
        throw new ApiError(404, "Product not found");
    }

    const favorite = await sql`
        insert into favorites (user_id, product_id)
        values (${userId}, ${productId})
        returning *
    `;

    return res.status(201).json(new ApiResponse(201, favorite[0], "Product added to favorites"));
});

const removeFromFavorites = asyncHandler(async (req, res) => {
    const { productId } = req.params;
    const userId = req.user.id;

    if (!productId) {
        throw new ApiError(400, "Product ID is required");
    }

    const favorite = await sql`
        delete from favorites
        where user_id = ${userId} and product_id = ${productId}
        returning *
    `;
    if (favorite.length === 0) {
        throw new ApiError(404, "Favorite not found");
    }
    return res.status(200).json(new ApiResponse(200, favorite[0], "Product removed from favorites"));

});

const getFavorites = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const favorites = await sql`
        select p.* from products p
        inner join favorites f on p.id = f.product_id
        where f.user_id = ${userId} and p.status = 'approved'
        order by p.created_at desc
    `;

    return res.status(200).json(new ApiResponse(200, favorites, "Favorites fetched successfully"));
});


export {
    addToFavorites,
    removeFromFavorites,
    getFavorites
};