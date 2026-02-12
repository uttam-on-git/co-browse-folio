"use client";

import { type KeyboardEvent, useRef, useState } from "react";
import { SendHorizontal } from "lucide-react";

export interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export default function ChatInput({ onSend, disabled = false }: ChatInputProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const autoResize = () => {
    const element = textareaRef.current;
    if (!element) {
      return;
    }

    element.style.height = "0px";
    element.style.height = `${Math.min(element.scrollHeight, 168)}px`;
  };

  const handleSubmit = () => {
    const message = value.trim();
    if (!message || disabled) {
      return;
    }

    onSend(message);
    setValue("");

    const element = textareaRef.current;
    if (element) {
      element.style.height = "0px";
    }
  };

  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div
      data-testid="chat-input"
      className="flex items-end gap-2 rounded-2xl border border-zinc-200 bg-white p-2 shadow-sm"
    >
      <textarea
        ref={textareaRef}
        value={value}
        disabled={disabled}
        onKeyDown={onKeyDown}
        onChange={(event) => {
          setValue(event.target.value);
          autoResize();
        }}
        rows={1}
        placeholder="Type your message..."
        className="min-h-10 max-h-[168px] w-full resize-none bg-transparent px-2 py-2 text-sm text-zinc-800 outline-none placeholder:text-zinc-400 disabled:cursor-not-allowed disabled:text-zinc-400"
      />
      <button
        type="button"
        onClick={handleSubmit}
        disabled={disabled || value.trim().length === 0}
        className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-900 text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:bg-zinc-300"
        aria-label="Send message"
      >
        <SendHorizontal className="h-4 w-4" />
      </button>
    </div>
  );
}
