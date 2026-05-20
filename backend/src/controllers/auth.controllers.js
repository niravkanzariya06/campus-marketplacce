import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { sql } from "../db/index.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { sendVerificationEmail, sendOtpEmail } from "../utils/email.util.js";
import { generateOTP } from "../utils/otp.util.js";
import { verifyGoogleToken } from "../utils/oauth.util.js";
import { generateUniqueUsername } from "../utils/username.util.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";


const accessCookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    maxAge: 15 * 60 * 60 * 1000 // 15 hours
};

const refreshCookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
};

const generateAccessToken = (userId) => {
    return jwt.sign(
        { id: userId },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "15m" }
    );
};

const generateRefreshToken = (userId) => {
    return jwt.sign(
        { id: userId },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "7d" }
    );
};

const generateAndSaveTokens = async (userId) => {
    const accessToken = generateAccessToken(userId);
    const refreshToken = generateRefreshToken(userId);

    await sql`UPDATE users SET refresh_token = ${refreshToken} WHERE id = ${userId}`;

    return { accessToken, refreshToken };
};





// ============================================
// AUTH CONTROLLERS
// ============================================

const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body || {};

    if ([username, email, password].some((field) => !field?.trim())) {
        throw new ApiError(400, "All fields are required");
    }

    // ===== ENHANCED VALIDATION =====
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        throw new ApiError(400, "Invalid email format");
    }

    // Validate username (alphanumeric, dashes, underscores, 3-50 chars)
    const usernameRegex = /^[a-zA-Z0-9_-]{3,50}$/;
    if (!usernameRegex.test(username)) {
        throw new ApiError(400, "Username must be 3-50 characters, letters/numbers/_- only");
    }

    // Validate password strength
    if (password.length < 8) {
        throw new ApiError(400, "Password must be at least 8 characters");
    }
    if (!/[A-Z]/.test(password)) {
        throw new ApiError(400, "Password must contain at least one uppercase letter");
    }
    if (!/[a-z]/.test(password)) {
        throw new ApiError(400, "Password must contain at least one lowercase letter");
    }
    if (!/[0-9]/.test(password)) {
        throw new ApiError(400, "Password must contain at least one number");
    }
    // Password max length
    if (password.length > 100) {
        throw new ApiError(400, "Password too long");
    }
    // ===== END VALIDATION =====

    const existingUsers = await sql`
        SELECT id FROM users
        WHERE LOWER(username) = ${username.toLowerCase()}
        OR email = ${email}
    `;

    if (existingUsers.length > 0) {
        throw new ApiError(409, "User with this email or username already exists");
    }

    // Handle optional avatar upload
    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    let avatarUrl = null;
    let avatarPublicId = null;

    if (avatarLocalPath) {
        const uploadedAvatar = await uploadOnCloudinary(avatarLocalPath);
        avatarUrl = uploadedAvatar?.secure_url || null;
        avatarPublicId = uploadedAvatar?.public_id || null;
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = await sql`
        INSERT INTO users (username, email, password, avatar, avatar_public_id)
        VALUES (${username.toLowerCase()}, ${email}, ${passwordHash}, ${avatarUrl}, ${avatarPublicId})
        RETURNING id, username, email, avatar, created_at
    `;

    if (!newUser || newUser.length === 0) {
        throw new ApiError(500, "Something went wrong while registering the user");
    }

    // Generate verification token
    const verificationToken = crypto.randomUUID();
    const verificationExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h

    await sql`
        UPDATE users
        SET verification_token = ${verificationToken},
            verification_token_expiry = ${verificationExpiry}
        WHERE id = ${newUser[0].id}
    `;

    // Send verification email
    await sendVerificationEmail(email, verificationToken);

    return res
        .status(201)
        .json(new ApiResponse(201, {}, "Registration successful. Please check your email to verify your account."));
});


const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email?.trim() || !password?.trim()) {
        throw new ApiError(400, "Email and password are required");
    }

    const users = await sql`
        SELECT id, username, email, password, avatar, role, is_verified, created_at
        FROM users WHERE email = ${email}
    `;

    if (users.length === 0) {
        throw new ApiError(401, "Invalid email or password");
    }

    const user = users[0];

    if (!user.is_verified) {
        throw new ApiError(403, "Please verify your email before logging in");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid email or password");
    }

    const { accessToken, refreshToken } = await generateAndSaveTokens(user.id);
    const { password_hash, ...userWithoutPassword } = user;

    return res
        .status(200)
        .cookie("accessToken", accessToken, accessCookieOptions)
        .cookie("refreshToken", refreshToken, refreshCookieOptions)
        .json(new ApiResponse(200, { user: userWithoutPassword, accessToken }, "Login successful"));
});

const logoutUser = asyncHandler(async (req, res) => {
    await sql`UPDATE users SET refresh_token = NULL WHERE id = ${req.user.id}`;

    return res
        .status(200)
        .clearCookie("accessToken", accessCookieOptions)
        .clearCookie("refreshToken", refreshCookieOptions)
        .json(new ApiResponse(200, {}, "Logged out successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Refresh token is required");
    }

    let decoded;
    try {
        decoded = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
    } catch (err) {
        throw new ApiError(401, "Invalid or expired refresh token");
    }

    const users = await sql`
        SELECT id, refresh_token FROM users WHERE id = ${decoded.id}
    `;

    if (users.length === 0 || users[0].refresh_token !== incomingRefreshToken) {
        throw new ApiError(401, "Refresh token is expired or used");
    }

    const { accessToken, refreshToken } = await generateAndSaveTokens(users[0].id);

    return res
        .status(200)
        .cookie("accessToken", accessToken, accessCookieOptions)
        .cookie("refreshToken", refreshToken, refreshCookieOptions)
        .json(new ApiResponse(200, { accessToken }, "Access token refreshed"));
});


// ============================================
// EMAIL VERIFICATION CONTROLLERS
// ============================================

const verifyEmail = asyncHandler(async (req, res) => {
    const { token } = req.params;

    const users = await sql`
        SELECT id, username, email, avatar, role, is_verified, verification_token_expiry
        FROM users
        WHERE verification_token = ${token}
    `;

    if (users.length === 0) {
        throw new ApiError(400, "Invalid verification token");
    }

    const user = users[0];

    if (user.is_verified) {
        throw new ApiError(400, "Email is already verified");
    }

    if (new Date(user.verification_token_expiry) < new Date()) {
        throw new ApiError(400, "Verification token has expired. Please request a new one.");
    }

    // Mark as verified and clear token fields
    await sql`
        UPDATE users
        SET is_verified = true,
            verification_token = NULL,
            verification_token_expiry = NULL
        WHERE id = ${user.id}
    `;

    // Auto-login — generate tokens
    const { accessToken, refreshToken } = await generateAndSaveTokens(user.id);

    const { password, ...safeUser } = user;

    return res
        .status(200)
        .cookie("accessToken", accessToken, accessCookieOptions)
        .cookie("refreshToken", refreshToken, refreshCookieOptions)
        .json(new ApiResponse(200, { user: safeUser, accessToken }, "Email verified successfully. You are now logged in."));
});

const resendVerification = asyncHandler(async (req, res) => {
    const { email } = req.body;

    if (!email?.trim()) {
        throw new ApiError(400, "Email is required");
    }

    const users = await sql`
        SELECT id, email, is_verified, verification_token_expiry
        FROM users WHERE email = ${email}
    `;

    if (users.length === 0) {
        throw new ApiError(404, "No account found with this email");
    }

    const user = users[0];

    if (user.is_verified) {
        throw new ApiError(400, "This email is already verified");
    }

    // Rate limit — 60 seconds between resends
    if (user.verification_token_expiry) {
        const tokenAge = (new Date(user.verification_token_expiry) - new Date()) / 1000;
        const remainingWindow = 86400 - tokenAge;
        if (remainingWindow < 60) {
            throw new ApiError(429, "Please wait 60 seconds before requesting another email");
        }
    }

    const verificationToken = crypto.randomUUID();
    const verificationExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await sql`
        UPDATE users
        SET verification_token = ${verificationToken},
            verification_token_expiry = ${verificationExpiry}
        WHERE id = ${user.id}
    `;

    await sendVerificationEmail(user.email, verificationToken);

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Verification email resent. Please check your inbox."));
});


// ============================================
// PASSWORD RESET CONTROLLERS
// ============================================

const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;

    if (!email?.trim()) {
        throw new ApiError(400, "Email is required");
    }

    const users = await sql`
        SELECT id, username, email, is_verified FROM users WHERE email = ${email}
    `;

    if (users.length === 0) {
        throw new ApiError(404, "No account found with this email");
    }

    const user = users[0];

    if (!user.is_verified) {
        throw new ApiError(403, "Please verify your email before resetting password");
    }

    // Rate limit check
    const recentOtps = await sql`
        SELECT created_at FROM otps
        WHERE user_id = ${user.id}
        AND purpose = 'password_reset'
        ORDER BY created_at DESC
        LIMIT 1
    `;

    if (recentOtps.length > 0) {
        const elapsed = (Date.now() - new Date(recentOtps[0].created_at).getTime()) / 1000;
        if (elapsed < 60) {
            throw new ApiError(429, "Please wait before requesting another OTP");
        }
    }

    // Delete existing OTPs
    await sql`
        DELETE FROM otps
        WHERE user_id = ${user.id}
        AND purpose = 'password_reset'
    `;

    // Generate new OTP
    const otp = generateOTP();

    await sql`
        INSERT INTO otps (user_id, email, otp, purpose, expiry)
        VALUES (${user.id}, ${email}, ${otp}, 'password_reset', NOW() + INTERVAL '10 minutes')
    `;

    await sendOtpEmail(email, otp);

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "OTP sent to your email"));
});

const verifyOtp = asyncHandler(async (req, res) => {
    const { email, otp } = req.body;

    if (!email?.trim() || !otp?.trim()) {
        throw new ApiError(400, "Email and OTP are required");
    }

    // Find valid (not expired) OTP
    const otpRows = await sql`
        SELECT * FROM otps
        WHERE email = ${email}
        AND otp = ${otp}
        AND purpose = 'password_reset'
        AND expiry > NOW()
    `;

    if (otpRows.length === 0) {
        // Check if OTP existed but expired
        const expired = await sql`
            SELECT * FROM otps
            WHERE email = ${email}
            AND otp = ${otp}
            AND purpose = 'password_reset'
        `;
        if (expired.length > 0) {
            await sql`DELETE FROM otps WHERE id = ${expired[0].id}`;
            throw new ApiError(400, "OTP has expired. Please request a new one.");
        }
        throw new ApiError(400, "Invalid OTP");
    }

    const otpRow = otpRows[0];

    // Generate reset token
    const resetToken = crypto.randomUUID();

    await sql`
        UPDATE otps
        SET otp = NULL,
            reset_token = ${resetToken},
            reset_token_expiry = NOW() + INTERVAL '15 minutes'
        WHERE id = ${otpRow.id}
    `;

    return res
        .status(200)
        .json(new ApiResponse(200, { resetToken }, "OTP verified successfully"));
});

const resetPassword = asyncHandler(async (req, res) => {
    const { resetToken, password, confirmPassword } = req.body;

    if (!resetToken?.trim() || !password?.trim() || !confirmPassword?.trim()) {
        throw new ApiError(400, "All fields are required");
    }

    if (password !== confirmPassword) {
        throw new ApiError(400, "Passwords do not match");
    }

    // Password strength validation
    if (password.length < 8) {
        throw new ApiError(400, "Password must be at least 8 characters");
    }
    if (!/[A-Z]/.test(password)) {
        throw new ApiError(400, "Password must contain at least one uppercase letter");
    }
    if (!/[a-z]/.test(password)) {
        throw new ApiError(400, "Password must contain at least one lowercase letter");
    }
    if (!/[0-9]/.test(password)) {
        throw new ApiError(400, "Password must contain at least one number");
    }

    const otpRows = await sql`
        SELECT * FROM otps
        WHERE reset_token = ${resetToken}
        AND purpose = 'password_reset'
        AND reset_token_expiry > NOW()
    `;

    if (otpRows.length === 0) {
        throw new ApiError(400, "Invalid or expired reset token");
    }

    const otpRow = otpRows[0];

    const hashedPassword = await bcrypt.hash(password, 10);

    await sql`
        UPDATE users
        SET password = ${hashedPassword},
            updated_at = NOW()
        WHERE id = ${otpRow.user_id}
    `;

    // Delete the OTP row
    await sql`DELETE FROM otps WHERE id = ${otpRow.id}`;

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Password reset successfully. Please login."));
});

const oauthLogin = asyncHandler(async (req, res) => {
    const { code, codeVerifier, redirectUri, provider } = req.body || {};

    if (!code?.trim() || !codeVerifier?.trim() || !redirectUri?.trim()) {
        throw new ApiError(400, "code, codeVerifier, and redirectUri are required");
    }

    if (provider !== "google") {
        throw new ApiError(400, "Only Google OAuth is supported");
    }

    // Validate redirect URI against allowed origins
    const allowedOrigins = [
        "http://localhost:5173",
        "http://localhost:5174",
        process.env.FRONTEND_URL,
    ].filter(Boolean);
    const isAllowed = allowedOrigins.some(
        (origin) => redirectUri.startsWith(origin + "/")
    );
    if (!isAllowed) {
        throw new ApiError(400, "Invalid redirect URI");
    }

    // Verify OAuth token with Google
    const { providerId, email, name, picture } = await verifyGoogleToken({
        code,
        codeVerifier,
        redirectUri,
    });

    // 1. Lookup by provider_id + auth_provider
    let users = await sql`
        SELECT id, username, email, avatar, role, is_verified, auth_provider, created_at
        FROM users
        WHERE provider_id = ${providerId} AND auth_provider = 'google'
    `;

    if (users.length > 0) {
        const user = users[0];
        const { accessToken, refreshToken } = await generateAndSaveTokens(user.id);

        const { refresh_token, ...userWithoutSensitiveData } = { ...user, password: undefined };

        return res
            .status(200)
            .cookie("accessToken", accessToken, accessCookieOptions)
            .cookie("refreshToken", refreshToken, refreshCookieOptions)
            .json(new ApiResponse(200, userWithoutSensitiveData, "Login successful"));
    }

    // 2. Lookup by email
    users = await sql`
        SELECT id, username, email, password, avatar, role, is_verified, auth_provider, created_at
        FROM users WHERE email = ${email}
    `;

    if (users.length > 0) {
        const existingUser = users[0];

        // Link Google to local account
        if (existingUser.auth_provider === "local") {
            const updateFields = {
                provider_id: providerId,
                auth_provider: "google",
                is_verified: true,
            };

            if (picture && !existingUser.avatar) {
                updateFields.avatar = picture;
            }

            await sql`
                UPDATE users
                SET ${sql(updateFields)}, updated_at = NOW()
                WHERE id = ${existingUser.id}
            `;
        }

        const { accessToken, refreshToken } = await generateAndSaveTokens(existingUser.id);

        const userWithoutSensitiveData = {
            id: existingUser.id,
            username: existingUser.username,
            email: existingUser.email,
            avatar: existingUser.avatar,
            role: existingUser.role,
            is_verified: true,
            auth_provider: "google",
            created_at: existingUser.created_at,
        };

        return res
            .status(200)
            .cookie("accessToken", accessToken, accessCookieOptions)
            .cookie("refreshToken", refreshToken, refreshCookieOptions)
            .json(new ApiResponse(200, userWithoutSensitiveData, "Login successful"));
    }

    // 3. New user — create account
    const uniqueUsername = await generateUniqueUsername(name, sql);
    const randomPassword = await bcrypt.hash(
        Math.random().toString(36) + Date.now().toString(), 10
    );

    const newUser = await sql`
        INSERT INTO users (username, email, password, provider_id, auth_provider, is_verified, avatar)
        VALUES (${uniqueUsername}, ${email}, ${randomPassword}, ${providerId}, 'google', true, ${picture || null})
        RETURNING id, username, email, avatar, role, is_verified, auth_provider, created_at
    `;

    if (!newUser || newUser.length === 0) {
        throw new ApiError(500, "Failed to create user");
    }

    const user = newUser[0];
    const { accessToken, refreshToken } = await generateAndSaveTokens(user.id);

    const userWithoutSensitiveData = {
        id: user.id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        is_verified: user.is_verified,
        auth_provider: user.auth_provider,
        created_at: user.created_at,
    };

    return res
        .status(201)
        .cookie("accessToken", accessToken, accessCookieOptions)
        .cookie("refreshToken", refreshToken, refreshCookieOptions)
        .json(new ApiResponse(201, userWithoutSensitiveData, "Account created and login successful"));
});

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    verifyEmail,
    resendVerification,
    forgotPassword,
    verifyOtp,
    resetPassword,
    oauthLogin
};

// Exported for internal use (e.g., OAuth controller)
export { generateAndSaveTokens, accessCookieOptions, refreshCookieOptions };