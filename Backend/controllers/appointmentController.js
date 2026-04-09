import Appointment from '../models/Appointment.js';
import User from '../models/User.js';

// 1. CREATE: Book an Appointment
export const createAppointment = async (req, res) => {
    try {
        const { mentorId, date, reason } = req.body;
        const userId = req.user.id;

        // Mentor creates an open availability slot from Mentor Dashboard
        if (req.user.role === 'mentor') {
            const newSlot = await Appointment.create({
                userId,
                mentorId: userId,
                date,
                reason: reason || 'Available for mentoring session',
                status: 'Available'
            });

            return res.status(201).json(newSlot);
        }

        const mentor = await User.findById(mentorId);
        if (!mentor || mentor.role !== 'mentor') {
            return res.status(404).json({ message: "Mentor not found" });
        }

        if (!reason) {
            return res.status(400).json({ message: "Please provide a reason for the appointment" });
        }

        const newAppointment = await Appointment.create({
            userId,
            mentorId,
            date,
            reason,
            status: 'Booked'
        });

        res.status(201).json(newAppointment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// 2. READ: Get My Appointments
export const getMyAppointments = async (req, res) => {
    try {
        const query = req.user.role === 'mentor' 
            ? { mentorId: req.user.id } 
            : { userId: req.user.id };

        const appointments = await Appointment.find(query)
            .populate('userId', 'username email')
            .populate('mentorId', 'username email');

        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 3. UPDATE: Update Status & Send Email (Third-party API)
export const updateAppointmentStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const appointment = await Appointment.findByIdAndUpdate(id, { status }, { new: true })
            .populate('userId', 'email username');

        if (!appointment) return res.status(404).json({ message: "Appointment not found" });

        // Email sending via Brevo is temporarily disabled due to SDK compatibility issues.
        // Status will still be updated in the database and returned in the response.

        res.json({ message: `Status updated to ${status}`, appointment });
    } catch (error) {
        console.error("Brevo Error Detail:", error);
       
        res.status(500).json({ 
            message: "Database updated, but email sending failed", 
            error: error.message 
        });
    }
};

// 4. DELETE: Cancel Appointment
export const deleteAppointment = async (req, res) => {
    try {
        await Appointment.findByIdAndDelete(req.params.id);
        res.json({ message: "Appointment cancelled successfully" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// READ: Get Available Slots for a specific Mentor (Public/Mentee access)
export const getAvailableSlotsForMentor = async (req, res) => {
    try {
        const { mentorId } = req.params;
        // Find appointments for this mentor where status is exactly 'Available'
        const slots = await Appointment.find({ mentorId, status: 'Available' })
            .sort({ date: 1 }); // Sort by date ascending

        res.json(slots);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// UPDATE: Book an existing available slot
export const bookAvailableSlot = async (req, res) => {
    try {
        const { id } = req.params;
        const { reason } = req.body;

        const slot = await Appointment.findById(id);
        if (!slot) {
            return res.status(404).json({ message: 'Slot not found' });
        }

        if (slot.status !== 'Available') {
            return res.status(400).json({ message: 'This slot is no longer available' });
        }

        slot.userId = req.user.id;
        slot.reason = reason || 'Mentorship session';
        slot.status = 'Booked';

        const updatedSlot = await slot.save();
        return res.json(updatedSlot);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Get all appointments for a logged-in Mentee
export const getMyBookedSessions = async (req, res) => {
    try {
        const sessions = await Appointment.find({ userId: req.user.id })
            // 👇 This is the magic! It pulls the mentor's name and meeting link into the appointment data
            .populate('mentorId', 'username mentorDetails.meetingLink')
            .sort({ date: 1 });

        res.json(sessions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};