"use client";

import { useEffect, useMemo, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, User } from "lucide-react";
import type { ChatMessage, ToolCall } from "@/types";
import TypingIndicator from "./TypingIndicator";

export interface MessageListProps {
  messages: ChatMessage[];
  isLoading?: boolean;
  onConfirmToolCall?: (toolCall: ToolCall, message: ChatMessage) => void;
  onCancelToolCall?: (toolCall: ToolCall, message: ChatMessage) => void;
}

function describeToolCall(toolCall: ToolCall): string {
  const rawArgs = toolCall.arguments;
  const selector =
    typeof rawArgs.selector === "string" ? rawArgs.selector : undefined;
  const url = typeof rawArgs.url === "string" ? rawArgs.url : undefined;

  if (toolCall.name === "scroll" && selector) {
    return `scroll to ${selector}`;
  }
  if (toolCall.name === "navigate" && url) {
    return `navigate to ${url}`;
  }
  if (selector) {
    return `${toolCall.name} on ${selector}`;
  }
  return toolCall.name;
}

export default function MessageList({
  messages,
  isLoading = false,
  onConfirmToolCall,
  onCancelToolCall,
}: MessageListProps) {
  const endRef = useRef<HTMLDivElement | null>(null);

  const normalizedMessages = useMemo(
    () =>
      messages.filter(
        (message) =>
          message.role === "assistant" ||
          message.role === "user" ||
          message.role === "tool",
      ),
    [messages],
  );

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [normalizedMessages, isLoading]);

  return (
    <div
      data-testid="chat-message-list"
      className="flex h-full flex-col gap-3 overflow-y-auto px-1 py-1"
    >
      <AnimatePresence initial={false}>
        {normalizedMessages.map((message, index) => {
          const isUser = message.role === "user";
          const isAssistant = message.role === "assistant";
          const bubbleClasses = isUser
            ? "bg-blue-600 text-white"
            : "bg-zinc-200 text-zinc-900";

          return (
            <motion.article
              key={`${message.role}-${index}-${message.content}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className={`flex ${isUser ? "justify-end" : "justify-start"}`}
            >
              <div className="max-w-[85%]">
                <div
                  className={`rounded-2xl px-4 py-3 text-sm leading-6 shadow-sm ${bubbleClasses}`}
                >
                  <p className="mb-2 inline-flex items-center gap-2 text-xs font-semibold uppercase opacity-80">
                    {isUser ? (
                      <User className="h-3.5 w-3.5" />
                    ) : (
                      <Bot className="h-3.5 w-3.5" />
                    )}
                    {isUser ? "You" : isAssistant ? "AI" : "Tool"}
                  </p>
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </div>

                {isAssistant && message.toolCalls && message.toolCalls.length > 0 ? (
                  <div className="mt-2 space-y-2">
                    {message.toolCalls.map((toolCall) => (
                      <div
                        key={toolCall.id}
                        className="rounded-xl border border-zinc-200 bg-white p-3 text-sm text-zinc-700 shadow-sm"
                      >
                        <p className="text-sm">
                          AI wants to:{" "}
                          <span className="font-semibold">
                            {describeToolCall(toolCall)}
                          </span>
                        </p>
                        <div className="mt-3 flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => onConfirmToolCall?.(toolCall, message)}
                            className="rounded-lg bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:bg-zinc-300"
                            disabled={!onConfirmToolCall}
                          >
                            Confirm
                          </button>
                          <button
                            type="button"
                            onClick={() => onCancelToolCall?.(toolCall, message)}
                            className="rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-700 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-60"
                            disabled={!onCancelToolCall}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            </motion.article>
          );
        })}
      </AnimatePresence>

      {isLoading ? (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-start"
        >
          <TypingIndicator />
        </motion.div>
      ) : null}

      <div ref={endRef} />
    </div>
  );
}
