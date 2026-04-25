"use client"

import React, { useState, useMemo, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
    AlertTriangle, 
    TrendingUp, 
    Calendar, 
    Star, 
    Globe, 
    Orbit, 
    ChevronRight,
    Zap,
    Target,
    Activity,
    ShieldCheck
} from "lucide-react"
import RetrogradeTracker from "@/components/retrograde-tracker"
import { getCurrentPlanetaryPositions, getTransitToNatalAspects, TransitPosition } from "@/lib/transit-engine"
import { SUDHANSHU_DATA } from "@/data/user-data"

export default function TransitForecast() {
    const [selectedTransit, setSelectedTransit] = useState<string | null>(null)
    const [currentPositions, setCurrentPositions] = useState<TransitPosition[]>([])
    
    const user = SUDHANSHU_DATA;

    useEffect(() => {
        const positions = getCurrentPlanetaryPositions(new Date())
        setCurrentPositions(positions)
        const interval = setInterval(() => {
            setCurrentPositions(getCurrentPlanetaryPositions(new Date()))
        }, 300000)
        return () => clearInterval(interval)
    }, [])

    return (
        <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 pb-24 md:pb-8">
            {/* 1. Navatara Trading Calendar */}
            <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                    <CardTitle className="text-xl font-bold text-zinc-100 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-indigo-400" />
                        Navatara Trading Calendar
                    </CardTitle>
                    <CardDescription>Daily moon-nakshatra alignment for high-probability execution</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-9 gap-2">
                        {user.navataraChakra.map((n, i) => {
                            const isDanger = n.name === 'Naidhana' || n.name === 'Vipat';
                            const isSuccess = n.name === 'Sadhaka' || n.name === 'Sampat' || n.name === 'Kshema';
                            return (
                                <div key={i} className={`p-3 rounded-xl border text-center space-y-1 transition-all hover:scale-105 ${
                                    isDanger ? 'bg-red-500/10 border-red-500/30' : 
                                    isSuccess ? 'bg-emerald-500/10 border-emerald-500/30' : 
                                    'bg-zinc-800/50 border-zinc-700/50'
                                }`}>
                                    <h5 className={`text-[10px] font-black uppercase ${
                                        isDanger ? 'text-red-400' : isSuccess ? 'text-emerald-400' : 'text-zinc-400'
                                    }`}>{n.name}</h5>
                                    <p className="text-[9px] text-zinc-500 font-medium leading-tight">{n.description}</p>
                                    <div className="pt-1 border-t border-zinc-800 mt-1">
                                        <p className={`text-[8px] font-bold ${
                                            isDanger ? 'text-red-500' : isSuccess ? 'text-emerald-500' : 'text-zinc-500'
                                        }`}>{n.tradingAction.split('-')[0]}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* 2. Ashtakvarga Strength Board */}
                <Card className="lg:col-span-1 bg-zinc-900 border-zinc-800">
                    <CardHeader>
                        <CardTitle className="text-zinc-100 flex items-center gap-2">
                            <Target className="w-5 h-5 text-purple-400" />
                            Ashtakvarga Strength
                        </CardTitle>
                        <CardDescription>Transit threshold by house score</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-4 gap-2">
                            {Object.entries(user.ashtakvarga).map(([house, score]: any) => (
                                <div key={house} className={`p-2 rounded-lg border text-center ${
                                    score >= 28 ? 'bg-emerald-500/10 border-emerald-500/20' : 
                                    score < 25 ? 'bg-red-500/10 border-red-500/20' : 
                                    'bg-zinc-800 border-zinc-700'
                                }`}>
                                    <span className="text-[10px] text-zinc-500 block">H{house}</span>
                                    <span className={`text-lg font-black ${
                                        score >= 28 ? 'text-emerald-400' : 
                                        score < 25 ? 'text-red-400' : 
                                        'text-zinc-200'
                                    }`}>{score}</span>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 p-3 bg-indigo-500/5 rounded-xl border border-indigo-500/20">
                            <p className="text-[10px] text-indigo-300 leading-relaxed font-medium">
                                <Zap className="w-3 h-3 inline mr-1" />
                                HIGH SCORE (28+): House can handle transits/shocks. 
                                <br />
                                LOW SCORE ({"<"}25): Any transit here will trigger losses.
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* 3. Live Planetary Matrix */}
                <Card className="lg:col-span-2 bg-zinc-900 border-zinc-800 overflow-hidden">
                    <CardHeader>
                        <CardTitle className="text-zinc-100 flex items-center gap-2">
                            <Orbit className="w-5 h-5 text-cyan-400" />
                            Live Planetary Matrix
                        </CardTitle>
                        <CardDescription>Real-time transit impact on Natal chart</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                            {currentPositions.map((pos, idx) => {
                                const signIndex = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"].indexOf(pos.sign);
                                // Simple house calculation from Aquarius (11) Lagna
                                const house = ((signIndex - 10 + 12) % 12) + 1;
                                const houseScore = user.ashtakvarga[house as keyof typeof user.ashtakvarga];
                                
                                return (
                                    <div key={idx} className="p-3 bg-zinc-800/50 rounded-xl border border-zinc-700 hover:border-cyan-500/30 transition-colors group">
                                        <div className="flex justify-between items-start mb-1">
                                            <span className="text-xs font-bold text-zinc-100 uppercase">{pos.planet}</span>
                                            {pos.isRetrograde && <Badge className="bg-orange-500/20 text-orange-400 text-[8px] h-4">℞</Badge>}
                                        </div>
                                        <p className="text-[10px] text-cyan-400 font-mono">{pos.sign} {Math.floor(pos.degree)}°</p>
                                        <div className="flex items-center gap-1 mt-2">
                                            <span className="text-[10px] text-zinc-500">SAV:</span>
                                            <span className={`text-xs font-black ${houseScore >= 28 ? 'text-emerald-400' : 'text-zinc-300'}`}>{houseScore}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* 4. Sade Sati Tracking (Corrected) */}
            <Card className="bg-zinc-900 border-zinc-800 border-l-4 border-l-red-500">
                <CardHeader>
                    <CardTitle className="text-red-400 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5" />
                        Sade Sati: Peak Transition Phase
                    </CardTitle>
                    <CardDescription>Saturn transiting natal Moon (Aquarius 1st House)</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-4">
                        <h5 className="text-zinc-200 font-bold text-sm uppercase tracking-widest">Active Influence</h5>
                        <ul className="space-y-2">
                            <li className="flex gap-2 text-xs text-zinc-400">
                                <span className="text-red-500">•</span> Mental fatigue & structural pressure
                            </li>
                            <li className="flex gap-2 text-xs text-zinc-400">
                                <span className="text-red-500">•</span> Compulsion to take uncalculated risks
                            </li>
                            <li className="flex gap-2 text-xs text-zinc-400">
                                <span className="text-red-500">•</span> Delay in recognized gains
                            </li>
                        </ul>
                    </div>
                    <div className="space-y-4">
                        <h5 className="text-emerald-400 font-bold text-sm uppercase tracking-widest">Corrective Action</h5>
                        <ul className="space-y-2">
                            <li className="flex gap-2 text-xs text-zinc-400">
                                <CheckCircle2 className="w-3 h-3 text-emerald-500 mt-0.5" /> Serve manual laborers (Saturn)
                            </li>
                            <li className="flex gap-2 text-xs text-zinc-400">
                                <CheckCircle2 className="w-3 h-3 text-emerald-500 mt-0.5" /> Saturday: Fast or donate oil/salt
                            </li>
                            <li className="flex gap-2 text-xs text-zinc-400">
                                <CheckCircle2 className="w-3 h-3 text-emerald-500 mt-0.5" /> High discipline in routines
                            </li>
                        </ul>
                    </div>
                    <div className="p-4 bg-red-500/5 rounded-2xl border border-red-500/20 flex flex-col justify-center items-center text-center">
                        <ShieldCheck className="w-8 h-8 text-red-500 mb-2 opacity-50" />
                        <h5 className="text-xs font-black text-red-400 uppercase mb-1">Gemstone Alert</h5>
                        <p className="text-[10px] text-zinc-400 italic">
                            Despite Sade Sati pressure, Blue Sapphire remains BANNED due to 6/8 axis placement. Use discipline, not the stone.
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* 5. Retrograde Tracker */}
            <RetrogradeTracker />
        </div>
    );
}

function CheckCircle2({ className }: { className?: string }) {
    return <Activity className={className} />
}
