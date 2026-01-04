"use client"

import React, { createContext, useContext, useState, ReactNode } from 'react'
import { AstrologyUserData } from '@/types/astrology'
import { SUDHANSHU_DATA } from '@/data/user-data'

type UserContextType = {
    userData: AstrologyUserData | null
    setUserData: (data: AstrologyUserData | null) => void
    isLoading: boolean
    setIsLoading: (loading: boolean) => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
    // Default to null (Landing Page) - Change to SUDHANSHU_DATA for dev if needed
    const [userData, setUserData] = useState<AstrologyUserData | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    return (
        <UserContext.Provider value={{ userData, setUserData, isLoading, setIsLoading }}>
            {children}
        </UserContext.Provider>
    )
}

export function useUser() {
    const context = useContext(UserContext)
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider')
    }
    return context
}
