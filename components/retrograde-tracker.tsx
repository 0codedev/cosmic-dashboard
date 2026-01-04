"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    RotateCcw,
    ArrowRight,
    Calendar,
    AlertTriangle,
    CheckCircle2,
    Info
} from "lucide-react"

interface RetrogradeInfo {
    planet: string
    symbol: string
    isRetrograde: boolean
    startDate: string
    endDate: string
    sign: string
    effects: string[]
    doDuring: string[]
    avoidDuring: string[]
    color: string
}

// 2025 Retrograde Data
const RETROGRADE_DATA: RetrogradeInfo[] = [
    {
        planet: "Mercury",
        symbol: "☿",
        isRetrograde: false,
        startDate: "Mar 14, 2025",
        endDate: "Apr 7, 2025",
        sign: "Aries → Pisces",
        effects: [
            "Communication delays and misunderstandings",
            "Technology glitches",
            "Travel disruptions",
            "Contract issues"
        ],
        doDuring: [
            "Review and revise documents",
            "Reconnect with old friends",
            "Finish pending projects",
            "Backup important data"
        ],
        avoidDuring: [
            "Signing important contracts",
            "Starting new ventures",
            "Major purchases (electronics)",
            "Important presentations"
        ],
        color: "from-green-500 to-emerald-600"
    },
    {
        planet: "Venus",
        symbol: "♀",
        isRetrograde: false,
        startDate: "Mar 1, 2025",
        endDate: "Apr 12, 2025",
        sign: "Aries → Pisces",
        effects: [
            "Relationship reflections",
            "Past loves returning",
            "Financial reassessment",
            "Beauty/aesthetic changes"
        ],
        doDuring: [
            "Heal past relationships",
            "Reassess values",
            "Self-care and beauty routines",
            "Review finances"
        ],
        avoidDuring: [
            "Starting new relationships",
            "Getting married",
            "Major cosmetic changes",
            "Large luxury purchases"
        ],
        color: "from-pink-500 to-rose-600"
    },
    {
        planet: "Mars",
        symbol: "♂",
        isRetrograde: false,
        startDate: "Dec 6, 2024",
        endDate: "Feb 23, 2025",
        sign: "Leo → Cancer",
        effects: [
            "Decreased energy and motivation",
            "Frustration and anger issues",
            "Delayed actions",
            "Past conflicts resurface"
        ],
        doDuring: [
            "Review goals and strategies",
            "Rest and recover",
            "Resolve old conflicts",
            "Plan future actions"
        ],
        avoidDuring: [
            "Starting new projects",
            "Aggressive negotiations",
            "Surgery (if elective)",
            "New fitness regimes"
        ],
        color: "from-red-500 to-orange-600"
    },
    {
        planet: "Jupiter",
        symbol: "♃",
        isRetrograde: false,
        startDate: "Oct 9, 2025",
        endDate: "Feb 4, 2026",
        sign: "Cancer",
        effects: [
            "Spiritual introspection",
            "Review of beliefs",
            "Legal matters slow down",
            "Educational reassessment"
        ],
        doDuring: [
            "Study and learn",
            "Spiritual practices",
            "Review long-term goals",
            "Inner wisdom development"
        ],
        avoidDuring: [
            "Major legal decisions",
            "Starting higher education",
            "Long-distance travel",
            "Publishing/teaching new content"
        ],
        color: "from-yellow-500 to-amber-600"
    },
    {
        planet: "Saturn",
        symbol: "♄",
        isRetrograde: false,
        startDate: "Jul 13, 2025",
        endDate: "Nov 28, 2025",
        sign: "Pisces",
        effects: [
            "Karmic lessons intensify",
            "Structure reassessment",
            "Authority issues",
            "Career reflections"
        ],
        doDuring: [
            "Work on discipline",
            "Complete old responsibilities",
            "Restructure systems",
            "Face fears and limitations"
        ],
        avoidDuring: [
            "Major career changes",
            "Taking on new responsibilities",
            "Starting businesses",
            "Authority conflicts"
        ],
        color: "from-blue-600 to-indigo-700"
    },
    {
        planet: "Rahu",
        symbol: "☊",
        isRetrograde: true, // Always retrograde
        startDate: "Always",
        endDate: "Retrograde",
        sign: "Pisces (until 2025)",
        effects: [
            "Karmic desires amplified",
            "Illusions and confusion",
            "Material pursuits",
            "Obsessive tendencies"
        ],
        doDuring: [
            "Spiritual practices",
            "Detachment exercises",
            "Past life healing",
            "Research and investigation"
        ],
        avoidDuring: [
            "Impulsive decisions",
            "Get-rich-quick schemes",
            "Deceptive practices",
            "Excessive materialism"
        ],
        color: "from-purple-600 to-violet-800"
    },
    {
        planet: "Ketu",
        symbol: "☋",
        isRetrograde: true, // Always retrograde
        startDate: "Always",
        endDate: "Retrograde",
        sign: "Virgo (until 2025)",
        effects: [
            "Spiritual liberation urges",
            "Detachment from material",
            "Past life memories",
            "Intuition heightened"
        ],
        doDuring: [
            "Meditation and yoga",
            "Letting go of attachments",
            "Spiritual retreats",
            "Healing work"
        ],
        avoidDuring: [
            "Material expansion",
            "Ignoring spiritual signs",
            "Avoiding introspection",
            "Excessive worldly pursuits"
        ],
        color: "from-gray-500 to-gray-700"
    }
]

export default function RetrogradeTracker() {
    const [currentDate, setCurrentDate] = useState<Date | null>(null)
    const [selectedPlanet, setSelectedPlanet] = useState<RetrogradeInfo | null>(null)

    useEffect(() => {
        setCurrentDate(new Date())
    }, [])

    // Check if currently in retrograde based on dates
    const isCurrentlyRetrograde = (planet: RetrogradeInfo): boolean => {
        if (planet.startDate === "Always") return true
        if (!currentDate) return false

        const start = new Date(planet.startDate + ", 2025")
        const end = new Date(planet.endDate + ", 2025")
        return currentDate >= start && currentDate <= end
    }

    // Get days until next retrograde or until retrograde ends
    const getDaysInfo = (planet: RetrogradeInfo): string => {
        if (planet.startDate === "Always") return "Perpetual"
        if (!currentDate) return ""

        const start = new Date(planet.startDate + ", 2025")
        const end = new Date(planet.endDate + ", 2025")

        if (currentDate < start) {
            const days = Math.ceil((start.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24))
            return `Starts in ${days} days`
        } else if (currentDate <= end) {
            const days = Math.ceil((end.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24))
            return `${days} days remaining`
        } else {
            return "Completed for 2025"
        }
    }

    // Currently retrograde planets
    const activeRetrogrades = RETROGRADE_DATA.filter(p => isCurrentlyRetrograde(p))
    const upcomingRetrogrades = RETROGRADE_DATA.filter(p => !isCurrentlyRetrograde(p) && p.startDate !== "Always")

    return (
        <div className="space-y-6">
            {/* Header Card */}
            <Card className="bg-gradient-to-br from-slate-900/50 to-purple-900/30 border-purple-500/30 p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-amber-500/20 rounded-full">
                            <RotateCcw className="w-6 h-6 text-amber-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">Retrograde Tracker</h2>
                            <p className="text-sm text-gray-400">2025 Planetary Retrograde Calendar</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-2xl font-bold text-amber-400">{activeRetrogrades.length}</div>
                        <div className="text-xs text-gray-400">Currently Rx</div>
                    </div>
                </div>

                {/* Active Retrogrades Banner */}
                {activeRetrogrades.length > 0 && (
                    <div className="bg-amber-900/30 border border-amber-500/30 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <AlertTriangle className="w-4 h-4 text-amber-400" />
                            <span className="text-amber-400 font-medium">Currently Retrograde</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {activeRetrogrades.map(planet => (
                                <Badge
                                    key={planet.planet}
                                    className="bg-amber-500/20 text-amber-300 border-amber-500/30"
                                >
                                    {planet.symbol} {planet.planet}
                                </Badge>
                            ))}
                        </div>
                    </div>
                )}

                {activeRetrogrades.length === 0 && (
                    <div className="bg-green-900/30 border border-green-500/30 rounded-lg p-4">
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-400" />
                            <span className="text-green-400 font-medium">No major retrogrades currently active</span>
                        </div>
                    </div>
                )}
            </Card>

            {/* Planet Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {RETROGRADE_DATA.map((planet, idx) => {
                    const isActive = isCurrentlyRetrograde(planet)

                    return (
                        <motion.div
                            key={planet.planet}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                        >
                            <Card
                                className={`relative overflow-hidden cursor-pointer transition-transform hover:scale-105 ${isActive
                                        ? 'bg-amber-900/20 border-amber-500/50'
                                        : 'bg-slate-800/50 border-purple-500/20'
                                    }`}
                                onClick={() => setSelectedPlanet(planet)}
                            >
                                {/* Gradient accent */}
                                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${planet.color}`}></div>

                                <div className="p-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <span className="text-2xl">{planet.symbol}</span>
                                            <div>
                                                <h3 className="font-semibold text-white">{planet.planet}</h3>
                                                <p className="text-xs text-gray-400">{planet.sign}</p>
                                            </div>
                                        </div>
                                        {isActive ? (
                                            <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 animate-pulse">
                                                <RotateCcw className="w-3 h-3 mr-1" />
                                                Rx
                                            </Badge>
                                        ) : (
                                            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                                                Direct
                                            </Badge>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                                        <Calendar className="w-4 h-4" />
                                        <span>{planet.startDate} - {planet.endDate}</span>
                                    </div>

                                    <div className={`text-xs ${isActive ? 'text-amber-400' : 'text-gray-500'}`}>
                                        {getDaysInfo(planet)}
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    )
                })}
            </div>

            {/* Selected Planet Detail Modal */}
            {selectedPlanet && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={() => setSelectedPlanet(null)}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-slate-900 border border-purple-500/30 rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className={`bg-gradient-to-r ${selectedPlanet.color} p-6`}>
                            <div className="flex items-center gap-4">
                                <span className="text-4xl">{selectedPlanet.symbol}</span>
                                <div>
                                    <h3 className="text-2xl font-bold text-white">{selectedPlanet.planet} Retrograde</h3>
                                    <p className="text-white/80">{selectedPlanet.sign}</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Dates */}
                            <div className="flex items-center justify-between bg-slate-800/50 rounded-lg p-4">
                                <div className="text-center">
                                    <div className="text-xs text-gray-400 mb-1">Starts</div>
                                    <div className="font-semibold text-white">{selectedPlanet.startDate}</div>
                                </div>
                                <ArrowRight className="w-5 h-5 text-purple-400" />
                                <div className="text-center">
                                    <div className="text-xs text-gray-400 mb-1">Ends</div>
                                    <div className="font-semibold text-white">{selectedPlanet.endDate}</div>
                                </div>
                            </div>

                            {/* Effects */}
                            <div>
                                <h4 className="font-medium text-amber-400 mb-3 flex items-center gap-2">
                                    <AlertTriangle className="w-4 h-4" />
                                    Effects During Retrograde
                                </h4>
                                <ul className="space-y-2">
                                    {selectedPlanet.effects.map((effect, idx) => (
                                        <li key={idx} className="text-sm text-gray-300 flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 bg-amber-400 rounded-full"></span>
                                            {effect}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Do and Avoid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
                                    <h4 className="font-medium text-green-400 mb-3 flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4" />
                                        Best Activities
                                    </h4>
                                    <ul className="space-y-2">
                                        {selectedPlanet.doDuring.map((item, idx) => (
                                            <li key={idx} className="text-sm text-gray-300">✓ {item}</li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
                                    <h4 className="font-medium text-red-400 mb-3 flex items-center gap-2">
                                        <AlertTriangle className="w-4 h-4" />
                                        Avoid During This Time
                                    </h4>
                                    <ul className="space-y-2">
                                        {selectedPlanet.avoidDuring.map((item, idx) => (
                                            <li key={idx} className="text-sm text-gray-300">✗ {item}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            <button
                                onClick={() => setSelectedPlanet(null)}
                                className="w-full py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </div>
    )
}

// Compact Banner Component for Overview tab
export function RetrogradeBanner() {
    const [currentDate, setCurrentDate] = useState<Date | null>(null)

    useEffect(() => {
        setCurrentDate(new Date())
    }, [])

    // Check for active retrogrades (simplified)
    const activeRetrogrades = ["Rahu", "Ketu"] // Always retrograde
    // Add Mercury if in retrograde period (March-April 2025)
    if (currentDate) {
        const month = currentDate.getMonth()
        if (month >= 2 && month <= 3) { // March-April
            activeRetrogrades.unshift("Mercury")
        }
    }

    if (activeRetrogrades.length === 0) return null

    return (
        <Card className="bg-amber-900/20 border-amber-500/30 p-3">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <RotateCcw className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '3s' }} />
                    <span className="text-sm text-amber-400 font-medium">
                        Retrograde Alert: {activeRetrogrades.join(", ")} Rx
                    </span>
                </div>
                <Info className="w-4 h-4 text-gray-400 cursor-pointer" />
            </div>
        </Card>
    )
}
