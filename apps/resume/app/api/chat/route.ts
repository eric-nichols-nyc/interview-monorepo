import { openai } from "@ai-sdk/openai";
import { convertToModelMessages, streamText, type UIMessage } from "ai";

export async function POST(req: Request) {
  try {
    const { messages }: { messages: UIMessage[] } = await req.json();

    if (!messages) {
      return new Response("No messages provided", { status: 400 });
    }

    if (!Array.isArray(messages)) {
      return new Response("Messages must be an array", { status: 400 });
    }

    if (messages.length === 0) {
      return new Response("Messages array is empty", { status: 400 });
    }

    // Convert UI messages to model messages
    const modelMessages = convertToModelMessages(messages);

    const result = streamText({
      model: openai("gpt-4.1"),
      messages: modelMessages,
      system:
        "You are a helpful AI assistant. Provide clear, concise, and helpful responses to user questions.",
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    return new Response("Internal Server Error", { status: 500 });
  }
}
