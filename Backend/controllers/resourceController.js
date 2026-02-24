import Resource from '../models/Resource.js';
import * as Brevo from '@getbrevo/brevo';

// --- (User) සියලුම Resources බැලීම ---
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

// --- (Admin) අලුත් Resource එකක් ඇතුළත් කිරීම ---
export const createResource = async (req, res) => {
    try {
        const { title, category, content, link } = req.body;
        const newResource = await Resource.create({ title, category, content, link });
        res.status(201).json(newResource);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// --- (Admin) Resource එකක් Update කිරීම ---
export const updateResource = async (req, res) => {
    try {
        const updatedResource = await Resource.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedResource);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// --- (Admin) Resource එකක් මකා දැමීම ---
export const deleteResource = async (req, res) => {
    try {
        await Resource.findByIdAndDelete(req.params.id);
        res.json({ message: "Resource deleted successfully" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// --- (Third-Party API) Resource එක Email එකට යැවීම ---
export const shareResourceViaEmail = async (req, res) => {
    try {
        const { resourceId, email } = req.body;
        
        // 1. Resource එක සොයා ගැනීම
        const resource = await Resource.findById(resourceId);
        if (!resource) return res.status(404).json({ message: "Resource not found" });

        // --- Brevo Fix Start ---
        // 1. API Client එක සකස් කිරීම
        const defaultClient = Brevo.ApiClient.instance;
        const apiKey = defaultClient.authentications['api-key'];
        apiKey.apiKey = process.env.BREVO_API_KEY; // .env එකේ Key එක ඇති බව සහතික කරගන්න

        // 2. Transactional Email Instance එක සෑදීම (Constructor Fix)
        const apiInstance = new Brevo.TransactionalEmailsApi();

        // 3. Email දත්ත සැකසීම
        const sendSmtpEmail = new Brevo.SendSmtpEmail();

        sendSmtpEmail.subject = `Shared Resource: ${resource.title}`;
        sendSmtpEmail.htmlContent = `
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
            </html>`;
        sendSmtpEmail.sender = { "name": "Safety App", "email": "saviduherath2003@gmail.com" };
        sendSmtpEmail.to = [{ "email": email }];

        // 4. Email එක යැවීම
        await apiInstance.sendTransacEmail(sendSmtpEmail);
        // --- Brevo Fix End ---

        res.json({ message: "Resource shared to your email successfully!" });
    } catch (error) {
        console.error("Brevo Detailed Error:", error);
        res.status(500).json({ message: "Failed to share resource", error: error.message });
    }
};