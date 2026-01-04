import { AIRequest, AIResponse } from '../types';

export async function generateGoogleResponse(request: AIRequest): Promise<AIResponse> {
    const apiKey = request.apiKey || process.env.GOOGLE_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_API_KEY;

    if (!apiKey) {
        return { text: '', error: 'Google API Key not found' };
    }

    try {
        // Convert messages to Google's format
        // Google expects: { role: 'user' | 'model', parts: [{ text: string }] }
        // System instructions are passed separately in the config often, or as the first 'user' message if using the widely available endpoint.
        // Ideally, for chat, we map 'user' -> 'user', 'assistant' -> 'model'. 'system' -> prepended to first user message or separate config.

        const contents = request.messages.map((msg) => ({
            role: msg.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: msg.content }],
        }));

        // Filter out system messages for the contents array if the API doesn't support them directly in the messages list as 'system'
        // Gemini 1.5/Pro often supports systemInstruction, but purely for this simple integration using the generateContent endpoint:
        const systemMessage = request.messages.find(m => m.role === 'system');
        const conversation = contents.filter(c => c.role === 'user' || c.role === 'model');

        const url = `https://generativelanguage.googleapis.com/v1beta/models/${request.modelId}:generateContent?key=${apiKey}`;

        const body: any = {
            contents: conversation,
        };

        if (systemMessage) {
            body.systemInstruction = {
                parts: [{ text: systemMessage.content }]
            }
        }

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        const data = await response.json();

        if (!response.ok) {
            return { text: '', error: data.error?.message || 'Failed to fetch from Google' };
        }

        // Extract text from response
        // Response format: { candidates: [ { content: { parts: [ { text: "..." } ] } } ] }
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

        return { text };
    } catch (error: any) {
        return { text: '', error: error.message || 'Unknown error occurred' };
    }
}
