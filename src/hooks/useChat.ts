"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useContentExtractor } from "@/hooks/useContentExtractor";
import type { ChatMessage, ToolCall, ToolResult } from "@/types";

interface ChatApiResponse {
  content?: string;
  message?: string;
  toolCalls?: ToolCall[];
  toolResults?: ToolResult[];
  error?: string;
}

export interface UseChatResult {
  messages: ChatMessage[];
  isLoading: boolean;
  isExecutingAction: boolean;
  error: string | null;
  sendMessage: (text: string) => void;
  clearChat: () => void;
  confirmToolCall: (toolCallId: string, confirmed: boolean) => void;
}

export function useChat(): UseChatResult {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isExecutingAction, setIsExecutingAction] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const messagesRef = useRef<ChatMessage[]>([]);
  const pendingToolCallsRef = useRef<Map<string, ToolCall>>(new Map());
  const { pageContent, refreshContent } = useContentExtractor();

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  const clearChat = useCallback(() => {
    setMessages([]);
    setIsLoading(false);
    setIsExecutingAction(false);
    setError(null);
    pendingToolCallsRef.current.clear();
  }, []);

  const sendMessage = useCallback(
    (text: string) => {
      const content = text.trim();
      if (!content || isLoading) {
        return;
      }

      const userMessage: ChatMessage = { role: "user", content };
      const requestMessages = [...messagesRef.current, userMessage];

      setMessages(requestMessages);
      setError(null);
      setIsLoading(true);

      const run = async () => {
        try {
          refreshContent();

          const response = await fetch("/api/chat", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              messages: requestMessages,
              pageContent,
            }),
          });

          const payload = (await response.json()) as ChatApiResponse;

          if (!response.ok) {
            throw new Error(payload.error || "Failed to get AI response.");
          }

          const assistantMessage: ChatMessage = {
            role: "assistant",
            content:
              payload.content ||
              payload.message ||
              (payload.toolCalls?.length
                ? "I can perform an action. Please confirm."
                : ""),
            toolCalls: payload.toolCalls,
            toolResults: payload.toolResults,
          };

          if (payload.toolCalls?.length) {
            payload.toolCalls.forEach((toolCall) => {
              pendingToolCallsRef.current.set(toolCall.id, toolCall);
            });
            setIsExecutingAction(true);
          }

          setMessages((current) => [...current, assistantMessage]);
        } catch (requestError) {
          const message =
            requestError instanceof Error
              ? requestError.message
              : "An unexpected error occurred.";

          setError(message);
          setMessages((current) => [
            ...current,
            {
              role: "assistant",
              content: "Sorry, I ran into an error while processing that.",
            },
          ]);
        } finally {
          setIsLoading(false);
        }
      };

      void run();
    },
    [isLoading, pageContent, refreshContent],
  );

  const confirmToolCall = useCallback(
    (toolCallId: string, confirmed: boolean) => {
      const toolCall = pendingToolCallsRef.current.get(toolCallId);
      if (!toolCall) {
        return;
      }

      const handleConfirmation = async () => {
        try {
          setError(null);
          setIsExecutingAction(true);

          if (!confirmed) {
            setMessages((current) => [
              ...current,
              {
                role: "tool",
                content: `Action cancelled: ${toolCall.name}`,
                toolResults: [
                  {
                    toolCallId,
                    name: toolCall.name,
                    result: null,
                    error: "Cancelled by user.",
                  },
                ],
              },
            ]);
            return;
          }

          const response = await fetch("/api/chat/confirm", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              toolCallId,
              messages: messagesRef.current,
              pageContent,
            }),
          });

          if (!response.ok) {
            throw new Error("Failed to confirm tool action.");
          }

          const payload = (await response.json()) as ChatApiResponse;

          setMessages((current) => [
            ...current,
            {
              role: "tool",
              content:
                payload.message ||
                payload.content ||
                `Action completed: ${toolCall.name}`,
              toolResults: payload.toolResults,
            },
          ]);
        } catch (confirmationError) {
          const message =
            confirmationError instanceof Error
              ? confirmationError.message
              : "Unable to process tool confirmation.";

          setError(message);
          setMessages((current) => [
            ...current,
            {
              role: "assistant",
              content:
                "I could not complete that action confirmation. Please try again.",
            },
          ]);
        } finally {
          pendingToolCallsRef.current.delete(toolCallId);
          if (pendingToolCallsRef.current.size === 0) {
            setIsExecutingAction(false);
          }
        }
      };

      void handleConfirmation();
    },
    [pageContent],
  );

  return {
    messages,
    isLoading,
    isExecutingAction,
    error,
    sendMessage,
    clearChat,
    confirmToolCall,
  };
}
