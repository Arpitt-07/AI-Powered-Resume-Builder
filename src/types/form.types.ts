import { IResume, IPersonalInfo } from "./resume.types";

export interface UIResume {
  title: string;
  summary: string;
  personalInfo: IPersonalInfo;
  workExperience: UIWorkExperience[];
  education: UIEducation[];
  projects: UIProject[];
  skills: string;
  certifications: string;
}

export type UIWorkExperience = {
  company: string;
  title: string;
  startDate: string;
  endDate?: string;
  description: string;
};

export type UIEducation = {
  degree: string;
  institution: string;
  startDate: string;
  endDate?: string;
};

export type UIProject = {
  title: string;
  description: string;
  githubUrl: string;
  websiteUrl: string;
  techStack: string;
};
