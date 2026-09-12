import { rateLimit } from '@/lib/rate-limiter';
import { generateAiJson } from '@/lib/ai.service';
import { GenerateSkillsRequest } from '@/types/ai.types';
import { ApiResponse } from '@/types/api.types';
import { NextRequest, NextResponse } from 'next/server'
import { sendError } from '@/lib/api-utils';
import { getSkillsPrompt } from '@/lib/prompts';
import getCurrentUser from '@/lib/getcurrentUser';

export const POST = rateLimit(async (req: NextRequest) => {
    try {
        const userId = await getCurrentUser();
        if (!userId) {
            return sendError("Unauthorized", 401);
        }

        const body: GenerateSkillsRequest = await req.json();

        const { experience, jobTitle } = body;

        if (!experience || !jobTitle) {
            return sendError("All fields are required", 400);
        }

        const prompt = getSkillsPrompt(body);
        const skillsArray = await generateAiJson<string[]>(prompt);

        return NextResponse.json<ApiResponse<string[]>>({
            success: true,
            message: "Skills generated successfully",
            data: skillsArray
        })
    } catch (error) {
        console.error("Error generating skills:", error);
        return sendError("Internal server error", 500);
    }
});
