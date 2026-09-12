export interface GenerateSummaryRequest {
    experience: string;
    skills: string[];
    jobTitle: string;
}

export interface GenerateSkillsRequest {
    experience: string;
    jobTitle: string;
}

export interface GenerateProjectDescRequest {
    projectName: string;
    technologies: string;
    projectDetails: string;
}

export interface GenerateExperienceDescRequest {
    jobTitle: string;
    company: string;
    responsibilities: string;
    startDate?: string;
    endDate?: string;
}

export interface ImproveContentRequest {
    content: string;
}

export interface AtsScoreRequest {
    resumeText: string;
    jobDescription?: string;
}

export interface AtsResult {
    overall_score: number;
    category_scores: {
        [key: string]: number;
    };
    critical_issues: string[];
    missing_keywords: string[];
    strengths: string[];
    quick_fixes: string[];
}
