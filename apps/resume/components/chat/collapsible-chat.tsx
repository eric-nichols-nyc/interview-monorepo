"use client";

import { useChat } from "@ai-sdk/react";
import {
  Avatar,
  AvatarFallback,
} from "@repo/design-system/components/ui/avatar";
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
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [isMaximized, setIsMaximized] = useState(defaultMaximized);
  const [input, setInput] = useState<string>("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
  });

  const isLoading = (status as string) === "in_progress";

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current && messages.length > 0) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages.length]);

  const handleSendMessage = () => {
    if (input.trim() && !isLoading) {
      sendMessage({
        role: "user" as const,
        parts: [{ type: "text", text: input }],
      });
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
                  <div
                    className={cn(
                      "flex gap-3",
                      message.role === "user" && "flex-row-reverse"
                    )}
                    key={message.id}
                  >
                    <Avatar className="size-8 shrink-0">
                      <AvatarFallback>
                        {message.role === "user" ? "You" : "AI"}
                      </AvatarFallback>
                    </Avatar>
                    <div
                      className={cn(
                        "flex max-w-[70%] flex-col gap-1",
                        message.role === "user" && "items-end"
                      )}
                    >
                      <div
                        className={cn(
                          "flex items-baseline gap-2",
                          message.role === "user" && "flex-row-reverse"
                        )}
                      >
                        <span className="font-medium text-xs">
                          {message.role === "user" ? "You" : "Assistant"}
                        </span>
                        <span className="text-muted-foreground text-xs">
                          {new Date().toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <div
                        className={cn(
                          "whitespace-pre-wrap rounded-lg px-3 py-2 text-sm",
                          message.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        )}
                      >
                        {message.parts
                          ?.map((part) =>
                            part.type === "text" ? part.text : ""
                          )
                          .join("") || ""}
                      </div>
                    </div>
                  </div>
                ))
              )}
              {isLoading && (
                <div className="flex gap-3">
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
              )}
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
