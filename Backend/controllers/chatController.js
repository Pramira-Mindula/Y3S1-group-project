import { GoogleGenerativeAI } from "@google/generative-ai";

export const askChatbot = async (req, res) => {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// Change "gemini-1.5-flash" to "gemini-2.0-flash"
   const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  try {
    const prompt = req.body.message;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({ reply: text });
  } catch (error) {
    console.error("Gemini Error:", error);
    res.status(500).json({ error: "AI is unavailable" });
  }
};