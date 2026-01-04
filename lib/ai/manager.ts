
import { AIRequest, AIResponse, AIProvider } from './types';
import { generateGoogleResponse } from './providers/google';
import { generateGroqResponse } from './providers/groq';
import { generateOpenRouterResponse } from './providers/openrouter';

const PROVIDER_ORDER = ['google', 'groq', 'openrouter'];

const DEFAULT_MODELS = {
    google: 'gemini-1.5-flash',
    groq: 'llama3-70b-8192',
    openrouter: 'openai/gpt-4o-mini' // Use a reliable/cheap fallback
};

export async function generateSmartResponse(request: AIRequest): Promise<AIResponse> {
    const errors: string[] = [];

    // If a specific provider is requested, try ONLY that one (or maybe try others if that fails? No, specific request usually implies intent).
    // User requested "Use all different layers". 
    // If request.provider is "smart" (or undefined), we do fallback.
    // If request.provider is explicit (e.g. 'google'), we try that first, but COULD fallback if desired.
    // Let's assume input provider overrides fallback unless it fails? 
    // For now, if no provider or 'auto', use chain.

    // We'll normalize the runOrder
    let runOrder = [...PROVIDER_ORDER];

    // If specific provider requested, put it first.
    if (request.provider && request.provider !== 'auto') {
        runOrder = [request.provider, ...PROVIDER_ORDER.filter(p => p !== request.provider)];
        // If the user INTENDS strict provider, they should handle error? 
        // But "Use all API keys... fallback" implies we should ALWAYS try others.
    }

    for (const provider of runOrder) {
        try {
            // Determine Model ID
            // If this is the originally requested provider, try to use the requested modelId.
            // If we are in fallback (provider != request.provider), use default model for this provider.
            let currentModelId = request.modelId;

            // If we are switching providers, or if no modelId provided, use default
            if (!currentModelId || (provider !== request.provider && request.provider !== 'auto' && request.provider)) {
                // Basic mapping logic could go here (e.g. "flash" -> "llama-8b")
                // For now, use robust defaults.
                currentModelId = DEFAULT_MODELS[provider as keyof typeof DEFAULT_MODELS] || 'gemini-1.5-flash';
            }

            // Check environment variable presence before trying? 
            // Implementation details in providers handle specific key checks.

            const currentRequest = { ...request, provider, modelId: currentModelId };

            console.log(`[AI Manager] Attempting generation with ${provider} (${currentModelId})...`);

            let response: AIResponse;
            switch (provider) {
                case 'google':
                    response = await generateGoogleResponse({ ...currentRequest, provider: provider as AIProvider });
                    break;
                case 'groq':
                    response = await generateGroqResponse({ ...currentRequest, provider: provider as AIProvider });
                    break;
                case 'openrouter':
                    response = await generateOpenRouterResponse({ ...currentRequest, provider: provider as AIProvider });
                    break;
                default:
                    // unexpected provider string
                    errors.push(`${provider}: Unknown provider`);
                    continue;
            }

            if (response.error) {
                console.warn(`[AI Manager] ${provider} failed: ${response.error}`);
                errors.push(`${provider} (${currentModelId}): ${response.error}`);
                continue; // Try next provider
            }

            // Success
            return response;

        } catch (e: any) {
            console.error(`[AI Manager] Exception with ${provider}:`, e);
            errors.push(`${provider}: ${e.message}`);
        }
    }

    return {
        text: '',
        error: `All AI layers failed. Details: ${errors.join(' | ')}`
    };
}
