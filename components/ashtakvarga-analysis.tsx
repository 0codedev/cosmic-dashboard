"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    BarChart3,
    Info,
    TrendingUp,
    TrendingDown
} from "lucide-react"

interface PlanetBindu {
    planet: string
    symbol: string
    sign: string
    house: number
    bindus: number // Out of 8
    strength: "weak" | "average" | "strong" | "excellent"
}

interface HouseBindu {
    house: number
    sign: string
    totalBindus: number // Out of 56 (8 planets x 7 max each)
    strength: "weak" | "average" | "strong" | "excellent"
    significations: string[]
}

// Sudhanshu's Ashtakvarga Data (based on Aquarius Lagna)
const PLANET_ASHTAKVARGA: PlanetBindu[] = [
    { planet: "Sun", symbol: "☉", sign: "Virgo", house: 8, bindus: 4, strength: "average" },
    { planet: "Moon", symbol: "☽", sign: "Aquarius", house: 1, bindus: 5, strength: "strong" },
    { planet: "Mars", symbol: "♂", sign: "Aries", house: 3, bindus: 5, strength: "strong" },
    { planet: "Mercury", symbol: "☿", sign: "Libra", house: 9, bindus: 6, strength: "excellent" },
    { planet: "Jupiter", symbol: "♃", sign: "Libra", house: 9, bindus: 6, strength: "excellent" },
    { planet: "Venus", symbol: "♀", sign: "Scorpio", house: 10, bindus: 5, strength: "strong" },
    { planet: "Saturn", symbol: "♄", sign: "Cancer", house: 6, bindus: 4, strength: "average" },
]

const HOUSE_ASHTAKVARGA: HouseBindu[] = [
    { house: 1, sign: "Aquarius", totalBindus: 32, strength: "strong", significations: ["Self", "Personality", "Health"] },
    { house: 2, sign: "Pisces", totalBindus: 26, strength: "average", significations: ["Wealth", "Family", "Speech"] },
    { house: 3, sign: "Aries", totalBindus: 34, strength: "excellent", significations: ["Courage", "Siblings", "Short Travel"] },
    { house: 4, sign: "Taurus", totalBindus: 28, strength: "average", significations: ["Mother", "Home", "Comfort"] },
    { house: 5, sign: "Gemini", totalBindus: 25, strength: "average", significations: ["Children", "Creativity", "Romance"] },
    { house: 6, sign: "Cancer", totalBindus: 30, strength: "strong", significations: ["Service", "Health", "Enemies"] },
    { house: 7, sign: "Leo", totalBindus: 24, strength: "weak", significations: ["Marriage", "Partnership", "Business"] },
    { house: 8, sign: "Virgo", totalBindus: 22, strength: "weak", significations: ["Transformation", "Longevity", "Occult"] },
    { house: 9, sign: "Libra", totalBindus: 38, strength: "excellent", significations: ["Fortune", "Father", "Higher Learning"] },
    { house: 10, sign: "Scorpio", totalBindus: 33, strength: "strong", significations: ["Career", "Status", "Authority"] },
    { house: 11, sign: "Sagittarius", totalBindus: 35, strength: "excellent", significations: ["Gains", "Friends", "Desires"] },
    { house: 12, sign: "Capricorn", totalBindus: 27, strength: "average", significations: ["Loss", "Spirituality", "Foreign"] },
]

// Sarvashtakvarga total
const TOTAL_BINDUS = HOUSE_ASHTAKVARGA.reduce((sum, h) => sum + h.totalBindus, 0)

export default function AshtakvargaAnalysis() {
    const [selectedHouse, setSelectedHouse] = useState<number | null>(null)
    const [viewMode, setViewMode] = useState<"houses" | "planets">("houses")

    const getStrengthColor = (strength: string) => {
        switch (strength) {
            case "excellent": return "text-green-400 bg-green-500/20"
            case "strong": return "text-cyan-400 bg-cyan-500/20"
            case "average": return "text-yellow-400 bg-yellow-500/20"
            case "weak": return "text-red-400 bg-red-500/20"
            default: return "text-gray-400 bg-gray-500/20"
        }
    }

    const getBinduBarColor = (bindus: number, max: number) => {
        const percentage = (bindus / max) * 100
        if (percentage >= 75) return "bg-green-500"
        if (percentage >= 50) return "bg-cyan-500"
        if (percentage >= 35) return "bg-yellow-500"
        return "bg-red-500"
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <Card className="bg-gradient-to-br from-slate-900/50 to-indigo-900/30 border-indigo-500/30 p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-indigo-500/20 rounded-full">
                            <BarChart3 className="w-6 h-6 text-indigo-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">Ashtakvarga Analysis</h2>
                            <p className="text-sm text-gray-400">Planetary strength through bindus</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-2xl font-bold text-indigo-400">{TOTAL_BINDUS}</div>
                        <div className="text-xs text-gray-400">Sarvashtakvarga Score</div>
                    </div>
                </div>

                {/* View Toggle */}
                <div className="flex gap-2">
                    <button
                        onClick={() => setViewMode("houses")}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${viewMode === "houses"
                            ? "bg-indigo-500 text-white"
                            : "bg-slate-700 text-gray-300 hover:bg-slate-600"
                            }`}
                    >
                        House View
                    </button>
                    <button
                        onClick={() => setViewMode("planets")}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${viewMode === "planets"
                            ? "bg-indigo-500 text-white"
                            : "bg-slate-700 text-gray-300 hover:bg-slate-600"
                            }`}
                    >
                        Planet View
                    </button>
                </div>
            </Card>

            {/* House Ashtakvarga */}
            {viewMode === "houses" && (
                <Card className="bg-slate-800/50 border-indigo-500/20 p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Bhinna Ashtakvarga (House-wise Strength)</h3>

                    {/* Visual Bar Chart */}
                    <div className="space-y-3 mb-6">
                        {HOUSE_ASHTAKVARGA.map((house) => (
                            <motion.div
                                layout
                                key={house.house}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="cursor-pointer hover:bg-slate-700/30 p-2 rounded-lg transition-colors"
                                onClick={() => setSelectedHouse(selectedHouse === house.house ? null : house.house)}
                            >
                                <motion.div layout="position" className="flex items-center justify-between mb-1">
                                    <div className="flex items-center gap-2">
                                        <span className="w-8 h-8 flex items-center justify-center bg-indigo-500/20 rounded text-indigo-400 font-bold text-sm">
                                            {house.house}
                                        </span>
                                        <span className="text-gray-300 text-sm">{house.sign}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-white font-semibold">{house.totalBindus}</span>
                                        <Badge className={getStrengthColor(house.strength)}>
                                            {house.strength}
                                        </Badge>
                                    </div>
                                </motion.div>

                                {/* Progress Bar */}
                                <motion.div layout="position" className="w-full bg-slate-700 rounded-full h-2">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(house.totalBindus / 56) * 100}%` }}
                                        transition={{ duration: 0.8 }}
                                        className={`h-2 rounded-full ${getBinduBarColor(house.totalBindus, 56)}`}
                                    />
                                </motion.div>

                                {/* Expanded Details */}
                                {selectedHouse === house.house && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.3, ease: "easeInOut" }}
                                        style={{ overflow: "hidden" }}
                                        className="mt-3 bg-slate-900/50 rounded-lg"
                                    >
                                        <div className="p-3">
                                            <div className="flex flex-wrap gap-2 mb-2">
                                                {house.significations.map((sig) => (
                                                    <Badge key={sig} className="bg-purple-500/20 text-purple-300">
                                                        {sig}
                                                    </Badge>
                                                ))}
                                            </div>
                                            <p className="text-sm text-gray-400">
                                                {house.totalBindus >= 28 ? (
                                                    <span className="flex items-center gap-1 text-green-400">
                                                        <TrendingUp className="w-4 h-4" />
                                                        Strong area - favorable results for {house.significations[0].toLowerCase()}
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center gap-1 text-amber-400">
                                                        <TrendingDown className="w-4 h-4" />
                                                        Needs attention - remedies may help for {house.significations[0].toLowerCase()}
                                                    </span>
                                                )}
                                            </p>
                                        </div>
                                    </motion.div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </Card>
            )}

            {/* Planet Ashtakvarga */}
            {viewMode === "planets" && (
                <Card className="bg-slate-800/50 border-indigo-500/20 p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Planet-wise Bindu Distribution</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {PLANET_ASHTAKVARGA.map((planet, idx) => (
                            <motion.div
                                key={planet.planet}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                            >
                                <Card className="bg-slate-900/50 border-purple-500/20 p-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <span className="text-2xl">{planet.symbol}</span>
                                            <div>
                                                <h4 className="font-semibold text-white">{planet.planet}</h4>
                                                <p className="text-xs text-gray-400">{planet.sign} • House {planet.house}</p>
                                            </div>
                                        </div>
                                        <Badge className={getStrengthColor(planet.strength)}>
                                            {planet.bindus}/8
                                        </Badge>
                                    </div>

                                    {/* Bindu Dots */}
                                    <div className="flex gap-1">
                                        {[...Array(8)].map((_, i) => (
                                            <div
                                                key={i}
                                                className={`w-3 h-3 rounded-full ${i < planet.bindus
                                                    ? getBinduBarColor(planet.bindus, 8).replace('bg-', 'bg-')
                                                    : 'bg-slate-700'
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </Card>
            )}

            {/* Interpretation */}
            <Card className="bg-gradient-to-br from-green-900/20 to-slate-900/50 border-green-500/20 p-6">
                <div className="flex items-center gap-2 mb-4">
                    <Info className="w-5 h-5 text-green-400" />
                    <h3 className="text-lg font-semibold text-green-400">Key Insights</h3>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <h4 className="text-sm font-medium text-cyan-400 mb-2">Strongest Areas</h4>
                        <ul className="space-y-1 text-sm text-gray-300">
                            <li>• <span className="text-green-400">9th House (38)</span> - Fortune, Higher Learning, Father</li>
                            <li>• <span className="text-green-400">11th House (35)</span> - Gains, Friends, Desires</li>
                            <li>• <span className="text-green-400">3rd House (34)</span> - Courage, Siblings, Communication</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-sm font-medium text-amber-400 mb-2">Areas Needing Support</h4>
                        <ul className="space-y-1 text-sm text-gray-300">
                            <li>• <span className="text-amber-400">8th House (22)</span> - Transformation, Longevity</li>
                            <li>• <span className="text-amber-400">7th House (24)</span> - Marriage, Partnerships</li>
                            <li>• <span className="text-amber-400">5th House (25)</span> - Children, Creativity</li>
                        </ul>
                    </div>
                </div>

                <div className="mt-4 p-3 bg-indigo-900/20 border border-indigo-500/30 rounded-lg">
                    <p className="text-sm text-gray-300">
                        <span className="font-medium text-indigo-400">Overall Assessment:</span> With a Sarvashtakvarga score of {TOTAL_BINDUS} (average: 337),
                        the chart shows strong potential in areas of fortune (9th), gains (11th), and career (10th).
                        Focus remedies on strengthening the 7th and 8th houses for relationship and longevity matters.
                    </p>
                </div>
            </Card>
        </div>
    )
}
