"use client"

import { useState, useEffect, useMemo } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import {
    Wrench, Clock, Calendar, Moon, Star, Download,
    Sun, Sunrise, Sunset, Play, FileText, Calculator,
    AlertTriangle, CheckCircle, Zap
} from "lucide-react"
import { RahuKaalWidget, HoraCalculator } from "@/components/auspicious-timings"
import MuhurtaFinder from "@/components/muhurta-finder"
import ComprehensiveReports from "@/components/comprehensive-reports"
import {
    getPanchangTimings,
    getCurrentHora,
    getHoraSequence,
    getInauspiciousTimeline,
    isInauspiciousNow,
    getSunriseSunset
} from "@/lib/panchang-engine"

// Panchang Data
function getPanchangData() {
    const now = new Date()
    const day = now.getDate()
    const month = now.getMonth()
    const year = now.getFullYear()

    // Tithi calculation (simplified)
    const totalDays = Math.floor((now.getTime() - new Date(2000, 0, 6).getTime()) / (1000 * 60 * 60 * 24))
    const moonCycle = totalDays % 29.53
    const tithiIndex = Math.floor(moonCycle / 1.96) + 1

    const tithis = [
        "Pratipada", "Dwitiya", "Tritiya", "Chaturthi", "Panchami",
        "Shashthi", "Saptami", "Ashtami", "Navami", "Dashami",
        "Ekadashi", "Dwadashi", "Trayodashi", "Chaturdashi",
        moonCycle < 14.76 ? "Purnima" : "Amavasya"
    ]

    const paksha = moonCycle < 14.76 ? "Shukla Paksha" : "Krishna Paksha"
    const tithi = tithis[Math.min(tithiIndex - 1, 14)]

    // Nakshatra calculation (simplified)
    const nakshatras = [
        "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra",
        "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni",
        "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha",
        "Moola", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta",
        "Shatabhisha", "Purva Bhadrapada", "Uttara Bhadrapada", "Revati"
    ]
    const nakshatraIndex = Math.floor((totalDays / 1.0125) % 27)
    const nakshatra = nakshatras[nakshatraIndex]

    // Yoga calculation (simplified)
    const yogas = [
        "Vishkumbha", "Priti", "Ayushman", "Saubhagya", "Shobhana",
        "Atiganda", "Sukarma", "Dhriti", "Shoola", "Ganda",
        "Vriddhi", "Dhruva", "Vyaghata", "Harshana", "Vajra",
        "Siddhi", "Vyatipata", "Variyana", "Parigha", "Shiva",
        "Siddha", "Sadhya", "Shubha", "Shukla", "Brahma",
        "Indra", "Vaidhriti"
    ]
    const yogaIndex = Math.floor((totalDays / 1.08) % 27)
    const yoga = yogas[yogaIndex]

    // Karana calculation
    const karanas = ["Bava", "Balava", "Kaulava", "Taitila", "Garija", "Vanija", "Vishti"]
    const karanaIndex = Math.floor((moonCycle * 2) % 7)
    const karana = karanas[karanaIndex]

    // Vara (day of week)
    const varas = ["Ravivara", "Somavara", "Mangalavara", "Budhavara", "Guruvara", "Shukravara", "Shanivara"]
    const vara = varas[now.getDay()]

    return { tithi, nakshatra, yoga, karana, vara, paksha }
}

// Muhurta calculation
function getCurrentMuhurta() {
    const now = new Date()
    const hours = now.getHours()
    const minutes = now.getMinutes()
    const totalMinutes = hours * 60 + minutes

    // Each muhurta is approximately 48 minutes (30 muhurtas in a day)
    const muhurtaIndex = Math.floor(totalMinutes / 48)

    const muhurtas = [
        { name: "Rudra", nature: "inauspicious", deity: "Rudra" },
        { name: "Ahi", nature: "inauspicious", deity: "Serpent" },
        { name: "Mitra", nature: "auspicious", deity: "Sun" },
        { name: "Pitru", nature: "mixed", deity: "Ancestors" },
        { name: "Vasu", nature: "auspicious", deity: "Vasus" },
        { name: "Vara", nature: "auspicious", deity: "Water" },
        { name: "Vishwadeva", nature: "auspicious", deity: "Vishwadevas" },
        { name: "Vidhi", nature: "auspicious", deity: "Brahma" },
        { name: "Satmukhi", nature: "auspicious", deity: "Skanda" },
        { name: "Puruhuta", nature: "auspicious", deity: "Indra" },
        { name: "Vahini", nature: "inauspicious", deity: "Fire" },
        { name: "Naktanakara", nature: "inauspicious", deity: "Moon" },
        { name: "Varuna", nature: "auspicious", deity: "Varuna" },
        { name: "Aryaman", nature: "auspicious", deity: "Aryaman" },
        { name: "Bhaga", nature: "auspicious", deity: "Bhaga" },
        { name: "Girisha", nature: "inauspicious", deity: "Shiva" },
        { name: "Ajapada", nature: "inauspicious", deity: "Aja" },
        { name: "Ahirbudhnya", nature: "auspicious", deity: "Serpent" },
        { name: "Pusha", nature: "auspicious", deity: "Pushan" },
        { name: "Ashwini", nature: "auspicious", deity: "Ashwini Kumaras" },
        { name: "Yama", nature: "inauspicious", deity: "Yama" },
        { name: "Agni", nature: "auspicious", deity: "Agni" },
        { name: "Vidhatr", nature: "auspicious", deity: "Vidhata" },
        { name: "Chanda", nature: "auspicious", deity: "Sun" },
        { name: "Aditi", nature: "auspicious", deity: "Aditi" },
        { name: "Jiwa", nature: "auspicious", deity: "Jupiter" },
        { name: "Vishnu", nature: "auspicious", deity: "Vishnu" },
        { name: "Dyumadgadyuti", nature: "auspicious", deity: "Sun" },
        { name: "Brahma", nature: "auspicious", deity: "Brahma" },
        { name: "Samudram", nature: "mixed", deity: "Ocean" }
    ]

    const current = muhurtas[muhurtaIndex % 30]
    const startTime = new Date(now)
    startTime.setHours(Math.floor((muhurtaIndex * 48) / 60), (muhurtaIndex * 48) % 60, 0)
    const endTime = new Date(startTime.getTime() + 48 * 60 * 1000)

    return {
        ...current,
        startTime: startTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        endTime: endTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    }
}

// Sunrise/Sunset calculation (approximate for Hyderabad)
function getSunTimes() {
    const now = new Date()
    const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24))

    // Approximate calculations for latitude 17.38°N
    const sunriseBase = 6 // base sunrise hour
    const sunsetBase = 18 // base sunset hour
    const variation = Math.sin((dayOfYear - 80) * (Math.PI / 182.5)) * 0.5

    const sunriseHour = sunriseBase - variation
    const sunsetHour = sunsetBase + variation

    return {
        sunrise: `${Math.floor(sunriseHour)}:${String(Math.floor((sunriseHour % 1) * 60)).padStart(2, '0')} AM`,
        sunset: `${Math.floor(sunsetHour - 12)}:${String(Math.floor((sunsetHour % 1) * 60)).padStart(2, '0')} PM`
    }
}

export default function ToolsPanel() {
    const [activeCalculator, setActiveCalculator] = useState<string | null>(null)
    const [currentTime, setCurrentTime] = useState(new Date())
    const panchang = getPanchangData()
    const muhurta = getCurrentMuhurta()
    const sunTimes = getSunTimes()

    // Update current time every minute for real-time hora
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date())
        }, 60000) // Update every minute
        return () => clearInterval(interval)
    }, [])

    // Get real-time panchang timings from engine
    const panchangTimings = useMemo(() => getPanchangTimings(currentTime), [currentTime])
    const currentHora = useMemo(() => getCurrentHora(currentTime), [currentTime])
    const horaSequence = useMemo(() => getHoraSequence(currentTime), [currentTime])
    const inauspiciousTimeline = useMemo(() => getInauspiciousTimeline(currentTime), [currentTime])
    const inauspiciousStatus = useMemo(() => isInauspiciousNow(currentTime), [currentTime])
    const { sunrise, sunset } = useMemo(() => getSunriseSunset(currentTime), [currentTime])

    const tools = [
        {
            id: 'panchang',
            name: 'Daily Panchang',
            icon: <Calendar className="w-5 h-5" />,
            color: 'cyan',
            description: "Today's tithi, nakshatra, yoga, karana"
        },
        {
            id: 'muhurta',
            name: 'Muhurta Finder',
            icon: <Clock className="w-5 h-5" />,
            color: 'yellow',
            description: 'Current auspicious timing'
        },
        {
            id: 'nakshatra',
            name: 'Nakshatra Finder',
            icon: <Star className="w-5 h-5" />,
            color: 'purple',
            description: 'Find nakshatra for any date'
        },
        {
            id: 'sunmoon',
            name: 'Sun & Moon Times',
            icon: <Sun className="w-5 h-5" />,
            color: 'orange',
            description: 'Sunrise, sunset, moonrise'
        }
    ]

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-4"
            >
                <h2 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
                    Astrological Tools
                </h2>
                <p className="text-gray-300 max-w-2xl mx-auto">
                    Advanced calculators and utilities for Vedic astrology analysis
                </p>
            </motion.div>

            {/* Quick Tools Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {tools.map((tool, i) => (
                    <motion.div
                        key={tool.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                    >
                        <Card
                            className={`bg-gradient-to-br from-slate-800/50 to-${tool.color}-900/20 border-${tool.color}-500/30 p-4 backdrop-blur-sm cursor-pointer hover:border-${tool.color}-400/50 transition-all`}
                            onClick={() => setActiveCalculator(activeCalculator === tool.id ? null : tool.id)}
                        >
                            <div className="flex items-center space-x-3">
                                <div className={`w-10 h-10 bg-${tool.color}-500/20 rounded-full flex items-center justify-center text-${tool.color}-400`}>
                                    {tool.icon}
                                </div>
                                <div>
                                    <h4 className="font-semibold text-white text-sm">{tool.name}</h4>
                                    <p className="text-xs text-gray-400">{tool.description}</p>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Panchang Display - Always Visible */}
            <Card className="bg-gradient-to-br from-cyan-900/30 via-slate-900/50 to-blue-900/30 border-cyan-500/30 p-6 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-cyan-400 flex items-center">
                        <Calendar className="w-5 h-5 mr-2" />
                        Today's Panchang
                    </h3>
                    <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
                        {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                    </Badge>
                </div>

                <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
                    <div className="text-center p-3 bg-slate-800/30 rounded-xl border border-cyan-500/20">
                        <span className="text-xs text-gray-400 block mb-1">Tithi</span>
                        <span className="text-sm font-semibold text-cyan-300">{panchang.tithi}</span>
                        <span className="text-xs text-cyan-400/70 block">{panchang.paksha}</span>
                    </div>
                    <div className="text-center p-3 bg-slate-800/30 rounded-xl border border-purple-500/20">
                        <span className="text-xs text-gray-400 block mb-1">Nakshatra</span>
                        <span className="text-sm font-semibold text-purple-300">{panchang.nakshatra}</span>
                    </div>
                    <div className="text-center p-3 bg-slate-800/30 rounded-xl border border-yellow-500/20">
                        <span className="text-xs text-gray-400 block mb-1">Yoga</span>
                        <span className="text-sm font-semibold text-yellow-300">{panchang.yoga}</span>
                    </div>
                    <div className="text-center p-3 bg-slate-800/30 rounded-xl border border-green-500/20">
                        <span className="text-xs text-gray-400 block mb-1">Karana</span>
                        <span className="text-sm font-semibold text-green-300">{panchang.karana}</span>
                    </div>
                    <div className="text-center p-3 bg-slate-800/30 rounded-xl border border-orange-500/20">
                        <span className="text-xs text-gray-400 block mb-1">Vara</span>
                        <span className="text-sm font-semibold text-orange-300">{panchang.vara}</span>
                    </div>
                    <div className="text-center p-3 bg-slate-800/30 rounded-xl border border-rose-500/20">
                        <span className="text-xs text-gray-400 block mb-1">Current Muhurta</span>
                        <span className="text-sm font-semibold text-rose-300">{muhurta.name}</span>
                        <span className={`text-xs block ${muhurta.nature === 'auspicious' ? 'text-green-400' : muhurta.nature === 'inauspicious' ? 'text-red-400' : 'text-yellow-400'}`}>
                            {muhurta.nature}
                        </span>
                    </div>
                </div>
            </Card>

            {/* Muhurta Details */}
            <div className="grid md:grid-cols-2 gap-6">
                <Card className="bg-gradient-to-br from-yellow-900/30 via-slate-900/50 to-orange-900/30 border-yellow-500/30 p-6 backdrop-blur-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="font-bold text-yellow-400 flex items-center">
                            <Clock className="w-4 h-4 mr-2" />
                            Current Muhurta
                        </h4>
                        <Badge className={`${muhurta.nature === 'auspicious' ? 'bg-green-500/20 text-green-400 border-green-500/30' : muhurta.nature === 'inauspicious' ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'}`}>
                            {muhurta.nature.charAt(0).toUpperCase() + muhurta.nature.slice(1)}
                        </Badge>
                    </div>
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <span className="text-gray-400 text-sm">Muhurta Name:</span>
                            <span className="text-white font-semibold">{muhurta.name}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400 text-sm">Ruling Deity:</span>
                            <span className="text-yellow-300">{muhurta.deity}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400 text-sm">Time Window:</span>
                            <span className="text-cyan-300">{muhurta.startTime} - {muhurta.endTime}</span>
                        </div>
                    </div>
                </Card>

                <Card className="bg-gradient-to-br from-orange-900/30 via-slate-900/50 to-rose-900/30 border-orange-500/30 p-6 backdrop-blur-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="font-bold text-orange-400 flex items-center">
                            <Sun className="w-4 h-4 mr-2" />
                            Sun & Moon Times
                        </h4>
                        <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">
                            Hyderabad
                        </Badge>
                    </div>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-400 text-sm flex items-center">
                                <Sunrise className="w-4 h-4 mr-2 text-yellow-400" />
                                Sunrise:
                            </span>
                            <span className="text-yellow-300 font-semibold">{sunTimes.sunrise}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-400 text-sm flex items-center">
                                <Sunset className="w-4 h-4 mr-2 text-orange-400" />
                                Sunset:
                            </span>
                            <span className="text-orange-300 font-semibold">{sunTimes.sunset}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-400 text-sm flex items-center">
                                <Moon className="w-4 h-4 mr-2 text-blue-400" />
                                Day Length:
                            </span>
                            <span className="text-blue-300 font-semibold">~12h 5m</span>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Auspicious Activities */}
            <Card className="bg-gradient-to-br from-green-900/30 via-slate-900/50 to-emerald-900/30 border-green-500/30 p-6 backdrop-blur-sm">
                <h4 className="font-bold text-green-400 mb-4 flex items-center">
                    <Wrench className="w-4 h-4 mr-2" />
                    Recommended Activities for Today
                </h4>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
                    {[
                        { activity: "Spiritual practices", suitable: true },
                        { activity: "New ventures", suitable: muhurta.nature === 'auspicious' },
                        { activity: "Travel", suitable: true },
                        { activity: "Important meetings", suitable: muhurta.nature !== 'inauspicious' },
                        { activity: "Financial decisions", suitable: panchang.yoga !== 'Vyatipata' },
                        { activity: "Medical procedures", suitable: false },
                        { activity: "Learning/Education", suitable: true },
                        { activity: "Celebrations", suitable: true }
                    ].map((item, i) => (
                        <div
                            key={i}
                            className={`flex items-center p-2 rounded-lg ${item.suitable ? 'bg-green-500/10 border border-green-500/20' : 'bg-red-500/10 border border-red-500/20'}`}
                        >
                            <span className={`w-2 h-2 rounded-full mr-2 ${item.suitable ? 'bg-green-400' : 'bg-red-400'}`} />
                            <span className={`text-sm ${item.suitable ? 'text-green-300' : 'text-red-300'}`}>
                                {item.activity}
                            </span>
                        </div>
                    ))}
                </div>
            </Card>

            {/* Inauspicious Periods Timeline - NEW */}
            <Card className="bg-gradient-to-br from-red-900/30 via-slate-900/50 to-orange-900/30 border-red-500/30 p-6 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-4">
                    <h4 className="font-bold text-red-400 flex items-center">
                        <AlertTriangle className="w-4 h-4 mr-2" />
                        Inauspicious Periods Today
                    </h4>
                    {inauspiciousStatus.isInauspicious ? (
                        <Badge className="bg-red-500/20 text-red-400 border-red-500/30 animate-pulse">
                            ⚠️ {inauspiciousStatus.period?.name} Active
                        </Badge>
                    ) : (
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                            <CheckCircle className="w-3 h-3 mr-1" /> Safe Time
                        </Badge>
                    )}
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                    {/* Rahukaal */}
                    <div className={`p-4 rounded-xl border ${panchangTimings.rahukaal.isActive ? 'bg-red-500/20 border-red-500/50' : 'bg-slate-800/30 border-red-500/20'}`}>
                        <div className="flex items-center justify-between mb-2">
                            <span className="font-semibold text-red-400">Rahukaal</span>
                            {panchangTimings.rahukaal.isActive && (
                                <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
                            )}
                        </div>
                        <p className="text-white font-mono text-lg">
                            {panchangTimings.rahukaal.startTime} - {panchangTimings.rahukaal.endTime}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">Avoid new ventures</p>
                    </div>

                    {/* Yamagandam */}
                    <div className={`p-4 rounded-xl border ${panchangTimings.yamagandam.isActive ? 'bg-orange-500/20 border-orange-500/50' : 'bg-slate-800/30 border-orange-500/20'}`}>
                        <div className="flex items-center justify-between mb-2">
                            <span className="font-semibold text-orange-400">Yamagandam</span>
                            {panchangTimings.yamagandam.isActive && (
                                <span className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" />
                            )}
                        </div>
                        <p className="text-white font-mono text-lg">
                            {panchangTimings.yamagandam.startTime} - {panchangTimings.yamagandam.endTime}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">Very inauspicious</p>
                    </div>

                    {/* Gulika Kalam */}
                    <div className={`p-4 rounded-xl border ${panchangTimings.gulikaKalam.isActive ? 'bg-purple-500/20 border-purple-500/50' : 'bg-slate-800/30 border-purple-500/20'}`}>
                        <div className="flex items-center justify-between mb-2">
                            <span className="font-semibold text-purple-400">Gulika Kalam</span>
                            {panchangTimings.gulikaKalam.isActive && (
                                <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
                            )}
                        </div>
                        <p className="text-white font-mono text-lg">
                            {panchangTimings.gulikaKalam.startTime} - {panchangTimings.gulikaKalam.endTime}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">Saturn's influence</p>
                    </div>
                </div>

                {/* Abhijit Muhurta (Best Time) */}
                <div className="mt-4 p-4 bg-green-500/10 rounded-xl border border-green-500/30">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                            <div>
                                <span className="font-semibold text-green-400">Abhijit Muhurta</span>
                                <span className="text-gray-400 text-sm ml-2">(Best time for new beginnings)</span>
                            </div>
                        </div>
                        <span className="text-green-300 font-mono text-lg">
                            {panchangTimings.abhijitMuhurta.startTime} - {panchangTimings.abhijitMuhurta.endTime}
                        </span>
                    </div>
                </div>
            </Card>

            {/* Planetary Hora Clock - NEW */}
            <Card className="bg-gradient-to-br from-indigo-900/30 via-slate-900/50 to-purple-900/30 border-indigo-500/30 p-6 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-6">
                    <h4 className="font-bold text-indigo-400 flex items-center">
                        <Zap className="w-4 h-4 mr-2" />
                        Planetary Hora Clock
                    </h4>
                    <Badge className="bg-indigo-500/20 text-indigo-400 border-indigo-500/30">
                        Live Updates
                    </Badge>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Current Hora */}
                    <div className={`p-6 rounded-xl bg-gradient-to-br from-${currentHora.color}-500/20 to-slate-800/30 border border-${currentHora.color}-500/30`}>
                        <div className="text-center space-y-3">
                            <div className="text-5xl">{currentHora.planetSymbol}</div>
                            <div>
                                <h5 className={`text-2xl font-bold text-${currentHora.color}-400`}>
                                    {currentHora.planet} Hora
                                </h5>
                                <p className="text-gray-400 font-mono">
                                    {currentHora.startTime} - {currentHora.endTime}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs text-gray-400">Suitable for:</p>
                                <div className="flex flex-wrap gap-1 justify-center">
                                    {currentHora.activities.slice(0, 3).map((activity, i) => (
                                        <Badge key={i} className={`bg-${currentHora.color}-500/20 text-${currentHora.color}-300 border-${currentHora.color}-500/30 text-xs`}>
                                            {activity}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Upcoming Horas */}
                    <div className="space-y-3">
                        <h5 className="text-sm font-semibold text-gray-300">Upcoming Horas</h5>
                        {horaSequence.filter(h => h.start > new Date()).slice(0, 4).map((hora, i) => (
                            <div key={i} className="flex items-center justify-between p-2 bg-slate-800/30 rounded-lg border border-slate-700/30">
                                <div className="flex items-center">
                                    <span className="text-lg mr-2">{hora.planetSymbol}</span>
                                    <span className={`text-${hora.color}-400 font-medium text-sm`}>{hora.planet}</span>
                                </div>
                                <span className="text-gray-400 text-xs font-mono">
                                    {hora.startTime} - {hora.endTime}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </Card>

            {/* Rahu Kaal & Hora Calculators */}
            <div className="grid md:grid-cols-2 gap-6">
                <RahuKaalWidget />
                <HoraCalculator />
            </div>

            {/* Enhanced Muhurta Finder */}
            <MuhurtaFinder />
        </div>
    )
}
