import express from 'express';
import { askChatbot } from '../controllers/chatController.js';
// Removed the { } because it's likely a default export
import { protect } from '../Middleware/authMiddleware.js';

const router = express.Router();

// If 'auth' is still undefined, check if your friend named it 'protect' or 'verifyToken'
router.post('/', protect, askChatbot);

export default router;