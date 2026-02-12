"use client";

import { motion } from "framer-motion";

const dotTransition = {
  duration: 0.8,
  repeat: Infinity,
  ease: "easeInOut" as const,
};

export default function TypingIndicator() {
  return (
    <div
      data-testid="typing-indicator"
      className="inline-flex items-center gap-1.5 rounded-full bg-zinc-200 px-3 py-2"
      aria-label="AI is typing"
    >
      {[0, 1, 2].map((index) => (
        <motion.span
          key={index}
          className="h-2 w-2 rounded-full bg-zinc-500"
          animate={{ opacity: [0.35, 1, 0.35], y: [0, -2, 0] }}
          transition={{ ...dotTransition, delay: index * 0.14 }}
        />
      ))}
    </div>
  );
}
