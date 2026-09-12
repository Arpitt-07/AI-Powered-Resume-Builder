import { rateLimit } from '@/lib/rate-limiter';
import { generateAiContent } from '@/lib/ai.service';
import { generateSummary } from '@/types/ai.types';
import { ApiResponse } from '@/types/api.types';
import { NextRequest, NextResponse } from 'next/server'
import { sendError } from '@/lib/api-utils';
import { getSummaryPrompt } from '@/lib/prompts';
import getCurrentUser from '@/lib/getcurrentUser';

export const POST = rateLimit(async (req: NextRequest) => {
    try {
        const userId = await getCurrentUser();
        if (!userId) {
            return sendError("Unauthorized", 401);
        }

        const body: generateSummary = await req.json();

        const { experience, skills, jobTitle } = body;

        if (!experience || !skills || !jobTitle) {
            return sendError("All fields are required", 400);
        }

        const prompt = getSummaryPrompt(body);
        const summary = await generateAiContent(prompt);

        return NextResponse.json<ApiResponse<string>>({
            success: true,
            message: "Summary generated successfully",
            data: summary
        })
    } catch (error) {
        console.error("Error generating summary:", error);
        return sendError("Internal server error", 500);
    }
});
