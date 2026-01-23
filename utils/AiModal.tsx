import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.NEXT_PUBLIC_GOOGLE_GEMINI_API_KEY;
const genAI = new GoogleGenAI({ apiKey });

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

async function run(prompt: string) {
  // 1. Safety Check: Ensure prompt exists
  if (!prompt) return "Error: Prompt is empty";

  try {
    const chatSession = genAI.chats.create({
      model: "gemini-2.5-flash",
      config: generationConfig,
      history: [],
    });

    // 2. FIXED: Pass the prompt inside the 'message' object
    const result = await chatSession.sendMessage({
      message: prompt,
    });

    // 3. Return text (accessed as a property)
    console.log(result.text);
    return result.text;

  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Something went wrong with the AI request.";
  }
}

export default run;