import express from 'express';
import { register, login, selectMentor, forgotPassword, resetPassword } from '../controllers/authController.js';
import { getAllUsers, verifyMentor, getMentors } from '../controllers/userController.js';
import { protect } from '../Middleware/authMiddleware.js';
import { admin } from '../Middleware/adminMiddleware.js';
import { deleteUser } from '../controllers/userController.js';

const router = express.Router();

// Public Routes
router.post('/register', register);
router.post('/login', login);
router.get('/mentors', getMentors); 
router.delete('/user/:id', protect, admin, deleteUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Protected Routes (Logged in users only)
router.post('/select-mentor', protect, selectMentor); 

// Admin Routes
router.get('/users', protect, admin, getAllUsers);
router.put('/verify-mentor/:id', protect, admin, verifyMentor);

export default router;