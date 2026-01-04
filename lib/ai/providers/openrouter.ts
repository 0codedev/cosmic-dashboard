import { AIRequest, AIResponse } from '../types';

export async function generateOpenRouterResponse(request: AIRequest): Promise<AIResponse> {
    const apiKey = request.apiKey || process.env.OPENROUTER_API_KEY || process.env.NEXT_PUBLIC_OPENROUTER_API_KEY;

    if (!apiKey) {
        return { text: '', error: 'OpenRouter API Key not found' };
    }

    try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'HTTP-Referer': 'https://cosmicpathastrology.com', // Optional: Your site URL
                'X-Title': 'Cosmic Path Astrology', // Optional: Your site name
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: request.modelId,
                messages: request.messages.map(m => ({
                    role: m.role,
                    content: m.content
                })),
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            // OpenRouter sometimes returns error in distinct formats, need to be careful
            return { text: '', error: data.error?.message || JSON.stringify(data.error) || 'Failed to fetch from OpenRouter' };
        }

        const text = data.choices?.[0]?.message?.content || '';
        return { text };
    } catch (error: any) {
        return { text: '', error: error.message || 'Unknown error occurred' };
    }
}
