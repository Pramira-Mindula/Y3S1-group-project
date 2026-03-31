import express from 'express';
import { register, login, selectMentor, forgotPassword, resetPassword,deleteUser,getAllUsers, verifyMentor, getMentors, getMyProfile, updateMyProfile } from '../controllers/authController.js';
import { protect } from '../Middleware/authMiddleware.js';
import { admin } from '../Middleware/adminMiddleware.js';


const router = express.Router();

// Public Routes
router.post('/register', register);
router.post('/login', login);
router.get('/mentors', getMentors); 

router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Protected Routes (Logged in users only)
router.post('/select-mentor', protect, selectMentor); 
router.get('/profile', protect, getMyProfile);
router.put('/profile', protect, updateMyProfile);

// Admin Routes
router.get('/users', protect, admin, getAllUsers);
router.put('/verify-mentor/:id', protect, admin, verifyMentor);
router.delete('/user/:id', protect, admin, deleteUser);

export default router;