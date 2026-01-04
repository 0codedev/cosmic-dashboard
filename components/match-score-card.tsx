"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    Heart,
    Star,
    Sparkles
} from "lucide-react"

interface MatchScoreProps {
    person1Name?: string
    person2Name?: string
    score?: number
}

export default function MatchScoreCard({
    person1Name = "You",
    person2Name = "Partner",
    score = 72
}: MatchScoreProps) {
    const [animatedScore, setAnimatedScore] = useState(0)
    const [showHearts, setShowHearts] = useState(false)

    useEffect(() => {
        // Animate score counting
        const duration = 2000
        const steps = 60
        const increment = score / steps
        let current = 0

        const timer = setInterval(() => {
            current += increment
            if (current >= score) {
                setAnimatedScore(score)
                clearInterval(timer)
                setShowHearts(true)
            } else {
                setAnimatedScore(Math.floor(current))
            }
        }, duration / steps)

        return () => clearInterval(timer)
    }, [score])

    const getScoreColor = (s: number) => {
        if (s >= 75) return { ring: "ring-green-400", text: "text-green-400", bg: "from-green-900/30" }
        if (s >= 60) return { ring: "ring-cyan-400", text: "text-cyan-400", bg: "from-cyan-900/30" }
        if (s >= 45) return { ring: "ring-yellow-400", text: "text-yellow-400", bg: "from-yellow-900/30" }
        return { ring: "ring-red-400", text: "text-red-400", bg: "from-red-900/30" }
    }

    const getVerdict = (s: number) => {
        if (s >= 75) return { text: "Excellent Match! 💫", desc: "Highly compatible" }
        if (s >= 60) return { text: "Good Match 💚", desc: "Strong compatibility" }
        if (s >= 45) return { text: "Moderate Match 🧡", desc: "Workable with effort" }
        return { text: "Challenging 💪", desc: "Requires dedication" }
    }

    const colors = getScoreColor(score)
    const verdict = getVerdict(score)

    return (
        <Card className={`bg-gradient-to-br ${colors.bg} to-slate-900/50 border-pink-500/30 p-6 relative overflow-hidden`}>
            {/* Floating Hearts Animation */}
            {showHearts && (
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    {[...Array(6)].map((_, i) => (
                        <motion.div
                            key={i}
                            initial={{ y: 100, x: Math.random() * 100, opacity: 0 }}
                            animate={{ y: -100, opacity: [0, 1, 0] }}
                            transition={{
                                duration: 3,
                                delay: i * 0.3,
                                repeat: Infinity,
                                repeatDelay: 2
                            }}
                            className="absolute"
                            style={{ left: `${10 + i * 15}%` }}
                        >
                            <Heart className="w-4 h-4 text-pink-400/50 fill-pink-400/30" />
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Header */}
            <div className="flex items-center justify-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-pink-400" />
                <h3 className="font-bold text-white">Compatibility Score</h3>
                <Sparkles className="w-5 h-5 text-pink-400" />
            </div>

            {/* Names */}
            <div className="flex items-center justify-center gap-4 mb-6">
                <Badge className="bg-cyan-500/20 text-cyan-400 px-3 py-1">{person1Name}</Badge>
                <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                >
                    <Heart className="w-6 h-6 text-pink-400 fill-pink-400" />
                </motion.div>
                <Badge className="bg-pink-500/20 text-pink-400 px-3 py-1">{person2Name}</Badge>
            </div>

            {/* Score Circle */}
            <div className="relative w-40 h-40 mx-auto mb-6">
                {/* Background Circle */}
                <svg className="w-40 h-40 -rotate-90" viewBox="0 0 100 100">
                    <circle
                        cx="50" cy="50" r="45"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        className="text-slate-700"
                    />
                    <motion.circle
                        cx="50" cy="50" r="45"
                        stroke="url(#scoreGradient)"
                        strokeWidth="8"
                        fill="none"
                        strokeLinecap="round"
                        initial={{ strokeDasharray: "0 283" }}
                        animate={{ strokeDasharray: `${animatedScore * 2.83} 283` }}
                        transition={{ duration: 2, ease: "easeOut" }}
                    />
                    <defs>
                        <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#ec4899" />
                            <stop offset="50%" stopColor="#f43f5e" />
                            <stop offset="100%" stopColor="#fb7185" />
                        </linearGradient>
                    </defs>
                </svg>

                {/* Score Number */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <motion.span
                        className={`text-4xl font-bold ${colors.text}`}
                        animate={{ scale: animatedScore === score ? [1, 1.1, 1] : 1 }}
                    >
                        {animatedScore}%
                    </motion.span>
                    <span className="text-xs text-gray-400">out of 36 Gunas</span>
                </div>
            </div>

            {/* Verdict */}
            <div className="text-center">
                <motion.h4
                    className={`text-xl font-bold ${colors.text}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 2 }}
                >
                    {verdict.text}
                </motion.h4>
                <p className="text-sm text-gray-400">{verdict.desc}</p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-2 mt-4">
                <div className="text-center p-2 bg-slate-800/50 rounded-lg">
                    <div className="text-lg font-bold text-amber-400">{Math.round(score * 0.36)}</div>
                    <div className="text-xs text-gray-500">Gunas</div>
                </div>
                <div className="text-center p-2 bg-slate-800/50 rounded-lg">
                    <Star className="w-4 h-4 mx-auto text-green-400 fill-green-400" />
                    <div className="text-xs text-gray-500 mt-1">Nadi OK</div>
                </div>
                <div className="text-center p-2 bg-slate-800/50 rounded-lg">
                    <Star className="w-4 h-4 mx-auto text-green-400 fill-green-400" />
                    <div className="text-xs text-gray-500 mt-1">Bhakoot OK</div>
                </div>
            </div>
        </Card>
    )
}
