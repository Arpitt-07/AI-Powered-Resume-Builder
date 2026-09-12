"use client";

import React, { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ReactNode } from "react";
import clsx from "clsx";

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}

export default function MagneticButton({
  children,
  className = "",
  onClick,
  disabled = false,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 150, damping: 15 });
  const springY = useSpring(mouseY, { stiffness: 150, damping: 15 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;

    mouseX.set(distanceX * 0.3);
    mouseY.set(distanceY * 0.3);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      className={clsx(
        "relative inline-block will-change-transform",
        className
      )}
    >
      <motion.div
        style={{ x: useTransform(springX, (v) => v * 0.5), y: useTransform(springY, (v) => v * 0.5) }}
        className="relative z-10"
      >
        <button
          onClick={onClick}
          disabled={disabled}
          className={clsx(
            "relative transition-transform active:scale-95",
            disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
          )}
        >
          {children}
        </button>
      </motion.div>
    </motion.div>
  );
}
