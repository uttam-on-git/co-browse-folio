"use client";

import { motion } from "framer-motion";

export default function TypingIndicator() {
  return (
    <div
      data-testid="typing-indicator"
      className="inline-flex h-10 items-center gap-2"
      aria-label="AI is typing"
    >
      {[0, 1, 2].map((index) => (
        <motion.span
          key={index}
          className="h-2 w-2 rounded-full bg-blue-500"
          animate={{ y: [0, -10, 0] }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeInOut",
            delay: index * 0.2,
          }}
        />
      ))}
    </div>
  );
}
