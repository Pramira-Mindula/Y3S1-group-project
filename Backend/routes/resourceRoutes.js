import express from 'express';
import { getResources, createResource, updateResource, deleteResource,shareResourceViaEmail } from '../controllers/resourceController.js';
import { protect } from '../Middleware/authMiddleware.js';
import { admin } from '../Middleware/adminMiddleware.js';

const router = express.Router();

router.get('/', getResources); // ඕනෑම කෙනෙකුට බැලිය හැක [cite: 38]
router.post('/', protect, admin, createResource); // Admin පමණි [cite: 42, 45]
router.put('/:id', protect, admin, updateResource); // Admin පමණි [cite: 43]
router.delete('/:id', protect, admin, deleteResource); // Admin පමණි [cite: 44]

// Third-party API Route
router.post('/share', shareResourceViaEmail);

export default router;