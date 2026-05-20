import { Router } from "express";
import {
    addToFavorites,
    removeFromFavorites,
    getFavorites
} from "../controllers/favorite.controllers.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/").get(verifyJwt, getFavorites);

router.route("/:productId")
    .post(verifyJwt, addToFavorites)
    .delete(verifyJwt, removeFromFavorites);

export default router;