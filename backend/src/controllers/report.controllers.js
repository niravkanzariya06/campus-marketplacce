import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { sql } from "../db/index.js";

const ALLOWED_REASONS = [
    'inappropriate_content',
    'fake_listing',
    'wrong_category',
    'spam',
    'price_fraud',
    'other'
];

/**
 * @desc    Submit a report for a product
 * @route   POST /api/reports
 * @access  Private (requires auth)
 */
const submitReport = asyncHandler(async (req, res) => {
    const { productId, reason, message } = req.body;
    const reporterId = req.user.id;

    if (!productId) {
        throw new ApiError(400, "Product ID is required");
    }

    if (!reason || !ALLOWED_REASONS.includes(reason)) {
        throw new ApiError(400, "Invalid report reason. Must be one of: " + ALLOWED_REASONS.join(", "));
    }

    if (reason === 'other' && (!message || !message.trim())) {
        throw new ApiError(400, "Please provide details for this report");
    }

    const sanitizedMessage = message?.trim();
    if (sanitizedMessage && sanitizedMessage.length > 2000) {
        throw new ApiError(400, "Message is too long (max 2000 characters)");
    }

    // Verify product exists
    const product = await sql`SELECT id FROM products WHERE id = ${productId}`;
    if (product.length === 0) {
        throw new ApiError(404, "Product not found");
    }

    const result = await sql`
        INSERT INTO reports (product_id, reporter_id, reason, message, status)
        VALUES (${productId}, ${reporterId}, ${reason}, ${sanitizedMessage || null}, 'pending')
        RETURNING *
    `;

    return res.status(201).json(
        new ApiResponse(201, result[0], "Report submitted successfully")
    );
});

/**
 * @desc    Get all reports (admin only)
 * @route   GET /api/reports
 * @access  Admin
 */
const getReports = asyncHandler(async (req, res) => {
    const { status } = req.query;

    let statusFilter = sql``;
    if (status && ['pending', 'resolved', 'dismissed'].includes(status)) {
        statusFilter = sql` AND r.status = ${status}`;
    }

    const reports = await sql`
        SELECT
            r.id,
            r.product_id,
            r.reason,
            r.message,
            r.status,
            r.created_at,
            p.title as product_title,
            p.image_url as product_image,
            u.username as reporter_name,
            u.email as reporter_email
        FROM reports r
        LEFT JOIN products p ON r.product_id = p.id
        LEFT JOIN users u ON r.reporter_id = u.id
        WHERE 1=1 ${statusFilter}
        ORDER BY r.created_at DESC
    `;

    return res.status(200).json(
        new ApiResponse(200, reports, "Reports fetched successfully")
    );
});

/**
 * @desc    Update report status (admin only)
 * @route   PATCH /api/reports/:id
 * @access  Admin
 */
const updateReportStatus = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !['pending', 'resolved', 'dismissed'].includes(status)) {
        throw new ApiError(400, "Invalid status. Must be 'pending', 'resolved', or 'dismissed'");
    }

    const result = await sql`
        UPDATE reports
        SET status = ${status}
        WHERE id = ${id}
        RETURNING *
    `;

    if (result.length === 0) {
        throw new ApiError(404, "Report not found");
    }

    return res.status(200).json(
        new ApiResponse(200, result[0], "Report status updated successfully")
    );
});

export {
    submitReport,
    getReports,
    updateReportStatus
};
