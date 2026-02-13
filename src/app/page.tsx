"use client";

import { useEffect } from "react";
import ChatWidget from "@/components/chat/ChatWidget";
import ChatProvider, { useChatContext } from "@/components/ChatProvider";
import AboutSection from "@/components/sections/AboutSection";
import ContactSection from "@/components/sections/ContactSection";
import HeroSection from "@/components/sections/HeroSection";
import ProjectsSection from "@/components/sections/ProjectsSection";

function PortfolioPageContent() {
  const { messages, isLoading, isExecutingAction, sendMessage, clearChat } =
    useChatContext();

  useEffect(() => {
    document.title = "Romendra | Full-Stack Developer Portfolio";

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
      "Portfolio of Romendra, a full-stack developer shipping real projects and actively seeking a first full-time role.",
    );
    upsertMeta(
      'meta[property="og:title"]',
      "property",
      "Romendra | Full-Stack Developer Portfolio",
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
        onResetChat={clearChat}
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
