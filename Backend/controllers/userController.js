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