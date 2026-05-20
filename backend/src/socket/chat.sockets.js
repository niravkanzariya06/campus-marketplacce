import jwt from "jsonwebtoken";
import { getUserChats, createMessage, editMessage, deleteMessage } from "../controllers/messages.controllers.js";

// import { initCallSocket } from "./call.sockets.js";

let ioInstance = null;

// Per-socket rate limiting for messages (max 10/sec)
const messageCooldowns = new Map();
const MAX_MESSAGES_PER_SEC = 10;

function isRateLimited(socketId) {
    const now = Date.now();
    const history = messageCooldowns.get(socketId) || [];
    // Remove entries older than 1 second
    const recent = history.filter(t => now - t < 1000);
    if (recent.length >= MAX_MESSAGES_PER_SEC) return true;
    recent.push(now);
    messageCooldowns.set(socketId, recent);
    return false;
}

const getIO = () => ioInstance;

const initChatSocket = (io) => {

    ioInstance = io;

    // JWT AUTH MIDDLEWARE — expects accessToken from frontend or cookies
    io.use((socket, next) => {
        try {
            let token = socket.handshake.auth?.accessToken;

            if (!token && socket.handshake.headers.cookie) {
                // Try extracting from cookies
                const cookieParts = socket.handshake.headers.cookie.split(';');
                for (const part of cookieParts) {
                    const [name, value] = part.trim().split('=');
                    if (name === 'accessToken') {
                        token = value;
                        break;
                    }
                }
            }

            if (!token) return next(new Error("Authentication required"));

            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            socket.userId = decoded.id;
            next();
        } catch (err) {
            return next(new Error("Invalid or expired token"));
        }
    });

    io.on("connection", async (socket) => {
        try {
            const userId = socket.userId;

            // Join personal room + all chat rooms
            socket.join(String(userId));
            const chats = await getUserChats(userId);
            chats.forEach(chat => socket.join(String(chat.id)));

            // JOIN NEW CHAT    
            socket.on("join_chat", (chatId) => {
                if (chatId) socket.join(String(chatId));
            });

            // SEND MESSAGE
            socket.on("send_message", async ({ chatId, content }) => {
                try {
                    if (!chatId || !content?.trim()) return;
                    if (isRateLimited(socket.id)) return; // silently drop
                    // Sanitize: trim and truncate
                    const sanitized = content.trim().slice(0, 5000);
                    const message = await createMessage(userId, chatId, sanitized);
                    if (message) io.to(String(chatId)).emit("receive_message", message);
                } catch (err) {
                    console.error("Error sending message:", err);
                }
            });

            // EDIT MESSAGE
            socket.on("edit_message", async ({ messageId, content }) => {
                try {
                    if (!messageId || !content?.trim()) return;
                    const result = await editMessage(userId, messageId, content);
                    if (result) io.to(String(result.chatId)).emit("message_updated", result.message);
                } catch (err) {
                    console.error("Error editing message:", err);
                }
            });

            // DELETE MESSAGE
            socket.on("delete_message", async ({ messageId }) => {
                try {
                    if (!messageId) return;
                    const result = await deleteMessage(userId, messageId);
                    if (result) io.to(String(result.chatId)).emit("message_deleted", result);
                } catch (err) {
                    console.error("Error deleting message:", err);
                }
            });

            // initialize call events
            // initCallSocket(io, socket);

            // DISCONNECT
            socket.on("disconnect", () => {
                messageCooldowns.delete(socket.id);
            });

        } catch (error) {
            console.error("Socket error:", error);
        }
    });
};

export { initChatSocket, getIO };
