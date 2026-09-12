"use client";

import React from "react";
import { motion } from "framer-motion";

interface SectionBlockProps {
  title: string;
  index: number;
  children: React.ReactNode;
  isActive: boolean;
  onFocus: () => void;
}

const SectionBlock = ({
  title,
  index,
  children,
  isActive,
  onFocus
}: SectionBlockProps) => (
  <motion.div
    onFocusCapture={onFocus}
    onClick={onFocus}
    animate={{
      opacity: isActive ? 1 : 0.4,
      scale: isActive ? 1 : 0.98,
      filter: isActive ? "blur(0px)" : "blur(1px)",
    }}
    transition={{ type: "spring", stiffness: 300, damping: 30 }}
    className="relative p-8 bg-surface border border-[var(--studio-border)] rounded-mono space-y-6 transition-colors duration-300"
  >
    <div className="flex justify-between items-center mb-4">
      <div className="flex items-center gap-3">
        <span className="text-xs font-mono text-muted">
          {(index + 1).toString().padStart(2, '0')}
        </span>
        <h3 className="text-lg font-heading tracking-tighter">{title}</h3>
      </div>
    </div>
    {children}
  </motion.div>
);

export default SectionBlock;
