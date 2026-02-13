"use client";

import { motion } from "framer-motion";

export default function MessageSkeleton() {
  return (
    <motion.div
      data-testid="message-skeleton"
      initial={{ opacity: 0.4 }}
      animate={{ opacity: [0.4, 0.8, 0.4] }}
      transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
      className="max-w-[72%] rounded-2xl bg-zinc-200 px-4 py-3"
    >
      <div className="h-2.5 w-16 rounded bg-zinc-300" />
      <div className="mt-3 h-2.5 w-48 rounded bg-zinc-300" />
      <div className="mt-2 h-2.5 w-32 rounded bg-zinc-300" />
    </motion.div>
  );
}
