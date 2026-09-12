"use client";

import React from "react";
import { UseFormReturn } from "react-hook-form";
import { UIResume } from "@/types/form.types";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import SectionBlock from "../section-block";

interface GeneralSectionProps {
  index: number;
  isActive: boolean;
  onFocus: () => void;
  methods: UseFormReturn<UIResume>;
  handleGenerateSummary: () => void;
  handleImproveContent: (field: string, value: string) => void;
  isGeneratingSummary: boolean;
  isImproving: boolean;
}

export default function GeneralSection({
  index,
  isActive,
  onFocus,
  methods,
  handleGenerateSummary,
  handleImproveContent,
  isGeneratingSummary,
  isImproving,
}: GeneralSectionProps) {
  const { register, watch } = methods;

  const formErrors = methods.formState.errors;

  return (
    <SectionBlock title="General Information" index={index} isActive={isActive} onFocus={onFocus}>
      <div className="flex justify-end items-center mb-4">
        <Button
          type="button"
          variant="secondary"
          className="text-xs h-8 px-3 rounded-mono"
          onClick={handleGenerateSummary}
          isLoading={isGeneratingSummary}
        >
          Generate Summary
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input name="title" label="Resume Title" error={formErrors.title?.message} />
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-muted">Summary</label>
            <Button
              type="button"
              variant="ghost"
              className="text-xs h-7 px-2 rounded-mono"
              onClick={() => handleImproveContent("summary", watch("summary") || "")}
              isLoading={isImproving}
            >
              Improve
            </Button>
          </div>
          <textarea
            {...register("summary")}
            className="px-4 py-3 rounded-mono border border-[var(--studio-border)] bg-background focus:border-foreground focus:ring-1 focus:ring-foreground outline-none min-h-[120px] text-foreground transition-all duration-200"
            placeholder="Write a compelling professional summary..."
          />
          {formErrors.summary && <span className="text-xs text-accent-red-text">{formErrors.summary?.message}</span>}
        </div>
      </div>
    </SectionBlock>
  );
}
