import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  mobile: z.string().min(10, "Mobile number is required"),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;

export const personalInfoSchema = z.object({
  fullname: z.string().min(2, "Full name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(10, "Phone is required"),
  location: z.string().min(2, "Location is required"),
  linkedIn: z.string().url("Invalid LinkedIn URL").optional().or(z.literal("")),
  github: z.string().url("Invalid GitHub URL").optional().or(z.literal("")),
  portfolio: z.string().url("Invalid Portfolio URL").optional().or(z.literal("")),
});

export const workExperienceSchema = z.object({
  company: z.string().min(1, "Company is required"),
  title: z.string().min(1, "Job title is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  description: z.array(z.object({
    text: z.string().min(1, "Bullet point cannot be empty")
  })),
});

export const educationSchema = z.object({
  degree: z.string().min(1, "Degree is required"),
  institution: z.string().min(1, "Institution is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
});

export const projectSchema = z.object({
  title: z.string().min(1, "Project title is required"),
  description: z.array(z.object({
    text: z.string().min(1, "Bullet point cannot be empty")
  })),
  githubUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  websiteUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  techStack: z.preprocess(
    (val) => (typeof val === "string" && typeof val.split === 'function' ? val.split(",").map(s => s.trim()).filter(Boolean) : val),
    z.array(z.string())
  ),
});

export const resumeSchema = z.object({
  title: z.string().min(1, "Resume title is required"),
  summary: z.string().min(10, "Summary is too short"),
  personalInfo: personalInfoSchema,
  workExperience: z.array(workExperienceSchema).optional(),
  education: z.array(educationSchema).optional(),
  projects: z.array(projectSchema).optional(),
  certifications: z.preprocess(
    (val) => (typeof val === "string" && typeof val.split === 'function' ? val.split(",").map(s => s.trim()).filter(Boolean) : val),
    z.array(z.string())
  ),
  skills: z.preprocess(
    (val) => (typeof val === "string" && typeof val.split === 'function' ? val.split(",").map(s => s.trim()).filter(Boolean) : val),
    z.array(z.string())
  ),
});

export type ResumeInput = z.infer<typeof resumeSchema>;
