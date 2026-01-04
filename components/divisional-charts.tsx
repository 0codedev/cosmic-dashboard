"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    Layers,
    Heart,
    Briefcase,
    Home,
    Star,
    Info
} from "lucide-react"

interface DivisionalChart {
    id: string
    name: string
    sanskritName: string
    division: number
    purpose: string
    icon: React.ReactNode
    color: string
    houses: { house: number; sign: string; planets: string[] }[]
    keyInsights: string[]
    predictions: string[]
}

// Sudhanshu's divisional chart data (calculated from D1)
const DIVISIONAL_CHARTS: DivisionalChart[] = [
    {
        id: "d9",
        name: "Navamsa (D9)",
        sanskritName: "नवांश",
        division: 9,
        purpose: "Marriage, Spouse & Dharma",
        icon: <Heart className="w-5 h-5" />,
        color: "pink",
        houses: [
            { house: 1, sign: "Sagittarius", planets: ["Jupiter"] },
            { house: 2, sign: "Capricorn", planets: [] },
            { house: 3, sign: "Aquarius", planets: [] },
            { house: 4, sign: "Pisces", planets: ["Ketu"] },
            { house: 5, sign: "Aries", planets: [] },
            { house: 6, sign: "Taurus", planets: [] },
            { house: 7, sign: "Gemini", planets: ["Moon"] },
            { house: 8, sign: "Cancer", planets: ["Sun", "Mercury"] },
            { house: 9, sign: "Leo", planets: ["Venus"] },
            { house: 10, sign: "Virgo", planets: ["Rahu"] },
            { house: 11, sign: "Libra", planets: ["Mars"] },
            { house: 12, sign: "Scorpio", planets: ["Saturn"] },
        ],
        keyInsights: [
            "Jupiter in Lagna indicates wisdom and dharmic nature in marriage",
            "Venus in 9th house (Leo) suggests love for luxury and creativity in relationships",
            "Moon in 7th indicates emotional and nurturing partner",
            "Saturn in 12th may indicate late marriage or karmic lessons",
        ],
        predictions: [
            "Partner will be intelligent and communicative (Moon in Gemini)",
            "Marriage brings spiritual growth (Jupiter in Sagittarius Lagna)",
            "May face challenges initially but stability comes with maturity",
            "Partner supports career and social standing",
        ]
    },
    {
        id: "d10",
        name: "Dasamsa (D10)",
        sanskritName: "दशांश",
        division: 10,
        purpose: "Career & Professional Life",
        icon: <Briefcase className="w-5 h-5" />,
        color: "blue",
        houses: [
            { house: 1, sign: "Libra", planets: [] },
            { house: 2, sign: "Scorpio", planets: ["Saturn"] },
            { house: 3, sign: "Sagittarius", planets: [] },
            { house: 4, sign: "Capricorn", planets: [] },
            { house: 5, sign: "Aquarius", planets: ["Moon"] },
            { house: 6, sign: "Pisces", planets: [] },
            { house: 7, sign: "Aries", planets: ["Mars"] },
            { house: 8, sign: "Taurus", planets: [] },
            { house: 9, sign: "Gemini", planets: ["Jupiter", "Mercury"] },
            { house: 10, sign: "Cancer", planets: ["Sun"] },
            { house: 11, sign: "Leo", planets: ["Venus", "Rahu"] },
            { house: 12, sign: "Virgo", planets: ["Ketu"] },
        ],
        keyInsights: [
            "Sun in 10th (Cancer) indicates leadership in nurturing fields",
            "Jupiter-Mercury in 9th suggests success in teaching, writing, consulting",
            "Venus-Rahu in 11th indicates gains through network and foreign connections",
            "Mars in 7th shows competitive business partnerships",
        ],
        predictions: [
            "Career growth through knowledge and communication fields",
            "Leadership positions in educational or healing sectors",
            "Multiple income sources from 11th house strength",
            "May work in foreign countries or with international clients",
            "Recognition for expertise and wisdom",
        ]
    },
    {
        id: "d4",
        name: "Chaturthamsa (D4)",
        sanskritName: "चतुर्थांश",
        division: 4,
        purpose: "Property, Fortune & Fixed Assets",
        icon: <Home className="w-5 h-5" />,
        color: "green",
        houses: [
            { house: 1, sign: "Gemini", planets: [] },
            { house: 2, sign: "Cancer", planets: ["Saturn"] },
            { house: 3, sign: "Leo", planets: [] },
            { house: 4, sign: "Virgo", planets: ["Sun", "Mercury"] },
            { house: 5, sign: "Libra", planets: ["Jupiter"] },
            { house: 6, sign: "Scorpio", planets: ["Venus"] },
            { house: 7, sign: "Sagittarius", planets: [] },
            { house: 8, sign: "Capricorn", planets: [] },
            { house: 9, sign: "Aquarius", planets: ["Moon"] },
            { house: 10, sign: "Pisces", planets: ["Ketu"] },
            { house: 11, sign: "Aries", planets: ["Mars", "Rahu"] },
            { house: 12, sign: "Taurus", planets: [] },
        ],
        keyInsights: [
            "Sun-Mercury in 4th indicates ancestral property and comfortable home",
            "Jupiter in 5th suggests fortune through children and creativity",
            "Mars-Rahu in 11th may bring property through unexpected means",
            "Moon in 9th indicates property in foreign lands possible",
        ],
        predictions: [
            "Will own multiple properties in lifetime",
            "Ancestral property benefits likely",
            "Good luck in real estate investments",
            "Vehicles and luxury items through own earnings",
            "Property gains during Jupiter and Mercury periods",
        ]
    }
]

export default function DivisionalCharts() {
    const [selectedChart, setSelectedChart] = useState<string>("d9")

    const currentChart = DIVISIONAL_CHARTS.find(c => c.id === selectedChart)

    const getColorClasses = (color: string) => ({
        bg: `bg-${color}-500/20`,
        text: `text-${color}-400`,
        border: `border-${color}-500/30`,
        gradient: `from-${color}-900/30 to-slate-900/50`,
    })

    return (
        <div className="space-y-6">
            {/* Header */}
            <Card className="bg-gradient-to-br from-slate-900/50 to-purple-900/30 border-purple-500/30 p-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-purple-500/20 rounded-full">
                        <Layers className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">Divisional Charts (Varga)</h2>
                        <p className="text-sm text-gray-400">Detailed analysis of specific life areas</p>
                    </div>
                </div>

                <p className="text-sm text-gray-400">
                    Divisional charts divide each sign into smaller portions for deeper analysis.
                    They reveal hidden patterns and specific predictions for different life areas.
                </p>
            </Card>

            {/* Chart Selection */}
            <div className="grid md:grid-cols-3 gap-4">
                {DIVISIONAL_CHARTS.map((chart) => {
                    const colors = getColorClasses(chart.color)
                    return (
                        <motion.div
                            key={chart.id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Card
                                className={`p-4 cursor-pointer transition-all ${selectedChart === chart.id
                                        ? `bg-gradient-to-br ${colors.gradient} ${colors.border} ring-2 ring-${chart.color}-400`
                                        : 'bg-slate-800/50 border-purple-500/20 hover:border-purple-500/50'
                                    }`}
                                onClick={() => setSelectedChart(chart.id)}
                            >
                                <div className="flex items-center gap-3 mb-2">
                                    <div className={`p-2 rounded-lg ${colors.bg} ${colors.text}`}>
                                        {chart.icon}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-white">{chart.name}</h3>
                                        <p className="text-xs text-gray-500">{chart.sanskritName}</p>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-400">{chart.purpose}</p>
                                <Badge className={`mt-2 ${colors.bg} ${colors.text}`}>
                                    D{chart.division} Division
                                </Badge>
                            </Card>
                        </motion.div>
                    )
                })}
            </div>

            {/* Chart Details */}
            {currentChart && (
                <motion.div
                    key={currentChart.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                >
                    {/* House Grid */}
                    <Card className="bg-slate-800/50 border-purple-500/20 p-6">
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <Star className="w-5 h-5 text-amber-400" />
                            {currentChart.name} Planetary Positions
                        </h3>

                        <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                            {currentChart.houses.map((house) => (
                                <div
                                    key={house.house}
                                    className={`p-3 rounded-lg border ${house.planets.length > 0
                                            ? 'bg-purple-900/20 border-purple-500/30'
                                            : 'bg-slate-900/30 border-slate-700'
                                        }`}
                                >
                                    <div className="flex justify-between items-center mb-1">
                                        <Badge className="bg-slate-700 text-gray-300 text-xs">H{house.house}</Badge>
                                        <span className="text-xs text-cyan-400">{house.sign}</span>
                                    </div>
                                    {house.planets.length > 0 ? (
                                        <div className="flex flex-wrap gap-1">
                                            {house.planets.map(planet => (
                                                <Badge key={planet} className="bg-amber-500/20 text-amber-300 text-xs">
                                                    {planet}
                                                </Badge>
                                            ))}
                                        </div>
                                    ) : (
                                        <span className="text-xs text-gray-600">Empty</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* Key Insights */}
                    <Card className="bg-slate-800/50 border-purple-500/20 p-6">
                        <h3 className="text-lg font-semibold text-purple-400 mb-4 flex items-center gap-2">
                            <Info className="w-5 h-5" />
                            Key Insights
                        </h3>
                        <ul className="space-y-2">
                            {currentChart.keyInsights.map((insight, idx) => (
                                <motion.li
                                    key={idx}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="flex items-start gap-2 text-sm text-gray-300"
                                >
                                    <span className="text-purple-400 mt-1">•</span>
                                    {insight}
                                </motion.li>
                            ))}
                        </ul>
                    </Card>

                    {/* Predictions */}
                    <Card className={`bg-gradient-to-br from-${currentChart.color}-900/20 to-slate-900/50 border-${currentChart.color}-500/20 p-6`}>
                        <h3 className={`text-lg font-semibold text-${currentChart.color}-400 mb-4`}>
                            Predictions for {currentChart.purpose}
                        </h3>
                        <div className="grid md:grid-cols-2 gap-3">
                            {currentChart.predictions.map((prediction, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="flex items-start gap-2 p-3 bg-slate-800/50 rounded-lg"
                                >
                                    <span className={`text-${currentChart.color}-400`}>✦</span>
                                    <span className="text-sm text-gray-300">{prediction}</span>
                                </motion.div>
                            ))}
                        </div>
                    </Card>
                </motion.div>
            )}
        </div>
    )
}
