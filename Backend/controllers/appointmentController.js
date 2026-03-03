import Appointment from '../models/Appointment.js';
import User from '../models/User.js';

// 1. CREATE: Book an Appointment
export const createAppointment = async (req, res) => {
    try {
        const { mentorId, date, reason } = req.body;
        const userId = req.user.id; 

        const mentor = await User.findById(mentorId);
        if (!mentor || mentor.role !== 'mentor') {
            return res.status(404).json({ message: "Mentor not found" });
        }

        const newAppointment = await Appointment.create({
            userId, mentorId, date, reason
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
        // මෙතැනදී error එක ආවත් status එක update වුණ බව පෙන්වනවා
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