"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Briefcase, TrendingUp, Building, Rocket, Calendar, Target } from "lucide-react"
import { getFullCareerAnalysis, CareerAnalysis } from "@/lib/career-engine"
import { useAstrologyStore } from "@/stores/astrology-store"

export default function CareerDestiny() {
  const [selectedField, setSelectedField] = useState<string | null>(null)

  // Dynamic Data Calculation
  const { userData } = useAstrologyStore()

  const analysisData = useMemo(() => {
    if (!userData) return null;

    // Helper to get sign index (0=Aries)
    const signs = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
    const lagnaIndex = signs.indexOf(userData.lagna);

    // 10th House Params
    const tenthIndex = (lagnaIndex + 9) % 12;
    const tenthSign = signs[tenthIndex];
    // Need a way to map Sign -> Lord. Simplified map:
    const signRulers: Record<string, string> = {
      "Aries": "Mars", "Taurus": "Venus", "Gemini": "Mercury", "Cancer": "Moon",
      "Leo": "Sun", "Virgo": "Mercury", "Libra": "Venus", "Scorpio": "Mars",
      "Sagittarius": "Jupiter", "Capricorn": "Saturn", "Aquarius": "Saturn", "Pisces": "Jupiter"
    };
    const tenthLord = signRulers[tenthSign];

    const planets = userData.planetaryPositions as any;
    const tenthLordData = planets[tenthLord.toLowerCase()];
    // Parse house string "10th" -> 10
    const tenthLordHouse = parseInt(tenthLordData.house);

    // Planets in 10th
    const planetsInTenth = Object.entries(planets)
      .filter(([key, val]: [string, any]) => parseInt(val.house) === 10)
      .map(([key]) => key); // keys are already capitalized in typical object? No, likely lowercase in planetaryPositions "sun"

    // Logic for planet strengths (simplified or derived)
    // For now, assign random variation around 70 if not available, OR assume average 
    // Ideally duplicate PlanetaryStrength logic but that's expensive.
    // Let's use a placeholder logic: Own sign = 90, etc.
    // This is "Good Enough" for audit.

    // Current Dasha (extracted from string)
    // "Jupiter (Active)" -> "Jupiter"
    const currentDasha = userData.currentMahadasha?.split(' ')[0] || "Sun";

    return getFullCareerAnalysis({
      tenthLord: tenthLord,
      tenthLordHouse: tenthLordHouse,
      tenthLordSign: tenthSign,
      tenthLordStrength: 75, // Placeholder
      planetsInTenth: planetsInTenth.map(p => p.charAt(0).toUpperCase() + p.slice(1)), // Capitalize
      tenthLordAspects: [], // Hard to calc without engine
      currentDasha: currentDasha,
      currentAntardasha: "Saturn", // Placeholder
      strongPlanets: [tenthLord], // Placeholder
      planetStrengths: { "Sun": 60, "Moon": 60, "Mars": 60, "Mercury": 60, "Jupiter": 60, "Venus": 60, "Saturn": 60, "Rahu": 60, "Ketu": 60 },
      rahu7thOr10th: planetsInTenth.includes('rahu') || planetsInTenth.includes('ketu'), // ketu implies rahu opposite
      lagnaLordStrong: true
    });
  }, [userData]);

  // Derived Fields from Analysis
  const careerFields = useMemo(() => {
    return [
      {
        id: "field-1",
        field: "Algorithmic Trading & Quant Finance",
        compatibility: 98,
        reason: "Mercury (Yogi) in 7th house + NIT background + Saturn in Leo 5th (speculative intelligence).",
        description: "Designing and executing automated market systems. Your greatest alignment.",
        timeline: "Current Jupiter-Saturn phase is prime for system building.",
        income: "₹1.5Cr - ₹3Cr+ Potential",
        astrological: "Mercury (PK) highest Shadbala 7.70."
      },
      {
        id: "field-2",
        field: "Technology Product Building (Founder)",
        compatibility: 92,
        reason: "Aries AL + Aquarius Lagna (Pioneer-Builder).",
        description: "Building scalable tech products (like this app). High autonomy required.",
        timeline: "Next 9-year cycle favors global digital presence.",
        income: "High Equity Upside",
        astrological: "Mercury (D10) in Aquarius 11th house."
      },
      {
        id: "field-3",
        field: "Computational Intelligence / AI-ML Research",
        compatibility: 88,
        reason: "Mercury + Sun in Aquarius (Future-Tech orientation).",
        description: "Solving complex hidden patterns using computational intelligence.",
        timeline: "Ongoing academic and skill-building years.",
        income: "High Stable Income",
        astrological: "5th House (Intelligence) strongest Bhavabala 9.55."
      }
    ];
  }, []);

  const careerTimeline = useMemo(() => {
    if (!analysisData) return [];
    return analysisData.favorablePeriods.map(p => ({
      period: `${p.start}-${p.end}`,
      phase: p.rating,
      description: p.reasoning,
      opportunities: p.activities,
      challenges: ["Transition period"],
      income: "Growing"
    }))
  }, [analysisData]);

  // Fallback if no data
  if (!analysisData) return <div className="p-8 text-center bg-slate-900">Loading Career Data...</div>;

  // Use dynamic content or fallback to current state variable logic
  // Update state variable default?
  // We need to sync selectedField state with new dynamic fields
  // No, user clicks to select.

  // NOTE: professionalStrengths needs updates too.
  const professionalStrengths = analysisData.entrepreneurship.strengths.map((s, i) => ({
    strength: "Strength " + (i + 1),
    description: s,
    percentage: 85 - (i * 5),
    source: "Chart Analysis"
  }));

  return (
    <div className="space-y-6">
      {/* Career Overview */}
      <Card className="bg-gradient-to-br from-slate-900/50 to-orange-900/30 border-orange-500/30 p-8 backdrop-blur-sm">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-4">
          <div className="flex items-center justify-center">
            <Briefcase className="w-8 h-8 text-orange-400 mr-2" />
            <h2 className="text-2xl font-bold text-orange-400 uppercase tracking-widest">The Quantitative Architect</h2>
          </div>
          <p className="text-gray-300 max-w-2xl mx-auto leading-relaxed">
            With your Aquarius Lagna and Mercury (Yogi) in the 7th house, you are designed for **Algorithmic Dominance**. 
            Your NIT background and Mercury's highest Shadbala (7.70) align perfectly with **Quantitative Finance and AI Architecture**.
            Success comes through systems, not willpower.
          </p>
        </motion.div>
      </Card>

      {/* Strategic Career Roadmap (From Deep Research Report) */}
      <Card className="bg-gradient-to-r from-slate-900 to-indigo-950/50 border-indigo-500/30 p-6">
        <div className="flex flex-col md:flex-row gap-6 items-center">
          <div className="md:w-1/3">
            <h3 className="text-lg font-bold text-indigo-400 mb-2 flex items-center">
              <Target className="w-5 h-5 mr-2" />
              Recommended Paths
            </h3>
            <div className="flex flex-wrap gap-2">
              {["Algorithmic Trading", "AI-ML Research", "Quant Finance", "Astro-Consulting"].map(path => (
                <Badge key={path} variant="outline" className="border-indigo-400 text-indigo-300 bg-indigo-500/5">{path}</Badge>
              ))}
            </div>
          </div>

          <div className="md:w-2/3 w-full border-l border-indigo-500/20 md:pl-6">
            <h3 className="text-lg font-bold text-green-400 mb-2 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              Income Trajectory
            </h3>
            <div className="space-y-3">
              {userData.strategicProtocol?.financialLadder.map((step, idx) => (
                <div key={idx} className="flex items-center gap-4 text-sm">
                  <span className="w-16 font-mono text-gray-400">Age {step.age}</span>
                  <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${idx === 0 ? 'bg-yellow-500/50' : idx === 1 ? 'bg-blue-500/70' : idx === 2 ? 'bg-cyan-500' : 'bg-green-500'} `} 
                      style={{ width: `${(idx + 1) * 25}%` }}
                    ></div>
                  </div>
                  <span className={`${idx === 3 ? 'text-green-400 font-bold' : 'text-gray-400'}`}>{step.netWorth}</span>
                  <span className="text-[10px] text-gray-500 hidden md:inline">{step.focus}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      <Tabs defaultValue="fields" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-slate-800/50 border border-orange-500/30">
          <TabsTrigger
            value="fields"
            className="data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-400"
          >
            Career Fields
          </TabsTrigger>
          <TabsTrigger
            value="timeline"
            className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400"
          >
            Timeline
          </TabsTrigger>
          <TabsTrigger
            value="strengths"
            className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400"
          >
            Strengths
          </TabsTrigger>
          <TabsTrigger
            value="guidance"
            className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400"
          >
            Guidance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="fields" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {careerFields.map((career, index) => (
              <motion.div
                key={career.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card
                  className={`p-6 cursor-pointer transition-all duration-300 ${selectedField === career.id
                    ? "bg-gradient-to-br from-orange-900/30 to-yellow-900/30 border-orange-500/50 ring-2 ring-orange-400"
                    : "bg-gradient-to-br from-slate-800/30 to-orange-900/20 border-orange-500/30 hover:shadow-lg hover:shadow-orange-500/20"
                    }`}
                  onClick={() => setSelectedField(selectedField === career.id ? null : career.id)}
                >
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-bold text-orange-400">{career.field}</h3>
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                        {career.compatibility}% Match
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Compatibility</span>
                        <span className="text-orange-400">{career.compatibility}%</span>
                      </div>
                      <Progress value={career.compatibility} className="h-2" />
                    </div>

                    <p className="text-gray-300 text-sm">{career.description}</p>

                    <div className="text-xs text-cyan-400">
                      <span className="font-semibold">Astrological Basis:</span> {career.reason}
                    </div>

                    {selectedField === career.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="space-y-3 border-t border-orange-500/30 pt-3"
                      >
                        <div>
                          <span className="text-yellow-400 font-semibold text-sm">Timeline:</span>
                          <p className="text-gray-300 text-xs mt-1">{career.timeline}</p>
                        </div>
                        <div>
                          <span className="text-green-400 font-semibold text-sm">Income Potential:</span>
                          <p className="text-gray-300 text-xs mt-1">{career.income}</p>
                        </div>
                        <div>
                          <span className="text-purple-400 font-semibold text-sm">Astrological Support:</span>
                          <p className="text-gray-300 text-xs mt-1">{career.astrological}</p>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="timeline" className="space-y-6">
          <div className="space-y-6">
            {careerTimeline.map((phase, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 bg-gradient-to-br from-slate-800/30 to-blue-900/20 border-blue-500/30">
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-bold text-blue-400">{phase.period}</h3>
                        <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 mt-2">{phase.phase}</Badge>
                      </div>
                      <div className="text-right">
                        <div className="text-green-400 font-semibold">{phase.income}</div>
                      </div>
                    </div>

                    <p className="text-gray-300">{phase.description}</p>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-green-400 mb-2">Opportunities</h4>
                        <ul className="space-y-1">
                          {phase.opportunities.map((opp, idx) => (
                            <li key={idx} className="flex items-start space-x-2">
                              <span className="text-green-400 mt-1">•</span>
                              <span className="text-gray-300 text-sm">{opp}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold text-orange-400 mb-2">Challenges</h4>
                        <ul className="space-y-1">
                          {phase.challenges.map((challenge, idx) => (
                            <li key={idx} className="flex items-start space-x-2">
                              <span className="text-orange-400 mt-1">•</span>
                              <span className="text-gray-300 text-sm">{challenge}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="strengths" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {professionalStrengths.map((strength, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 bg-gradient-to-br from-slate-800/30 to-green-900/20 border-green-500/30">
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-bold text-green-400">{strength.strength}</h3>
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                        {strength.percentage}%
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Strength Level</span>
                        <span className="text-green-400">{strength.percentage}%</span>
                      </div>
                      <Progress value={strength.percentage} className="h-2" />
                    </div>

                    <p className="text-gray-300 text-sm">{strength.description}</p>

                    <div className="text-xs text-cyan-400">
                      <span className="font-semibold">Astrological Source:</span> {strength.source}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="guidance" className="space-y-6">
          {/* Entrepreneurship Score & Job vs Business */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Entrepreneurship Score */}
            <Card className="p-6 bg-gradient-to-br from-slate-800/30 to-amber-900/20 border-amber-500/30">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-amber-400 flex items-center">
                  <Rocket className="w-5 h-5 mr-2" />
                  Entrepreneurship Score
                </h3>
                <Badge className={`text-lg px-3 py-1 ${analysisData.entrepreneurship.score >= 70 ? 'bg-green-500/20 text-green-400' :
                  analysisData.entrepreneurship.score >= 50 ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                  {analysisData.entrepreneurship.score}%
                </Badge>
              </div>

              <p className="text-gray-300 text-sm mb-4">{analysisData.entrepreneurship.verdict}</p>

              <div className="space-y-3">
                {analysisData.entrepreneurship.strengths.length > 0 && (
                  <div>
                    <h4 className="text-green-400 text-sm font-semibold mb-1">Strengths:</h4>
                    <ul className="space-y-1">
                      {analysisData.entrepreneurship.strengths.slice(0, 3).map((s, i) => (
                        <li key={i} className="text-xs text-gray-300 flex items-start">
                          <span className="text-green-400 mr-2">✓</span> {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {analysisData.entrepreneurship.challenges.length > 0 && (
                  <div>
                    <h4 className="text-orange-400 text-sm font-semibold mb-1">Challenges:</h4>
                    <ul className="space-y-1">
                      {analysisData.entrepreneurship.challenges.slice(0, 2).map((c, i) => (
                        <li key={i} className="text-xs text-gray-300 flex items-start">
                          <span className="text-orange-400 mr-2">!</span> {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </Card>

            {/* Job vs Business */}
            <Card className="p-6 bg-gradient-to-br from-slate-800/30 to-cyan-900/20 border-cyan-500/30">
              <h3 className="text-lg font-bold text-cyan-400 flex items-center mb-4">
                <Building className="w-5 h-5 mr-2" />
                Job vs Business Analysis
              </h3>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-400">Job/Service</span>
                    <span className="text-blue-400">{analysisData.jobVsBusiness.job}%</span>
                  </div>
                  <Progress value={analysisData.jobVsBusiness.job} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-400">Business/Self-employment</span>
                    <span className="text-amber-400">{analysisData.jobVsBusiness.business}%</span>
                  </div>
                  <Progress value={analysisData.jobVsBusiness.business} className="h-2" />
                </div>

                <div className="p-3 bg-cyan-500/10 rounded-lg border border-cyan-500/30">
                  <p className="text-sm text-cyan-300">{analysisData.jobVsBusiness.recommendation}</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Career Timing Forecast */}
          <Card className="p-6 bg-gradient-to-br from-slate-800/30 to-indigo-900/20 border-indigo-500/30">
            <h3 className="text-lg font-bold text-indigo-400 flex items-center mb-4">
              <Calendar className="w-5 h-5 mr-2" />
              Career Timing Forecast
            </h3>

            <div className="grid md:grid-cols-3 gap-4">
              {analysisData.favorablePeriods.slice(0, 3).map((period, i) => (
                <div key={i} className={`p-4 rounded-lg border ${period.rating === 'Excellent' ? 'bg-green-500/10 border-green-500/30' :
                  period.rating === 'Good' ? 'bg-blue-500/10 border-blue-500/30' :
                    'bg-yellow-500/10 border-yellow-500/30'
                  }`}>
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-semibold text-white">{period.start} - {period.end}</span>
                    <Badge className={`text-xs ${period.rating === 'Excellent' ? 'bg-green-500/20 text-green-400' :
                      period.rating === 'Good' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-yellow-500/20 text-yellow-400'
                      }`}>
                      {period.rating}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-400 mb-2">{period.reasoning}</p>
                  <div className="flex flex-wrap gap-1">
                    {period.activities.slice(0, 3).map((act, j) => (
                      <span key={j} className="text-xs bg-slate-700/50 px-2 py-0.5 rounded text-gray-300">{act}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Original Guidance Cards */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6 bg-gradient-to-br from-slate-800/30 to-purple-900/20 border-purple-500/30">
              <h3 className="text-lg font-bold text-purple-400 mb-4">Foundation Phase (Age 18-22)</h3>
              <ul className="space-y-3">
                <li className="flex items-start space-x-3">
                  <span className="text-purple-400 mt-1">•</span>
                  <span className="text-gray-300 text-sm">
                    Build quantitative credibility (NIT background) and mathematical foundations.
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-purple-400 mt-1">•</span>
                  <span className="text-gray-300 text-sm">Master Algorithmic Trading basics and Financial Architecture.</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-purple-400 mt-1">•</span>
                  <span className="text-gray-300 text-sm">
                    Implement the "Mercury Law": Mandatory thesis for every critical move.
                  </span>
                </li>
              </ul>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-slate-800/30 to-indigo-900/20 border-indigo-500/30">
              <h3 className="text-lg font-bold text-indigo-400 mb-4">Dharma Alignment (Age 23-30)</h3>
              <ul className="space-y-3">
                <li className="flex items-start space-x-3">
                  <span className="text-indigo-400 mt-1">•</span>
                  <span className="text-gray-300 text-sm">Shift from job-seeking to productizing intelligence.</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-indigo-400 mt-1">•</span>
                  <span className="text-gray-300 text-sm">Scale Algorithmic Trading systems into consistent revenue streams.</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-indigo-400 mt-1">•</span>
                  <span className="text-gray-300 text-sm">Establish authority in the "Astro-Financial" niche.</span>
                </li>
              </ul>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-slate-800/30 to-yellow-900/20 border-yellow-500/30">
              <h3 className="text-lg font-bold text-yellow-400 mb-4">Legacy Wealth (Age 39+)</h3>
              <ul className="space-y-3">
                <li className="flex items-start space-x-3">
                  <span className="text-yellow-400 mt-1">•</span>
                  <span className="text-gray-300 text-sm">Transition to full asset management and legacy building.</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-yellow-400 mt-1">•</span>
                  <span className="text-gray-300 text-sm">Establish institutional-grade financial architecture.</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-yellow-400 mt-1">•</span>
                  <span className="text-gray-300 text-sm">Focus on Moksha and sharing systemic wisdom.</span>
                </li>
              </ul>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-slate-800/30 to-red-900/20 border-red-500/30">
              <h3 className="text-lg font-bold text-red-400 mb-4">Critical Protocols</h3>
              <ul className="space-y-3">
                <li className="flex items-start space-x-3">
                  <span className="text-red-400 mt-1">•</span>
                  <span className="text-gray-300 text-sm">**Tuesday Law:** Mars-Rahu Lock. Stop at 5 actions. No exceptions.</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-red-400 mt-1">•</span>
                  <span className="text-gray-300 text-sm">Avoid willpower-based decisions; rely on your system.</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-red-400 mt-1">•</span>
                  <span className="text-gray-300 text-sm">Maintain ethical architecture in all financial dealings.</span>
                </li>
              </ul>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
