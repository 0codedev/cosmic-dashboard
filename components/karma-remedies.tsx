"use client"

import { useMemo } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Music, CheckCircle, Sparkles, Gem, Gift, MapPin, Calendar } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import GemstoneRecommendations from "@/components/gemstone-recommendations"
import MantraPlayer from "@/components/mantra-player"
import {
  getTodayCharity,
  GEMSTONE_GUIDE,
  TEMPLE_SUGGESTIONS,
  CharityRecommendation,
  GemstoneGuide
} from "@/lib/remedy-engine"

// Replace with authentic remedies from PDF analysis
export default function KarmaRemedies() {
  // Get today's charity recommendation
  const todayCharity = useMemo<CharityRecommendation>(() => getTodayCharity(), [])

  // Get recommended gemstones
  const recommendedGems = useMemo<GemstoneGuide[]>(() => [
    GEMSTONE_GUIDE['Saturn'], // For Sade Sati
    GEMSTONE_GUIDE['Jupiter'], // Current Dasha
    GEMSTONE_GUIDE['Mercury'], // Strong planet
  ].filter(Boolean), [])
  const remedyCategories = [
    {
      category: "For Jupiter Mahadasha (Current Period)",
      color: "yellow",
      remedies: [
        "Visit temple daily and offer prayers",
        "Abstain from drinking alcohol completely",
        "Offer rice to running water on Thursdays",
        "Study sacred texts and philosophical books",
        "Donate yellow items and turmeric to Brahmins",
        "Chant 'Om Namah Shivaya' 108 times daily",
      ],
    },
    {
      category: "For Sade Sati (Current Challenge)",
      color: "blue",
      remedies: [
        "Chant Hanuman Chalisa daily",
        "Donate black sesame seeds on Saturdays",
        "Serve the elderly and differently-abled",
        "Offer mustard oil to Shani temple",
        "Wear blue sapphire after proper consultation",
        "Feed black dogs and crows regularly",
      ],
    },
    {
      category: "For Life Path 13/4 (Karmic Debt)",
      color: "red",
      remedies: [
        "Maintain strict daily discipline and routines",
        "Serve others without expectation of reward",
        "Build things that last and have lasting value",
        "Practice patience and persistence in all endeavors",
        "Avoid procrastination and complete all tasks",
        "Transform negative thinking into positive action",
      ],
    },
    {
      category: "For Health & Vitality",
      color: "green",
      remedies: [
        "Practice pranayama for 10 minutes each morning",
        "Maintain regular exercise for circulation",
        "Avoid excessive mental stress and overwork",
        "Eat sattvic food and avoid non-vegetarian items",
        "Get adequate sleep and maintain sleep schedule",
        "Practice meditation for nervous system balance",
      ],
    },
    {
      category: "For Career & Success",
      color: "purple",
      remedies: [
        "Offer water to Sun every morning",
        "Donate books and educational materials",
        "Help students and share knowledge freely",
        "Maintain honesty and ethical conduct in work",
        "Serve teachers and learned people",
        "Study and practice your chosen field diligently",
      ],
    },
    {
      category: "For Relationships & Marriage",
      color: "pink",
      remedies: [
        "Offer white flowers to Venus on Fridays",
        "Donate white clothes and sweets to women",
        "Maintain purity in thoughts and actions",
        "Respect and serve your parents",
        "Practice forgiveness and compassion",
        "Chant 'Om Shri Radha Krishnaya Namaha' for harmony",
      ],
    },
  ]

  const gemstoneRecommendations = [
    {
      stone: "Blue Sapphire (Primary)",
      planet: "Saturn",
      benefits: "Discipline, focus, career success, Sade Sati relief",
      caution: "Must be tested for 3 days before permanent wearing",
      weight: "3-5 carats",
      metal: "Silver or white gold",
      finger: "Middle finger of right hand",
      day: "Saturday morning",
    },
    {
      stone: "Emerald (Secondary)",
      planet: "Mercury",
      benefits: "Communication, intelligence, business success",
      caution: "Good for Mercury periods and communication work",
      weight: "3-4 carats",
      metal: "Gold",
      finger: "Little finger of right hand",
      day: "Wednesday morning",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Main Remedies Section */}
      <Card className="bg-gradient-to-br from-slate-900/50 to-indigo-900/30 border-indigo-500/30 p-8 backdrop-blur-sm">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold text-indigo-400 text-center flex items-center justify-center mb-8"
        >
          <Music className="w-6 h-6 mr-2" />
          Personalized Karma Remedies &amp; Spiritual Practices
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-6">
          {remedyCategories.map((category, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                className={`bg-gradient-to-br from-slate-800/30 to-${category.color}-900/20 border-${category.color}-500/30 p-6`}
              >
                <h3 className={`text-lg font-bold text-${category.color}-400 mb-4`}>{category.category}</h3>
                <ul className="space-y-2">
                  {category.remedies.map((remedy, idx) => (
                    <li key={idx} className="flex items-start space-x-3">
                      <CheckCircle className={`w-4 h-4 text-${category.color}-400 mt-0.5 flex-shrink-0`} />
                      <p className="text-gray-300 text-sm">{remedy}</p>
                    </li>
                  ))}
                </ul>
              </Card>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Today's Charity - NEW */}
      <Card className="bg-gradient-to-br from-slate-900/50 to-pink-900/30 border-pink-500/30 p-6 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-pink-400 flex items-center">
            <Gift className="w-6 h-6 mr-2" />
            Today's Charity ({todayCharity.day})
          </h3>
          <Badge className="bg-pink-500/20 text-pink-400 border-pink-500/30">
            {todayCharity.planet} Day
          </Badge>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-amber-400 mb-2">What to Donate:</h4>
            <ul className="space-y-1">
              {todayCharity.items.map((item, i) => (
                <li key={i} className="flex items-center text-sm text-gray-300">
                  <span className="text-amber-400 mr-2">•</span> {item}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-cyan-400 mb-2">To Whom:</h4>
            <ul className="space-y-1">
              {todayCharity.recipients.map((recipient, i) => (
                <li key={i} className="flex items-center text-sm text-gray-300">
                  <span className="text-cyan-400 mr-2">•</span> {recipient}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-4 p-3 bg-green-500/10 rounded-lg border border-green-500/30">
          <p className="text-sm text-green-300">
            <span className="font-semibold">Benefits:</span> {todayCharity.benefits}
          </p>
        </div>
      </Card>

      {/* Professional Gemstone Wearing Guide - NEW */}
      <Card className="bg-gradient-to-br from-slate-900/50 to-purple-900/30 border-purple-500/30 p-6 backdrop-blur-sm">
        <h3 className="text-xl font-bold text-purple-400 mb-6 flex items-center justify-center">
          <Gem className="w-6 h-6 mr-2" />
          Professional Gemstone Wearing Guide
        </h3>

        <div className="grid md:grid-cols-3 gap-4">
          {recommendedGems.map((gem, i) => (
            <Card key={i} className={`p-4 bg-gradient-to-br from-slate-800/30 to-${gem.planet === 'Saturn' ? 'blue' : gem.planet === 'Jupiter' ? 'yellow' : 'green'}-900/20 border-${gem.planet === 'Saturn' ? 'blue' : gem.planet === 'Jupiter' ? 'yellow' : 'green'}-500/30`}>
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <h4 className={`font-bold text-${gem.planet === 'Saturn' ? 'blue' : gem.planet === 'Jupiter' ? 'yellow' : 'green'}-400`}>
                    {gem.gemstone}
                  </h4>
                  <Badge className="text-xs bg-slate-700">{gem.planet}</Badge>
                </div>

                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Metal:</span>
                    <span className="text-gray-300">{gem.metal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Finger:</span>
                    <span className="text-gray-300">{gem.finger}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Hand:</span>
                    <span className="text-gray-300">{gem.hand}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Weight:</span>
                    <span className="text-gray-300">{gem.weight}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Best Day:</span>
                    <span className="text-gray-300">{gem.bestDay}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-700">
                  <p className="text-xs text-cyan-400">{gem.mantraBeforeWearing}</p>
                </div>

                {gem.caution && (
                  <div className="p-2 bg-orange-500/10 rounded border border-orange-500/30">
                    <p className="text-xs text-orange-300">⚠️ {gem.caution}</p>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      </Card>

      {/* Special Planetary Remedies */}
      <Card className="bg-gradient-to-br from-slate-900/50 to-red-900/30 border-red-500/30 p-8 backdrop-blur-sm">
        <h3 className="text-xl font-bold text-red-400 mb-6 text-center flex items-center justify-center">
          <Sparkles className="w-6 h-6 mr-2" />
          Special Planetary Remedies & Time Phases
        </h3>

        <div className="space-y-6">
          {[
            {
              planet: "Saturn (Sade Sati - Current)",
              impact: "High Intensity",
              timePhase: "Apr 2022 - Mar 2025",
              color: "red",
              percentage: 85,
              remedies: [
                "Chant Hanuman Chalisa daily without fail",
                "Donate black sesame seeds every Saturday",
                "Serve elderly and differently-abled people",
                "Offer mustard oil to Shani temple",
                "Feed black dogs and crows regularly",
              ],
            },
            {
              planet: "Jupiter (Mahadasha - Ending)",
              impact: "Excellent",
              timePhase: "Jul 2011 - Jul 2027",
              color: "yellow",
              percentage: 92,
              remedies: [
                "Visit temple daily and maintain spiritual practices",
                "Abstain from alcohol completely",
                "Offer rice to running water on Thursdays",
                "Study sacred texts and philosophical works",
                "Donate yellow items to Brahmins",
              ],
            },
            {
              planet: "Moon (Lagna Lord)",
              impact: "Moderate",
              timePhase: "Lifelong Influence",
              color: "blue",
              percentage: 70,
              remedies: [
                "Chant 'Om Chandraya Namah' 108 times on Mondays",
                "Donate white items and milk on Mondays",
                "Practice meditation near water bodies",
                "Maintain emotional balance through yoga",
                "Serve mother and elderly women",
              ],
            },
          ].map((remedy, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.2 }}
            >
              <Card
                className={`p-6 bg-gradient-to-br from-slate-800/30 to-${remedy.color}-900/20 border-${remedy.color}-500/30`}
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full bg-${remedy.color}-500`}></div>
                      <h4 className={`text-lg font-bold text-${remedy.color}-400`}>{remedy.planet}</h4>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge
                        className={`bg-${remedy.color}-500/20 text-${remedy.color}-400 border-${remedy.color}-500/30`}
                      >
                        {remedy.impact}
                      </Badge>
                      <span className={`text-${remedy.color}-400 font-bold`}>{remedy.percentage}%</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Remedy Effectiveness</span>
                      <span className={`text-${remedy.color}-400`}>{remedy.percentage}%</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div
                        className={`bg-gradient-to-r from-${remedy.color}-400 to-${remedy.color}-600 h-2 rounded-full transition-all duration-1000`}
                        style={{ width: `${remedy.percentage}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="text-sm text-gray-400">
                    <span className="font-semibold">Time Phase:</span> {remedy.timePhase}
                  </div>

                  <div className="space-y-2">
                    <h5 className={`font-semibold text-${remedy.color}-400`}>Specific Remedies:</h5>
                    <ul className="space-y-1">
                      {remedy.remedies.map((item, idx) => (
                        <li key={idx} className="flex items-start space-x-2">
                          <span className={`text-${remedy.color}-400 mt-1`}>•</span>
                          <span className="text-gray-300 text-sm">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Daily Spiritual Routine - Keep the existing emojis */}
      <Card className="bg-gradient-to-br from-slate-900/50 to-orange-900/30 border-orange-500/30 p-8 backdrop-blur-sm">
        <h3 className="text-xl font-bold text-orange-400 mb-6 text-center">Daily Spiritual Routine</h3>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center space-y-3">
            <div className="w-16 h-16 mx-auto bg-orange-500/20 rounded-full flex items-center justify-center">
              <span className="text-2xl">🌅</span>
            </div>
            <h4 className="font-semibold text-orange-400">Morning (5:30-7:00 AM)</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• Wake up early and offer water to Sun</li>
              <li>• Chant Om Namah Shivaya 108 times</li>
              <li>• Practice 10 minutes pranayama</li>
              <li>• Read spiritual texts</li>
            </ul>
          </div>

          <div className="text-center space-y-3">
            <div className="w-16 h-16 mx-auto bg-orange-500/20 rounded-full flex items-center justify-center">
              <span className="text-2xl">☀️</span>
            </div>
            <h4 className="font-semibold text-orange-400">Daytime</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• Maintain ethical conduct in work</li>
              <li>• Help others without expectation</li>
              <li>• Practice mindful communication</li>
              <li>• Avoid negative thoughts</li>
            </ul>
          </div>

          <div className="text-center space-y-3">
            <div className="w-16 h-16 mx-auto bg-orange-500/20 rounded-full flex items-center justify-center">
              <span className="text-2xl">🌙</span>
            </div>
            <h4 className="font-semibold text-orange-400">Evening</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• Visit temple or meditate</li>
              <li>• Chant Hanuman Chalisa</li>
              <li>• Reflect on the day's actions</li>
              <li>• Practice gratitude</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Enhanced Gemstone Recommendations */}
      <GemstoneRecommendations />

      {/* Mantra Practice Section */}
      <Card className="bg-gradient-to-br from-slate-900/50 to-indigo-900/30 border-indigo-500/30 p-8 backdrop-blur-sm">
        <h3 className="text-xl font-bold text-indigo-400 mb-6 text-center flex items-center justify-center">
          <Music className="w-6 h-6 mr-2" />
          Mantra Practice
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <MantraPlayer
            title="Shiva Mantra (Daily)"
            mantra="Om Namah Shivaya"
            repetitions={108}
          />
          <MantraPlayer
            title="Saturn Mantra (Saturdays)"
            mantra="Om Sham Shanicharaya Namah"
            repetitions={108}
          />
          <MantraPlayer
            title="Jupiter Mantra (Thursdays)"
            mantra="Om Brim Brihaspataye Namah"
            repetitions={108}
          />
          <MantraPlayer
            title="Hanuman Chalisa"
            mantra="Shri Guru Charan Saroj Raj, Nij Man Mukar Sudhari"
            repetitions={1}
          />
        </div>
      </Card>

      {/* Remedy Tracking */}
      <Card className="bg-gradient-to-br from-slate-900/50 to-green-900/30 border-green-500/30 p-6">
        <h4 className="text-lg font-bold text-green-400 mb-4">Important Remedy Guidelines</h4>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <h5 className="text-cyan-400 font-semibold">Do's:</h5>
            <ul className="text-gray-300 space-y-1">
              <li>• Start remedies on auspicious days</li>
              <li>• Maintain consistency and faith</li>
              <li>• Keep a remedy diary</li>
              <li>• Combine with positive lifestyle changes</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h5 className="text-red-400 font-semibold">Don'ts:</h5>
            <ul className="text-gray-300 space-y-1">
              <li>• Don't expect immediate results</li>
              <li>• Avoid doing remedies mechanically</li>
              <li>• Don't mix too many remedies at once</li>
              <li>• Never do remedies with negative intentions</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  )
}
