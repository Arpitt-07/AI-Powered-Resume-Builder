"use client";

import React from "react";
import { UseFormReturn, useFieldArray, FieldErrors } from "react-hook-form";
import { UIResume, UIEducation } from "@/types/form.types";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import SectionBlock from "../section-block";

interface EducationSectionProps {
  index: number;
  isActive: boolean;
  onFocus: () => void;
  methods: UseFormReturn<UIResume>;
}

export default function EducationSection({
  index,
  isActive,
  onFocus,
  methods,
}: EducationSectionProps) {
  const { control } = methods;
  const formErrors = methods.formState.errors;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "education",
  });

  return (
    <SectionBlock title="Education" index={index} isActive={isActive} onFocus={onFocus}>
      <div className="flex justify-end items-center mb-4">
        <Button
          type="button"
          variant="secondary"
          className="text-xs h-8 px-3 rounded-mono"
          onClick={() => append({ degree: "", institution: "", startDate: "" })}
        >
          Add Education
        </Button>
      </div>
      <div className="space-y-4">
        {fields.map((field, eduIndex) => (
          <div key={field.id} className="p-6 bg-background border border-[var(--studio-border)] rounded-mono space-y-4 relative group">
            <Button
              variant="ghost"
              className="absolute top-4 right-4 text-accent-red-text hover:text-red-600"
              type="button"
              onClick={() => remove(eduIndex)}
            >
              Remove
            </Button>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input name={`education.${eduIndex}.degree`} label="Degree" error={(formErrors.education?.[eduIndex] as FieldErrors<UIEducation>)?.degree?.message} />
              <Input name={`education.${eduIndex}.institution`} label="Institution" error={(formErrors.education?.[eduIndex] as FieldErrors<UIEducation>)?.institution?.message} />
              <Input name={`education.${eduIndex}.startDate`} label="Start Date" error={(formErrors.education?.[eduIndex] as FieldErrors<UIEducation>)?.startDate?.message} />
            </div>
          </div>
        ))}
      </div>
    </SectionBlock>
  );
}
