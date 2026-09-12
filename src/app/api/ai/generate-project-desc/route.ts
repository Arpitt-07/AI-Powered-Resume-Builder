import { rateLimit } from '@/lib/rate-limiter';
import { generateAiJson } from '@/lib/ai.service';
import { generateProjectDesc } from '@/types/ai.types';
import { ApiResponse } from '@/types/api.types';
import { NextRequest, NextResponse } from 'next/server'
import { sendError } from '@/lib/api-utils';
import { getProjectPrompt } from '@/lib/prompts';
import getCurrentUser from '@/lib/getcurrentUser';

export const POST = rateLimit(async (req: NextRequest) => {
    try {
        const userId = await getCurrentUser();
        if (!userId) {
            return sendError("Unauthorized", 401);
        }

        const body: generateProjectDesc = await req.json();

        const { projectName, technologies, projectDetails } = body;

        if (!projectName || !technologies || !projectDetails) {
            return sendError("All fields are required", 400);
        }

        const prompt = getProjectPrompt(body);
        const descriptionArray = await generateAiJson<string[]>(prompt);

        return NextResponse.json<ApiResponse<string[]>>({
            success: true,
            message: "Description generated successfully",
            data: descriptionArray
        })
    } catch (error) {
        console.error("Error generating project description:", error);
        return sendError("Internal server error", 500);
    }
});
