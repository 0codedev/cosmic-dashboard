"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
    Calendar,
    Star,
    TrendingUp,
    Sparkles,
    AlertCircle
} from "lucide-react"
import { useResolvedUserData } from "@/contexts/user-context"

export default function YearlyForecast() {
    const user = useResolvedUserData()
    const annualData = user.annualForecast

    const [selectedQuarter, setSelectedQuarter] = useState<string>("Q1")

    // Fallback if no annual data
    if (!annualData) return (
        <Card className="p-6 text-center border-dashed border-gray-700 bg-transparent">
            <p className="text-gray-400">No Annual Forecast available for this year.</p>
        </Card>
    )

    // Map quarterly data to component structure
    const activeQuarter = annualData.quarterly.find(q => q.period.startsWith(selectedQuarter))

    return (
        <div className="space-y-6">
            {/* Header: Muntha & Year Lord */}
            <Card className="bg-gradient-to-br from-indigo-900/50 to-slate-900/50 border-indigo-500/30 p-6">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-indigo-500/20 rounded-full">
                            <Calendar className="w-6 h-6 text-indigo-400" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white">{annualData.year} Annual Forecast (Varshphal)</h2>
                            <p className="text-gray-400 text-sm">Year Lord: <span className="text-cyan-400 font-semibold">{annualData.yearLord}</span> | Muntha: <span className="text-purple-400 font-semibold">{annualData.muntha.house}</span></p>
                        </div>
                    </div>
                    <Badge variant="outline" className="text-sm bg-indigo-500/10 text-indigo-300 border-indigo-500/30">
                        {annualData.summary.split('.')[0]}
                    </Badge>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-indigo-950/30 rounded-lg p-4 border border-indigo-500/20">
                        <h3 className="text-sm uppercase tracking-wider text-indigo-400 font-semibold mb-2 flex items-center gap-2">
                            <Sparkles className="w-4 h-4" /> Muntha Effect ({annualData.muntha.house})
                        </h3>
                        <p className="text-gray-300 italic text-sm">"{annualData.muntha.effect}"</p>
                    </div>
                    <div className="bg-purple-950/30 rounded-lg p-4 border border-purple-500/20">
                        <h3 className="text-sm uppercase tracking-wider text-purple-400 font-semibold mb-2 flex items-center gap-2">
                            <Calendar className="w-4 h-4" /> Key 2026 Shifts
                        </h3>
                        <ul className="text-sm space-y-2">
                            <li className="flex justify-between text-gray-300">
                                <span>Jupiter enters Cancer</span>
                                <span className="text-yellow-400 font-mono">May '26</span>
                            </li>
                            <li className="flex justify-between text-gray-300">
                                <span>Saturn Retrograde</span>
                                <span className="text-indigo-400 font-mono">Jul '26</span>
                            </li>
                            <li className="flex justify-between text-gray-300">
                                <span>Rahu enters 12th House</span>
                                <span className="text-cyan-400 font-mono">Oct '26</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Quarter Selection */}
                <div className="grid grid-cols-4 gap-2">
                    {["Q1", "Q2", "Q3", "Q4"].map((q) => {
                        const qInfo = annualData.quarterly.find(item => item.period.startsWith(q))
                        return (
                            <motion.div
                                key={q}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className={`p-3 rounded-lg cursor-pointer text-center transition-all ${selectedQuarter === q
                                    ? 'bg-indigo-500/30 border border-indigo-400'
                                    : 'bg-slate-800/50 border border-slate-700 hover:border-indigo-500/50'
                                    }`}
                                onClick={() => setSelectedQuarter(q)}
                            >
                                <div className="font-bold text-white">{q}</div>
                                <div className="text-xs text-gray-400 truncate hidden md:block">{qInfo?.theme}</div>
                            </motion.div>
                        )
                    })}
                </div>
            </Card>

            {/* Selected Quarter Details */}
            {activeQuarter && (
                <motion.div
                    key={activeQuarter.period}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                >
                    <Card className="bg-gradient-to-br from-slate-900/80 to-indigo-950/30 border-slate-700/50 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-indigo-400" />
                                {activeQuarter.theme}
                            </h3>
                            <Badge className="bg-slate-800 text-slate-300 border-slate-700">{activeQuarter.period}</Badge>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <h4 className="text-sm text-gray-400 uppercase tracking-widest font-semibold mb-2">Strategy</h4>
                                <p className="text-gray-200 leading-relaxed bg-slate-900/50 p-4 rounded-lg border border-slate-700/50">
                                    {activeQuarter.strategy}
                                </p>
                            </div>
                        </div>
                    </Card>

                    {/* Remedies Section for the Year */}
                    <Card className="bg-amber-900/10 border-amber-500/20 p-6">
                        <h4 className="text-lg font-semibold text-amber-400 mb-4 flex items-center gap-2">
                            <AlertCircle className="w-5 h-5" />
                            Annual Remedies
                        </h4>
                        <div className="grid md:grid-cols-1 gap-3">
                            {annualData.remedies.map((remedy, idx) => (
                                <div key={idx} className="flex items-start gap-3 text-amber-100/80 bg-amber-950/30 p-3 rounded border border-amber-500/10">
                                    <Star className="w-4 h-4 text-amber-500 mt-1 flex-shrink-0" />
                                    <span>{remedy}</span>
                                </div>
                            ))}
                        </div>
                    </Card>
                </motion.div>
            )}
        </div>
    )
}
