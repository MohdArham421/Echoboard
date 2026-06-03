import { generateContent } from "../services/gemini.service.js";

export const generatePost = async (req, res) => {
  try {
    const { title, subtitle, prompt } = req.body;

    const content = await generateContent(title, subtitle, prompt);

    res.json({ content });
  } catch (error) {
    console.error("AI ERROR:", error.message);

    res.status(500).json({
      message: error.message || "AI failed",
    });
  }
};