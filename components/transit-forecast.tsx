"use client"

import { useState, useMemo, useEffect } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, TrendingUp, Calendar, Star, Globe, Orbit, ChevronRight } from "lucide-react"
import RetrogradeTracker from "@/components/retrograde-tracker"
import { getCurrentPlanetaryPositions, getTransitToNatalAspects, PlanetPosition, TransitAspect } from "@/lib/transit-engine"

export default function TransitForecast() {
  const [selectedTransit, setSelectedTransit] = useState<string | null>(null)
  const [currentPositions, setCurrentPositions] = useState<PlanetPosition[]>([])
  const [transitAspects, setTransitAspects] = useState<TransitAspect[]>([])

  // Calculate real-time planetary positions
  useEffect(() => {
    // Get current transit positions
    const positions = getCurrentPlanetaryPositions(new Date())
    setCurrentPositions(positions)

    // Calculate transit aspects to natal chart (using Sudhanshu's natal positions)
    const natalPositions: Record<string, number> = {
      sun: 192,      // Virgo 27°
      moon: 330,     // Aquarius 15°
      mars: 28,      // Aries 28°
      mercury: 194,  // Libra 14°
      jupiter: 183,  // Libra 3°
      venus: 223,    // Scorpio 13°
      saturn: 105,   // Cancer 15°
    }

    const aspects = getTransitToNatalAspects(positions, natalPositions)
    setTransitAspects(aspects.slice(0, 10)) // Top 10 most significant aspects

    // Update every 5 minutes
    const interval = setInterval(() => {
      const newPositions = getCurrentPlanetaryPositions(new Date())
      setCurrentPositions(newPositions)
      setTransitAspects(getTransitToNatalAspects(newPositions, natalPositions).slice(0, 10))
    }, 5 * 60 * 1000)

    return () => clearInterval(interval)
  }, [])

  const majorTransits = [
    {
      id: "sade-sati-peak",
      planet: "Saturn",
      event: "Sade Sati Peak Phase",
      period: "Apr 2022 - Mar 2025",
      status: "current",
      intensity: "high",
      color: "red",
      description: "Saturn transiting over natal Moon in Aquarius (1st house)",
      impact: {
        positive: [
          "Spiritual growth and detachment from material desires",
          "Karmic debt clearing and character building",
          "Increased discipline and focus in life approach",
          "Long-term stability building through challenges",
          "Development of patience and perseverance",
        ],
        challenges: [
          "Health problems and mental afflictions",
          "Character assassination and reputation challenges",
          "Difficulty achieving success despite efforts",
          "Lack of clarity in decision making",
          "Increased responsibilities and burdens",
          "Emotional stress and anxiety periods",
        ],
        remedies: [
          "Chant Hanuman Chalisa daily without fail",
          "Donate black sesame seeds on Saturdays",
          "Serve the elderly and differently-abled regularly",
          "Wear blue sapphire after proper astrological consultation",
          "Offer mustard oil to Shani temple",
          "Feed black dogs and crows regularly",
        ],
      },
    },
    {
      id: "sade-sati-setting",
      planet: "Saturn",
      event: "Sade Sati Setting Phase",
      period: "Mar 2025 - Jun 2027",
      status: "upcoming",
      intensity: "moderate",
      color: "orange",
      description: "Saturn's transit through Pisces, 2nd house from Moon",
      impact: {
        positive: [
          "Gradual relief from previous difficulties",
          "Financial situation begins stabilizing",
          "Reduced mental stress and anxiety",
          "Better family relationships and harmony",
          "Improved health and vitality",
        ],
        challenges: [
          "Financial stress and high expenses continue",
          "Misunderstandings in family matters",
          "Fear of theft or sudden financial losses",
          "Educational challenges for ongoing studies",
          "Need for careful financial planning",
        ],
        remedies: [
          "Control expenses and avoid speculation",
          "Stay away from non-vegetarian food and alcohol",
          "Handle domestic matters with intelligence",
          "Be extra careful while driving vehicles",
          "Continue Saturn remedies with reduced intensity",
        ],
      },
    },
    {
      id: "jupiter-mahadasha-completion",
      planet: "Jupiter",
      event: "Jupiter Mahadasha Completion",
      period: "Jul 2011 - Jul 2027",
      status: "current",
      intensity: "excellent",
      color: "yellow",
      description: "Jupiter in 9th house (Libra) - Final years of 16-year growth period",
      impact: {
        positive: [
          "Authority and power reaching peak levels",
          "Foreign connections bringing substantial income",
          "Complete family support and harmony",
          "Strong religious inclination and charitable activities",
          "Recognition for wisdom and knowledge",
          "Teaching and mentoring opportunities",
        ],
        challenges: [
          "Over-optimism leading to poor decisions",
          "Scattered energy if not properly focused",
          "Need to maintain strict ethical conduct",
          "Avoid abandoning projects before completion",
          "Balance material and spiritual pursuits",
        ],
        remedies: [
          "Visit temple daily and maintain spiritual practices",
          "Completely abstain from drinking alcohol",
          "Offer rice to running water on Thursdays",
          "Study sacred texts and philosophical works",
          "Donate yellow items and turmeric to Brahmins",
          "Share knowledge freely with deserving students",
        ],
      },
    },
    {
      id: "saturn-mahadasha-beginning",
      planet: "Saturn",
      event: "Saturn Mahadasha Beginning",
      period: "Jul 2027 - Jul 2046",
      status: "upcoming",
      intensity: "disciplined",
      color: "blue",
      description: "Saturn in 6th house (Cancer) - 19-year period of service and discipline",
      impact: {
        positive: [
          "Excellent physical fitness and strength",
          "Victory over enemies and competitors",
          "Many loyal friends and supporters",
          "Authority and respect in service sector",
          "Disciplined approach leading to success",
          "Service to society bringing recognition",
        ],
        challenges: [
          "Need for extreme humility and patience",
          "Avoid pride and arrogance at all costs",
          "Health requires constant attention",
          "Slow but steady progress pattern",
          "Increased responsibilities and duties",
          "Need for emotional maturity",
        ],
        remedies: [
          "Serve black dogs and offer them meals",
          "Offer coconut and almonds in running water",
          "Serve snakes for children's welfare",
          "Work related to Saturn during night hours",
          "Maintain strict discipline in daily routine",
          "Practice humility and service attitude",
        ],
      },
    },
    {
      id: "mercury-mahadasha-future",
      planet: "Mercury",
      event: "Mercury Mahadasha",
      period: "Jul 2046 - Jul 2063",
      status: "future",
      intensity: "excellent",
      color: "green",
      description: "Mercury in 9th house (Libra) - 17-year period of communication and wealth",
      impact: {
        positive: [
          "Excellent financial luck and prosperity",
          "Compatible partnerships and friendships",
          "Political connections and higher official contacts",
          "Birth of son during this period",
          "Success in communication and intellectual fields",
          "Peak period for writing and publishing",
        ],
        challenges: [
          "Avoid dubious speculative activities",
          "Don't accept tabeez or charms from sadhus",
          "Avoid using green color completely",
          "Control unnecessary and harmful speech",
          "Maintain truthfulness in all communications",
        ],
        remedies: [
          "Get nose pierced for Mercury's blessings",
          "Offer mushrooms in earthen pot to religious places",
          "Completely avoid green color in clothing and decor",
          "Practice truthful and beneficial communication",
          "Donate books and educational materials",
          "Serve teachers and learned people",
        ],
      },
    },
  ]

  const currentTransits = [
    {
      planet: "Jupiter",
      sign: "Taurus",
      house: "4th House",
      effect: "Home, mother, emotional stability, and property matters",
      duration: "May 2023 - May 2024",
      impact: "positive",
    },
    {
      planet: "Saturn",
      sign: "Aquarius",
      house: "1st House (Sade Sati Peak)",
      effect: "Self-discipline, personality transformation, character building",
      duration: "Apr 2022 - Mar 2025",
      impact: "challenging",
    },
    {
      planet: "Rahu",
      sign: "Aries",
      house: "3rd House",
      effect: "Communication, courage, siblings, and short journeys",
      duration: "Apr 2022 - Oct 2023",
      impact: "moderate",
    },
    {
      planet: "Ketu",
      sign: "Libra",
      house: "9th House",
      effect: "Spiritual learning, detachment from higher education",
      duration: "Apr 2022 - Oct 2023",
      impact: "spiritual",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Live Planetary Positions - Real-time from Transit Engine */}
      <Card className="bg-gradient-to-br from-slate-900/50 to-cyan-900/30 border-cyan-500/30 p-8 backdrop-blur-sm">
        <h2 className="text-2xl font-bold text-cyan-400 mb-6 text-center flex items-center justify-center">
          <Globe className="w-6 h-6 mr-2" />
          Live Planetary Positions
          <span className="ml-2 text-sm text-gray-400 font-normal">(Sidereal/Vedic)</span>
        </h2>

        <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-3">
          {currentPositions.map((pos, idx) => {
            const degrees = Math.floor(pos.degree)
            const minutes = Math.floor((pos.degree % 1) * 60)

            return (
              <motion.div
                key={pos.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Card className={`p-3 text-center bg-gradient-to-br from-slate-800/50 to-slate-700/30 border-cyan-500/20 ${pos.isRetrograde ? 'border-orange-500/40' : ''}`}>
                  <div className="text-lg font-bold text-white">{pos.name}</div>
                  <div className="text-xs text-cyan-400">{pos.sign}</div>
                  <div className="text-sm text-gray-300">{degrees}°{String(minutes).padStart(2, '0')}'</div>
                  {pos.isRetrograde && (
                    <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30 text-xs mt-1">
                      ℞ Retro
                    </Badge>
                  )}
                </Card>
              </motion.div>
            )
          })}
        </div>
      </Card>

      {/* Transit Aspects to Birth Chart */}
      {transitAspects.length > 0 && (
        <Card className="bg-gradient-to-br from-slate-900/50 to-violet-900/30 border-violet-500/30 p-8 backdrop-blur-sm">
          <h3 className="text-xl font-bold text-violet-400 mb-6 text-center flex items-center justify-center">
            <Orbit className="w-5 h-5 mr-2" />
            Transit Aspects to Your Birth Chart
          </h3>

          <div className="grid md:grid-cols-2 gap-3">
            {transitAspects.map((aspect, idx) => {
              // Derived strength based on orb
              const strength = aspect.orb < 1 ? "Strong" : aspect.orb < 2 ? "Moderate" : "Weak"
              const interpretation = `${aspect.aspectingPlanet} forming ${aspect.aspectType} with natal ${aspect.planet}`

              return (
                <motion.div
                  key={`${aspect.aspectingPlanet}-${aspect.planet}-${aspect.aspectType}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Card className={`p-4 bg-gradient-to-br from-slate-800/30 to-slate-700/20 border-violet-500/20 ${strength === 'Strong' ? 'border-yellow-500/40' : ''}`}>
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <ChevronRight className={`w-4 h-4 ${aspect.isApplying ? 'text-green-400' : 'text-gray-400'}`} />
                        <div>
                          <span className="text-white font-semibold">Tr. {aspect.aspectingPlanet}</span>
                          <span className={`mx-2 ${aspect.aspectType === 'Conjunction' ? 'text-yellow-400' :
                            aspect.aspectType === 'Opposition' ? 'text-red-400' :
                              aspect.aspectType === 'Trine' ? 'text-green-400' :
                                aspect.aspectType === 'Square' ? 'text-orange-400' :
                                  'text-blue-400'
                            }`}>{aspect.aspectType}</span>
                          <span className="text-gray-300">natal {aspect.planet}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={`${strength === 'Strong' ? 'bg-yellow-500/20 text-yellow-400' :
                          strength === 'Moderate' ? 'bg-blue-500/20 text-blue-400' :
                            'bg-gray-500/20 text-gray-400'
                          } border-0 text-xs`}>
                          {aspect.orb}° orb
                        </Badge>
                        <div className="text-xs text-gray-400 mt-1">
                          {aspect.isApplying ? '→ applying' : '← separating'}
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">{interpretation}</p>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </Card>
      )}

      {/* Current Transits */}
      <Card className="bg-gradient-to-br from-slate-900/50 to-green-900/30 border-green-500/30 p-8 backdrop-blur-sm">
        <h2 className="text-2xl font-bold text-green-400 mb-6 text-center flex items-center justify-center">
          <Star className="w-6 h-6 mr-2" />
          Current Planetary Transits
        </h2>

        <div className="grid md:grid-cols-3 gap-4">
          {currentTransits.map((transit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card
                className={`p-4 bg-gradient-to-br from-slate-800/30 to-${transit.impact === "positive"
                  ? "green"
                  : transit.impact === "challenging"
                    ? "red"
                    : transit.impact === "spiritual"
                      ? "purple"
                      : "yellow"
                  }-900/20 border-${transit.impact === "positive"
                    ? "green"
                    : transit.impact === "challenging"
                      ? "red"
                      : transit.impact === "spiritual"
                        ? "purple"
                        : "yellow"
                  }-500/30`}
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-white">{transit.planet}</h4>
                    <Badge
                      className={`bg-${transit.impact === "positive"
                        ? "green"
                        : transit.impact === "challenging"
                          ? "red"
                          : transit.impact === "spiritual"
                            ? "purple"
                            : "yellow"
                        }-500/20 text-${transit.impact === "positive"
                          ? "green"
                          : transit.impact === "challenging"
                            ? "red"
                            : transit.impact === "spiritual"
                              ? "purple"
                              : "yellow"
                        }-400 border-${transit.impact === "positive"
                          ? "green"
                          : transit.impact === "challenging"
                            ? "red"
                            : transit.impact === "spiritual"
                              ? "purple"
                              : "yellow"
                        }-500/30`}
                    >
                      {transit.impact}
                    </Badge>
                  </div>
                  <div className="text-sm space-y-1">
                    <div className="text-cyan-400">in {transit.sign}</div>
                    <div className="text-purple-400">{transit.house}</div>
                    <div className="text-gray-300">{transit.effect}</div>
                    <div className="text-xs text-gray-400">{transit.duration}</div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Retrograde Tracker */}
      <RetrogradeTracker />

      {/* Major Upcoming Transits */}
      <Card className="bg-gradient-to-br from-slate-900/50 to-purple-900/30 border-purple-500/30 p-8 backdrop-blur-sm">
        <h3 className="text-2xl font-bold text-purple-400 mb-6 text-center flex items-center justify-center">
          <Calendar className="w-6 h-6 mr-2" />
          Major Transit Forecast
        </h3>

        <div className="space-y-6">
          {majorTransits.map((transit, index) => (
            <motion.div
              layout
              key={transit.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
            >
              <Card
                className={`p-6 cursor-pointer transition-all duration-300 bg-gradient-to-br from-slate-800/30 to-${transit.color}-900/30 border-${transit.color}-500/30 hover:shadow-lg hover:shadow-${transit.color}-500/20 ${selectedTransit === transit.id ? "ring-2 ring-purple-400" : ""
                  }`}
                onClick={() => setSelectedTransit(selectedTransit === transit.id ? null : transit.id)}
              >
                <motion.div layout="position" className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className={`text-xl font-bold text-${transit.color}-400 flex items-center`}>
                      {transit.intensity === "high" && <AlertTriangle className="w-5 h-5 mr-2" />}
                      {transit.intensity === "excellent" && <TrendingUp className="w-5 h-5 mr-2" />}
                      {transit.event}
                    </h4>
                    <p className="text-gray-300">
                      {transit.planet} • {transit.period}
                    </p>
                  </div>
                  <Badge
                    className={`bg-${transit.color}-500/20 text-${transit.color}-400 border-${transit.color}-500/30`}
                  >
                    {transit.intensity}
                  </Badge>
                </motion.div>

                <motion.p layout="position" className="text-gray-300 mb-4">{transit.description}</motion.p>

                {selectedTransit === transit.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    style={{ overflow: "hidden" }}
                    className="space-y-6 border-t border-gray-600 pt-6"
                  >
                    <div className="grid md:grid-cols-3 gap-6">
                      <div>
                        <h5 className="font-semibold text-green-400 mb-3 flex items-center">
                          <TrendingUp className="w-4 h-4 mr-2" />
                          Positive Effects
                        </h5>
                        <ul className="space-y-2">
                          {transit.impact.positive.map((effect, idx) => (
                            <li key={idx} className="flex items-start space-x-2">
                              <span className="text-green-400 mt-1">•</span>
                              <span className="text-gray-300 text-sm">{effect}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h5 className="font-semibold text-orange-400 mb-3 flex items-center">
                          <AlertTriangle className="w-4 h-4 mr-2" />
                          Challenges
                        </h5>
                        <ul className="space-y-2">
                          {transit.impact.challenges.map((challenge, idx) => (
                            <li key={idx} className="flex items-start space-x-2">
                              <span className="text-orange-400 mt-1">•</span>
                              <span className="text-gray-300 text-sm">{challenge}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h5 className="font-semibold text-cyan-400 mb-3 flex items-center">
                          <Star className="w-4 h-4 mr-2" />
                          Remedies
                        </h5>
                        <ul className="space-y-2">
                          {transit.impact.remedies.map((remedy, idx) => (
                            <li key={idx} className="flex items-start space-x-2">
                              <span className="text-cyan-400 mt-1">•</span>
                              <span className="text-gray-300 text-sm">{remedy}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                )}
              </Card>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Transit Timeline */}
      <Card className="bg-gradient-to-br from-slate-900/50 to-indigo-900/30 border-indigo-500/30 p-8 backdrop-blur-sm">
        <h4 className="text-xl font-bold text-indigo-400 mb-6 text-center">Transit Timeline (2024-2040)</h4>

        <div className="space-y-4">
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-indigo-400 to-purple-400"></div>

            {[
              { year: "2024-2025", event: "Jupiter in Taurus (4th house) - Home stability", impact: "positive" },
              { year: "2025-2027", event: "Sade Sati Setting Phase - Gradual relief", impact: "moderate" },
              { year: "2027-2029", event: "Saturn Mahadasha begins - New discipline", impact: "transformative" },
              { year: "2029-2032", event: "Jupiter return to Aquarius - Major expansion", impact: "excellent" },
              { year: "2032-2035", event: "Saturn peak period - Authority building", impact: "disciplined" },
              { year: "2035-2040", event: "Mercury influence increases - Communication mastery", impact: "excellent" },
            ].map((item, index) => (
              <div key={index} className="relative pl-12 pb-6">
                <div
                  className={`absolute left-2 w-4 h-4 rounded-full border-2 transform -translate-x-1/2 ${item.impact === "excellent"
                    ? "bg-yellow-400 border-yellow-400"
                    : item.impact === "challenging"
                      ? "bg-red-400 border-red-400"
                      : item.impact === "transformative"
                        ? "bg-purple-400 border-purple-400"
                        : "bg-indigo-400 border-indigo-400"
                    }`}
                ></div>

                <div className="space-y-1">
                  <div className="font-semibold text-white">{item.year}</div>
                  <div className="text-gray-300">{item.event}</div>
                  <Badge
                    className={`${item.impact === "excellent"
                      ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                      : item.impact === "challenging"
                        ? "bg-red-500/20 text-red-400 border-red-500/30"
                        : item.impact === "transformative"
                          ? "bg-purple-500/20 text-purple-400 border-purple-500/30"
                          : "bg-indigo-500/20 text-indigo-400 border-indigo-500/30"
                      }`}
                  >
                    {item.impact}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  )
}
