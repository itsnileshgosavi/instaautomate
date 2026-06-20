import { GoogleGenerativeAI } from "@google/generative-ai";
import Groq from "groq-sdk";

/**
 * Generate an AI-powered reply using Google Gemini with Groq as fallback.
 * If both APIs fail or their keys are missing, returns null (no reply sent).
 *
 * @param userMessage The incoming user message or comment text.
 * @param context     Optional persona / system instruction.
 */
export async function generateAiResponse(
  userMessage: string,
  context?: string,
): Promise<string | null> {
  const persona =
    context?.trim() ||
    "You are a helpful Instagram assistant for a business account. Keep responses short, friendly and on-brand.";

  // ── 1. Google Gemini (gemini-2.0-flash-lite — cheapest & fastest free tier) ──
  const geminiKey = process.env.GOOGLE_GEMINI_API_KEY;
  if (geminiKey) {
    try {
      const genAI = new GoogleGenerativeAI(geminiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });
      const generation = await model.generateContent({
        systemInstruction: { role: "system", parts: [{ text: persona }] },
        contents: [{ role: "user", parts: [{ text: userMessage }] }],
      });
      const text = generation.response.text();
      if (text) return text.trim();
    } catch (err) {
      console.error("[AI] Gemini call failed:", err);
    }
  }

  // ── 2. Groq fallback (llama-3.1-8b-instant — free, ultra-fast) ──────────────
  const groqKey = process.env.GROQ_API_KEY;
  if (groqKey) {
    try {
      const groq = new Groq({ apiKey: groqKey });
      const chat = await groq.chat.completions.create({
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "system", content: persona },
          { role: "user", content: userMessage },
        ],
        temperature: 0.7,
        max_tokens: 150,
      });
      const text = chat.choices[0]?.message?.content;
      if (text) return text.trim();
    } catch (err) {
      console.error("[AI] Groq call failed:", err);
    }
  }

  // Both APIs failed or keys are missing — caller decides what to do
  return null;
}
