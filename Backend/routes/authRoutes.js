import express from 'express';
import { register, login, selectMentor } from '../controllers/authController.js';
import { getAllUsers, verifyMentor, getMentors } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import { admin } from '../middleware/adminMiddleware.js';

const router = express.Router();

// Public Routes
router.post('/register', register);
router.post('/login', login);
router.get('/mentors', getMentors); // සියලුම මෙන්ටර්ලා බැලීමට

// Protected Routes (Logged in users only)
router.post('/select-mentor', protect, selectMentor); // මෙන්ටර් කෙනෙක් තෝරාගැනීමට

// Admin Routes
router.get('/users', protect, admin, getAllUsers);
router.put('/verify-mentor/:id', protect, admin, verifyMentor);

export default router;