import { openai } from "@ai-sdk/openai";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { getResumeAssistantPrompt } from "../../lib/ai/prompts";

type ResumeContext = {
  targetRole: string | null;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  professionalSummary: string | null;
  workExperience: unknown;
  education: unknown;
  skills: unknown;
  projects: unknown;
};

export async function POST(req: Request) {
  try {
    const {
      messages,
      resume,
    }: { messages: UIMessage[]; resume?: ResumeContext } = await req.json();

    if (!messages) {
      return new Response("No messages provided", { status: 400 });
    }

    if (!Array.isArray(messages)) {
      return new Response("Messages must be an array", { status: 400 });
    }

    if (messages.length === 0) {
      return new Response("Messages array is empty", { status: 400 });
    }

    if (!resume) {
      return new Response("No resume data provided", { status: 400 });
    }

    // Convert UI messages to model messages
    const modelMessages = convertToModelMessages(messages);

    const result = streamText({
      model: openai("gpt-4.1"),
      messages: modelMessages,
      system: getResumeAssistantPrompt(resume),
    });

    return result.toUIMessageStreamResponse();
  } catch (error: unknown) {
    if (error instanceof Error) {
      return new Response(error.message, { status: 500 });
    }
  }
}
