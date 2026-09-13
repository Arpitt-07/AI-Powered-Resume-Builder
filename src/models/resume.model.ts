import mongoose from "mongoose";
import { IResume } from "../types/resume.types";

const resumeSchema = new mongoose.Schema<IResume>({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    title: {
        type: String,
        default: "",

    },
    summary: {
        type: String,
        default: "",
    },
    personalInfo: {
        type:{
            fullname: String,
            email: String,
            phone: String,
            location: String,
            linkedIn: String,
            github: String,
            portfolio: String,
        },
        default: {},
    },
    workExperience: {
        type: [
            {
                company: String,
                title: String,
                startDate: String,
                endDate: String,
                description: { type: [String], default: [] },
            }
        ],
        default: [],
    },
    education: {
        type: [
            {
                degree: String,
                institution: String,
                startDate: String,
                endDate: String,
            }
        ],
        default: [],
    },
    projects: {
        type: [
            {
                title: String,
                description: { type: [String], default: [] },
                githubUrl: String,
                websiteUrl: String,
                techStack: [String],
            }
        ],
        default: [],
    },
    skills: {
        type: [String],
        default: [],
    },
    certifications: {
        type: [String],
        default: [],
    },

}, {
    timestamps: true
});


const Resume = mongoose.models.Resume || mongoose.model("Resume", resumeSchema);
export default Resume;
