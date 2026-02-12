"use client";

import { useEffect } from "react";
import ChatWidget from "@/components/chat/ChatWidget";
import ChatProvider, { useChatContext } from "@/components/ChatProvider";
import AboutSection from "@/components/sections/AboutSection";
import ContactSection from "@/components/sections/ContactSection";
import HeroSection from "@/components/sections/HeroSection";
import ProjectsSection from "@/components/sections/ProjectsSection";
import type { ChatMessage, ToolCall } from "@/types";

function PortfolioPageContent() {
  const { messages, isLoading, isExecutingAction, sendMessage, confirmToolCall } =
    useChatContext();

  useEffect(() => {
    document.title = "Alex Carter | Full-Stack Engineer Portfolio";

    const upsertMeta = (selector: string, key: "name" | "property", value: string) => {
      let element = document.head.querySelector<HTMLMetaElement>(selector);
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(key, selector.includes("description") ? "description" : "og:title");
        document.head.appendChild(element);
      }
      element.setAttribute("content", value);
    };

    upsertMeta(
      'meta[name="description"]',
      "name",
      "Portfolio of Alex Carter, a senior full-stack engineer building scalable web products.",
    );
    upsertMeta(
      'meta[property="og:title"]',
      "property",
      "Alex Carter | Full-Stack Engineer Portfolio",
    );
  }, []);

  return (
    <main className="relative min-h-screen bg-white text-zinc-900">
      <HeroSection />
      <ProjectsSection />
      <AboutSection />
      <ContactSection />
      <ChatWidget
        onSendMessage={sendMessage}
        messages={messages}
        isLoading={isLoading}
        isExecutingAction={isExecutingAction}
        onConfirmToolCall={(toolCall: ToolCall) =>
          confirmToolCall(toolCall.id, true)
        }
        onCancelToolCall={(toolCall: ToolCall) =>
          confirmToolCall(toolCall.id, false)
        }
      />
    </main>
  );
}

export default function HomePage() {
  return (
    <ChatProvider>
      <PortfolioPageContent />
    </ChatProvider>
  );
}
