import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
    try {
        const { username, email, password, role, expertise, bio } = req.body;

        // Validation: Password දිග පරීක්ෂාව 
        if (password.length < 6) return res.status(400).json({ message: "Password must be at least 6 characters" });

        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10); // Password Hashing [cite: 14]

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

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' }); // JWT Token 
            res.json({ token, user: { id: user._id, username: user.username, role: user.role } });
        } else {
            res.status(401).json({ message: "Invalid email or password" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};