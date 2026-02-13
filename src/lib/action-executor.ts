"use client";

import type { ActionResult } from "@/types";

type ScrollToSectionParams = {
  sectionId: string;
  behavior: ScrollBehavior;
};

type HighlightElementParams = {
  elementId: string;
  durationSeconds: number;
  color?: string;
};

type ClickElementParams = {
  elementId: string;
  requireConfirmation?: boolean;
};

type FillInputParams = {
  inputId: string;
  value: string;
};

type GetElementInfoParams = {
  elementId: string;
};

type ElementInfoResult = ActionResult & {
  data?: {
    tagName: string;
    textContent: string;
    visible: boolean;
    rect: {
      x: number;
      y: number;
      width: number;
      height: number;
      top: number;
      right: number;
      bottom: number;
      left: number;
    };
  };
};

function ensureBrowserContext(): ActionResult | null {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return {
      success: false,
      error: "Action execution is only available in the browser.",
    };
  }
  return null;
}

function getAvailableElementIds(): string[] {
  if (typeof document === "undefined") {
    return [];
  }
  return Array.from(document.querySelectorAll<HTMLElement>("[id]"))
    .map((element) => element.id)
    .filter(Boolean);
}

function buildNotFoundError(label: string, requestedId: string): ActionResult {
  const available = getAvailableElementIds();
  const preview = available.slice(0, 12).join(", ");
  const suffix = preview ? ` Available: ${preview}` : " No elements with ids found.";
  return {
    success: false,
    error: `${label} '${requestedId}' not found.${suffix}`,
  };
}

export function executeScrollToSection({
  sectionId,
  behavior,
}: ScrollToSectionParams): ActionResult {
  try {
    const browserError = ensureBrowserContext();
    if (browserError) {
      return browserError;
    }

    const section = document.getElementById(sectionId);
    if (!section) {
      return buildNotFoundError("Element", sectionId);
    }

    section.scrollIntoView({
      behavior,
      block: "start",
      inline: "nearest",
    });

    return {
      success: true,
      message: `Scrolled to ${sectionId[0]?.toUpperCase()}${sectionId.slice(1)}.`,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? `Failed to scroll: ${error.message}`
          : "Failed to scroll due to an unknown error.",
    };
  }
}

export function executeHighlightElement({
  elementId,
  durationSeconds,
  color,
}: HighlightElementParams): ActionResult {
  try {
    const browserError = ensureBrowserContext();
    if (browserError) {
      return browserError;
    }

    const element = document.getElementById(elementId);
    if (!element) {
      return buildNotFoundError("Element", elementId);
    }

    const highlightColor = color || "#3b82f6";
    const durationMs = Math.max(0, durationSeconds * 1000);

    const previousTransition = element.style.transition;
    const previousOutline = element.style.outline;
    const previousOutlineOffset = element.style.outlineOffset;
    const previousBoxShadow = element.style.boxShadow;

    element.style.transition = "box-shadow 200ms ease, outline-color 200ms ease";
    element.style.outline = `2px solid ${highlightColor}`;
    element.style.outlineOffset = "3px";
    element.style.boxShadow = `0 0 0 6px color-mix(in srgb, ${highlightColor} 30%, transparent)`;

    window.setTimeout(() => {
      try {
        element.style.transition = previousTransition;
        element.style.outline = previousOutline;
        element.style.outlineOffset = previousOutlineOffset;
        element.style.boxShadow = previousBoxShadow;
      } catch {
        // If the element unmounts before timeout, cleanup is skipped safely.
      }
    }, durationMs);

    return {
      success: true,
      message: `Highlighted element "${elementId}".`,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? `Failed to highlight element: ${error.message}`
          : "Failed to highlight element due to an unknown error.",
    };
  }
}

export function executeClickElement({
  elementId,
  requireConfirmation,
}: ClickElementParams): ActionResult {
  try {
    const browserError = ensureBrowserContext();
    if (browserError) {
      return browserError;
    }

    if (requireConfirmation) {
      return {
        success: true,
        message: "Click skipped because confirmation is required.",
      };
    }

    const element = document.getElementById(elementId);
    if (!element) {
      return buildNotFoundError("Element", elementId);
    }

    if (typeof (element as HTMLElement).click !== "function") {
      return {
        success: false,
        error: `Element '${elementId}' is not clickable.`,
      };
    }

    (element as HTMLElement).click();

    return {
      success: true,
      message: `Clicked element "${elementId}".`,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? `Failed to click element: ${error.message}`
          : "Failed to click element due to an unknown error.",
    };
  }
}

export function executeFillInput({
  inputId,
  value,
}: FillInputParams): ActionResult {
  try {
    const browserError = ensureBrowserContext();
    if (browserError) {
      return browserError;
    }

    const element = document.getElementById(inputId);
    if (!element) {
      return buildNotFoundError("Element", inputId);
    }

    if (
      !(
        element instanceof HTMLInputElement ||
        element instanceof HTMLTextAreaElement ||
        element instanceof HTMLSelectElement
      )
    ) {
      return {
        success: false,
        error: `Element '${inputId}' is not an input field.`,
      };
    }

    const nativeSetter =
      Object.getOwnPropertyDescriptor(
        Object.getPrototypeOf(element),
        "value",
      )?.set ||
      Object.getOwnPropertyDescriptor(
        HTMLInputElement.prototype,
        "value",
      )?.set ||
      Object.getOwnPropertyDescriptor(
        HTMLTextAreaElement.prototype,
        "value",
      )?.set;

    if (nativeSetter) {
      nativeSetter.call(element, value);
    } else {
      element.value = value;
    }

    element.dispatchEvent(new Event("input", { bubbles: true }));
    element.dispatchEvent(new Event("change", { bubbles: true }));

    return {
      success: true,
      message: `Filled input "${inputId}".`,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? `Failed to fill input: ${error.message}`
          : "Failed to fill input due to an unknown error.",
    };
  }
}

export function executeGetElementInfo({
  elementId,
}: GetElementInfoParams): ElementInfoResult {
  try {
    const browserError = ensureBrowserContext();
    if (browserError) {
      return browserError;
    }

    const element = document.getElementById(elementId);
    if (!element) {
      return buildNotFoundError("Element", elementId);
    }

    const rect = element.getBoundingClientRect();
    const computedStyle = window.getComputedStyle(element);
    const visible =
      computedStyle.display !== "none" &&
      computedStyle.visibility !== "hidden" &&
      computedStyle.opacity !== "0" &&
      rect.width > 0 &&
      rect.height > 0;

    return {
      success: true,
      message: `Retrieved info for "${elementId}".`,
      data: {
        tagName: element.tagName.toLowerCase(),
        textContent: (element.textContent || "").trim().slice(0, 200),
        visible,
        rect: {
          x: rect.x,
          y: rect.y,
          width: rect.width,
          height: rect.height,
          top: rect.top,
          right: rect.right,
          bottom: rect.bottom,
          left: rect.left,
        },
      },
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? `Failed to get element info: ${error.message}`
          : "Failed to get element info due to an unknown error.",
    };
  }
}

export function executeAction(
  toolName: string,
  params: Record<string, unknown>,
): ActionResult | ElementInfoResult {
  switch (toolName) {
    case "scroll_to_section":
      return executeScrollToSection(params as ScrollToSectionParams);
    case "highlight_element":
      return executeHighlightElement(params as HighlightElementParams);
    case "click_element":
      return executeClickElement(params as ClickElementParams);
    case "fill_input":
      return executeFillInput(params as FillInputParams);
    case "get_element_info":
      return executeGetElementInfo(params as GetElementInfoParams);
    default:
      return {
        success: false,
        error: `Unknown tool: ${toolName}`,
      };
  }
}
