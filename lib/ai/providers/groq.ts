import { AIRequest, AIResponse } from '../types';

export async function generateGroqResponse(request: AIRequest): Promise<AIResponse> {
    const apiKey = request.apiKey || process.env.GROQ_API_KEY || process.env.NEXT_PUBLIC_GROQ_API_KEY;

    if (!apiKey) {
        return { text: '', error: 'Groq API Key not found' };
    }

    try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: request.modelId,
                messages: request.messages.map(m => ({
                    role: m.role,
                    content: m.content
                })),
                temperature: 0.7,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            return { text: '', error: data.error?.message || 'Failed to fetch from Groq' };
        }

        const text = data.choices?.[0]?.message?.content || '';
        return { text };
    } catch (error: any) {
        return { text: '', error: error.message || 'Unknown error occurred' };
    }
}
