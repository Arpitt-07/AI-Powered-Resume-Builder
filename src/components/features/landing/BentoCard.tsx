"use client";

import React from "react";
import { motion } from "framer-motion";
import { ReactNode } from "react";

interface BentoCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export default function BentoCard({ children, className = "", delay = 0 }: BentoCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.8,
        delay,
        ease: [0.16, 1, 0.3, 1]
      }}
      animate={{
        y: [0, -4, 0],
      }}
      transition={{
        y: {
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: delay * 0.5,
        },
        opacity: { duration: 0.8 },
        y: { duration: 0.8 },
      }}
      whileHover={{
        borderColor: "rgba(255, 255, 255, 0.2)",
        scale: 1.01,
      }}
      className={`relative group p-8 border border-[var(--studio-border)] bg-background rounded-mono transition-colors duration-300 ${className}`}
    >
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-mono">
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.03), transparent)",
            backgroundSize: "200% 100%",
            animation: "shimmer 3s infinite linear",
          }}
        />
      </div>

      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
}
