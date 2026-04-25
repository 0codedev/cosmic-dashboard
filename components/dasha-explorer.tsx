"use client"

import React, { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
    Calendar, 
    Clock, 
    TrendingUp, 
    AlertTriangle, 
    Sparkles, 
    ChevronRight, 
    ArrowRight, 
    Star, 
    Info, 
    Zap, 
    Shield, 
    Target,
    Activity,
    InfoIcon
} from "lucide-react"
import { useAstrologyStore } from "@/stores/astrology-store"
import { formatDashaDate } from "@/lib/dasha-engine"

export default function DashaExplorer() {
    const { userData } = useAstrologyStore();
    const [selectedMahadasha, setSelectedMahadasha] = useState<any>(null);
    const [selectedAntardasha, setSelectedAntardasha] = useState<any>(null);

    const dashas = userData?.dashaSystem?.vimshottari;
    const currentMaha = dashas?.mahadashas.find((m: any) => {
        const now = new Date();
        const start = new Date(m.start.split('/').reverse().join('-'));
        const end = new Date(m.end.split('/').reverse().join('-'));
        return now >= start && now <= end;
    }) || dashas?.mahadashas[1]; // Fallback to Jupiter

    const activeMaha = selectedMahadasha || currentMaha;

    const antardashas = dashas?.antardashas || [];
    const pratyantars = dashas?.pratyantars || [];

    const getSignalColor = (signal: string) => {
        switch (signal?.toLowerCase()) {
            case 'danger': return 'red';
            case 'yellow': return 'yellow';
            case 'green':
            case 'prime': return 'emerald';
            default: return 'zinc';
        }
    };

    return (
        <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 pb-24 md:pb-8">
            {/* Header / Active Mahadasha */}
            <Card className="bg-zinc-900 border-zinc-800 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Calendar className="w-48 h-48" />
                </div>
                <CardHeader className="text-center relative z-10">
                    <Badge variant="outline" className="mx-auto mb-4 bg-indigo-500/10 text-indigo-400 border-indigo-500/20">
                        Current Mahadasha Phase
                    </Badge>
                    <CardTitle className="text-5xl font-black text-white uppercase tracking-tighter">
                        {activeMaha?.lord} <span className="text-zinc-500">Mahadasha</span>
                    </CardTitle>
                    <CardDescription className="text-zinc-400 text-lg mt-2">
                        {activeMaha?.start} — {activeMaha?.end}
                    </CardDescription>
                </CardHeader>
                <CardContent className="max-w-2xl mx-auto pb-10 relative z-10">
                    <div className="space-y-4">
                        <div className="flex justify-between text-xs text-zinc-500 uppercase tracking-widest font-bold">
                            <span>Commencement</span>
                            <span>Evolution</span>
                            <span>Completion</span>
                        </div>
                        <Progress value={65} className="h-2 bg-zinc-800" indicatorClassName="bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
                        <p className="text-center text-sm text-zinc-500 italic">
                            "Period of expansion, higher learning, and spiritual growth (16 years)"
                        </p>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* 1. The Timeline (Mahadashas) */}
                <div className="lg:col-span-4 space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="w-5 h-5 text-indigo-400" />
                        <h3 className="text-lg font-bold text-zinc-100 uppercase tracking-widest">Life Arc</h3>
                    </div>
                    <div className="space-y-3">
                        {dashas?.mahadashas.map((m: any, i: number) => {
                            const isSelected = activeMaha?.lord === m.lord;
                            return (
                                <motion.div
                                    key={i}
                                    whileHover={{ x: 4 }}
                                    onClick={() => setSelectedMahadasha(m)}
                                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                                        isSelected 
                                        ? "bg-indigo-500/10 border-indigo-500/50 ring-1 ring-indigo-500/20" 
                                        : "bg-zinc-900 border-zinc-800 hover:border-zinc-700"
                                    }`}
                                >
                                    <div className="flex justify-between items-center mb-1">
                                        <span className={`font-bold uppercase tracking-tight ${isSelected ? 'text-indigo-400' : 'text-zinc-300'}`}>
                                            {m.lord}
                                        </span>
                                        <span className="text-[10px] text-zinc-500 font-mono">{m.start.split('/')[2]} — {m.end.split('/')[2]}</span>
                                    </div>
                                    <p className="text-[10px] text-zinc-500 line-clamp-1 italic">
                                        {m.lord === 'jupiter' ? 'Wisdom & Expansion' : m.lord === 'saturn' ? 'Structure & Karma' : 'Communication & Growth'}
                                    </p>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                {/* 2. Sub-periods (Antardashas & Pratyantars) */}
                <div className="lg:col-span-8 space-y-8">
                    {/* Antardashas */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <Clock className="w-5 h-5 text-purple-400" />
                            <h3 className="text-lg font-bold text-zinc-100 uppercase tracking-widest">Active Sub-periods (Antardashas)</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {antardashas.map((a: any, i: number) => {
                                const color = getSignalColor(a.signal);
                                return (
                                    <Card key={i} className={`bg-zinc-900 border-zinc-800 relative overflow-hidden group hover:border-${color}-500/30 transition-colors`}>
                                        <CardHeader className="p-4 pb-2">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <CardTitle className="text-lg text-zinc-100 uppercase">{a.lord}</CardTitle>
                                                    <CardDescription className="text-[10px] font-mono">{a.start} — {a.end}</CardDescription>
                                                </div>
                                                {a.signal && (
                                                    <Badge className={`bg-${color}-500/20 text-${color}-400 border-${color}-500/30`}>
                                                        {a.signal}
                                                    </Badge>
                                                )}
                                            </div>
                                        </CardHeader>
                                        <CardContent className="p-4 pt-0">
                                            <p className="text-xs text-zinc-400 leading-relaxed italic">
                                                {a.instructions || "Stable sub-period focus."}
                                            </p>
                                        </CardContent>
                                        {a.signal === 'Danger' && (
                                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
                                        )}
                                    </Card>
                                );
                            })}
                        </div>
                    </div>

                    {/* Pratyantars (The Ultra-Timing) */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <Zap className="w-5 h-5 text-yellow-400" />
                                <h3 className="text-lg font-bold text-zinc-100 uppercase tracking-widest">The Ultra-Timing (Pratyantardashas)</h3>
                            </div>
                            <Badge variant="outline" className="text-[10px] border-zinc-800 text-zinc-500">4th Level Resolution</Badge>
                        </div>
                        <div className="space-y-4">
                            {pratyantars.map((p: any, i: number) => {
                                const color = getSignalColor(p.signal);
                                return (
                                    <div key={i} className={`p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800 flex flex-col md:flex-row gap-4 items-start md:items-center group hover:bg-zinc-800/50 transition-all border-l-4 border-l-${color}-500`}>
                                        <div className="min-w-[120px]">
                                            <h4 className="text-lg font-black text-zinc-100 uppercase">{p.lord}</h4>
                                            <p className="text-[10px] text-zinc-500 font-mono">{p.start} — {p.end}</p>
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <InfoIcon className={`w-3 h-3 text-${color}-400`} />
                                                <span className={`text-[10px] font-bold uppercase tracking-wider text-${color}-400`}>Trading Status: {p.signal}</span>
                                            </div>
                                            <p className="text-sm text-zinc-300 leading-relaxed font-medium">
                                                {p.instructions}
                                            </p>
                                        </div>
                                        <div className={`px-3 py-1 rounded-full bg-${color}-500/10 border border-${color}-500/20 text-[10px] font-bold text-${color}-400 uppercase tracking-widest`}>
                                            {p.signal === 'Danger' ? '🚫 Stop' : p.signal === 'Yellow' ? '⚠️ Caution' : '✅ Proceed'}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Summary */}
            <Card className="bg-zinc-900 border-zinc-800 border-t-4 border-t-indigo-500">
                <CardContent className="p-6">
                    <div className="flex gap-4 items-start">
                        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
                            <Activity className="w-5 h-5 text-indigo-400" />
                        </div>
                        <div>
                            <h4 className="text-zinc-100 font-bold mb-1">Dasha Architecture Note</h4>
                            <p className="text-sm text-zinc-400 leading-relaxed">
                                You are currently in the final years of your 16-year Jupiter Mahadasha. The focus is shifting from pure learning to the structured discipline of the upcoming Saturn Mahadasha (2027). All trading signals are calculated by crossing these major arcs with the 4th-level Pratyantar precision.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
