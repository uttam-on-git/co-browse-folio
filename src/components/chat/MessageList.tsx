"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, User } from "lucide-react";
import type { ChatMessage, ToolCall } from "@/types";
import { executeAction } from "@/lib/action-executor";
import MessageSkeleton from "./MessageSkeleton";
import TypingIndicator from "./TypingIndicator";

export interface MessageListProps {
  messages: ChatMessage[];
  isLoading?: boolean;
  onConfirmToolCall?: (toolCall: ToolCall, message: ChatMessage) => void;
  onCancelToolCall?: (toolCall: ToolCall, message: ChatMessage) => void;
}

type ToolExecutionStatus =
  | "waiting"
  | "executing"
  | "success"
  | "failed"
  | "cancelled";

type ToolExecutionState = {
  status: ToolExecutionStatus;
  message?: string;
};

const TOOL_LABELS: Record<string, string> = {
  scroll_to_section: "Scroll to section",
  highlight_element: "Highlight element",
  click_element: "Click element",
  fill_input: "Fill input",
  get_element_info: "Get element info",
};

function toHumanLabel(value: string): string {
  return value
    .replace(/([A-Z])/g, " $1")
    .replace(/_/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^./, (char) => char.toUpperCase());
}

function formatParamValue(value: unknown): string {
  if (typeof value === "string") {
    if (value === "smooth" || value === "auto") {
      return value;
    }
    return value;
  }
  if (typeof value === "number") {
    return Number.isFinite(value) ? String(value) : "n/a";
  }
  if (typeof value === "boolean") {
    return value ? "true" : "false";
  }
  if (value === null || value === undefined) {
    return "n/a";
  }
  return JSON.stringify(value);
}

function formatParams(toolCall: ToolCall): Array<{ key: string; value: string }> {
  return Object.entries(toolCall.arguments).map(([key, value]) => {
    if (key === "durationSeconds" && typeof value === "number") {
      return {
        key: "duration",
        value: `${value} ${value === 1 ? "second" : "seconds"}`,
      };
    }

    if (key === "sectionId") {
      return { key: "section", value: formatParamValue(value) };
    }

    return { key: toHumanLabel(key).toLowerCase(), value: formatParamValue(value) };
  });
}

function getToolTitle(toolName: string): string {
  return TOOL_LABELS[toolName] || toHumanLabel(toolName);
}

function ToolCallPreview({
  toolCall,
  state,
  onAllow,
  onCancel,
}: {
  toolCall: ToolCall;
  state?: ToolExecutionState;
  onAllow: () => void;
  onCancel: () => void;
}) {
  const status = state?.status ?? "waiting";

  const borderClass =
    status === "success"
      ? "border-l-green-500"
      : status === "failed" || status === "cancelled"
        ? "border-l-red-500"
        : "border-l-amber-400";

  return (
    <div
      className={`rounded-xl border border-zinc-200 border-l-4 bg-white p-3 text-sm text-zinc-700 shadow-sm ${borderClass}`}
    >
      <p className="font-semibold text-zinc-900">{getToolTitle(toolCall.name)}</p>
      <ul className="mt-2 space-y-1 text-xs text-zinc-600">
        {formatParams(toolCall).map((entry) => (
          <li key={`${toolCall.id}-${entry.key}`}>
            {entry.key}: <span className="font-medium text-zinc-800">{entry.value}</span>
          </li>
        ))}
      </ul>

      {state?.message ? (
        <p className="mt-3 text-xs font-medium text-zinc-700">{state.message}</p>
      ) : null}

      {status === "waiting" || status === "executing" ? (
        <div className="mt-3 flex items-center gap-2">
          <button
            type="button"
            onClick={onAllow}
            disabled={status === "executing"}
            className="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-green-500 disabled:cursor-not-allowed disabled:bg-green-300"
          >
            Allow
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={status === "executing"}
            className="rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-700 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancel
          </button>
        </div>
      ) : null}
    </div>
  );
}

export default function MessageList({
  messages,
  isLoading = false,
  onConfirmToolCall,
  onCancelToolCall,
}: MessageListProps) {
  const endRef = useRef<HTMLDivElement | null>(null);
  const [toolStates, setToolStates] = useState<Record<string, ToolExecutionState>>(
    {},
  );
  const [toastMessage, setToastMessage] = useState<string | null>(null);

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

  useEffect(() => {
    if (!toastMessage) {
      return;
    }

    const timer = window.setTimeout(() => {
      setToastMessage(null);
    }, 2200);

    return () => {
      window.clearTimeout(timer);
    };
  }, [toastMessage]);

  const handleAllow = useCallback(
    (toolCall: ToolCall, message: ChatMessage) => {
      setToolStates((current) => ({
        ...current,
        [toolCall.id]: {
          status: "executing",
          message: "Executing action...",
        },
      }));

      const result = executeAction(toolCall.name, toolCall.arguments);
      const feedback =
        result.message ||
        (result.success ? `${getToolTitle(toolCall.name)} completed.` : "Action failed.");
      setToolStates((current) => ({
        ...current,
        [toolCall.id]: {
          status: result.success ? "success" : "failed",
          message: result.success
            ? result.message || "Action completed successfully."
            : result.error || "Action failed.",
        },
      }));
      setToastMessage(feedback);

      onConfirmToolCall?.(toolCall, message);
    },
    [onConfirmToolCall],
  );

  const handleCancel = useCallback(
    (toolCall: ToolCall, message: ChatMessage) => {
      setToolStates((current) => ({
        ...current,
        [toolCall.id]: {
          status: "cancelled",
          message:
            "You declined this action. Ask AI for an alternative approach.",
        },
      }));
      setToastMessage("Action cancelled.");
      onCancelToolCall?.(toolCall, message);
    },
    [onCancelToolCall],
  );

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
                      <ToolCallPreview
                        key={toolCall.id}
                        toolCall={toolCall}
                        state={toolStates[toolCall.id]}
                        onAllow={() => handleAllow(toolCall, message)}
                        onCancel={() => handleCancel(toolCall, message)}
                      />
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
          <div className="space-y-2">
            <MessageSkeleton />
            <TypingIndicator />
          </div>
        </motion.div>
      ) : null}

      <AnimatePresence>
        {toastMessage ? (
          <motion.div
            key="action-toast"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="pointer-events-none fixed right-8 bottom-28 z-50 rounded-xl bg-zinc-900 px-3 py-2 text-xs font-medium text-white shadow-lg"
          >
            {toastMessage}
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div ref={endRef} />
    </div>
  );
}
