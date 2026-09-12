import {
    GenerateSummaryRequest,
    GenerateSkillsRequest,
    GenerateExperienceDescRequest,
    GenerateProjectDescRequest,
    ImproveContentRequest,
    AtsScoreRequest
} from '@/types/ai.types';

export function getSummaryPrompt({ experience, skills, jobTitle }: GenerateSummaryRequest): string {
    return `You are an expert resume writer specializing in ATS-optimized content.

Generate a professional resume summary based on the details below.

Job Title: ${jobTitle}
Experience: ${experience}
Skills: ${skills}

Rules:
- Write exactly 2-3 sentences (40-60 words total)
- Start with a strong professional title/identity (e.g., "Results-driven ${jobTitle}...")
- Naturally incorporate 3-5 relevant keywords from the Skills list for ATS matching
- Include 1 quantifiable achievement or scope indicator if present in Experience (e.g., years of experience, team size, metrics)
- Use active voice and industry-standard terminology — avoid buzzwords like "hardworking," "team player," "go-getter"
- No first-person pronouns (I, my, me)
- No bullet points, headers, or line breaks — output as a single flowing paragraph
- Do not include a title/label like "Summary:" — return only the summary text itself
- Do not fabricate skills, numbers, or experience not implied by the input

Output only the final summary text, with no preamble, explanation, or markdown formatting.`;
}

export function getSkillsPrompt({ experience, jobTitle }: GenerateSkillsRequest): string {
    return `You are an expert technical recruiter and resume writer.

Generate a list of relevant technical skills based on the details below.

Job Title: ${jobTitle}
Experience: ${experience}

Rules:
- Return ONLY hard/technical skills — no soft skills (e.g., exclude "communication," "leadership," "teamwork," "problem-solving")
- Include only: programming languages, frameworks, libraries, tools, platforms, databases, cloud services, and technical methodologies (e.g., Agile, CI/CD) directly relevant to the Job Title and Experience
- Do not include generic/vague terms (e.g., "computer skills," "Microsoft Office" unless explicitly relevant to the role)
- List between 8 and 15 skills
- Each skill should be a short standalone term or short phrase (1-3 words), not a sentence
- Do not fabricate skills that aren't reasonably implied by the Job Title or Experience
- Do not include duplicate or overlapping skills (e.g., don't list both "React" and "React.js")
- Order skills by relevance to the Job Title, most relevant first

Output format:
Return ONLY a valid JSON array of strings, with no preamble, explanation, or markdown formatting.

Example output format:
["Skill1", "Skill2", "Skill3"]`;
}

export function getExperiencePrompt({ jobTitle, company, responsibilities, startDate, endDate }: GenerateExperienceDescRequest): string {
    return `You are an expert resume writer specializing in ATS-optimized content.

Generate professional work experience bullet points for a resume based on the details below.

Job Title: ${jobTitle}
Company: ${company}
Responsibilities/Details: ${responsibilities}

Rules:
- Write 3-5 concise bullet points describing this role
- Start each bullet with a strong action verb (e.g., "Led," "Managed," "Developed," "Optimized," "Coordinated") — do not repeat the same verb across bullets
- Naturally incorporate relevant keywords/skills implied by the Responsibilities/Details for ATS matching
- Include quantifiable impact where possible (e.g., percentages, team size, revenue, time saved, scale) — only if reasonably implied by the input
- Focus on achievements and outcomes, not just task lists — reframe duties as accomplishments where possible
- Use active voice and past tense (unless this is explicitly a current role, in which case use present tense)
- No first-person pronouns (I, my, me)
- Each bullet should be 1 line, under 20 words
- Do not fabricate metrics, achievements, or responsibilities not implied by the input

Examples of Professional Bullet Points:
- Generic: "Responsible for developing features in React."
- Professional (Quantified): "Developed 15+ reusable UI components in React, reducing page load time by 20% across the platform."
- Generic: "Managed a team of developers."
- Professional (Impact-driven): "Managed a cross-functional team of 5 developers to deliver a new billing module 2 weeks ahead of schedule, resulting in a 10% increase in monthly recurring revenue."

Output format:
Return ONLY a valid JSON array of strings (each string is one bullet point), with no preamble, explanation, or markdown formatting.

Example output format:
["Bullet point 1", "Bullet point 2", "Bullet point 3"]`;
}

export function getProjectPrompt({ projectName, technologies, projectDetails }: GenerateProjectDescRequest): string {
    return `You are an expert resume writer specializing in ATS-optimized content.

Generate a professional project description for a resume based on the details below.

Project Name: ${projectName}
Technologies Used: ${technologies}
Project Details: ${projectDetails}

Rules:
- Write 2-4 concise bullet points describing the project
- Start each bullet with a strong action verb (e.g., "Developed," "Built," "Architected," "Implemented")
- Naturally incorporate relevant keywords from Technologies Used for ATS matching
- Include quantifiable impact or scope where possible (e.g., users served, performance improvement, time saved) — only if reasonably implied by Project Details
- Focus on what was built, how it was built, and the outcome/impact — avoid vague statements
- Use active voice and past tense
- No first-person pronouns (I, my, me)
- Each bullet should be 1 line, under 20 words
- Do not fabricate metrics, features, or outcomes not implied by the input

Output format:
Return ONLY a valid JSON array of strings (each string is one bullet point), with no preamble, explanation, or markdown formatting.

Example output format:
["Bullet point 1", "Bullet point 2", "Bullet point 3"]`;
}

export function getImproveContentPrompt({ content }: ImproveContentRequest): string {
    return `You are an expert resume writer and editor.

Improve the following resume content to be more professional, impactful, and ATS-optimized.

Content:
"""
${content}
"""

Rules:
- Enhance the language using strong action verbs and industry-standard terminology
- Focus on quantifiable achievements and outcomes rather than just tasks
- Ensure the tone is professional and concise
- Remove filler words and clichés
- Maintain the original meaning and facts — do not fabricate experience
- Output ONLY the improved content, with no preamble, explanation, or markdown formatting.`;
}

export function getAtsScorePrompt({ resumeText, jobDescription }: AtsScoreRequest): string {
    return `You are an expert ATS (Applicant Tracking System) analyzer and professional resume reviewer.

Analyze the resume text below and evaluate how well it would perform when parsed and ranked by a typical ATS, as well as its overall quality for human recruiters.

Resume Text:
"""
${resumeText}
"""

${jobDescription ? `Compare against this target Job Description for keyword/role match:\n"""\n${jobDescription}\n"""` : "No specific job description provided — evaluate general ATS-friendliness and resume quality."}

Evaluate the resume across these categories and assign each a score out of 100:

1. "formatting" - Is the structure ATS-parsable? (standard section headers, no tables/columns/graphics/text boxes that break parsing, consistent date formats, no images/icons carrying essential info)
2. "keywords" - ${jobDescription ? "How well do skills/terms in the resume match the job description's required keywords, tools, and qualifications?" : "Does the resume use relevant, industry-standard, role-appropriate keywords and terminology?"}
3. "content_quality" - Are bullet points action-oriented, quantified where possible, and free of vague filler or clichés ("hardworking," "team player," etc.)?
4. "structure_completeness" - Are essential sections present (contact info, summary, experience, education, skills) and logically ordered?
5. "clarity_conciseness" - Is the writing clear, concise, and free of redundancy, jargon overload, or grammatical errors?

Then calculate an "overall_score" (weighted average, formatting and keywords weighted highest since they most affect ATS parsing/ranking).

Also identify:
- "critical_issues": Up to 5 specific problems that could cause the resume to be rejected or mis-parsed by an ATS (be specific, quote or reference the exact section/line)
- "missing_keywords": ${jobDescription ? "Important keywords/skills from the job description missing in the resume (only ones genuinely relevant, don't invent requirements)" : "Commonly expected keywords/skills for this apparent role/industry that are missing"}
- "strengths": Up to 3 things the resume already does well
- "quick_fixes": Up to 5 specific, actionable recommendations ranked by impact

Example of a Critical Issue Report:
- "Formatting: The resume uses a two-column layout which frequently causes ATS parsers to merge text from different columns, leading to garbled experience sections."
- "Keywords: Missing 'Cloud Architecture' and 'Kubernetes' which were listed as mandatory requirements in the job description."

Rules:
- Base every finding strictly on the actual resume text provided — do not assume information not present
- Be honest and critical — do not inflate scores to be encouraging
- Do not fabricate a job description match if none was provided
- Return ONLY valid JSON, no markdown code fences, no preamble, no explanation

Return in exactly this JSON structure:
{
  "overall_score": number,
  "category_scores": {
    "formatting": number,
    "keywords": number,
    "content_quality": number,
    "structure_completeness": number,
    "clarity_conciseness": number
  },
  "critical_issues": string[],
  "missing_keywords": string[],
  "strengths": string[],
  "quick_fixes": string[]
}
`;
}
