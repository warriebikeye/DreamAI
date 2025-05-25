import axios from "axios";
import { getConversation, appendMessage } from "./conversationStore";

export async function interpretDreamAgent(userId: string, userMessage: string): Promise<string> {
  const conversation = await getConversation(userId);
  await appendMessage(userId, { role: "user", content: userMessage });

  // Compose the dream interpretation prompt
  const prompt = `
You are an expert dream interpreter. Explain the meaning, symbolism, and emotions behind this dream in a friendly and clear way.

Dream: ${userMessage}

Interpretation:
`.trim();

  const url = `${process.env.GEMINI_API_URL}?key=${process.env.GEMINI_API_KEY}`;

  const data = {
    contents: [
      {
        parts: [{ text: prompt }],
      },
    ],
  };

  const response = await axios.post(url, data, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  const interpretation =
    response.data.candidates?.[0]?.content?.parts?.[0]?.text ||
    "Sorry, I couldn't interpret your dream.";

  await appendMessage(userId, { role: "assistant", content: interpretation });

  return interpretation;
}
