import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import * as Brevo from '@getbrevo/brevo';
import nodemailer from 'nodemailer';

// ---------------------------------------------------------
// 1. පරිශීලක ලියාපදිංචිය (Register)
// ---------------------------------------------------------
export const register = async (req, res) => {
    try {
        const { username, email, password, role, expertise, bio } = req.body;
        
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            username,
            email,
            password: hashedPassword,
            role: role || 'user',
            mentorDetails: role === 'mentor' ? { expertise, bio, isVerified: false } : {}
        });

        res.status(201).json({ message: "User registered successfully!" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ---------------------------------------------------------
// 2. ඇතුළුවීම (Login)
// ---------------------------------------------------------
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            const token = jwt.sign(
                { id: user._id, role: user.role }, 
                process.env.JWT_SECRET, 
                { expiresIn: '1d' }
            );
            res.json({ 
                token, 
                user: { id: user._id, username: user.username, role: user.role } 
            });
        } else {
            res.status(401).json({ message: "Invalid credentials" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ---------------------------------------------------------
// 3. මෙන්ටර් කෙනෙකු තෝරාගැනීම
// ---------------------------------------------------------
export const selectMentor = async (req, res) => {
    try {
        const { mentorId } = req.body;
        const user = await User.findById(req.user.id);
        
        const mentor = await User.findOne({ 
            _id: mentorId, 
            role: 'mentor', 
            'mentorDetails.isVerified': true 
        });

        if (!mentor) return res.status(404).json({ message: "Verified Mentor not found" });

        user.myMentor = mentorId;
        await user.save();
        res.json({ message: "Mentor selected successfully!" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ---------------------------------------------------------
// 4. මුරපදය අමතක වූ විට OTP යැවීම (Forgot Password)
// ---------------------------------------------------------
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(404).json({ message: "User not found" });

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.resetOTP = otp;
        user.resetOTPExpiry = Date.now() + 10 * 60 * 1000;
        await user.save();

        // --- Brevo API Integration ---
        const brevoApiKey = process.env.BREVO_API_KEY;

        if (!brevoApiKey) {
            return res.status(500).json({ message: "Email service not configured" });
        }

        let sendBrevoEmail;

        // v4+ SDK (BrevoClient)
        if (Brevo.BrevoClient) {
            const brevoClient = new Brevo.BrevoClient({ apiKey: brevoApiKey });
            sendBrevoEmail = (payload) => brevoClient.transactionalEmails.sendTransacEmail(payload);
        }
        // v3 SDK (TransactionalEmailsApi with authentications)
        else if (Brevo.TransactionalEmailsApi) {
            const apiInstance = new Brevo.TransactionalEmailsApi();
            const apiKeyAuth =
                apiInstance.authentications?.['apiKey'] ||
                apiInstance.authentications?.['api-key'];

            if (!apiKeyAuth) {
                throw new Error("Brevo API key authentication configuration missing");
            }

            // මෙතන අනිවාර්යයෙන්ම 'xkeysib-' වලින් පටන් ගන්නා API Key එක තිබිය යුතුයි
            apiKeyAuth.apiKey = brevoApiKey;
            sendBrevoEmail = (payload) => apiInstance.sendTransacEmail(payload);
        } else {
            throw new Error("Unsupported Brevo SDK version in '@getbrevo/brevo'");
        }

        // Email දත්ත
        const sendSmtpEmail = {
            sender: { name: "Safety App", email: "saviduherath2003@gmail.com" },
            to: [{ email: user.email }],
            subject: "Your Password Reset OTP",
            htmlContent: `<html><body><h3>Your OTP is: <b>${otp}</b></h3></body></html>`
        };

        // Email එක යැවීම
        await sendBrevoEmail(sendSmtpEmail);
        
        res.json({ message: "OTP sent successfully via Brevo API!" });

    } catch (error) {
        console.error("Brevo Error Detail:", error);
        res.status(500).json({ message: "Error sending email", error: error.message });
    }
};
// ---------------------------------------------------------
// 5. මුරපදය අලුත් කිරීම (Reset Password)
// ---------------------------------------------------------
export const resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;
        
        const user = await User.findOne({ 
            email, 
            resetOTP: otp, 
            resetOTPExpiry: { $gt: Date.now() } 
        });

        if (!user) return res.status(400).json({ message: "Invalid or expired OTP" });

        user.password = await bcrypt.hash(newPassword, 10);
        user.resetOTP = undefined;
        user.resetOTPExpiry = undefined;
        await user.save();

        res.json({ message: "Password reset successful! You can now login." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};