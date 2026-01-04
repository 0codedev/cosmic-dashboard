"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Calendar,
    Sun,
    Moon,
    Star,
    ArrowRight,
    TrendingUp,
    TrendingDown,
    ChevronLeft,
    ChevronRight
} from "lucide-react"

interface MonthlyPrediction {
    month: string
    rating: number // 1-5
    highlight: string
    career: "excellent" | "good" | "moderate" | "challenging"
    love: "excellent" | "good" | "moderate" | "challenging"
    health: "excellent" | "good" | "moderate" | "challenging"
    money: "excellent" | "good" | "moderate" | "challenging"
    advice: string
}

interface YearlyTheme {
    category: string
    prediction: string
    intensity: "high" | "medium" | "low"
}

// Varshphal data for 2025
const VARSHPHAL_2025 = {
    year: 2025,
    yearLord: "Mars",
    munthaSign: "Libra",
    munthaHouse: 9,
    lagna: "Leo",
    yearQuality: "Transformative Growth",
    overallRating: 4,
    themes: [
        { category: "Career", prediction: "Major advancement opportunities, leadership roles", intensity: "high" as const },
        { category: "Relationships", prediction: "Deepening of existing bonds, new connections", intensity: "medium" as const },
        { category: "Finance", prediction: "Steady growth, unexpected gains mid-year", intensity: "high" as const },
        { category: "Health", prediction: "Focus on mental wellness, energy management", intensity: "medium" as const },
        { category: "Spirituality", prediction: "Important spiritual revelations and growth", intensity: "high" as const },
    ] as YearlyTheme[],
    monthlyPredictions: [
        { month: "January", rating: 4, highlight: "New beginnings favor career moves", career: "excellent", love: "good", health: "good", money: "good", advice: "Start new projects, network actively" },
        { month: "February", rating: 3, highlight: "Focus on relationships and communication", career: "good", love: "excellent", health: "moderate", money: "moderate", advice: "Express feelings, resolve conflicts" },
        { month: "March", rating: 4, highlight: "Financial opportunities emerge", career: "good", love: "good", health: "excellent", money: "excellent", advice: "Invest wisely, avoid impulsive spending" },
        { month: "April", rating: 3, highlight: "Travel and learning favored", career: "moderate", love: "good", health: "good", money: "moderate", advice: "Expand knowledge, take short trips" },
        { month: "May", rating: 5, highlight: "Peak month for success and recognition", career: "excellent", love: "excellent", health: "excellent", money: "excellent", advice: "Take bold initiatives, celebrate wins" },
        { month: "June", rating: 4, highlight: "Home and family matters flourish", career: "good", love: "excellent", health: "good", money: "good", advice: "Invest in property, family bonding" },
        { month: "July", rating: 3, highlight: "Creative expression and romance peak", career: "moderate", love: "excellent", health: "moderate", money: "moderate", advice: "Express creativity, enjoy romance" },
        { month: "August", rating: 4, highlight: "Health improvements, work efficiency", career: "excellent", love: "good", health: "excellent", money: "good", advice: "Focus on fitness, organize workspace" },
        { month: "September", rating: 4, highlight: "Partnership opportunities arise", career: "excellent", love: "excellent", health: "good", money: "excellent", advice: "Collaborate, sign agreements" },
        { month: "October", rating: 3, highlight: "Transformation and inner work", career: "good", love: "moderate", health: "moderate", money: "good", advice: "Release old patterns, embrace change" },
        { month: "November", rating: 4, highlight: "Expansion and higher learning", career: "excellent", love: "good", health: "good", money: "excellent", advice: "Pursue education, travel abroad" },
        { month: "December", rating: 5, highlight: "Year ends with career triumph", career: "excellent", love: "excellent", health: "excellent", money: "excellent", advice: "Celebrate achievements, plan ahead" },
    ] as MonthlyPrediction[],
    keyDates: [
        { date: "Feb 14-18", event: "Venus transit brings romantic opportunities" },
        { date: "Mar 29", event: "Solar return - personal new year" },
        { date: "May 10-15", event: "Jupiter aspect - major expansion" },
        { date: "Aug 22-28", event: "Career milestone likely" },
        { date: "Oct 8", event: "Eclipse - avoid major decisions" },
        { date: "Dec 20-25", event: "Year-end success period" },
    ]
}

export default function VarshphalChart() {
    const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth())
    const [currentYear] = useState(2025)

    const currentMonthData = VARSHPHAL_2025.monthlyPredictions[selectedMonth]

    const getRatingColor = (rating: number) => {
        if (rating >= 4) return "text-green-400"
        if (rating >= 3) return "text-yellow-400"
        return "text-red-400"
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case "excellent": return "bg-green-500/20 text-green-400"
            case "good": return "bg-cyan-500/20 text-cyan-400"
            case "moderate": return "bg-yellow-500/20 text-yellow-400"
            case "challenging": return "bg-red-500/20 text-red-400"
            default: return "bg-gray-500/20 text-gray-400"
        }
    }

    const getIntensityColor = (intensity: string) => {
        switch (intensity) {
            case "high": return "bg-purple-500/20 text-purple-400 border-purple-500/30"
            case "medium": return "bg-blue-500/20 text-blue-400 border-blue-500/30"
            case "low": return "bg-gray-500/20 text-gray-400 border-gray-500/30"
            default: return ""
        }
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <Card className="bg-gradient-to-br from-slate-900/50 to-orange-900/30 border-orange-500/30 p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-orange-500/20 rounded-full">
                            <Calendar className="w-6 h-6 text-orange-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">Varshphal {currentYear}</h2>
                            <p className="text-sm text-gray-400">Annual Predictions (Solar Return Chart)</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-2xl font-bold text-orange-400">{VARSHPHAL_2025.yearQuality}</div>
                        <div className="flex items-center justify-end gap-1 mt-1">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    className={`w-4 h-4 ${i < VARSHPHAL_2025.overallRating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Year Overview */}
                <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="bg-slate-800/50 rounded-lg p-3">
                        <Sun className="w-5 h-5 text-orange-400 mx-auto mb-1" />
                        <div className="text-sm font-medium text-white">Year Lord</div>
                        <div className="text-xs text-orange-400">{VARSHPHAL_2025.yearLord}</div>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-3">
                        <Moon className="w-5 h-5 text-blue-400 mx-auto mb-1" />
                        <div className="text-sm font-medium text-white">Muntha</div>
                        <div className="text-xs text-blue-400">{VARSHPHAL_2025.munthaSign} (H{VARSHPHAL_2025.munthaHouse})</div>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-3">
                        <Star className="w-5 h-5 text-purple-400 mx-auto mb-1" />
                        <div className="text-sm font-medium text-white">Lagna</div>
                        <div className="text-xs text-purple-400">{VARSHPHAL_2025.lagna}</div>
                    </div>
                </div>
            </Card>

            {/* Yearly Themes */}
            <Card className="bg-slate-800/50 border-purple-500/20 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Major Themes for {currentYear}</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {VARSHPHAL_2025.themes.map((theme, idx) => (
                        <motion.div
                            key={theme.category}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className={`p-3 rounded-lg border ${getIntensityColor(theme.intensity)}`}
                        >
                            <div className="flex items-center justify-between mb-1">
                                <span className="font-medium text-white text-sm">{theme.category}</span>
                                <Badge className={getIntensityColor(theme.intensity)}>
                                    {theme.intensity}
                                </Badge>
                            </div>
                            <p className="text-xs text-gray-400">{theme.prediction}</p>
                        </motion.div>
                    ))}
                </div>
            </Card>

            {/* Monthly Navigator */}
            <Card className="bg-slate-800/50 border-orange-500/20 p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">Monthly Predictions</h3>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedMonth(Math.max(0, selectedMonth - 1))}
                            disabled={selectedMonth === 0}
                            className="border-orange-500/30"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <span className="text-white font-medium px-4">{currentMonthData.month}</span>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedMonth(Math.min(11, selectedMonth + 1))}
                            disabled={selectedMonth === 11}
                            className="border-orange-500/30"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                {/* Month Grid */}
                <div className="grid grid-cols-6 md:grid-cols-12 gap-1 mb-6">
                    {VARSHPHAL_2025.monthlyPredictions.map((month, idx) => (
                        <button
                            key={month.month}
                            onClick={() => setSelectedMonth(idx)}
                            className={`p-2 rounded text-xs transition-all ${idx === selectedMonth
                                    ? 'bg-orange-500 text-white'
                                    : `bg-slate-700/50 ${getRatingColor(month.rating)} hover:bg-slate-600/50`
                                }`}
                        >
                            {month.month.slice(0, 3)}
                        </button>
                    ))}
                </div>

                {/* Selected Month Details */}
                <motion.div
                    key={selectedMonth}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-4"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <h4 className="text-xl font-bold text-white">{currentMonthData.month} {currentYear}</h4>
                            <p className="text-sm text-gray-400">{currentMonthData.highlight}</p>
                        </div>
                        <div className="flex gap-1">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    className={`w-5 h-5 ${i < currentMonthData.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Area Ratings */}
                    <div className="grid grid-cols-4 gap-3">
                        {[
                            { label: "Career", value: currentMonthData.career },
                            { label: "Love", value: currentMonthData.love },
                            { label: "Health", value: currentMonthData.health },
                            { label: "Money", value: currentMonthData.money },
                        ].map((area) => (
                            <div key={area.label} className="text-center">
                                <Badge className={`${getStatusColor(area.value)} w-full justify-center`}>
                                    {area.value}
                                </Badge>
                                <div className="text-xs text-gray-500 mt-1">{area.label}</div>
                            </div>
                        ))}
                    </div>

                    {/* Advice */}
                    <div className="bg-gradient-to-r from-orange-900/20 to-amber-900/20 border border-orange-500/20 rounded-lg p-4">
                        <div className="flex items-center gap-2 text-orange-400 mb-2">
                            <TrendingUp className="w-4 h-4" />
                            <span className="font-medium text-sm">Advice for {currentMonthData.month}</span>
                        </div>
                        <p className="text-sm text-gray-300">{currentMonthData.advice}</p>
                    </div>
                </motion.div>
            </Card>

            {/* Key Dates */}
            <Card className="bg-slate-800/50 border-amber-500/20 p-6">
                <h3 className="text-lg font-semibold text-amber-400 mb-4">Important Dates in {currentYear}</h3>
                <div className="space-y-3">
                    {VARSHPHAL_2025.keyDates.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3 text-sm">
                            <Badge className="bg-amber-500/20 text-amber-300 min-w-[100px] justify-center">
                                {item.date}
                            </Badge>
                            <ArrowRight className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-300">{item.event}</span>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    )
}
