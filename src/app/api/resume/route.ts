import connectDB from "@/lib/mongo";
import { NextRequest, NextResponse } from "next/server";
import { ApiResponse } from "@/types/api.types";
import getCurrentUser from "@/lib/getcurrentUser";
import Resume from "@/models/resume.model";
import { IResume } from "@/types/resume.types";

export async function GET(req: NextRequest) {
    try {
        await connectDB();
        const userId = await getCurrentUser();
        if (!userId) {
            return NextResponse.json<ApiResponse<null>>({
                success: false,
                message: "Unauthorized",
                data: null,
            }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const limit = parseInt(searchParams.get("limit") || "10");
        const page = parseInt(searchParams.get("page") || "1");
        const skip = (page - 1) * limit;

        const resumes = await Resume.find({ userId })
            .sort({ updatedAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        const total = await Resume.countDocuments({ userId });

        return NextResponse.json<ApiResponse<IResume[] & { total: number, page: number, limit: number }>>({
            success: true,
            message: "Resumes fetched successfully",
            data: resumes as unknown as IResume[],
            total,
            page,
            limit
        });

    } catch (error) {
        console.error("Error fetching resumes:", error);
        return NextResponse.json<ApiResponse<null>>({
            success: false,
            message: "Internal server error",
            data: null,
        }, { status: 500 });
    }
}
