import { Router } from "express";
import {
    submitFeedback,
    getAllFeedback,
    updateFeedbackStatus,
    deleteFeedback
} from "../controllers/feedback.controllers.js";

const router = Router();

// POST /api/feedback - Submit feedback (public)
router.post("/", submitFeedback);

// GET /api/feedback - Get all feedback (can be restricted to admin later)
router.get("/", getAllFeedback);

// PATCH /api/feedback/:id - Update feedback status
router.patch("/:id", updateFeedbackStatus);

// DELETE /api/feedback/:id - Delete feedback
router.delete("/:id", deleteFeedback);

export default router;
