import { rateLimit } from '@/lib/rate-limiter';
import { generateAiJson } from '@/lib/ai.service';
import { atsScore } from '@/types/ai.types';
import { ApiResponse } from '@/types/api.types';
import { NextRequest, NextResponse } from 'next/server'
import { sendError } from '@/lib/api-utils';
import { getAtsScorePrompt } from '@/lib/prompts';
import getCurrentUser from '@/lib/getcurrentUser';

export const POST = rateLimit(async (req: NextRequest) => {
    try {
        const userId = await getCurrentUser();
        if (!userId) {
            return sendError("Unauthorized", 401);
        }

        const body: atsScore = await req.json();

        const { resumeText, jobDescription } = body;

        if (!resumeText || !jobDescription) {
            return sendError("All fields are required", 400);
        }

        const prompt = getAtsScorePrompt(body);
        const data = await generateAiJson<{
            overall_score: number;
            category_scores: {
                formatting: number;
                keywords: number;
                content_quality: number;
                structure_completeness: number;
                clarity_conciseness: number;
            };
            critical_issues: string[];
            missing_keywords: string[];
            strengths: string[];
            quick_fixes: string[];
        }>(prompt);

        return NextResponse.json<ApiResponse<{
            overall_score: number;
            category_scores: {
                formatting: number;
                keywords: number;
                content_quality: number;
                structure_completeness: number;
                clarity_conciseness: number;
            };
            critical_issues: string[];
            missing_keywords: string[];
            strengths: string[];
            quick_fixes: string[];
        }>>({
            success: true,
            message: "score generated successfully",
            data
        })
    } catch (error) {
        console.error("Error generating ATS score:", error);
        return sendError("Internal server error", 500);
    }
});
