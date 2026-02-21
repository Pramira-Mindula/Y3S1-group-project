import express from 'express';
import { createReport, getAllReports, resolveReport } from '../controllers/reportController.js';
import { getWomenSafetyNews } from '../controllers/externalController.js';
import { protect } from '../Middleware/authMiddleware.js';
import { admin } from '../Middleware/adminMiddleware.js';

const router = express.Router();

// Reporting
router.post('/report', protect, createReport); // ඕනෑම User කෙනෙකුට පුළුවන්
router.get('/reports', protect, admin, getAllReports); // Admin පමණයි
router.put('/reports/:id', protect, admin, resolveReport); // Admin පමණයි

// External API
router.get('/news', getWomenSafetyNews); // Public

export default router;