import { openai } from "@ai-sdk/openai";
import { convertToModelMessages, streamText, type UIMessage } from "ai";

type ResumeContext = {
  targetRole: string | null;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  professionalSummary: string | null;
  workExperience: any;
  education: any;
  skills: any;
  projects: any;
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

    const systemPrompt = resume
      ? `You are a helpful resume assistant. You have access to the user's resume data below. Use this information to provide PERSONALIZED advice. DO NOT ask them to upload or paste their resume.

USER'S RESUME DATA:
Target Role: ${resume.targetRole}
Name: ${resume.firstName || "Not set"} ${resume.lastName || "Not set"}
Email: ${resume.email || "Not set"}
Professional Summary: ${resume.professionalSummary || "Not written yet"}
Work Experience: ${resume.workExperience ? JSON.stringify(resume.workExperience) : "Not added yet"}
Education: ${resume.education ? JSON.stringify(resume.education) : "Not added yet"}
Skills: ${resume.skills ? JSON.stringify(resume.skills) : "Not added yet"}

In your first message, acknowledge their target role (${resume.targetRole}) and give specific advice based on what they have or haven't filled in yet.`
      : "You are a helpful resume assistant.";

    const result = streamText({
      model: openai("gpt-4.1"),
      messages: modelMessages,
      system: systemPrompt,
    });

    return result.toUIMessageStreamResponse();
  } catch (error: unknown) {
    if (error instanceof Error) {
      return new Response(error.message, { status: 500 });
    }
  }
}
