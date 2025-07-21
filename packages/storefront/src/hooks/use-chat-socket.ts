import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

interface ChatMessage {
  user: string;
  message: string;
  timestamp?: number;
}

export function useChatSocket(url: string = "http://localhost:3001/chat") {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    socketRef.current = io(url);

    socketRef.current.on("connect", () => {
      // Optionally notify connection
    });

    socketRef.current.on("message", (data: ChatMessage) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [url]);

  const sendMessage = (user: string, message: string) => {
    const msg: ChatMessage = { user, message, timestamp: Date.now() };
    socketRef.current?.emit("message", msg);
  };

  return { messages, sendMessage };
}
