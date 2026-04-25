"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Calendar, Clock, Zap, Info, Activity } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useResolvedUserData } from "@/contexts/user-context"

type TimingView = "vimshottari" | "mudda" | "navatara"

export default function TimingIntelligence() {
    const [activeView, setActiveView] = useState<TimingView>("vimshottari")

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-black text-zinc-100 tracking-tight">Timing Intelligence</h2>
                    <p className="text-zinc-500">The high-fidelity temporal roadmap</p>
                </div>
                <Tabs value={activeView} onValueChange={(value) => setActiveView(value as TimingView)} className="w-full md:w-auto">
                    <TabsList className="bg-zinc-900 border border-zinc-800">
                        <TabsTrigger value="vimshottari">Vimshottari</TabsTrigger>
                        <TabsTrigger value="mudda">Mudda (Annual)</TabsTrigger>
                        <TabsTrigger value="navatara">Navatara</TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={activeView}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                >
                    {activeView === "vimshottari" && <VimshottariView />}
                    {activeView === "mudda" && <MuddaView />}
                    {activeView === "navatara" && <NavataraView />}
                </motion.div>
            </AnimatePresence>
        </div>
    )
}

function VimshottariView() {
    const user = useResolvedUserData()
    const { pratyantars, antardashas } = user.dashaSystem.vimshottari

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
                <Card className="bg-zinc-900 border-zinc-800">
                    <CardHeader>
                        <CardTitle className="text-zinc-100 flex items-center gap-2">
                            <Clock className="text-blue-500" size={20} />
                            Active Pratyantar Timeline
                        </CardTitle>
                        <CardDescription>Critical micro-periods within the current Mahadasha</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="relative space-y-4">
                            {pratyantars.map((period, index) => (
                                <div key={index} className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${period.signal === "Danger" ? "bg-red-500/10 border-red-500/30" : "bg-zinc-900 border-zinc-800"}`}>
                                    <div className="w-20 text-center">
                                        <Badge variant="outline" className={`text-xs ${getSignalColor(period.signal)}`}>
                                            {period.lord.toString().toUpperCase()}
                                        </Badge>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-sm font-bold text-zinc-200">{period.start} - {period.end}</span>
                                            {period.signal && <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${getSignalBg(period.signal)}`}>{period.signal}</span>}
                                        </div>
                                        <p className="text-xs text-zinc-500 leading-relaxed italic">
                                            {period.instructions || "Standard influence period."}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-6">
                <Card className="bg-zinc-900 border-zinc-800">
                    <CardHeader>
                        <CardTitle className="text-sm font-bold">Chara Dasha Analysis</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {user.dashaSystem.chara.map((period, index) => (
                            <div key={index} className="p-3 bg-zinc-800/50 rounded-lg border border-zinc-700">
                                <div className="flex justify-between text-xs mb-1">
                                    <span className="font-bold text-zinc-100 uppercase">{period.lord}</span>
                                    <span className="text-zinc-500">{period.start} - {period.end}</span>
                                </div>
                                <p className="text-[11px] text-zinc-400">{period.instructions}</p>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

function MuddaView() {
    const user = useResolvedUserData()

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {user.dashaSystem.mudda.map((period, index) => (
                <Card key={index} className={`bg-zinc-900 border-zinc-800 overflow-hidden transition-all hover:border-zinc-700 ${period.signal === "Danger" || period.signal === "Red" ? "ring-1 ring-red-500/20" : ""}`}>
                    <div className={`h-1 w-full ${getSignalBg(period.signal)}`} />
                    <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="text-lg font-black text-zinc-100 uppercase">{period.lord}</h3>
                            <Badge className={getSignalColor(period.signal)}>{period.signal}</Badge>
                        </div>
                        <div className="text-xs text-zinc-500 font-mono mb-3">{period.start} - {period.end}</div>
                        <p className="text-xs text-zinc-400 italic">
                            {period.instructions || "Annual micro-influence phase."}
                        </p>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}

function NavataraView() {
    const user = useResolvedUserData()

    return (
        <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
                <CardTitle className="text-zinc-100">Navatara Chakra</CardTitle>
                <CardDescription>Daily moon compatibility matrix</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {user.navataraChakra.map((tier, index) => (
                        <div key={index} className="p-4 bg-zinc-800/30 rounded-xl border border-zinc-800 flex flex-col gap-2">
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{tier.name} ({tier.tier})</span>
                                <Badge variant="outline" className={getStatusBadgeColor(tier.status)}>{tier.status}</Badge>
                            </div>
                            <h4 className="text-sm font-bold text-zinc-200">{tier.description}</h4>
                            <div className="text-[10px] text-zinc-500 font-mono">
                                {tier.nakshatras.join(" • ")}
                            </div>
                            <div className="mt-2 text-xs font-semibold text-blue-400">
                                {tier.tradingAction}
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}

const getSignalColor = (signal?: string) => {
    switch (signal) {
        case "Danger": return "text-red-400 border-red-500/30"
        case "Red": return "text-orange-500 border-orange-500/30"
        case "Yellow": return "text-yellow-400 border-yellow-500/30"
        case "Green": return "text-emerald-400 border-emerald-500/30"
        case "Prime": return "text-blue-400 border-blue-500/30"
        default: return "text-zinc-500 border-zinc-800"
    }
}

const getSignalBg = (signal?: string) => {
    switch (signal) {
        case "Danger": return "bg-red-500 text-white"
        case "Red": return "bg-orange-600 text-white"
        case "Yellow": return "bg-yellow-500 text-black"
        case "Green": return "bg-emerald-500 text-white"
        case "Prime": return "bg-blue-500 text-white"
        default: return "bg-zinc-800 text-zinc-400"
    }
}

const getStatusBadgeColor = (status: string) => {
    if (status === "Destruction") return "text-red-400 border-red-500/30 bg-red-500/10"
    if (status === "Danger" || status === "Obstacles") return "text-yellow-400 border-yellow-500/30 bg-yellow-500/10"
    if (status === "Wealth" || status === "Prosperity" || status === "Success" || status === "Allies") return "text-emerald-400 border-emerald-500/30 bg-emerald-500/10"
    return "text-zinc-400 border-zinc-800"
}
