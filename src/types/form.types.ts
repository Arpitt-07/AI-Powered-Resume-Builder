import { IResume, IPersonalInfo } from "./resume.types";

export interface ResumeFormValues {
  title: string;
  summary: string;
  personalInfo: IPersonalInfo;
  workExperience: UIWorkExperience[];
  education: UIEducation[];
  projects: UIProject[];
  skills: string;
  certifications: string;
}

export type UIBullet = {
  text: string;
};

export type UIWorkExperience = {
  company: string;
  title: string;
  startDate: string;
  endDate?: string;
  description: UIBullet[];
};

export type UIEducation = {
  degree: string;
  institution: string;
  startDate: string;
  endDate?: string;
};

export type UIProject = {
  title: string;
  description: UIBullet[];
  githubUrl: string;
  websiteUrl: string;
  techStack: string;
};
