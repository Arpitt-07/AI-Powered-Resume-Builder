"use client";

import { useAuth } from "@/hooks/use-auth";
import AuthGuard from "@/components/shared/auth-guard";
import Button from "@/components/ui/button";
import { useLogout } from "@/services/auth.service";
import { useRouter } from "next/navigation";
import { useGetResumes, useDeleteResume } from "@/services/resume.service";
import Link from "next/link";
import { motion } from "framer-motion";

const FadeIn = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
  >
    {children}
  </motion.div>
);

export default function DashboardPage() {
  const { user } = useAuth();
  const { mutate: logout } = useLogout();
  const router = useRouter();
  const { data: resumesResponse, isPending } = useGetResumes();
  const { mutate: deleteResume, isPending: isDeleting } = useDeleteResume();

  const resumes = resumesResponse?.resumes || [];

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this resume? This action cannot be undone.")) {
      deleteResume(id);
    }
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background text-foreground p-8">
        <div className="max-w-5xl mx-auto space-y-12">
          <header className="flex justify-between items-end border-b border-border pb-8">
            <div className="space-y-1">
              <h1 className="text-4xl tracking-tighter font-heading">Management</h1>
              <p className="text-muted text-sm uppercase tracking-widest font-medium">
                Account: {user?.name || "Professional"}
              </p>
            </div>
            <Button
              variant="ghost"
              onClick={() => logout()}
              className="rounded-mono border border-transparent hover:border-border transition-all"
            >
              Sign Out
            </Button>
          </header>

          <div className="grid grid-cols-12 gap-8">
            <div className="col-span-12 lg:col-span-8 space-y-8">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl tracking-tight font-heading">Your Documents</h2>
                <Link
                  href="/resumes/create"
                  className="inline-flex items-center justify-center bg-primary text-white rounded-mono px-4 py-2 text-sm font-medium transition-all duration-200 hover:opacity-90 active:scale-95 shadow-sm"
                >
                  + New Resume
                </Link>
              </div>

              {isPending ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-32 bg-surface border border-border rounded-mono animate-pulse" />
                  ))}
                </div>
              ) : resumes.length === 0 ? (
                <div className="p-12 border border-dashed border-border rounded-mono text-center space-y-4">
                  <p className="text-muted">No resumes found in your architecture.</p>
                  <Link
                    href="/resumes/create"
                    className="text-foreground font-medium underline underline-offset-4 hover:text-muted transition-colors"
                  >
                    Create your first document
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {resumes.map((resume, i) => (
                    <FadeIn key={resume._id} delay={i * 0.05}>
                      <div className="group relative p-6 border border-border bg-background rounded-mono transition-all duration-200 hover:border-zinc-400 hover:shadow-sm">
                        <Link
                          href={`/editor/${resume._id}`}
                          className="block"
                        >
                          <div className="flex justify-between items-start mb-4">
                            <h3 className="font-heading text-xl truncate group-hover:text-zinc-500 transition-colors">
                              {resume.title || "Untitled Resume"}
                            </h3>
                            <span className="text-[10px] uppercase tracking-widest text-muted font-mono">
                              {resume.updatedAt ? new Date(resume.updatedAt).toLocaleDateString() : ""}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted">Edit Document</span>
                            <span className="text-xs font-medium transition-transform group-hover:translate-x-1">
                              →
                            </span>
                          </div>
                        </Link>
                        <Button
                          variant="ghost"
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-accent-red-text hover:bg-red-50 rounded-mono h-7 px-2 text-[10px]"
                          onClick={(e) => {
                            e.preventDefault();
                            if (resume._id) {
                              handleDelete(resume._id);
                            }
                          }}
                        >
                          Delete
                        </Button>
                      </div>
                    </FadeIn>
                  ))}
                </div>
              )}
            </div>

            <div className="col-span-12 lg:col-span-4 space-y-8">
              <div className="p-8 bg-surface border border-border rounded-mono space-y-6">
                <h3 className="text-xl tracking-tight font-heading">System Health</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 border border-border bg-background rounded-mono">
                    <span className="text-xs text-muted">ATS Readiness</span>
                    <span className="text-xs font-bold text-accent-blue-text">70%</span>
                  </div>
                  <div className="flex justify-between items-center p-3 border border-border bg-background rounded-mono">
                    <span className="text-xs text-muted">Critical Issues</span>
                    <span className="text-xs font-bold text-accent-red-text">3</span>
                  </div>
                </div>
                <Link
                  href="/ats-score"
                  className="block w-full text-center py-3 border border-border rounded-mono text-sm font-medium hover:bg-background transition-colors"
                >
                  Run Full Analysis
                </Link>
              </div>

              <div className="p-8 bg-foreground text-background rounded-mono space-y-4">
                <h3 className="text-xl tracking-tight font-heading">Pro Tip</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  Recruiters spend an average of 6 seconds on a resume. Use our structural guidelines to ensure your value proposition is immediate.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
