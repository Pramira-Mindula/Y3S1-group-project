import User from '../models/User.js';

// 1. Get all users (Admin)
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password').populate('myMentor', 'username mentorDetails');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 2. Verify a mentor (Admin)
export const verifyMentor = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id, 
            { 'mentorDetails.isVerified': true }, 
            { new: true }
        );
        res.json({ message: "Mentor verified", user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 3. Get all verified mentors (For users to select from)
export const getMentors = async (req, res) => {
    try {
        const mentors = await User.find({ role: 'mentor', 'mentorDetails.isVerified': true }).select('username mentorDetails');
        res.json(mentors);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// 4. Delete a user (Admin)
export const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Prevent deletion of admin accounts
        if (user.role === 'admin') {
            return res.status(403).json({ message: "Admin accounts cannot be deleted" });
        }

        await User.findByIdAndDelete(req.params.id);
        res.json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};