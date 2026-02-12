import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function formatTimestamp(
  value: Date | number | string,
  locale: string = "en-US",
): string {
  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat(locale, {
    hour: "2-digit",
    minute: "2-digit",
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(date);
}

export function scrollToElement(
  target: string | Element | null,
  options?: ScrollIntoViewOptions,
): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  const element =
    typeof target === "string" ? document.querySelector(target) : target;

  if (!element) {
    return false;
  }

  element.scrollIntoView({
    behavior: "smooth",
    block: "center",
    inline: "nearest",
    ...options,
  });

  return true;
}
