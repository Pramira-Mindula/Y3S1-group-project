import express from 'express';
import { 
    createAppointment, 
    getMyAppointments, 
    updateAppointmentStatus, 
    deleteAppointment 
} from '../controllers/appointmentController.js';
import { protect } from '../Middleware/authMiddleware.js';

const router = express.Router();

// සියලුම routes සඳහා ලොග් වීම අනිවාර්යයි
router.use(protect);

router.post('/', createAppointment);
router.get('/', getMyAppointments);
router.patch('/:id', updateAppointmentStatus);
router.delete('/:id', deleteAppointment);

export default router;