"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { executeAction } from "@/lib/action-executor";
import type {
  ChatMessage,
  PageContent,
  PageSectionType,
  ToolCall,
  ToolResult,
} from "@/types";

interface ChatApiResponse {
  type?: "text" | "tool_calls";
  content?: string;
  message?: string;
  calls?: ToolCall[];
  toolCalls?: ToolCall[];
  toolResults?: ToolResult[];
  error?: string;
}

function normalizeText(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function inferSectionType(id: string): PageSectionType {
  if (id === "hero" || id === "projects" || id === "about" || id === "contact") {
    return id;
  }
  return "other";
}

function extractCurrentPageContext(): PageContent {
  if (typeof document === "undefined") {
    return { sections: [] };
  }

  const sections = Array.from(
    document.querySelectorAll<HTMLElement>("[data-section], section[id]"),
  )
    .filter((section) => Boolean(section.id))
    .map((section) => {
      const heading = normalizeText(
        section.querySelector("h1, h2")?.textContent || "",
      );
      const text = normalizeText(section.textContent || "").slice(0, 500);

      return {
        id: section.id,
        type: inferSectionType(section.id),
        heading,
        text,
        elements: [],
      };
    });

  return { sections };
}

export interface UseChatResult {
  messages: ChatMessage[];
  isLoading: boolean;
  isExecutingAction: boolean;
  error: string | null;
  sendMessage: (text: string, pageContext?: PageContent) => void;
  clearChat: () => void;
  confirmToolCall: (toolCallId: string, confirmed: boolean) => void;
}

export function useChat(): UseChatResult {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isExecutingAction, setIsExecutingAction] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const messagesRef = useRef<ChatMessage[]>([]);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  const clearChat = useCallback(() => {
    setMessages([]);
    setIsLoading(false);
    setIsExecutingAction(false);
    setError(null);
  }, []);

  const sendMessage = useCallback(
    (text: string, pageContext?: PageContent) => {
      const content = text.trim();
      if (!content || isLoading || isExecutingAction) {
        return;
      }

      const context: PageContent = pageContext || { sections: [] };
      const userMessage: ChatMessage = { role: "user", content };
      const requestMessages = [...messagesRef.current, userMessage];

      setMessages(requestMessages);
      setError(null);
      setIsLoading(true);

      const run = async () => {
        try {
          const initialResponse = await fetch("/api/chat", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              messages: requestMessages,
              pageContext: context,
            }),
          });

          const initialPayload = (await initialResponse.json()) as ChatApiResponse;

          if (!initialResponse.ok) {
            throw new Error(initialPayload.error || "Failed to get AI response.");
          }

          if (initialPayload.type === "tool_calls") {
            const calls = initialPayload.calls || initialPayload.toolCalls || [];
            const planningMessage: ChatMessage = {
              role: "assistant",
              content:
                initialPayload.message ||
                "I found actions to perform. Executing them now.",
            };
            setMessages((current) => [...current, planningMessage]);

            setIsLoading(false);
            setIsExecutingAction(true);

            const toolResults: ToolResult[] = [];
            for (const call of calls) {
              const result = executeAction(call.name, call.arguments);
              toolResults.push({
                toolCallId: call.id,
                name: call.name,
                result,
                error: result.success ? undefined : result.error || "Action failed.",
              });
            }

            const toolSummary = toolResults
              .map((toolResult) => {
                const actionResult = toolResult.result as
                  | { success?: boolean; message?: string; error?: string }
                  | undefined;
                if (toolResult.error) {
                  return `${toolResult.name}: failed (${toolResult.error})`;
                }
                const detail =
                  actionResult?.message ||
                  (actionResult?.success ? "completed" : undefined);
                return `${toolResult.name}: success${detail ? ` (${detail})` : ""}`;
              })
              .join("\n");

            setMessages((current) => [
              ...current,
              {
                role: "tool",
                content: toolSummary || "No tool actions were executed.",
                toolResults,
              },
            ]);

            const finalUserInstruction: ChatMessage = {
              role: "user",
              content: [
                `Original user request: "${content}"`,
                "Tool execution results:",
                toolSummary || "No results.",
                "The action has already been executed in the UI.",
                "Do not ask to execute the same action again.",
                "Provide the final user-facing answer now.",
              ].join("\n"),
            };

            const finalMessages = [...requestMessages, finalUserInstruction];
            const updatedPageContext = extractCurrentPageContext();

            setIsExecutingAction(false);
            setIsLoading(true);

            const finalResponse = await fetch("/api/chat", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                messages: finalMessages,
                pageContext: updatedPageContext.sections.length
                  ? updatedPageContext
                  : context,
                toolResults,
              }),
            });

            const finalPayload = (await finalResponse.json()) as ChatApiResponse;
            if (!finalResponse.ok) {
              throw new Error(
                finalPayload.error || "Failed to get final AI response.",
              );
            }

            setMessages((current) => [
              ...current,
              {
                role: "assistant",
                content:
                  finalPayload.content ||
                  finalPayload.message ||
                  "The requested actions are complete.",
              },
            ]);
            return;
          }

          setMessages((current) => [
            ...current,
            {
              role: "assistant",
              content:
                initialPayload.content ||
                initialPayload.message ||
                "I do not have a response yet.",
            },
          ]);
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
              content: "Sorry, I ran into an error while processing your request.",
            },
          ]);
        } finally {
          setIsLoading(false);
          setIsExecutingAction(false);
        }
      };

      void run();
    },
    [isExecutingAction, isLoading],
  );

  const confirmToolCall = useCallback(
    (_toolCallId: string, confirmed: boolean) => {
      if (confirmed) {
        return;
      }
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content:
            "Action was declined. I can suggest an alternative approach if you want.",
        },
      ]);
    },
    [],
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
