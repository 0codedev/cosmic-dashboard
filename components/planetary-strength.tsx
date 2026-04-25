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
import { useAstrologyStore } from "@/stores/astrology-store"
import { calculateFullShadbala } from "@/lib/shadbala-engine"
import { useMemo } from "react"

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

// Dynamic logic moved inside component
const PLANET_STRENGTHS: PlanetStrength[] = []

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

    const { userData } = useAstrologyStore()

    // Dynamic Calculation of Strength
    const sortedPlanets = useMemo(() => {
        if (!userData || !userData.planetaryPositions) return []

        // Simplify inputs for shadbala engine
        const longitudes: Record<string, number> = {
            Sun: userData.planetaryPositions.sun.absoluteLongitude || 0,
            Moon: userData.planetaryPositions.moon.absoluteLongitude || 0,
            Mars: userData.planetaryPositions.mars.absoluteLongitude || 0,
            Mercury: userData.planetaryPositions.mercury.absoluteLongitude || 0,
            Jupiter: userData.planetaryPositions.jupiter.absoluteLongitude || 0,
            Venus: userData.planetaryPositions.venus.absoluteLongitude || 0,
            Saturn: userData.planetaryPositions.saturn.absoluteLongitude || 0,
            Rahu: userData.planetaryPositions.rahu.absoluteLongitude || 0,
            Ketu: userData.planetaryPositions.ketu.absoluteLongitude || 0
        }

        const isRetrograde: Record<string, boolean> = {
            Mars: userData.planetaryPositions.mars.retrograde || false,
            Mercury: userData.planetaryPositions.mercury.retrograde || false,
            Jupiter: userData.planetaryPositions.jupiter.retrograde || false,
            Venus: userData.planetaryPositions.venus.retrograde || false,
            Saturn: userData.planetaryPositions.saturn.retrograde || false,
            Rahu: true,
            Ketu: true,
            Sun: false, Moon: false
        }

        // Calculate Shadbala
        const shadbalaResults = calculateFullShadbala(
            longitudes,
            isRetrograde,
            userData.lagnaLongitude || 0,
            true, // Defaulting to Day Birth for now - TODO: Calculate from TOB
            10 // Defaulting Moon phase
        )

        // Map to display format
        return Object.entries(longitudes).map(([planet, lon]) => {
            const data = (userData.planetaryPositions as any)[planet.toLowerCase()]
            const strengthData = shadbalaResults[planet] || { total: 1.0, strengthPercent: 50 }; // Fallback

            // Determine status (basic rule based)
            let status: "exalted" | "own" | "friend" | "neutral" | "enemy" | "debilitated" = "neutral"
            const sign = data.sign

            // Allow override logic or simplified lookup
            if (planet === "Sun" && sign === "Aries") status = "exalted"
            else if (planet === "Sun" && sign === "Libra") status = "debilitated"
            else if (planet === "Moon" && sign === "Taurus") status = "exalted"
            else if (planet === "Moon" && sign === "Scorpio") status = "debilitated"
            else if (planet === "Mars" && sign === "Capricorn") status = "exalted"
            else if (planet === "Mars" && sign === "Cancer") status = "debilitated"
            else if (planet === "Mercury" && sign === "Virgo") status = "exalted"
            else if (planet === "Mercury" && sign === "Pisces") status = "debilitated"
            else if (planet === "Jupiter" && sign === "Cancer") status = "exalted"
            else if (planet === "Jupiter" && sign === "Capricorn") status = "debilitated"
            else if (planet === "Venus" && sign === "Pisces") status = "exalted"
            else if (planet === "Venus" && sign === "Virgo") status = "debilitated"
            else if (planet === "Saturn" && sign === "Libra") status = "exalted"
            else if (planet === "Saturn" && sign === "Aries") status = "debilitated"

            const degreeVal = parseFloat(data.degree.split('°')[0])

            return {
                planet,
                symbol: getPlanetSymbol(planet),
                sign: data.sign,
                degree: degreeVal,
                status,
                strength: strengthData.strengthPercent,
                shadbala: strengthData.total,
                dignityPoints: Math.round(strengthData.total * 1.5), // Approximation
                retrograde: isRetrograde[planet],
                combusted: false, // simplified
                aspects: [] // simplified
            } as PlanetStrength;
        }).sort((a, b) => b.strength - a.strength)

    }, [userData])

    function getPlanetSymbol(p: string) {
        const map: any = { Sun: "☉", Moon: "☽", Mars: "♂", Mercury: "☿", Jupiter: "♃", Venus: "♀", Saturn: "♄", Rahu: "☊", Ketu: "☋" }
        return map[p] || "?"
    }

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
