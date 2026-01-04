"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
    Calendar,
    TrendingUp,
    TrendingDown,
    AlertTriangle,
    Star,
    ChevronRight,
    Info
} from "lucide-react"

interface DashaPeriod {
    planet: string
    symbol: string
    type: "mahadasha" | "antardasha" | "pratyantardasha"
    startDate: string
    endDate: string
    status: "past" | "current" | "future"
    predictions: {
        area: string
        effect: "positive" | "neutral" | "challenging"
        description: string
    }[]
    keyEvents: string[]
    remedies: string[]
}

const DASHA_PERIODS: DashaPeriod[] = [
    {
        planet: "Jupiter",
        symbol: "♃",
        type: "mahadasha",
        startDate: "July 2011",
        endDate: "July 2027",
        status: "current",
        predictions: [
            { area: "Career", effect: "positive", description: "Growth in wisdom-related fields, teaching opportunities" },
            { area: "Spirituality", effect: "positive", description: "Deep spiritual awakening, guru blessings" },
            { area: "Finance", effect: "neutral", description: "Steady growth, avoid risky investments" },
            { area: "Health", effect: "positive", description: "Generally good health, focus on liver care" },
            { area: "Relationships", effect: "positive", description: "Supportive mentors and beneficial connections" },
        ],
        keyEvents: [
            "Higher education completion",
            "Career establishment in knowledge field",
            "Meeting spiritual teachers",
            "Foreign travel opportunities",
            "Recognition for expertise"
        ],
        remedies: [
            "Chant 'Om Gram Greem Groom Sah Gurave Namaha' on Thursdays",
            "Donate yellow items to Brahmins",
            "Wear yellow sapphire (after consultation)",
            "Fast on Thursdays for spiritual growth"
        ]
    },
    {
        planet: "Saturn",
        symbol: "♄",
        type: "antardasha",
        startDate: "Nov 2024",
        endDate: "May 2027",
        status: "current",
        predictions: [
            { area: "Career", effect: "challenging", description: "Hard work required, delayed results" },
            { area: "Health", effect: "challenging", description: "Watch for fatigue, joint issues" },
            { area: "Finance", effect: "neutral", description: "Slow but steady accumulation" },
            { area: "Relationships", effect: "neutral", description: "Tests in commitment, mature bonds" },
        ],
        keyEvents: [
            "Career restructuring period",
            "Learning patience and discipline",
            "Karmic debt settlement",
            "Building long-term foundations"
        ],
        remedies: [
            "Chant 'Om Sham Shanaishcharaya Namaha' 108 times daily",
            "Donate black sesame or mustard oil on Saturdays",
            "Help elderly and disabled people",
            "Light sesame oil lamp on Saturday evenings"
        ]
    },
    {
        planet: "Mercury",
        symbol: "☿",
        type: "antardasha",
        startDate: "May 2027",
        endDate: "Aug 2029",
        status: "future",
        predictions: [
            { area: "Career", effect: "positive", description: "Success in communication, writing, tech" },
            { area: "Finance", effect: "positive", description: "Multiple income streams possible" },
            { area: "Health", effect: "neutral", description: "Watch for stress-related issues" },
            { area: "Relationships", effect: "positive", description: "Good for networking, friendships" },
        ],
        keyEvents: [
            "Business expansion opportunities",
            "Learning new skills",
            "Travel for work",
            "Improved analytical abilities"
        ],
        remedies: [
            "Chant 'Om Bum Budhaya Namaha' on Wednesdays",
            "Donate green items to students",
            "Wear emerald for enhanced communication"
        ]
    }
]

export default function DashaPredictions() {
    const [selectedPeriod, setSelectedPeriod] = useState<string>("Jupiter")

    const currentPeriod = DASHA_PERIODS.find(p => p.planet === selectedPeriod)

    const getEffectColor = (effect: string) => {
        switch (effect) {
            case "positive": return "text-green-400 bg-green-500/20"
            case "neutral": return "text-yellow-400 bg-yellow-500/20"
            case "challenging": return "text-red-400 bg-red-500/20"
            default: return ""
        }
    }

    const getEffectIcon = (effect: string) => {
        switch (effect) {
            case "positive": return <TrendingUp className="w-4 h-4" />
            case "neutral": return <Star className="w-4 h-4" />
            case "challenging": return <AlertTriangle className="w-4 h-4" />
            default: return null
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case "past": return "bg-gray-500/20 text-gray-400"
            case "current": return "bg-green-500/20 text-green-400"
            case "future": return "bg-blue-500/20 text-blue-400"
            default: return ""
        }
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <Card className="bg-gradient-to-br from-yellow-900/30 to-slate-900/50 border-yellow-500/30 p-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-yellow-500/20 rounded-full">
                        <Calendar className="w-6 h-6 text-yellow-400" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">Dasha Predictions</h2>
                        <p className="text-sm text-gray-400">Detailed period-wise predictions</p>
                    </div>
                </div>

                {/* Period Selection */}
                <div className="flex flex-wrap gap-2">
                    {DASHA_PERIODS.map(period => (
                        <Badge
                            key={period.planet}
                            className={`cursor-pointer transition-all ${selectedPeriod === period.planet
                                ? 'bg-yellow-500 text-white'
                                : `${getStatusColor(period.status)} hover:opacity-80`
                                }`}
                            onClick={() => setSelectedPeriod(period.planet)}
                        >
                            {period.symbol} {period.planet}
                            {period.status === "current" && " ●"}
                        </Badge>
                    ))}
                </div>
            </Card>

            {/* Period Details */}
            {currentPeriod && (
                <motion.div
                    key={currentPeriod.planet}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                >
                    {/* Period Header */}
                    <Card className="bg-slate-800/50 border-purple-500/20 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <span className="text-4xl">{currentPeriod.symbol}</span>
                                <div>
                                    <h3 className="text-xl font-bold text-white">{currentPeriod.planet} {currentPeriod.type}</h3>
                                    <p className="text-sm text-gray-400">
                                        {currentPeriod.startDate} - {currentPeriod.endDate}
                                    </p>
                                </div>
                            </div>
                            <Badge className={getStatusColor(currentPeriod.status)}>
                                {currentPeriod.status === "current" ? "Active Now" : currentPeriod.status}
                            </Badge>
                        </div>

                        {currentPeriod.status === "current" && (
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">Period Progress</span>
                                    <span className="text-yellow-400">~45%</span>
                                </div>
                                <Progress value={45} className="h-2" />
                            </div>
                        )}
                    </Card>

                    {/* Area Predictions */}
                    <Card className="bg-slate-800/50 border-purple-500/20 p-6">
                        <h4 className="text-lg font-semibold text-purple-400 mb-4">Area-wise Effects</h4>
                        <div className="grid md:grid-cols-2 gap-3">
                            {currentPeriod.predictions.map((pred, idx) => (
                                <motion.div
                                    key={pred.area}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="p-3 bg-slate-900/50 rounded-lg border border-slate-700"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="font-medium text-white">{pred.area}</span>
                                        <Badge className={getEffectColor(pred.effect)}>
                                            {getEffectIcon(pred.effect)}
                                            <span className="ml-1 capitalize">{pred.effect}</span>
                                        </Badge>
                                    </div>
                                    <p className="text-sm text-gray-400">{pred.description}</p>
                                </motion.div>
                            ))}
                        </div>
                    </Card>

                    {/* Key Events */}
                    <Card className="bg-gradient-to-br from-cyan-900/20 to-slate-900/50 border-cyan-500/20 p-6">
                        <h4 className="text-lg font-semibold text-cyan-400 mb-4">Key Events to Expect</h4>
                        <div className="space-y-2">
                            {currentPeriod.keyEvents.map((event, idx) => (
                                <div key={idx} className="flex items-center gap-2 text-gray-300">
                                    <ChevronRight className="w-4 h-4 text-cyan-400" />
                                    <span className="text-sm">{event}</span>
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* Remedies */}
                    <Card className="bg-gradient-to-br from-amber-900/20 to-slate-900/50 border-amber-500/20 p-6">
                        <h4 className="text-lg font-semibold text-amber-400 mb-4">Recommended Remedies</h4>
                        <div className="space-y-2">
                            {currentPeriod.remedies.map((remedy, idx) => (
                                <div key={idx} className="flex items-start gap-2 text-gray-300">
                                    <Star className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                                    <span className="text-sm">{remedy}</span>
                                </div>
                            ))}
                        </div>
                    </Card>
                </motion.div>
            )}

            {/* Info */}
            <Card className="bg-blue-900/20 border-blue-500/20 p-4">
                <div className="flex items-center gap-2">
                    <Info className="w-5 h-5 text-blue-400" />
                    <p className="text-sm text-gray-400">
                        Predictions are based on general planetary indications. Individual results vary based on the complete chart.
                    </p>
                </div>
            </Card>
        </div>
    )
}
