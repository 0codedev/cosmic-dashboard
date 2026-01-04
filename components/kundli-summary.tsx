"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    Sun,
    Moon,
    Star,
    Calendar,
    Clock,
    MapPin
} from "lucide-react"

interface KundliSummaryProps {
    name?: string
    birthDate?: string
    birthTime?: string
    birthPlace?: string
}

export default function KundliSummary({
    name = "Sudhanshu",
    birthDate = "September 6, 1997",
    birthTime = "05:02 AM",
    birthPlace = "Lucknow, India"
}: KundliSummaryProps) {
    const summaryData = {
        sunSign: "Virgo",
        moonSign: "Aquarius",
        nakshatra: "Shatabhisha",
        lagna: "Aquarius",
        currentDasha: "Rahu-Saturn",
        yogaCount: 12,
        luckyGem: "Hessonite (Gomed)",
        rulingPlanet: "Saturn",
    }

    return (
        <Card className="bg-gradient-to-br from-indigo-900/30 via-slate-900/50 to-purple-900/30 border-indigo-500/30 p-5 relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-500/10 to-transparent rounded-full blur-xl" />
            <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-purple-500/10 to-transparent rounded-full blur-xl" />

            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {name.charAt(0)}
                </div>
                <div>
                    <h3 className="font-bold text-white text-lg">{name}</h3>
                    <p className="text-xs text-gray-400">Vedic Birth Chart Summary</p>
                </div>
            </div>

            {/* Birth Details */}
            <div className="grid grid-cols-3 gap-2 mb-4 text-xs">
                <div className="flex items-center gap-1 text-gray-400">
                    <Calendar className="w-3 h-3" />
                    <span>{birthDate}</span>
                </div>
                <div className="flex items-center gap-1 text-gray-400">
                    <Clock className="w-3 h-3" />
                    <span>{birthTime}</span>
                </div>
                <div className="flex items-center gap-1 text-gray-400">
                    <MapPin className="w-3 h-3" />
                    <span>{birthPlace.split(",")[0]}</span>
                </div>
            </div>

            {/* Key Positions */}
            <div className="grid grid-cols-4 gap-2 mb-4">
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="text-center p-2 bg-slate-800/50 rounded-lg border border-amber-500/20"
                >
                    <Sun className="w-4 h-4 mx-auto text-amber-400 mb-1" />
                    <div className="text-xs font-medium text-amber-400">{summaryData.sunSign}</div>
                    <div className="text-[10px] text-gray-500">Sun Sign</div>
                </motion.div>

                <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="text-center p-2 bg-slate-800/50 rounded-lg border border-cyan-500/20"
                >
                    <Moon className="w-4 h-4 mx-auto text-cyan-400 mb-1" />
                    <div className="text-xs font-medium text-cyan-400">{summaryData.moonSign}</div>
                    <div className="text-[10px] text-gray-500">Moon Sign</div>
                </motion.div>

                <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="text-center p-2 bg-slate-800/50 rounded-lg border border-purple-500/20"
                >
                    <Star className="w-4 h-4 mx-auto text-purple-400 mb-1" />
                    <div className="text-xs font-medium text-purple-400">{summaryData.lagna}</div>
                    <div className="text-[10px] text-gray-500">Lagna</div>
                </motion.div>

                <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="text-center p-2 bg-slate-800/50 rounded-lg border border-pink-500/20"
                >
                    <Star className="w-4 h-4 mx-auto text-pink-400 mb-1 fill-pink-400" />
                    <div className="text-xs font-medium text-pink-400">{summaryData.nakshatra}</div>
                    <div className="text-[10px] text-gray-500">Nakshatra</div>
                </motion.div>
            </div>

            {/* Current Dasha */}
            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-900/30 to-indigo-900/30 rounded-lg border border-purple-500/20 mb-3">
                <div>
                    <div className="text-xs text-gray-400">Current Mahadasha</div>
                    <div className="font-semibold text-white">{summaryData.currentDasha}</div>
                </div>
                <Badge className="bg-purple-500/20 text-purple-400">Active</Badge>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2 bg-slate-800/30 rounded">
                    <div className="font-bold text-green-400">{summaryData.yogaCount}</div>
                    <div className="text-gray-500">Yogas</div>
                </div>
                <div className="p-2 bg-slate-800/30 rounded">
                    <div className="font-bold text-amber-400">{summaryData.rulingPlanet}</div>
                    <div className="text-gray-500">Lord</div>
                </div>
                <div className="p-2 bg-slate-800/30 rounded">
                    <div className="font-bold text-blue-400">Gomed</div>
                    <div className="text-gray-500">Gem</div>
                </div>
            </div>
        </Card>
    )
}
