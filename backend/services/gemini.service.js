import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const generateContent = async (title, subtitle, prompt) => {
  try {

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const finalPrompt = `
Write a high-quality social media post.

Title: ${title}
Subtitle: ${subtitle || "N/A"}
Prompt: ${prompt || "None"}

Instructions:
- First line: Title
- Second line: Subtitle
- Then detailed engaging content
- Keep it clean and readable
`;

    const result = await model.generateContent(finalPrompt);

    const text = result.response.text();

    // console.log("✅ AI RESPONSE:", text);

    return text;

  } catch (error) {
    console.error("🔥 FULL ERROR:", error.response?.data || error.message);
    throw new Error("AI failed");
  }
};