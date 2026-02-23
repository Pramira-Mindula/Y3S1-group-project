import express from 'express';
import { createPost, getPosts, addComment } from '../controllers/postController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createPost);      // පෝස්ට් එකක් දැමීම
router.get('/', getPosts);                 // සියලුම පෝස්ට් බැලීම
router.post('/:id/comment', protect, addComment); // කොමෙන්ට් එකක් දැමීම

export default router;