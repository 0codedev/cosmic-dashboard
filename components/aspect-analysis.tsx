"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    Orbit,
    Star,
    ArrowRight,
    Info
} from "lucide-react"

interface Aspect {
    planet1: string
    symbol1: string
    planet2: string
    symbol2: string
    aspectType: string
    angle: number
    orb: number
    nature: "benefic" | "malefic" | "neutral"
    interpretation: string
    effects: string[]
    strength: number // 1-5
}

const CHART_ASPECTS: Aspect[] = [
    {
        planet1: "Sun",
        symbol1: "☉",
        planet2: "Moon",
        symbol2: "☽",
        aspectType: "Quincunx",
        angle: 150,
        orb: 4.2,
        nature: "neutral",
        interpretation: "Adjustment between self-expression and emotional needs",
        effects: [
            "Inner tension between ego and emotions",
            "Need for continuous self-adjustment",
            "Creative problem-solving abilities"
        ],
        strength: 3
    },
    {
        planet1: "Mars",
        symbol1: "♂",
        planet2: "Saturn",
        symbol2: "♄",
        aspectType: "Opposition",
        angle: 180,
        orb: 2.1,
        nature: "malefic",
        interpretation: "Tension between action and restriction",
        effects: [
            "Frustration with obstacles",
            "Hard work leads to delayed success",
            "Discipline over impulsiveness"
        ],
        strength: 5
    },
    {
        planet1: "Jupiter",
        symbol1: "♃",
        planet2: "Mercury",
        symbol2: "☿",
        aspectType: "Conjunction",
        angle: 0,
        orb: 1.5,
        nature: "benefic",
        interpretation: "Expansion of intellect and communication",
        effects: [
            "Wisdom in communication",
            "Teaching and writing abilities",
            "Broad-minded thinking"
        ],
        strength: 5
    },
    {
        planet1: "Venus",
        symbol1: "♀",
        planet2: "Mars",
        symbol2: "♂",
        aspectType: "Trine",
        angle: 120,
        orb: 3.2,
        nature: "benefic",
        interpretation: "Harmony between love and passion",
        effects: [
            "Attractive personality",
            "Creative expression",
            "Balanced assertiveness in relationships"
        ],
        strength: 4
    },
    {
        planet1: "Saturn",
        symbol1: "♄",
        planet2: "Rahu",
        symbol2: "☊",
        aspectType: "Square",
        angle: 90,
        orb: 5.0,
        nature: "malefic",
        interpretation: "Karmic challenges with ambition",
        effects: [
            "Obstacles in rapid progress",
            "Need for patience with goals",
            "Past life karma activation"
        ],
        strength: 4
    },
    {
        planet1: "Moon",
        symbol1: "☽",
        planet2: "Jupiter",
        symbol2: "♃",
        aspectType: "Sextile",
        angle: 60,
        orb: 2.8,
        nature: "benefic",
        interpretation: "Emotional wisdom and optimism",
        effects: [
            "Natural emotional intelligence",
            "Good fortune through intuition",
            "Nurturing and generous nature"
        ],
        strength: 4
    }
]

export default function AspectAnalysis() {
    const [selectedAspect, setSelectedAspect] = useState<string | null>("Jupiter-Mercury")

    const getNatureColor = (nature: string) => {
        switch (nature) {
            case "benefic": return "bg-green-500/20 text-green-400 border-green-500/30"
            case "malefic": return "bg-red-500/20 text-red-400 border-red-500/30"
            default: return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
        }
    }

    const getStrengthStars = (strength: number) => {
        return [...Array(5)].map((_, i) => (
            <Star
                key={i}
                className={`w-3 h-3 ${i < strength ? 'text-amber-400 fill-amber-400' : 'text-gray-600'}`}
            />
        ))
    }

    const getAspectKey = (aspect: Aspect) => `${aspect.planet1}-${aspect.planet2}`

    return (
        <div className="space-y-6">
            {/* Header */}
            <Card className="bg-gradient-to-br from-cyan-900/30 to-slate-900/50 border-cyan-500/30 p-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-cyan-500/20 rounded-full">
                        <Orbit className="w-6 h-6 text-cyan-400" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">Planetary Aspects</h2>
                        <p className="text-sm text-gray-400">Angular relationships between planets</p>
                    </div>
                </div>

                {/* Summary */}
                <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="p-2 bg-green-900/20 rounded-lg border border-green-500/20">
                        <div className="text-2xl font-bold text-green-400">
                            {CHART_ASPECTS.filter(a => a.nature === "benefic").length}
                        </div>
                        <div className="text-xs text-gray-400">Benefic</div>
                    </div>
                    <div className="p-2 bg-yellow-900/20 rounded-lg border border-yellow-500/20">
                        <div className="text-2xl font-bold text-yellow-400">
                            {CHART_ASPECTS.filter(a => a.nature === "neutral").length}
                        </div>
                        <div className="text-xs text-gray-400">Neutral</div>
                    </div>
                    <div className="p-2 bg-red-900/20 rounded-lg border border-red-500/20">
                        <div className="text-2xl font-bold text-red-400">
                            {CHART_ASPECTS.filter(a => a.nature === "malefic").length}
                        </div>
                        <div className="text-xs text-gray-400">Malefic</div>
                    </div>
                </div>
            </Card>

            {/* Aspects List */}
            <div className="grid md:grid-cols-2 gap-4">
                {CHART_ASPECTS.map((aspect, idx) => {
                    const key = getAspectKey(aspect)
                    const isSelected = selectedAspect === key

                    return (
                        <motion.div
                            key={key}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                        >
                            <Card
                                className={`p-4 cursor-pointer transition-all ${isSelected
                                    ? 'ring-2 ring-cyan-400 bg-cyan-900/20'
                                    : 'bg-slate-800/50 border-purple-500/20 hover:border-cyan-500/50'
                                    }`}
                                onClick={() => setSelectedAspect(isSelected ? null : key)}
                            >
                                {/* Aspect Header */}
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <span className="text-2xl">{aspect.symbol1}</span>
                                        <ArrowRight className="w-4 h-4 text-cyan-400" />
                                        <span className="text-2xl">{aspect.symbol2}</span>
                                    </div>
                                    <Badge className={getNatureColor(aspect.nature)}>
                                        {aspect.aspectType}
                                    </Badge>
                                </div>

                                {/* Planets */}
                                <div className="text-sm text-white mb-2">
                                    {aspect.planet1} - {aspect.planet2}
                                </div>

                                {/* Angle & Orb */}
                                <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
                                    <span>Angle: {aspect.angle}°</span>
                                    <span>Orb: {aspect.orb}°</span>
                                    <div className="flex">{getStrengthStars(aspect.strength)}</div>
                                </div>

                                {/* Interpretation */}
                                <p className="text-sm text-gray-400 mb-3">
                                    {aspect.interpretation}
                                </p>

                                {/* Effects (shown when selected) */}
                                <AnimatePresence>
                                    {isSelected && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            exit={{ opacity: 0, height: 0 }}
                                            transition={{ duration: 0.2, ease: "easeInOut" }}
                                            className="pt-3 border-t border-slate-700"
                                            style={{ overflow: "hidden" }}
                                        >
                                            <div className="text-xs text-cyan-400 mb-2">Effects:</div>
                                            <ul className="space-y-1">
                                                {aspect.effects.map((effect, i) => (
                                                    <li key={i} className="text-xs text-gray-300 flex items-start gap-1">
                                                        <Star className="w-3 h-3 text-cyan-400 mt-0.5 flex-shrink-0" />
                                                        {effect}
                                                    </li>
                                                ))}
                                            </ul>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </Card>
                        </motion.div>
                    )
                })}
            </div>

            {/* Info */}
            <Card className="bg-blue-900/20 border-blue-500/20 p-4">
                <div className="flex items-start gap-2">
                    <Info className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-gray-400">
                        Aspects show how planets interact in your chart. Benefic aspects (trine, sextile) create harmony,
                        while malefic aspects (square, opposition) create tension that drives growth.
                    </p>
                </div>
            </Card>
        </div>
    )
}
