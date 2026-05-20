import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { sql } from "../db/index.js";

// ============================================
// REST API MESSAGE CONTROLLERS
// ============================================
const getChatMessagesByChatId = asyncHandler(async (req, res) => {
    const { chatId } = req.params;
    const userId = req.user.id;

    if (!chatId) {
        throw new ApiError(400, "Chat ID is required");
    }
    const chat = await sql`
        select * from chats 
        where id = ${chatId} and (user1_id = ${userId} or user2_id = ${userId})
    `;
    if (!chat || chat.length === 0) {
        throw new ApiError(404, "Chat not found");
    }
    const messages = await sql`
        select * from messages 
        where chat_id = ${chatId} 
        order by created_at asc
    `;

    res.status(200).json(new ApiResponse(true, messages, "Messages fetched successfully"));
});



// ============================================
// Socket service functions — called from chat.sockets.js
// ============================================

const getUserChats = async (userId) => {
    return await sql`
        SELECT id FROM chats
        WHERE user1_id = ${userId} OR user2_id = ${userId};
    `;
};

const createMessage = async (userId, chatId, content) => {
    // Verify user is a participant
    const chat = await sql`
        SELECT id FROM chats
        WHERE id = ${chatId}
          AND (user1_id = ${userId} OR user2_id = ${userId});
    `;
    if (chat.length === 0) return null;

    const [message] = await sql`
        INSERT INTO messages (chat_id, sender_id, content)
        VALUES (${chatId}, ${userId}, ${content})
        RETURNING *;
    `;
    return message;
};

const editMessage = async (userId, messageId, content) => {
    // Verify ownership
    const existing = await sql`
        SELECT id, sender_id, chat_id FROM messages
        WHERE id = ${messageId} AND sender_id = ${userId};
    `;
    if (existing.length === 0) return null;

    const [updated] = await sql`
        UPDATE messages SET content = ${content}
        WHERE id = ${messageId}
        RETURNING *;
    `;
    return { message: updated, chatId: existing[0].chat_id };
};

const deleteMessage = async (userId, messageId) => {
    // Verify ownership
    const existing = await sql`
        SELECT id, sender_id, chat_id FROM messages
        WHERE id = ${messageId} AND sender_id = ${userId};
    `;
    if (existing.length === 0) return null;

    await sql`DELETE FROM messages WHERE id = ${messageId}`;
    return { messageId: existing[0].id, chatId: existing[0].chat_id };
};


export {
    getChatMessagesByChatId,
    createMessage,
    editMessage,
    deleteMessage,
    getUserChats
};