"use client";

import { UseFormReturn, useFieldArray, FieldErrors } from "react-hook-form";
import { ResumeFormValues, UIProject } from "@/types/form.types";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import SectionBlock from "../section-block";
import BulletList from "./bullet-list";

interface ProjectSectionProps {
  index: number;
  isActive: boolean;
  onFocus: () => void;
  methods: UseFormReturn<ResumeFormValues>;
  handleImproveContent: (field: string, value: string) => void;
  isImproving: boolean;
}

export default function ProjectSection({
  index,
  isActive,
  onFocus,
  methods,
  handleImproveContent,
  isImproving,
}: ProjectSectionProps) {
  const { register, watch, control } = methods;
  const formErrors = methods.formState.errors;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "projects",
  });

  return (
    <SectionBlock title="Projects" index={index} isActive={isActive} onFocus={onFocus}>
      <div className="flex justify-end items-center mb-4">
        <Button
          type="button"
          variant="secondary"
          className="text-xs h-8 px-3 rounded-mono"
          onClick={() => append({ title: "", description: [{ text: "" }], githubUrl: "", websiteUrl: "", techStack: "" })}
        >
          Add Project
        </Button>
      </div>
      <div className="space-y-4">
        {fields.map((field, projIndex) => (
          <div key={field.id} className="p-6 bg-background border border-[var(--studio-border)] rounded-mono space-y-4 relative group">
            <Button
              variant="ghost"
              className="absolute top-4 right-4 text-accent-red-text hover:text-red-600"
              type="button"
              onClick={() => remove(projIndex)}
            >
              Remove
            </Button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input name={`projects.${projIndex}.title`} label="Project Title" error={(formErrors.projects?.[projIndex] as FieldErrors<UIProject>)?.title?.message} />
              <Input name={`projects.${projIndex}.techStack`} label="Tech Stack (Comma separated)" />
              <Input name={`projects.${projIndex}.githubUrl`} label="GitHub URL" />
              <Input name={`projects.${projIndex}.websiteUrl`} label="Website URL" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-muted">Description</label>
              <BulletList
                name={`projects.${projIndex}.description`}
                control={control}
                onImprove={(val, idx) => handleImproveContent(`projects.${projIndex}.description.${idx}`, val)}
              />
              {(formErrors.projects?.[projIndex] as FieldErrors<UIProject>)?.description && (
                <span className="text-xs text-accent-red-text">
                  {(formErrors.projects?.[projIndex] as FieldErrors<UIProject>)?.description?.message}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </SectionBlock>
  );
}
