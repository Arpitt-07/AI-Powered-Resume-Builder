"use client";

import { UseFormReturn } from "react-hook-form";
import { ResumeFormValues } from "@/types/form.types";
import SectionBlock from "../section-block";

interface SkillsSectionProps {
  index: number;
  isActive: boolean;
  onFocus: () => void;
  methods: UseFormReturn<ResumeFormValues>;
}

export default function SkillsSection({
  index,
  isActive,
  onFocus,
  methods,
}: SkillsSectionProps) {
  const { register } = methods;
  const formErrors = methods.formState.errors;

  return (
    <SectionBlock title="Skills & Certifications" index={index} isActive={isActive} onFocus={onFocus}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-muted">Technical Skills (Comma separated)</label>
            <textarea
              {...register("skills")}
              className="px-4 py-3 rounded-mono border border-[var(--studio-border)] bg-background focus:border-foreground focus:ring-1 focus:ring-foreground outline-none min-h-[100px] text-foreground transition-all duration-200"
              placeholder="React, Next.js, TypeScript..."
            />
            {formErrors.skills && <span className="text-xs text-accent-red-text">{formErrors.skills.message}</span>}
          </div>
        </div>
        <div className="space-y-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-muted">Certifications (Comma separated)</label>
            <textarea
              {...register("certifications")}
              className="px-4 py-3 rounded-mono border border-[var(--studio-border)] bg-background focus:border-foreground focus:ring-1 focus:ring-foreground outline-none min-h-[100px] text-foreground transition-all duration-200"
              placeholder="AWS Certified..."
            />
            {formErrors.certifications && <span className="text-xs text-accent-red-text">{formErrors.certifications.message}</span>}
          </div>
        </div>
      </div>
    </SectionBlock>
  );
}
