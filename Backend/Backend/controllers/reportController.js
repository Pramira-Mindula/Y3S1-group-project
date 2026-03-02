import Report from '../models/Report.js';

// --- (User) Post එකක් Report කිරීම ---
export const createReport = async (req, res) => {
    try {
        const { postId, reason } = req.body;
        const reportedBy = req.user.id; // authMiddleware එකෙන් එන ID එක

        const newReport = await Report.create({ postId, reportedBy, reason });
        res.status(201).json({ message: "Post reported successfully", newReport });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: "You have already reported this post." });
        }
        res.status(500).json({ message: error.message });
    }
};

// --- (Admin) සියලුම Reports බැලීම ---
export const getAllReports = async (req, res) => {
    try {
        const reports = await Report.find().populate('postId').populate('reportedBy', 'username email');
        res.json(reports);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// --- (Admin) Report එකක් Resolve කිරීම ---
export const resolveReport = async (req, res) => {
    try {
        const { status } = req.body; // 'Resolved' or 'Dismissed'
        const report = await Report.findByIdAndUpdate(req.params.id, { status }, { new: true });
        res.json({ message: `Report marked as ${status}`, report });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};