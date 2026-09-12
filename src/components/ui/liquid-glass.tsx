"use client";

import React from "react";
import { motion } from "framer-motion";
import { ReactNode } from "react";
import clsx from "clsx";

interface LiquidGlassProps {
  children: ReactNode;
  className?: string;
  intensity?: "low" | "medium" | "high";
}

export default function LiquidGlass({
  children,
  className = "",
  intensity = "medium"
}: LiquidGlassProps) {
  const intensityStyles = {
    low: "backdrop-blur-sm bg-white/[0.01]",
    medium: "backdrop-blur-md bg-white/[0.03]",
    high: "backdrop-blur-xl bg-white/[0.05]",
  };

  return (
    <div className={clsx(
      "relative overflow-hidden transition-all duration-300",
      intensityStyles[intensity],
      className
    )}>
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]" />

      <div className="absolute inset-0 pointer-events-none border border-white/10 rounded-[inherit]" />

      <div className="absolute inset-0 pointer-events-none shadow-2xl shadow-black/50" />

      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
