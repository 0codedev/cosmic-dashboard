"use client"

import { useMemo } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, Users, Star, Sparkles, Crown, AlertTriangle, CheckCircle, Shield } from "lucide-react"
import { checkManglikDosha, predictSpouseFromD9, ManglikResult, SpousePrediction } from "@/lib/compatibility-engine"
import { useAstrologyStore } from "@/stores/astrology-store"
import { normalize } from "@/lib/cosmic-engine"
import { PlanetaryPosition, PlanetName } from "@/types/astrology"

// Get house number from "3rd", "1st" -> 3, 1
const getHouseNum = (val: string): number => {
  return parseInt(val) || 0;
}

// Calculate House Distance (1..12) from Planet A to Planet B
const getHouseDistance = (fromHouse: number, toHouse: number): number => {
  // Distance from A to B counting inclusive
  // If same house, distance 1.
  // If A is 1, B is 2, distance 2.
  // Formula: (to - from + 12) % 12 + 1
  return ((toHouse - fromHouse + 12) % 12) + 1;
}

// Calculate Navamsha (D9) Sign Index (0-11) from Longitude
const getNavamshaSignIndex = (longitude: number): number => {
  // 1. Get Rashi (Sign) index (0-11)
  const signIndex = Math.floor(longitude / 30);
  // 2. Get Degree within sign
  const degreeInSign = longitude % 30;
  // 3. Get Pada (1-9)
  const pada = Math.floor(degreeInSign / 3.333333333);

  // Navamsha Logic:
  // Fire Signs (0, 4, 8) -> Start from Aries (0)
  // Earth Signs (1, 5, 9) -> Start from Capricorn (9)
  // Air Signs (2, 6, 10) -> Start from Libra (6)
  // Water Signs (3, 7, 11) -> Start from Cancer (3)

  // Simplification: Element offset
  // Fire (1,5,9): Offset 0 (Aries)
  // Earth (2,6,10): Offset 9 (Capricorn)
  // Air (3,7,11): Offset 6 (Libra)
  // Water (4,8,12): Offset 3 (Cancer)

  const element = signIndex % 4;
  let startSignIndex = 0;
  if (element === 0) startSignIndex = 0; // Fire
  if (element === 1) startSignIndex = 9; // Earth
  if (element === 2) startSignIndex = 6; // Air
  if (element === 3) startSignIndex = 3; // Water

  return (startSignIndex + pada) % 12;
}

const SIGNS = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];

export default function LoveMarriage() {
  const { userData } = useAstrologyStore()

  // Dynamic Manglik Analysis
  const manglikAnalysis = useMemo<ManglikResult>(() => {
    if (!userData || !userData.planetaryPositions) {
      return {
        isManglik: false,
        intensity: "None",
        affectedHouses: [],
        isCancelled: false,
        cancellations: [],
        remedies: []
      }
    }

    const pp = userData.planetaryPositions;
    const marsHouse = getHouseNum(pp.mars.house);
    const marsSign = pp.mars.sign;

    // Aspects
    const jupiterHouse = getHouseNum(pp.jupiter.house);
    const marsJupDist = getHouseDistance(marsHouse, jupiterHouse); // Jupiter from Mars
    // Wait, aspect means "Planet A aspects Planet B".
    // Jupiter aspects 5, 7, 9 houses from Itself.
    // So we check calculate distance FROM Jupiter TO Mars.
    const jupToMarsDist = getHouseDistance(jupiterHouse, marsHouse);
    const jupiterAspects = [1, 5, 7, 9].includes(jupToMarsDist); // 1 is conjunction

    const venusHouse = getHouseNum(pp.venus.house);
    const venusConj = venusHouse === marsHouse;

    // Saturn aspects 3, 7, 10 houses from Itself.
    const saturnHouse = getHouseNum(pp.saturn.house);
    const satToMarsDist = getHouseDistance(saturnHouse, marsHouse);
    const saturnAspects = [1, 3, 7, 10].includes(satToMarsDist);

    // Moon in Kendra from Mars (1, 4, 7, 10 relative)
    const moonHouse = getHouseNum(pp.moon.house);
    const marsToMoonDist = getHouseDistance(marsHouse, moonHouse);
    const moonInKendra = [1, 4, 7, 10].includes(marsToMoonDist);

    return checkManglikDosha(
      marsHouse,
      marsSign,
      jupiterAspects, // Correct logic: Jupiter influences Mars if J aspects M
      venusConj,
      saturnAspects,
      moonInKendra
    )
  }, [userData])

  // Dynamic Spouse Prediction (D9/Navamsha)
  const spousePrediction = useMemo<SpousePrediction>(() => {
    if (!userData || !userData.planetaryPositions) {
      return predictSpouseFromD9("Libra", "Venus", "Pisces", "Capricorn", "Male")
    }

    // D9 Calculation
    const pp = userData.planetaryPositions;

    // 1. D9 Lagna
    // We need lagnaLongitude. If not present (legacy/error case), fallback.
    const lagnaLon = userData.lagnaLongitude;

    if (lagnaLon === undefined) {
      // Fallback: Use D1 7th house as proxy if D9 not calculable
      // Or better, just hardcode "Libra" to prevent crash
      return predictSpouseFromD9("Libra", "Venus", "Pisces", "Capricorn", userData.sex || "Male");
    }

    const d9LagnaIndex = getNavamshaSignIndex(lagnaLon);
    const d9LagnaSign = SIGNS[d9LagnaIndex];

    // 2. D9 7th House Sign
    const d9SeventhSignIndex = (d9LagnaIndex + 6) % 12;
    const d9SeventhSign = SIGNS[d9SeventhSignIndex];

    // 3. D9 7th Lord
    const signLords: Record<string, PlanetName> = {
      "Aries": "mars", "Taurus": "venus", "Gemini": "mercury", "Cancer": "moon",
      "Leo": "sun", "Virgo": "mercury", "Libra": "venus", "Scorpio": "mars",
      "Sagittarius": "jupiter", "Capricorn": "saturn", "Aquarius": "saturn", "Pisces": "jupiter"
    };
    const d9SeventhLordName = signLords[d9SeventhSign];

    // 4. Position of 7th Lord in D9
    // Calculate D9 sign of that planet
    const lordD1Lon = pp[d9SeventhLordName].absoluteLongitude || 0;
    const d9SeventhLordSignIndex = getNavamshaSignIndex(lordD1Lon);
    const d9SeventhLordSign = SIGNS[d9SeventhLordSignIndex];

    // 5. Jupiter Sign in D9
    const jupD1Lon = pp.jupiter.absoluteLongitude || 0;
    const d9JupiterSignIndex = getNavamshaSignIndex(jupD1Lon);
    const d9JupiterSign = SIGNS[d9JupiterSignIndex];

    const userGender = userData.sex === "Female" ? "Female" : "Male";

    return predictSpouseFromD9(
      d9SeventhSign,
      capitalize(d9SeventhLordName),
      d9SeventhLordSign,
      d9JupiterSign,
      userGender
    );
  }, [userData])

  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);


  // Static for now, could be dynamic later
  const loveTimeline = [
    {
      phase: "First Crush & Attraction",
      period: "2018-2020 (Age 13-15)",
      status: "completed",
      icon: "💕",
      color: "pink",
      planetaryInfluence: "Venus in 10th house activation",
      description: "Early romantic attractions and innocent crushes during teenage years",
      characteristics: [
        "Attraction to creative and artistic personalities",
        "Preference for intelligent and well-spoken individuals",
        "Shy approach to expressing feelings initially",
        "Dreams of ideal romantic scenarios",
      ],
      astrologyInsights: [
        "Venus in Scorpio creates intense but hidden attractions",
        "Moon in Aquarius seeks intellectual connection first",
        "Shatabhisha nakshatra brings unique romantic preferences",
      ],
    },
    {
      phase: "Deep Emotional Connection",
      period: "2021-2023 (Age 16-18)",
      status: "completed",
      icon: "💖",
      color: "red",
      planetaryInfluence: "Jupiter-Moon combination (Gajakesari Yoga)",
      description: "Formation of meaningful emotional bonds and deeper understanding of love",
      characteristics: [
        "Seeking emotional depth and spiritual connection",
        "Attraction to wise and mature personalities",
        "Preference for long conversations and mental stimulation",
        "Beginning to understand true compatibility",
      ],
      astrologyInsights: [
        "Jupiter's influence brings wisdom in relationship choices",
        "Gajakesari Yoga attracts noble and generous partners",
        "7th lord Sun in 8th house indicates transformative relationships",
      ],
    },
    {
      phase: "Transformative Relationships",
      period: "2024-2026 (Age 19-21)",
      status: "current",
      icon: "🔥",
      color: "orange",
      planetaryInfluence: "Sade Sati setting phase influence",
      description: "Relationships that teach important life lessons and promote personal growth",
      characteristics: [
        "Relationships that challenge and transform you",
        "Learning about commitment and responsibility",
        "Attraction to healing and nurturing personalities",
        "Understanding the difference between love and attachment",
      ],
      astrologyInsights: [
        "Saturn's influence brings serious relationship lessons",
        "8th house emphasis creates deep, transformative bonds",
        "Rahu in 2nd house may bring foreign or unusual connections",
      ],
    },
    {
      phase: "Female Friendships & Guidance",
      period: "2025-2027 (Age 20-22)",
      status: "upcoming",
      icon: "👭",
      color: "purple",
      planetaryInfluence: "Venus and Moon harmonious periods",
      description: "Strong female friendships that provide emotional support and guidance",
      characteristics: [
        "Deep friendships with spiritually inclined women",
        "Guidance from older, wiser female mentors",
        "Learning about feminine energy and intuition",
        "Support system during challenging times",
      ],
      astrologyInsights: [
        "Moon in 1st house attracts nurturing female friends",
        "Venus in 10th house brings successful women into your circle",
        "Shatabhisha nakshatra connects with healing-oriented women",
      ],
    },
    {
      phase: "Soulmate Recognition",
      period: "2028-2030 (Age 23-25)",
      status: "future",
      icon: "✨",
      color: "gold",
      planetaryInfluence: "Jupiter's continued blessing and Saturn's maturity",
      description: "Meeting and recognizing your life partner and soulmate",
      characteristics: [
        "Instant recognition and deep spiritual connection",
        "Partner who supports your dharma and life purpose",
        "Mutual respect for each other's spiritual journey",
        "Feeling of coming home and completeness",
      ],
      astrologyInsights: [
        "Jupiter in 9th house brings dharmic partnership",
        "Venus in 10th house indicates partner brings status and respect",
        "No Mangal Dosha ensures harmonious married life",
      ],
    },
    {
      phase: "Marriage & Union",
      period: "2030-2032 (Age 25-27)",
      status: "future",
      icon: "💍",
      color: "blue",
      planetaryInfluence: "Optimal timing after Sade Sati completion",
      description: "Sacred union and beginning of married life journey",
      characteristics: [
        "Marriage to generous and caring partner",
        "Union blessed by family and society",
        "Partner from educated and respectable family",
        "Beginning of prosperous married life",
      ],
      astrologyInsights: [
        "Marriage after age 25 as recommended in birth chart",
        "Partner characteristics match Venus in Scorpio placement",
        "7th house influences indicate highly satisfying married life",
      ],
    },
  ]

  const spouseCharacteristics = [
    {
      trait: "Generous & Caring Nature",
      description: "Venus in 10th house indicates a partner who is naturally giving and nurturing",
      icon: "💝",
      color: "pink",
    },
    {
      trait: "Brings Good Fortune",
      description: "Partner will enhance your social status and bring prosperity to your life",
      icon: "🍀",
      color: "green",
    },
    {
      trait: "Spiritually Supportive",
      description: "Will support and encourage your spiritual growth and dharmic pursuits",
      icon: "🙏",
      color: "purple",
    },
    {
      trait: "Educated Background",
      description: "Likely from well-educated family with strong values and principles",
      icon: "📚",
      color: "blue",
    },
    {
      trait: "Foreign Connection",
      description: "May have connection to foreign countries or different cultural background",
      icon: "🌍",
      color: "cyan",
    },
  ]

  const relationshipChallenges = [
    {
      challenge: "Emotional Maturity",
      solution: "Develop patience and understanding through spiritual practices",
      period: "Early relationships",
      color: "orange",
    },
    {
      challenge: "Independence vs Partnership",
      solution: "Learn to balance personal freedom with commitment",
      period: "Mid-twenties",
      color: "yellow",
    },
    {
      challenge: "Communication During Stress",
      solution: "Practice open dialogue and avoid withdrawal during difficult times",
      period: "Throughout life",
      color: "red",
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-4">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-400 via-red-400 to-purple-400 bg-clip-text text-transparent">
          Love, Relationships & Marriage
        </h2>
        <p className="text-gray-300 max-w-3xl mx-auto">
          Your romantic journey is blessed by planetary influences.
          Discover the timeline of your love life and the characteristics of your destined life partner.
        </p>
      </motion.div>

      {/* Love Life Timeline */}
      <Card className="bg-gradient-to-br from-slate-900/50 to-pink-900/30 border-pink-500/30 p-8 backdrop-blur-sm">
        <h3 className="text-2xl font-bold text-pink-400 mb-6 text-center flex items-center justify-center">
          <Heart className="w-6 h-6 mr-2" />
          Your Love Life Timeline
        </h3>

        <div className="space-y-6">
          {loveTimeline.map((phase, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative bg-gradient-to-r from-slate-800/30 to-${phase.color}-900/20 border border-${phase.color}-500/30 rounded-lg p-6`}
            >
              {/* Timeline connector */}
              {index < loveTimeline.length - 1 && (
                <div className="absolute left-8 top-full w-0.5 h-6 bg-gradient-to-b from-gray-400 to-transparent"></div>
              )}

              <div className="flex items-start space-x-4">
                <div
                  className={`w-16 h-16 bg-${phase.color}-500/20 rounded-full flex items-center justify-center text-2xl border-2 border-${phase.color}-500/30`}
                >
                  {phase.icon}
                </div>

                <div className="flex-1 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className={`text-xl font-bold text-${phase.color}-400`}>{phase.phase}</h4>
                      <p className="text-gray-400 text-sm">{phase.period}</p>
                    </div>
                    <Badge
                      className={`${phase.status === "completed"
                        ? "bg-green-500/20 text-green-400 border-green-500/30"
                        : phase.status === "current"
                          ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                          : "bg-blue-500/20 text-blue-400 border-blue-500/30"
                        }`}
                    >
                      {phase.status.charAt(0).toUpperCase() + phase.status.slice(1)}
                    </Badge>
                  </div>

                  <p className="text-gray-300">{phase.description}</p>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-semibold text-cyan-400 mb-2">Characteristics</h5>
                      <ul className="space-y-1">
                        {phase.characteristics.map((char, i) => (
                          <li key={i} className="flex items-start space-x-2">
                            <span className="text-cyan-400 mt-1 text-xs">●</span>
                            <span className="text-gray-300 text-sm">{char}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h5 className="font-semibold text-purple-400 mb-2">Astrological Insights</h5>
                      <ul className="space-y-1">
                        {phase.astrologyInsights.map((insight, i) => (
                          <li key={i} className="flex items-start space-x-2">
                            <span className="text-purple-400 mt-1 text-xs">●</span>
                            <span className="text-gray-300 text-sm">{insight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <span className="text-yellow-400 font-semibold text-sm">Planetary Influence: </span>
                    <span className="text-gray-300 text-sm">{phase.planetaryInfluence}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Marriage Analysis */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-slate-900/50 to-green-900/30 border-green-500/30 p-6 backdrop-blur-sm">
          <h4 className="text-xl font-bold text-green-400 mb-4 flex items-center">
            <Shield className="w-5 h-5 mr-2" />
            Manglik Dosha Analysis
          </h4>
          <div className="space-y-4">
            {/* Manglik Status */}
            <div className={`rounded-lg p-4 ${manglikAnalysis.isManglik ? 'bg-orange-500/10 border border-orange-500/30' : 'bg-green-500/10 border border-green-500/30'}`}>
              <div className="flex items-center justify-between mb-2">
                <h5 className={`font-semibold ${manglikAnalysis.isManglik ? 'text-orange-400' : 'text-green-400'}`}>
                  {manglikAnalysis.isManglik ? '⚠️ Manglik Dosha Present' : '✅ No Manglik Dosha'}
                </h5>
                <Badge className={`${manglikAnalysis.isManglik ? 'bg-orange-500/20 text-orange-400' : 'bg-green-500/20 text-green-400'}`}>
                  {manglikAnalysis.intensity}
                </Badge>
              </div>
              <p className="text-gray-300 text-sm">
                {manglikAnalysis.isManglik
                  ? `Mars position in house ${manglikAnalysis.affectedHouses.join(', ')} creates Manglik Dosha.`
                  : 'Mars is not in Manglik houses (1, 4, 7, 8, 12). No need for Manglik matching.'}
              </p>
            </div>

            {/* Cancellation Factors */}
            {manglikAnalysis.isManglik && manglikAnalysis.cancellations.length > 0 && (
              <div className="bg-cyan-500/10 rounded-lg p-4">
                <h5 className="font-semibold text-cyan-400 mb-2">
                  {manglikAnalysis.isCancelled ? <CheckCircle className="w-4 h-4 inline mr-1" /> : <AlertTriangle className="w-4 h-4 inline mr-1" />}
                  {manglikAnalysis.isCancelled ? 'Dosha Cancelled!' : 'Partial Cancellation'}
                </h5>
                <ul className="space-y-1">
                  {manglikAnalysis.cancellations.map((cancel, i) => (
                    <li key={i} className="text-sm text-gray-300 flex items-start">
                      <span className="text-cyan-400 mr-2">✓</span> {cancel}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Remedies */}
            {manglikAnalysis.isManglik && !manglikAnalysis.isCancelled && manglikAnalysis.remedies.length > 0 && (
              <div className="bg-purple-500/10 rounded-lg p-4">
                <h5 className="font-semibold text-purple-400 mb-2">Recommended Remedies</h5>
                <ul className="space-y-1">
                  {manglikAnalysis.remedies.slice(0, 3).map((remedy, i) => (
                    <li key={i} className="text-sm text-gray-300 flex items-start">
                      <span className="text-purple-400 mr-2">•</span> {remedy}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Optimal Timing Info */}
            <div className="bg-yellow-500/10 rounded-lg p-3">
              <h5 className="font-semibold text-yellow-400 text-sm mb-1">Optimal Marriage Timing</h5>
              <p className="text-gray-300 text-xs">
                {spousePrediction.marriageTiming}
              </p>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-slate-900/50 to-red-900/30 border-red-500/30 p-6 backdrop-blur-sm">
          <h4 className="text-xl font-bold text-red-400 mb-4 flex items-center">
            <Users className="w-5 h-5 mr-2" />
            Relationship Challenges
          </h4>
          <div className="space-y-3">
            {relationshipChallenges.map((challenge, index) => (
              <div key={index} className={`bg-${challenge.color}-500/10 rounded-lg p-4`}>
                <h5 className={`font-semibold text-${challenge.color}-400 mb-1`}>{challenge.challenge}</h5>
                <p className="text-gray-300 text-sm mb-2">{challenge.solution}</p>
                <Badge
                  className={`bg-${challenge.color}-500/20 text-${challenge.color}-400 border-${challenge.color}-500/30 text-xs`}
                >
                  {challenge.period}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Spouse Characteristics */}
      <Card className="bg-gradient-to-br from-slate-900/50 to-purple-900/30 border-purple-500/30 p-8 backdrop-blur-sm">
        <h3 className="text-2xl font-bold text-purple-400 mb-6 text-center flex items-center justify-center">
          <Sparkles className="w-6 h-6 mr-2" />
          Your Future Life Partner
        </h3>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {spouseCharacteristics.map((characteristic, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                className={`p-4 bg-gradient-to-br from-slate-800/30 to-${characteristic.color}-900/20 border-${characteristic.color}-500/30`}
              >
                <div className="text-center space-y-3">
                  <div
                    className={`w-12 h-12 mx-auto bg-${characteristic.color}-500/20 rounded-full flex items-center justify-center text-xl`}
                  >
                    {characteristic.icon}
                  </div>
                  <h5 className={`font-semibold text-${characteristic.color}-400`}>{characteristic.trait}</h5>
                  <p className="text-gray-300 text-sm">{characteristic.description}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* D9 Spouse Prediction - From Navamsha Analysis */}
      <Card className="bg-gradient-to-br from-slate-900/50 to-rose-900/30 border-rose-500/30 p-8 backdrop-blur-sm">
        <h3 className="text-2xl font-bold text-rose-400 mb-6 text-center flex items-center justify-center">
          <Star className="w-6 h-6 mr-2" />
          D9 (Navamsha) Spouse Prediction
        </h3>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="bg-pink-500/10 rounded-lg p-4">
              <h5 className="font-semibold text-pink-400 mb-2">Physical Appearance</h5>
              <ul className="space-y-1">
                {spousePrediction.physicalTraits.map((trait, i) => (
                  <li key={i} className="text-sm text-gray-300 flex items-start">
                    <span className="text-pink-400 mr-2">•</span> {trait}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-purple-500/10 rounded-lg p-4">
              <h5 className="font-semibold text-purple-400 mb-2">Personality Traits</h5>
              <ul className="space-y-1">
                {spousePrediction.personality.map((trait, i) => (
                  <li key={i} className="text-sm text-gray-300 flex items-start">
                    <span className="text-purple-400 mr-2">•</span> {trait}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-blue-500/10 rounded-lg p-4">
              <h5 className="font-semibold text-blue-400 mb-2">Likely Profession</h5>
              <ul className="space-y-1">
                {spousePrediction.profession.map((prof, i) => (
                  <li key={i} className="text-sm text-gray-300 flex items-start">
                    <span className="text-blue-400 mr-2">•</span> {prof}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-green-500/10 rounded-lg p-4">
              <h5 className="font-semibold text-green-400 mb-2">Family Background</h5>
              <ul className="space-y-1">
                {spousePrediction.background.map((bg, i) => (
                  <li key={i} className="text-sm text-gray-300 flex items-start">
                    <span className="text-green-400 mr-2">•</span> {bg}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-yellow-500/10 rounded-lg p-4">
              <h5 className="font-semibold text-yellow-400 mb-2">Marriage Timing</h5>
              <p className="text-sm text-gray-300">{spousePrediction.marriageTiming}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Love & Marriage Remedies */}
      <Card className="bg-gradient-to-br from-slate-900/50 to-pink-900/30 border-pink-500/30 p-6 backdrop-blur-sm">
        <h4 className="text-xl font-bold text-pink-400 mb-4 text-center">Love & Marriage Enhancement Remedies</h4>
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <h5 className="font-semibold text-cyan-400 mb-3">For Attracting Love</h5>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>• Worship Goddess Parvati on Fridays</li>
              <li>• Wear rose quartz or diamond jewelry</li>
              <li>• Chant "Om Shri Shukraya Namaha" 108 times</li>
              <li>• Donate white flowers and sweets</li>
              <li>• Practice self-love and inner healing</li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold text-yellow-400 mb-3">For Harmonious Relationships</h5>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>• Read Sundarkand on Tuesdays</li>
              <li>• Keep fresh flowers in the bedroom</li>
              <li>• Practice couple meditation together</li>
              <li>• Avoid arguments on Fridays</li>
              <li>• Share meals prepared with love</li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold text-green-400 mb-3">For Successful Marriage</h5>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>• Perform Gauri-Ganesh puja before marriage</li>
              <li>• Seek blessings from happily married couples</li>
              <li>• Plant tulsi or rose plants together</li>
              <li>• Practice gratitude for your partner daily</li>
              <li>• Maintain purity in thoughts and actions</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  )
}
