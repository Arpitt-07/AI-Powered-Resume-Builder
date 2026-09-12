import { rateLimit } from '@/lib/rate-limiter';
import { generateAiJson } from '@/lib/ai.service';
import { GenerateExperienceDescRequest } from '@/types/ai.types';
import { ApiResponse } from '@/types/api.types';
import { NextRequest, NextResponse } from 'next/server'
import { sendError } from '@/lib/api-utils';
import { getExperiencePrompt } from '@/lib/prompts';
import getCurrentUser from '@/lib/getcurrentUser';

export const POST = rateLimit(async (req: NextRequest) => {
    try {
        const userId = await getCurrentUser();
        if (!userId) {
            return sendError("Unauthorized", 401);
        }

        const body: GenerateExperienceDescRequest = await req.json();

        const { jobTitle, company, responsibilities, startDate, endDate } = body;

        if (!jobTitle || !company || !responsibilities) {
            return sendError("All fields are required", 400);
        }

        const prompt = getExperiencePrompt(body);
        const descriptionArray = await generateAiJson<string[]>(prompt);

        return NextResponse.json<ApiResponse<string[]>>({
            success: true,
            message: "Description generated successfully",
            data: descriptionArray
        })
    } catch (error) {
        console.error("Error generating experience description:", error);
        return sendError("Internal server error", 500);
    }
});
