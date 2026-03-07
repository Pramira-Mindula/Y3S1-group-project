import Resource from '../models/Resource.js';
import { BrevoClient } from '@getbrevo/brevo';

// 1. Get Resources with filtering, searching, and pagination
export const getResources = async (req, res) => {
    try {
        const { category, search, page = 1, limit = 10 } = req.query; 
        
        const query = {};
        if (category) query.category = category; 
        if (search) query.title = { $regex: search, $options: 'i' }; 

        const resources = await Resource.find(query)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

        const count = await Resource.countDocuments(query);

        res.json({
            resources,
            totalPages: Math.ceil(count / limit),
            currentPage: page
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// --- (Admin) Entering a new Resource ---
export const createResource = async (req, res) => {
    try {
        const { title, category, content, link } = req.body;
        const newResource = await Resource.create({ title, category, content, link });
        res.status(201).json(newResource);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// --- (Admin) Updateing a Resource ---
export const updateResource = async (req, res) => {
    try {
        const updatedResource = await Resource.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedResource);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// --- (Admin) Deleting a Resource ---
export const deleteResource = async (req, res) => {
    try {
        await Resource.findByIdAndDelete(req.params.id);
        res.json({ message: "Resource deleted successfully" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// --- Sharing a Resource via Email ---
export const shareResourceViaEmail = async (req, res) => {
    try {
        const { resourceId, email } = req.body;
        if (!resourceId || !email) {
            return res.status(400).json({ message: "resourceId and email are required" });
        }
        
        // 1. Find the resource by ID
        const resource = await Resource.findById(resourceId);
        if (!resource) return res.status(404).json({ message: "Resource not found" });

        // --- Brevo Fix Start ---
        const apiKey = process.env.BREVO_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ message: "BREVO_API_KEY is not set" });
        }

        const brevo = new BrevoClient({ apiKey });

        await brevo.transactionalEmails.sendTransacEmail({
            subject: `Shared Resource: ${resource.title}`,
            htmlContent: `
                <html>
                    <body style="font-family: Arial, sans-serif;">
                        <h2 style="color: #2c3e50;">${resource.title}</h2>
                        <p><b>Category:</b> ${resource.category}</p>
                        <div style="padding: 15px; background: #f9f9f9; border-left: 4px solid #3498db;">
                            ${resource.content}
                        </div>
                        <br>
                        ${resource.link ? `<a href="${resource.link}" style="padding: 10px 20px; background: #3498db; color: white; text-decoration: none; border-radius: 5px;">View Full Resource</a>` : ''}
                        <hr>
                        <p style="font-size: 12px; color: #7f8c8d;">Sent via Safety App Resources Management</p>
                    </body>
                </html>`,
            sender: { name: "Safety App", email: "saviduherath2003@gmail.com" },
            to: [{ email }],
        });
        // --- Brevo Fix End ---

        res.json({ message: "Resource shared to your email successfully!" });
    } catch (error) {
        console.error("Brevo Detailed Error:", error);
        res.status(500).json({ message: "Failed to share resource", error: error.message });
    }
};