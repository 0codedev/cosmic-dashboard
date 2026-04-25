"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { getPanchangTimings, isInauspiciousNow } from "@/lib/panchang-engine"
import { Zap, AlertTriangle, ShieldCheck, Moon } from "lucide-react"

export default function CosmicPowerScore() {
    const [score, setScore] = useState(0)
    const [status, setStatus] = useState("Neutral")
    const [activeFactor, setActiveFactor] = useState<string | null>(null)

    useEffect(() => {
        // Calculate a dynamic score based on current time
        const now = new Date()
        const panchang = getPanchangTimings(now)
        const badTime = isInauspiciousNow(now)

        let baseScore = 75 // Start optimistic
        let currentStatus = "Good"
        let factor = "Neutral Skies"

        // 1. Deduct for Inauspicious Times
        if (badTime.isInauspicious && badTime.period) {
            baseScore -= 40
            currentStatus = "Caution"
            factor = `${badTime.period.name} Active`
        } else if (panchang.abhijitMuhurta.isActive) {
            baseScore += 15
            currentStatus = "Excellent"
            factor = "Abhijit Muhurta Active"
        } else if (panchang.brahmamuhrta.isActive) {
            baseScore += 25
            currentStatus = "Divine"
            factor = "Brahma Muhurta"
        }

        // 2. Adjust for Day Time vs Night
        const hour = now.getHours()
        if (hour >= 22 || hour < 4) {
            baseScore -= 10 // Less energy at night typically
            if (!badTime.isInauspicious) factor = "Resting Phase"
        }

        // Clamp score
        const finalScore = Math.max(0, Math.min(100, baseScore))

        setScore(finalScore)
        setStatus(currentStatus)
        setActiveFactor(factor)

    }, [])

    // Color logic
    const getColor = () => {
        if (score >= 80) return "text-green-400 drop-shadow-[0_0_8px_rgba(74,222,128,0.5)]"
        if (score >= 60) return "text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]"
        if (score >= 40) return "text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]"
        return "text-red-400 drop-shadow-[0_0_8px_rgba(248,113,113,0.5)]"
    }

    const getGradient = () => {
        if (score >= 80) return "from-green-500/20 to-emerald-500/20 border-green-500/30"
        if (score >= 60) return "from-cyan-500/20 to-blue-500/20 border-cyan-500/30"
        if (score >= 40) return "from-yellow-500/20 to-orange-500/20 border-yellow-500/30"
        return "from-red-500/20 to-pink-500/20 border-red-500/30"
    }

    return (
        <Card className={`p-6 bg-gradient-to-br ${getGradient()} backdrop-blur-md relative overflow-hidden flex flex-col items-center justify-center text-center h-full`}>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-50" />

            <div className="relative mb-2">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className={`text-5xl font-black ${getColor()}`}
                >
                    {score}
                </motion.div>
                <span className="text-xs uppercase tracking-widest text-slate-400">Power Score</span>
            </div>

            <div className="space-y-1 mt-2">
                <div className="flex items-center justify-center space-x-2">
                    {score < 40 ? <AlertTriangle className="w-4 h-4 text-red-400" /> : <Zap className="w-4 h-4 text-cyan-400" />}
                    <span className="font-semibold text-white">{status}</span>
                </div>
                <p className="text-xs text-slate-300 opacity-80">{activeFactor}</p>
            </div>
        </Card>
    )
}
