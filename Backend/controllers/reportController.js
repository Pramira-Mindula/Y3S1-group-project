import Report from '../models/Report.js';
import Post from '../models/Post.js';
import { BrevoClient } from '@getbrevo/brevo';

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

// Get report by ID (Admin)
export const getReportById = async (req, res) => {
    try {
        const { id } = req.params;

        const report = await Report.findById(id)
            .populate('postId')
            .populate('reportedBy', 'username email')
            .populate('actionBy', 'username email');

        if (!report) {
            return res.status(404).json({ message: "Report not found" });
        }

        res.json(report);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update report status (Admin)
export const resolveReport = async (req, res) => {
    try {
        const { status, actionComment } = req.body;

        // Validate status
        const allowedStatus = ['Pending', 'Resolved', 'Dismissed'];

        if (!allowedStatus.includes(status)) {
            return res.status(400).json({
                message: 'Invalid status. Must be Pending, Resolved, or Dismissed.'
            });
        }

        // Optional: require comment when resolving/dismissing
        if ((status === 'Resolved' || status === 'Dismissed') && !actionComment) {
            return res.status(400).json({
                message: 'Action comment is required when resolving or dismissing a report.'
            });
        }

        const existingReport = await Report.findById(req.params.id);

        if (!existingReport) {
            return res.status(404).json({ message: 'Report not found' });
        }

        const previousStatus = existingReport.status;

        const updatedData = {
            status,
            actionComment,
            actionBy: req.user.id
        };

        const report = await Report.findByIdAndUpdate(
            req.params.id,
            updatedData,
            { new: true }
        )
        .populate('postId')
        .populate('reportedBy', 'username email')
        .populate('actionBy', 'username email');

        const becameResolved = previousStatus !== 'Resolved' && report.status === 'Resolved';

        if (becameResolved) {
            try {
                const postWithOwner = await Post.findById(report.postId?._id || report.postId)
                    .populate('user', 'email username');

                const ownerEmail = postWithOwner?.user?.email;
                const ownerName = postWithOwner?.user?.username || 'User';

                if (ownerEmail && process.env.BREVO_API_KEY) {
                    const brevo = new BrevoClient({ apiKey: process.env.BREVO_API_KEY });
                    await brevo.transactionalEmails.sendTransacEmail({
                        sender: { name: "Safety App", email: "saviduherath2003@gmail.com" },
                        to: [{ email: ownerEmail }],
                        subject: "Your community post was removed after report review",
                        htmlContent: `
                            <html>
                                <body style="font-family: Arial, sans-serif;">
                                    <h3>Hello ${ownerName},</h3>
                                    <p>Your post titled <b>${report.postId?.title || 'Untitled Post'}</b> was reviewed by the admin team and marked as resolved.</p>
                                    <p>Because of this, the post is no longer visible in the community feed.</p>
                                    <p><b>Admin note:</b> ${actionComment}</p>
                                    <hr />
                                    <p style="font-size: 12px; color: #64748b;">Safety App moderation notice</p>
                                </body>
                            </html>
                        `
                    });
                }
            } catch (emailError) {
                console.error('Failed to send resolved-report email:', emailError.message);
            }
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