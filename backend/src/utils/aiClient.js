import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = process.env.GEMINI_API_KEY
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

export const getAIModel = () => {
  if (!genAI) return null;
  return genAI.getGenerativeModel({ model: "gemma-3-1b-it" });
};

export default genAI;
