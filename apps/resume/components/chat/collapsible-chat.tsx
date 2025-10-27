"use client";

import { useChat } from "@ai-sdk/react";
import { Button } from "@repo/design-system/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import { Input } from "@repo/design-system/components/ui/input";
import { ScrollArea } from "@repo/design-system/components/ui/scroll-area";
import { cn } from "@repo/design-system/lib/utils";
import { DefaultChatTransport } from "ai";
import { Maximize2, MessageCircle, Minimize2, Send, X } from "lucide-react";
import { type KeyboardEvent, useEffect, useRef, useState } from "react";
import { useResumeData } from "../../stores/resume-editor-store";
import { LoadingMessage, MessageRenderer } from "./message-renderer";

export type CollapsibleChatProps = {
  /** Title of the chat */
  title?: string;
  /** Whether the chat starts open or closed */
  defaultOpen?: boolean;
  /** Whether the chat starts maximized or minimized */
  defaultMaximized?: boolean;
  /** Custom className */
  className?: string;
  /** Placeholder text for input */
  placeholder?: string;
  /** Position of the chat widget */
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
};

const positionClasses = {
  "bottom-right": "bottom-4 right-4",
  "bottom-left": "bottom-4 left-4",
  "top-right": "top-4 right-4",
  "top-left": "top-4 left-4",
};

export function CollapsibleChat({
  title = "Chat",
  defaultOpen = false,
  defaultMaximized = false,
  className,
  placeholder = "Type a message...",
  position = "bottom-right",
}: CollapsibleChatProps) {
  const resume = useResumeData();
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [isMaximized, setIsMaximized] = useState(defaultMaximized);
  const [input, setInput] = useState<string>(
    "how can I make my resume better?"
  );
  const scrollRef = useRef<HTMLDivElement>(null);

  // Extract only the fields needed for AI context
  const resumeContext = resume
    ? {
        targetRole: resume.targetRole,
        firstName: resume.firstName,
        lastName: resume.lastName,
        email: resume.email,
        professionalSummary: resume.professionalSummary,
        workExperience: resume.workExperience,
        education: resume.education,
        skills: resume.skills,
        projects: resume.projects,
      }
    : null;

  const { messages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
  });

  const isLoading = (status as string) === "in_progress";

  // Log AI responses for testing
  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === "assistant") {
        console.log("🤖 AI Response:", lastMessage);
        console.log("📝 Message parts:", lastMessage.parts);
      }
    }
  }, [messages]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current && messages.length > 0) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages.length]);

  const handleSendMessage = () => {
    if (input.trim() && !isLoading) {
      sendMessage(
        {
          role: "user" as const,
          parts: [{ type: "text", text: input }],
        },
        {
          body: { resume: resumeContext },
        }
      );
      setInput("");
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const canSend = Boolean(input.trim()) && !isLoading;

  // Floating button when collapsed
  if (!isOpen) {
    return (
      <div className={cn("fixed z-50", positionClasses[position], className)}>
        <Button
          aria-label="Open chat"
          className="size-14 rounded-full shadow-lg"
          onClick={() => setIsOpen(true)}
          size="icon"
        >
          <MessageCircle className="size-6" />
        </Button>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "fixed z-50 flex flex-col",
        isMaximized
          ? "inset-4"
          : "h-[900px] max-h-[calc(100vh-2rem)] w-[580px]",
        positionClasses[position],
        className
      )}
    >
      <Card className="flex h-full flex-col shadow-xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b p-4">
          <CardTitle className="font-semibold text-lg">{title}</CardTitle>
          <div className="flex items-center gap-1">
            <Button
              aria-label={isMaximized ? "Minimize chat" : "Maximize chat"}
              onClick={() => setIsMaximized(!isMaximized)}
              size="icon-sm"
              variant="ghost"
            >
              {isMaximized ? (
                <Minimize2 className="size-4" />
              ) : (
                <Maximize2 className="size-4" />
              )}
            </Button>
            <Button
              aria-label="Close chat"
              onClick={() => setIsOpen(false)}
              size="icon-sm"
              variant="ghost"
            >
              <X className="size-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="flex-1 overflow-hidden p-0">
          <ScrollArea className="h-full p-4">
            <div className="space-y-4">
              {error && (
                <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-destructive text-sm">
                  <p className="font-medium">Error</p>
                  <p>
                    {error.message ||
                      "An error occurred while processing your message."}
                  </p>
                </div>
              )}
              {messages.length === 0 ? (
                <div className="flex h-full items-center justify-center text-center text-muted-foreground">
                  <p className="text-sm">
                    No messages yet. Start a conversation!
                  </p>
                </div>
              ) : (
                messages.map((message) => (
                  <MessageRenderer key={message.id} message={message} />
                ))
              )}
              {isLoading && <LoadingMessage />}
              <div ref={scrollRef} />
            </div>
          </ScrollArea>
        </CardContent>

        <CardFooter className="border-t p-4">
          <form
            className="flex w-full gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
          >
            <Input
              className="flex-1"
              disabled={isLoading}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={placeholder}
              value={input}
            />
            <Button
              aria-label="Send message"
              disabled={!canSend}
              size="icon"
              type="submit"
            >
              <Send className="size-4" />
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}
