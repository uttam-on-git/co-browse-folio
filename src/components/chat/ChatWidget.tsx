"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LoaderCircle, MessageSquareText, X } from "lucide-react";
import type { ChatMessage, ToolCall } from "@/types";
import ChatInput from "./ChatInput";
import MessageList from "./MessageList";

export interface ChatWidgetProps {
  onSendMessage: (message: string) => void;
  messages: ChatMessage[];
  isLoading: boolean;
  isExecutingAction: boolean;
  onConfirmToolCall?: (toolCall: ToolCall, message: ChatMessage) => void;
  onCancelToolCall?: (toolCall: ToolCall, message: ChatMessage) => void;
}

export default function ChatWidget({
  onSendMessage,
  messages,
  isLoading,
  isExecutingAction,
  onConfirmToolCall,
  onCancelToolCall,
}: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      data-testid="chat-widget"
      className="fixed right-5 bottom-5 z-50 flex flex-col items-end gap-3"
    >
      <AnimatePresence>
        {isOpen ? (
          <motion.section
            key="chat-panel"
            initial={{ opacity: 0, y: 14, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="flex h-[32rem] w-[22rem] flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-50 shadow-2xl sm:w-[24rem]"
          >
            <header className="flex items-center justify-between border-b border-zinc-200 bg-white px-4 py-3">
              <div>
                <h2 className="text-sm font-semibold text-zinc-900">
                  Co-Browse Assistant
                </h2>
                <p className="text-xs text-zinc-500">
                  Ask questions or guide page actions
                </p>
              </div>
              <button
                type="button"
                aria-label="Close chat"
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-2 text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-900"
              >
                <X className="h-4 w-4" />
              </button>
            </header>

            <div className="flex min-h-0 flex-1 flex-col p-3">
              <MessageList
                messages={messages}
                isLoading={isLoading}
                onConfirmToolCall={onConfirmToolCall}
                onCancelToolCall={onCancelToolCall}
              />
              <div className="mt-3 space-y-2">
                {isLoading ? (
                  <p className="text-xs font-medium text-zinc-500">
                    AI is thinking...
                  </p>
                ) : null}
                {isExecutingAction ? (
                  <p className="inline-flex items-center gap-2 text-xs font-medium text-zinc-600">
                    <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
                    AI is acting...
                  </p>
                ) : null}
                <ChatInput onSend={onSendMessage} disabled={isLoading} />
              </div>
            </div>
          </motion.section>
        ) : null}
      </AnimatePresence>

      <motion.button
        type="button"
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.02 }}
        onClick={() => setIsOpen((previous) => !previous)}
        className="inline-flex items-center gap-2 rounded-full bg-zinc-900 px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-zinc-700"
      >
        <MessageSquareText className="h-4 w-4" />
        {isOpen ? "Hide Chat" : "Open Chat"}
      </motion.button>
    </div>
  );
}
