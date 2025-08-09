import { GoogleGenerativeAI, type Content } from "@google/generative-ai";
/**
 * Generate an AI-powered reply using Google Gemini API with OpenAI fallback.
 * @param userMessage The incoming user message or comment text.
 * @param context Optional persona or additional context, e.g. "You are the personal assistant of XYZ creator".
 */
export async function generateAiResponse(
  userMessage: string,
  context?: string,
): Promise<string> {
  const persona = context?.trim() ||
    "You are a helpful Instagram assistant for a business account. Keep responses short, friendly and on-brand.";

  // Try Google Gemini first via SDK ---------------------------------------
  const geminiKey = process.env.GOOGLE_GEMINI_API_KEY;
  if (geminiKey) {
    try {
      // Defer import so build succeeds if dependency not installed yet
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const genAI = new GoogleGenerativeAI(geminiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const generation = await model.generateContent({
        contents: [
          { role: "system", parts: [{ text: persona }] },
          { role: "user", parts: [{ text: userMessage }] },
        ],
      });
      const text = generation.response.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) return text.trim();
    } catch (err) {
      console.error("Gemini SDK call failed", err);
    }
  }

  // OpenAI fallback -------------------------------------------------------
  const openaiKey = process.env.OPENAI_API_KEY;
  if (openaiKey) {
    try {
      const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${openaiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: persona },
            { role: "user", content: userMessage },
          ],
          temperature: 0.7,
          max_tokens: 100,
        }),
      });
      if (openaiRes.ok) {
        const resJson: any = await openaiRes.json();
        const answer = resJson.choices?.[0]?.message?.content;
        if (answer) return answer.trim();
      } else {
        console.error("OpenAI API error", await openaiRes.text());
      }
    } catch (err) {
      console.error("OpenAI request failed", err);
    }
  }

  // Final fallback --------------------------------------------------------
  return "Thank you for reaching out! We'll get back to you soon.";
}
