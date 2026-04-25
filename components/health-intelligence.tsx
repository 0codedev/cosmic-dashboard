"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { 
    Activity, 
    Zap, 
    Brain, 
    Moon, 
    Stethoscope, 
    Utensils, 
    Dumbbell, 
    AlertCircle, 
    CheckCircle2, 
    Heart, 
    ShieldAlert,
    Thermometer
} from 'lucide-react'
import { SUDHANSHU_DATA } from '@/data/user-data'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

export default function HealthIntelligence() {
    const health = SUDHANSHU_DATA.healthProtocol;

    return (
        <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 pb-24 md:pb-8">
            {/* 1. Constitution & Vitality Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-xl md:col-span-2">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <Activity className="text-emerald-400 w-6 h-6" />
                            <div>
                                <CardTitle className="text-zinc-100">Body Constitution (Prakriti)</CardTitle>
                                <CardDescription className="text-zinc-500">Aquarius Lagna • Vata-Pitta Dominant</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
                            <p className="text-zinc-300 leading-relaxed italic">
                                "{health.constitution}"
                            </p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                            <div className="bg-zinc-800/30 p-3 rounded-lg border border-zinc-700/50">
                                <span className="text-xs text-zinc-500 uppercase tracking-wider block mb-1">Recovery Power</span>
                                <div className="flex items-end gap-2">
                                    <span className="text-2xl font-bold text-zinc-100">38</span>
                                    <span className="text-xs text-emerald-400 mb-1">Max Score</span>
                                </div>
                                <Progress value={95} className="h-1 mt-2 bg-zinc-700" indicatorClassName="bg-emerald-500" />
                            </div>
                            <div className="bg-zinc-800/30 p-3 rounded-lg border border-zinc-700/50">
                                <span className="text-xs text-zinc-500 uppercase tracking-wider block mb-1">Metabolism</span>
                                <div className="flex items-end gap-2">
                                    <span className="text-2xl font-bold text-zinc-100">Pitta</span>
                                    <span className="text-xs text-orange-400 mb-1">Internal Heat</span>
                                </div>
                                <Progress value={65} className="h-1 mt-2 bg-zinc-700" indicatorClassName="bg-orange-500" />
                            </div>
                            <div className="bg-zinc-800/30 p-3 rounded-lg border border-zinc-700/50">
                                <span className="text-xs text-zinc-500 uppercase tracking-wider block mb-1">Nervous Type</span>
                                <div className="flex items-end gap-2">
                                    <span className="text-2xl font-bold text-zinc-100">Vata</span>
                                    <span className="text-xs text-blue-400 mb-1">Air/Space</span>
                                </div>
                                <Progress value={85} className="h-1 mt-2 bg-zinc-700" indicatorClassName="bg-blue-500" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-zinc-900 border-zinc-800">
                    <CardHeader>
                        <CardTitle className="text-zinc-100 text-sm uppercase tracking-widest flex items-center gap-2">
                            <ShieldAlert className="w-4 h-4 text-red-400" />
                            Primary Vulnerability
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center py-6 text-center space-y-4">
                        <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/20">
                            <Brain className="w-10 h-10 text-red-500 animate-pulse" />
                        </div>
                        <div>
                            <h4 className="text-lg font-bold text-zinc-100">Nervous System</h4>
                            <p className="text-xs text-zinc-500 mt-1">Anxiety, Exhaustion, Overthinking</p>
                        </div>
                        <Badge variant="outline" className="bg-red-500/20 text-red-400 border-red-500/30">🔴 High Risk</Badge>
                    </CardContent>
                </Card>
            </div>

            {/* 2. Vulnerability Map */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-zinc-900 border-zinc-800 overflow-hidden">
                    <CardHeader className="border-b border-zinc-800">
                        <CardTitle className="text-zinc-100 flex items-center gap-2">
                            <Stethoscope className="w-5 h-5 text-zinc-400" />
                            Body Vulnerability Map
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="divide-y divide-zinc-800">
                            {health.vulnerabilities.map((v, i) => (
                                <div key={i} className="p-4 hover:bg-white/5 transition-colors group">
                                    <div className="flex justify-between items-start mb-1">
                                        <h4 className="text-zinc-200 font-medium group-hover:text-white transition-colors">{v.zone}</h4>
                                        <Badge 
                                            variant="outline" 
                                            className={
                                                v.risk === 'High' 
                                                ? "bg-red-500/10 text-red-400 border-red-500/20" 
                                                : "bg-orange-500/10 text-orange-400 border-orange-500/20"
                                            }
                                        >
                                            {v.risk}
                                        </Badge>
                                    </div>
                                    <p className="text-xs text-zinc-500 mb-2">{v.rules}</p>
                                    <p className="text-sm text-zinc-400 leading-relaxed">{v.description}</p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <div className="space-y-6">
                    {/* Mental Health Protocol */}
                    <Card className="bg-zinc-900 border-zinc-800">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-zinc-100 text-lg flex items-center gap-2">
                                <Zap className="w-5 h-5 text-yellow-400" />
                                Mental Health Protocol
                            </CardTitle>
                            <CardDescription className="text-zinc-500 italic">"Your mind is your immune system"</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <h5 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Daily Non-Negotiables</h5>
                                {health.dailyMinimum.map((item, i) => (
                                    <div key={i} className="flex items-center gap-3 p-3 bg-zinc-800/30 rounded-lg border border-zinc-700/50">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                                        <span className="text-sm text-zinc-300">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Diet & Movement */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Card className="bg-zinc-900 border-zinc-800">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm text-zinc-100 flex items-center gap-2">
                                    <Utensils className="w-4 h-4 text-orange-400" />
                                    Dietary Laws
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                {health.diet.map((item, i) => (
                                    <div key={i} className="flex gap-2 items-start">
                                        <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5 shrink-0" />
                                        <span className="text-xs text-zinc-400">{item}</span>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                        <Card className="bg-zinc-900 border-zinc-800">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm text-zinc-100 flex items-center gap-2">
                                    <Dumbbell className="w-4 h-4 text-blue-400" />
                                    Movement Laws
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                {health.movement.map((item, i) => (
                                    <div key={i} className="flex gap-2 items-start">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                                        <span className="text-xs text-zinc-400">{item}</span>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* 3. Longevity & Warning Zones */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-zinc-900/50 border-zinc-800 border-l-4 border-l-emerald-500">
                    <CardHeader>
                        <CardTitle className="text-sm text-emerald-400 flex items-center gap-2">
                            <Heart className="w-4 h-4" />
                            Longevity Indicator
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-zinc-400 leading-relaxed">
                            Strong indicators for long life (8th Lord Mercury = Rank #1). Recovery power (6th house) is maximum. Risk factor is sustained mental stress.
                        </p>
                    </CardContent>
                </Card>

                <Card className="bg-zinc-900/50 border-zinc-800 border-l-4 border-l-blue-500">
                    <CardHeader>
                        <CardTitle className="text-sm text-blue-400 flex items-center gap-2">
                            <Moon className="w-4 h-4" />
                            Sleep Strategy
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-zinc-400 leading-relaxed">
                            Vivid/Active dreams (Moon in Swapna Avastha). 10:30 PM fixed bedtime is essential to ground Rahu in the 12th house.
                        </p>
                    </CardContent>
                </Card>

                <Card className="bg-zinc-900/50 border-zinc-800 border-l-4 border-l-orange-500">
                    <CardHeader>
                        <CardTitle className="text-sm text-orange-400 flex items-center gap-2">
                            <Thermometer className="w-4 h-4" />
                            Pitta Management
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-zinc-400 leading-relaxed">
                            Internal heat (Mars Rx in Aries). Avoid suppressing anger or frustration; it stores as muscular tension and digestive acidity.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
