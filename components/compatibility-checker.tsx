"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Heart, Sparkles, Star, Users, ArrowRight, Flame, Shield, Zap, Calendar, Clock } from "lucide-react"
import SynastryChart from "@/components/synastry-chart"
import { calculateAshtakoot, getAllNakshatras, AshtakootResult } from "@/lib/compatibility-engine"
import { calculatePlanetaryPositions, getNakshatra } from "@/lib/cosmic-engine"
import { useAstrologyStore } from "@/stores/astrology-store"

// Get all nakshatra names for dropdown
const nakshatras = getAllNakshatras()

// Icon mapping for kootas
const kootaIcons: Record<string, React.ReactNode> = {
    Varna: <Star className="w-4 h-4" />,
    Vashya: <Shield className="w-4 h-4" />,
    Tara: <Sparkles className="w-4 h-4" />,
    Yoni: <Flame className="w-4 h-4" />,
    "Graha Maitri": <Users className="w-4 h-4" />,
    Gana: <Shield className="w-4 h-4" />,
    Bhakoot: <Heart className="w-4 h-4" />,
    Nadi: <Zap className="w-4 h-4" />
}

export default function CompatibilityChecker() {
    const { userData } = useAstrologyStore()

    // Input Mode
    const [inputMode, setInputMode] = useState<"nakshatra" | "birth-details">("birth-details")

    // Person 1 (Self/User)
    const [person1Name, setPerson1Name] = useState("")
    const [person1Nakshatra, setPerson1Nakshatra] = useState("")

    // Person 2 (Partner)
    const [person2Name, setPerson2Name] = useState("")
    const [person2Nakshatra, setPerson2Nakshatra] = useState("")
    const [person2Date, setPerson2Date] = useState("")
    const [person2Time, setPerson2Time] = useState("")

    const [result, setResult] = useState<AshtakootResult | null>(null)
    const [isCalculating, setIsCalculating] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [calculatedNakshatraInfo, setCalculatedNakshatraInfo] = useState<string | null>(null)

    // Auto-fill available user data on mount
    useEffect(() => {
        if (userData) {
            setPerson1Name(userData.name || "You")
            // Parse nakshatra from string like "Ashwini, Pada 1" -> "Ashwini"
            const nakName = userData.nakshatra.split(",")[0].trim()
            setPerson1Nakshatra(nakName)
        }
    }, [userData])

    // Calculate Nakshatra from Date/Time for Person 2
    const calculatePartnerNakshatra = () => {
        if (!person2Date || !person2Time) return null;
        try {
            const birthDate = new Date(`${person2Date}T${person2Time}`);
            const positions = calculatePlanetaryPositions(birthDate);
            const moonNak = getNakshatra(positions.moon); // calculatePlanetaryPositions now returns numbers in .moon by default? No, it returns object with `absoluteLongitude`? 
            // Wait, calculatePlanetaryPositions returns { moon: lon, ... } NO, I changed it to return object with props.
            // Let's check cosmic-engine.ts again.
            // modify: calculatePlanetaryPositions returns { sun: number, moon: number ... } OR objects?
            // Step 678: It returns { sun: { ..., absoluteLongitude: number }, ... }
            // Wait, `calculatePlanetaryPositions` function I wrote in Step 665 returns OBJECTS with `getSidereal` result which IS A NUMBER.
            // In `replace_file_content` I wrote:
            /*
               return {
                   sun: getSidereal(Astronomy.Body.Sun),
                   moon: getSidereal(Astronomy.Body.Moon),
                   ...
               };
            */
            // And `getSidereal` returns `normalize(tropical - ayanamsha)` which is a NUMBER.
            // SO `positions.moon` IS A NUMBER.
            // AND `getNakshatra` takes a NUMBER.
            // SO `getNakshatra(positions.moon)` is CORRECT.

            return moonNak.name;
        } catch (e) {
            console.error("Error calculating partner nakshatra", e);
            return null;
        }
    }

    const handleCalculate = () => {
        setError(null)
        setIsCalculating(true)
        setCalculatedNakshatraInfo(null)

        // Determine P2 Nakshatra
        let p2Nak = person2Nakshatra;
        if (inputMode === "birth-details") {
            const calculated = calculatePartnerNakshatra();
            if (!calculated) {
                setError("Invalid Date/Time for Partner");
                setIsCalculating(false);
                return;
            }
            p2Nak = calculated;
            setCalculatedNakshatraInfo(calculated);
        }

        if (!person1Nakshatra || !p2Nak) {
            setError("Please ensure valid nakshatra/details for both partners")
            setIsCalculating(false)
            return
        }

        setTimeout(() => {
            try {
                const ashtakootResult = calculateAshtakoot(person1Nakshatra, p2Nak)
                setResult(ashtakootResult)
            } catch (e) {
                setError("Error calculating compatibility")
            }
            setIsCalculating(false)
        }, 1500)
    }

    const handleReset = () => {
        setResult(null)
        setError(null)
        setCalculatedNakshatraInfo(null)
        // Keep names/dates for convenience
    }

    return (
        <Card className="bg-gradient-to-br from-pink-900/30 via-slate-900/50 to-rose-900/30 border-pink-500/30 p-6 backdrop-blur-sm overflow-hidden">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-pink-400 flex items-center">
                    <Heart className="w-5 h-5 mr-2" />
                    Compatibility Checker
                </h3>
                <Tabs value={inputMode} onValueChange={(v) => setInputMode(v as any)} className="w-[200px]">
                    <TabsList className="grid w-full grid-cols-2 bg-slate-800/50">
                        <TabsTrigger value="birth-details" className="text-xs">Birth Details</TabsTrigger>
                        <TabsTrigger value="nakshatra" className="text-xs">Nakshatra</TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>

            <AnimatePresence mode="wait">
                {!result ? (
                    <motion.div
                        key="form"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-6"
                    >
                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Person 1 (User) */}
                            <div className="space-y-4 p-4 bg-slate-800/30 rounded-xl border border-pink-500/20">
                                <h4 className="text-sm font-semibold text-pink-300 flex items-center">
                                    <span className="w-6 h-6 bg-pink-500/30 rounded-full flex items-center justify-center mr-2 text-xs">1</span>
                                    You (Partner 1)
                                </h4>
                                <div className="space-y-3">
                                    <div>
                                        <Label className="text-xs text-gray-400">Name</Label>
                                        <Input value={person1Name} onChange={(e) => setPerson1Name(e.target.value)} className="bg-slate-900/50 border-slate-700" />
                                    </div>
                                    <div>
                                        <Label className="text-xs text-gray-400">Nakshatra</Label>
                                        <select
                                            value={person1Nakshatra}
                                            onChange={(e) => setPerson1Nakshatra(e.target.value)}
                                            className="w-full h-10 px-3 bg-slate-900/50 border border-slate-700 rounded-md text-white text-sm"
                                        >
                                            <option value="">Select Nakshatra</option>
                                            {nakshatras.map(nak => <option key={nak} value={nak}>{nak}</option>)}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Person 2 (Partner) */}
                            <div className="space-y-4 p-4 bg-slate-800/30 rounded-xl border border-rose-500/20">
                                <h4 className="text-sm font-semibold text-rose-300 flex items-center">
                                    <span className="w-6 h-6 bg-rose-500/30 rounded-full flex items-center justify-center mr-2 text-xs">2</span>
                                    Partner
                                </h4>
                                <div className="space-y-3">
                                    <div>
                                        <Label className="text-xs text-gray-400">Name</Label>
                                        <Input value={person2Name} onChange={(e) => setPerson2Name(e.target.value)} className="bg-slate-900/50 border-slate-700" />
                                    </div>

                                    {inputMode === "birth-details" ? (
                                        <>
                                            <div>
                                                <Label className="text-xs text-gray-400 flex items-center"><Calendar className="w-3 h-3 mr-1" /> Birth Date</Label>
                                                <Input type="date" value={person2Date} onChange={(e) => setPerson2Date(e.target.value)} className="bg-slate-900/50 border-slate-700" />
                                            </div>
                                            <div>
                                                <Label className="text-xs text-gray-400 flex items-center"><Clock className="w-3 h-3 mr-1" /> Birth Time</Label>
                                                <Input type="time" value={person2Time} onChange={(e) => setPerson2Time(e.target.value)} className="bg-slate-900/50 border-slate-700" />
                                            </div>
                                        </>
                                    ) : (
                                        <div>
                                            <Label className="text-xs text-gray-400">Nakshatra</Label>
                                            <select
                                                value={person2Nakshatra}
                                                onChange={(e) => setPerson2Nakshatra(e.target.value)}
                                                className="w-full h-10 px-3 bg-slate-900/50 border border-slate-700 rounded-md text-white text-sm"
                                            >
                                                <option value="">Select Nakshatra</option>
                                                {nakshatras.map(nak => <option key={nak} value={nak}>{nak}</option>)}
                                            </select>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {error && <p className="text-red-400 text-sm text-center">{error}</p>}

                        <Button
                            onClick={handleCalculate}
                            disabled={isCalculating}
                            className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600"
                        >
                            {isCalculating ? "Analyzing positions..." : "Check Compatibility"}
                        </Button>
                    </motion.div>
                ) : (
                    <motion.div
                        key="result"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        {/* Result Content (Similar to previous, but simpler/cleaner code) */}
                        <div className="text-center space-y-3">
                            <div className="relative w-32 h-32 mx-auto flex items-center justify-center">
                                <svg className="w-full h-full -rotate-90">
                                    <circle cx="64" cy="64" r="60" stroke="#334155" strokeWidth="8" fill="none" />
                                    <motion.circle
                                        cx="64" cy="64" r="60"
                                        stroke="#ec4899"
                                        strokeWidth="8"
                                        fill="none"
                                        strokeDasharray={377}
                                        strokeDashoffset={377 - (377 * result.percentage) / 100}
                                        initial={{ strokeDashoffset: 377 }}
                                        animate={{ strokeDashoffset: 377 - (377 * result.percentage) / 100 }}
                                        transition={{ duration: 1.5 }}
                                    />
                                </svg>
                                <span className="absolute text-3xl font-bold">{result.percentage}%</span>
                            </div>

                            <div>
                                <h4 className={`text-2xl font-bold ${result.verdictColor}`}>{result.verdict}</h4>
                                <p className="text-gray-400">{result.totalScore} / 36 Gunas</p>
                            </div>

                            {calculatedNakshatraInfo && (
                                <Badge variant="outline" className="border-cyan-500/50 text-cyan-400">
                                    Partner's Star: {calculatedNakshatraInfo}
                                </Badge>
                            )}
                        </div>

                        {/* Breakdown */}
                        <div className="grid grid-cols-1 gap-2 border-t border-slate-700/50 pt-4">
                            {result.kootas.map(koota => (
                                <div key={koota.name} className="flex items-center justify-between p-2 bg-slate-800/20 rounded">
                                    <div className="flex items-center gap-2">
                                        <span className="text-pink-500/70">{kootaIcons[koota.name]}</span>
                                        <span className="text-sm font-medium text-gray-300">{koota.name}</span>
                                    </div>
                                    <span className="text-sm text-gray-400">{koota.score}/{koota.maxPoints}</span>
                                </div>
                            ))}
                        </div>

                        <Button onClick={handleReset} variant="outline" className="w-full border-pink-500/30 text-pink-400">
                            Check Another Match
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>
        </Card>
    )
}
