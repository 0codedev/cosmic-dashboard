// Zustand Store for Astrology Application State
// Centralizes all state management for the Cosmic Path Astrology app

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { useShallow } from 'zustand/react/shallow'
import type { AstrologyUserData } from '@/types/astrology'
import { SUDHANSHU_DATA } from '@/data/user-data'

// =============================================================================
// STORE TYPES
// =============================================================================

interface ChatMessage {
    id: string
    text: string
    isBot: boolean
    timestamp: Date
}

interface AstrologyState {
    // User Data
    userData: AstrologyUserData

    // UI State
    activeTab: string
    isChatOpen: boolean
    isMobileMenuOpen: boolean

    // Chat State
    chatMessages: ChatMessage[]
    isTyping: boolean

    // Computed values (cached)
    currentAge: number
    jupiterMahadashaProgress: number
    mahadashaYearsRemaining: number

    // Actions
    setActiveTab: (tab: string) => void
    toggleChat: () => void
    setChatOpen: (open: boolean) => void
    toggleMobileMenu: () => void
    setMobileMenuOpen: (open: boolean) => void

    // Chat Actions
    addChatMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void
    setIsTyping: (typing: boolean) => void
    clearChatHistory: () => void

    // User Data Actions (for future multi-user support)
    setUserData: (data: AstrologyUserData) => void
    resetUserData: () => void
}

// =============================================================================
// COMPUTED VALUES
// =============================================================================

function computeAge(birthYear: number = 2005): number {
    return new Date().getFullYear() - birthYear
}

function computeJupiterProgress(startYear: number = 2011, duration: number = 16): number {
    const yearsElapsed = new Date().getFullYear() - startYear
    return Math.min(Math.round((yearsElapsed / duration) * 100), 100)
}

function computeMahadashaRemaining(startYear: number = 2011, duration: number = 16): number {
    const yearsElapsed = new Date().getFullYear() - startYear
    return Math.max(duration - yearsElapsed, 0)
}

// =============================================================================
// STORE IMPLEMENTATION
// =============================================================================

export const useAstrologyStore = create<AstrologyState>()(
    persist(
        (set, get) => ({
            // Initial State
            userData: SUDHANSHU_DATA,
            activeTab: 'mission',
            isChatOpen: false,
            isMobileMenuOpen: false,
            chatMessages: [],
            isTyping: false,

            // Computed (initialized)
            currentAge: computeAge(),
            jupiterMahadashaProgress: computeJupiterProgress(),
            mahadashaYearsRemaining: computeMahadashaRemaining(),

            // UI Actions
            setActiveTab: (tab) => set({ activeTab: tab }),

            toggleChat: () => set((state) => ({ isChatOpen: !state.isChatOpen })),
            setChatOpen: (open) => set({ isChatOpen: open }),

            toggleMobileMenu: () => set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
            setMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),

            // Chat Actions
            addChatMessage: (message) => set((state) => ({
                chatMessages: [
                    ...state.chatMessages,
                    {
                        ...message,
                        id: Date.now().toString(),
                        timestamp: new Date(),
                    },
                ],
            })),

            setIsTyping: (typing) => set({ isTyping: typing }),

            clearChatHistory: () => set({ chatMessages: [] }),

            // User Data Actions
            setUserData: (data) => set({
                userData: data,
                currentAge: computeAge(parseInt(data.dob.split(' ')[2]) || 2005),
            }),

            resetUserData: () => set({
                userData: SUDHANSHU_DATA,
                currentAge: computeAge(),
                jupiterMahadashaProgress: computeJupiterProgress(),
                mahadashaYearsRemaining: computeMahadashaRemaining(),
            }),
        }),
        {
            name: 'cosmic-astrology-storage',
            storage: createJSONStorage(() => localStorage),
            // Only persist certain fields
            partialize: (state) => ({
                activeTab: state.activeTab,
                chatMessages: state.chatMessages,
            }),
        }
    )
)

// =============================================================================
// SELECTOR HOOKS (for optimized re-renders)
// =============================================================================

export const useUserData = () => useAstrologyStore((state) => state.userData)
export const useActiveTab = () => useAstrologyStore((state) => state.activeTab)
export const useIsChatOpen = () => useAstrologyStore((state) => state.isChatOpen)
export const useChatMessages = () => useAstrologyStore((state) => state.chatMessages)
export const useIsTyping = () => useAstrologyStore((state) => state.isTyping)
export const useStoreSetUserData = () => useAstrologyStore((state) => state.setUserData)
export const useStoreResetUserData = () => useAstrologyStore((state) => state.resetUserData)

// Actions (stable references with shallow comparison to prevent infinite loops)
export const useAstrologyActions = () => useAstrologyStore(
    useShallow((state) => ({
        setActiveTab: state.setActiveTab,
        toggleChat: state.toggleChat,
        setChatOpen: state.setChatOpen,
        addChatMessage: state.addChatMessage,
        setIsTyping: state.setIsTyping,
        clearChatHistory: state.clearChatHistory,
    }))
)
