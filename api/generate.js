import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {
    const { platform, topic } = req.body;

    const prompt = `
You are an expert AI Prompt Engineer.

Create one professional prompt for ${platform}.

User Idea:
${topic}

If the user's idea is written in Urdu, Hindi or Roman Urdu,
first understand it, then convert it into a detailed
professional English AI prompt.

Return ONLY the prompt.
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });

    res.status(200).json({
      result: response.text,
    });

  } catch (error) {
  console.error(error);

  return res.status(500).json({
    error: error.message,
    stack: error.stack
  });
}
}