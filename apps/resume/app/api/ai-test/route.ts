import { models, generateText } from "@repo/ai";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const provider = searchParams.get("provider") || "openai";

  try {
    let model;
    let providerName;

    switch (provider) {
      case "openai":
        model = models.openai.chat;
        providerName = "OpenAI GPT-4o-mini";
        break;
      case "gemini":
        model = models.google.chat;
        providerName = "Google Gemini 1.5 Pro";
        break;
      case "gemini-flash":
        model = models.google.flash;
        providerName = "Google Gemini 1.5 Flash";
        break;
      default:
        return NextResponse.json({ error: "Invalid provider" }, { status: 400 });
    }

    const { text } = await generateText({
      model,
      prompt: `Say hello from ${providerName} in a creative and brief way!`,
    });

    return NextResponse.json({
      success: true,
      provider: providerName,
      response: text,
    });
  } catch (error) {
    console.error("AI Test Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        provider,
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { prompt, provider = "openai" } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    let model;
    let providerName;

    switch (provider) {
      case "openai":
        model = models.openai.chat;
        providerName = "OpenAI GPT-4o-mini";
        break;
      case "gemini":
        model = models.google.chat;
        providerName = "Google Gemini 1.5 Pro";
        break;
      case "gemini-flash":
        model = models.google.flash;
        providerName = "Google Gemini 1.5 Flash";
        break;
      default:
        return NextResponse.json({ error: "Invalid provider" }, { status: 400 });
    }

    const { text } = await generateText({
      model,
      prompt,
    });

    return NextResponse.json({
      success: true,
      provider: providerName,
      prompt,
      response: text,
    });
  } catch (error) {
    console.error("AI Test Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}