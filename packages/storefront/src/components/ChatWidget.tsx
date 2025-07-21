"use client";
import { useState, useRef, useEffect } from "react";
import { useChatSocket } from "@/hooks/use-chat-socket";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@repo/ui/components/ui/card";
import { Input } from "@repo/ui/components/ui/input";
import { Button } from "@repo/ui/components/ui/button";
import { Avatar, AvatarFallback } from "@repo/ui/components/ui/avatar";
import { Label } from "@repo/ui/components/ui/label";
import { X, MessageCircle } from "lucide-react";

// Extend ChatMessage to include optional timestamp
interface ChatMessage {
  user: string;
  message: string;
  timestamp?: number;
}

function formatTime(ts: number) {
  const date = new Date(ts);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function ChatWidget() {
  const { messages, sendMessage } = useChatSocket();
  const [input, setInput] = useState("");
  const [user, setUser] = useState("User");
  const [open, setOpen] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  // Add timestamp if not present (for demo, ideally should be set on send)
  const enhancedMessages: (ChatMessage & { timestamp: number })[] =
    messages.map((msg) =>
      msg.timestamp
        ? (msg as ChatMessage & { timestamp: number })
        : { ...msg, timestamp: Date.now() }
    );

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80 max-w-full sm:w-96 sm:right-8 sm:bottom-8">
      {open ? (
        <Card className="shadow-lg">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle>
              <span id="chat-title" className="text-base sm:text-lg">
                Live Chat
              </span>
            </CardTitle>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Minimize chat"
              onClick={() => setOpen(false)}
              className="ml-2"
            >
              <X className="w-5 h-5" />
            </Button>
          </CardHeader>
          <CardContent
            className="space-y-2 max-h-64 overflow-y-auto bg-muted/40 rounded-md p-2 focus:outline-none"
            tabIndex={0}
            aria-label="Chat messages"
            role="log"
            aria-live="polite"
          >
            {enhancedMessages.map((msg, i) => (
              <div key={i} className="flex items-start gap-2 mb-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    {msg.user?.[0]?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <span className="font-semibold text-xs text-primary block">
                    {msg.user}
                  </span>
                  <div className="text-sm text-foreground break-words">
                    {msg.message}
                  </div>
                </div>
                <span className="text-[10px] text-muted-foreground self-end whitespace-nowrap ml-1">
                  {formatTime(msg.timestamp)}
                </span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <form
              className="flex gap-2 w-full"
              onSubmit={(e) => {
                e.preventDefault();
                if (input.trim()) {
                  sendMessage(user, input);
                  setInput("");
                }
              }}
              aria-label="Send message"
            >
              <Label htmlFor="chat-user" className="sr-only">
                Name
              </Label>
              <Input
                id="chat-user"
                value={user}
                onChange={(e) => setUser(e.target.value)}
                placeholder="Your name"
                className="w-1/3"
                aria-label="Your name"
                autoComplete="off"
              />
              <Label htmlFor="chat-input" className="sr-only">
                Message
              </Label>
              <Input
                id="chat-input"
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message"
                className="flex-1"
                aria-label="Type a message"
                autoComplete="off"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && input.trim()) {
                    sendMessage(user, input);
                    setInput("");
                  }
                }}
              />
              <Button
                type="submit"
                size="sm"
                className="ml-2"
                aria-label="Send message"
              >
                Send
              </Button>
            </form>
          </CardFooter>
        </Card>
      ) : (
        <Button
          className="rounded-full shadow-lg flex items-center gap-2 px-4 py-2"
          onClick={() => setOpen(true)}
          aria-label="Open chat"
        >
          <MessageCircle className="w-5 h-5" />
          <span className="hidden sm:inline">Chat</span>
        </Button>
      )}
    </div>
  );
}
