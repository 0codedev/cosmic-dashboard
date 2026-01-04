"use client"

import { useState, useEffect, createContext, useContext, ReactNode } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Bell, BellOff, Info, AlertTriangle, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Card } from "@/components/ui/card"

// Notification types
interface TransitNotification {
    id: string
    type: "info" | "warning" | "auspicious"
    title: string
    message: string
    timestamp: Date
    read: boolean
}

interface NotificationPreferences {
    enabled: boolean
    majorTransits: boolean
    retrograde: boolean
    moonPhases: boolean
    eclipses: boolean
    dailyPanchang: boolean
    muhurta: boolean
}

// Context for notifications
interface NotificationContextType {
    notifications: TransitNotification[]
    preferences: NotificationPreferences
    addNotification: (notification: Omit<TransitNotification, "id" | "timestamp" | "read">) => void
    dismissNotification: (id: string) => void
    clearAll: () => void
    updatePreferences: (prefs: Partial<NotificationPreferences>) => void
    unreadCount: number
}

const NotificationContext = createContext<NotificationContextType | null>(null)

export function useNotifications() {
    const context = useContext(NotificationContext)
    if (!context) {
        throw new Error("useNotifications must be used within NotificationProvider")
    }
    return context
}

// Provider component
export function NotificationProvider({ children }: { children: ReactNode }) {
    const [notifications, setNotifications] = useState<TransitNotification[]>([])
    const [preferences, setPreferences] = useState<NotificationPreferences>({
        enabled: true,
        majorTransits: true,
        retrograde: true,
        moonPhases: true,
        eclipses: true,
        dailyPanchang: false,
        muhurta: false,
    })

    // Load preferences from localStorage
    useEffect(() => {
        const saved = localStorage.getItem("notification-preferences")
        if (saved) {
            setPreferences(JSON.parse(saved))
        }
    }, [])

    // Save preferences to localStorage
    useEffect(() => {
        localStorage.setItem("notification-preferences", JSON.stringify(preferences))
    }, [preferences])

    const addNotification = (notification: Omit<TransitNotification, "id" | "timestamp" | "read">) => {
        if (!preferences.enabled) return

        const newNotification: TransitNotification = {
            ...notification,
            id: crypto.randomUUID(),
            timestamp: new Date(),
            read: false,
        }
        setNotifications(prev => [newNotification, ...prev].slice(0, 20)) // Keep last 20
    }

    const dismissNotification = (id: string) => {
        setNotifications(prev => prev.filter(n => n.id !== id))
    }

    const clearAll = () => {
        setNotifications([])
    }

    const updatePreferences = (prefs: Partial<NotificationPreferences>) => {
        setPreferences(prev => ({ ...prev, ...prefs }))
    }

    const unreadCount = notifications.filter(n => !n.read).length

    return (
        <NotificationContext.Provider value={{
            notifications,
            preferences,
            addNotification,
            dismissNotification,
            clearAll,
            updatePreferences,
            unreadCount,
        }}>
            {children}
        </NotificationContext.Provider>
    )
}

// Toast notification component
export function NotificationToast({ notification, onDismiss }: {
    notification: TransitNotification
    onDismiss: () => void
}) {
    useEffect(() => {
        const timer = setTimeout(onDismiss, 5000)
        return () => clearTimeout(timer)
    }, [onDismiss])

    const icons = {
        info: <Info className="w-5 h-5 text-blue-400" />,
        warning: <AlertTriangle className="w-5 h-5 text-amber-400" />,
        auspicious: <Star className="w-5 h-5 text-green-400" />,
    }

    const colors = {
        info: "border-blue-500/30 bg-blue-900/30",
        warning: "border-amber-500/30 bg-amber-900/30",
        auspicious: "border-green-500/30 bg-green-900/30",
    }

    return (
        <motion.div
            initial={{ opacity: 0, x: 100, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.9 }}
            className={`fixed top-4 right-4 z-50 max-w-sm p-4 rounded-lg border backdrop-blur-lg ${colors[notification.type]}`}
        >
            <div className="flex items-start gap-3">
                {icons[notification.type]}
                <div className="flex-1">
                    <h4 className="font-semibold text-white text-sm">{notification.title}</h4>
                    <p className="text-gray-300 text-xs mt-1">{notification.message}</p>
                </div>
                <button
                    onClick={onDismiss}
                    className="text-gray-400 hover:text-white transition-colors"
                    aria-label="Dismiss notification"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        </motion.div>
    )
}

// Notification Center component
export function NotificationCenter() {
    const { notifications, clearAll, dismissNotification, unreadCount } = useNotifications()
    const [isOpen, setIsOpen] = useState(false)

    return (
        <>
            <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(!isOpen)}
                className="relative text-gray-400 hover:text-white"
                aria-label="Open notifications"
            >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                        {unreadCount}
                    </span>
                )}
            </Button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-16 right-4 w-80 bg-slate-900/95 border border-purple-500/30 rounded-lg backdrop-blur-lg shadow-xl z-50"
                    >
                        <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                            <h3 className="font-semibold text-white">Notifications</h3>
                            {notifications.length > 0 && (
                                <button onClick={clearAll} className="text-xs text-gray-400 hover:text-white">
                                    Clear all
                                </button>
                            )}
                        </div>

                        <div className="max-h-80 overflow-y-auto">
                            {notifications.length === 0 ? (
                                <div className="p-4 text-center text-gray-400 text-sm">
                                    No notifications yet
                                </div>
                            ) : (
                                notifications.map(notification => (
                                    <div
                                        key={notification.id}
                                        className="p-3 border-b border-gray-700/50 hover:bg-slate-800/50"
                                    >
                                        <div className="flex items-start gap-2">
                                            <div className="flex-1">
                                                <h4 className="font-medium text-white text-sm">{notification.title}</h4>
                                                <p className="text-gray-400 text-xs mt-1">{notification.message}</p>
                                                <span className="text-xs text-gray-500 mt-1">
                                                    {notification.timestamp.toLocaleTimeString()}
                                                </span>
                                            </div>
                                            <button
                                                onClick={() => dismissNotification(notification.id)}
                                                className="text-gray-500 hover:text-white"
                                                aria-label="Dismiss"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}

// Notification Preferences Panel
export function NotificationPreferencesPanel() {
    const { preferences, updatePreferences } = useNotifications()

    const toggleItems = [
        { key: "enabled", label: "Enable Notifications", description: "Master toggle for all alerts" },
        { key: "majorTransits", label: "Major Transits", description: "Saturn, Jupiter, Rahu/Ketu movements" },
        { key: "retrograde", label: "Retrograde Alerts", description: "When planets go retrograde/direct" },
        { key: "moonPhases", label: "Moon Phases", description: "Full moon, new moon, eclipses" },
        { key: "eclipses", label: "Eclipse Warnings", description: "Solar and lunar eclipses" },
        { key: "dailyPanchang", label: "Daily Panchang", description: "Morning Tithi and Nakshatra" },
        { key: "muhurta", label: "Auspicious Muhurta", description: "Best times for activities" },
    ]

    return (
        <Card className="bg-slate-800/50 border-purple-500/20 p-6">
            <div className="flex items-center gap-2 mb-4">
                {preferences.enabled ? (
                    <Bell className="w-5 h-5 text-purple-400" />
                ) : (
                    <BellOff className="w-5 h-5 text-gray-400" />
                )}
                <h3 className="font-semibold text-white">Alert Preferences</h3>
            </div>

            <div className="space-y-4">
                {toggleItems.map(item => (
                    <div key={item.key} className="flex items-center justify-between">
                        <div>
                            <div className="text-sm font-medium text-white">{item.label}</div>
                            <div className="text-xs text-gray-400">{item.description}</div>
                        </div>
                        <Switch
                            checked={preferences[item.key as keyof NotificationPreferences] as boolean}
                            onCheckedChange={(checked) => updatePreferences({ [item.key]: checked })}
                            disabled={item.key !== "enabled" && !preferences.enabled}
                            aria-label={item.label}
                        />
                    </div>
                ))}
            </div>
        </Card>
    )
}

// Transit Alert Generator (simulates receiving transit alerts)
export function useTransitAlerts() {
    const { addNotification, preferences } = useNotifications()

    useEffect(() => {
        if (!preferences.enabled) return

        // Check for transits on mount
        const checkTransits = () => {
            const now = new Date()
            const hour = now.getHours()

            // Morning Panchang reminder (6 AM)
            if (hour === 6 && preferences.dailyPanchang) {
                addNotification({
                    type: "info",
                    title: "Daily Panchang Ready",
                    message: "Check today's Tithi, Nakshatra, and auspicious times.",
                })
            }

            // Moon phase check
            if (preferences.moonPhases) {
                const dayOfMonth = now.getDate()
                if (dayOfMonth === 1 || dayOfMonth === 15) {
                    addNotification({
                        type: "auspicious",
                        title: "Moon Phase Alert",
                        message: dayOfMonth === 1 ? "New Moon (Amavasya) today" : "Full Moon (Purnima) today",
                    })
                }
            }
        }

        checkTransits()

        // Check every hour
        const interval = setInterval(checkTransits, 60 * 60 * 1000)
        return () => clearInterval(interval)
    }, [preferences, addNotification])
}
