"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { Shield, Zap, Target, Sparkles, Brain, Lock, Anchor, Info } from 'lucide-react'
import { SUDHANSHU_DATA } from '@/data/user-data'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function AlchemyPsychology() {
    return (
        <div className="space-y-6">
            {/* Identity Anchor Card */}
            <Card className="bg-gradient-to-br from-indigo-900/40 to-slate-900/60 border-indigo-500/30 overflow-hidden relative">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    <Shield className="w-32 h-32 text-indigo-400" />
                </div>
                <CardContent className="pt-8 text-center space-y-4">
                    <div className="flex justify-center">
                        <Badge className="bg-indigo-500/20 text-indigo-300 border-indigo-500/30 px-4 py-1">IDENTITY ANCHOR</Badge>
                    </div>
                    <h2 className="text-3xl font-black text-indigo-100 tracking-tighter">THE SATURNIAN SNIPER</h2>
                    <p className="text-zinc-400 max-w-2xl mx-auto italic">
                        "{SUDHANSHU_DATA.identityAnchor}"
                    </p>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* The 5 Core Laws */}
                <Card className="bg-zinc-900/50 border-zinc-800">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Lock className="text-red-500" size={20} />
                            The 5 Personal Laws
                        </CardTitle>
                        <CardDescription>Hard-coded protocols for trading and life</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <LawCard 
                            title="Tuesday Law" 
                            desc="Mars-Rahu Lock: Maximum 5 trades/actions on Tuesdays. No exceptions." 
                            icon={<Zap className="text-orange-500" size={16} />} 
                        />
                        <LawCard 
                            title="Mercury Law" 
                            desc="Intelligence Over Impulse: Mandatory written thesis for every critical move." 
                            icon={<Brain className="text-emerald-500" size={16} />} 
                        />
                        <LawCard 
                            title="Venus Law" 
                            desc="Wealth through Architecture: Venus Sub-Lord of H2/H8/H11. Wealth actions only on Venus transits." 
                            icon={<Sparkles className="text-pink-500" size={16} />} 
                        />
                        <LawCard 
                            title="Saturn Law" 
                            desc="Obey the System: 'I trade the system, not the hope.' Discipline is your greatest edge." 
                            icon={<Shield className="text-indigo-500" size={16} />} 
                        />
                        <LawCard 
                            title="Mars Law" 
                            desc="Mudda Reduction: Reduce trade count by 50% during Mars Mudda or active Mars transits." 
                            icon={<Target className="text-red-500" size={16} />} 
                        />
                    </CardContent>
                </Card>

                {/* Psychological Blueprint */}
                <Card className="bg-zinc-900/50 border-zinc-800">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Brain className="text-purple-500" size={20} />
                            Psychological Blueprint
                        </CardTitle>
                        <CardDescription>Core drivers of your Aquarius Lagna</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="p-4 bg-zinc-800/40 rounded-xl border border-zinc-800">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-bold text-zinc-100">Intellectual Capacity (Mercury)</span>
                                <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-400">7.70 Shadbala</Badge>
                            </div>
                            <p className="text-xs text-zinc-400">
                                Your Mercury is exceptionally strong, meaning your greatest asset is your **Buddhi (Intellect)**. You succeed when you out-think the market, not when you out-hustle it.
                            </p>
                        </div>

                        <div className="p-4 bg-zinc-800/40 rounded-xl border border-zinc-800">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-bold text-zinc-100">Core Driver (Sun AmK)</span>
                                <Badge variant="secondary" className="bg-blue-500/20 text-blue-400">8th House (Scorpio)</Badge>
                            </div>
                            <p className="text-xs text-zinc-400">
                                Sun as Amatyakaraka in the 8th house means your professional soul is driven by **Research and Hidden Mechanics**. You are drawn to what is hidden from the masses.
                            </p>
                        </div>

                        <div className="p-4 bg-zinc-800/40 rounded-xl border border-zinc-800">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-bold text-zinc-100">World Perception (Arudha Lagna)</span>
                                <Badge variant="secondary" className="bg-red-500/20 text-red-400">Aries (1st)</Badge>
                            </div>
                            <p className="text-xs text-zinc-400">
                                The world sees you as an **Aries Pioneer-Builder**. You must maintain the image of a leader who creates new systems and breaks old paradigms.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function LawCard({ title, desc, icon }: { title: string, desc: string, icon: React.ReactNode }) {
    return (
        <div className="p-3 bg-zinc-800/20 rounded-lg border border-zinc-800/50 flex gap-3 items-start transition-all hover:bg-zinc-800/40">
            <div className="mt-1">{icon}</div>
            <div>
                <h4 className="text-xs font-bold text-zinc-200 uppercase tracking-wider">{title}</h4>
                <p className="text-[11px] text-zinc-500 leading-relaxed">{desc}</p>
            </div>
        </div>
    )
}
