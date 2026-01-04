"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    Clock,
    AlertTriangle,
    CheckCircle2,
    Sun,
    Moon
} from "lucide-react"

interface HoraInfo {
    planet: string
    symbol: string
    startTime: string
    endTime: string
    nature: "auspicious" | "inauspicious" | "mixed"
    activities: string[]
}

interface RahuKaalInfo {
    day: string
    startTime: string
    endTime: string
    isActive: boolean
}

// Rahu Kaal timings (based on sunrise at 6:00 AM)
const RAHU_KAAL_DATA: { [key: number]: { start: number; end: number } } = {
    0: { start: 16.5, end: 18 },    // Sunday: 4:30 PM - 6:00 PM
    1: { start: 7.5, end: 9 },      // Monday: 7:30 AM - 9:00 AM
    2: { start: 15, end: 16.5 },    // Tuesday: 3:00 PM - 4:30 PM
    3: { start: 12, end: 13.5 },    // Wednesday: 12:00 PM - 1:30 PM
    4: { start: 13.5, end: 15 },    // Thursday: 1:30 PM - 3:00 PM
    5: { start: 10.5, end: 12 },    // Friday: 10:30 AM - 12:00 PM
    6: { start: 9, end: 10.5 }      // Saturday: 9:00 AM - 10:30 AM
}

// Planetary Hours (Hora) sequence from sunrise
const HORA_SEQUENCE: { [key: number]: string[] } = {
    0: ["Sun", "Venus", "Mercury", "Moon", "Saturn", "Jupiter", "Mars"], // Sunday
    1: ["Moon", "Saturn", "Jupiter", "Mars", "Sun", "Venus", "Mercury"], // Monday
    2: ["Mars", "Sun", "Venus", "Mercury", "Moon", "Saturn", "Jupiter"], // Tuesday
    3: ["Mercury", "Moon", "Saturn", "Jupiter", "Mars", "Sun", "Venus"], // Wednesday
    4: ["Jupiter", "Mars", "Sun", "Venus", "Mercury", "Moon", "Saturn"], // Thursday
    5: ["Venus", "Mercury", "Moon", "Saturn", "Jupiter", "Mars", "Sun"], // Friday
    6: ["Saturn", "Jupiter", "Mars", "Sun", "Venus", "Mercury", "Moon"]  // Saturday
}

const PLANET_SYMBOLS: { [key: string]: string } = {
    "Sun": "☉",
    "Moon": "☽",
    "Mars": "♂",
    "Mercury": "☿",
    "Jupiter": "♃",
    "Venus": "♀",
    "Saturn": "♄"
}

const PLANET_NATURES: { [key: string]: "auspicious" | "inauspicious" | "mixed" } = {
    "Sun": "auspicious",
    "Moon": "auspicious",
    "Mars": "inauspicious",
    "Mercury": "mixed",
    "Jupiter": "auspicious",
    "Venus": "auspicious",
    "Saturn": "inauspicious"
}

const HORA_ACTIVITIES: { [key: string]: string[] } = {
    "Sun": ["Government work", "Authority matters", "Leadership tasks", "Father-related"],
    "Moon": ["Travel", "Public dealings", "Silver/pearl purchase", "Mother-related"],
    "Mars": ["Avoid new starts", "Physical work", "Competition", "Property disputes"],
    "Mercury": ["Business", "Communication", "Studies", "Writing", "Technology"],
    "Jupiter": ["Religious activities", "Learning", "Legal matters", "Finance"],
    "Venus": ["Marriage", "Relationships", "Arts", "Luxury purchases", "Beauty"],
    "Saturn": ["Avoid starts", "Iron/oil work", "Service", "Discipline"]
}

// Rahu Kaal Widget
export function RahuKaalWidget() {
    const [currentTime, setCurrentTime] = useState<Date | null>(null)
    const [rahuKaal, setRahuKaal] = useState<RahuKaalInfo | null>(null)

    useEffect(() => {
        const updateTime = () => {
            const now = new Date()
            setCurrentTime(now)

            const day = now.getDay()
            const timings = RAHU_KAAL_DATA[day]

            const currentHour = now.getHours() + now.getMinutes() / 60
            const isActive = currentHour >= timings.start && currentHour < timings.end

            const formatTime = (hour: number) => {
                const h = Math.floor(hour)
                const m = Math.round((hour - h) * 60)
                const ampm = h >= 12 ? "PM" : "AM"
                const displayH = h > 12 ? h - 12 : h === 0 ? 12 : h
                return `${displayH}:${m.toString().padStart(2, "0")} ${ampm}`
            }

            setRahuKaal({
                day: now.toLocaleDateString("en-US", { weekday: "long" }),
                startTime: formatTime(timings.start),
                endTime: formatTime(timings.end),
                isActive
            })
        }

        updateTime()
        const interval = setInterval(updateTime, 60000) // Update every minute
        return () => clearInterval(interval)
    }, [])

    if (!rahuKaal) return null

    return (
        <Card className={`p-4 ${rahuKaal.isActive ? 'bg-red-900/30 border-red-500/50' : 'bg-slate-800/50 border-purple-500/20'}`}>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${rahuKaal.isActive ? 'bg-red-500/20' : 'bg-purple-500/20'}`}>
                        <AlertTriangle className={`w-5 h-5 ${rahuKaal.isActive ? 'text-red-400' : 'text-purple-400'}`} />
                    </div>
                    <div>
                        <h3 className="font-semibold text-white">Rahu Kaal</h3>
                        <p className="text-xs text-gray-400">{rahuKaal.day}</p>
                    </div>
                </div>
                <div className="text-right">
                    <Badge className={rahuKaal.isActive ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}>
                        {rahuKaal.isActive ? 'Active Now' : 'Safe Period'}
                    </Badge>
                    <p className="text-sm text-gray-300 mt-1">
                        {rahuKaal.startTime} - {rahuKaal.endTime}
                    </p>
                </div>
            </div>
            {rahuKaal.isActive && (
                <p className="text-xs text-red-300 mt-3">
                    ⚠️ Avoid starting new important work during this time
                </p>
            )}
        </Card>
    )
}

// Hora Calculator Widget
export function HoraCalculator() {
    const [currentHora, setCurrentHora] = useState<HoraInfo | null>(null)
    const [allHoras, setAllHoras] = useState<HoraInfo[]>([])

    useEffect(() => {
        const calculateHoras = () => {
            const now = new Date()
            const day = now.getDay()
            const sunrise = 6 // Assuming 6 AM sunrise
            const hourLength = 1 // Each hora is approximately 1 hour

            const sequence = HORA_SEQUENCE[day]
            const currentHour = now.getHours()
            const hoursFromSunrise = currentHour - sunrise
            const currentHoraIndex = hoursFromSunrise >= 0 ? hoursFromSunrise % 7 : (7 + (hoursFromSunrise % 7)) % 7

            const formatTime = (hour: number) => {
                const ampm = hour >= 12 ? "PM" : "AM"
                const displayH = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour
                return `${displayH}:00 ${ampm}`
            }

            // Generate hora schedule
            const horas: HoraInfo[] = []
            for (let i = 0; i < 12; i++) {
                const startHour = (sunrise + i) % 24
                const endHour = (sunrise + i + 1) % 24
                const planet = sequence[i % 7]

                horas.push({
                    planet,
                    symbol: PLANET_SYMBOLS[planet],
                    startTime: formatTime(startHour),
                    endTime: formatTime(endHour),
                    nature: PLANET_NATURES[planet],
                    activities: HORA_ACTIVITIES[planet]
                })
            }

            setAllHoras(horas)
            setCurrentHora(horas[currentHoraIndex] || horas[0])
        }

        calculateHoras()
        const interval = setInterval(calculateHoras, 60000)
        return () => clearInterval(interval)
    }, [])

    if (!currentHora) return null

    const getNatureColor = (nature: string) => {
        switch (nature) {
            case "auspicious": return "text-green-400 bg-green-500/20"
            case "inauspicious": return "text-red-400 bg-red-500/20"
            default: return "text-amber-400 bg-amber-500/20"
        }
    }

    return (
        <Card className="bg-slate-800/50 border-purple-500/20 p-4">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-cyan-500/20 rounded-full">
                        <Clock className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-white">Planetary Hours (Hora)</h3>
                        <p className="text-xs text-gray-400">Current ruling planet</p>
                    </div>
                </div>
            </div>

            {/* Current Hora */}
            <div className="bg-slate-900/50 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <span className="text-3xl">{currentHora.symbol}</span>
                        <div>
                            <h4 className="font-semibold text-white">{currentHora.planet} Hora</h4>
                            <p className="text-xs text-gray-400">
                                {currentHora.startTime} - {currentHora.endTime}
                            </p>
                        </div>
                    </div>
                    <Badge className={getNatureColor(currentHora.nature)}>
                        {currentHora.nature === "auspicious" ? <CheckCircle2 className="w-3 h-3 mr-1" /> :
                            currentHora.nature === "inauspicious" ? <AlertTriangle className="w-3 h-3 mr-1" /> : null}
                        {currentHora.nature}
                    </Badge>
                </div>
                <div className="text-xs text-gray-300">
                    <span className="text-purple-400">Best for: </span>
                    {currentHora.activities.slice(0, 3).join(", ")}
                </div>
            </div>

            {/* Upcoming Horas */}
            <div>
                <h4 className="text-xs text-gray-400 mb-2">Upcoming Hours</h4>
                <div className="space-y-1">
                    {allHoras.slice(0, 5).map((hora, idx) => (
                        <div
                            key={idx}
                            className={`flex items-center justify-between p-2 rounded ${idx === 0 ? 'bg-purple-500/20' : 'bg-slate-800/50'}`}
                        >
                            <div className="flex items-center gap-2">
                                <span>{hora.symbol}</span>
                                <span className="text-sm text-white">{hora.planet}</span>
                            </div>
                            <span className="text-xs text-gray-400">{hora.startTime}</span>
                        </div>
                    ))}
                </div>
            </div>
        </Card>
    )
}

// Combined Timings Widget for Tools Tab
export function AuspiciousTimingsWidget() {
    return (
        <div className="space-y-4">
            <RahuKaalWidget />
            <HoraCalculator />
        </div>
    )
}
