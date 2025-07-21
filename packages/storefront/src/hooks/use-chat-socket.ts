import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

interface ChatMessage {
  from: string;
  message: string;
  timestamp?: number;
}

function getOrCreateUserId() {
  if (typeof window === "undefined") return "";
  let userId = localStorage.getItem("chat_user_id");
  if (!userId) {
    userId = Math.random().toString(36).substring(2, 12);
    localStorage.setItem("chat_user_id", userId);
  }
  return userId;
}

export function useChatSocket(url: string = "http://localhost:3001/chat") {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [recipient, setRecipient] = useState<string | null>(null);
  const [userId] = useState(getOrCreateUserId());
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    socketRef.current = io(url, { query: { userId } });

    socketRef.current.on("private-message", (data: ChatMessage) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [url, userId]);

  const sendMessage = (message: string) => {
    if (!recipient) return;
    const msg: ChatMessage = { from: userId, message, timestamp: Date.now() };
    socketRef.current?.emit("private-message", { to: recipient, ...msg });
    setMessages((prev) => [...prev, msg]); // Optimistic update
  };

  return { messages, sendMessage, userId, setRecipient, recipient };
}
