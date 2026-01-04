"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    Calendar,
    Star,
    GraduationCap,
    Briefcase,
    Heart,
    Home,
    Baby,
    Sparkles,
    ChevronDown,
    ChevronUp
} from "lucide-react"

interface LifeEvent {
    id: string
    year: string
    age: string
    event: string
    category: "education" | "career" | "love" | "family" | "property" | "spiritual" | "health"
    dasha: string
    antardasha: string
    description: string
    status: "past" | "present" | "future"
    significance: "major" | "moderate" | "minor"
}

const LIFE_EVENTS: LifeEvent[] = [
    {
        id: "1",
        year: "1997-2000",
        age: "0-3",
        event: "Birth & Early Childhood",
        category: "family",
        dasha: "Venus",
        antardasha: "Venus-Moon",
        description: "Birth in nurturing environment. Foundation of emotional security laid.",
        status: "past",
        significance: "major"
    },
    {
        id: "2",
        year: "2003-2006",
        age: "6-9",
        event: "Primary Education Begins",
        category: "education",
        dasha: "Sun",
        antardasha: "Sun-Mars",
        description: "Active learning period. Development of leadership qualities.",
        status: "past",
        significance: "moderate"
    },
    {
        id: "3",
        year: "2010-2014",
        age: "13-17",
        event: "Higher Secondary Education",
        category: "education",
        dasha: "Moon",
        antardasha: "Moon-Saturn",
        description: "Focused academic period. Discipline and hard work emphasized.",
        status: "past",
        significance: "major"
    },
    {
        id: "4",
        year: "2015-2019",
        age: "18-22",
        event: "College & Professional Training",
        category: "education",
        dasha: "Mars",
        antardasha: "Mars-Rahu",
        description: "Technical education. Exploration of unconventional paths.",
        status: "past",
        significance: "major"
    },
    {
        id: "5",
        year: "2020-2023",
        age: "23-26",
        event: "Career Foundation",
        category: "career",
        dasha: "Rahu",
        antardasha: "Rahu-Jupiter",
        description: "First major job. Growth through unexpected opportunities.",
        status: "past",
        significance: "major"
    },
    {
        id: "6",
        year: "2024-2025",
        age: "27-28",
        event: "Current Phase - Transformation",
        category: "spiritual",
        dasha: "Rahu",
        antardasha: "Rahu-Saturn",
        description: "Period of karmic learning. Discipline and spiritual growth.",
        status: "present",
        significance: "major"
    },
    {
        id: "7",
        year: "2026-2028",
        age: "29-31",
        event: "Marriage & Partnership",
        category: "love",
        dasha: "Rahu",
        antardasha: "Rahu-Mercury",
        description: "Favorable period for marriage. Communication and partnership highlighted.",
        status: "future",
        significance: "major"
    },
    {
        id: "8",
        year: "2029-2032",
        age: "32-35",
        event: "Property Acquisition",
        category: "property",
        dasha: "Jupiter",
        antardasha: "Jupiter-Jupiter",
        description: "Expansion in assets. Purchase of home or major investments.",
        status: "future",
        significance: "major"
    },
    {
        id: "9",
        year: "2033-2036",
        age: "36-39",
        event: "Children & Family Growth",
        category: "family",
        dasha: "Jupiter",
        antardasha: "Jupiter-Saturn",
        description: "Period of family expansion. Parenthood and responsibilities.",
        status: "future",
        significance: "major"
    },
    {
        id: "10",
        year: "2037-2042",
        age: "40-45",
        event: "Career Peak",
        category: "career",
        dasha: "Jupiter",
        antardasha: "Jupiter-Venus",
        description: "Height of professional success. Recognition and achievements.",
        status: "future",
        significance: "major"
    },
]

export default function LifeTimeline() {
    const [expandedEvent, setExpandedEvent] = useState<string | null>("6")
    const [filter, setFilter] = useState<string>("all")

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case "education": return <GraduationCap className="w-4 h-4" />
            case "career": return <Briefcase className="w-4 h-4" />
            case "love": return <Heart className="w-4 h-4" />
            case "family": return <Baby className="w-4 h-4" />
            case "property": return <Home className="w-4 h-4" />
            case "spiritual": return <Sparkles className="w-4 h-4" />
            default: return <Star className="w-4 h-4" />
        }
    }

    const getCategoryColor = (category: string) => {
        switch (category) {
            case "education": return "bg-blue-500/20 text-blue-400 border-blue-500/30"
            case "career": return "bg-amber-500/20 text-amber-400 border-amber-500/30"
            case "love": return "bg-pink-500/20 text-pink-400 border-pink-500/30"
            case "family": return "bg-green-500/20 text-green-400 border-green-500/30"
            case "property": return "bg-cyan-500/20 text-cyan-400 border-cyan-500/30"
            case "spiritual": return "bg-purple-500/20 text-purple-400 border-purple-500/30"
            default: return "bg-gray-500/20 text-gray-400 border-gray-500/30"
        }
    }

    const getStatusStyle = (status: string) => {
        switch (status) {
            case "past": return "opacity-70"
            case "present": return "ring-2 ring-purple-400 bg-purple-900/20"
            case "future": return "opacity-90"
            default: return ""
        }
    }

    const filteredEvents = filter === "all"
        ? LIFE_EVENTS
        : LIFE_EVENTS.filter(e => e.category === filter)

    const categories = ["all", "education", "career", "love", "family", "property", "spiritual"]

    return (
        <div className="space-y-6">
            {/* Header */}
            <Card className="bg-gradient-to-br from-slate-900/50 to-purple-900/30 border-purple-500/30 p-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-purple-500/20 rounded-full">
                        <Calendar className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">Life Events Timeline</h2>
                        <p className="text-sm text-gray-400">Major milestones based on Dasha periods</p>
                    </div>
                </div>

                {/* Filter */}
                <div className="flex flex-wrap gap-2">
                    {categories.map(cat => (
                        <Badge
                            key={cat}
                            className={`cursor-pointer transition-all ${filter === cat
                                ? 'bg-purple-500 text-white'
                                : 'bg-slate-700/50 text-gray-400 hover:bg-slate-600/50'
                                }`}
                            onClick={() => setFilter(cat)}
                        >
                            {cat === "all" ? "All" : cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </Badge>
                    ))}
                </div>
            </Card>

            {/* Timeline */}
            <div className="relative">
                {/* Vertical Line */}
                <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-500 via-pink-500 to-amber-500" />

                {filteredEvents.map((event, idx) => (
                    <motion.div
                        layout
                        key={event.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className={`relative mb-6 ${idx % 2 === 0 ? 'md:pr-1/2' : 'md:pl-1/2 md:ml-auto'}`}
                    >
                        {/* Timeline Dot */}
                        <div className={`absolute ${idx % 2 === 0 ? 'left-2 md:right-[-8px] md:left-auto' : 'left-2 md:left-[-8px]'} top-4 w-4 h-4 rounded-full border-2 ${event.status === "present"
                            ? 'bg-purple-500 border-purple-400 animate-pulse'
                            : event.status === "past"
                                ? 'bg-gray-600 border-gray-500'
                                : 'bg-amber-500/50 border-amber-400'
                            }`} />

                        {/* Event Card */}
                        <Card
                            className={`ml-10 md:ml-0 md:w-[calc(50%-20px)] p-4 cursor-pointer transition-all ${getStatusStyle(event.status)} ${expandedEvent === event.id ? 'border-purple-400' : 'border-purple-500/20'
                                }`}
                            onClick={() => setExpandedEvent(expandedEvent === event.id ? null : event.id)}
                        >
                            <motion.div layout="position" className="flex items-start justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <div className={`p-1.5 rounded ${getCategoryColor(event.category)}`}>
                                        {getCategoryIcon(event.category)}
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-white text-sm">{event.event}</h4>
                                        <p className="text-xs text-gray-400">{event.year} (Age {event.age})</p>
                                    </div>
                                </div>
                                {expandedEvent === event.id ? (
                                    <ChevronUp className="w-4 h-4 text-gray-400" />
                                ) : (
                                    <ChevronDown className="w-4 h-4 text-gray-400" />
                                )}
                            </motion.div>

                            {event.status === "present" && (
                                <Badge className="bg-purple-500/20 text-purple-400 mb-2">Current Phase</Badge>
                            )}

                            {/* Expanded Content */}
                            {expandedEvent === event.id && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    style={{ overflow: "hidden" }}
                                    className="mt-3 pt-3 border-t border-slate-700"
                                >
                                    <p className="text-sm text-gray-300 mb-3">{event.description}</p>

                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                        <div>
                                            <span className="text-gray-500">Mahadasha:</span>
                                            <Badge className="ml-2 bg-amber-500/20 text-amber-400">{event.dasha}</Badge>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Antardasha:</span>
                                            <Badge className="ml-2 bg-cyan-500/20 text-cyan-400">{event.antardasha}</Badge>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Legend */}
            <Card className="bg-slate-800/50 border-purple-500/20 p-4">
                <h4 className="text-sm font-medium text-gray-400 mb-2">Timeline Legend</h4>
                <div className="flex flex-wrap gap-4 text-xs">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-gray-600 border-2 border-gray-500" />
                        <span className="text-gray-400">Past Events</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-purple-500 border-2 border-purple-400 animate-pulse" />
                        <span className="text-gray-400">Current Phase</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-amber-500/50 border-2 border-amber-400" />
                        <span className="text-gray-400">Future Predictions</span>
                    </div>
                </div>
            </Card>
        </div>
    )
}
