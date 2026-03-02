import Resource from '../models/Resource.js';

// --- (User) සියලුම Resources බැලීම, Filtering සහ Pagination සමඟ ---
export const getResources = async (req, res) => {
    try {
        const { category, search, page = 1, limit = 10 } = req.query; // Pagination & Filtering 
        
        const query = {};
        if (category) query.category = category; // Category filter [cite: 39, 50]
        if (search) query.title = { $regex: search, $options: 'i' }; // Search logic [cite: 39]

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