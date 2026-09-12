"use client";

import React, { useState } from "react";
import { useResumeStore } from "@/store/resume-store";
import Button from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { CaretLeft, CaretRight, SquaresFour, GearSix, List } from "@phosphor-icons/react";
import clsx from "clsx";

interface StudioSidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export default function StudioSidebar({ isOpen, setIsOpen }: StudioSidebarProps) {
  const { sectionOrder, activeSection, setActiveSection } = useResumeStore();

  return (
    <motion.aside
      initial={false}
      animate={{
        width: isOpen ? 260 : 0,
        opacity: isOpen ? 1 : 0,
        x: isOpen ? 0 : -260
      }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="h-full bg-surface border-r border-[var(--studio-border)] overflow-hidden flex flex-col"
    >
      <div className="p-6 w-[260px] flex flex-col h-full">
        <div className="flex items-center gap-2 mb-10">
          <div className="w-6 h-6 bg-foreground rounded-mono flex items-center justify-center">
            <div className="w-3 h-3 bg-background rounded-full" />
          </div>
          <span className="font-heading text-lg tracking-tighter">Studio</span>
        </div>

        <nav className="space-y-8 flex-1">
          <div>
            <h4 className="text-[10px] uppercase tracking-[0.2em] text-muted mb-4 font-medium px-2">
              Document Structure
            </h4>
            <div className="space-y-1">
              {sectionOrder.map((section, index) => (
                <button
                  key={section}
                  onClick={() => setActiveSection(section)}
                  className={clsx(
                    "w-full text-left px-3 py-2 rounded-mono text-sm transition-all duration-200 flex items-center gap-3 group",
                    activeSection === section
                      ? "bg-foreground text-background font-medium"
                      : "text-muted hover:text-foreground hover:bg-surface"
                  )}
                >
                  <span className={clsx(
                    "text-[10px] font-mono w-4",
                    activeSection === section ? "text-background/60" : "text-muted/60"
                  )}>
                    {(index + 1).toString().padStart(2, '0')}
                  </span>
                  <span className="capitalize">{section.replace(/([A-Z])/g, ' $1')}</span>
                  {activeSection === section && (
                    <motion.div
                      layoutId="sidebar-active"
                      className="ml-auto w-1 h-1 bg-background rounded-full"
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-[10px] uppercase tracking-[0.2em] text-muted mb-4 font-medium px-2">
              Global Settings
            </h4>
            <div className="space-y-1">
              <button className="w-full text-left px-3 py-2 rounded-mono text-sm text-muted hover:text-foreground hover:bg-surface transition-all duration-200 flex items-center gap-3 group">
                <GearSix size={14} />
                <span>Visual Identity</span>
              </button>
              <button className="w-full text-left px-3 py-2 rounded-mono text-sm text-muted hover:text-foreground hover:bg-surface transition-all duration-200 flex items-center gap-3 group">
                <SquaresFour size={14} />
                <span>Layout Presets</span>
              </button>
            </div>
          </div>
        </nav>

        <div className="mt-auto pt-6 border-t border-[var(--studio-border)]">
          <div className="p-3 rounded-mono bg-background border border-[var(--studio-border)] text-[10px] text-muted font-mono">
            BUILD: 2.0.4-STABLE
          </div>
        </div>
      </div>
    </motion.aside>
  );
}
