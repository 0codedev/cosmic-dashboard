"use client"

import { useState, useMemo, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Calendar, Info, X } from "lucide-react"
import { useAstrologyStore } from "@/stores/astrology-store"
import { calculateMonthlyTransits, DailyCosmicScore } from "@/lib/transit-engine"
import { getNakshatra } from "@/lib/cosmic-engine"

export default function TransitHeatmap() {
    const { userData } = useAstrologyStore()
    const [currentDate, setCurrentDate] = useState(new Date())
    const [selectedDay, setSelectedDay] = useState<DailyCosmicScore | null>(null)
    const [heatmapData, setHeatmapData] = useState<DailyCosmicScore[]>([])

    // Memoize Natal Data required for calculation
    const natalMoonLon = useMemo(() => {
        if (!userData?.planetaryPositions?.moon) return 0;
        return userData.planetaryPositions.moon.absoluteLongitude || 0;
    }, [userData]);

    const natalNakshatraIndex = useMemo(() => {
        if (!userData?.planetaryPositions?.moon) return 0;
        // Re-calculate generic nakshatra index from longitude if not directly stored as index
        // Or specific lookup. userData.nakshatra is string "Name, Pada 1".
        const nakName = userData.nakshatra?.split(',')[0];
        const standardOrder = [
            "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra", "Punarvasu", "Pushya", "Ashlesha",
            "Magha", "Purva Phalguni", "Uttara Phalguni", "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha",
            "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha", "Purva Bhadrapada", "Uttara Bhadrapada", "Revati"
        ];
        return standardOrder.indexOf(nakName);
    }, [userData]);

    useEffect(() => {
        if (userData && natalNakshatraIndex !== -1) {
            const data = calculateMonthlyTransits(
                currentDate.getFullYear(),
                currentDate.getMonth(),
                natalMoonLon,
                natalNakshatraIndex
            );
            setHeatmapData(data);
        }
    }, [currentDate, userData, natalMoonLon, natalNakshatraIndex]);

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    }

    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    }

    const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    // Pad empty days at start of month
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
    const emptyDays = Array(firstDayOfMonth).fill(null);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-purple-400" />
                        Cosmic Weather
                    </h2>
                    <p className="text-sm text-gray-400">Your personalized daily energy forecast</p>
                </div>
                <div className="flex items-center gap-2 bg-slate-800 rounded-lg p-1">
                    <Button variant="ghost" size="icon" onClick={prevMonth} className="h-8 w-8 text-gray-400 hover:text-white">
                        <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <span className="min-w-[120px] text-center text-sm font-medium text-white">{monthName}</span>
                    <Button variant="ghost" size="icon" onClick={nextMonth} className="h-8 w-8 text-gray-400 hover:text-white">
                        <ChevronRight className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            {/* Heatmap Grid */}
            <div className="grid grid-cols-7 gap-2">
                {daysOfWeek.map(d => (
                    <div key={d} className="text-center text-xs text-gray-500 font-medium py-2">
                        {d}
                    </div>
                ))}

                {emptyDays.map((_, i) => (
                    <div key={`empty-${i}`} className="aspect-square" />
                ))}

                {heatmapData.map((day, idx) => (
                    <motion.div
                        key={idx}
                        whileHover={{ scale: 1.1, zIndex: 10 }}
                        onClick={() => setSelectedDay(day)}
                        className={`
                            aspect-square rounded-lg cursor-pointer relative group
                            ${day.color} bg-opacity-20 hover:bg-opacity-40 transition-all border border-transparent hover:border-white/20
                        `}
                    >
                        <span className="absolute top-1 left-1 text-xs text-white/50 group-hover:text-white">
                            {day.date.getDate()}
                        </span>

                        {/* Tooltip-like popup on hover (optional, using click modal usually better for mobile) */}
                    </motion.div>
                ))}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-4 text-xs text-gray-400">
                <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-emerald-500"></div> Excellent</div>
                <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-green-500"></div> Good</div>
                <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-slate-500"></div> Average</div>
                <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-amber-500"></div> Caution</div>
                <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-red-600"></div> Stress</div>
            </div>

            {/* Selected Day Details Modal */}
            <AnimatePresence>
                {selectedDay && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setSelectedDay(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-slate-900 border border-purple-500/30 rounded-xl max-w-md w-full p-6 shadow-2xl"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-2xl font-bold text-white">
                                        {selectedDay.date.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
                                    </h3>
                                    <Badge className={`${selectedDay.color} border-none text-white mt-1`}>
                                        {selectedDay.summary}
                                    </Badge>
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => setSelectedDay(null)}>
                                    <X className="w-5 h-5" />
                                </Button>
                            </div>

                            <div className="space-y-4">
                                <div className="bg-slate-800/50 rounded-lg p-4">
                                    <h4 className="text-sm font-semibold text-purple-400 mb-2">Daily Influences</h4>
                                    <ul className="space-y-2">
                                        {selectedDay.details.map((detail, i) => (
                                            <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                                                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-purple-400 shrink-0"></span>
                                                {detail}
                                            </li>
                                        ))}
                                        {selectedDay.details.length === 0 && (
                                            <li className="text-sm text-gray-500 italic">No major astrological events today. A steady day.</li>
                                        )}
                                    </ul>
                                </div>

                                <div className="text-xs text-center text-gray-500">
                                    Tip: Use high-energy days for important meetings and caution days for introspection.
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
