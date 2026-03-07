import express from 'express';
import { getResources, createResource, updateResource, deleteResource,shareResourceViaEmail } from '../controllers/resourceController.js';
import { protect } from '../Middleware/authMiddleware.js';
import { admin } from '../Middleware/adminMiddleware.js';

const router = express.Router();

router.get('/', getResources); 
router.post('/', protect, admin, createResource); 
router.put('/:id', protect, admin, updateResource); 
router.delete('/:id', protect, admin, deleteResource); 

// Third-party API Route
router.post('/share', shareResourceViaEmail);

export default router;