"use client"

import { useState, useEffect, lazy, Suspense } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Home, Star, Calendar, TrendingUp, Briefcase, Heart, Sparkles, Target, Zap, Wrench, LogOut, Shield, Clock, Activity } from "lucide-react"

// Static imports for always-visible components
import MobileNavigation from "@/components/mobile-navigation"
import AstroChatbot from "@/components/astro-chatbot"
import CosmicBackground from "@/components/cosmic-background"
import MoonPhaseTracker from "@/components/moon-phase-tracker"
import DailyVibesCard from "@/components/daily-vibes-card"
import { MissionControl } from "@/components/mission-control"
import TimingIntelligence from "@/components/timing-intelligence"
import AlchemyPsychology from "@/components/alchemy-psychology"
import TabSkeleton from "@/components/ui/tab-skeleton"
import NumerologyWidget from "@/components/numerology-widget"
import LandingPage from "@/components/landing-page"
import SkyNowWidget from "@/components/sky-now-widget"
import CosmicPowerScore from "@/components/cosmic-power-score"
import YearlySnapshotCard from "@/components/yearly-snapshot-card"
import { calculateCurrentPlanetaryPositions, getNakshatra } from "@/lib/cosmic-engine"

// Contexts
import { UserProvider, useUser } from "@/contexts/user-context"
import { SUDHANSHU_DATA } from "@/data/user-data"
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
const AspectAnalysis = lazy(() => import("@/components/aspect-analysis"))
const BabyNames = lazy(() => import("@/components/baby-names"))
const MatchScoreCard = lazy(() => import("@/components/match-score-card"))
const DashaPredictions = lazy(() => import("@/components/dasha-predictions"))
const TransitCalendar = lazy(() => import("@/components/transit-calendar"))
const CareerCompatibility = lazy(() => import("@/components/career-compatibility"))
const PujaRecommendations = lazy(() => import("@/components/puja-recommendations"))
const YearlyForecast = lazy(() => import("@/components/yearly-forecast"))
const MantraOfDay = lazy(() => import("@/components/mantra-of-day"))
const TransitHeatmap = lazy(() => import("@/components/transit-heatmap"))
const PDFExportButton = lazy(() => import("@/components/pdf-export-button"))
const ChronosTimeMachine = lazy(() => import("@/components/chronos-time-machine"))
const HealthIntelligence = lazy(() => import("@/components/health-intelligence"))

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
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  {user.name}'s Cosmic Dashboard
                </h1>
                <Badge variant="outline" className="border-indigo-500/50 text-indigo-400 bg-indigo-500/5 px-2 py-0 h-5 text-[10px] font-black tracking-widest uppercase">
                  Mercury Law Active
                </Badge>
              </div>
              <p className="text-xs text-gray-400 mt-0.5 italic opacity-80">
                "{user.identityAnchor || 'Architect of my own fortune'}"
              </p>
            </div>
          </motion.div>

          <div className="flex items-center space-x-4">
            <Suspense fallback={null}>
              <div className="hidden md:block">
                <PDFExportButton />
              </div>
            </Suspense>
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
            <TabsList className="grid w-full grid-cols-13 bg-slate-900/50 border border-indigo-500/30 backdrop-blur-sm" role="tablist" aria-label="Dashboard navigation">
              <TabsTrigger value="mission" className="data-[state=active]:bg-red-500/20 data-[state=active]:text-red-400">
                <Shield className="w-4 h-4 mr-2" /> Mission Control
              </TabsTrigger>
              <TabsTrigger value="alchemy" className="data-[state=active]:bg-indigo-500/20 data-[state=active]:text-indigo-400">
                <Zap className="w-4 h-4 mr-2" /> Alchemy
              </TabsTrigger>
              <TabsTrigger value="health" className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400">
                <Activity className="w-4 h-4 mr-2" /> Health
              </TabsTrigger>
              <TabsTrigger value="timing" className="data-[state=active]:bg-yellow-500/20 data-[state=active]:text-yellow-400">
                <Clock className="w-4 h-4 mr-2" /> Timing
              </TabsTrigger>
              <TabsTrigger value="overview" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
                <Home className="w-4 h-4 mr-2" /> Home
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
          <TabsContent value="mission" className="space-y-6">
            <MissionControl />
          </TabsContent>

          <TabsContent value="alchemy" className="space-y-6">
            <AlchemyPsychology />
          </TabsContent>

          <TabsContent value="health" className="space-y-6">
            <Suspense fallback={<TabSkeleton title="Loading Health..." />}>
              <HealthIntelligence />
            </Suspense>
          </TabsContent>

          <TabsContent value="timing" className="space-y-6">
            <TimingIntelligence />
          </TabsContent>

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
              <ChronosTimeMachine />
              <DashaExplorer />
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
  const { setActiveTab } = useAstrologyActions()
  const user = userData || SUDHANSHU_DATA

  // Dynamic Greeting Logic
  const [greeting, setGreeting] = useState("")
  const [cosmicTip, setCosmicTip] = useState("")

  useEffect(() => {
    const hour = new Date().getHours()
    let timeGreeting = "Good Morning"
    if (hour >= 12 && hour < 17) timeGreeting = "Good Afternoon"
    else if (hour >= 17) timeGreeting = "Good Evening"

    // Get current Moon Nakshatra for the tip
    const now = new Date()
    const pos = calculateCurrentPlanetaryPositions(now)
    const moonNak = pos.moon.nakshatra

    setGreeting(`${timeGreeting}, ${user.name.split(' ')[0]}`)
    setCosmicTip(`The Moon in ${moonNak} influences the collective consciousness today.`)
  }, [user])

  return (
    <div className="space-y-8">
      {/* Hero Section - Context Aware */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-900/50 to-purple-900/50 border border-indigo-500/20 p-8"
      >
        <div className="relative z-10">
          <h2 className="text-4xl font-black bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2 tracking-tight">
            {greeting}
          </h2>
          <p className="text-indigo-200/80 max-w-2xl text-lg font-medium leading-relaxed">
            {user.identityAnchor}
          </p>
          <div className="flex gap-3 mt-4">
            <Badge className="bg-indigo-500/20 text-indigo-300 border-indigo-500/30 px-3 py-1 text-[10px] uppercase font-bold tracking-wider">
               {user.strategicProtocol?.currentPhase}
            </Badge>
            <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/30 px-3 py-1 text-[10px] uppercase font-bold tracking-wider">
               {user.strategicProtocol?.primaryLaw}
            </Badge>
          </div>
        </div>

        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-purple-500/10 blur-[80px] rounded-full pointer-events-none" />
      </motion.div>

      {/* Real-time Intel Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SkyNowWidget />
        </div>
        <div className="lg:col-span-1">
          <CosmicPowerScore />
        </div>
      </div>

      {/* 2026 Annual Snapshot */}
      {/* 2026 Annual Snapshot */}
      <YearlySnapshotCard onNavigate={() => setActiveTab("dasha")} />

      {/* Cosmic Weather Heatmap */}
      <Suspense fallback={<div className="h-64 bg-slate-900/50 rounded-xl animate-pulse" />}>
        <TransitHeatmap />
      </Suspense>

      {/* Daily Summary & Numerology */}
      <div className="grid lg:grid-cols-2 gap-6">
        <DailyVibesCard />
        <NumerologyWidget />
      </div>

      {/* Today's Guidance */}
      <Card className="bg-gradient-to-br from-slate-900/50 to-cyan-900/30 border-cyan-500/30 p-8 backdrop-blur-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 blur-[50px] rounded-full pointer-events-none" />
        <h3 className="text-2xl font-bold text-cyan-400 mb-4 flex items-center relative z-10">
          <Target className="w-6 h-6 mr-2 text-cyan-300" />
          The Strategic Protocol
        </h3>
        <div className="grid md:grid-cols-2 gap-6 relative z-10">
          <div className="space-y-4">
            <p className="text-gray-300 leading-relaxed text-sm">
              <span className="text-cyan-300 font-bold block mb-1 uppercase tracking-widest text-[10px]">The Tuesday Law</span>
              {user.strategicProtocol?.tuesdayLaw}
            </p>
            <p className="text-gray-300 leading-relaxed text-sm">
              <span className="text-cyan-300 font-bold block mb-1 uppercase tracking-widest text-[10px]">The Mercury Law</span>
              {user.strategicProtocol?.mercuryLaw}
            </p>
          </div>
          <div className="bg-slate-950/50 rounded-xl p-4 border border-cyan-500/20">
            <span className="text-cyan-300 font-bold block mb-3 uppercase tracking-widest text-[10px]">Financial Ladder</span>
            <div className="space-y-2">
              {user.strategicProtocol?.financialLadder.map((step: any) => (
                <div key={step.age} className="flex justify-between items-center text-[11px]">
                  <span className="text-gray-400">Age {step.age}</span>
                  <span className="text-cyan-400 font-black">{step.netWorth}</span>
                  <span className="text-gray-500 italic">{step.focus}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Current Sade Sati Status */}
      {user.sadeSati && user.sadeSati.length > 0 ? (
        <Card className="bg-gradient-to-br from-slate-900/50 to-green-900/30 border-green-500/50 p-8 backdrop-blur-sm">
          <div className="text-center space-y-4">
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30 px-4 py-2">Current Transit</Badge>
            <h3 className="text-2xl font-bold text-green-400">Sade Sati - {user.sadeSati[0].phase} Phase</h3>
            <p className="text-gray-300 max-w-2xl mx-auto">
              You are currently in the <strong>{user.sadeSati[0].phase}</strong> phase of Sade Sati.
              {user.sadeSati[0].effects} Saturn's transit brings karmic lessons and structure.
            </p>
            <div className="w-full bg-slate-700 rounded-full h-3 max-w-md mx-auto">
              <div
                className="bg-gradient-to-r from-green-400 to-blue-400 h-3 rounded-full transition-all duration-1000"
                style={{
                  width: user.sadeSati[0].phase === "Rising" ? "33%" :
                    user.sadeSati[0].phase === "Peak" ? "66%" : "90%"
                }}
              ></div>
            </div>
            <p className="text-sm text-gray-400">Saturn's Transit Progress through {user.moonSign}</p>
          </div>
        </Card>
      ) : (
        <Card className="bg-gradient-to-br from-slate-900/50 to-amber-900/30 border-amber-500/50 p-8 backdrop-blur-sm">
          <div className="text-center space-y-4">
            <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 px-4 py-2">Current Transit</Badge>
            <h3 className="text-2xl font-bold text-amber-400">Jupiter Transit in {user.planetaryPositions?.jupiter?.house || "Benefit"} House</h3>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Jupiter is currently blessing your chart. This is a generally favorable time for growth, learning, and expansion.
              Focus on knowledge and higher wisdom.
            </p>
          </div>
        </Card>
      )}
    </div>
  )
}
