export type AIProvider = 'google' | 'groq' | 'openrouter' | 'auto';

export type Role = 'user' | 'assistant' | 'system';

export interface ChatMessage {
    role: Role;
    content: string;
}

export interface AIModel {
    id: string;
    name: string;
    provider: AIProvider;
    description?: string;
}

export interface AIResponse {
    text: string;
    error?: string;
}

export interface AIRequest {
    messages: ChatMessage[];
    provider: AIProvider;
    modelId: string;
    apiKey?: string; // Optional: client-provided key if not env var
}
