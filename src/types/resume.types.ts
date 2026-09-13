import { Types } from "mongoose";

export interface IPersonalInfo{
    fullname:string;
    email:string;
    phone:string;
    location:string;
    linkedIn:string;
    github:string;
    portfolio:string;
}

export interface IWorkExperience{
    company:string;
    title:string;
    startDate:string;
    endDate?:string;
    description:string[];

}

export interface IProject{
    title:string;
    description:string[];
    githubUrl:string;
    websiteUrl:string;
    techStack:string[];
}

export interface IEducation{
    degree:string;
    institution:string;
    startDate:string;
    endDate?:string;
  
}

export interface IResume{
    _id?:string;
    userId:Types.ObjectId;
    title:string;
    summary:string;
    personalInfo:IPersonalInfo;
    workExperience?:IWorkExperience[];
    education?:IEducation[];
    projects?:IProject[];
    certifications:string[];
    skills:string[];
    createdAt?:Date;
    updatedAt?:Date;
}
