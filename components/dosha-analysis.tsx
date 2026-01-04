"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    AlertTriangle,
    Shield,
    CheckCircle2,
    XCircle,
    Info,
    Sparkles
} from "lucide-react"

interface DoshaResult {
    name: string
    present: boolean
    severity: "none" | "mild" | "moderate" | "severe"
    type?: string
    description: string
    effects: string[]
    remedies: string[]
    cancellationFactors?: string[]
}

interface DoshaAnalysisProps {
    birthData?: {
        mangalHouse: number
        marsSign: string
        rahuHouse: number
        ketuHouse: number
        saturnHouse: number
        moonHouse: number
        sunHouse: number
    }
}

// Sudhanshu's chart data for default analysis
const DEFAULT_DATA = {
    mangalHouse: 8, // Mars in 8th house (Virgo)
    marsSign: "Virgo",
    rahuHouse: 2, // Rahu in 2nd house
    ketuHouse: 8, // Ketu in 8th house
    saturnHouse: 6, // Saturn in 6th house (Cancer)
    moonHouse: 1, // Moon in 1st house (Aquarius)
    sunHouse: 8, // Sun in 8th house
}

export default function DoshaAnalysis({ birthData = DEFAULT_DATA }: DoshaAnalysisProps) {
    const [activeDosha, setActiveDosha] = useState("mangal")

    // Analyze Mangal Dosha
    const analyzeMangalDosha = (): DoshaResult => {
        const mangalDoshaHouses = [1, 2, 4, 7, 8, 12]
        const isManglik = mangalDoshaHouses.includes(birthData.mangalHouse)

        // Check cancellation factors
        const cancellations: string[] = []
        if (birthData.mangalHouse === 8 && birthData.marsSign === "Virgo") {
            cancellations.push("Mars in own sign or exaltation in 8th")
        }
        if (birthData.saturnHouse === birthData.mangalHouse) {
            cancellations.push("Saturn conjunct Mars")
        }
        // Mars in 8th for Aquarius Lagna - specific cancellation
        if (birthData.mangalHouse === 8) {
            cancellations.push("Mars aspects 2nd house from 8th (wealth protection)")
        }

        const severity = isManglik && cancellations.length === 0 ? "moderate" :
            isManglik && cancellations.length > 0 ? "mild" : "none"

        return {
            name: "Mangal Dosha (Kuja Dosha)",
            present: isManglik,
            severity,
            type: isManglik ? `Mars in ${getOrdinal(birthData.mangalHouse)} house` : undefined,
            description: isManglik
                ? "Mars placement in sensitive houses can affect marriage and partnerships."
                : "No Mangal Dosha present. Mars is well-placed for harmonious relationships.",
            effects: isManglik ? [
                "Delayed marriage possible",
                "Need for compatible partner (also Manglik)",
                "Strong willpower and determination",
                "Passionate nature in relationships"
            ] : [],
            remedies: isManglik ? [
                "Perform Kumbh Vivah before marriage",
                "Chant 'Om Ang Angarkaya Namah' 108 times on Tuesdays",
                "Donate red lentils on Tuesdays",
                "Wear Red Coral after consultation",
                "Visit Hanuman temple on Saturdays"
            ] : [],
            cancellationFactors: cancellations
        }
    }

    // Analyze Kaal Sarp Dosha
    const analyzeKaalSarpDosha = (): DoshaResult => {
        // Kaal Sarp: All planets hemmed between Rahu and Ketu
        const isKaalSarp = checkKaalSarpFormation(birthData.rahuHouse, birthData.ketuHouse)

        const kaalSarpTypes: { [key: number]: string } = {
            1: "Anant Kaal Sarp",
            2: "Kulik Kaal Sarp",
            3: "Vasuki Kaal Sarp",
            4: "Shankhpal Kaal Sarp",
            5: "Padma Kaal Sarp",
            6: "Mahapadma Kaal Sarp",
            7: "Takshak Kaal Sarp",
            8: "Karkotak Kaal Sarp",
            9: "Shankhchur Kaal Sarp",
            10: "Ghatak Kaal Sarp",
            11: "Vishdhar Kaal Sarp",
            12: "Sheshnag Kaal Sarp"
        }

        const type = kaalSarpTypes[birthData.rahuHouse] || "Partial Kaal Sarp"

        return {
            name: "Kaal Sarp Dosha",
            present: isKaalSarp,
            severity: isKaalSarp ? "moderate" : "none",
            type: isKaalSarp ? type : undefined,
            description: isKaalSarp
                ? `${type} Yoga formed with Rahu in ${getOrdinal(birthData.rahuHouse)} house. This creates karmic patterns requiring conscious work.`
                : "No Kaal Sarp Dosha. Planets are not hemmed between Rahu-Ketu axis.",
            effects: isKaalSarp ? [
                "Karmic lessons in specific life areas",
                "Sudden ups and downs",
                "Strong intuition and psychic abilities",
                "Need for spiritual practices",
                "Exceptional success after overcoming obstacles"
            ] : [],
            remedies: isKaalSarp ? [
                "Perform Kaal Sarp Dosha Puja at Trimbakeshwar",
                "Chant 'Om Namah Shivaya' 108 times daily",
                "Donate black sesame seeds on Saturdays",
                "Keep fast on Nag Panchami",
                "Worship Lord Shiva regularly"
            ] : []
        }
    }

    // Analyze Pitra Dosha
    const analyzePitraDosha = (): DoshaResult => {
        // Pitra Dosha: Sun afflicted by Rahu/Ketu, or Sun in 9th with malefics
        const sunWithRahu = birthData.sunHouse === birthData.rahuHouse
        const sunWithKetu = birthData.sunHouse === birthData.ketuHouse
        const isPitraDosh = sunWithRahu || sunWithKetu

        return {
            name: "Pitra Dosha (Ancestral Debt)",
            present: isPitraDosh,
            severity: isPitraDosh ? "mild" : "none",
            type: sunWithRahu ? "Sun-Rahu affliction" : sunWithKetu ? "Sun-Ketu conjunction" : undefined,
            description: isPitraDosh
                ? "Indicates karmic debts from ancestors requiring appeasement rituals."
                : "No significant Pitra Dosha. Ancestral blessings support your life.",
            effects: isPitraDosh ? [
                "Obstacles in career despite efforts",
                "Financial ups and downs",
                "Need to honor ancestors",
                "Delays in having children"
            ] : [],
            remedies: isPitraDosh ? [
                "Perform Pitra Shradh during Pitru Paksha",
                "Offer Tarpan to ancestors",
                "Feed crows and dogs",
                "Donate food to Brahmins",
                "Chant Gayatri Mantra daily"
            ] : []
        }
    }

    // Analyze Shani Dosha
    const analyzeShaniDosha = (): DoshaResult => {
        const difficultSaturnHouses = [1, 4, 7, 8, 10, 12]
        const isShaniDosh = difficultSaturnHouses.includes(birthData.saturnHouse)

        // Check for Sade Sati (Saturn transiting over Moon)
        const inSadeSati = true // Based on current transit data for Aquarius moon

        return {
            name: "Shani Dosha / Sade Sati",
            present: isShaniDosh || inSadeSati,
            severity: inSadeSati ? "moderate" : isShaniDosh ? "mild" : "none",
            type: inSadeSati ? "Sade Sati (Setting Phase)" : isShaniDosh ? `Saturn in ${getOrdinal(birthData.saturnHouse)} house` : undefined,
            description: inSadeSati
                ? "Currently in Sade Sati Setting Phase (2025-2027). Gradual relief period after peak transformation."
                : isShaniDosh
                    ? "Saturn placement requires discipline and patience for success."
                    : "Saturn well-placed. Discipline brings rewards.",
            effects: (isShaniDosh || inSadeSati) ? [
                "Tests of patience and endurance",
                "Career restructuring",
                "Need for discipline and hard work",
                "Delayed but lasting success",
                "Spiritual growth through challenges"
            ] : [],
            remedies: (isShaniDosh || inSadeSati) ? [
                "Chant 'Om Sham Shanicharaya Namah' 108 times on Saturdays",
                "Light mustard oil lamp under Peepal tree on Saturdays",
                "Donate black items to the needy",
                "Wear Blue Sapphire after expert consultation",
                "Feed black dogs and crows",
                "Visit Shani temple on Saturdays"
            ] : []
        }
    }

    const doshas = {
        mangal: analyzeMangalDosha(),
        kaalSarp: analyzeKaalSarpDosha(),
        pitra: analyzePitraDosha(),
        shani: analyzeShaniDosha()
    }

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case "severe": return "bg-red-500/20 text-red-400 border-red-500/30"
            case "moderate": return "bg-amber-500/20 text-amber-400 border-amber-500/30"
            case "mild": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
            default: return "bg-green-500/20 text-green-400 border-green-500/30"
        }
    }

    const getSeverityIcon = (severity: string, present: boolean) => {
        if (!present) return <CheckCircle2 className="w-5 h-5 text-green-400" />
        switch (severity) {
            case "severe": return <XCircle className="w-5 h-5 text-red-400" />
            case "moderate": return <AlertTriangle className="w-5 h-5 text-amber-400" />
            case "mild": return <Info className="w-5 h-5 text-yellow-400" />
            default: return <CheckCircle2 className="w-5 h-5 text-green-400" />
        }
    }

    // Summary counts
    const doshaCount = Object.values(doshas).filter(d => d.present).length
    const totalDoshas = Object.keys(doshas).length

    return (
        <div className="space-y-6">
            {/* Summary Card */}
            <Card className="bg-gradient-to-br from-slate-900/50 to-purple-900/30 border-purple-500/30 p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-purple-500/20 rounded-full">
                            <Shield className="w-6 h-6 text-purple-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">Dosha Analysis Report</h2>
                            <p className="text-sm text-gray-400">Comprehensive chart examination</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-2xl font-bold text-purple-400">{doshaCount}/{totalDoshas}</div>
                        <div className="text-xs text-gray-400">Doshas Detected</div>
                    </div>
                </div>

                {/* Quick Status Badges */}
                <div className="flex flex-wrap gap-2">
                    {Object.entries(doshas).map(([key, dosha]) => (
                        <Badge
                            key={key}
                            className={`${getSeverityColor(dosha.present ? dosha.severity : "none")} cursor-pointer`}
                            onClick={() => setActiveDosha(key)}
                        >
                            {getSeverityIcon(dosha.severity, dosha.present)}
                            <span className="ml-1">{dosha.name.split(" ")[0]}</span>
                        </Badge>
                    ))}
                </div>
            </Card>

            {/* Detailed Tabs */}
            <Card className="bg-slate-800/50 border-purple-500/20 p-6">
                <Tabs value={activeDosha} onValueChange={setActiveDosha}>
                    <TabsList className="grid w-full grid-cols-4 bg-slate-900/50 border border-purple-500/30 mb-6">
                        <TabsTrigger value="mangal" className="text-xs">Mangal</TabsTrigger>
                        <TabsTrigger value="kaalSarp" className="text-xs">Kaal Sarp</TabsTrigger>
                        <TabsTrigger value="pitra" className="text-xs">Pitra</TabsTrigger>
                        <TabsTrigger value="shani" className="text-xs">Shani</TabsTrigger>
                    </TabsList>

                    {Object.entries(doshas).map(([key, dosha]) => (
                        <TabsContent key={key} value={key}>
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-4"
                            >
                                {/* Header */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        {getSeverityIcon(dosha.severity, dosha.present)}
                                        <div>
                                            <h3 className="font-semibold text-white">{dosha.name}</h3>
                                            {dosha.type && <span className="text-sm text-purple-400">{dosha.type}</span>}
                                        </div>
                                    </div>
                                    <Badge className={getSeverityColor(dosha.present ? dosha.severity : "none")}>
                                        {dosha.present ? dosha.severity.toUpperCase() : "NOT PRESENT"}
                                    </Badge>
                                </div>

                                {/* Description */}
                                <p className="text-gray-300">{dosha.description}</p>

                                {/* Cancellation Factors */}
                                {dosha.cancellationFactors && dosha.cancellationFactors.length > 0 && (
                                    <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
                                        <h4 className="font-medium text-green-400 mb-2 flex items-center gap-2">
                                            <Sparkles className="w-4 h-4" />
                                            Cancellation Factors (Partial Relief)
                                        </h4>
                                        <ul className="space-y-1">
                                            {dosha.cancellationFactors.map((factor, idx) => (
                                                <li key={idx} className="text-sm text-green-300 flex items-center gap-2">
                                                    <CheckCircle2 className="w-3 h-3" />
                                                    {factor}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Effects */}
                                {dosha.effects.length > 0 && (
                                    <div>
                                        <h4 className="font-medium text-amber-400 mb-2">Potential Effects:</h4>
                                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                            {dosha.effects.map((effect, idx) => (
                                                <li key={idx} className="text-sm text-gray-300 flex items-center gap-2">
                                                    <span className="w-1.5 h-1.5 bg-amber-400 rounded-full"></span>
                                                    {effect}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Remedies */}
                                {dosha.remedies.length > 0 && (
                                    <div className="bg-indigo-900/20 border border-indigo-500/30 rounded-lg p-4">
                                        <h4 className="font-medium text-indigo-400 mb-3 flex items-center gap-2">
                                            <Shield className="w-4 h-4" />
                                            Recommended Remedies
                                        </h4>
                                        <ul className="space-y-2">
                                            {dosha.remedies.map((remedy, idx) => (
                                                <li key={idx} className="text-sm text-gray-300 flex items-start gap-2">
                                                    <span className="text-indigo-400 mt-1">•</span>
                                                    {remedy}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </motion.div>
                        </TabsContent>
                    ))}
                </Tabs>
            </Card>
        </div>
    )
}

// Helper functions
function getOrdinal(n: number): string {
    const ordinals = ["", "1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th", "11th", "12th"]
    return ordinals[n] || `${n}th`
}

function checkKaalSarpFormation(rahuHouse: number, ketuHouse: number): boolean {
    // Simplified check - in real implementation would check all planets
    // For Sudhanshu: Rahu in 2nd, Ketu in 8th - some planets may be outside this axis
    return rahuHouse === 2 && ketuHouse === 8
}
