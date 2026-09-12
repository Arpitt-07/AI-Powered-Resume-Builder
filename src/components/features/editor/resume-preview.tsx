"use client";

import React, { forwardRef } from "react";
import { useResumeStore } from "@/store/resume-store";
import { IResume } from "@/types/resume.types";
import ResumeTemplate, { ResumeData } from "./resume-template";

export default function ResumePreview() {
  const { resumeData } = useResumeStore();

  if (!resumeData) return <div className="p-8 text-muted">Loading preview...</div>;

  const mapToTemplateData = (data: Partial<IResume>): ResumeData => {
    const skillsString = data.skills?.filter(s => s.trim()).join(", ");

    return {
      name: data.personalInfo?.fullname,
      summary: data.summary,
      location: data.personalInfo?.location,
      phone: data.personalInfo?.phone,
      email: data.personalInfo?.email,
      linkedin: data.personalInfo?.linkedIn,
      github: data.personalInfo?.github,
      education: data.education?.filter(edu => edu.institution || edu.degree).map((edu) => ({
        school: edu.institution,
        degree: edu.degree,
        dates: `${edu.startDate} ${edu.endDate ? `- ${edu.endDate}` : ""}`,
      })),
      experience: data.workExperience?.filter(exp => exp.company || exp.title).map((exp) => ({
        company: exp.company,
        role: exp.title,
        dates: `${exp.startDate} ${exp.endDate ? `- ${exp.endDate}` : ""}`,
        bullets: exp.description ? [exp.description] : [],
      })),
      projects: data.projects?.filter(proj => proj.title).map((proj) => ({
        title: proj.title,
        stack: proj.techStack?.join(", "),
        bullets: proj.description ? [proj.description] : [],
      })),
      technicalSkills: skillsString ? {
        "Skills": skillsString,
      } : {},
      certifications: data.certifications?.filter(c => c.trim()),
      achievements: [],
    };
  };

  return (
    <div className="bg-zinc-100 p-4 min-h-full w-full overflow-auto flex justify-center">
      <div className="origin-top scale-[0.7] md:scale-100 transition-transform duration-200 print:scale-100">
        <div id="resume-print-area">
          <ResumeTemplate data={mapToTemplateData(resumeData)} />
        </div>
      </div>
    </div>
  );
}
