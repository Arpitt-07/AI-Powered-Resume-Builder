import { IResume } from "@/types/resume.types";

export function resumeToText(resume: Partial<IResume>): string {
  const parts = [];

  parts.push(`Title: ${resume.title || ""}`);
  parts.push(`Summary: ${resume.summary || ""}`);

  if (resume.personalInfo) {
    parts.push(`Contact: ${resume.personalInfo.fullname}, ${resume.personalInfo.email}, ${resume.personalInfo.phone}, ${resume.personalInfo.location}`);
  }

  if (resume.workExperience) {
    parts.push("Experience:");
    resume.workExperience.forEach(exp => {
      parts.push(`${exp.title} at ${exp.company} (${exp.startDate} - ${exp.endDate || "Present"})\n${exp.description}`);
    });
  }

  if (resume.education) {
    parts.push("Education:");
    resume.education.forEach(edu => {
      parts.push(`${edu.degree} from ${edu.institution} (${edu.startDate} - ${edu.endDate || "Present"})`);
    });
  }

  if (resume.projects) {
    parts.push("Projects:");
    resume.projects.forEach(proj => {
      parts.push(`${proj.title}: ${proj.description} (Tech: ${proj.techStack.join(", ")})`);
    });
  }

  if (resume.skills) {
    parts.push(`Skills: ${resume.skills.join(", ")}`);
  }

  return parts.filter(Boolean).join("\n\n");
}
