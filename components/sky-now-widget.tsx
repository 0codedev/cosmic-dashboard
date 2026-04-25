"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { calculateCurrentPlanetaryPositions } from "@/lib/cosmic-engine"
import { RefreshCw, Map } from "lucide-react"

// Types for current positions
type PlanetaryPositions = ReturnType<typeof calculateCurrentPlanetaryPositions>

export default function SkyNowWidget() {
    const [positions, setPositions] = useState<PlanetaryPositions | null>(null)
    const [loading, setLoading] = useState(true)
    const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

    const updatePositions = () => {
        setLoading(true)
        const now = new Date()
        // Small artificial delay for effect
        setTimeout(() => {
            const pos = calculateCurrentPlanetaryPositions(now)
            setPositions(pos)
            setLastUpdated(now)
            setLoading(false)
        }, 600)
    }

    useEffect(() => {
        updatePositions()
        const interval = setInterval(updatePositions, 60000) // Update every minute
        return () => clearInterval(interval)
    }, [])

    // Helper to get element color
    const getElementColor = (sign: string) => {
        const fire = ["Aries", "Leo", "Sagittarius"]
        const earth = ["Taurus", "Virgo", "Capricorn"]
        const air = ["Gemini", "Libra", "Aquarius"]
        // Water is default/others
        if (fire.includes(sign)) return "from-red-500/20 to-orange-500/20 text-orange-200 border-orange-500/30"
        if (earth.includes(sign)) return "from-green-500/20 to-emerald-500/20 text-emerald-200 border-green-500/30"
        if (air.includes(sign)) return "from-blue-500/20 to-cyan-500/20 text-cyan-200 border-cyan-500/30"
        return "from-purple-500/20 to-indigo-500/20 text-purple-200 border-purple-500/30"
    }

    // Helper to format planet display
    const planets = positions ? [
        { name: "Sun", data: positions.sun, icon: "☉" },
        { name: "Moon", data: positions.moon, icon: "☽" },
        { name: "Mars", data: positions.mars, icon: "♂" },
        { name: "Mercury", data: positions.mercury, icon: "☿" },
        { name: "Jupiter", data: positions.jupiter, icon: "♃" },
        { name: "Venus", data: positions.venus, icon: "♀" },
        { name: "Saturn", data: positions.saturn, icon: "♄" },
    ] : []

    return (
        <Card className="p-6 bg-gradient-to-br from-slate-900/80 to-indigo-950/50 border-indigo-500/30 backdrop-blur-md overflow-hidden relative">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 blur-[80px] rounded-full pointer-events-none" />

            <div className="flex justify-between items-center mb-6 relative z-10">
                <div className="flex items-center space-x-2">
                    <Map className="w-5 h-5 text-indigo-400" />
                    <h3 className="text-lg font-bold bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent">
                        Sky Now
                    </h3>
                </div>
                <div className="flex items-center space-x-3">
                    <span className="text-xs text-slate-400">
                        {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <button
                        onClick={updatePositions}
                        disabled={loading}
                        className={`p-2 rounded-full hover:bg-white/5 transition-all ${loading ? 'animate-spin' : ''}`}
                    >
                        <RefreshCw className="w-4 h-4 text-indigo-400" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 relative z-10">
                {loading ? (
                    // Skeleton loading state
                    Array(7).fill(0).map((_, i) => (
                        <div key={i} className="h-24 bg-slate-800/50 rounded-lg animate-pulse border border-slate-700/50" />
                    ))
                ) : (
                    planets.map((p, i) => (
                        <motion.div
                            key={p.name}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className={`p-3 rounded-xl border bg-gradient-to-b ${getElementColor(p.data.sign)} hover:scale-105 transition-transform cursor-default group`}
                        >
                            <div className="text-center space-y-2">
                                <div className="text-2xl opacity-80 group-hover:opacity-100 transition-opacity transform group-hover:scale-110 duration-300">
                                    {p.icon}
                                </div>
                                <div>
                                    <div className="text-xs font-semibold uppercase tracking-wider opacity-70">{onlySignName(p.data.sign)}</div>
                                    <div className="text-[10px] opacity-50">{p.data.degree}</div>
                                </div>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>

            {/* Nakshatra Ticker or Info */}
            {!loading && positions && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center text-xs text-slate-400 relative z-10"
                >
                    <span>Moon is in <strong>{positions.moon.nakshatra}</strong></span>
                    <span>Sun is in <strong>{positions.sun.nakshatra}</strong></span>
                </motion.div>
            )}
        </Card>
    )
}

function onlySignName(sign: string) {
    // "Aries" -> "Aries"
    return sign.split(' ')[0]
}
