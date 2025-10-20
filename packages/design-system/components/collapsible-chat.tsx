"use client";

import { Maximize2, MessageCircle, Minimize2, Send, X } from "lucide-react";
import { type KeyboardEvent, useEffect, useRef, useState } from "react";

import { cn } from "../lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";

export type ChatMessage = {
  id: string;
  content: string;
  sender: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
  timestamp: Date;
  isCurrentUser: boolean;
};

export type CollapsibleChatProps = {
  /** Array of messages to display */
  messages?: ChatMessage[];
  /** Callback when a new message is sent */
  onSendMessage?: (message: string) => void;
  /** Current user info */
  currentUser?: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
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
  messages = [],
  onSendMessage,
  title = "Chat",
  defaultOpen = false,
  defaultMaximized = false,
  className,
  placeholder = "Type a message...",
  position = "bottom-right",
}: CollapsibleChatProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [isMaximized, setIsMaximized] = useState(defaultMaximized);
  const [inputValue, setInputValue] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const messagesLengthRef = useRef(messages.length);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messages.length > messagesLengthRef.current && scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
    messagesLengthRef.current = messages.length;
  });

  const handleSendMessage = () => {
    if (inputValue.trim() && onSendMessage) {
      onSendMessage(inputValue);
      setInputValue("");
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const hasInputValue = Boolean(inputValue.trim());
  const hasCallback = Boolean(onSendMessage);
  const canSend = hasInputValue && hasCallback;
  const isSendDisabled = !canSend;

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
                      message.isCurrentUser && "flex-row-reverse"
                    )}
                    key={message.id}
                  >
                    <Avatar className="size-8 shrink-0">
                      <AvatarImage src={message.sender.avatarUrl} />
                      <AvatarFallback>
                        {message.sender.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()
                          .slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div
                      className={cn(
                        "flex max-w-[70%] flex-col gap-1",
                        message.isCurrentUser && "items-end"
                      )}
                    >
                      <div
                        className={cn(
                          "flex items-baseline gap-2",
                          message.isCurrentUser && "flex-row-reverse"
                        )}
                      >
                        <span className="font-medium text-xs">
                          {message.sender.name}
                        </span>
                        <span className="text-muted-foreground text-xs">
                          {message.timestamp.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <div
                        className={cn(
                          "rounded-lg px-3 py-2 text-sm",
                          message.isCurrentUser
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        )}
                      >
                        {message.content}
                      </div>
                    </div>
                  </div>
                ))
              )}
              <div ref={scrollRef} />
            </div>
          </ScrollArea>
        </CardContent>

        <CardFooter className="border-t p-4">
          <div className="flex w-full gap-2">
            <Input
              className="flex-1"
              disabled={!onSendMessage}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={placeholder}
              value={inputValue}
            />
            <Button
              aria-label="Send message"
              disabled={isSendDisabled}
              onClick={handleSendMessage}
              size="icon"
            >
              <Send className="size-4" />
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
