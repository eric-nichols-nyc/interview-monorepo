import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOpenAI } from "@ai-sdk/openai";
import { keys } from "../keys";

const openai = createOpenAI({
  apiKey: keys().OPENAI_API_KEY,
  compatibility: "strict",
});

const google = createGoogleGenerativeAI({
  apiKey: keys().GOOGLE_GENERATIVE_AI_API_KEY,
});

export const models = {
  openai: {
    chat: openai("gpt-4o-mini"),
    embeddings: openai("text-embedding-3-small"),
  },
  google: {
    chat: google("gemini-1.5-pro"),
    flash: google("gemini-1.5-flash"),
  },
  // Backward compatibility
  chat: openai("gpt-4o-mini"),
  embeddings: openai("text-embedding-3-small"),
};
