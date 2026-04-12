import axios from 'axios';

export const getWomenSafetyNews = async (req, res) => {
    try {
        const API_KEY = process.env.NEWS_API_KEY; // Ensure you have this in your .env file
        const url = `https://newsapi.org/v2/everything?q=women+safety&apiKey=${API_KEY}`;
        
        const response = await axios.get(url);
        res.json(response.data.articles);
    } catch (error) {
        res.status(500).json({ message: "Error fetching news from external API" });
    }
};