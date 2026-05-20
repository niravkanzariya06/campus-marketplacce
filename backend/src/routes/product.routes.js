import { Router } from "express";
import {
    createProduct,
    getProducts,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    approveProduct,
    rejectProduct,
    getPendingProducts,
    getApprovedProducts,
    getRejectedProducts,
    getMyProducts
} from "../controllers/product.controllers.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJwt, isAdmin } from "../middlewares/auth.middleware.js";


const router = Router();

// ============================================
// ADMIN ROUTES (must be before /:id to avoid conflicts)
// ============================================

router.route("/pending").get(verifyJwt, isAdmin, getPendingProducts);
router.route("/approved").get(verifyJwt, isAdmin, getApprovedProducts);
router.route("/rejected").get(verifyJwt, isAdmin, getRejectedProducts);
router.route("/all-products").get(verifyJwt, isAdmin, getAllProducts);
router.route("/:id/approve").patch(verifyJwt, isAdmin, approveProduct);
router.route("/:id/reject").patch(verifyJwt, isAdmin, rejectProduct);

// ============================================
// USER ROUTES
// ============================================

router.route("/sell-product").post(
    verifyJwt,
    upload.fields([{ name: "productImage", maxCount: 1 }]),
    createProduct
);
router.route("/").get(getProducts);
// Get current user's products (all statuses)
router.route("/my").get(verifyJwt, getMyProducts);
router.route("/:id").patch(
    verifyJwt,
    upload.fields([{ name: "productImage", maxCount: 1 }]),
    updateProduct
);
router.route("/:id")
    .delete(verifyJwt, deleteProduct)
    .get(getProductById);




export default router;