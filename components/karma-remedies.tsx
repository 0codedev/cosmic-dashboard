"use client"

import React, { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { 
    Sparkles, 
    Gem, 
    ShieldAlert, 
    CheckCircle2, 
    Zap, 
    Calendar, 
    Heart, 
    AlertTriangle,
    ShieldCheck,
    ScrollText
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useResolvedUserData } from "@/contexts/user-context"

const CATEGORY_STYLES = {
    yellow: {
        iconWrapper: "bg-yellow-500/10 border-yellow-500/20",
        icon: "text-yellow-400",
        check: "text-yellow-500",
    },
    blue: {
        iconWrapper: "bg-blue-500/10 border-blue-500/20",
        icon: "text-blue-400",
        check: "text-blue-500",
    },
    cyan: {
        iconWrapper: "bg-cyan-500/10 border-cyan-500/20",
        icon: "text-cyan-400",
        check: "text-cyan-500",
    },
} as const

export default function KarmaRemedies() {
    const user = useResolvedUserData()

    const categories = useMemo(() => [
        {
            title: "Intellectual Mastery (Mer-Jup)",
            icon: Sparkles,
            color: "yellow",
            items: [
                "Listen to Vishnu Sahasranamam on Wed/Thu morning",
                "Maintain 'Mercury Law' for all financial decisions",
                "Donate yellow books or turmeric to scholars",
                "Mandatory 15-min reading of complex systems daily",
                "Abstain from impulse-based speech or trading"
            ]
        },
        {
            title: "Sade Sati Stabilization",
            icon: ShieldCheck,
            color: "blue",
            items: [
                "Donate coarse salt or black cloth to laborers",
                "Chant Hanuman Chalisa daily at sunset",
                "Saturday: Feed black dogs or crows",
                "Mandatory structured routine; avoid 13/4 debt",
                "Service to elderly or differently-abled"
            ]
        },
        {
            title: "Clarity & Lagna Rahu",
            icon: Zap,
            color: "cyan",
            items: [
                "Daily Sandalwood tilak on forehead (Cooling effect)",
                "Practice 'architecture over willpower' daily planning",
                "Avoid high-stakes decisions on Tuesdays (Tuesday Law)",
                "Service to leprosy patients or sweepers",
                "Meditate on Identity Anchor: 'The Aquarian Architect'"
            ]
        }
    ], []);

    return (
        <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 pb-24 md:pb-8">
            {/* Header */}
            <div className="text-center space-y-2 mb-8">
                <h2 className="text-3xl font-black bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent uppercase tracking-widest">
                    The Cosmic Alchemy Protocol
                </h2>
                <p className="text-zinc-500 italic">"Architecture over Willpower. Moving from the shadow to the structure."</p>
            </div>

            {/* 1. Critical Warnings & Rules */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-red-500/5 border-red-500/20 backdrop-blur-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-red-400 flex items-center gap-2 text-lg">
                            <ShieldAlert className="w-5 h-5" />
                            CRITICAL BAN: Blue Sapphire (Neelam)
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-zinc-400 text-sm leading-relaxed">
                            Saturn is in the 6th/8th axis. In your chart, Saturn's energy is already heavy. 
                            Wearing Blue Sapphire will amplify enemies, debts, and structural burdens. 
                            <span className="text-red-400 font-bold ml-1">DO NOT WEAR.</span>
                        </p>
                    </CardContent>
                </Card>

                <Card className="bg-emerald-500/5 border-emerald-500/20 backdrop-blur-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-emerald-400 flex items-center gap-2 text-lg">
                            <Calendar className="w-5 h-5" />
                            Operational Calendar
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-4">
                        <div>
                            <span className="text-xs text-zinc-500 uppercase tracking-widest block mb-2">Favorable Days</span>
                            <div className="flex gap-2">
                                <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">Wed</Badge>
                                <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">Fri</Badge>
                                <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">Sat</Badge>
                            </div>
                        </div>
                        <div>
                            <span className="text-xs text-zinc-500 uppercase tracking-widest block mb-2">Hazard Day</span>
                            <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Thursday</Badge>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* 2. Core Remedial Categories */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {categories.map((cat, i) => {
                    const Icon = cat.icon;
                    const styles = CATEGORY_STYLES[cat.color as keyof typeof CATEGORY_STYLES]
                    return (
                        <Card key={i} className="bg-zinc-900 border-zinc-800">
                            <CardHeader className="pb-4">
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-2 border ${styles.iconWrapper}`}>
                                    <Icon className={`w-5 h-5 ${styles.icon}`} />
                                </div>
                                <CardTitle className="text-zinc-100 text-lg">{cat.title}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {cat.items.map((item, j) => (
                                    <div key={j} className="flex gap-3 items-start group">
                                        <CheckCircle2 className={`w-4 h-4 mt-1 shrink-0 group-hover:scale-110 transition-transform ${styles.check}`} />
                                        <span className="text-sm text-zinc-400 group-hover:text-zinc-200 transition-colors leading-snug">{item}</span>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* 3. Gemstones & Rudraksha */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-zinc-900 border-zinc-800">
                    <CardHeader>
                        <CardTitle className="text-zinc-100 flex items-center gap-2">
                            <Gem className="w-5 h-5 text-pink-400" />
                            Gemstone Prescription
                        </CardTitle>
                        <CardDescription>Planetary activation through light frequency</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {user.remedies.gemstones.filter(g => g.type !== 'Avoid').map((gem, i) => (
                            <div key={i} className="p-4 bg-zinc-800/30 rounded-xl border border-zinc-700/50 flex justify-between items-center group hover:bg-zinc-800/50 transition-colors">
                                <div>
                                    <h4 className="font-bold text-zinc-100 group-hover:text-white transition-colors">{gem.gemstone} ({gem.planet})</h4>
                                    <p className="text-xs text-zinc-500 mt-1">Wear on {gem.finger} in {gem.metal}</p>
                                    <p className="text-xs text-zinc-400 italic mt-2">"{gem.reason}"</p>
                                </div>
                                <Badge variant="outline" className="bg-pink-500/10 text-pink-400 border-pink-500/20">Primary</Badge>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <Card className="bg-zinc-900 border-zinc-800">
                    <CardHeader>
                        <CardTitle className="text-zinc-100 flex items-center gap-2">
                            <Heart className="w-5 h-5 text-red-400" />
                            Rudraksha Therapy
                        </CardTitle>
                        <CardDescription>Bio-electrical frequency management</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {user.remedies.rudraksha.map((r, i) => (
                            <div key={i} className="p-4 bg-zinc-800/30 rounded-xl border border-zinc-700/50 flex justify-between items-center group hover:bg-zinc-800/50 transition-colors">
                                <div>
                                    <h4 className="font-bold text-zinc-100 group-hover:text-white transition-colors">{r.type}</h4>
                                    <p className="text-sm text-zinc-400 leading-relaxed mt-1">{r.purpose}</p>
                                </div>
                                <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/20">
                                    <Zap className="w-4 h-4 text-red-500" />
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>

            {/* 4. The 5 Trading Laws */}
            <Card className="bg-indigo-500/5 border-indigo-500/20">
                <CardHeader>
                    <CardTitle className="text-indigo-400 flex items-center gap-2">
                        <ScrollText className="w-5 h-5" />
                        The 5 Unbreakable Trading Laws
                    </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    {user.tradingLaws.map((law, i) => (
                        <div key={i} className="p-4 bg-zinc-900/50 rounded-xl border border-zinc-800 text-center flex flex-col items-center justify-center space-y-2">
                            <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-xs">
                                {i + 1}
                            </div>
                            <p className="text-xs text-zinc-300 font-medium leading-relaxed">{law.statement || law.name}</p>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    );
}
