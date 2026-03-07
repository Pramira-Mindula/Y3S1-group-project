import express from 'express';
import { createPost, getPosts, addComment,deletePost,updatePost } from '../controllers/postController.js';
import { protect } from '../Middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createPost);      
router.get('/', getPosts);                 
router.put('/:id', protect, updatePost);
router.delete('/:id', protect, deletePost);
router.post('/:id/comment', protect, addComment); 

export default router;