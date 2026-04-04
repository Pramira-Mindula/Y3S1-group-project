import express from 'express';
import { 
    createAppointment, 
    getMyAppointments, 
    updateAppointmentStatus, 
    deleteAppointment,
    getAvailableSlotsForMentor,
    bookAvailableSlot,
    getMyBookedSessions
} from '../controllers/appointmentController.js';
import { protect } from '../Middleware/authMiddleware.js';

const router = express.Router();


router.use(protect);

router.post('/', createAppointment);
router.get('/', getMyAppointments);
router.get('/my-sessions', getMyBookedSessions);
router.patch('/:id', updateAppointmentStatus);
router.delete('/:id', deleteAppointment);

// Add this route ABOVE your /:id routes so it doesn't get confused
router.get('/available/:mentorId', protect, getAvailableSlotsForMentor);

// The patch route from the previous step for booking
router.patch('/:id/book', protect, bookAvailableSlot);
export default router;