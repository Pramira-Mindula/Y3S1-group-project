import Report from '../models/Report.js';

//Report a post
export const createReport = async (req, res) => {
    try {
        const { postId, reason } = req.body;
        const reportedBy = req.user.id; //Assuming req.user is set by auth middleware and contains the user's ID

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

//Get all reports (Admin)
export const getAllReports = async (req, res) => {
    try {
        const reports = await Report.find().populate('postId').populate('reportedBy', 'username email');
        res.json(reports);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//Update report status (Admin)
export const resolveReport = async (req, res) => {
    try {
        const { status } = req.body;

        // Validate status
        const allowedStatus = ['Pending', 'Resolved', 'Dismissed'];

        if (!allowedStatus.includes(status)) {
            return res.status(400).json({
                message: 'Invalid status. Must be Pending, Resolved, or Dismissed.'
            });
        }

        const report = await Report.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        if (!report) {
            return res.status(404).json({ message: 'Report not found' });
        }

        res.json({
            message: `Report marked as ${report.status}`,
            report
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//Delete Report
export const deleteReport = async (req, res) => {
    try {
        const report = await Report.findByIdAndDelete(req.params.id);

        if (!report) {
            return res.status(404).json({ message: 'Report not found' });
        }

        res.json({ message: 'Report deleted successfully', report });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};