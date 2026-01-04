
import { NextRequest, NextResponse } from 'next/server';
import { AIRequest, AIResponse } from '@/lib/ai/types';
import { generateSmartResponse } from '@/lib/ai/manager';

export async function POST(req: NextRequest) {
    try {
        const body: AIRequest = await req.json();
        const { provider, modelId, messages } = body;

        if (!messages) {
            return NextResponse.json(
                { text: '', error: 'Missing required fields: messages' },
                { status: 400 }
            );
        }

        // Use Smart Manager with Fallback
        // provider can be explicitly set (e.g. 'google') or 'auto'.
        // manager handles the logic.

        const response: AIResponse = await generateSmartResponse(body);

        if (response.error) {
            // Could strictly be 500, but 503 is Service Unavailable if all providers failed?
            // stick to 500
            return NextResponse.json(response, { status: 500 });
        }

        return NextResponse.json(response);
    } catch (error: any) {
        console.error('AI API Error:', error);
        return NextResponse.json(
            { text: '', error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
