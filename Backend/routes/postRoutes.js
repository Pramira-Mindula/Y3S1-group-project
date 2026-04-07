import express from 'express';
import { createPost, getPosts, addComment,deletePost,updatePost,getPostsByUser} from '../controllers/postController.js';
import { protect } from '../Middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createPost);      
router.get('/', getPosts); 
  // Get all posts by a specific user
router.get('/user/:userId', protect, getPostsByUser);          
router.put('/:id', protect, updatePost);
router.delete('/:id', protect, deletePost);
router.post('/:id/comment', protect, addComment); 


export default router;