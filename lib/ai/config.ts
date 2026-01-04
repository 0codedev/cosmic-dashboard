import { AIModel } from './types';

export const AI_MODELS: AIModel[] = [
    // Google Models
    {
        id: 'gemini-pro',
        name: 'Gemini Pro',
        provider: 'google',
        description: 'Google\'s capable AI model',
    },
    {
        id: 'gemini-1.5-pro',
        name: 'Gemini 1.5 Pro',
        provider: 'google',
        description: 'Google\'s latest multimodal model',
    },
    {
        id: 'gemini-1.5-flash',
        name: 'Gemini 1.5 Flash',
        provider: 'google',
        description: 'Fast and efficient model',
    },
    // Groq Models
    {
        id: 'llama3-70b-8192',
        name: 'LLaMA 3 70B',
        provider: 'groq',
        description: 'Meta\'s powerful open model via Groq',
    },
    {
        id: 'mixtral-8x7b-32768',
        name: 'Mixtral 8x7B',
        provider: 'groq',
        description: 'High-performance sparse mixture-of-experts model',
    },
    {
        id: 'gemma-7b-it',
        name: 'Gemma 7B',
        provider: 'groq',
        description: "Google's lightweight open model",
    },
    // OpenRouter Models (curated list)
    {
        id: 'anthropic/claude-3-opus',
        name: 'Claude 3 Opus',
        provider: 'openrouter',
        description: 'Anthropic\'s most powerful model',
    },
    {
        id: 'openai/gpt-4o',
        name: 'GPT-4o',
        provider: 'openrouter',
        description: 'OpenAI\'s flagship model',
    },
    {
        id: 'mistralai/mistral-large',
        name: 'Mistral Large',
        provider: 'openrouter',
        description: 'Mistral\'s flagship model',
    },
];

export const DEFAULT_MODEL: AIModel = AI_MODELS[0];

export const getModelsByProvider = (provider: string) => {
    return AI_MODELS.filter((model) => model.provider === provider);
};
