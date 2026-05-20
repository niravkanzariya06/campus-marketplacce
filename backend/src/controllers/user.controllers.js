import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { sql } from "../db/index.js";
import { uploadOnCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js";
import bcrypt from "bcrypt";



// ============================================
// PROFILE CONTROLLERS
// ============================================

const getCurrentUser = asyncHandler(async (req, res) => {
    const users = await sql`
        SELECT id, username, email, avatar, role, created_at, updated_at
        FROM users WHERE id = ${req.user.id}
    `;

    if (users.length === 0) {
        throw new ApiError(404, "User not found");
    }

    return res.status(200).json(new ApiResponse(200, users[0], "User fetched successfully"));
});

const updateProfile = asyncHandler(async (req, res) => {
    const { username, email } = req.body || {};
    const userId = req.user.id;

    if (!username?.trim() && !email?.trim()) {
        throw new ApiError(400, "At least one field (username or email) is required to update");
    }
    const updatedInfo = {};
    if (username?.trim()) {
        updatedInfo.username = username.toLowerCase();
    }
    if (email?.trim()) {
        updatedInfo.email = email;
    }

    await sql`
        UPDATE users SET ${sql(updatedInfo)}, updated_at = NOW() WHERE id = ${userId}
    `;

    return res.status(200).json(new ApiResponse(200, updatedInfo, "Profile updated successfully"));

});

const changeAvatar = asyncHandler(async (req, res) => {
    const avatarLocalPath = req.files?.avatar?.[0]?.path;

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required");
    }

    // Get current avatar public_id for deletion
    const currentUser = await sql`
        SELECT avatar_public_id FROM users WHERE id = ${req.user.id}
    `;

    // Upload new avatar
    const uploadedAvatar = await uploadOnCloudinary(avatarLocalPath);

    if (!uploadedAvatar?.secure_url) {
        throw new ApiError(500, "Error uploading avatar");
    }

    // Delete old avatar from cloudinary
    if (currentUser[0]?.avatar_public_id) {
        await deleteFromCloudinary(currentUser[0].avatar_public_id);
    }

    const updated = await sql`
        UPDATE users SET avatar = ${uploadedAvatar.secure_url}, avatar_public_id = ${uploadedAvatar.public_id}
        WHERE id = ${req.user.id}
        RETURNING id, username, email, avatar, created_at, updated_at
    `;

    return res.status(200).json(new ApiResponse(200, updated[0], "Avatar updated successfully"));
});

const changePassword = asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body || {};

    if (!currentPassword?.trim() || !newPassword?.trim()) {
        throw new ApiError(400, "Current password and new password are required");
    }

    if (newPassword.length < 6) {
        throw new ApiError(400, "New password must be at least 6 characters");
    }

    const users = await sql`
        SELECT id, password FROM users WHERE id = ${req.user.id}
    `;

    const isValid = await bcrypt.compare(currentPassword, users[0].password);

    if (!isValid) {
        throw new ApiError(401, "Current password is incorrect");
    }

    const newHash = await bcrypt.hash(newPassword, 10);

    await sql`UPDATE users SET password = ${newHash} WHERE id = ${req.user.id}`;

    return res.status(200).json(new ApiResponse(200, {}, "Password changed successfully"));
});

const deleteAccount = asyncHandler(async (req, res) => {

    const userId = req.user.id;

    const users = await sql`
        SELECT id, avatar_public_id FROM users WHERE id = ${userId}
    `;

    // Delete avatar from cloudinary if it exists
    if (users[0]?.avatar_public_id) {
        await deleteFromCloudinary(users[0].avatar_public_id);

    }
    // get all product public_ids of the user to delete from cloudinary
    const products = await sql`
        SELECT id, image_public_id FROM products WHERE user_id = ${userId}
    `;
    // Batch delete images in parallel for speed
    const deletePromises = products
        .filter(p => p.image_public_id)
        .map(p => deleteFromCloudinary(p.image_public_id));
    await Promise.allSettled(deletePromises);

    // Delete all favorites of the user   
    await sql`
        DELETE FROM favorites WHERE user_id = ${userId}
    `;

    // Delete all products of the user
    await sql`DELETE FROM products WHERE user_id = ${userId}`;

    // Delete user from database
    await sql`DELETE FROM users WHERE id = ${userId}`;


    return res.status(200).json(new ApiResponse(200, {}, "Account deleted successfully"));
});

export {
    deleteAccount,
    getCurrentUser,
    updateProfile,
    changeAvatar,
    changePassword
};