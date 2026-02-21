import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// 1. Register
export const register = async (req, res) => {
    try {
        const { username, email, password, role, expertise, bio } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            username,
            email,
            password: hashedPassword,
            role: role || 'user',
            mentorDetails: role === 'mentor' ? { expertise, bio } : {}
        });

        res.status(201).json({ message: "User registered successfully!" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 2. Login
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
            res.json({ token, user: { id: user._id, username: user.username, role: user.role } });
        } else {
            res.status(401).json({ message: "Invalid credentials" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 3. User සහ Mentor සම්බන්ධ කිරීම (Assign Mentor)
export const selectMentor = async (req, res) => {
    try {
        const { mentorId } = req.body;
        const user = await User.findById(req.user.id);
        
        const mentor = await User.findOne({ _id: mentorId, role: 'mentor', 'mentorDetails.isVerified': true });
        if (!mentor) return res.status(404).json({ message: "Verified Mentor not found" });

        user.myMentor = mentorId;
        await user.save();
        res.json({ message: "Mentor selected successfully!" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};