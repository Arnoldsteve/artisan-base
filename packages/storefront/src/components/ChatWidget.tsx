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

interface ChatMessage {
  from: string;
  message: string;
  timestamp?: number;
}

// A type that guarantees the timestamp exists.
type DisplayedChatMessage = ChatMessage & { timestamp: number };

function formatTime(ts: number) {
  const date = new Date(ts);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

const AGENT_ID = "admin";

export default function ChatWidget() {
  const { messages, sendMessage, userId, setRecipient, recipient } = useChatSocket();
  const [input, setInput] = useState("");
  const [open, setOpen] = useState(true);
  const [targetId, setTargetId] = useState("");
  const [displayedMessages, setDisplayedMessages] = useState<DisplayedChatMessage[]>([]);
  const [isClient, setIsClient] = useState(false); // State to check if we are on the client

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // FIX 1: Ensure this component only renders on the client side.
  useEffect(() => {
    setIsClient(true);
  }, []);

  // On mount, set recipient for user or agent
  useEffect(() => {
    if (userId === AGENT_ID) {
      setRecipient(targetId);
    } else {
      setRecipient(AGENT_ID);
    }
  }, [userId, setRecipient, targetId]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [displayedMessages, open]);

  // FIX 2: Move logic that uses Date.now() into a useEffect hook.
  useEffect(() => {
    const enhancedMessages = messages.map((msg) =>
      msg.timestamp
        ? (msg as DisplayedChatMessage)
        : { ...msg, timestamp: Date.now() }
    );
    setDisplayedMessages(enhancedMessages);
  }, [messages]);


  // Don't render anything on the server or during the initial client render.
  if (!isClient) {
    return null;
  }

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
            <div className="mb-2 text-xs text-muted-foreground">
              <div>
                Your ID: <span className="font-mono">{userId}</span>
              </div>
              <div>
                Chatting with:{" "}
                <span className="font-mono">
                  {userId === AGENT_ID
                    ? recipient || "(no user selected)"
                    : AGENT_ID}
                </span>
              </div>
            </div>
            {userId === AGENT_ID && (
              <div className="mb-2 flex gap-2 items-center">
                <Label htmlFor="target-id" className="text-xs">
                  User ID:
                </Label>
                <Input
                  id="target-id"
                  value={targetId}
                  onChange={(e) => setTargetId(e.target.value)}
                  placeholder="Enter user ID to reply"
                  className="flex-1"
                  autoComplete="off"
                  aria-label="User ID to reply"
                />
                <Button
                  type="button"
                  size="sm"
                  onClick={() => setRecipient(targetId)}
                  disabled={!targetId}
                >
                  Set
                </Button>
              </div>
            )}
            {/* Render the client-side processed messages */}
            {displayedMessages.map((msg, i) => (
              <div key={i} className="flex items-start gap-2 mb-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    {msg.from?.[0]?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <span className="font-semibold text-xs text-primary block">
                    {msg.from === userId ? "You" : msg.from}
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
                  sendMessage(input);
                  setInput("");
                }
              }}
              aria-label="Send message"
            >
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
                    e.preventDefault(); // Prevent form submission on enter
                    sendMessage(input);
                    setInput("");
                  }
                }}
                disabled={userId === AGENT_ID && !recipient}
              />
              <Button
                type="submit"
                size="sm"
                className="ml-2"
                aria-label="Send message"
                disabled={userId === AGENT_ID && !recipient}
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