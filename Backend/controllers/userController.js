import User from '../models/User.js';

// 1. සියලුම පාවිච්චි කරන්නන් බැලීම (Admin Only)
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password').populate('myMentor', 'username mentorDetails');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 2. Mentor කෙනෙක්ව Verify කිරීම (Admin Only)
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

// 3. පද්ධතියේ සිටින සියලුම Verified Mentors පෙන්වීම (Public/User)
export const getMentors = async (req, res) => {
    try {
        const mentors = await User.find({ role: 'mentor', 'mentorDetails.isVerified': true }).select('username mentorDetails');
        res.json(mentors);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// User කෙනෙක් හෝ Mentor කෙනෙක්ව පද්ධතියෙන් ඉවත් කිරීම (Admin Only)
export const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Admin කෙනෙක්ට තවත් Admin කෙනෙක්ව Delete කරන්න බැරි වෙන්න මේ logic එක දාන්න පුළුවන් (Optional)
        if (user.role === 'admin') {
            return res.status(403).json({ message: "Admin accounts cannot be deleted" });
        }

        await User.findByIdAndDelete(req.params.id);
        res.json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};