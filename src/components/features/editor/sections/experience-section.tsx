"use client";

import React from "react";
import { UseFormReturn, useFieldArray, FieldErrors } from "react-hook-form";
import { UIResume, UIWorkExperience } from "@/types/form.types";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import SectionBlock from "../section-block";

interface ExperienceSectionProps {
  index: number;
  isActive: boolean;
  onFocus: () => void;
  methods: UseFormReturn<UIResume>;
  handleImproveContent: (field: string, value: string) => void;
  isImproving: boolean;
}

export default function ExperienceSection({
  index,
  isActive,
  onFocus,
  methods,
  handleImproveContent,
  isImproving,
}: ExperienceSectionProps) {
  const { register, watch, control } = methods;
  const formErrors = methods.formState.errors;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "workExperience",
  });

  return (
    <SectionBlock title="Work Experience" index={index} isActive={isActive} onFocus={onFocus}>
      <div className="flex justify-end items-center mb-4">
        <Button
          type="button"
          variant="secondary"
          className="text-xs h-8 px-3 rounded-mono"
          onClick={() => append({ company: "", title: "", startDate: "", description: "" })}
        >
          Add Experience
        </Button>
      </div>
      <div className="space-y-4">
        {fields.map((field, expIndex) => (
          <div key={field.id} className="p-6 bg-background border border-[var(--studio-border)] rounded-mono space-y-4 relative group">
            <Button
              variant="ghost"
              className="absolute top-4 right-4 text-accent-red-text hover:text-red-600"
              type="button"
              onClick={() => remove(expIndex)}
            >
              Remove
            </Button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input name={`workExperience.${expIndex}.company`} label="Company" error={(formErrors.workExperience?.[expIndex] as FieldErrors<UIWorkExperience>)?.company?.message} />
              <Input name={`workExperience.${expIndex}.title`} label="Job Title" error={(formErrors.workExperience?.[expIndex] as FieldErrors<UIWorkExperience>)?.title?.message} />
              <Input name={`workExperience.${expIndex}.startDate`} label="Start Date" error={(formErrors.workExperience?.[expIndex] as FieldErrors<UIWorkExperience>)?.startDate?.message} />
              <Input name={`workExperience.${expIndex}.endDate`} label="End Date" />
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-muted">Description</label>
                <Button
                  type="button"
                  variant="ghost"
                  className="text-xs h-7 px-2 rounded-mono"
                  onClick={() => handleImproveContent(`workExperience.${expIndex}.description`, watch(`workExperience.${expIndex}.description`) || "")}
                  isLoading={isImproving}
                >
                  Improve
                </Button>
              </div>
              <textarea
                {...register(`workExperience.${expIndex}.description`)}
                className="px-4 py-3 rounded-mono border border-[var(--studio-border)] bg-background focus:border-foreground focus:ring-1 focus:ring-foreground outline-none min-h-[100px] text-foreground transition-all duration-200"
              />
              {(formErrors.workExperience?.[expIndex] as FieldErrors<UIWorkExperience>)?.description && (
                <span className="text-xs text-accent-red-text">
                  {(formErrors.workExperience?.[expIndex] as FieldErrors<UIWorkExperience>)?.description?.message}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </SectionBlock>
  );
}
