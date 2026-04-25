"use client"

import { useMemo } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"

const MOON_INFLUENCE_STYLES = {
  yellow: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  purple: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  green: "bg-green-500/20 text-green-400 border-green-500/30",
  blue: "bg-blue-500/20 text-blue-400 border-blue-500/30",
} as const

export default function MoonPhaseTracker() {
  const { moonPhase, moonIllumination, moonSign, lunarDay } = useMemo(() => {
    const now = new Date()
    const totalDays = Math.floor((now.getTime() - new Date(2000, 0, 6).getTime()) / (1000 * 60 * 60 * 24))
    const moonCycle = totalDays % 29.53

    let phase = ""
    let illumination = 0
    let tithi = ""

    if (moonCycle < 1.84) {
      phase = "New Moon"
      illumination = 0
      tithi = "Amavasya"
    } else if (moonCycle < 5.53) {
      phase = "Waxing Crescent"
      illumination = 25
      tithi = "Shukla Tritiya"
    } else if (moonCycle < 9.22) {
      phase = "First Quarter"
      illumination = 50
      tithi = "Shukla Saptami"
    } else if (moonCycle < 12.91) {
      phase = "Waxing Gibbous"
      illumination = 75
      tithi = "Shukla Dashami"
    } else if (moonCycle < 16.61) {
      phase = "Full Moon"
      illumination = 100
      tithi = "Purnima"
    } else if (moonCycle < 20.3) {
      phase = "Waning Gibbous"
      illumination = 75
      tithi = "Krishna Panchami"
    } else if (moonCycle < 23.99) {
      phase = "Last Quarter"
      illumination = 50
      tithi = "Krishna Ashtami"
    } else {
      phase = "Waning Crescent"
      illumination = 25
      tithi = "Krishna Dwadashi"
    }

    const moonSigns = [
      "Aries",
      "Taurus",
      "Gemini",
      "Cancer",
      "Leo",
      "Virgo",
      "Libra",
      "Scorpio",
      "Sagittarius",
      "Capricorn",
      "Aquarius",
      "Pisces",
    ]

    return {
      moonPhase: phase,
      moonIllumination: illumination,
      moonSign: moonSigns[Math.floor((totalDays / 2.25) % 12)],
      lunarDay: tithi,
    }
  }, [])

  const moonEmoji = useMemo(() => {
    switch (moonPhase) {
      case "New Moon":
        return "🌑"
      case "Waxing Crescent":
        return "🌒"
      case "First Quarter":
        return "🌓"
      case "Waxing Gibbous":
        return "🌔"
      case "Full Moon":
        return "🌕"
      case "Waning Gibbous":
        return "🌖"
      case "Last Quarter":
        return "🌗"
      case "Waning Crescent":
        return "🌘"
      default:
        return "🌙"
    }
  }, [moonPhase])

  const influence = useMemo(() => {
    if (moonPhase === "Full Moon") return { text: "High emotional energy, manifestation power", color: "yellow" as const }
    if (moonPhase === "New Moon") return { text: "New beginnings, introspection time", color: "purple" as const }
    if (moonPhase.includes("Waxing")) return { text: "Growth, expansion, building energy", color: "green" as const }
    return { text: "Release, letting go, cleansing", color: "blue" as const }
  }, [moonPhase])

  return (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
      <Card className="bg-gradient-to-br from-slate-800/50 to-indigo-900/30 border-indigo-500/30 px-4 py-2 backdrop-blur-sm w-full">
        <div className="space-y-2">
          <div className="flex flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="text-2xl">{moonEmoji}</div>
              <div>
                <div className="text-sm text-indigo-400 font-semibold leading-none mb-1">{moonPhase}</div>
                <div className="text-[10px] text-gray-400 leading-none">{moonIllumination}% Illuminated</div>
              </div>
            </div>

            <div className="flex flex-col items-end sm:items-center sm:flex-row sm:space-x-4 space-y-1 sm:space-y-0 text-right sm:text-left">
              <div className="text-[10px] text-cyan-400 leading-none">
                <span className="font-semibold">Moon in:</span> {moonSign}
              </div>
              <div className="text-[10px] text-purple-400 leading-none">
                <span className="font-semibold">Tithi:</span> {lunarDay}
              </div>
            </div>

            <div className="hidden sm:block">
              <Badge className={`${MOON_INFLUENCE_STYLES[influence.color]} text-[10px] px-2 py-0.5 whitespace-nowrap`}>
                {influence.text}
              </Badge>
            </div>
          </div>

          <div className="sm:hidden flex justify-end">
            <Badge className={`${MOON_INFLUENCE_STYLES[influence.color]} text-[10px] px-2 py-0.5 whitespace-nowrap`}>
              {influence.text}
            </Badge>
          </div>

          <div className="w-full bg-slate-700/50 rounded-full h-1 mt-1">
            <div
              className="bg-gradient-to-r from-indigo-400 to-purple-400 h-1 rounded-full transition-all duration-1000"
              style={{ width: `${moonIllumination}%` }}
            ></div>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
