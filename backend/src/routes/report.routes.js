import { Router } from "express";
import {
    submitReport,
    getReports,
    updateReportStatus
} from "../controllers/report.controllers.js";
import { verifyJwt, isAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

// Submit a report (authenticated users)
router.route("/").post(verifyJwt, submitReport);

// Get all reports (admin only)
router.route("/").get(verifyJwt, isAdmin, getReports);

// Update report status (admin only)
router.route("/:id").patch(verifyJwt, isAdmin, updateReportStatus);

export default router;
