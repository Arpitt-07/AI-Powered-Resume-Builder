import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import {
  GenerateSummaryRequest,
  GenerateSkillsRequest,
  GenerateExperienceDescRequest,
  GenerateProjectDescRequest,
  ImproveContentRequest,
  AtsScoreRequest,
  AtsResult
} from "@/types/ai.types";

export function useAIAction<TReq, TRes>(endpoint: string) {
  return useMutation({
    mutationFn: (body: TReq) => api.post<TRes, TReq>(endpoint, body),
  });
}

export const aiService = {
  useGenerateSummary: () => useAIAction<GenerateSummaryRequest, string>("/ai/generate-summary"),
  useGenerateSkills: () => useAIAction<GenerateSkillsRequest, string[]>( "/ai/generate-skills"),
  useGenerateExperience: () => useAIAction<GenerateExperienceDescRequest, string[]>("/ai/generate-experience-desc"),
  useGenerateProject: () => useAIAction<GenerateProjectDescRequest, string[]>("/ai/generate-project-desc"),
  useImproveContent: () => useAIAction<ImproveContentRequest, string>("/ai/improve-content"),
  useAtsScore: () => useAIAction<AtsScoreRequest, AtsResult>("/ai/ats-score"),
};
