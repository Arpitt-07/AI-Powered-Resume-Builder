import { rateLimit } from '@/lib/rate-limiter';
import { generateAiContent } from '@/lib/ai.service';
import { ImproveContentRequest } from '@/types/ai.types';
import { ApiResponse } from '@/types/api.types';
import { NextRequest, NextResponse } from 'next/server';
import { sendError } from '@/lib/api-utils';
import { getImproveContentPrompt } from '@/lib/prompts';
import getCurrentUser from '@/lib/getcurrentUser';

export const POST = rateLimit(async (req: NextRequest) => {
    try {
        const userId = await getCurrentUser();
        if (!userId) {
            return sendError("Unauthorized", 401);
        }

        const body: ImproveContentRequest = await req.json();
        const { content } = body;

        if (!content?.trim()) {
            return sendError("Content is required", 400);
        }

        const prompt = getImproveContentPrompt(body);
        const improvedContent = await generateAiContent(prompt);

        return NextResponse.json<ApiResponse<string>>({
            success: true,
            message: "Content improved successfully",
            data: improvedContent,
        });
    } catch (error) {
        console.error("Error improving content:", error);
        return sendError("Internal server error", 500);
    }
});
