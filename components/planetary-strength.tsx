"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
    Gauge,
    TrendingUp,
    TrendingDown,
    Minus,
    Info
} from "lucide-react"

interface PlanetStrength {
    planet: string
    symbol: string
    sign: string
    degree: number
    status: "exalted" | "own" | "friend" | "neutral" | "enemy" | "debilitated"
    strength: number // 0-100
    shadbala: number
    dignityPoints: number
    retrograde: boolean
    combusted: boolean
    aspects: string[]
}

const PLANET_STRENGTHS: PlanetStrength[] = [
    {
        planet: "Sun",
        symbol: "☉",
        sign: "Virgo",
        degree: 14.5,
        status: "friend",
        strength: 65,
        shadbala: 1.2,
        dignityPoints: 8,
        retrograde: false,
        combusted: false,
        aspects: ["Saturn aspects", "Jupiter trines"]
    },
    {
        planet: "Moon",
        symbol: "☽",
        sign: "Aquarius",
        degree: 22.3,
        status: "neutral",
        strength: 72,
        shadbala: 1.4,
        dignityPoints: 6,
        retrograde: false,
        combusted: false,
        aspects: ["Mars sextiles"]
    },
    {
        planet: "Mars",
        symbol: "♂",
        sign: "Aries",
        degree: 8.7,
        status: "own",
        strength: 92,
        shadbala: 1.8,
        dignityPoints: 12,
        retrograde: false,
        combusted: false,
        aspects: ["Jupiter aspects"]
    },
    {
        planet: "Mercury",
        symbol: "☿",
        sign: "Libra",
        degree: 5.2,
        status: "friend",
        strength: 68,
        shadbala: 1.3,
        dignityPoints: 7,
        retrograde: false,
        combusted: false,
        aspects: ["Venus conjuncts"]
    },
    {
        planet: "Jupiter",
        symbol: "♃",
        sign: "Libra",
        degree: 18.4,
        status: "neutral",
        strength: 58,
        shadbala: 1.1,
        dignityPoints: 5,
        retrograde: false,
        combusted: false,
        aspects: ["Mercury conjuncts"]
    },
    {
        planet: "Venus",
        symbol: "♀",
        sign: "Scorpio",
        degree: 12.8,
        status: "enemy",
        strength: 42,
        shadbala: 0.9,
        dignityPoints: 3,
        retrograde: false,
        combusted: false,
        aspects: ["Mars rules sign"]
    },
    {
        planet: "Saturn",
        symbol: "♄",
        sign: "Cancer",
        degree: 28.1,
        status: "debilitated",
        strength: 35,
        shadbala: 0.7,
        dignityPoints: 2,
        retrograde: true,
        combusted: false,
        aspects: ["Moon aspects", "Neecha Bhanga"]
    },
    {
        planet: "Rahu",
        symbol: "☊",
        sign: "Pisces",
        degree: 15.6,
        status: "neutral",
        strength: 55,
        shadbala: 1.0,
        dignityPoints: 5,
        retrograde: true,
        combusted: false,
        aspects: ["Jupiter disposits"]
    },
    {
        planet: "Ketu",
        symbol: "☋",
        sign: "Virgo",
        degree: 15.6,
        status: "neutral",
        strength: 48,
        shadbala: 0.95,
        dignityPoints: 4,
        retrograde: true,
        combusted: false,
        aspects: ["Mercury disposits"]
    }
]

export default function PlanetaryStrength() {
    const getStatusColor = (status: string) => {
        switch (status) {
            case "exalted": return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
            case "own": return "bg-green-500/20 text-green-400 border-green-500/30"
            case "friend": return "bg-cyan-500/20 text-cyan-400 border-cyan-500/30"
            case "neutral": return "bg-gray-500/20 text-gray-400 border-gray-500/30"
            case "enemy": return "bg-orange-500/20 text-orange-400 border-orange-500/30"
            case "debilitated": return "bg-red-500/20 text-red-400 border-red-500/30"
            default: return ""
        }
    }

    const getStrengthColor = (strength: number) => {
        if (strength >= 75) return "text-green-400"
        if (strength >= 50) return "text-cyan-400"
        if (strength >= 30) return "text-yellow-400"
        return "text-red-400"
    }

    const getStrengthIcon = (strength: number) => {
        if (strength >= 60) return <TrendingUp className="w-4 h-4 text-green-400" />
        if (strength >= 40) return <Minus className="w-4 h-4 text-yellow-400" />
        return <TrendingDown className="w-4 h-4 text-red-400" />
    }

    const sortedPlanets = [...PLANET_STRENGTHS].sort((a, b) => b.strength - a.strength)

    return (
        <div className="space-y-6">
            {/* Header */}
            <Card className="bg-gradient-to-br from-slate-900/50 to-emerald-900/30 border-emerald-500/30 p-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-emerald-500/20 rounded-full">
                        <Gauge className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">Planetary Strength Analysis</h2>
                        <p className="text-sm text-gray-400">Shadbala and dignity assessment</p>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="p-3 bg-slate-800/50 rounded-lg">
                        <div className="text-2xl font-bold text-green-400">
                            {sortedPlanets.filter(p => p.strength >= 60).length}
                        </div>
                        <div className="text-xs text-gray-400">Strong Planets</div>
                    </div>
                    <div className="p-3 bg-slate-800/50 rounded-lg">
                        <div className="text-2xl font-bold text-yellow-400">
                            {sortedPlanets.filter(p => p.strength >= 40 && p.strength < 60).length}
                        </div>
                        <div className="text-xs text-gray-400">Average</div>
                    </div>
                    <div className="p-3 bg-slate-800/50 rounded-lg">
                        <div className="text-2xl font-bold text-red-400">
                            {sortedPlanets.filter(p => p.strength < 40).length}
                        </div>
                        <div className="text-xs text-gray-400">Weak</div>
                    </div>
                </div>
            </Card>

            {/* Strength Bars */}
            <Card className="bg-slate-800/50 border-purple-500/20 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Strength Overview</h3>

                <div className="space-y-4">
                    {sortedPlanets.map((planet, idx) => (
                        <motion.div
                            key={planet.planet}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="space-y-2"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="text-xl">{planet.symbol}</span>
                                    <span className="font-medium text-white">{planet.planet}</span>
                                    <Badge className={getStatusColor(planet.status)}>
                                        {planet.status}
                                    </Badge>
                                    {planet.retrograde && (
                                        <Badge className="bg-purple-500/20 text-purple-400">R</Badge>
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    {getStrengthIcon(planet.strength)}
                                    <span className={`font-bold ${getStrengthColor(planet.strength)}`}>
                                        {planet.strength}%
                                    </span>
                                </div>
                            </div>

                            <div className="relative">
                                <Progress value={planet.strength} className="h-2" />
                                <div
                                    className="absolute top-0 h-2 w-0.5 bg-white/50"
                                    style={{ left: '50%' }}
                                />
                            </div>

                            <div className="flex justify-between text-xs text-gray-500">
                                <span>{planet.sign} {planet.degree.toFixed(1)}°</span>
                                <span>Shadbala: {planet.shadbala.toFixed(2)}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </Card>

            {/* Detailed Cards */}
            <div className="grid md:grid-cols-3 gap-4">
                {PLANET_STRENGTHS.slice(0, 6).map((planet, idx) => (
                    <motion.div
                        key={planet.planet}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                    >
                        <Card className={`p-4 ${planet.strength >= 60
                                ? 'bg-green-900/10 border-green-500/20'
                                : planet.strength >= 40
                                    ? 'bg-slate-800/50 border-purple-500/20'
                                    : 'bg-red-900/10 border-red-500/20'
                            }`}>
                            <div className="flex items-center gap-2 mb-3">
                                <span className="text-2xl">{planet.symbol}</span>
                                <div>
                                    <h4 className="font-semibold text-white">{planet.planet}</h4>
                                    <p className="text-xs text-gray-400">{planet.sign}</p>
                                </div>
                            </div>

                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Status:</span>
                                    <Badge className={getStatusColor(planet.status)}>{planet.status}</Badge>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Strength:</span>
                                    <span className={getStrengthColor(planet.strength)}>{planet.strength}%</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Dignity Points:</span>
                                    <span className="text-white">{planet.dignityPoints}</span>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Info Card */}
            <Card className="bg-gradient-to-br from-blue-900/20 to-slate-900/50 border-blue-500/20 p-4">
                <div className="flex items-center gap-2 mb-2">
                    <Info className="w-5 h-5 text-blue-400" />
                    <h4 className="text-sm font-medium text-blue-400">Understanding Planetary Strength</h4>
                </div>
                <p className="text-xs text-gray-400">
                    Planetary strength is calculated using Shadbala (six-fold strength) which includes positional,
                    directional, temporal, motional, natural, and aspectual strengths. A planet needs 1.0 Shadbala
                    to be considered adequately strong to deliver its results effectively.
                </p>
            </Card>
        </div>
    )
}
