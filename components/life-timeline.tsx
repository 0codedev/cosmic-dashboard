"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
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
    ChevronUp,
    Zap,
    TrendingUp,
    Shield
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
        year: "1997-2011",
        age: "0-14",
        event: "Rahu Mahadasha Finish",
        category: "family",
        dasha: "Rahu",
        antardasha: "Various",
        description: "Early foundation. 12th house Rahu influence - search for identity.",
        status: "past",
        significance: "major"
    },
    {
        id: "2",
        year: "2011-2015",
        age: "14-18",
        event: "Jupiter Foundation",
        category: "education",
        dasha: "Jupiter",
        antardasha: "Jup-Jup",
        description: "Expansion of consciousness. Academic focus and higher learning starts.",
        status: "past",
        significance: "moderate"
    },
    {
        id: "3",
        year: "2020-2022",
        age: "23-25",
        event: "Venus Antardasha - Career Start",
        category: "career",
        dasha: "Jupiter",
        antardasha: "Jup-Ven",
        description: "Creative expansion. First professional footprints.",
        status: "past",
        significance: "major"
    },
    {
        id: "4",
        year: "2024-2025",
        age: "27-28",
        event: "The Saturn Squeeze (Sade Sati)",
        category: "spiritual",
        dasha: "Jupiter",
        antardasha: "Jup-Sat",
        description: "The peak of Sade Sati. Structural pressure, mental testing, and hard lessons.",
        status: "present",
        significance: "major"
    },
    {
        id: "5",
        year: "Dec 2025 - Apr 2026",
        age: "28-29",
        event: "The Triple Rahu Vortex",
        category: "career",
        dasha: "Jupiter",
        antardasha: "Jup-Rah",
        description: "Maximum risk of compulsion. High volatility in trading. Avoid big bets.",
        status: "future",
        significance: "major"
    },
    {
        id: "6",
        year: "2026",
        age: "29",
        event: "Marriage & Partnership Window",
        category: "love",
        dasha: "Jupiter",
        antardasha: "Jup-Rah",
        description: "Favorable period for partnership as Rahu transits 7th/1st axis.",
        status: "future",
        significance: "major"
    },
    {
        id: "7",
        year: "July 2027",
        age: "30",
        event: "The Great Saturn Shift",
        category: "career",
        dasha: "Saturn",
        antardasha: "Sat-Sat",
        description: "Start of 19-year Saturn Mahadasha. Move from expansion (Jup) to structure (Sat).",
        status: "future",
        significance: "major"
    },
    {
        id: "8",
        year: "2029-2032",
        age: "32-35",
        event: "First Major Wealth Peak",
        category: "property",
        dasha: "Saturn",
        antardasha: "Sat-Mer",
        description: "Mercury (Yogi) activation. Major financial gains and asset building.",
        status: "future",
        significance: "major"
    },
    {
        id: "9",
        year: "2046",
        age: "49",
        event: "Mercury Mahadasha - Peak Fortune",
        category: "career",
        dasha: "Mercury",
        antardasha: "Mer-Mer",
        description: "Peak intellectual and financial success. 17-year period of high gains.",
        status: "future",
        significance: "major"
    }
];

export default function LifeTimeline() {
    const [expandedEvent, setExpandedEvent] = useState<string | null>("4")

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case "education": return <GraduationCap className="w-5 h-5" />
            case "career": return <Briefcase className="w-5 h-5" />
            case "love": return <Heart className="w-5 h-5" />
            case "family": return <Baby className="w-5 h-5" />
            case "property": return <Home className="w-5 h-5" />
            case "spiritual": return <Sparkles className="w-5 h-5" />
            default: return <Star className="w-5 h-5" />
        }
    }

    const getCategoryColor = (category: string) => {
        switch (category) {
            case "education": return "blue"
            case "career": return "emerald"
            case "love": return "pink"
            case "family": return "purple"
            case "property": return "amber"
            case "spiritual": return "indigo"
            default: return "zinc"
        }
    }

    return (
        <div className="space-y-8 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 pb-24 md:pb-8">
            {/* Header */}
            <div className="text-center space-y-4 mb-12">
                <Badge variant="outline" className="bg-indigo-500/10 text-indigo-400 border-indigo-500/20 px-4 py-1">
                    The 120-Year Vimshottari Arc
                </Badge>
                <h2 className="text-4xl font-black text-white uppercase tracking-tighter sm:text-5xl">
                    Life <span className="text-indigo-500">Timeline</span>
                </h2>
                <p className="text-zinc-500 max-w-2xl mx-auto">
                    A comprehensive map of your karmic journey, from identity formation to peak wealth acquisition.
                </p>
            </div>

            <div className="relative">
                {/* Vertical Line */}
                <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-zinc-800" />

                <div className="space-y-12">
                    {LIFE_EVENTS.map((event, idx) => {
                        const isEven = idx % 2 === 0;
                        const color = getCategoryColor(event.category);
                        const isPresent = event.status === "present";
                        const isFuture = event.status === "future";

                        return (
                            <div key={event.id} className={`relative flex flex-col md:flex-row items-center ${isEven ? 'md:flex-row-reverse' : ''}`}>
                                {/* Timeline Dot */}
                                <div className={`absolute left-6 md:left-1/2 w-4 h-4 rounded-full border-2 transform -translate-x-1/2 z-10 transition-all duration-500 ${
                                    isPresent ? 'bg-indigo-500 border-white scale-125 shadow-[0_0_15px_rgba(99,102,241,0.8)]' : 
                                    isFuture ? 'bg-zinc-900 border-zinc-700' : 
                                    'bg-zinc-600 border-zinc-500'
                                }`} />

                                {/* Event Card */}
                                <div className={`w-full md:w-[45%] pl-14 md:pl-0 ${isEven ? 'md:pr-12' : 'md:pl-12'}`}>
                                    <motion.div
                                        whileHover={{ y: -5 }}
                                        onClick={() => setExpandedEvent(expandedEvent === event.id ? null : event.id)}
                                        className={`p-6 rounded-3xl border cursor-pointer transition-all ${
                                            isPresent ? 'bg-indigo-500/10 border-indigo-500/50 shadow-xl' : 
                                            'bg-zinc-900 border-zinc-800 hover:border-zinc-700'
                                        }`}
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <div className={`p-3 rounded-2xl bg-${color}-500/10 border border-${color}-500/20`}>
                                                {getCategoryIcon(event.category)}
                                            </div>
                                            <div className="text-right">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 block">Phase</span>
                                                <span className="text-sm font-bold text-zinc-100">{event.year}</span>
                                            </div>
                                        </div>

                                        <h4 className="text-xl font-bold text-white mb-1 group-hover:text-indigo-400 transition-colors">
                                            {event.event}
                                        </h4>
                                        <div className="flex items-center gap-2 mb-4">
                                            <Badge variant="outline" className="text-[10px] bg-zinc-800 border-zinc-700 text-zinc-400">
                                                Age {event.age}
                                            </Badge>
                                            <Badge variant="outline" className={`text-[10px] bg-${color}-500/10 text-${color}-400 border-${color}-500/20`}>
                                                {event.dasha} Period
                                            </Badge>
                                        </div>

                                        <AnimatePresence>
                                            {expandedEvent === event.id && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: "auto" }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    className="space-y-4 pt-4 border-t border-zinc-800"
                                                >
                                                    <p className="text-sm text-zinc-400 leading-relaxed italic">
                                                        "{event.description}"
                                                    </p>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="p-3 bg-zinc-800/50 rounded-xl border border-zinc-700">
                                                            <span className="text-[9px] text-zinc-500 uppercase block mb-1">Key Dasha</span>
                                                            <span className="text-xs font-bold text-zinc-200">{event.antardasha}</span>
                                                        </div>
                                                        <div className="p-3 bg-zinc-800/50 rounded-xl border border-zinc-700">
                                                            <span className="text-[9px] text-zinc-500 uppercase block mb-1">Significance</span>
                                                            <span className="text-xs font-bold text-zinc-200 uppercase">{event.significance}</span>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Footer Insights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                <Card className="bg-zinc-900 border-zinc-800">
                    <CardContent className="p-6 flex items-start gap-4">
                        <Zap className="w-5 h-5 text-yellow-400 shrink-0" />
                        <div>
                            <h5 className="text-sm font-bold text-zinc-100 mb-1">Current Pivot</h5>
                            <p className="text-xs text-zinc-500 leading-relaxed">Closing the Jupiter Mahadasha (2027). The transition to Saturn requires a shift from exploration to consolidation.</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-zinc-900 border-zinc-800">
                    <CardContent className="p-6 flex items-start gap-4">
                        <TrendingUp className="w-5 h-5 text-emerald-400 shrink-0" />
                        <div>
                            <h5 className="text-sm font-bold text-zinc-100 mb-1">Wealth window</h5>
                            <p className="text-xs text-zinc-500 leading-relaxed">2029-2032 marks the first major property/asset acquisition window under Saturn-Mercury.</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-zinc-900 border-zinc-800">
                    <CardContent className="p-6 flex items-start gap-4">
                        <Shield className="w-5 h-5 text-indigo-400 shrink-0" />
                        <div>
                            <h5 className="text-sm font-bold text-zinc-100 mb-1">Peak Status</h5>
                            <p className="text-xs text-zinc-500 leading-relaxed">Mercury Mahadasha (2046+) brings the highest level of social and financial authority in your life arc.</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
