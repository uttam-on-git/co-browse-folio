"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type {
  PageContent,
  PageElement,
  PageSection,
  PageSectionType,
} from "@/types";

const EXTRACTION_DEBOUNCE_MS = 300;

function inferSectionType(sectionId: string): PageSectionType {
  switch (sectionId) {
    case "hero":
      return "hero";
    case "projects":
      return "projects";
    case "about":
      return "about";
    case "contact":
      return "contact";
    default:
      return "other";
  }
}

function normalizeText(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function getInteractiveType(
  element: Element,
): "button" | "link" | "input" | "other" {
  const tagName = element.tagName.toLowerCase();

  if (tagName === "button") {
    return "button";
  }
  if (tagName === "a") {
    return "link";
  }
  if (tagName === "input" || tagName === "textarea" || tagName === "select") {
    return "input";
  }
  return "other";
}

function getInteractiveText(element: Element): string {
  if (
    element instanceof HTMLInputElement ||
    element instanceof HTMLTextAreaElement ||
    element instanceof HTMLSelectElement
  ) {
    return normalizeText(
      element.value ||
        element.getAttribute("placeholder") ||
        element.getAttribute("aria-label") ||
        "",
    );
  }

  return normalizeText(element.textContent || element.getAttribute("aria-label") || "");
}

function extractSectionContent(section: HTMLElement): PageSection {
  const sectionText = normalizeText(section.textContent || "").slice(0, 500);
  const heading = normalizeText(
    section.querySelector("h1, h2")?.textContent || "",
  );

  const interactiveElements: PageElement[] = Array.from(
    section.querySelectorAll("button, a[href], input, textarea, select"),
  ).map((element, index) => ({
    id: element.id || `${section.id}-interactive-${index}`,
    type: getInteractiveType(element),
    tagName: element.tagName.toLowerCase(),
    text: getInteractiveText(element),
  }));

  return {
    id: section.id,
    type: inferSectionType(section.id),
    heading,
    text: sectionText,
    elements: interactiveElements,
    interactiveElements,
  };
}

export function useContentExtractor() {
  const [pageContent, setPageContent] = useState<PageContent>({ sections: [] });
  const [visibleSectionIds, setVisibleSectionIds] = useState<string[]>([]);

  const observerRef = useRef<IntersectionObserver | null>(null);
  const sectionsRef = useRef<HTMLElement[]>([]);
  const visibilityMapRef = useRef<Map<string, boolean>>(new Map());
  const debounceTimerRef = useRef<number | null>(null);

  const extractVisibleContent = useCallback(() => {
    const visibleSections = sectionsRef.current.filter((section) =>
      visibleSectionIds.includes(section.id),
    );
    const extractedSections = visibleSections.map(extractSectionContent);

    setPageContent({ sections: extractedSections });
  }, [visibleSectionIds]);

  const scheduleExtraction = useCallback(() => {
    if (debounceTimerRef.current !== null) {
      window.clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = window.setTimeout(() => {
      extractVisibleContent();
      debounceTimerRef.current = null;
    }, EXTRACTION_DEBOUNCE_MS);
  }, [extractVisibleContent]);

  const refreshContent = useCallback(() => {
    extractVisibleContent();
  }, [extractVisibleContent]);

  useEffect(() => {
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("[data-section], section[id]"),
    ).filter((section) => Boolean(section.id));

    sectionsRef.current = sections;
    visibilityMapRef.current = new Map(sections.map((section) => [section.id, false]));

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const target = entry.target as HTMLElement;
          visibilityMapRef.current.set(target.id, entry.isIntersecting);
        });

        const visibleIds = sections
          .filter((section) => visibilityMapRef.current.get(section.id))
          .map((section) => section.id);

        setVisibleSectionIds(visibleIds);
      },
      { threshold: 0.3 },
    );

    sections.forEach((section) => {
      observerRef.current?.observe(section);
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
      if (debounceTimerRef.current !== null) {
        window.clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    scheduleExtraction();
  }, [visibleSectionIds, scheduleExtraction]);

  return {
    pageContent,
    visibleSectionIds,
    refreshContent,
  };
}
