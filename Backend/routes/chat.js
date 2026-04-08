import express from "express";
import { askChatbot } from "../controllers/chatController.js";

const router = express.Router();

// Public route – no authentication
router.post("/", askChatbot);

export default router;