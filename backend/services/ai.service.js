import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize with your key from .env
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// This name MUST match your import statement exactly
export const getAICaptionSuggestions = async (prompt) => {
  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error in AI Service:", error);
    throw error;
  }
};