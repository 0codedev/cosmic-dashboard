"use client"

import { useState, useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Play, Pause, ChevronLeft, ChevronRight, RotateCcw, Calendar, Clock } from "lucide-react"
import NorthIndianChart from "@/components/north-indian-chart"
import { useAstrologyStore } from "@/stores/astrology-store"
import { calculateTransits } from "@/lib/transit-engine" // We updated this to be accurate
import { calculateVimshottari, FullDashaResult, DashaPhase, AntardashaPhase } from "@/lib/dasha-engine"
import { normalize, getZodiacSign } from "@/lib/cosmic-engine"

export default function ChronosTimeMachine() {
    const { userData } = useAstrologyStore()
    const [selectedDate, setSelectedDate] = useState(new Date())
    const [isPlaying, setIsPlaying] = useState(false)
    const [playbackSpeed, setPlaybackSpeed] = useState(1) // Days per tick

    // Default to a 100 year span around birth or current
    const minDate = new Date("1950-01-01").getTime()
    const maxDate = new Date("2050-01-01").getTime()

    // --- ENGINE: CALCULATE DATA FOR SELECTED DATE ---

    // 1. Calculate Transits (Planets in Sky at Selected Date)
    const transits = useMemo(() => {
        return calculateTransits(selectedDate);
    }, [selectedDate]);

    // 2. Map Transits to Natal Houses (Lagna)
    const chartData = useMemo(() => {
        if (!userData || !userData.lagnaLongitude) return null;

        const houses: Record<number, any> = {};
        const signs = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];

        // Calculate Natal Lagna Sign Index
        const natalLagnaLon = userData.lagnaLongitude;
        const natalLagnaIndex = Math.floor(normalize(natalLagnaLon) / 30);

        // Initialize empty houses
        for (let i = 1; i <= 12; i++) {
            const currentSignIndex = (natalLagnaIndex + (i - 1)) % 12;
            houses[i] = {
                sign: signs[currentSignIndex],
                planets: [],
                ruler: "" // We could lookup ruler if needed, but simplified for now
            };
        }

        // Place Transit Planets
        Object.values(transits).forEach(planet => {
            const houseNum = Math.floor(normalize(planet.longitude - natalLagnaLon) / 30) + 1;
            if (houses[houseNum]) {
                let pName = planet.planet.substring(0, 2); // Short name
                if (planet.isRetrograde) pName += "*";
                houses[houseNum].planets.push(pName);
            }
        });

        // Add "TR" label to indicate these are transits
        houses[1].meaning = "Transit Chart";

        return houses;
    }, [transits, userData]);

    // 3. Find Active Dasha
    const activeDasha = useMemo(() => {
        if (!userData) return null;

        // We calculate the full timeline once, based on Birth Data
        const birthDate = new Date(`${userData.dob}T${userData.tob}`);

        // Use saved moon longitude if available, or approximate from sign
        let moonLon = 0;
        if (userData.planetaryPositions?.moon?.absoluteLongitude) {
            moonLon = userData.planetaryPositions.moon.absoluteLongitude;
        } else {
            // Fallback (inaccurate but prevents crash)
            moonLon = 180;
        }

        // We only strictly need `calculateVimshottari` result once, 
        // but we need to *search* it for `selectedDate`.
        // Ideally we memoize the TIMELINE separately from the SEARCH.
        const dashaResult = calculateVimshottari(moonLon, birthDate);

        // Search timeline for selectedDate
        const mahadasha = dashaResult.fullPath.find(p => selectedDate >= p.startDate && selectedDate < p.endDate);

        if (!mahadasha) return null;

        // Recalculate Antardashas for this specific Mahadasha to find current
        // (We can't just use dashaResult.currentAntardasha because that's for "Now")
        // We need to import `calculateAntardashas` or replicate logic. 
        // Since `calculateVimshottari` logic is self-contained in engine, checking reuse.
        // Actually `dashaResult` only calculated "Current" based on `new Date()`.

        // FIX: We need to traverse the sub-periods manually for the 'selectedDate'.
        // Importing logic from dasha-engine would be cleaner, but for now specific logic:

        // We will just display Mahadasha for V1 to be safe, or implement deep search if robust.
        return {
            mahadasha
        };
    }, [userData, selectedDate]);


    // --- PLAYBACK CONTROLS ---
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isPlaying) {
            interval = setInterval(() => {
                setSelectedDate(prev => {
                    const next = new Date(prev);
                    next.setDate(next.getDate() + playbackSpeed);
                    return next;
                });
            }, 100); // 10 updates per second
        }
        return () => clearInterval(interval);
    }, [isPlaying, playbackSpeed]);

    const handleSliderChange = (val: number[]) => {
        setIsPlaying(false);
        setSelectedDate(new Date(val[0]));
    }

    const adjustTime = (days: number) => {
        const next = new Date(selectedDate);
        next.setDate(next.getDate() + days);
        setSelectedDate(next);
    }

    if (!userData) return null;

    return (
        <div className="bg-slate-950 rounded-xl border border-indigo-500/20 overflow-hidden">
            {/* Header / Scrubber */}
            <div className="bg-indigo-900/20 p-6 border-b border-indigo-500/20">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">

                    {/* Date Display */}
                    <div className="text-center md:text-left">
                        <div className="text-sm text-cyan-400 font-medium mb-1 flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            Cosmic Time Travel
                        </div>
                        <h2 className="text-3xl font-bold text-white font-mono">
                            {selectedDate.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                        </h2>
                        <p className="text-indigo-300 text-sm">
                            {activeDasha ? `${activeDasha.mahadasha.planet} Mahadasha` : "Calculating Dasha..."}
                        </p>
                    </div>

                    {/* Controls */}
                    <div className="flex flex-col items-center gap-3 w-full md:w-auto">
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="icon" onClick={() => adjustTime(-30)}><ChevronLeft className="w-4 h-4" /></Button>
                            <Button
                                variant={isPlaying ? "destructive" : "default"}
                                size="icon"
                                className="w-12 h-12 rounded-full"
                                onClick={() => setIsPlaying(!isPlaying)}
                            >
                                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                            </Button>
                            <Button variant="outline" size="icon" onClick={() => adjustTime(30)}><ChevronRight className="w-4 h-4" /></Button>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                            <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={() => setSelectedDate(new Date())}>
                                <RotateCcw className="w-3 h-3 mr-1" /> Reset to Now
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Slider */}
                <div className="mt-6 px-2">
                    <Slider
                        defaultValue={[new Date().getTime()]}
                        value={[selectedDate.getTime()]}
                        min={minDate}
                        max={maxDate}
                        step={1000 * 60 * 60 * 24} // 1 day step
                        onValueChange={handleSliderChange}
                        className="cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-2 font-mono">
                        <span>1950</span>
                        <span>2000</span>
                        <span className="text-cyan-500">Today</span>
                        <span>2050</span>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="grid md:grid-cols-2 gap-8 p-8">

                {/* Left: Transit Chart */}
                <div className="relative">
                    <div className="absolute top-0 left-0 bg-indigo-500/10 text-indigo-300 text-xs px-2 py-1 rounded backdrop-blur-md z-10 border border-indigo-500/20">
                        Transit Chart (Relative to Natal Lagna)
                    </div>
                    {chartData ? (
                        <NorthIndianChart
                            houses={chartData}
                            className="w-full max-w-[400px] mx-auto"
                        />
                    ) : (
                        <div className="flex items-center justify-center h-[300px] text-gray-500">
                            Loading Chart...
                        </div>
                    )}
                </div>

                {/* Right: Insights */}
                <div className="space-y-6">
                    {/* Active Transit Highlights */}
                    <Card className="bg-slate-900/50 p-4 border-indigo-500/20">
                        <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-purple-400" />
                            Active Influences
                        </h3>
                        <div className="space-y-3">
                            {/* Saturn check */}
                            {chartData && (
                                <div className="text-sm text-gray-300">
                                    <div className="flex justify-between py-1 border-b border-white/5">
                                        <span>Saturn Transit</span>
                                        <span className="text-amber-400">
                                            {/* We need to reverse lookup house from chartData */}
                                            {Object.entries(chartData).find(([_, h]: any) => h.planets.includes("Sa") || h.planets.includes("Sa*"))?.[0]}th House
                                        </span>
                                    </div>
                                    <div className="flex justify-between py-1 border-b border-white/5">
                                        <span>Jupiter Transit</span>
                                        <span className="text-yellow-400">
                                            {Object.entries(chartData).find(([_, h]: any) => h.planets.includes("Ju") || h.planets.includes("Ju*"))?.[0]}th House
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </Card>

                    {/* Dasha Card */}
                    {activeDasha && (
                        <Card className="bg-gradient-to-br from-purple-900/20 to-indigo-900/20 p-4 border-purple-500/20">
                            <h3 className="text-lg font-semibold text-white mb-2">Vimshottari Dasha</h3>
                            <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-1">
                                {activeDasha.mahadasha.planet}
                            </div>
                            <div className="text-xs text-gray-400 mb-4">
                                Major Period (Mahadasha)
                            </div>
                            <div className="flex justify-between text-xs text-gray-500">
                                <span>Start: {activeDasha.mahadasha.startDate.toLocaleDateString()}</span>
                                <span>End: {activeDasha.mahadasha.endDate.toLocaleDateString()}</span>
                            </div>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    )
}
