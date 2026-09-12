import Groq from "groq-sdk";

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

interface GenerateContentOptions {
    jsonMode?: boolean;
}

export default async function generateContent(
    prompt: string,
    options: GenerateContentOptions = {}
): Promise<string> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    try {
        const response = await groq.chat.completions.create({
            model: "openai/gpt-oss-120b",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.3,
            ...(options.jsonMode && {
                response_format: { type: "json_object" },
            }),
        }, {
            signal: controller.signal
        });

        const text = response.choices[0]?.message?.content;

        if (!text) {
            throw new Error("Groq API returned an empty response");
        }

        return text;
    } catch (error: any) {
        if (error.name === 'AbortError') {
            throw new Error("AI request timed out. Please try again.");
        }
        throw error;
    } finally {
        clearTimeout(timeoutId);
    }
}