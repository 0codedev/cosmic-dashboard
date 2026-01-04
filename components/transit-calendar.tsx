"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    CalendarDays,
    ChevronLeft,
    ChevronRight,
    Star,
    AlertCircle,
    Sparkles
} from "lucide-react"

interface TransitEvent {
    date: string
    planet: string
    symbol: string
    event: string
    impact: "positive" | "neutral" | "challenging"
    description: string
}

interface MonthData {
    month: string
    year: number
    overallEnergy: "excellent" | "good" | "neutral" | "challenging"
    events: TransitEvent[]
    bestDays: number[]
    challengingDays: number[]
}

const MONTHS_DATA: MonthData[] = [
    {
        month: "December",
        year: 2024,
        overallEnergy: "good",
        events: [
            { date: "Dec 7", planet: "Mars", symbol: "♂", event: "Mars enters Aquarius", impact: "positive", description: "Energy boost for your lagna, assertiveness increases" },
            { date: "Dec 15", planet: "Mercury", symbol: "☿", event: "Mercury goes direct", impact: "positive", description: "Communication clarity returns, good for signing contracts" },
            { date: "Dec 21", planet: "Sun", symbol: "☉", event: "Winter Solstice", impact: "neutral", description: "Sun enters Capricorn, focus on career matters" },
            { date: "Dec 29", planet: "Jupiter", symbol: "♃", event: "Jupiter retrograde ends", impact: "positive", description: "Growth opportunities resume, expansion energy returns" },
        ],
        bestDays: [7, 8, 15, 16, 29, 30],
        challengingDays: [4, 11, 25]
    },
    {
        month: "January",
        year: 2025,
        overallEnergy: "excellent",
        events: [
            { date: "Jan 3", planet: "Venus", symbol: "♀", event: "Venus enters Pisces", impact: "positive", description: "Venus exalted - excellent for love, creativity, wealth" },
            { date: "Jan 13", planet: "Mars", symbol: "♂", event: "Mars direct", impact: "positive", description: "Action energy restored, proceed with stalled projects" },
            { date: "Jan 20", planet: "Sun", symbol: "☉", event: "Sun enters Aquarius", impact: "positive", description: "Sun in your lagna sign - confidence and vitality peak" },
            { date: "Jan 29", planet: "Moon", symbol: "☽", event: "Full Moon in Cancer", impact: "neutral", description: "Emotional clarity, health matters highlighted" },
        ],
        bestDays: [3, 4, 13, 14, 20, 21, 22],
        challengingDays: [8, 15, 29]
    },
    {
        month: "February",
        year: 2025,
        overallEnergy: "good",
        events: [
            { date: "Feb 4", planet: "Mercury", symbol: "☿", event: "Mercury enters Aquarius", impact: "positive", description: "Sharp thinking, good for intellectual pursuits" },
            { date: "Feb 12", planet: "Saturn", symbol: "♄", event: "Saturn-Neptune aspect", impact: "challenging", description: "Reality checks in spiritual matters, stay grounded" },
            { date: "Feb 18", planet: "Sun", symbol: "☉", event: "Sun enters Pisces", impact: "neutral", description: "Focus shifts to finances and family" },
        ],
        bestDays: [4, 5, 10, 11, 24, 25],
        challengingDays: [12, 13, 27]
    }
]

export default function TransitCalendar() {
    const [currentMonthIndex, setCurrentMonthIndex] = useState(0)

    const currentMonth = MONTHS_DATA[currentMonthIndex]

    const getEnergyColor = (energy: string) => {
        switch (energy) {
            case "excellent": return "bg-green-500/20 text-green-400 border-green-500/30"
            case "good": return "bg-cyan-500/20 text-cyan-400 border-cyan-500/30"
            case "neutral": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
            case "challenging": return "bg-red-500/20 text-red-400 border-red-500/30"
            default: return ""
        }
    }

    const getImpactColor = (impact: string) => {
        switch (impact) {
            case "positive": return "text-green-400"
            case "neutral": return "text-yellow-400"
            case "challenging": return "text-red-400"
            default: return ""
        }
    }

    const prevMonth = () => {
        setCurrentMonthIndex(prev => Math.max(0, prev - 1))
    }

    const nextMonth = () => {
        setCurrentMonthIndex(prev => Math.min(MONTHS_DATA.length - 1, prev + 1))
    }

    // Generate calendar days
    const daysInMonth = new Date(currentMonth.year, new Date(`${currentMonth.month} 1, ${currentMonth.year}`).getMonth() + 1, 0).getDate()
    const firstDayOfWeek = new Date(`${currentMonth.month} 1, ${currentMonth.year}`).getDay()

    return (
        <div className="space-y-6">
            {/* Header */}
            <Card className="bg-gradient-to-br from-green-900/30 to-slate-900/50 border-green-500/30 p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-green-500/20 rounded-full">
                            <CalendarDays className="w-6 h-6 text-green-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">Transit Calendar</h2>
                            <p className="text-sm text-gray-400">Monthly planetary movements</p>
                        </div>
                    </div>
                    <Badge className={getEnergyColor(currentMonth.overallEnergy)}>
                        {currentMonth.overallEnergy.charAt(0).toUpperCase() + currentMonth.overallEnergy.slice(1)} Month
                    </Badge>
                </div>

                {/* Month Navigation */}
                <div className="flex items-center justify-center gap-4">
                    <button
                        onClick={prevMonth}
                        disabled={currentMonthIndex === 0}
                        className="p-2 hover:bg-slate-700/50 rounded-full transition-colors disabled:opacity-50"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <h3 className="text-xl font-semibold text-white">
                        {currentMonth.month} {currentMonth.year}
                    </h3>
                    <button
                        onClick={nextMonth}
                        disabled={currentMonthIndex === MONTHS_DATA.length - 1}
                        className="p-2 hover:bg-slate-700/50 rounded-full transition-colors disabled:opacity-50"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </Card>

            {/* Calendar Grid */}
            <Card className="bg-slate-800/50 border-purple-500/20 p-4">
                <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-400 mb-2">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                        <div key={day} className="py-2">{day}</div>
                    ))}
                </div>

                <div className="grid grid-cols-7 gap-1">
                    {/* Empty cells for first week */}
                    {[...Array(firstDayOfWeek)].map((_, i) => (
                        <div key={`empty-${i}`} className="h-10" />
                    ))}

                    {/* Days */}
                    {[...Array(daysInMonth)].map((_, i) => {
                        const day = i + 1
                        const isBest = currentMonth.bestDays.includes(day)
                        const isChallenging = currentMonth.challengingDays.includes(day)
                        const isToday = new Date().getDate() === day &&
                            new Date().getMonth() === new Date(`${currentMonth.month} 1, ${currentMonth.year}`).getMonth()

                        return (
                            <div
                                key={day}
                                className={`h-10 flex items-center justify-center rounded-lg text-sm transition-all ${isToday
                                        ? 'bg-purple-500 text-white font-bold'
                                        : isBest
                                            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                            : isChallenging
                                                ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                                                : 'hover:bg-slate-700/50'
                                    }`}
                            >
                                {day}
                                {isBest && <Sparkles className="w-2 h-2 ml-0.5" />}
                            </div>
                        )
                    })}
                </div>

                {/* Legend */}
                <div className="flex gap-4 mt-4 text-xs justify-center">
                    <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-green-500/30 rounded" />
                        <span className="text-gray-400">Best Days</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-red-500/20 rounded" />
                        <span className="text-gray-400">Challenging</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-purple-500 rounded" />
                        <span className="text-gray-400">Today</span>
                    </div>
                </div>
            </Card>

            {/* Events List */}
            <Card className="bg-slate-800/50 border-purple-500/20 p-6">
                <h4 className="text-lg font-semibold text-purple-400 mb-4">Key Transits This Month</h4>
                <div className="space-y-3">
                    {currentMonth.events.map((event, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="flex items-start gap-3 p-3 bg-slate-900/50 rounded-lg"
                        >
                            <div className="text-2xl">{event.symbol}</div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between">
                                    <h5 className="font-medium text-white">{event.event}</h5>
                                    <Badge className="text-xs">{event.date}</Badge>
                                </div>
                                <p className="text-sm text-gray-400">{event.description}</p>
                            </div>
                            <div className={getImpactColor(event.impact)}>
                                {event.impact === "positive" ? <Star className="w-5 h-5 fill-current" /> :
                                    event.impact === "challenging" ? <AlertCircle className="w-5 h-5" /> :
                                        <Star className="w-5 h-5" />}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </Card>
        </div>
    )
}
