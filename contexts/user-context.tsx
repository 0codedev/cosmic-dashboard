"use client"

import React, { createContext, useCallback, useContext, useMemo, useState, ReactNode } from 'react'
import type { AstrologyUserData } from '@/types/astrology'
import { SUDHANSHU_DATA } from '@/data/user-data'
import { useStoreResetUserData, useStoreSetUserData } from '@/stores/astrology-store'

type UserContextType = {
    userData: AstrologyUserData | null
    setUserData: (data: AstrologyUserData | null) => void
    isLoading: boolean
    setIsLoading: (loading: boolean) => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
    const [userData, setUserData] = useState<AstrologyUserData | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const syncUserData = useStoreSetUserData()
    const resetStoreUserData = useStoreResetUserData()

    const handleSetUserData = useCallback((data: AstrologyUserData | null) => {
        setUserData(data)

        if (data) {
            syncUserData(data)
            return
        }

        resetStoreUserData()
    }, [resetStoreUserData, syncUserData])

    const value = useMemo(() => ({
        userData,
        setUserData: handleSetUserData,
        isLoading,
        setIsLoading,
    }), [handleSetUserData, isLoading, userData])

    return (
        <UserContext.Provider value={value}>
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

export function useResolvedUserData(): AstrologyUserData {
    const { userData } = useUser()
    return userData ?? SUDHANSHU_DATA
}
