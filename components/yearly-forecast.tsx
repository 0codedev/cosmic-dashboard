"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
    Calendar,
    Star,
    TrendingUp,
    TrendingDown,
    Minus,
    ChevronRight,
    Sparkles
} from "lucide-react"

interface QuarterForecast {
    quarter: string
    months: string
    theme: string
    overallRating: number
    areas: {
        name: string
        rating: number
        trend: "up" | "stable" | "down"
        prediction: string
    }[]
    highlights: string[]
    challenges: string[]
}

const YEARLY_FORECAST: QuarterForecast[] = [
    {
        quarter: "Q1",
        months: "Jan - Mar 2025",
        theme: "Foundation & Stability",
        overallRating: 75,
        areas: [
            { name: "Career", rating: 80, trend: "up", prediction: "Professional growth through discipline" },
            { name: "Finance", rating: 70, trend: "stable", prediction: "Steady income, avoid speculation" },
            { name: "Health", rating: 75, trend: "stable", prediction: "Focus on routine and rest" },
            { name: "Relationships", rating: 72, trend: "up", prediction: "New meaningful connections" },
        ],
        highlights: [
            "Venus exalted in Pisces (Jan 3-28) - love peaks",
            "Jupiter direct - expansion resumes",
            "Sun in Aquarius activates your lagna"
        ],
        challenges: [
            "Saturn-Neptune aspect mid-Feb",
            "Mercury retrograde shadow period"
        ]
    },
    {
        quarter: "Q2",
        months: "Apr - Jun 2025",
        theme: "Growth & Expansion",
        overallRating: 82,
        areas: [
            { name: "Career", rating: 85, trend: "up", prediction: "Major opportunities, recognition" },
            { name: "Finance", rating: 78, trend: "up", prediction: "Income growth, new sources" },
            { name: "Health", rating: 80, trend: "up", prediction: "Energy increases, fitness gains" },
            { name: "Relationships", rating: 85, trend: "up", prediction: "Deepening bonds, possible commitment" },
        ],
        highlights: [
            "Jupiter aspects your Moon - emotional wisdom",
            "Mars in favorable position for action",
            "Best quarter for new initiatives"
        ],
        challenges: [
            "Avoid overcommitment in May",
            "Travel disruptions possible"
        ]
    },
    {
        quarter: "Q3",
        months: "Jul - Sep 2025",
        theme: "Transformation & Change",
        overallRating: 68,
        areas: [
            { name: "Career", rating: 65, trend: "down", prediction: "Restructuring, patience needed" },
            { name: "Finance", rating: 70, trend: "stable", prediction: "Conserve resources, cut expenses" },
            { name: "Health", rating: 60, trend: "down", prediction: "Watch stress levels, rest more" },
            { name: "Relationships", rating: 75, trend: "stable", prediction: "Testing period, stay committed" },
        ],
        highlights: [
            "Saturn retrograde brings review period",
            "Good for inner work and meditation",
            "Property matters may resolve"
        ],
        challenges: [
            "Multiple retrogrades in August",
            "Health requires extra attention",
            "Avoid major decisions in Sept"
        ]
    },
    {
        quarter: "Q4",
        months: "Oct - Dec 2025",
        theme: "Harvest & Celebration",
        overallRating: 85,
        areas: [
            { name: "Career", rating: 88, trend: "up", prediction: "Rewards for past efforts, promotions" },
            { name: "Finance", rating: 82, trend: "up", prediction: "Year-end bonuses, investments mature" },
            { name: "Health", rating: 80, trend: "up", prediction: "Recovery and vitality return" },
            { name: "Relationships", rating: 90, trend: "up", prediction: "Celebrations, family harmony" },
        ],
        highlights: [
            "Jupiter enters favorable sign",
            "Diwali period especially auspicious",
            "Best quarter for celebrations"
        ],
        challenges: [
            "Don't overcommit financially",
            "Balance work and rest"
        ]
    }
]

export default function YearlyForecast() {
    const [selectedQuarter, setSelectedQuarter] = useState<string>("Q1")

    const currentQuarter = YEARLY_FORECAST.find(q => q.quarter === selectedQuarter)

    const getTrendIcon = (trend: string) => {
        switch (trend) {
            case "up": return <TrendingUp className="w-4 h-4 text-green-400" />
            case "down": return <TrendingDown className="w-4 h-4 text-red-400" />
            default: return <Minus className="w-4 h-4 text-yellow-400" />
        }
    }

    const getRatingColor = (rating: number) => {
        if (rating >= 80) return "text-green-400"
        if (rating >= 65) return "text-cyan-400"
        if (rating >= 50) return "text-yellow-400"
        return "text-red-400"
    }

    const getOverallColor = (rating: number) => {
        if (rating >= 80) return "from-green-900/30"
        if (rating >= 70) return "from-cyan-900/30"
        return "from-yellow-900/30"
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <Card className="bg-gradient-to-br from-purple-900/30 to-slate-900/50 border-purple-500/30 p-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-purple-500/20 rounded-full">
                        <Calendar className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">2025 Yearly Forecast</h2>
                        <p className="text-sm text-gray-400">Quarter-by-quarter predictions</p>
                    </div>
                </div>

                {/* Quarter Selection */}
                <div className="grid grid-cols-4 gap-2">
                    {YEARLY_FORECAST.map(q => (
                        <motion.div
                            key={q.quarter}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`p-3 rounded-lg cursor-pointer text-center transition-all ${selectedQuarter === q.quarter
                                    ? 'bg-purple-500/30 border border-purple-400'
                                    : 'bg-slate-800/50 border border-slate-700 hover:border-purple-500/50'
                                }`}
                            onClick={() => setSelectedQuarter(q.quarter)}
                        >
                            <div className="font-bold text-white">{q.quarter}</div>
                            <div className="text-xs text-gray-400">{q.months.split(" ")[0]}</div>
                            <div className={`text-lg font-bold ${getRatingColor(q.overallRating)}`}>
                                {q.overallRating}%
                            </div>
                        </motion.div>
                    ))}
                </div>
            </Card>

            {/* Quarter Details */}
            {currentQuarter && (
                <motion.div
                    key={currentQuarter.quarter}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                >
                    {/* Theme Card */}
                    <Card className={`bg-gradient-to-br ${getOverallColor(currentQuarter.overallRating)} to-slate-900/50 border-purple-500/20 p-6`}>
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <Badge className="bg-purple-500/20 text-purple-400 mb-2">
                                    {currentQuarter.months}
                                </Badge>
                                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                    <Sparkles className="w-5 h-5 text-purple-400" />
                                    {currentQuarter.theme}
                                </h3>
                            </div>
                            <div className="text-right">
                                <div className={`text-4xl font-bold ${getRatingColor(currentQuarter.overallRating)}`}>
                                    {currentQuarter.overallRating}%
                                </div>
                                <div className="text-xs text-gray-400">Overall Rating</div>
                            </div>
                        </div>
                        <Progress value={currentQuarter.overallRating} className="h-2" />
                    </Card>

                    {/* Area Predictions */}
                    <Card className="bg-slate-800/50 border-purple-500/20 p-6">
                        <h4 className="text-lg font-semibold text-purple-400 mb-4">Area Predictions</h4>
                        <div className="grid md:grid-cols-2 gap-4">
                            {currentQuarter.areas.map((area, idx) => (
                                <motion.div
                                    key={area.name}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="p-4 bg-slate-900/50 rounded-lg border border-slate-700"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="font-medium text-white">{area.name}</span>
                                        <div className="flex items-center gap-2">
                                            {getTrendIcon(area.trend)}
                                            <span className={`font-bold ${getRatingColor(area.rating)}`}>{area.rating}%</span>
                                        </div>
                                    </div>
                                    <Progress value={area.rating} className="h-1.5 mb-2" />
                                    <p className="text-sm text-gray-400">{area.prediction}</p>
                                </motion.div>
                            ))}
                        </div>
                    </Card>

                    {/* Highlights & Challenges */}
                    <div className="grid md:grid-cols-2 gap-4">
                        <Card className="bg-green-900/20 border-green-500/20 p-6">
                            <h4 className="text-lg font-semibold text-green-400 mb-4 flex items-center gap-2">
                                <Star className="w-5 h-5" />
                                Highlights
                            </h4>
                            <div className="space-y-2">
                                {currentQuarter.highlights.map((highlight, idx) => (
                                    <div key={idx} className="flex items-start gap-2 text-gray-300">
                                        <ChevronRight className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                                        <span className="text-sm">{highlight}</span>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        <Card className="bg-amber-900/20 border-amber-500/20 p-6">
                            <h4 className="text-lg font-semibold text-amber-400 mb-4 flex items-center gap-2">
                                <Star className="w-5 h-5" />
                                Challenges
                            </h4>
                            <div className="space-y-2">
                                {currentQuarter.challenges.map((challenge, idx) => (
                                    <div key={idx} className="flex items-start gap-2 text-gray-300">
                                        <ChevronRight className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                                        <span className="text-sm">{challenge}</span>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>
                </motion.div>
            )}
        </div>
    )
}
