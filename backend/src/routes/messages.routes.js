import { Router } from "express";
const router = Router();

import { getChatMessagesByChatId } from "../controllers/messages.controllers.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

router.use(verifyJwt);

// Only history retrieval via REST — all writes go through Socket.IO
router.route("/:chatId").get(getChatMessagesByChatId);


export default router;