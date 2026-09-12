import connectDB from "@/lib/mongo";
import { NextRequest, NextResponse } from "next/server";
import { ApiResponse } from '../../../../types/api.types'
import getCurrentUser from "@/lib/getcurrentUser";
import Resume from "@/models/resume.model";
import { IResume } from "@/types/resume.types";
import { sendError } from "@/lib/api-utils";

export async function GET(req: NextRequest, { params }: { params: Promise<{ resumeid: string }> }) {
    try {
        await connectDB();
        const { resumeid } = await params
        const userId = await getCurrentUser();
        if (!userId) {
            return sendError("Unauthorized", 401);
        }

        const resume = await Resume.findOne({ _id: resumeid, userId: userId }).lean()
        if (!resume)
            return sendError("Resume not found", 404);

        return NextResponse.json<ApiResponse<Partial<IResume>>>({
            success: true,
            message: "Resume found",
            data: resume,
        });

    } catch (error) {
        console.error("Error fetching resume:", error);
        return sendError("Internal server error", 500);
    }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ resumeid: string }> }) {
    try {
        await connectDB();
        const body = await req.json();
        const { resumeid } = await params
        const userId = await getCurrentUser();
        if (!userId) {
            return sendError("Unauthorized", 401);
        }

        const permittedFields = ['title', 'summary', 'personalInfo', 'workExperience', 'education', 'projects', 'skills', 'certifications'];
        const filteredBody = Object.keys(body)
          .filter(key => permittedFields.includes(key))
          .reduce((obj, key) => {
            obj[key] = body[key];
            return obj;
          }, {} as Record<string, unknown>);

        const updatedResume = await Resume.findOneAndUpdate(
          { _id: resumeid, userId: userId },
          { $set: filteredBody },
          { returnDocument: 'after', runValidators: true }
        );
        if (!updatedResume)
            return sendError("Resume not found", 404);

        return NextResponse.json<ApiResponse<Partial<IResume>>>({
            success: true,
            message: "Resume updated successfully",
            data: updatedResume,
        });

    } catch (error) {
        console.error("Error updating resume:", error);
        return sendError("Internal server error", 500);
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ resumeid: string }> }) {
    try {
        await connectDB();
        const { resumeid } = await params
        const userId = await getCurrentUser();
        if (!userId) {
            return sendError("Unauthorized", 401);
        }

        const deletedResume = await Resume.findOneAndDelete({ _id: resumeid, userId: userId });
        if (!deletedResume)
            return sendError("Resume not found", 404);

        return NextResponse.json<ApiResponse<{ id: string }>>({
            success: true,
            message: "Resume deleted successfully",
            data: { id: deletedResume._id.toString() },
        });

    } catch (error) {
        console.error("Error deleting resume:", error);
        return sendError("Internal server error", 500);
    }
}
