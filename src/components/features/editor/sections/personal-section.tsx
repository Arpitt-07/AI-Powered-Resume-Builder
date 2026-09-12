"use client";

import React from "react";
import { UseFormReturn, FieldErrors } from "react-hook-form";
import { UIResume } from "@/types/form.types";
import { IPersonalInfo } from "@/types/resume.types";
import Input from "@/components/ui/input";
import SectionBlock from "../section-block";

interface PersonalSectionProps {
  index: number;
  isActive: boolean;
  onFocus: () => void;
  methods: UseFormReturn<UIResume>;
}

export default function PersonalSection({
  index,
  isActive,
  onFocus,
  methods,
}: PersonalSectionProps) {
  const formErrors = methods.formState.errors;

  return (
    <SectionBlock title="Personal Details" index={index} isActive={isActive} onFocus={onFocus}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Input name="personalInfo.fullname" label="Full Name" error={(formErrors.personalInfo as FieldErrors<IPersonalInfo>)?.fullname?.message} />
        <Input name="personalInfo.email" label="Email" type="email" error={(formErrors.personalInfo as FieldErrors<IPersonalInfo>)?.email?.message} />
        <Input name="personalInfo.phone" label="Phone" error={(formErrors.personalInfo as FieldErrors<IPersonalInfo>)?.phone?.message} />
        <Input name="personalInfo.location" label="Location" error={(formErrors.personalInfo as FieldErrors<IPersonalInfo>)?.location?.message} />
        <Input name="personalInfo.linkedIn" label="LinkedIn URL" error={(formErrors.personalInfo as FieldErrors<IPersonalInfo>)?.linkedIn?.message} />
        <Input name="personalInfo.github" label="GitHub URL" error={(formErrors.personalInfo as FieldErrors<IPersonalInfo>)?.github?.message} />
      </div>
    </SectionBlock>
  );
}
