import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { sql } from "../db/index.js";

const getUserChats = asyncHandler(async (req, res) => {
    const userId = req.user?.id;

    const chats = await sql`
        select c.id, c.product_id, c.created_at, c.updated_at,
               u1.id as user1_id, u1.username as user1_username, u1.avatar as user1_avatar,
               u2.id as user2_id, u2.username as user2_username, u2.avatar as user2_avatar,
               p.title, p.image_url, p.status, p.user_id as seller_id
        from chats c
        join users u1 on c.user1_id = u1.id
        join users u2 on c.user2_id = u2.id
        join products p on c.product_id = p.id
        where c.user1_id = ${userId} or c.user2_id = ${userId}
        order by c.updated_at desc
    `;

    res.status(200).json(new ApiResponse(true, chats, "Chats fetched successfully"));
});

const createChat = asyncHandler(async (req, res) => {
    const senderId = req.user?.id;
    const { productId } = req.body;

    if (!productId) {
        throw new ApiError(400, "Product ID is required");
    }
    const receiverId = await sql`
        select user_id from products where id = ${productId} and status = 'approved'
    `;

    if (!receiverId || receiverId.length === 0) {
        throw new ApiError(404, "Product not found or not approved");
    }
    //check if sender is trying to chat with themselves
    if (senderId === receiverId[0].user_id) {
        throw new ApiError(400, "You cannot chat with yourself");
    }
    //check if chat already exists between these two users 
    const existingChat = await sql`
        select * from chats 
        where ((user1_id = ${senderId} and user2_id = ${receiverId[0].user_id}) 
           or (user1_id = ${receiverId[0].user_id} and user2_id = ${senderId}))
           and product_id = ${productId} 
    `;
    //if chat already exists return it instead of creating a new one
    if (existingChat && existingChat.length > 0) {
        return res.status(200).json(new ApiResponse(200, existingChat[0], "Chat already exists"));
    }
    //create chat
    const newChat = await sql`
        insert into chats (user1_id, user2_id, product_id) 
        values (${senderId}, ${receiverId[0].user_id}, ${productId}) 
        returning *
    `;

    res.status(201).json(new ApiResponse(201, newChat[0], "Chat created successfully"));
});

const deleteChat = asyncHandler(async (req, res) => {
    const userId = req.user?.id;
    const { chatId } = req.params;

    if (!chatId) {
        throw new ApiError(400, "Chat ID is required");
    }
    // check if chat exists and belongs to user
    const chat = await sql`
        select * from chats where id = ${chatId} and (user1_id = ${userId} or user2_id = ${userId})
    `;

    if (!chat || chat.length === 0) {
        throw new ApiError(404, "Chat not found");
    }
    // delete chat
    await sql`
        delete from chats where id = ${chatId}
    `;

    res.status(200).json(new ApiResponse(true, "Chat deleted successfully"));
});

export {
    getUserChats,
    createChat,
    deleteChat
};