"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Briefcase, TrendingUp, Building, Rocket, Calendar, Target } from "lucide-react"
import { getFullCareerAnalysis, CareerAnalysis } from "@/lib/career-engine"

export default function CareerDestiny() {
  const [selectedField, setSelectedField] = useState<string | null>(null)

  // Calculate career analysis from engine
  const careerAnalysis = useMemo<CareerAnalysis>(() => {
    return getFullCareerAnalysis({
      tenthLord: 'Venus',
      tenthLordHouse: 10,
      tenthLordSign: 'Scorpio',
      tenthLordStrength: 72,
      planetsInTenth: ['Venus'],
      tenthLordAspects: ['Jupiter', 'Mars'],
      currentDasha: 'Jupiter',
      currentAntardasha: 'Saturn',
      strongPlanets: ['Jupiter', 'Mercury', 'Mars'],
      planetStrengths: {
        'Sun': 55, 'Moon': 68, 'Mars': 78, 'Mercury': 82,
        'Jupiter': 85, 'Venus': 72, 'Saturn': 65, 'Rahu': 60, 'Ketu': 58
      },
      rahu7thOr10th: false,
      lagnaLordStrong: true
    });
  }, []);

  // Authentic career data from PDF analysis
  const careerFields = [
    {
      id: "psychology",
      field: "Psychology and Touch Therapy",
      compatibility: 95,
      reason: "Shatabhisha nakshatra healing powers, Moon in 1st house emotional sensitivity",
      description: "Natural healer with deep understanding of human psyche and emotional patterns",
      timeline: "2025-2030: Training period, 2030-2040: Establishment, 2040+: Mastery",
      income: "₹30L-2Cr annually at peak",
      astrological: "Venus in 10th house (Scorpio) + Jupiter-Mercury in 9th house",
    },
    {
      id: "astrology",
      field: "Astrology and Occult Sciences",
      compatibility: 90,
      reason: "Sun-Ketu in 8th house, intuitive abilities, Jupiter-Mercury conjunction",
      description: "Master of hidden sciences with ability to guide others through cosmic wisdom",
      timeline: "2024-2027: Deep study, 2027-2035: Practice building, 2035+: Authority",
      income: "₹20L-1.5Cr annually through consultations and teaching",
      astrological: "8th house emphasis + 9th house Jupiter-Mercury combination",
    },
    {
      id: "medical",
      field: "Medical Field - Doctor/Surgeon",
      compatibility: 85,
      reason: "Natural healing abilities, service orientation, Shatabhisha healing nakshatra",
      description: "Healing through conventional medicine with intuitive diagnostic abilities",
      timeline: "2024-2030: Medical education, 2030-2040: Specialization, 2040+: Recognition",
      income: "₹50L-3Cr annually in specialized practice",
      astrological: "6th house Saturn (service) + Venus in 10th (healing arts)",
    },
    {
      id: "physics",
      field: "Electrical and Nuclear Physics",
      compatibility: 80,
      reason: "Aquarius technical aptitude, research mind, innovative thinking",
      description: "Cutting-edge research in energy, electricity, and atomic sciences",
      timeline: "2024-2028: Advanced studies, 2028-2038: Research, 2038+: Breakthroughs",
      income: "₹40L-2Cr in research and development roles",
      astrological: "Aquarius lagna + Mars in 3rd house (technical skills)",
    },
    {
      id: "media",
      field: "Film/Television and Photography",
      compatibility: 75,
      reason: "Venus in 10th house creative expression, Mars in 3rd communication",
      description: "Creative storytelling through visual media with transformative themes",
      timeline: "2025-2030: Skill building, 2030-2040: Industry recognition, 2040+: Legacy",
      income: "₹25L-1Cr through creative projects and direction",
      astrological: "Venus in Scorpio (depth) + Mars in Aries (action)",
    },
    {
      id: "teaching",
      field: "Teaching and Writing",
      compatibility: 90,
      reason: "Jupiter-Mercury in 9th house, natural wisdom sharing abilities",
      description: "Spiritual teacher, author, and guide for higher knowledge seekers",
      timeline: "2024-2027: Content creation, 2027-2035: Authority building, 2035+: Legacy",
      income: "₹15L-80L through books, courses, and speaking",
      astrological: "9th house Jupiter-Mercury conjunction (teaching excellence)",
    },
    {
      id: "pharmaceutical",
      field: "Pharmaceutical Work",
      compatibility: 70,
      reason: "Healing and chemistry combination, Virgo emphasis in 8th house",
      description: "Drug research and development with focus on holistic healing",
      timeline: "2025-2032: Industry experience, 2032-2042: Innovation, 2042+: Leadership",
      income: "₹35L-1.5Cr in pharmaceutical research",
      astrological: "8th house Virgo (research) + healing nakshatra",
    },
    {
      id: "yoga",
      field: "Yoga Training and Spirituality",
      compatibility: 85,
      reason: "Moksha yoga, spiritual inclinations, natural teaching abilities",
      description: "Spiritual guide combining ancient wisdom with modern understanding",
      timeline: "2024-2028: Personal practice, 2028-2038: Teaching, 2038+: Mastery",
      income: "₹10L-60L through retreats, training, and guidance",
      astrological: "12th house spiritual emphasis + Jupiter in 9th house",
    },
  ]

  // Career timeline based on dasha periods
  const careerTimeline = [
    {
      period: "2024-2027 (Jupiter Mahadasha End)",
      phase: "Foundation & Learning",
      description: "Complete higher education, develop core skills, initial career establishment",
      opportunities: [
        "Higher education completion",
        "Skill development",
        "Mentorship connections",
        "Initial recognition",
      ],
      challenges: ["Sade Sati peak phase", "Career direction clarity", "Financial constraints"],
      income: "₹5-20 Lakhs annually",
    },
    {
      period: "2027-2035 (Saturn Mahadasha Beginning)",
      phase: "Discipline & Growth",
      description: "Structured career building, authority development, steady progress through hard work",
      opportunities: ["Leadership roles", "Professional recognition", "Skill mastery", "Network building"],
      challenges: ["Increased responsibilities", "Work pressure", "Patience required"],
      income: "₹20-50 Lakhs annually",
    },
    {
      period: "2035-2042 (Saturn Mahadasha Peak)",
      phase: "Authority & Recognition",
      description: "Peak professional achievements, authority positions, industry recognition",
      opportunities: ["Industry leadership", "Major projects", "Public recognition", "Wealth accumulation"],
      challenges: ["High pressure roles", "Public scrutiny", "Work-life balance"],
      income: "₹50L-1.5 Crores annually",
    },
    {
      period: "2042-2050 (Saturn-Mercury Transition)",
      phase: "Mastery & Legacy",
      description: "Established expertise, mentoring others, creating lasting impact",
      opportunities: ["Teaching roles", "Consulting", "Writing/publishing", "Legacy building"],
      challenges: ["Succession planning", "Adapting to change", "Health considerations"],
      income: "₹1.5-3 Crores annually",
    },
    {
      period: "2050+ (Mercury Mahadasha)",
      phase: "Wisdom & Excellence",
      description: "Peak intellectual achievements, communication mastery, spiritual teaching",
      opportunities: ["Thought leadership", "Global recognition", "Spiritual authority", "Wealth peak"],
      challenges: ["Age-related limitations", "Technology adaptation", "Succession"],
      income: "₹3+ Crores annually",
    },
  ]

  // Professional strengths from chart analysis
  const professionalStrengths = [
    {
      strength: "Communication Excellence",
      source: "Mars in 3rd house (Aries) + Jupiter-Mercury in 9th",
      description: "Exceptional speaking, writing, and teaching abilities with authoritative presence",
      percentage: 95,
    },
    {
      strength: "Healing & Transformation",
      source: "Shatabhisha nakshatra + Venus in Scorpio 10th house",
      description: "Natural ability to heal, transform, and guide others through difficulties",
      percentage: 90,
    },
    {
      strength: "Research & Analysis",
      source: "Sun-Ketu in 8th house Virgo + Aquarius analytical mind",
      description: "Deep research capabilities, analytical thinking, and hidden knowledge access",
      percentage: 88,
    },
    {
      strength: "Leadership & Authority",
      source: "Raj Yoga (9th-10th lords) + Mars in own sign",
      description: "Natural leadership qualities with ability to inspire and guide others",
      percentage: 85,
    },
    {
      strength: "Innovation & Technology",
      source: "Aquarius lagna + Rahu in 2nd house modern influence",
      description: "Futuristic thinking, technological aptitude, and innovative solutions",
      percentage: 82,
    },
    {
      strength: "Spiritual Wisdom",
      source: "Jupiter in 9th house + Moksha yoga combinations",
      description: "Deep spiritual understanding with ability to guide others on dharmic path",
      percentage: 92,
    },
  ]

  return (
    <div className="space-y-6">
      {/* Career Overview */}
      <Card className="bg-gradient-to-br from-slate-900/50 to-orange-900/30 border-orange-500/30 p-8 backdrop-blur-sm">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-4">
          <div className="flex items-center justify-center">
            <Briefcase className="w-8 h-8 text-orange-400 mr-2" />
            <h2 className="text-2xl font-bold text-orange-400">Career Destiny Analysis</h2>
          </div>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Based on your Jupiter-Mercury conjunction in 9th house and Venus in 10th house, you're destined for
            authority in healing, teaching, or transformational fields. Your career will combine wisdom, service, and
            innovation.
          </p>
        </motion.div>
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
                <Badge className={`text-lg px-3 py-1 ${careerAnalysis.entrepreneurship.score >= 70 ? 'bg-green-500/20 text-green-400' :
                    careerAnalysis.entrepreneurship.score >= 50 ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                  }`}>
                  {careerAnalysis.entrepreneurship.score}%
                </Badge>
              </div>

              <p className="text-gray-300 text-sm mb-4">{careerAnalysis.entrepreneurship.verdict}</p>

              <div className="space-y-3">
                {careerAnalysis.entrepreneurship.strengths.length > 0 && (
                  <div>
                    <h4 className="text-green-400 text-sm font-semibold mb-1">Strengths:</h4>
                    <ul className="space-y-1">
                      {careerAnalysis.entrepreneurship.strengths.slice(0, 3).map((s, i) => (
                        <li key={i} className="text-xs text-gray-300 flex items-start">
                          <span className="text-green-400 mr-2">✓</span> {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {careerAnalysis.entrepreneurship.challenges.length > 0 && (
                  <div>
                    <h4 className="text-orange-400 text-sm font-semibold mb-1">Challenges:</h4>
                    <ul className="space-y-1">
                      {careerAnalysis.entrepreneurship.challenges.slice(0, 2).map((c, i) => (
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
                    <span className="text-blue-400">{careerAnalysis.jobVsBusiness.job}%</span>
                  </div>
                  <Progress value={careerAnalysis.jobVsBusiness.job} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-400">Business/Self-employment</span>
                    <span className="text-amber-400">{careerAnalysis.jobVsBusiness.business}%</span>
                  </div>
                  <Progress value={careerAnalysis.jobVsBusiness.business} className="h-2" />
                </div>

                <div className="p-3 bg-cyan-500/10 rounded-lg border border-cyan-500/30">
                  <p className="text-sm text-cyan-300">{careerAnalysis.jobVsBusiness.recommendation}</p>
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
              {careerAnalysis.favorablePeriods.slice(0, 3).map((period, i) => (
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
              <h3 className="text-lg font-bold text-purple-400 mb-4">Immediate Actions (2024-2025)</h3>
              <ul className="space-y-3">
                <li className="flex items-start space-x-3">
                  <span className="text-purple-400 mt-1">•</span>
                  <span className="text-gray-300 text-sm">
                    Complete higher education with focus on psychology or healing sciences
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-purple-400 mt-1">•</span>
                  <span className="text-gray-300 text-sm">Begin studying astrology and occult sciences seriously</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-purple-400 mt-1">•</span>
                  <span className="text-gray-300 text-sm">
                    Develop communication skills through writing and speaking
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-purple-400 mt-1">•</span>
                  <span className="text-gray-300 text-sm">Network with mentors in healing and spiritual fields</span>
                </li>
              </ul>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-slate-800/30 to-indigo-900/20 border-indigo-500/30">
              <h3 className="text-lg font-bold text-indigo-400 mb-4">Medium-term Goals (2025-2030)</h3>
              <ul className="space-y-3">
                <li className="flex items-start space-x-3">
                  <span className="text-indigo-400 mt-1">•</span>
                  <span className="text-gray-300 text-sm">Establish practice in chosen healing field</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-indigo-400 mt-1">•</span>
                  <span className="text-gray-300 text-sm">Begin teaching or mentoring others</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-indigo-400 mt-1">•</span>
                  <span className="text-gray-300 text-sm">Build reputation through consistent service</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-indigo-400 mt-1">•</span>
                  <span className="text-gray-300 text-sm">Consider foreign connections or travel for growth</span>
                </li>
              </ul>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-slate-800/30 to-yellow-900/20 border-yellow-500/30">
              <h3 className="text-lg font-bold text-yellow-400 mb-4">Long-term Vision (2030+)</h3>
              <ul className="space-y-3">
                <li className="flex items-start space-x-3">
                  <span className="text-yellow-400 mt-1">•</span>
                  <span className="text-gray-300 text-sm">Become recognized authority in your chosen field</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-yellow-400 mt-1">•</span>
                  <span className="text-gray-300 text-sm">Write books or create educational content</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-yellow-400 mt-1">•</span>
                  <span className="text-gray-300 text-sm">Establish institutions or training programs</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-yellow-400 mt-1">•</span>
                  <span className="text-gray-300 text-sm">Leave lasting legacy in healing and wisdom</span>
                </li>
              </ul>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-slate-800/30 to-red-900/20 border-red-500/30">
              <h3 className="text-lg font-bold text-red-400 mb-4">Key Warnings</h3>
              <ul className="space-y-3">
                <li className="flex items-start space-x-3">
                  <span className="text-red-400 mt-1">•</span>
                  <span className="text-gray-300 text-sm">Avoid ego conflicts during Sade Sati period</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-red-400 mt-1">•</span>
                  <span className="text-gray-300 text-sm">Don't scatter energy across too many fields</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-red-400 mt-1">•</span>
                  <span className="text-gray-300 text-sm">Maintain ethical standards in all dealings</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-red-400 mt-1">•</span>
                  <span className="text-gray-300 text-sm">Balance material success with spiritual growth</span>
                </li>
              </ul>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
