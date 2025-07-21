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

export default function ChatWidget() {
  const { messages, sendMessage } = useChatSocket();
  const [input, setInput] = useState("");
  const [user, setUser] = useState("User");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="fixed bottom-6 right-6 z-50 w-80 max-w-full">
      <Card className="shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle>Live Chat</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 max-h-64 overflow-y-auto bg-muted/40 rounded-md p-2">
          {messages.map((msg, i) => (
            <div key={i} className="flex items-start gap-2 mb-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback>
                  {msg.user?.[0]?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <span className="font-semibold text-xs text-primary">
                  {msg.user}
                </span>
                <div className="text-sm text-foreground break-words">
                  {msg.message}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <div className="flex gap-2 w-full">
            <Label htmlFor="chat-user" className="sr-only">
              Name
            </Label>
            <Input
              id="chat-user"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              placeholder="Your name"
              className="w-1/3"
            />
            <Label htmlFor="chat-input" className="sr-only">
              Message
            </Label>
            <Input
              id="chat-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && input.trim()) {
                  sendMessage(user, input);
                  setInput("");
                }
              }}
              placeholder="Type a message"
              className="flex-1"
              autoComplete="off"
            />
            <Button
              type="button"
              onClick={() => {
                if (input.trim()) {
                  sendMessage(user, input);
                  setInput("");
                }
              }}
              size="sm"
              className="ml-2"
            >
              Send
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
