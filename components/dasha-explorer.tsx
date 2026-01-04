"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
//  Check imports - Lucide icons
import { Calendar, Clock, TrendingUp, AlertTriangle, Sparkles, ChevronRight, ArrowRight } from "lucide-react"
import { useAstrologyStore } from "@/stores/astrology-store"
import { calculateVimshottari, calculateAntardashas, calculatePratyantardashas, DashaPhase, AntardashaPhase, PratyantardashaPhase, formatDashaDate } from "@/lib/dasha-engine"

export default function DashaExplorer() {
  const { userData } = useAstrologyStore()
  const [selectedMahadasha, setSelectedMahadasha] = useState<DashaPhase | null>(null)
  const [selectedAntardasha, setSelectedAntardasha] = useState<AntardashaPhase | null>(null)

  // Calculate Dasha System
  const dashaSystem = useMemo(() => {
    if (!userData || !userData.planetaryPositions.moon.absoluteLongitude) return null;

    // Parse birth date
    const dob = new Date(userData.dob);
    const tobParts = userData.tob.split(':');
    dob.setHours(parseInt(tobParts[0]), parseInt(tobParts[1]));

    return calculateVimshottari(userData.planetaryPositions.moon.absoluteLongitude, dob);
  }, [userData]);

  // Antardashas for Selected Mahadasha
  const activeAntardashas = useMemo(() => {
    const target = selectedMahadasha || dashaSystem?.current;
    if (!target) return [];
    return calculateAntardashas(target);
  }, [selectedMahadasha, dashaSystem]);

  // Pratyantardashas for Selected Antardasha
  const activePratyantardashas = useMemo(() => {
    if (!selectedAntardasha) return [];
    return calculatePratyantardashas(selectedAntardasha);
  }, [selectedAntardasha]);

  if (!dashaSystem) {
    return (
      <Card className="p-8 text-center bg-slate-900/50 border-slate-800">
        <p className="text-gray-400">Loading planetary data for Dasha calculation...</p>
      </Card>
    )
  }

  const { current, fullPath } = dashaSystem;
  const activeMaha = selectedMahadasha || current;

  // Progress of current/selected Mahadasha
  const now = new Date();
  const totalDuration = activeMaha.endDate.getTime() - activeMaha.startDate.getTime();
  const elapsed = now.getTime() - activeMaha.startDate.getTime();
  const progress = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));

  // Helper to get color based on planet
  const getPlanetColor = (planet: string) => {
    const colors: Record<string, string> = {
      Sun: "orange", Moon: "zinc", Mars: "red", Rahu: "blue", Jupiter: "yellow",
      Saturn: "indigo", Mercury: "emerald", Ketu: "slate", Venus: "pink"
    };
    return colors[planet] || "purple";
  }

  return (
    <div className="space-y-6">
      {/* Header / Current Status */}
      <Card className="bg-gradient-to-br from-slate-900/50 to-indigo-900/30 border-indigo-500/30 p-8 backdrop-blur-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Clock className="w-32 h-32" />
        </div>

        <div className="relative z-10 text-center space-y-4">
          <Badge className="bg-indigo-500/20 text-indigo-300 border-indigo-500/30 px-4 py-2">
            {selectedMahadasha ? "Viewing Details" : "Active Now"}
          </Badge>

          <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 to-purple-300">
            {activeMaha.planet} Mahadasha
          </h2>

          <p className="text-gray-300 text-lg">
            {formatDashaDate(activeMaha.startDate)} — {formatDashaDate(activeMaha.endDate)}
          </p>

          <div className="max-w-xl mx-auto space-y-2">
            <div className="flex justify-between text-sm text-gray-400">
              <span>Started</span>
              <span>{Math.round(progress)}% Complete</span>
              <span>Ends</span>
            </div>
            <Progress value={progress} className="h-3 bg-slate-800" />
          </div>
        </div>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Timeline Column */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className="text-xl font-bold text-gray-200 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-purple-400" />
            Mahadasha Timeline
          </h3>
          <div className="space-y-3 h-[600px] overflow-y-auto pr-2 custom-scrollbar">
            {fullPath.map((phase, idx) => {
              const isCurrent = phase.planet === current.planet && phase.startDate.getTime() === current.startDate.getTime();
              const isSelected = activeMaha.planet === phase.planet && activeMaha.startDate.getTime() === phase.startDate.getTime();
              const color = getPlanetColor(phase.planet);

              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => {
                    setSelectedMahadasha(phase);
                    setSelectedAntardasha(null);
                  }}
                  className={`
                                        cursor-pointer rounded-xl p-4 border transition-all duration-300
                                        ${isSelected
                      ? `bg-${color}-900/20 border-${color}-400 ring-1 ring-${color}-400`
                      : isCurrent
                        ? "bg-slate-800/60 border-indigo-500/50"
                        : "bg-slate-900/40 border-slate-700/50 hover:bg-slate-800/60"
                    }
                                    `}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className={`font-bold text-lg ${isSelected ? `text-${color}-300` : "text-gray-300"}`}>
                      {phase.planet}
                    </span>
                    {isCurrent && <Badge variant="secondary" className="text-xs bg-indigo-500/20 text-indigo-300">Current</Badge>}
                  </div>
                  <div className="text-xs text-gray-400 flex justify-between">
                    <span>{formatDashaDate(phase.startDate)}</span>
                    <ArrowRight className="w-3 h-3 text-gray-600" />
                    <span>{formatDashaDate(phase.endDate)}</span>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Drill Down Column */}
        <div className="lg:col-span-2 space-y-6">

          {/* Antardasha Grid */}
          <Card className="bg-slate-900/40 border-slate-800 p-6">
            <h4 className="text-lg font-semibold text-gray-300 mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-blue-400" />
              {activeMaha.planet} &gt; Antardashas
            </h4>

            <div className="grid md:grid-cols-2 gap-3">
              {activeAntardashas.map((antar, idx) => {
                const isActive = antar.isCurrent && activeMaha === current; // Only show 'current' if looking at current mahadasha
                const isSelected = selectedAntardasha?.planet === antar.planet;

                return (
                  <div
                    key={idx}
                    onClick={() => setSelectedAntardasha(antar)}
                    className={`
                                            p-3 rounded-lg border cursor-pointer transition-colors relative
                                            ${isSelected
                        ? "bg-blue-900/20 border-blue-400"
                        : isActive
                          ? "bg-indigo-900/10 border-indigo-500/30"
                          : "bg-slate-800/30 border-slate-700 hover:bg-slate-800"
                      }
                                        `}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-blue-200">{antar.planet}</span>
                      {isActive && <span className="flex h-2 w-2 rounded-full bg-indigo-400 animate-pulse" />}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      {formatDashaDate(antar.startDate)} - {formatDashaDate(antar.endDate)}
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>

          {/* Pratyantardasha List (If Antardasha Selected) */}
          <AnimatePresence mode="wait">
            {selectedAntardasha && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
              >
                <Card className="bg-slate-900/40 border-slate-800 p-6">
                  <h4 className="text-lg font-semibold text-gray-300 mb-4 flex items-center">
                    <Sparkles className="w-5 h-5 mr-2 text-yellow-400" />
                    {activeMaha.planet} &gt; {selectedAntardasha.planet} &gt; Pratyantardashas
                  </h4>

                  <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                    {activePratyantardashas.map((prat, idx) => {
                      const isActive = prat.isCurrent && selectedAntardasha.isCurrent && activeMaha === current;

                      return (
                        <div
                          key={idx}
                          className={`
                                                        text-center p-2 rounded border text-xs
                                                        ${isActive
                              ? "bg-yellow-900/20 border-yellow-500/50 text-yellow-200"
                              : "bg-slate-800/20 border-slate-700 text-gray-400"
                            }
                                                    `}
                        >
                          <div className="font-bold mb-1">{prat.planet}</div>
                          <div className="scale-90 opacity-70">
                            {prat.startDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </div>
  )
}
