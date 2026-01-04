"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Sparkles,
    Volume2,
    VolumeX,
    RefreshCw,
    Copy,
    CheckCircle2
} from "lucide-react"

interface MantraInfo {
    sanskrit: string
    transliteration: string
    meaning: string
    deity: string
    benefit: string
    chantCount: number
    bestTime: string
    dayOfWeek: string
}

const DAILY_MANTRAS: MantraInfo[] = [
    {
        sanskrit: "ॐ गं गणपतये नमः",
        transliteration: "Om Gam Ganapataye Namaha",
        meaning: "I bow to Lord Ganesha, remover of obstacles",
        deity: "Lord Ganesha",
        benefit: "Remove obstacles, new beginnings",
        chantCount: 108,
        bestTime: "Morning, before sunrise",
        dayOfWeek: "Monday"
    },
    {
        sanskrit: "ॐ नमः शिवाय",
        transliteration: "Om Namah Shivaya",
        meaning: "I bow to Lord Shiva, the auspicious one",
        deity: "Lord Shiva",
        benefit: "Inner peace, transformation",
        chantCount: 108,
        bestTime: "Evening twilight",
        dayOfWeek: "Monday"
    },
    {
        sanskrit: "ॐ श्रीं महालक्ष्म्यै नमः",
        transliteration: "Om Shreem Mahalakshmyai Namaha",
        meaning: "I bow to Goddess Lakshmi, bringer of prosperity",
        deity: "Goddess Lakshmi",
        benefit: "Wealth, abundance, prosperity",
        chantCount: 108,
        bestTime: "Friday evening",
        dayOfWeek: "Friday"
    },
    {
        sanskrit: "ॐ ग्रं ग्रीं ग्रौं सः गुरवे नमः",
        transliteration: "Om Gram Greem Groom Sah Gurave Namaha",
        meaning: "I bow to Jupiter, the divine teacher",
        deity: "Lord Brihaspati (Jupiter)",
        benefit: "Wisdom, knowledge, blessings",
        chantCount: 19,
        bestTime: "Thursday morning",
        dayOfWeek: "Thursday"
    },
    {
        sanskrit: "ॐ शं शनैश्चराय नमः",
        transliteration: "Om Sham Shanaishcharaya Namaha",
        meaning: "I bow to Saturn, lord of karma",
        deity: "Lord Shani (Saturn)",
        benefit: "Karmic relief, discipline",
        chantCount: 23,
        bestTime: "Saturday evening",
        dayOfWeek: "Saturday"
    },
    {
        sanskrit: "ॐ ऐं सरस्वत्यै नमः",
        transliteration: "Om Aim Saraswatyai Namaha",
        meaning: "I bow to Goddess Saraswati, goddess of knowledge",
        deity: "Goddess Saraswati",
        benefit: "Learning, creativity, speech",
        chantCount: 108,
        bestTime: "Early morning",
        dayOfWeek: "Wednesday"
    },
    {
        sanskrit: "ॐ सूर्याय नमः",
        transliteration: "Om Suryaya Namaha",
        meaning: "I bow to the Sun, source of life",
        deity: "Lord Surya (Sun)",
        benefit: "Vitality, confidence, success",
        chantCount: 12,
        bestTime: "Sunrise",
        dayOfWeek: "Sunday"
    }
]

export default function MantraOfTheDay() {
    const [todayMantra, setTodayMantra] = useState<MantraInfo | null>(null)
    const [isPlaying, setIsPlaying] = useState(false)
    const [copied, setCopied] = useState(false)

    useEffect(() => {
        // Get mantra based on day of week
        const dayIndex = new Date().getDay() // 0 = Sunday
        const dayMap = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
        const todayDay = dayMap[dayIndex]

        const mantra = DAILY_MANTRAS.find(m => m.dayOfWeek === todayDay) || DAILY_MANTRAS[0]
        setTodayMantra(mantra)
    }, [])

    const handleCopy = () => {
        if (todayMantra) {
            navigator.clipboard.writeText(todayMantra.transliteration)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        }
    }

    const getRandomMantra = () => {
        const randomIndex = Math.floor(Math.random() * DAILY_MANTRAS.length)
        setTodayMantra(DAILY_MANTRAS[randomIndex])
    }

    if (!todayMantra) return null

    return (
        <Card className="bg-gradient-to-br from-orange-900/30 via-amber-900/20 to-slate-900/50 border-orange-500/30 p-6 relative overflow-hidden">
            {/* Decorative glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-500/20 to-transparent rounded-full blur-2xl" />

            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-500/20 rounded-full">
                        <Sparkles className="w-5 h-5 text-orange-400" />
                    </div>
                    <div>
                        <h3 className="font-bold text-white">Mantra of the Day</h3>
                        <p className="text-xs text-gray-400">For {todayMantra.dayOfWeek}</p>
                    </div>
                </div>
                <button
                    onClick={getRandomMantra}
                    className="p-2 hover:bg-slate-700/50 rounded-full transition-colors"
                >
                    <RefreshCw className="w-4 h-4 text-gray-400" />
                </button>
            </div>

            {/* Deity */}
            <Badge className="bg-amber-500/20 text-amber-400 mb-4">
                {todayMantra.deity}
            </Badge>

            {/* Sanskrit */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center mb-4"
            >
                <p className="text-3xl font-sanskrit text-amber-300 mb-2">
                    {todayMantra.sanskrit}
                </p>
                <p className="text-lg text-orange-400 font-medium mb-1">
                    {todayMantra.transliteration}
                </p>
                <p className="text-sm text-gray-400 italic">
                    "{todayMantra.meaning}"
                </p>
            </motion.div>

            {/* Benefit */}
            <div className="text-center p-3 bg-slate-800/50 rounded-lg mb-4">
                <div className="text-xs text-gray-500 mb-1">Benefit</div>
                <div className="text-sm text-green-400">{todayMantra.benefit}</div>
            </div>

            {/* Details */}
            <div className="grid grid-cols-2 gap-3 text-xs mb-4">
                <div className="p-2 bg-slate-800/30 rounded text-center">
                    <div className="text-gray-500">Chant Count</div>
                    <div className="text-white font-bold">{todayMantra.chantCount} times</div>
                </div>
                <div className="p-2 bg-slate-800/30 rounded text-center">
                    <div className="text-gray-500">Best Time</div>
                    <div className="text-white font-bold">{todayMantra.bestTime}</div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 border-orange-500/30 text-orange-400"
                    onClick={() => setIsPlaying(!isPlaying)}
                >
                    {isPlaying ? <VolumeX className="w-4 h-4 mr-2" /> : <Volume2 className="w-4 h-4 mr-2" />}
                    {isPlaying ? "Stop" : "Listen"}
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    className="border-orange-500/30 text-orange-400"
                    onClick={handleCopy}
                >
                    {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
            </div>
        </Card>
    )
}
