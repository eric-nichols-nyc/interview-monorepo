import {
  Avatar,
  AvatarFallback,
} from "@repo/design-system/components/ui/avatar";
import { cn } from "@repo/design-system/lib/utils";
import type { UIMessage } from "ai";
import { AnalysisCard } from "./analysis-card";
import { SuggestionCard } from "./suggestion-card";

type MessageRendererProps = {
  message: UIMessage;
};

type Block = {
  type: "text" | "suggestions" | "resume-analysis";
  data: {
    content?: string;
    suggestions?: Array<{
      title: string;
      description: string;
      priority: "high" | "medium" | "low";
      category: string;
    }>;
    grade?: number;
    summary?: string;
    categories?: Array<{
      name: string;
      score: number;
      max?: number;
    }>;
  };
};

type StructuredResponse = {
  blocks: Block[];
};

function parseMessageContent(message: UIMessage): StructuredResponse | null {
  const textContent =
    message.parts
      ?.map((part) => (part.type === "text" ? part.text : ""))
      .join("") || "";

  try {
    const parsed = JSON.parse(textContent);
    if (parsed.blocks && Array.isArray(parsed.blocks)) {
      return parsed as StructuredResponse;
    }
  } catch {
    // Not JSON, return null
  }
  return null;
}

export function MessageRenderer({ message }: MessageRendererProps) {
  const isUser = message.role === "user";
  const structured = isUser ? null : parseMessageContent(message);

  return (
    <div
      className={cn("flex gap-3", isUser && "flex-row-reverse")}
      key={message.id}
    >
      <Avatar className="size-8 shrink-0">
        <AvatarFallback>{isUser ? "You" : "AI"}</AvatarFallback>
      </Avatar>
      <div
        className={cn("flex max-w-[70%] flex-col gap-1", isUser && "items-end")}
      >
        <div
          className={cn(
            "flex items-baseline gap-2",
            isUser && "flex-row-reverse"
          )}
        >
          <span className="font-medium text-xs">
            {isUser ? "You" : "Assistant"}
          </span>
          <span className="text-muted-foreground text-xs">
            {new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>

        {structured ? (
          <div className="w-full space-y-3">
            {structured.blocks.map((block, idx) => {
              if (block.type === "text") {
                return (
                  <div
                    className="whitespace-pre-wrap rounded-lg bg-muted px-3 py-2 text-sm"
                    key={`text-${block.data.content}-${idx}`}
                  >
                    {block.data.content}
                  </div>
                );
              }

              if (block.type === "suggestions" && block.data.suggestions) {
                return (
                  <div
                    className="space-y-2"
                    key={`suggestions-${block.data.suggestions.length}-${idx}`}
                  >
                    {block.data.suggestions.map((suggestion, sIdx) => (
                      <SuggestionCard
                        key={`suggestion-${suggestion.title}-${sIdx}`}
                        suggestion={suggestion}
                      />
                    ))}
                  </div>
                );
              }

              if (
                block.type === "resume-analysis" &&
                block.data.grade !== undefined &&
                block.data.categories
              ) {
                return (
                  <AnalysisCard
                    data={{
                      grade: block.data.grade,
                      summary: block.data.summary,
                      categories: block.data.categories.map((cat) => ({
                        ...cat,
                        max: cat.max ?? 10,
                      })),
                    }}
                    key={`analysis-${block.data.grade}-${idx}`}
                  />
                );
              }

              return null;
            })}
          </div>
        ) : (
          <div
            className={cn(
              "whitespace-pre-wrap rounded-lg px-3 py-2 text-sm",
              isUser ? "bg-primary text-primary-foreground" : "bg-muted"
            )}
          >
            {message.parts
              ?.map((part) => (part.type === "text" ? part.text : ""))
              .join("") || ""}
          </div>
        )}
      </div>
    </div>
  );
}

type LoadingMessageProps = {
  className?: string;
};

export function LoadingMessage({ className }: LoadingMessageProps) {
  return (
    <div className={cn("flex gap-3", className)}>
      <Avatar className="size-8 shrink-0">
        <AvatarFallback>AI</AvatarFallback>
      </Avatar>
      <div className="flex max-w-[70%] flex-col gap-1">
        <div className="flex items-baseline gap-2">
          <span className="font-medium text-xs">Assistant</span>
          <span className="text-muted-foreground text-xs">
            {new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
        <div className="rounded-lg bg-muted px-3 py-2 text-sm">
          <div className="flex space-x-1">
            <div className="h-2 w-2 animate-bounce rounded-full bg-gray-500 [animation-delay:-0.3s]" />
            <div className="h-2 w-2 animate-bounce rounded-full bg-gray-500 [animation-delay:-0.15s]" />
            <div className="h-2 w-2 animate-bounce rounded-full bg-gray-500" />
          </div>
        </div>
      </div>
    </div>
  );
}
