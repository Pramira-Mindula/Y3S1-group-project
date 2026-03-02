import express from 'express';
import { register, login } from '../controllers/authController.js';
import { getAllUsers, verifyMentor } from '../controllers/userController.js';
import { protect } from '../Middleware/authMiddleware.js';
import { admin } from '../Middleware/adminMiddleware.js';

const router = express.Router();

router.post('/register', register); // Public
router.post('/login', login);       // Public

// Admin පමණක් කළ හැකි දේ [cite: 8]
router.get('/users', protect, admin, getAllUsers);
router.put('/verify/:id', protect, admin, verifyMentor);

export default router;