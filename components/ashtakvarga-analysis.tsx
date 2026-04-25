"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    BarChart3,
    Info,
    TrendingUp,
    TrendingDown,
    Zap,
    Target,
    Activity,
    ShieldCheck,
    DollarSign,
    Skull,
    AlertTriangle
} from "lucide-react"
import { SUDHANSHU_DATA } from "@/data/user-data"

export default function AshtakvargaAnalysis() {
    const [selectedHouse, setSelectedHouse] = useState<number | null>(null)
    const user = SUDHANSHU_DATA;
    
    const houses = [
        { house: 1, sign: "Aquarius", score: user.ashtakvarga[1], significations: ["Self", "Vitality", "Identity"], roi: "High - Identity based branding/work" },
        { house: 2, sign: "Pisces", score: user.ashtakvarga[2], significations: ["Wealth", "Speech", "Family"], roi: "Moderate - Liquid assets" },
        { house: 3, sign: "Aries", score: user.ashtakvarga[3], significations: ["Courage", "Communication", "Short Travel"], roi: "High - Active networking" },
        { house: 4, sign: "Taurus", score: user.ashtakvarga[4], significations: ["Home", "Mother", "Property"], roi: "Moderate - Real estate" },
        { house: 5, sign: "Gemini", score: user.ashtakvarga[5], significations: ["Children", "Speculation", "Creativity"], roi: "CRITICAL - High risk of loss in speculation" },
        { house: 6, sign: "Cancer", score: user.ashtakvarga[6], significations: ["Service", "Competition", "Debts"], roi: "MAXIMUM - Gains through service & debt management" },
        { house: 7, sign: "Leo", score: user.ashtakvarga[7], significations: ["Partnership", "Business", "Wife"], roi: "Low - Unstable partnerships" },
        { house: 8, sign: "Virgo", score: user.ashtakvarga[8], significations: ["Transformation", "Research", "Sudden Events"], roi: "Moderate - Gains through deep research" },
        { house: 9, sign: "Libra", score: user.ashtakvarga[9], significations: ["Luck", "Fortune", "Father"], roi: "WEAK - Do not rely on pure luck" },
        { house: 10, sign: "Scorpio", score: user.ashtakvarga[10], significations: ["Career", "Status", "Public Karma"], roi: "Low - High effort required for status" },
        { house: 11, sign: "Sagittarius", score: user.ashtakvarga[11], significations: ["Gains", "Networking", "Desires"], roi: "High - Gains through social circles" },
        { house: 12, sign: "Capricorn", score: user.ashtakvarga[12], significations: ["Loss", "Expenditure", "Foreign"], roi: "Danger - High risk of expenditure" },
    ];

    const getStrengthColor = (score: number) => {
        if (score >= 28) return "emerald";
        if (score < 25) return "red";
        return "zinc";
    };

    return (
        <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 pb-24 md:pb-8">
            {/* Header */}
            <Card className="bg-zinc-900 border-zinc-800 border-b-4 border-b-indigo-500">
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="text-2xl font-black text-white uppercase tracking-tighter">
                            Ashtakvarga <span className="text-indigo-500">Matrix</span>
                        </CardTitle>
                        <CardDescription>Mathematical strength of each life department</CardDescription>
                    </div>
                    <div className="text-right">
                        <span className="text-[10px] text-zinc-500 uppercase font-black block">Total Score</span>
                        <span className="text-3xl font-black text-white">339</span>
                    </div>
                </CardHeader>
            </Card>

            {/* 1. The Matrix Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {houses.map((h, i) => {
                    const color = getStrengthColor(h.score);
                    const isSelected = selectedHouse === h.house;
                    return (
                        <motion.div
                            key={i}
                            whileHover={{ scale: 1.05 }}
                            onClick={() => setSelectedHouse(isSelected ? null : h.house)}
                            className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                                isSelected ? `bg-${color}-500/10 border-${color}-500 shadow-lg` : 'bg-zinc-900 border-zinc-800'
                            }`}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">H{h.house}</span>
                                {h.score >= 28 && <Zap className="w-3 h-3 text-emerald-400" />}
                                {h.score < 25 && <AlertTriangle className="w-3 h-3 text-red-400" />}
                            </div>
                            <h4 className="text-2xl font-black text-white leading-none mb-1">{h.score}</h4>
                            <p className="text-[10px] text-zinc-500 uppercase font-bold truncate">{h.sign}</p>
                            <div className={`mt-3 h-1 w-full rounded-full bg-zinc-800 overflow-hidden`}>
                                <div 
                                    className={`h-full bg-${color}-500 transition-all duration-1000`} 
                                    style={{ width: `${(h.score / 45) * 100}%` }} 
                                />
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* 2. Focused ROI Analysis */}
            <AnimatePresence mode="wait">
                {selectedHouse ? (
                    <motion.div
                        key={selectedHouse}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                    >
                        <Card className="bg-zinc-900 border-zinc-800 border-l-4 border-l-indigo-500">
                            <CardHeader>
                                <div className="flex justify-between items-center">
                                    <CardTitle className="text-xl text-white uppercase">House {selectedHouse} Analysis: {houses[selectedHouse-1].sign}</CardTitle>
                                    <Badge className={`bg-${getStrengthColor(houses[selectedHouse-1].score)}-500/20 text-${getStrengthColor(houses[selectedHouse-1].score)}-400`}>
                                        Score: {houses[selectedHouse-1].score}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <h5 className="text-zinc-500 text-[10px] uppercase font-black tracking-widest">Life Significances</h5>
                                    <div className="flex flex-wrap gap-2">
                                        {houses[selectedHouse-1].significations.map((s, i) => (
                                            <Badge key={i} variant="outline" className="bg-zinc-800 border-zinc-700 text-zinc-300 px-3 py-1">
                                                {s}
                                            </Badge>
                                        ))}
                                    </div>
                                    <p className="text-sm text-zinc-400 leading-relaxed italic">
                                        "{houses[selectedHouse-1].roi}"
                                    </p>
                                </div>
                                <div className="p-6 bg-zinc-800/50 rounded-3xl border border-zinc-700 flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center shrink-0`}>
                                        <DollarSign className="w-6 h-6 text-indigo-400" />
                                    </div>
                                    <div>
                                        <h5 className="text-xs font-black text-indigo-400 uppercase mb-1">Trading Strategy</h5>
                                        <p className="text-sm text-zinc-100 font-bold leading-tight">
                                            {houses[selectedHouse-1].score >= 28 ? "GREEN LIGHT: Deploy full capital in this department." : 
                                             houses[selectedHouse-1].score < 25 ? "RED LIGHT: Heavy risk of capital erosion." : 
                                             "YELLOW LIGHT: Guarded approach required."}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ) : (
                    <Card className="bg-zinc-900 border-zinc-800 p-8 flex flex-col items-center text-center space-y-4 opacity-50">
                        <Target className="w-12 h-12 text-zinc-700" />
                        <p className="text-zinc-500 uppercase text-xs font-black tracking-widest">Select a house for deep ROI analysis</p>
                    </Card>
                )}
            </AnimatePresence>

            {/* 3. Wealth Threshold Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-emerald-500/5 border-emerald-500/20">
                    <CardHeader>
                        <CardTitle className="text-emerald-400 flex items-center gap-2 text-sm uppercase font-black">
                            <TrendingUp className="w-4 h-4" />
                            Wealth Multipliers (Score {">"} 28)
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex justify-between items-center text-xs border-b border-emerald-500/10 pb-2">
                            <span className="text-zinc-400">6th House (Cancer)</span>
                            <span className="text-emerald-400 font-black">38</span>
                        </div>
                        <div className="flex justify-between items-center text-xs border-b border-emerald-500/10 pb-2">
                            <span className="text-zinc-400">1st House (Aquarius)</span>
                            <span className="text-emerald-400 font-black">33</span>
                        </div>
                        <div className="flex justify-between items-center text-xs border-b border-emerald-500/10 pb-2">
                            <span className="text-zinc-400">11th House (Sagittarius)</span>
                            <span className="text-emerald-400 font-black">33</span>
                        </div>
                        <p className="text-[10px] text-zinc-500 italic mt-2">
                            *Transits of benefic planets (Jupiter, Mercury, Venus) through these houses bring maximum ROI.
                        </p>
                    </CardContent>
                </Card>

                <Card className="bg-red-500/5 border-red-500/20">
                    <CardHeader>
                        <CardTitle className="text-red-400 flex items-center gap-2 text-sm uppercase font-black">
                            <TrendingDown className="w-4 h-4" />
                            Energy Leaks (Score {"<"} 25)
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex justify-between items-center text-xs border-b border-red-500/10 pb-2">
                            <span className="text-zinc-400">12th House (Capricorn)</span>
                            <span className="text-red-400 font-black">20</span>
                        </div>
                        <div className="flex justify-between items-center text-xs border-b border-red-500/10 pb-2">
                            <span className="text-zinc-400">9th House (Libra)</span>
                            <span className="text-red-400 font-black">23</span>
                        </div>
                        <div className="flex justify-between items-center text-xs border-b border-red-500/10 pb-2">
                            <span className="text-zinc-400">5th House (Gemini)</span>
                            <span className="text-red-400 font-black">23</span>
                        </div>
                        <p className="text-[10px] text-zinc-500 italic mt-2">
                            *Transits through these houses, even by benefics, will likely result in expenditure or loss.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
