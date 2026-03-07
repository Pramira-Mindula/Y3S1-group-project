import Report from '../models/Report.js';

//  1. Report a post
export const createReport = async (req, res) => {
    try {
        const { postId, reason } = req.body;
        const reportedBy = req.user.id; // Assuming req.user is set by auth middleware and contains the user's ID

        // Check if the user has already reported this post

        const newReport = await Report.create({ postId, reportedBy, reason });
        res.status(201).json({ message: "Post reported successfully", newReport });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: "You have already reported this post." });
        }
        res.status(500).json({ message: error.message });
    }
};

// 2. Get all reports (Admin)
export const getAllReports = async (req, res) => {
    try {
        const reports = await Report.find().populate('postId').populate('reportedBy', 'username email');
        res.json(reports);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 3. Resolve or Dismiss a report (Admin)
export const resolveReport = async (req, res) => {
    try {
        const { status } = req.body; // 'Resolved' or 'Dismissed'
        const report = await Report.findByIdAndUpdate(req.params.id, { status }, { new: true });
        res.json({ message: `Report marked as ${status}`, report });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};