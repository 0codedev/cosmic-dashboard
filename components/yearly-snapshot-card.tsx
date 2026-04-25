"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Calendar, Sparkles } from "lucide-react"
import { useResolvedUserData } from "@/contexts/user-context"

interface YearlySnapshotCardProps {
    onNavigate: () => void
}

export default function YearlySnapshotCard({ onNavigate }: YearlySnapshotCardProps) {
    const user = useResolvedUserData()
    const annual = user.annualForecast

    if (!annual) return null

    return (
        <Card className="bg-gradient-to-r from-indigo-900/40 to-purple-900/40 border-indigo-500/30 p-6 relative overflow-hidden group hover:border-indigo-500/50 transition-colors">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-[60px] rounded-full pointer-events-none group-hover:bg-purple-500/20 transition-all duration-500" />

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="border-indigo-400/50 text-indigo-300 bg-indigo-500/10">
                            {annual.year} Varshphal
                        </Badge>
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-yellow-400" />
                            Year Lord: {annual.yearLord}
                        </span>
                    </div>
                    <h3 className="text-xl font-bold text-white leading-tight">
                        {annual.summary.split('.')[0]}.
                    </h3>
                    <p className="text-sm text-gray-300 max-w-xl line-clamp-2">
                        {annual.muntha.effect}
                    </p>
                </div>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onNavigate}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg shadow-lg shadow-indigo-900/20 transition-colors whitespace-nowrap"
                >
                    <Calendar className="w-4 h-4" />
                    <span>View Roadmap</span>
                    <ArrowRight className="w-4 h-4" />
                </motion.button>
            </div>
        </Card>
    )
}
