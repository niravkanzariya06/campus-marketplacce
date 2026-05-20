import { Router } from "express";
import {
    getUserChats,
    createChat,
    deleteChat
} from "../controllers/chats.controllers.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJwt);

router.route("/")
    .get(getUserChats)
    .post(createChat);

router.route("/:chatId").delete(deleteChat);

export default router;