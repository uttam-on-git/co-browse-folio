"use client";

import {
  createContext,
  type ReactNode,
  useContext,
  useMemo,
} from "react";
import { useChat, type UseChatResult } from "@/hooks/useChat";

const ChatContext = createContext<UseChatResult | null>(null);

export default function ChatProvider({ children }: { children: ReactNode }) {
  const chat = useChat();
  const value = useMemo(() => chat, [chat]);

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChatContext(): UseChatResult {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChatContext must be used within a ChatProvider.");
  }
  return context;
}
