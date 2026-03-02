import User from '../models/User.js';

// Admin හට සියලුම Users බැලීමට [cite: 9]
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Mentor කෙනෙක්ව Verify කිරීමට (Admin Only) [cite: 11]
export const verifyMentor = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user && user.role === 'mentor') {
            user.mentorDetails.isVerified = true;
            await user.save();
            res.json({ message: "Mentor verified successfully" });
        } else {
            res.status(404).json({ message: "Mentor not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};