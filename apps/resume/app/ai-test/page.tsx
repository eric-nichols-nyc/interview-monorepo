"use client";

import { useState } from "react";

export default function AITestPage() {
  const [openAIResponse, setOpenAIResponse] = useState<string>("");
  const [geminiResponse, setGeminiResponse] = useState<string>("");
  const [loading, setLoading] = useState<{ openai: boolean; gemini: boolean }>({
    openai: false,
    gemini: false,
  });

  const testOpenAI = async () => {
    setLoading((prev) => ({ ...prev, openai: true }));
    try {
      const response = await fetch("/api/ai-test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          provider: "openai",
          prompt: "Say hello from OpenAI in a creative way!",
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to generate text");
      }

      setOpenAIResponse(data.text);
    } catch (error) {
      setOpenAIResponse(
        `Error: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    } finally {
      setLoading((prev) => ({ ...prev, openai: false }));
    }
  };

  const testGemini = async () => {
    setLoading((prev) => ({ ...prev, gemini: true }));
    try {
      const response = await fetch("/api/ai-test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          provider: "gemini",
          prompt: "Say hello from Google Gemini in a creative way!",
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to generate text");
      }

      setGeminiResponse(data.text);
    } catch (error) {
      setGeminiResponse(
        `Error: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    } finally {
      setLoading((prev) => ({ ...prev, gemini: false }));
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 font-bold text-3xl text-black">
        AI Integration Test
      </h1>

      <div className="grid gap-8 md:grid-cols-2">
        {/* OpenAI Test */}
        <div className="rounded-lg border p-6">
          <h2 className="mb-4 font-semibold text-black text-xl">
            OpenAI GPT-4o-mini Test
          </h2>
          <button
            className="mb-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:bg-blue-300"
            disabled={loading.openai}
            onClick={testOpenAI}
          >
            {loading.openai ? "Testing..." : "Test OpenAI"}
          </button>
          <div className="min-h-[100px] rounded bg-gray-100 p-4">
            <p className="whitespace-pre-wrap text-black">
              {openAIResponse || "Click the button to test OpenAI integration"}
            </p>
          </div>
        </div>

        {/* Gemini Test */}
        <div className="rounded-lg border p-6">
          <h2 className="mb-4 font-semibold text-black text-xl">
            Google Gemini 1.5 Pro Test
          </h2>
          <button
            className="mb-4 rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600 disabled:bg-green-300"
            disabled={loading.gemini}
            onClick={testGemini}
          >
            {loading.gemini ? "Testing..." : "Test Gemini"}
          </button>
          <div className="min-h-[100px] rounded bg-gray-100 p-4">
            <p className="whitespace-pre-wrap text-black">
              {geminiResponse || "Click the button to test Gemini integration"}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 rounded bg-yellow-100 p-4">
        <h3 className="mb-2 font-semibold text-black">
          Environment Variables Needed:
        </h3>
        <ul className="list-inside list-disc space-y-1 text-black">
          <li>OPENAI_API_KEY - Your OpenAI API key (starts with sk-)</li>
          <li>GOOGLE_GENERATIVE_AI_API_KEY - Your Google AI Studio API key</li>
        </ul>
      </div>
    </div>
  );
}
