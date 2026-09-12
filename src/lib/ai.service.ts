import generateContent from './groq';
import { cleanAiResponse } from './api-utils';

export async function generateAiContent(prompt: string): Promise<string> {
    const result= await generateContent(prompt);
    return cleanAiResponse(result!);
}

export async function generateAiJson<T>(prompt: string): Promise<T> {
    const content = await generateAiContent(prompt);

    let jsonString = content.trim();

    if (jsonString.startsWith('```')) {
      const match = jsonString.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      if (match && match[1]) {
        jsonString = match[1];
      }
    }

    try {
        return JSON.parse(jsonString) as T;
    } catch (error) {
        throw new Error(`Failed to parse AI response as JSON: ${error instanceof Error ? error.message : String(error)}`);
    }
}
