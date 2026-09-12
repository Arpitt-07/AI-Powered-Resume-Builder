import connectDB from "@/lib/mongo";
import getCurrentUser from "@/lib/getcurrentUser";
import Resume from "@/models/resume.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        await connectDB();
        const userId = await getCurrentUser();

        if (!userId) {
            return NextResponse.redirect(new URL("/login", request.url));
        }

        const resume = await Resume.create({
            userId,
            title: "",
            summary: "",
            personalInfo: {},
            workExperience: [],
            education: [],
            projects: [],
            certifications: [],
            skills: [],
        });

        return NextResponse.redirect(new URL(`/editor/${resume._id}`, request.url));
    } catch (error) {
        console.error("Error creating resume via route handler:", error);
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }
}
