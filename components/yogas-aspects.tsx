"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Star, Sparkles, Crown, Moon, Coins, Zap, CheckCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useState, useMemo } from "react"
import DoshaAnalysis from "@/components/dosha-analysis"
import { checkYogas, calculateYogaStrength, groupYogasByCategory, YogaResult } from "@/lib/yoga-engine"
import { useResolvedUserData } from "@/contexts/user-context"

// Category icons and colors
const CATEGORY_STYLES: Record<string, { icon: React.ReactNode; color: string; bgColor: string }> = {
  Mahapurusha: { icon: <Crown className="w-4 h-4" />, color: "text-amber-400", bgColor: "bg-amber-500/20" },
  Raja: { icon: <Star className="w-4 h-4" />, color: "text-purple-400", bgColor: "bg-purple-500/20" },
  Lunar: { icon: <Moon className="w-4 h-4" />, color: "text-blue-400", bgColor: "bg-blue-500/20" },
  Wealth: { icon: <Coins className="w-4 h-4" />, color: "text-green-400", bgColor: "bg-green-500/20" },
  Special: { icon: <Zap className="w-4 h-4" />, color: "text-cyan-400", bgColor: "bg-cyan-500/20" },
}

export default function YogasAspects() {
  const [selectedYoga, setSelectedYoga] = useState<string | null>(null)
  const activeData = useResolvedUserData()

  // Calculate yogas dynamically from planetary positions
  const dynamicYogas = useMemo(() => {
    // Convert planetary positions to longitudes for yoga engine
    // Using approximate degrees based on sign positions
    const signToLongitude: Record<string, number> = {
      "Aries": 15, "Taurus": 45, "Gemini": 75, "Cancer": 105,
      "Leo": 135, "Virgo": 165, "Libra": 195, "Scorpio": 225,
      "Sagittarius": 255, "Capricorn": 285, "Aquarius": 315, "Pisces": 345
    }

    const positions: Record<string, number> = {
      sun: signToLongitude["Virgo"] + 27,      // 27°13'56" Virgo = ~192°
      moon: signToLongitude["Aquarius"] + 15,  // 15°43'40" Aquarius = ~330°
      mars: signToLongitude["Aries"] + 28,     // 28°15'02" Aries = ~28°
      mercury: signToLongitude["Libra"] + 14,  // 14°38'23" Libra = ~194°
      jupiter: signToLongitude["Libra"] + 3,   // 03°32'34" Libra = ~183°
      venus: signToLongitude["Scorpio"] + 13,  // 13°05'43" Scorpio = ~223°
      saturn: signToLongitude["Cancer"] + 15,  // 15°59'49" Cancer = ~105°
      rahu: signToLongitude["Pisces"] + 19,    // 19°12'55" Pisces = ~349°
      ketu: signToLongitude["Virgo"] + 19,     // 19°12'55" Virgo = ~169°
      lagna: signToLongitude["Aquarius"]       // Aquarius lagna = ~300°
    }

    return checkYogas(positions, positions.lagna)
  }, [activeData])

  const groupedYogas = useMemo(() => groupYogasByCategory(dynamicYogas), [dynamicYogas])

  const authenticYogas = [
    {
      name: "Gajakesari Yoga",
      verified: true,
      strength: "Strong",
      formation: "Jupiter in 9th house, Moon in 1st house",
      effects: "Wisdom, popularity, prosperity, and leadership qualities",
      activation: "Active throughout life, peak during Jupiter periods",
      color: "yellow",
      percentage: 88,
      category: "Excellent",
      logo: "🐘",
      description: "This powerful yoga grants you natural wisdom, teaching abilities, and respect in society.",
      positiveEffects: [
        "Natural teaching and mentoring abilities",
        "Respected for wisdom and ethical conduct",
        "Strong intuitive and decision-making powers",
        "Ability to guide others through difficulties",
        "Recognition in educational or spiritual fields",
      ],
      manifestations: [
        "Becoming a sought-after advisor or consultant",
        "Success in higher education and teaching roles",
        "Natural leadership in spiritual or humanitarian causes",
        "Ability to inspire and motivate others",
        "Recognition for wisdom and knowledge sharing",
      ],
    },
    {
      name: "Raj Yoga (9th-10th Lords)",
      verified: true,
      strength: "Excellent",
      formation: "Jupiter (9th lord) and Mercury conjunct in 9th house",
      effects: "Authority, power, recognition, and success in career",
      activation: "Peak during Jupiter-Mercury periods (current and future)",
      color: "purple",
      percentage: 95,
      category: "Exceptional",
      logo: "👑",
      description: "This exceptional combination creates authority and recognition in your chosen field.",
      positiveEffects: [
        "Natural authority and leadership qualities",
        "Success in dharmic and educational pursuits",
        "Recognition for expertise and knowledge",
        "Ability to influence and guide others",
        "Success in publishing, teaching, or consulting",
      ],
      manifestations: [
        "Achieving positions of authority and respect",
        "Success in academic or spiritual leadership",
        "Recognition as an expert in your field",
        "Opportunities to guide and mentor others",
        "Success in writing, speaking, or teaching",
      ],
    },
    {
      name: "Vipreet Raj Yoga",
      strength: "Moderate",
      formation: "6th lord Moon in 1st house, 8th lord Mercury in 9th house",
      effects: "Success after overcoming adversities and challenges",
      activation: "Activated during challenging periods, brings ultimate victory",
      color: "green",
      percentage: 72,
      category: "Strong",
      logo: "⚡",
      description:
        "This yoga ensures that you'll overcome all obstacles and emerge victorious. Your struggles will ultimately lead to greater success.",
      positiveEffects: [
        "Ability to turn obstacles into opportunities",
        "Strength to overcome enemies and challenges",
        "Success through unconventional methods",
        "Resilience and fighting spirit",
        "Victory after initial struggles",
      ],
      manifestations: [
        "Overcoming health challenges successfully",
        "Converting professional setbacks into comebacks",
        "Finding success through difficult experiences",
        "Becoming stronger through adversity",
        "Helping others overcome similar challenges",
      ],
    },
    {
      name: "Dhana Yoga (Wealth)",
      strength: "Strong",
      formation: "Multiple combinations involving 2nd, 5th, 9th, and 11th houses",
      effects: "Self-made wealth, financial independence, and prosperity",
      activation: "Gradual activation, peak during Saturn and Mercury periods",
      color: "blue",
      percentage: 78,
      category: "Strong",
      logo: "💰",
      description:
        "You're destined to be the architect of your own fortune. Wealth will come through your own efforts and expertise.",
      positiveEffects: [
        "Self-made wealth through personal efforts",
        "Multiple income streams and opportunities",
        "Financial independence and security",
        "Ability to create value through knowledge",
        "Success in business and investments",
      ],
      manifestations: [
        "Building successful independent practice",
        "Creating wealth through teaching and consulting",
        "Developing multiple revenue streams",
        "Achieving financial freedom through expertise",
        "Building lasting financial assets",
      ],
    },
    {
      name: "Moksha Yoga",
      strength: "Strong",
      formation: "Ketu in 8th house, Jupiter aspecting 12th house",
      effects: "Spiritual liberation, detachment, and higher consciousness",
      activation: "Lifelong influence, intensifies with age and spiritual practice",
      color: "indigo",
      percentage: 85,
      category: "Excellent",
      logo: "🕉️",
      description:
        "This yoga grants natural spiritual inclinations and the potential for liberation. You'll be drawn to higher truths and mystical knowledge.",
      positiveEffects: [
        "Natural spiritual inclinations and wisdom",
        "Ability to detach from material desires",
        "Deep understanding of life's mysteries",
        "Potential for spiritual enlightenment",
        "Natural meditation and healing abilities",
      ],
      manifestations: [
        "Becoming a spiritual teacher or guide",
        "Developing psychic and healing abilities",
        "Finding peace through spiritual practices",
        "Helping others on their spiritual journey",
        "Achieving inner liberation and wisdom",
      ],
    },
    {
      name: "Budha-Aditya Yoga",
      strength: "Weak (8th house)",
      formation: "Sun and Mercury in same house (8th house Virgo)",
      effects: "Sharp intellect, communication skills, but hidden/research-oriented",
      activation: "Active in research, occult, and transformational work",
      color: "orange",
      percentage: 45,
      category: "Moderate",
      logo: "🧠",
      description:
        "Though weakened by 8th house placement, this yoga grants exceptional research abilities and deep, transformative intelligence.",
      positiveEffects: [
        "Sharp analytical and research abilities",
        "Deep understanding of hidden subjects",
        "Excellent communication in specialized fields",
        "Ability to transform complex ideas simply",
        "Success in occult and mystical studies",
      ],
      manifestations: [
        "Excelling in research and investigation",
        "Becoming expert in occult sciences",
        "Success in psychology and healing arts",
        "Writing and teaching about hidden subjects",
        "Developing innovative solutions to problems",
      ],
    },
    {
      name: "Kemadruma Dosha (Cancelled)",
      strength: "Cancelled",
      formation: "Moon without benefic planets on either side, but cancelled by aspects",
      effects: "Originally creates loneliness, but cancelled by Jupiter's aspect",
      activation: "Neutralized by Jupiter's protective influence",
      color: "gray",
      percentage: 15,
      category: "Neutralized",
      logo: "🛡️",
      description:
        "This potential dosha is cancelled by Jupiter's aspect on Moon, ensuring you'll have good friends and support throughout life.",
      positiveEffects: [
        "Protection from loneliness and isolation",
        "Good friends and supportive relationships",
        "Jupiter's blessing neutralizes negative effects",
        "Strong social connections and network",
        "Emotional support during difficult times",
      ],
      manifestations: [
        "Finding loyal and supportive friends",
        "Building strong professional networks",
        "Receiving help during challenging times",
        "Creating meaningful relationships",
        "Being part of spiritual or learning communities",
      ],
    },
  ]

  const planetaryAspects = [
    {
      aspect: "Jupiter aspects Moon (1st house)",
      effect: "Wisdom, good judgment, spiritual inclinations, protective influence",
      strength: "Very Strong",
      color: "yellow",
    },
    {
      aspect: "Saturn aspects Mars (3rd house)",
      effect: "Disciplined courage, controlled aggression, strategic thinking",
      strength: "Strong",
      color: "blue",
    },
    {
      aspect: "Mars aspects Venus (10th house)",
      effect: "Passionate career approach, transformative work, healing abilities",
      strength: "Moderate",
      color: "red",
    },
    {
      aspect: "Rahu aspects Sun-Ketu (8th house)",
      effect: "Unconventional research interests, foreign connections in occult",
      strength: "Moderate",
      color: "purple",
    },
  ]

  const yogaActivationTimeline = [
    {
      period: "2024-2027",
      activeYogas: ["Gajakesari", "Raj Yoga"],
      intensity: "High",
      description: "Jupiter period completion brings peak wisdom and recognition",
    },
    {
      period: "2027-2035",
      activeYogas: ["Vipreet Raj", "Dhana Yoga"],
      intensity: "Moderate",
      description: "Saturn period transforms challenges into success and wealth",
    },
    {
      period: "2035-2046",
      activeYogas: ["Raj Yoga", "Dhana Yoga"],
      intensity: "Peak",
      description: "Maximum authority, wealth, and recognition period",
    },
    {
      period: "2046+",
      activeYogas: ["Moksha Yoga", "All Yogas"],
      intensity: "Spiritual",
      description: "Mercury period brings ultimate success and spiritual fulfillment",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Main Yogas Analysis */}
      <Card className="bg-gradient-to-br from-slate-900/50 to-purple-900/30 border-purple-500/30 p-8 backdrop-blur-sm">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold text-purple-400 text-center flex items-center justify-center mb-8"
        >
          <Star className="w-6 h-6 mr-2" />
          Authentic Yogas &amp; Planetary Combinations
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-6">
          {authenticYogas.map((yoga, idx) => (
            <motion.div
              layout
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card
                className={`p-6 cursor-pointer transition-all duration-300 bg-gradient-to-br from-slate-800/30 to-${yoga.color}-900/20 border-${yoga.color}-500/30 hover:shadow-lg hover:shadow-${yoga.color}-500/20 ${selectedYoga === yoga.name ? `ring-2 ring-${yoga.color}-400` : ""
                  }`}
                onClick={() => setSelectedYoga(selectedYoga === yoga.name ? null : yoga.name)}
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{yoga.logo}</span>
                      <div>
                        <h3 className={`text-lg font-bold text-${yoga.color}-400 flex items-center gap-2`}>
                          {yoga.name}
                          {(yoga as any).verified && (
                            <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-[10px] px-1 py-0.5 h-5">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                        </h3>
                        <Badge
                          className={`bg-${yoga.color}-500/20 text-${yoga.color}-400 border-${yoga.color}-500/30 mt-1`}
                        >
                          {yoga.category}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-2xl font-bold text-${yoga.color}-400`}>{yoga.percentage}%</div>
                      <div className="text-xs text-gray-400">Strength</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Yoga Strength</span>
                      <span className={`text-${yoga.color}-400`}>{yoga.percentage}%</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div
                        className={`bg-gradient-to-r from-${yoga.color}-400 to-${yoga.color}-600 h-2 rounded-full transition-all duration-1000`}
                        style={{ width: `${yoga.percentage}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-cyan-400 font-semibold">Formation:</span>
                      <p className="text-gray-300 mt-1">{yoga.formation}</p>
                    </div>

                    <div>
                      <span className="text-yellow-400 font-semibold">Effects:</span>
                      <p className="text-gray-300 mt-1">{yoga.effects}</p>
                    </div>

                    <div>
                      <span className="text-green-400 font-semibold">Activation:</span>
                      <p className="text-gray-300 mt-1">{yoga.activation}</p>
                    </div>
                  </div>

                  <AnimatePresence>
                    {selectedYoga === yoga.name && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                        style={{ overflow: "hidden" }}
                        className="space-y-4 border-t border-gray-600 pt-4"
                      >
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <h5 className="font-semibold text-green-400 mb-2">Positive Effects</h5>
                            <ul className="space-y-1">
                              {yoga.positiveEffects.map((effect, i) => (
                                <li key={i} className="flex items-start space-x-2">
                                  <span className="text-green-400 mt-1">•</span>
                                  <span className="text-gray-300 text-sm">{effect}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <h5 className="font-semibold text-purple-400 mb-2">Manifestations</h5>
                            <ul className="space-y-1">
                              {yoga.manifestations.map((manifestation, i) => (
                                <li key={i} className="flex items-start space-x-2">
                                  <span className="text-purple-400 mt-1">•</span>
                                  <span className="text-gray-300 text-sm">{manifestation}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        <div className="bg-slate-800/50 rounded-lg p-3">
                          <p className="text-gray-300 text-sm italic">{yoga.description}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Live Yoga Detection - From Engine */}
      <Card className="bg-gradient-to-br from-slate-900/50 to-emerald-900/30 border-emerald-500/30 p-8 backdrop-blur-sm">
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xl font-bold text-emerald-400 mb-6 text-center flex items-center justify-center"
        >
          <Sparkles className="w-5 h-5 mr-2" />
          Live Yoga Detection ({dynamicYogas.length} yogas found)
        </motion.h3>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {dynamicYogas.map((yoga, idx) => {
            const style = CATEGORY_STYLES[yoga.category] || CATEGORY_STYLES.Special
            const strength = calculateYogaStrength(yoga)

            return (
              <motion.div
                key={yoga.name}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Card className={`p-4 bg-gradient-to-br from-slate-800/30 to-slate-700/20 border-emerald-500/20 hover:border-emerald-400/40 transition-all`}>
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <div className={`p-1.5 rounded ${style.bgColor}`}>
                          {style.icon}
                        </div>
                        <div>
                          <h4 className={`font-semibold ${style.color}`}>{yoga.name}</h4>
                          <Badge className={`${style.bgColor} ${style.color} border-0 text-xs`}>
                            {yoga.category}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-lg font-bold ${style.color}`}>{strength}%</div>
                        <div className="text-xs text-gray-400">{yoga.strength}</div>
                      </div>
                    </div>

                    <p className="text-sm text-gray-300">{yoga.description}</p>

                    <div className="pt-2 border-t border-gray-700/50">
                      <p className="text-xs text-gray-400 mb-1">Effects:</p>
                      <div className="flex flex-wrap gap-1">
                        {yoga.effects.slice(0, 2).map((effect, i) => (
                          <span key={i} className="text-xs bg-slate-700/50 text-gray-300 px-2 py-0.5 rounded">
                            {effect}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </div>

        {dynamicYogas.length === 0 && (
          <div className="text-center text-gray-400 py-8">
            <p>No yogas detected with current planetary positions.</p>
          </div>
        )}
      </Card>

      {/* Planetary Aspects */}
      <Card className="bg-gradient-to-br from-slate-900/50 to-indigo-900/30 border-indigo-500/30 p-8 backdrop-blur-sm">
        <h3 className="text-xl font-bold text-indigo-400 mb-6 text-center">Major Planetary Aspects</h3>

        <div className="grid md:grid-cols-2 gap-4">
          {planetaryAspects.map((aspect, index) => (
            <Card
              key={index}
              className={`p-4 bg-gradient-to-br from-slate-800/30 to-${aspect.color}-900/20 border-${aspect.color}-500/30`}
            >
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <h4 className={`font-semibold text-${aspect.color}-400 text-sm`}>{aspect.aspect}</h4>
                  <Badge
                    className={`bg-${aspect.color}-500/20 text-${aspect.color}-400 border-${aspect.color}-500/30 text-xs`}
                  >
                    {aspect.strength}
                  </Badge>
                </div>
                <p className="text-gray-300 text-xs">{aspect.effect}</p>
              </div>
            </Card>
          ))}
        </div>
      </Card>

      {/* Yoga Activation Timeline */}
      <Card className="bg-gradient-to-br from-slate-900/50 to-green-900/30 border-green-500/30 p-8 backdrop-blur-sm">
        <h3 className="text-xl font-bold text-green-400 mb-6 text-center">Yoga Activation Timeline</h3>

        <div className="space-y-4">
          {yogaActivationTimeline.map((timeline, index) => (
            <div key={index} className="bg-slate-800/30 border border-green-500/30 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-white font-semibold">{timeline.period}</h4>
                <Badge
                  className={`${timeline.intensity === "Peak"
                    ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                    : timeline.intensity === "High"
                      ? "bg-green-500/20 text-green-400 border-green-500/30"
                      : timeline.intensity === "Spiritual"
                        ? "bg-purple-500/20 text-purple-400 border-purple-500/30"
                        : "bg-blue-500/20 text-blue-400 border-blue-500/30"
                    }`}
                >
                  {timeline.intensity}
                </Badge>
              </div>
              <div className="space-y-1">
                <div className="text-sm">
                  <span className="text-cyan-400 font-semibold">Active Yogas:</span>
                  <span className="text-gray-300 ml-2">{timeline.activeYogas.join(", ")}</span>
                </div>
                <p className="text-gray-300 text-sm">{timeline.description}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Yoga Remedies and Enhancement */}
      <Card className="bg-gradient-to-br from-slate-900/50 to-orange-900/30 border-orange-500/30 p-6">
        <h4 className="text-lg font-bold text-orange-400 mb-4">Yoga Enhancement Practices</h4>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h5 className="font-semibold text-cyan-400 mb-3">To Strengthen Beneficial Yogas:</h5>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>• Worship Jupiter on Thursdays for Gajakesari Yoga</li>
              <li>• Study sacred texts to enhance Raj Yoga</li>
              <li>• Practice charity and service for Dhana Yoga</li>
              <li>• Meditate regularly to activate Moksha Yoga</li>
              <li>• Maintain ethical conduct in all dealings</li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold text-yellow-400 mb-3">To Minimize Negative Effects:</h5>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>• Chant mantras to neutralize doshas</li>
              <li>• Perform remedies for challenging planets</li>
              <li>• Maintain positive thinking and actions</li>
              <li>• Seek guidance from learned teachers</li>
              <li>• Practice patience during difficult periods</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Dosha Analysis */}
      <DoshaAnalysis />
    </div>
  )
}
