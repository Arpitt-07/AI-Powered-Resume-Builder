"use client";

import { useParams } from "next/navigation";
import { useResume } from "@/services/resume.service";
import AuthGuard from "@/components/shared/auth-guard";
import ResumeForm from "@/components/features/editor/resume-form";
import ResumePreview from "@/components/features/editor/resume-preview";
import { motion } from "framer-motion";
import { useResumeStore } from "@/store/resume-store";
import { useEffect, useState } from "react";
import Button from "@/components/ui/button";
import StudioSidebar from "@/components/features/editor/studio-sidebar";
import { List, X } from "@phosphor-icons/react";
import clsx from "clsx";

const FadeIn = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
  >
    {children}
  </motion.div>
);

export default function EditorPage() {
  const { id } = useParams();
  const { data: resume, isLoading, error } = useResume(id as string);
  const { setResumeData, undo, redo } = useResumeStore();
  const [view, setView] = useState<'edit' | 'preview'>('edit');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    if (resume) {
      setResumeData(resume, false);
    }
  }, [resume, setResumeData]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        undo();
      } else if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.shiftKey && e.key === 'Z'))) {
        e.preventDefault();
        redo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);

  return (
    <AuthGuard>
      <div className="h-screen flex overflow-hidden bg-background text-foreground">
        <StudioSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-16 flex-shrink-0 bg-background/80 backdrop-blur-md border-b border-[var(--studio-border)] px-4 md:px-8 flex justify-between items-center z-10">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                className="md:hidden h-8 w-8 p-0 rounded-mono"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              >
                {isSidebarOpen ? <X size={18} /> : <List size={18} />}
              </Button>
              <div className="space-y-0.5">
                <h1 className="text-lg md:text-xl tracking-tighter font-heading leading-none">Document Editor</h1>
                <p className="text-muted text-[10px] uppercase tracking-widest font-mono">
                  ID: {id}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="secondary"
                className="text-[10px] h-7 px-3 rounded-mono"
                onClick={() => {
                  const printContent = document.getElementById("resume-print-area");
                  if (!printContent) return;

                  const printWindow = window.open("", "_blank");
                  if (!printWindow) return;

                  const styles = Array.from(document.styleSheets)
                    .map(sheet => {
                      try {
                        return Array.from(sheet.cssRules)
                          .map(rule => rule.cssText)
                          .join("\n");
                      } catch (e) {
                        return "";
                      }
                    })
                    .join("\n");

                  printWindow.document.write(`
                    <html>
                      <head>
                        <title>Print Resume</title>
                        <style>
                          ${styles}
                          body { background: white !important; padding: 0 !important; margin: 0 !important; }
                          @page { margin: 0; }
                          #resume-print-area { scale: 1 !important; transform: none !important; }
                        </style>
                      </head>
                      <body onload="window.print(); window.close();">
                        ${printContent.innerHTML}
                      </body>
                    </html>
                  `);
                  printWindow.document.close();
                }}
              >
                Download PDF
              </Button>
            </div>
          </header>

          <main className="flex-1 overflow-hidden flex relative">
            {isLoading ? (
              <div className="flex items-center justify-center w-full h-full">
                <div className="w-6 h-6 border-2 border-[var(--studio-border)] border-t-foreground rounded-full animate-spin" />
              </div>
            ) : error ? (
              <div className="flex items-center justify-center w-full h-full p-6">
                <div className="max-w-md w-full p-8 border border-[var(--studio-border)] bg-surface rounded-mono text-center space-y-4">
                  <p className="font-medium text-accent-red-text">Failed to load resume</p>
                  <p className="text-sm text-muted">{error.message}</p>
                </div>
              </div>
            ) : (
              <>
                <div className={clsx(
                  "flex-1 overflow-y-auto transition-all duration-300",
                  view === 'preview' ? "hidden lg:block" : "block"
                )}>
                  <div className="p-4 md:p-8 max-w-4xl mx-auto">
                    <ResumeForm resumeId={id as string} initialData={resume} />
                  </div>
                </div>
                <div className={clsx(
                  "w-full lg:w-[1000px] border-l border-[var(--studio-border)] overflow-y-auto transition-all duration-300 bg-surface/30",
                  view === 'edit' ? "hidden lg:block" : "block"
                )}>
                  <div className="p-4 md:p-8 h-full">
                    <ResumePreview />
                  </div>
                </div>
              </>
            )}
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
