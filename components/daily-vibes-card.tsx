"use client"

import { useMemo } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, Briefcase, Zap, Shield } from "lucide-react"

const SCORE_STYLES = {
  green: {
    badge: "bg-green-500/20 text-green-400 border-green-500/30",
    border: "border-green-500/30",
    text: "text-green-400",
  },
  yellow: {
    badge: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    border: "border-yellow-500/30",
    text: "text-yellow-400",
  },
  red: {
    badge: "bg-red-500/20 text-red-400 border-red-500/30",
    border: "border-red-500/30",
    text: "text-red-400",
  },
} as const

export default function DailyVibesCard() {
  const today = useMemo(() => new Date(), [])
  const dayOfWeek = today.getDay()
  const month = today.getMonth() + 1

  const moonPhase = useMemo(() => {
    const newMoon = new Date(2025, 0, 29)
    const daysSinceNewMoon = Math.floor((today.getTime() - newMoon.getTime()) / (1000 * 60 * 60 * 24))
    const lunarCycle = daysSinceNewMoon % 29.53

    if (lunarCycle < 1) return { phase: "New Moon", illumination: 0 }
    if (lunarCycle < 7.4) return { phase: "Waxing Crescent", illumination: Math.round(lunarCycle * 14) }
    if (lunarCycle < 8.4) return { phase: "First Quarter", illumination: 50 }
    if (lunarCycle < 14.8) return { phase: "Waxing Gibbous", illumination: Math.round(50 + (lunarCycle - 8.4) * 8) }
    if (lunarCycle < 15.8) return { phase: "Full Moon", illumination: 100 }
    if (lunarCycle < 22.1) return { phase: "Waning Gibbous", illumination: Math.round(100 - (lunarCycle - 15.8) * 8) }
    if (lunarCycle < 23.1) return { phase: "Last Quarter", illumination: 50 }
    return { phase: "Waning Crescent", illumination: Math.round(50 - (lunarCycle - 23.1) * 8) }
  }, [today])

  const currentDasha = useMemo(() => ({
    mahadasha: "Jupiter",
    antardasha: "Saturn",
    pratyantardasha: "Mercury",
    period: "Nov 2024 - May 2027",
  }), [])

  const currentTransits = useMemo(() => {
    if (month === 7) {
      return {
        saturn: "Aquarius (Own sign - Very Strong)",
        jupiter: "Gemini (Neutral - Moderate)",
        mars: "Leo (Friendly - Good)",
        venus: "Cancer (Neutral - Moderate)",
        mercury: "Cancer (Friendly - Good)",
        rahu: "Pisces (Exalted - Excellent)",
        ketu: "Virgo (Friendly - Good)",
      }
    }

    return {
      saturn: "Aquarius (Own sign - Strong)",
      jupiter: "Gemini (Neutral)",
      mars: "Virgo (Neutral)",
      venus: "Leo (Friendly)",
      mercury: "Leo (Friendly)",
      rahu: "Pisces (Exalted)",
      ketu: "Virgo (Friendly)",
    }
  }, [month])

  const getDailyMessage = useMemo(() => {
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    const currentDay = dayNames[dayOfWeek]

    return (category: "love" | "career" | "health" | "overall") => {
      if (category === "love") {
        if (dayOfWeek === 5) return `Venus energy on ${currentDay} enhances romance and relationships`
        if (moonPhase.phase.includes("Waxing")) return `${moonPhase.phase} supports new romantic connections`
        return `Steady relationship energy with ${moonPhase.phase} lunar influence`
      }

      if (category === "career") {
        if (dayOfWeek === 6) return "Saturn's day brings excellent professional opportunities and recognition"
        if (dayOfWeek === 3) return `Mercury energy on ${currentDay} favors communication and learning`
        if (dayOfWeek === 4) return "Avoid major career decisions on Jupiter's challenging day"
        return "Jupiter-Saturn dasha supports steady career progress"
      }

      if (category === "health") {
        if (dayOfWeek === 6) return "Saturn's disciplined energy supports health routines and healing"
        if (moonPhase.phase.includes("Waning")) return `${moonPhase.phase} ideal for detox and releasing toxins`
        return `Maintain balance with current ${moonPhase.phase} lunar energy`
      }

      if (dayOfWeek === 6) return "Highly favorable day with Saturn's blessing on your lagna"
      if (dayOfWeek === 4) return "Challenging day due to Jupiter conflicts, practice patience"
      return `Balanced energy with ${moonPhase.phase} and favorable planetary transits`
    }
  }, [dayOfWeek, moonPhase.phase])

  const vibes = useMemo(() => {
    let baseScore = 70
    let loveScore = 70
    let careerScore = 70
    let healthScore = 70

    if (dayOfWeek === 6) {
      baseScore += 15
      careerScore += 20
      healthScore += 10
    } else if (dayOfWeek === 3) {
      baseScore += 9
      careerScore += 15
      loveScore += 8
    } else if (dayOfWeek === 5) {
      baseScore += 10
      loveScore += 12
      careerScore += 10
    } else if (dayOfWeek === 4) {
      baseScore -= 25
      careerScore -= 30
      healthScore -= 20
    }

    if (moonPhase.phase.includes("Waxing")) {
      loveScore += 5
      careerScore += 5
    } else if (moonPhase.phase.includes("Waning")) {
      healthScore += 5
      baseScore += 3
    }

    baseScore += 8
    careerScore += 12
    healthScore += 8

    baseScore += 10
    careerScore += 15
    healthScore += 10

    const clamp = (score: number) => Math.max(0, Math.min(100, score))

    return {
      love: {
        score: clamp(loveScore),
        message: getDailyMessage("love"),
      },
      career: {
        score: clamp(careerScore),
        message: getDailyMessage("career"),
      },
      health: {
        score: clamp(healthScore),
        message: getDailyMessage("health"),
      },
      overall: {
        score: clamp(baseScore),
        message: getDailyMessage("overall"),
      },
    }
  }, [dayOfWeek, getDailyMessage, moonPhase.phase])

  const influences = useMemo(() => [
    `${currentDasha.mahadasha}-${currentDasha.antardasha} Dasha (${currentDasha.period})`,
    "Sade Sati Setting Phase (Relief Period)",
    currentTransits.saturn,
    "Shatabhisha Nakshatra Healing Energy",
    `${moonPhase.phase} Lunar Influence`,
  ], [currentDasha, currentTransits.saturn, moonPhase.phase])

  const getScoreColor = (score: number) => {
    if (score >= 80) return "green"
    if (score >= 60) return "yellow"
    return "red"
  }

  return (
    <Card className="bg-gradient-to-br from-slate-900/50 to-purple-900/30 border-purple-500/30 p-8 backdrop-blur-sm">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-purple-400 mb-2">Today's Cosmic Energy</h3>
        <Badge className={`${SCORE_STYLES[getScoreColor(vibes.overall.score)].badge} px-4 py-2`}>
          Overall: {vibes.overall.score}%
        </Badge>
        <p className="text-gray-300 mt-2">{vibes.overall.message}</p>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className={`bg-gradient-to-br from-slate-800/30 to-pink-900/20 ${SCORE_STYLES[getScoreColor(vibes.love.score)].border} p-4 text-center`}>
            <Heart className={`w-8 h-8 mx-auto mb-2 ${SCORE_STYLES[getScoreColor(vibes.love.score)].text}`} />
            <h4 className="font-semibold text-white mb-1">Love</h4>
            <div className={`text-2xl font-bold ${SCORE_STYLES[getScoreColor(vibes.love.score)].text} mb-2`}>
              {vibes.love.score}%
            </div>
            <p className="text-xs text-gray-300">{vibes.love.message}</p>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className={`bg-gradient-to-br from-slate-800/30 to-blue-900/20 ${SCORE_STYLES[getScoreColor(vibes.career.score)].border} p-4 text-center`}>
            <Briefcase className={`w-8 h-8 mx-auto mb-2 ${SCORE_STYLES[getScoreColor(vibes.career.score)].text}`} />
            <h4 className="font-semibold text-white mb-1">Career</h4>
            <div className={`text-2xl font-bold ${SCORE_STYLES[getScoreColor(vibes.career.score)].text} mb-2`}>
              {vibes.career.score}%
            </div>
            <p className="text-xs text-gray-300">{vibes.career.message}</p>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className={`bg-gradient-to-br from-slate-800/30 to-green-900/20 ${SCORE_STYLES[getScoreColor(vibes.health.score)].border} p-4 text-center`}>
            <Shield className={`w-8 h-8 mx-auto mb-2 ${SCORE_STYLES[getScoreColor(vibes.health.score)].text}`} />
            <h4 className="font-semibold text-white mb-1">Health</h4>
            <div className={`text-2xl font-bold ${SCORE_STYLES[getScoreColor(vibes.health.score)].text} mb-2`}>
              {vibes.health.score}%
            </div>
            <p className="text-xs text-gray-300">{vibes.health.message}</p>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className="bg-gradient-to-br from-slate-800/30 to-purple-900/20 border-purple-500/30 p-4 text-center">
            <Zap className="w-8 h-8 mx-auto mb-2 text-purple-400" />
            <h4 className="font-semibold text-white mb-1">Energy</h4>
            <div className="text-2xl font-bold text-purple-400 mb-2">{moonPhase.phase.split(" ")[0]}</div>
            <p className="text-xs text-gray-300">{moonPhase.illumination}% illuminated lunar energy</p>
          </Card>
        </motion.div>
      </div>

      <div className="mt-6 text-center">
        <h4 className="text-lg font-semibold text-cyan-400 mb-2">Current Astrological Influences</h4>
        <div className="flex flex-wrap justify-center gap-2">
          {influences.map((influence, index) => (
            <Badge
              key={index}
              className={`${
                index === 0
                  ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                  : index === 1
                    ? "bg-green-500/20 text-green-400 border-green-500/30"
                    : index === 2
                      ? "bg-cyan-500/20 text-cyan-400 border-cyan-500/30"
                      : index === 3
                        ? "bg-purple-500/20 text-purple-400 border-purple-500/30"
                        : "bg-blue-500/20 text-blue-400 border-blue-500/30"
              }`}
            >
              {influence}
            </Badge>
          ))}
        </div>
      </div>
    </Card>
  )
}
