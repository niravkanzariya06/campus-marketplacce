import express from "express";
import cors from "cors";
import compression from "compression";
import cookieParser from "cookie-parser";
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import { initChatSocket } from "./socket/chat.sockets.js";
import { apiLimiter, authLimiter } from "./middlewares/rateLimit.middleware.js";
import { securityHeaders } from "./middlewares/security.middleware.js";
import { requestLogger } from "./middlewares/requestLogger.middleware.js";

// Route imports (top-level for clarity)
import userRouter from "./routes/user.routes.js";
import productRouter from "./routes/product.routes.js";
import favoriteRouter from "./routes/favorite.routes.js";
import chatRouter from "./routes/chats.routes.js";
import messageRouter from "./routes/messages.routes.js";
import feedbackRouter from "./routes/feedback.routes.js";
import authRouter from "./routes/auth.routes.js";
import reportRouter from "./routes/report.routes.js";
import { keepAlive } from "./utils/keepAlive.js";

const app = express();
const server = createServer(app);

const defaultOrigins = ["http://localhost:5173", "http://localhost:5174"];

const allowedOrigins = process.env.CORS_ORIGIN
    ? [...defaultOrigins, ...process.env.CORS_ORIGIN.split(",").map(o => o.trim().replace(/\/$/, ""))]
    : defaultOrigins;

app.use(
    cors({
        origin: function (origin, callback) {
            // allow requests with no origin (like mobile apps or curl requests)
            if (!origin) return callback(null, true);
            if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes("*")) {
                callback(null, true);
            } else {
                console.warn(`Blocked CORS request from origin: ${origin}`);
                callback(new Error('Not allowed by CORS'));
            }
        },
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true,
        optionsSuccessStatus: 200 // Some legacy browsers choke on 204
    })
);

// Compress all responses (gzip/brotli) — ~70% smaller JSON payloads
app.use(compression());

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

// Apply rate limiting to API routes
app.use('/api/', apiLimiter);
// Apply stricter limits to auth endpoints
app.use('/api/users/login', authLimiter);
app.use('/api/users/register', authLimiter);
app.use('/api/auth/oauth', authLimiter);

// Apply security headers
app.use(securityHeaders);

// Request logging
app.use(requestLogger);

// Routes
app.use("/api/users", userRouter);
app.use("/api/products", productRouter);
app.use("/api/favorites", favoriteRouter);
app.use("/api/chats", chatRouter);
app.use("/api/messages", messageRouter);
app.use("/api/feedback", feedbackRouter);
app.use("/api/auth", authRouter);
app.use("/api/reports", reportRouter);

// Health check endpoint for keep-alive pings
app.get("/api/health", (req, res) => {
    res.status(200).json({ status: "ok", uptime: process.uptime() });
});

const io = new Server(server, {
    cors: {
        origin: allowedOrigins,
        methods: ["GET", "POST"],
        credentials: true,
        allowedHeaders: ["Content-Type", "Authorization"]
    },
});

initChatSocket(io);

// Global error handler — converts ApiError to JSON response
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Something went wrong";
    res.status(statusCode).json({
        statusCode,
        data: null,
        message,
        success: false,
        errors: err.errors || [],
    });
});

// Keep-alive self-ping — prevents cold starts on Render free tier
keepAlive();

export { server };
