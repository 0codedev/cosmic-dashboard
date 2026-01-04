"use client"

import { useState, useEffect, lazy, Suspense } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Home, Star, Calendar, TrendingUp, Briefcase, Heart, Sparkles, Target, Zap, Wrench, LogOut } from "lucide-react"

// Static imports for always-visible components
import MobileNavigation from "@/components/mobile-navigation"
import AstroChatbot from "@/components/astro-chatbot"
import CosmicBackground from "@/components/cosmic-background"
import MoonPhaseTracker from "@/components/moon-phase-tracker"
import DailyVibesCard from "@/components/daily-vibes-card"
import TabSkeleton from "@/components/ui/tab-skeleton"
import NumerologyWidget from "@/components/numerology-widget"
import LandingPage from "@/components/landing-page"

// Contexts
import { UserProvider, useUser } from "@/contexts/user-context"
import { SUDHANSHU_DATA } from "@/data/user-data" // Keep for fallback/types
import { useActiveTab, useAstrologyActions } from "@/stores/astrology-store"

// Lazy load heavy tab components for better initial load
const ChartBreakdown = lazy(() => import("@/components/chart-breakdown"))
const DashaExplorer = lazy(() => import("@/components/dasha-explorer"))
const TransitForecast = lazy(() => import("@/components/transit-forecast"))
const CareerDestiny = lazy(() => import("@/components/career-destiny"))
const LoveMarriage = lazy(() => import("@/components/love-marriage"))
const KarmaRemedies = lazy(() => import("@/components/karma-remedies"))
const YogasAspects = lazy(() => import("@/components/yogas-aspects"))
const ToolsPanel = lazy(() => import("@/components/tools-panel"))
const CompatibilityChecker = lazy(() => import("@/components/compatibility-checker"))
const PlanetaryStrength = lazy(() => import("@/components/planetary-strength"))
const DivisionalCharts = lazy(() => import("@/components/divisional-charts"))
const LearningAcademy = lazy(() => import("@/components/learning-academy"))
const BabyNames = lazy(() => import("@/components/baby-names"))
const MatchScoreCard = lazy(() => import("@/components/match-score-card"))
const DashaPredictions = lazy(() => import("@/components/dasha-predictions"))
const TransitCalendar = lazy(() => import("@/components/transit-calendar"))
const CareerCompatibility = lazy(() => import("@/components/career-compatibility"))
const PujaRecommendations = lazy(() => import("@/components/puja-recommendations"))
const YearlyForecast = lazy(() => import("@/components/yearly-forecast"))
const MantraOfDay = lazy(() => import("@/components/mantra-of-day"))
const AspectAnalysis = lazy(() => import("@/components/aspect-analysis"))

// Re-export for backward compatibility
export { SUDHANSHU_DATA } from "@/data/user-data"

export default function CosmicApp() {
  return (
    <UserProvider>
      <DashboardContent />
    </UserProvider>
  )
}

function DashboardContent() {
  const { userData, setUserData } = useUser()
  const activeTab = useActiveTab()
  const { setActiveTab } = useAstrologyActions()

  // Initialize as null to prevent hydration mismatch
  const [currentTime, setCurrentTime] = useState<Date | null>(null)

  useEffect(() => {
    setCurrentTime(new Date())
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  // Show Landing Page if no user data
  if (!userData) {
    return <LandingPage />
  }

  // Use the context data (userData) instead of hardcoded SUDHANSHU_DATA
  const user = userData

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950 text-white relative overflow-hidden">
      <CosmicBackground />

      {/* Header */}
      <header className="relative z-10 p-6 border-b border-indigo-500/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-4"
          >
            <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform" onClick={() => setUserData(null)} title="Switch User">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                {user.name}'s Cosmic Dashboard
              </h1>
              <p className="text-sm text-gray-400">
                {user.nakshatra?.split(',')[0]} • Age {new Date().getFullYear() - parseInt(user.dob.split(' ').pop() || '2005')} • {user.currentMahadasha?.split(' ')[0]} Mahadasha
              </p>
            </div>
          </motion.div>

          <div className="flex items-center space-x-4">
            <MoonPhaseTracker />
            <div className="text-right hidden sm:block">
              <div className="text-sm text-cyan-400 font-mono">{currentTime?.toLocaleTimeString() ?? '--:--:--'}</div>
              <div className="text-xs text-gray-400">{currentTime?.toLocaleDateString() ?? '...'}</div>
            </div>
            <button onClick={() => setUserData(null)} className="md:hidden text-gray-400 hover:text-white">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <TabsList className="grid w-full grid-cols-9 bg-slate-900/50 border border-indigo-500/30 backdrop-blur-sm" role="tablist" aria-label="Dashboard navigation">
              <TabsTrigger value="overview" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
                <Home className="w-4 h-4 mr-2" /> Overview
              </TabsTrigger>
              <TabsTrigger value="chart" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400">
                <Star className="w-4 h-4 mr-2" /> Chart
              </TabsTrigger>
              <TabsTrigger value="dasha" className="data-[state=active]:bg-yellow-500/20 data-[state=active]:text-yellow-400">
                <Calendar className="w-4 h-4 mr-2" /> Dasha
              </TabsTrigger>
              <TabsTrigger value="transit" className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400">
                <TrendingUp className="w-4 h-4 mr-2" /> Transit
              </TabsTrigger>
              <TabsTrigger value="career" className="data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-400">
                <Briefcase className="w-4 h-4 mr-2" /> Career
              </TabsTrigger>
              <TabsTrigger value="love" className="data-[state=active]:bg-pink-500/20 data-[state=active]:text-pink-400">
                <Heart className="w-4 h-4 mr-2" /> Love
              </TabsTrigger>
              <TabsTrigger value="remedies" className="data-[state=active]:bg-indigo-500/20 data-[state=active]:text-indigo-400">
                <Zap className="w-4 h-4 mr-2" /> Remedies
              </TabsTrigger>
              <TabsTrigger value="yogas" className="data-[state=active]:bg-red-500/20 data-[state=active]:text-red-400">
                <Target className="w-4 h-4 mr-2" /> Yogas
              </TabsTrigger>
              <TabsTrigger value="tools" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400">
                <Wrench className="w-4 h-4 mr-2" /> Tools
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Tab Content */}
          <TabsContent value="overview" className="space-y-6">
            <OverviewPage />
          </TabsContent>

          <TabsContent value="chart" className="space-y-6">
            <Suspense fallback={<TabSkeleton title="Loading Chart..." cardCount={1} />}>
              <ChartBreakdown />
              <PlanetaryStrength />
              <DivisionalCharts />
            </Suspense>
          </TabsContent>

          <TabsContent value="dasha" className="space-y-6">
            <Suspense fallback={<TabSkeleton title="Loading Dasha..." />}>
              <DashaExplorer />
              <DashaPredictions />
              <YearlyForecast />
            </Suspense>
          </TabsContent>

          <TabsContent value="transit" className="space-y-6">
            <Suspense fallback={<TabSkeleton title="Loading Transits..." />}>
              <TransitForecast />
              <TransitCalendar />
            </Suspense>
          </TabsContent>

          <TabsContent value="career" className="space-y-6">
            <Suspense fallback={<TabSkeleton title="Loading Career..." />}>
              <CareerDestiny />
              <CareerCompatibility />
            </Suspense>
          </TabsContent>

          <TabsContent value="love" className="space-y-6">
            <Suspense fallback={<TabSkeleton title="Loading Love..." />}>
              <LoveMarriage />
              <MatchScoreCard />
              <CompatibilityChecker />
            </Suspense>
          </TabsContent>

          <TabsContent value="remedies" className="space-y-6">
            <Suspense fallback={<TabSkeleton title="Loading Remedies..." />}>
              <KarmaRemedies />
              <PujaRecommendations />
            </Suspense>
          </TabsContent>

          <TabsContent value="yogas" className="space-y-6">
            <Suspense fallback={<TabSkeleton title="Loading Yogas..." />}>
              <YogasAspects />
              <AspectAnalysis />
            </Suspense>
          </TabsContent>

          <TabsContent value="tools" className="space-y-6">
            <Suspense fallback={<TabSkeleton title="Loading Tools..." cardCount={4} />}>
              <ToolsPanel />
              <LearningAcademy />
              <BabyNames />
            </Suspense>
          </TabsContent>
        </Tabs>
      </main>

      {/* Mobile Navigation */}
      <MobileNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* AI Chatbot */}
      <AstroChatbot />
    </div>
  )
}

function OverviewPage() {
  const { userData } = useUser()
  // Fallback to avoid crash if context is missing for some reason
  const user = userData || SUDHANSHU_DATA

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-4">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          Today's Cosmic Vibes
        </h2>
        <p className="text-gray-300 max-w-2xl mx-auto">
          Welcome to your personal cosmic sanctuary, {user.name}. Your {user.currentMahadasha?.split(' ')[0]} Mahadasha continues to bless
          you with wisdom and expansion.
        </p>
      </motion.div>

      {/* Daily Summary */}
      <DailyVibesCard />

      {/* Numerology Insights */}
      <NumerologyWidget />

      {/* Today's Guidance */}
      <Card className="bg-gradient-to-br from-slate-900/50 to-cyan-900/30 border-cyan-500/30 p-8 backdrop-blur-sm">
        <h3 className="text-xl font-bold text-cyan-400 mb-6 text-center flex items-center justify-center">
          <Sparkles className="w-5 h-5 mr-2" />
          Today's Cosmic Guidance
        </h3>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center space-y-3">
            <div className="w-16 h-16 mx-auto bg-yellow-500/20 rounded-full flex items-center justify-center">
              <span className="text-2xl">🌟</span>
            </div>
            <h4 className="font-semibold text-yellow-400">Focus Area</h4>
            <p className="text-sm text-gray-300">
              Jupiter's wisdom energy supports learning and teaching. Focus on sharing knowledge and expanding your
              understanding of healing sciences.
            </p>
          </div>

          <div className="text-center space-y-3">
            <div className="w-16 h-16 mx-auto bg-green-500/20 rounded-full flex items-center justify-center">
              <span className="text-2xl">💚</span>
            </div>
            <h4 className="font-semibold text-green-400">Opportunity</h4>
            <p className="text-sm text-gray-300">
              Sade Sati's setting phase creates opportunities for stabilization. Embrace the lessons learned and build
              on your transformed foundation.
            </p>
          </div>

          <div className="text-center space-y-3">
            <div className="w-16 h-16 mx-auto bg-red-500/20 rounded-full flex items-center justify-center">
              <span className="text-2xl">⚠️</span>
            </div>
            <h4 className="font-semibold text-red-400">Caution</h4>
            <p className="text-sm text-gray-300">
              Avoid making impulsive decisions during Saturn's continued influence. Practice patience and maintain
              disciplined routines for best results.
            </p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <div className="bg-slate-800/30 rounded-lg p-4 max-w-2xl mx-auto">
            <h5 className="font-semibold text-purple-400 mb-2">Daily Mantra</h5>
            <p className="text-lg text-white italic">
              "I embrace discipline and transformation as my path to wisdom and service."
            </p>
            <p className="text-sm text-gray-400 mt-2">Chant "Om Namah Shivaya" 108 times for inner strength</p>
          </div>
        </div>
      </Card>

      {/* Detailed Stats from Report - UPDATED LAYOUT */}
      <div className="space-y-4">
        {/* First Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-slate-900/50 to-cyan-900/30 border-cyan-500/30 p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="text-2xl mb-1">♒</div>
                <div className="text-sm text-cyan-400 font-semibold">Lagna</div>
                <div className="text-xs text-gray-400">{user.lagna?.split(' ')[0]}</div>
                <div className="text-xs text-gray-300">Lord: {user.lagnaLord}</div>
              </div>
              <div className="w-12 h-2 bg-slate-700 rounded-full">
                <div className="w-10 h-2 bg-cyan-400 rounded-full"></div>
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-slate-900/50 to-purple-900/30 border-purple-500/30 p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="text-2xl mb-1">🌟</div>
                <div className="text-sm text-purple-400 font-semibold">Nakshatra</div>
                <div className="text-xs text-gray-400">{user.nakshatra?.split(' ')[0]}</div>
                <div className="text-xs text-gray-300">Rul: {user.nakshatraLord}</div>
              </div>
              <div className="w-12 h-2 bg-slate-700 rounded-full">
                <div className="w-9 h-2 bg-purple-400 rounded-full"></div>
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-slate-900/50 to-yellow-900/30 border-yellow-500/30 p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="text-2xl mb-1">♃</div>
                <div className="text-sm text-yellow-400 font-semibold">Mahadasha</div>
                <div className="text-xs text-gray-400">{user.currentMahadasha?.split(' ')[0]}</div>
                <div className="text-xs text-gray-300">Active</div>
              </div>
              <div className="w-12 h-2 bg-slate-700 rounded-full">
                <div className="w-11 h-2 bg-yellow-400 rounded-full"></div>
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-slate-900/50 to-red-900/30 border-red-500/30 p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="text-2xl mb-1">{user.lifePathNumber?.split('/')[0]}</div>
                <div className="text-sm text-red-400 font-semibold">Life Path</div>
                <div className="text-xs text-gray-400">{user.lifePathNumber?.includes('Karmic') ? 'Karmic' : 'Standard'}</div>
                <div className="text-xs text-gray-300">Path</div>
              </div>
              <div className="w-12 h-2 bg-slate-700 rounded-full">
                <div className="w-8 h-2 bg-red-400 rounded-full"></div>
              </div>
            </div>
          </Card>
        </div>

        {/* Second Row - Moon Phase and Additional Info */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-slate-900/50 to-blue-900/30 border-blue-500/30 p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="text-2xl mb-1">🌘</div>
                <div className="text-sm text-blue-400 font-semibold">Moon Phase</div>
                <div className="text-xs text-gray-400">Waning Crescent</div>
                <div className="text-xs text-gray-300">25% Illuminated</div>
              </div>
              <div className="w-12 h-2 bg-slate-700 rounded-full">
                <div className="w-3 h-2 bg-blue-400 rounded-full"></div>
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-slate-900/50 to-green-900/30 border-green-500/30 p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="text-2xl mb-1">📅</div>
                <div className="text-sm text-green-400 font-semibold">Tithi</div>
                <div className="text-xs text-gray-400">{user.tithi}</div>
                <div className="text-xs text-gray-300">Lunar Day</div>
              </div>
              <div className="w-12 h-2 bg-slate-700 rounded-full">
                <div className="w-10 h-2 bg-green-400 rounded-full"></div>
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-slate-900/50 to-orange-900/30 border-orange-500/30 p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="text-2xl mb-1">🕉️</div>
                <div className="text-sm text-orange-400 font-semibold">Yoga</div>
                <div className="text-xs text-gray-400">{user.yoga}</div>
                <div className="text-xs text-gray-300">Formation</div>
              </div>
              <div className="w-12 h-2 bg-slate-700 rounded-full">
                <div className="w-4 h-2 bg-orange-400 rounded-full"></div>
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-slate-900/50 to-pink-900/30 border-pink-500/30 p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="text-2xl mb-1">⚡</div>
                <div className="text-sm text-pink-400 font-semibold">Karan</div>
                <div className="text-xs text-gray-400">{user.karan}</div>
                <div className="text-xs text-gray-300">Half Tithi</div>
              </div>
              <div className="w-12 h-2 bg-slate-700 rounded-full">
                <div className="w-7 h-2 bg-pink-400 rounded-full"></div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Current Sade Sati Status - UPDATED */}
      <Card className="bg-gradient-to-br from-slate-900/50 to-green-900/30 border-green-500/50 p-8 backdrop-blur-sm">
        <div className="text-center space-y-4">
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30 px-4 py-2">Current Transit</Badge>
          <h3 className="text-2xl font-bold text-green-400">Sade Sati - Setting Phase</h3>
          <p className="text-gray-300 max-w-2xl mx-auto">
            You're currently in the Setting phase of Sade Sati (March 2025 - June 2027). Saturn has moved past your Moon
            sign, bringing gradual relief and stabilization. This is a period of reaping the benefits of your
            transformation and building on the lessons learned.
          </p>
          <div className="w-full bg-slate-700 rounded-full h-3 max-w-md mx-auto">
            <div
              className="bg-gradient-to-r from-green-400 to-blue-400 h-3 rounded-full transition-all duration-1000"
              style={{ width: `${((new Date().getMonth() + 1 - 3) / 27) * 100}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-400">Setting Phase Progress • Complete relief by June 2027</p>
        </div>
      </Card>

      {/* Personality Insights from Report */}
      <Card className="bg-gradient-to-br from-slate-900/50 to-indigo-900/30 border-indigo-500/30 p-8 backdrop-blur-sm">
        <h3 className="text-xl font-bold text-indigo-400 mb-6 text-center">Personality Insights</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-cyan-400 mb-3">Core Traits</h4>
            <ul className="space-y-2 text-sm">
              {user.personalityTraits?.slice(0, 4).map((trait, idx) => (
                <li key={idx} className="flex items-start space-x-2">
                  <span className="text-cyan-400 mt-1">•</span>
                  <span className="text-gray-300">{trait}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-purple-400 mb-3">Special Qualities</h4>
            <ul className="space-y-2 text-sm">
              {user.personalityTraits?.slice(4).map((trait, idx) => (
                <li key={idx} className="flex items-start space-x-2">
                  <span className="text-purple-400 mt-1">•</span>
                  <span className="text-gray-300">{trait}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Card>

      {/* Favorable Elements */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-slate-900/50 to-green-900/30 border-green-500/30 p-6 backdrop-blur-sm">
          <h4 className="text-lg font-bold text-green-400 mb-4">Favorable Elements</h4>
          <div className="space-y-3">
            <div>
              <span className="text-sm font-semibold text-cyan-400">Lucky Days:</span>
              <p className="text-gray-300 text-sm">{user.favorable?.days.join(", ")}</p>
            </div>
            <div>
              <span className="text-sm font-semibold text-cyan-400">Lucky Numbers:</span>
              <p className="text-gray-300 text-sm">{user.favorable?.numbers.join(", ")}</p>
            </div>
            <div>
              <span className="text-sm font-semibold text-cyan-400">Beneficial Planets:</span>
              <p className="text-gray-300 text-sm">{user.favorable?.planets.join(", ")}</p>
            </div>
            <div>
              <span className="text-sm font-semibold text-cyan-400">Lucky Stone:</span>
              <p className="text-gray-300 text-sm">{user.favorable?.stone}</p>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-slate-900/50 to-red-900/30 border-red-500/30 p-6 backdrop-blur-sm">
          <h4 className="text-lg font-bold text-red-400 mb-4">Areas of Caution</h4>
          <div className="space-y-3">
            <div>
              <span className="text-sm font-semibold text-orange-400">Challenging Day:</span>
              <p className="text-gray-300 text-sm">{user.unfavorable?.day}</p>
            </div>
            <div>
              <span className="text-sm font-semibold text-orange-400">Avoid Numbers:</span>
              <p className="text-gray-300 text-sm">{user.unfavorable?.numbers.join(", ")}</p>
            </div>
            <div>
              <span className="text-sm font-semibold text-orange-400">Challenging Planets:</span>
              <p className="text-gray-300 text-sm">{user.unfavorable?.planets.join(", ")}</p>
            </div>
            <div>
              <span className="text-sm font-semibold text-orange-400">Health Focus:</span>
              <p className="text-gray-300 text-sm">Circulation, heart health, nervous system</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Current Jupiter Mahadasha Highlight */}
      <Card className="bg-gradient-to-br from-slate-900/50 to-yellow-900/30 border-yellow-500/50 p-8 backdrop-blur-sm">
        <div className="text-center space-y-4">
          <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 px-4 py-2">Active Period</Badge>
          <h3 className="text-2xl font-bold text-yellow-400">Jupiter Mahadasha</h3>
          <p className="text-gray-300 max-w-2xl mx-auto">
            You're in year {new Date().getFullYear() - 2011 + 1} of your 16-year Jupiter Mahadasha (July 2011 - July
            2027). Jupiter in your 9th house brings opportunities in higher learning, teaching, spirituality, and
            dharmic pursuits. This period establishes your path as a wisdom-keeper and guide for others.
          </p>
          <div className="w-full bg-slate-700 rounded-full h-3 max-w-md mx-auto">
            <div
              className="bg-gradient-to-r from-yellow-400 to-orange-400 h-3 rounded-full transition-all duration-1000"
              style={{ width: `${((new Date().getFullYear() - 2011) / 16) * 100}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-400">
            {Math.round(((new Date().getFullYear() - 2011) / 16) * 100)}% Complete •{" "}
            {16 - (new Date().getFullYear() - 2011)} years remaining
          </p>
        </div>
      </Card>
    </div>
  )
}
