"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    Sun,
    Moon,
    Star,
    Heart,
    Briefcase,
    Wallet,
    Activity,
    Compass,
    RefreshCw
} from "lucide-react"

interface DailyPrediction {
    area: string
    icon: React.ReactNode
    rating: number // 1-5
    prediction: string
}

interface DailyHoroscope {
    date: string
    moonSign: string
    nakshatra: string
    overallRating: number
    luckyNumber: number
    luckyColor: string
    luckyDirection: string
    luckyTime: string
    mantra: string
    predictions: DailyPrediction[]
    dosAndDonts: {
        dos: string[]
        donts: string[]
    }
}

// Generate daily horoscope based on current date
function generateDailyHoroscope(): DailyHoroscope {
    const today = new Date()
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000)

    // Pseudo-random based on date for consistency throughout the day
    const seed = dayOfYear + today.getFullYear()
    const random = (min: number, max: number) => min + ((seed * 9301 + 49297) % 233280) / 233280 * (max - min)

    const colors = ["Red", "Blue", "Green", "Yellow", "White", "Orange", "Purple", "Pink"]
    const directions = ["North", "South", "East", "West", "North-East", "South-West"]
    const times = ["6:00 AM - 8:00 AM", "10:00 AM - 12:00 PM", "2:00 PM - 4:00 PM", "6:00 PM - 8:00 PM"]

    const predictions: DailyPrediction[] = [
        {
            area: "Career",
            icon: <Briefcase className="w-4 h-4" />,
            rating: Math.floor(random(3, 5.9)),
            prediction: dayOfYear % 2 === 0
                ? "Favorable day for professional growth. New opportunities may arise."
                : "Focus on completing pending tasks. Avoid major decisions."
        },
        {
            area: "Love",
            icon: <Heart className="w-4 h-4" />,
            rating: Math.floor(random(3, 5.9)),
            prediction: dayOfYear % 3 === 0
                ? "Romance is in the air. Express your feelings openly."
                : "Nurture existing relationships. Quality time matters today."
        },
        {
            area: "Finance",
            icon: <Wallet className="w-4 h-4" />,
            rating: Math.floor(random(2, 5.9)),
            prediction: dayOfYear % 2 === 0
                ? "Good day for investments. Financial gains possible."
                : "Be cautious with expenses. Avoid impulsive purchases."
        },
        {
            area: "Health",
            icon: <Activity className="w-4 h-4" />,
            rating: Math.floor(random(3, 5.9)),
            prediction: dayOfYear % 2 === 0
                ? "Energy levels are high. Great day for exercise."
                : "Take time to rest. Listen to your body's signals."
        },
    ]

    return {
        date: today.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
        moonSign: "Aquarius",
        nakshatra: "Shatabhisha",
        overallRating: Math.floor(random(3.5, 4.9)),
        luckyNumber: Math.floor(random(1, 9)),
        luckyColor: colors[dayOfYear % colors.length],
        luckyDirection: directions[dayOfYear % directions.length],
        luckyTime: times[dayOfYear % times.length],
        mantra: "Om Shree Varunaaya Namaha",
        predictions,
        dosAndDonts: {
            dos: [
                "Start new projects during auspicious hora",
                "Wear " + colors[dayOfYear % colors.length].toLowerCase() + " for positive energy",
                "Meditate facing " + directions[dayOfYear % directions.length],
                "Donate to the needy for karmic blessings"
            ],
            donts: [
                "Avoid major financial decisions during Rahu Kaal",
                "Don't travel in inauspicious direction",
                "Avoid conflicts and arguments",
                "Don't start new ventures after sunset"
            ]
        }
    }
}

export default function DailyHoroscope() {
    const [horoscope, setHoroscope] = useState<DailyHoroscope | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        // Simulate loading
        setTimeout(() => {
            setHoroscope(generateDailyHoroscope())
            setIsLoading(false)
        }, 500)
    }, [])

    const handleRefresh = () => {
        setIsLoading(true)
        setTimeout(() => {
            setHoroscope(generateDailyHoroscope())
            setIsLoading(false)
        }, 500)
    }

    const getRatingStars = (rating: number) => {
        return [...Array(5)].map((_, i) => (
            <Star
                key={i}
                className={`w-3 h-3 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`}
            />
        ))
    }

    const getRatingColor = (rating: number) => {
        if (rating >= 4) return "text-green-400"
        if (rating >= 3) return "text-yellow-400"
        return "text-red-400"
    }

    if (isLoading || !horoscope) {
        return (
            <Card className="bg-gradient-to-br from-amber-900/30 to-slate-900/50 border-amber-500/30 p-6 animate-pulse">
                <div className="h-6 bg-slate-700 rounded w-1/3 mb-4"></div>
                <div className="h-4 bg-slate-700 rounded w-full mb-2"></div>
                <div className="h-4 bg-slate-700 rounded w-2/3"></div>
            </Card>
        )
    }

    return (
        <Card className="bg-gradient-to-br from-amber-900/30 to-slate-900/50 border-amber-500/30 p-6 relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-500/10 to-transparent rounded-full blur-2xl" />

            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-500/20 rounded-full">
                        <Sun className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                        <h3 className="font-bold text-white">Daily Horoscope</h3>
                        <p className="text-xs text-gray-400">{horoscope.date}</p>
                    </div>
                </div>
                <button
                    onClick={handleRefresh}
                    className="p-2 hover:bg-slate-700/50 rounded-full transition-colors"
                >
                    <RefreshCw className="w-4 h-4 text-gray-400" />
                </button>
            </div>

            {/* Moon Sign & Nakshatra */}
            <div className="flex items-center gap-2 mb-4">
                <Badge className="bg-cyan-500/20 text-cyan-400">
                    <Moon className="w-3 h-3 mr-1" />
                    {horoscope.moonSign}
                </Badge>
                <Badge className="bg-purple-500/20 text-purple-400">
                    <Star className="w-3 h-3 mr-1" />
                    {horoscope.nakshatra}
                </Badge>
                <div className="flex items-center ml-auto">
                    {getRatingStars(horoscope.overallRating)}
                </div>
            </div>

            {/* Lucky Items */}
            <div className="grid grid-cols-4 gap-2 mb-4">
                <div className="text-center p-2 bg-slate-800/50 rounded-lg">
                    <div className="text-lg font-bold text-amber-400">{horoscope.luckyNumber}</div>
                    <div className="text-xs text-gray-500">Number</div>
                </div>
                <div className="text-center p-2 bg-slate-800/50 rounded-lg">
                    <div className="text-sm font-bold text-pink-400">{horoscope.luckyColor}</div>
                    <div className="text-xs text-gray-500">Color</div>
                </div>
                <div className="text-center p-2 bg-slate-800/50 rounded-lg">
                    <Compass className="w-4 h-4 mx-auto text-cyan-400 mb-1" />
                    <div className="text-xs text-gray-500">{horoscope.luckyDirection}</div>
                </div>
                <div className="text-center p-2 bg-slate-800/50 rounded-lg">
                    <div className="text-xs font-medium text-green-400">{horoscope.luckyTime.split(" - ")[0]}</div>
                    <div className="text-xs text-gray-500">Lucky Time</div>
                </div>
            </div>

            {/* Area Predictions */}
            <div className="space-y-2 mb-4">
                {horoscope.predictions.map((pred, idx) => (
                    <motion.div
                        key={pred.area}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="flex items-center gap-3 p-2 bg-slate-800/30 rounded-lg"
                    >
                        <div className="p-1.5 bg-amber-500/20 rounded text-amber-400">
                            {pred.icon}
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center justify-between mb-0.5">
                                <span className="text-xs font-medium text-white">{pred.area}</span>
                                <div className="flex">{getRatingStars(pred.rating)}</div>
                            </div>
                            <p className="text-xs text-gray-400 line-clamp-1">{pred.prediction}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Mantra */}
            <div className="text-center p-3 bg-gradient-to-r from-orange-900/20 to-amber-900/20 rounded-lg border border-amber-500/20">
                <div className="text-xs text-gray-400 mb-1">Today's Mantra</div>
                <div className="text-sm font-sanskrit text-amber-300">{horoscope.mantra}</div>
            </div>
        </Card>
    )
}
