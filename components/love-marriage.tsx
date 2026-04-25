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
      return predictSpouseFromD9("Libra", "Venus", "Pisces", "Capricorn", userData.sex === "Female" ? "Female" : "Male");
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
  // Static for now, made generic
  const loveTimeline = [
    {
      phase: "Early Attractions",
      period: "Teens (Age 13-19)",
      status: "completed",
      icon: "💕",
      color: "pink",
      planetaryInfluence: "Venus activation",
      description: "Early romantic attractions and innocent crushes",
      characteristics: [
        "Attraction to creative personalities",
        "Learning to express feelings",
        "Idealistic view of love",
      ],
      astrologyInsights: [
        "Venus influences early preferences",
        "Moon signifies emotional needs",
      ],
    },
    {
      phase: "Emotional Growth",
      period: "Early 20s",
      status: "current",
      icon: "💖",
      color: "red",
      planetaryInfluence: "Jupiter-Moon influence",
      description: "Formation of meaningful emotional bonds and deeper understanding",
      characteristics: [
        "Seeking emotional depth",
        "Meaningful connections",
        "Learning relationship dynamics",
      ],
      astrologyInsights: [
        "Jupiter brings wisdom in love",
        "7th lord activation",
      ],
    },
    {
      phase: "Significant Relationship",
      period: "Mid 20s",
      status: "future",
      icon: "🔥",
      color: "orange",
      planetaryInfluence: "Rahu/Ketu axis",
      description: "Relationships that teach important life lessons",
      characteristics: [
        "Transformative experiences",
        "Karmic connections",
        "Deep emotional lessons",
      ],
      astrologyInsights: [
        "Nodes bring karmic partners",
        "Preparation for marriage",
      ],
    },
    {
      phase: "Soulmate Connection",
      period: "Late 20s",
      status: "future",
      icon: "✨",
      color: "gold",
      planetaryInfluence: "Jupiter blessing",
      description: "Meeting potential life partner",
      characteristics: [
        "Deep spiritual connection",
        "Mutual respect",
        "Long-term compatibility",
      ],
      astrologyInsights: [
        "Darakaraka activation",
        "9th house luck",
      ],
    },
    {
      phase: "Marriage Period",
      period: "Marriageable Age",
      status: "future",
      icon: "💍",
      color: "blue",
      planetaryInfluence: "Jupiter/Venus Transit",
      description: "Sacred union and beginning of married life",
      characteristics: [
        "Formal commitment",
        "Family blessings",
        "Stability and growth",
      ],
      astrologyInsights: [
        "Transit Jupiter aspects 7th house",
        "Dasha support",
      ],
    },
  ]

  const spouseCharacteristics = useMemo(() => {
    if (!spousePrediction) return [];

    // Map from dynamic prediction to the UI format
    // We can take 3 personality traits + 1 profession + 1 background
    const traits = [];

    if (spousePrediction.personality[0]) {
      traits.push({
        trait: "Personality",
        description: spousePrediction.personality[0],
        icon: "💝", color: "pink"
      });
    }

    if (spousePrediction.personality[1]) { // Use 2nd trait
      traits.push({
        trait: "Nature",
        description: spousePrediction.personality[1],
        icon: "✨", color: "purple"
      });
    }

    if (spousePrediction.profession[0]) {
      traits.push({
        trait: "Career",
        description: spousePrediction.profession[0],
        icon: "📚", color: "blue"
      });
    }

    if (spousePrediction.background[0]) {
      traits.push({
        trait: "Background",
        description: spousePrediction.background[0],
        icon: "🌍", color: "cyan"
      });
    }

    if (spousePrediction.physicalTraits[0]) {
      traits.push({
        trait: "Appearance",
        description: spousePrediction.physicalTraits[0],
        icon: "🍀", color: "green"
      });
    }

    return traits;
  }, [spousePrediction]);

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
    {
      challenge: "Ketu/Rahu Axis Intensity",
      solution: "Major transformation in relationships. Avoid ego conflicts; focus on spiritual connection to navigate detachment.",
      period: "2026-2027",
      color: "orange",
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

      {/* Verified Partner Traits (Deep Research Report) */}
      <Card className="bg-gradient-to-r from-slate-900 to-purple-900/40 border-purple-500/30 p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-purple-500/20 rounded-full">
            <Crown className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Verified Partner Traits</h3>
            <p className="text-xs text-purple-300">Based on D9 & Darakaraka Analysis</p>
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-slate-800/50 p-3 rounded-lg border border-purple-500/20">
            <h4 className="text-sm font-semibold text-purple-400 mb-1">Nature</h4>
            <p className="text-gray-300 text-sm">Spiritual, transformative, and non-traditional. Likely deeper/intense personality.</p>
          </div>
          <div className="bg-slate-800/50 p-3 rounded-lg border border-purple-500/20">
            <h4 className="text-sm font-semibold text-pink-400 mb-1">Connection</h4>
            <p className="text-gray-300 text-sm">Karmic bond requiring mutual growth. Not a superficial relationship.</p>
          </div>
          <div className="bg-slate-800/50 p-3 rounded-lg border border-purple-500/20">
            <h4 className="text-sm font-semibold text-blue-400 mb-1">Profession</h4>
            <p className="text-gray-300 text-sm">Likely in healing, research, or occult fields (matching your 7th Lord influence).</p>
          </div>
        </div>
      </Card>

      {/* Verified Partner Traits (Deep Research Report) */}
      <Card className="bg-gradient-to-r from-slate-900 to-purple-900/40 border-purple-500/30 p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-purple-500/20 rounded-full">
            <Crown className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Verified Partner Traits</h3>
            <p className="text-xs text-purple-300">Based on D9 & Darakaraka Analysis</p>
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-slate-800/50 p-3 rounded-lg border border-purple-500/20">
            <h4 className="text-sm font-semibold text-purple-400 mb-1">Nature</h4>
            <p className="text-gray-300 text-sm">Spiritual, transformative, and non-traditional. Likely deeper/intense personality.</p>
          </div>
          <div className="bg-slate-800/50 p-3 rounded-lg border border-purple-500/20">
            <h4 className="text-sm font-semibold text-pink-400 mb-1">Connection</h4>
            <p className="text-gray-300 text-sm">Karmic bond requiring mutual growth. Not a superficial relationship.</p>
          </div>
          <div className="bg-slate-800/50 p-3 rounded-lg border border-purple-500/20">
            <h4 className="text-sm font-semibold text-blue-400 mb-1">Profession</h4>
            <p className="text-gray-300 text-sm">Likely in healing, research, or occult fields (matching your 7th Lord influence).</p>
          </div>
        </div>
      </Card>

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
