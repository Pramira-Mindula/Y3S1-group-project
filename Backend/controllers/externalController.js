import axios from 'axios';

export const getWomenSafetyNews = async (req, res) => {
    try {
        const API_KEY = process.env.NEWS_API_KEY; // .env එකේ NEWS_API_KEY එක දාන්න
        const url = `https://newsapi.org/v2/everything?q=women+safety+sri+lanka&apiKey=${API_KEY}`;
        
        const response = await axios.get(url);
        res.json(response.data.articles);
    } catch (error) {
        res.status(500).json({ message: "Error fetching news from external API" });
    }
};