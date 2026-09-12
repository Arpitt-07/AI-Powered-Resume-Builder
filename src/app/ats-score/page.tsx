"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { aiService } from "@/services/ai.service";
import AuthGuard from "@/components/shared/auth-guard";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import { FormProvider } from "react-hook-form";

const atsSchema = z.object({
  resumeText: z.string().min(100, "Please provide more resume text for a valid analysis"),
  jobDescription: z.string().optional(),
});

type AtsInput = z.infer<typeof atsSchema>;

export default function AtsScorePage() {
  const router = useRouter();
  const { mutate: calculateScore, data: result, isPending } = aiService.useAtsScore();
  const [step, setStep] = useState<"input" | "result">("input");

  const methods = useForm<AtsInput>({
    resolver: zodResolver(atsSchema),
    defaultValues: { resumeText: "", jobDescription: "" },
  });

  const onSubmit = (data: AtsInput) => {
    calculateScore(data, {
      onSuccess: () => setStep("result"),
      onError: (err) => alert(err.message),
    });
  };

  if (step === "result" && result) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-zinc-50 p-8">
          <div className="max-w-4xl mx-auto space-y-8">
            <header className="flex justify-between items-center">
              <h1 className="text-3xl font-bold tracking-tight text-zinc-900">ATS Analysis Report</h1>
              <Button variant="secondary" onClick={() => setStep("input")}>New Analysis</Button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-1 p-8 bg-white border border-zinc-200 rounded-[2.5rem] flex flex-col items-center justify-center text-center space-y-4">
                <div className="relative w-32 h-32 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="64" cy="64" r="58"
                      stroke="currentColor" strokeWidth="8"
                      fill="transparent"
                      className="text-zinc-100"
                    />
                    <circle
                      cx="64" cy="64" r="58"
                      stroke="currentColor" strokeWidth="8"
                      fill="transparent"
                      strokeDasharray={364}
                      strokeDashoffset={364 - (364 * result.overall_score) / 100}
                      className="text-zinc-900 transition-all duration-1000"
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="absolute text-4xl font-bold">{result.overall_score}%</span>
                </div>
                <h3 className="text-xl font-bold">Overall Score</h3>
              </div>

              <div className="md:col-span-2 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {Object.entries(result.category_scores).map(([cat, score]) => (
                    <div key={cat} className="p-4 bg-white border border-zinc-200 rounded-2xl space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-zinc-500 capitalize">{cat.replace("_", " ")}</span>
                        <span className="font-bold">{score}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden">
                        <div className="h-full bg-zinc-900 transition-all duration-500" style={{ width: `${score}%` }} />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 bg-white border border-zinc-200 rounded-2xl space-y-4">
                    <h4 className="font-bold text-red-600 flex items-center gap-2">Critical Issues</h4>
                    <ul className="space-y-2">
                      {result.critical_issues.map((issue, i) => (
                        <li key={i} className="text-sm text-zinc-600 flex gap-2">
                          <span className="text-red-500">•</span> {issue}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-6 bg-white border border-zinc-200 rounded-2xl space-y-4">
                    <h4 className="font-bold text-emerald-600 flex items-center gap-2">Strengths</h4>
                    <ul className="space-y-2">
                      {result.strengths.map((s, i) => (
                        <li key={i} className="text-sm text-zinc-600 flex gap-2">
                          <span className="text-emerald-500">•</span> {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="p-6 bg-zinc-900 text-white rounded-2xl space-y-4">
                  <h4 className="font-bold">Missing Keywords</h4>
                  <div className="flex flex-wrap gap-2">
                    {result.missing_keywords.map((k, i) => (
                      <span key={i} className="px-3 py-1 bg-zinc-800 border border-zinc-700 rounded-full text-xs">
                        {k}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-zinc-50 p-8">
        <div className="max-w-2xl mx-auto space-y-8">
          <header className="text-center space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900">ATS Scanner</h1>
            <p className="text-zinc-500">Check how well your resume matches the job description.</p>
          </header>

          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-zinc-700">Resume Text</label>
                <textarea
                  {...methods.register("resumeText")}
                  className="px-4 py-3 rounded-xl border border-zinc-200 focus:border-zinc-800 focus:ring-2 focus:ring-zinc-100 outline-none min-h-[200px]"
                  placeholder="Paste your resume content here..."
                />
                {methods.formState.errors.resumeText && <span className="text-xs text-red-500">{methods.formState.errors.resumeText.message}</span>}
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-zinc-700">Job Description (Optional)</label>
                <textarea
                  {...methods.register("jobDescription")}
                  className="px-4 py-3 rounded-xl border border-zinc-200 focus:border-zinc-800 focus:ring-2 focus:ring-zinc-100 outline-none min-h-[150px]"
                  placeholder="Paste the job description to get a tailored score..."
                />
              </div>

              <Button type="submit" className="w-full" isLoading={isPending}>
                Analyze Resume
              </Button>
            </form>
          </FormProvider>
        </div>
      </div>
    </AuthGuard>
  );
}
