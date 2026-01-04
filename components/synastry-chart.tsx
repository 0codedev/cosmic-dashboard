"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Heart,
    Users,
    ArrowLeftRight,
    CheckCircle2,
    AlertTriangle,
    Star,
    Sparkles
} from "lucide-react"

interface PlanetPosition {
    planet: string
    symbol: string
    sign: string
    degree: number
    house: number
}

interface SynastryAspect {
    planet1: string
    planet2: string
    aspectType: string
    orb: number
    nature: "harmonious" | "challenging" | "neutral"
    interpretation: string
}

// Person 1: Sudhanshu's chart data
const PERSON1_PLANETS: PlanetPosition[] = [
    { planet: "Sun", symbol: "☉", sign: "Virgo", degree: 14.5, house: 8 },
    { planet: "Moon", symbol: "☽", sign: "Aquarius", degree: 22.3, house: 1 },
    { planet: "Mars", symbol: "♂", sign: "Aries", degree: 8.7, house: 3 },
    { planet: "Mercury", symbol: "☿", sign: "Libra", degree: 5.2, house: 9 },
    { planet: "Jupiter", symbol: "♃", sign: "Libra", degree: 18.4, house: 9 },
    { planet: "Venus", symbol: "♀", sign: "Scorpio", degree: 12.8, house: 10 },
    { planet: "Saturn", symbol: "♄", sign: "Cancer", degree: 28.1, house: 6 },
]

// Sample partner chart (for demo)
const PERSON2_PLANETS: PlanetPosition[] = [
    { planet: "Sun", symbol: "☉", sign: "Pisces", degree: 8.3, house: 12 },
    { planet: "Moon", symbol: "☽", sign: "Cancer", degree: 15.7, house: 4 },
    { planet: "Mars", symbol: "♂", sign: "Leo", degree: 22.4, house: 5 },
    { planet: "Mercury", symbol: "☿", sign: "Aquarius", degree: 28.9, house: 11 },
    { planet: "Jupiter", symbol: "♃", sign: "Taurus", degree: 5.6, house: 2 },
    { planet: "Venus", symbol: "♀", sign: "Aries", degree: 18.2, house: 1 },
    { planet: "Saturn", symbol: "♄", sign: "Aquarius", degree: 10.3, house: 11 },
]

// Calculate aspects between charts
function calculateSynastryAspects(person1: PlanetPosition[], person2: PlanetPosition[]): SynastryAspect[] {
    const aspects: SynastryAspect[] = []
    const signDegrees: { [key: string]: number } = {
        "Aries": 0, "Taurus": 30, "Gemini": 60, "Cancer": 90, "Leo": 120, "Virgo": 150,
        "Libra": 180, "Scorpio": 210, "Sagittarius": 240, "Capricorn": 270, "Aquarius": 300, "Pisces": 330
    }

    const aspectTypes = [
        { name: "Conjunction", degrees: 0, orb: 8, nature: "neutral" as const },
        { name: "Trine", degrees: 120, orb: 8, nature: "harmonious" as const },
        { name: "Sextile", degrees: 60, orb: 6, nature: "harmonious" as const },
        { name: "Square", degrees: 90, orb: 8, nature: "challenging" as const },
        { name: "Opposition", degrees: 180, orb: 8, nature: "challenging" as const },
    ]

    for (const p1 of person1) {
        for (const p2 of person2) {
            const pos1 = signDegrees[p1.sign] + p1.degree
            const pos2 = signDegrees[p2.sign] + p2.degree
            let diff = Math.abs(pos1 - pos2)
            if (diff > 180) diff = 360 - diff

            for (const aspect of aspectTypes) {
                const orbDiff = Math.abs(diff - aspect.degrees)
                if (orbDiff <= aspect.orb) {
                    aspects.push({
                        planet1: p1.planet,
                        planet2: p2.planet,
                        aspectType: aspect.name,
                        orb: orbDiff,
                        nature: aspect.nature,
                        interpretation: getAspectInterpretation(p1.planet, p2.planet, aspect.name)
                    })
                }
            }
        }
    }

    return aspects.slice(0, 12) // Limit to most significant
}

function getAspectInterpretation(planet1: string, planet2: string, aspect: string): string {
    const interpretations: { [key: string]: string } = {
        "Sun-Moon-Conjunction": "Deep emotional connection and understanding",
        "Sun-Moon-Trine": "Natural harmony and mutual support",
        "Sun-Moon-Opposition": "Attraction of opposites, needs balance",
        "Venus-Mars-Conjunction": "Strong physical and romantic attraction",
        "Venus-Mars-Trine": "Easy romantic flow and mutual desire",
        "Venus-Mars-Square": "Passionate but challenging chemistry",
        "Moon-Moon-Conjunction": "Emotional fusion and deep empathy",
        "Moon-Moon-Trine": "Comfortable emotional understanding",
        "Jupiter-Venus-Trine": "Joy, growth, and abundance together",
        "Saturn-Sun-Square": "Challenges around authority and control",
        "Saturn-Moon-Square": "Emotional restriction, needs work",
    }

    const key = `${planet1}-${planet2}-${aspect}`
    const reverseKey = `${planet2}-${planet1}-${aspect}`
    return interpretations[key] || interpretations[reverseKey] || `${planet1}-${planet2} ${aspect} creates unique dynamics`
}

export default function SynastryChart() {
    const [showPartnerInput, setShowPartnerInput] = useState(false)
    const [partnerName, setPartnerName] = useState("Partner")
    const [partnerDOB, setPartnerDOB] = useState("")

    const aspects = calculateSynastryAspects(PERSON1_PLANETS, PERSON2_PLANETS)

    // Calculate compatibility scores
    const harmoniousAspects = aspects.filter(a => a.nature === "harmonious").length
    const challengingAspects = aspects.filter(a => a.nature === "challenging").length
    const totalAspects = aspects.length
    const compatibilityScore = Math.round((harmoniousAspects / Math.max(totalAspects, 1)) * 100)

    const getNatureColor = (nature: string) => {
        switch (nature) {
            case "harmonious": return "bg-green-500/20 text-green-400 border-green-500/30"
            case "challenging": return "bg-red-500/20 text-red-400 border-red-500/30"
            default: return "bg-blue-500/20 text-blue-400 border-blue-500/30"
        }
    }

    const getNatureIcon = (nature: string) => {
        switch (nature) {
            case "harmonious": return <CheckCircle2 className="w-4 h-4 text-green-400" />
            case "challenging": return <AlertTriangle className="w-4 h-4 text-red-400" />
            default: return <Star className="w-4 h-4 text-blue-400" />
        }
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <Card className="bg-gradient-to-br from-slate-900/50 to-pink-900/30 border-pink-500/30 p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-pink-500/20 rounded-full">
                            <Heart className="w-6 h-6 text-pink-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">Synastry Chart Analysis</h2>
                            <p className="text-sm text-gray-400">Compare charts for relationship compatibility</p>
                        </div>
                    </div>
                    <Button
                        variant="outline"
                        className="border-pink-500/30 text-pink-400"
                        onClick={() => setShowPartnerInput(!showPartnerInput)}
                    >
                        <Users className="w-4 h-4 mr-2" />
                        {showPartnerInput ? "Hide" : "Add Partner"}
                    </Button>
                </div>

                {showPartnerInput && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="grid md:grid-cols-3 gap-4 mt-4 p-4 bg-slate-800/50 rounded-lg"
                    >
                        <div>
                            <Label className="text-gray-300">Partner Name</Label>
                            <Input
                                value={partnerName}
                                onChange={(e) => setPartnerName(e.target.value)}
                                placeholder="Enter name"
                                className="bg-slate-900/50 border-pink-500/30"
                            />
                        </div>
                        <div>
                            <Label className="text-gray-300">Date of Birth</Label>
                            <Input
                                type="date"
                                value={partnerDOB}
                                onChange={(e) => setPartnerDOB(e.target.value)}
                                className="bg-slate-900/50 border-pink-500/30"
                            />
                        </div>
                        <div className="flex items-end">
                            <Button className="w-full bg-pink-500 hover:bg-pink-600">
                                Generate Chart
                            </Button>
                        </div>
                    </motion.div>
                )}
            </Card>

            {/* Compatibility Overview */}
            <div className="grid md:grid-cols-3 gap-4">
                <Card className="bg-slate-800/50 border-purple-500/20 p-4 text-center">
                    <div className="text-4xl font-bold text-pink-400 mb-2">{compatibilityScore}%</div>
                    <div className="text-sm text-gray-400">Compatibility Score</div>
                </Card>
                <Card className="bg-slate-800/50 border-green-500/20 p-4 text-center">
                    <div className="text-4xl font-bold text-green-400 mb-2">{harmoniousAspects}</div>
                    <div className="text-sm text-gray-400">Harmonious Aspects</div>
                </Card>
                <Card className="bg-slate-800/50 border-red-500/20 p-4 text-center">
                    <div className="text-4xl font-bold text-red-400 mb-2">{challengingAspects}</div>
                    <div className="text-sm text-gray-400">Challenging Aspects</div>
                </Card>
            </div>

            {/* Chart Comparison */}
            <Card className="bg-slate-800/50 border-purple-500/20 p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <ArrowLeftRight className="w-5 h-5 text-purple-400" />
                    Planetary Positions Comparison
                </h3>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-purple-500/20">
                                <th className="text-left py-2 text-gray-400">Planet</th>
                                <th className="text-center py-2 text-cyan-400">Sudhanshu</th>
                                <th className="text-center py-2 text-pink-400">{partnerName}</th>
                                <th className="text-center py-2 text-gray-400">Aspect</th>
                            </tr>
                        </thead>
                        <tbody>
                            {PERSON1_PLANETS.map((p1, idx) => {
                                const p2 = PERSON2_PLANETS[idx]
                                const aspect = aspects.find(a =>
                                    (a.planet1 === p1.planet || a.planet2 === p1.planet) &&
                                    (a.planet1 === p2.planet || a.planet2 === p2.planet)
                                )
                                return (
                                    <tr key={p1.planet} className="border-b border-slate-700/50">
                                        <td className="py-3">
                                            <span className="text-lg mr-2">{p1.symbol}</span>
                                            <span className="text-white">{p1.planet}</span>
                                        </td>
                                        <td className="py-3 text-center">
                                            <Badge className="bg-cyan-500/20 text-cyan-300">
                                                {p1.sign} {Math.round(p1.degree)}°
                                            </Badge>
                                        </td>
                                        <td className="py-3 text-center">
                                            <Badge className="bg-pink-500/20 text-pink-300">
                                                {p2.sign} {Math.round(p2.degree)}°
                                            </Badge>
                                        </td>
                                        <td className="py-3 text-center">
                                            {aspect && (
                                                <Badge className={getNatureColor(aspect.nature)}>
                                                    {aspect.aspectType}
                                                </Badge>
                                            )}
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Aspect Analysis */}
            <Card className="bg-slate-800/50 border-pink-500/20 p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-pink-400" />
                    Synastry Aspects Analysis
                </h3>

                <div className="space-y-3">
                    {aspects.map((aspect, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className={`p-3 rounded-lg border ${aspect.nature === "harmonious" ? "bg-green-900/10 border-green-500/20" :
                                    aspect.nature === "challenging" ? "bg-red-900/10 border-red-500/20" :
                                        "bg-blue-900/10 border-blue-500/20"
                                }`}
                        >
                            <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center gap-2">
                                    {getNatureIcon(aspect.nature)}
                                    <span className="font-medium text-white">
                                        {aspect.planet1} - {aspect.planet2}
                                    </span>
                                    <Badge className={getNatureColor(aspect.nature)}>
                                        {aspect.aspectType}
                                    </Badge>
                                </div>
                                <span className="text-xs text-gray-500">Orb: {aspect.orb.toFixed(1)}°</span>
                            </div>
                            <p className="text-sm text-gray-400">{aspect.interpretation}</p>
                        </motion.div>
                    ))}
                </div>
            </Card>

            {/* Summary */}
            <Card className="bg-gradient-to-br from-pink-900/20 to-purple-900/20 border-pink-500/20 p-6">
                <h3 className="text-lg font-semibold text-pink-400 mb-4">Relationship Summary</h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                        <h4 className="font-medium text-green-400 mb-2">Strengths</h4>
                        <ul className="space-y-1 text-gray-300">
                            <li>• Good emotional understanding</li>
                            <li>• Supportive communication patterns</li>
                            <li>• Shared growth potential</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-medium text-amber-400 mb-2">Areas to Work On</h4>
                        <ul className="space-y-1 text-gray-300">
                            <li>• Balance independence and togetherness</li>
                            <li>• Navigate different communication styles</li>
                            <li>• Align long-term goals</li>
                        </ul>
                    </div>
                </div>
            </Card>
        </div>
    )
}
