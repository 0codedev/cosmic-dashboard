"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, AlertTriangle, CheckCircle2, TrendingUp, Info, Lock, Zap, BookOpen, Clock, Activity } from 'lucide-react'
import { SUDHANSHU_DATA } from '@/data/user-data'
import { getTodayStatus, TodayStatus } from '@/lib/timing-engine'
import { Nakshatra } from '@/types/astrology'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const NAKSHATRAS: Nakshatra[] = [
    'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra',
    'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni',
    'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
    'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha',
    'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'
];

export function MissionControl() {
    const [selectedNakshatra, setSelectedNakshatra] = useState<string>('Shatabhisha');
    const [status, setStatus] = useState<TodayStatus | null>(null);
    const [checklist, setChecklist] = useState<Record<string, boolean>>({});

    useEffect(() => {
        const today = getTodayStatus(selectedNakshatra);
        setStatus(today);
    }, [selectedNakshatra]);

    if (!status) return null;

    const getStatusColor = (s: string) => {
        switch (s) {
            case 'Danger': return 'bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.5)]';
            case 'Red': return 'bg-orange-600';
            case 'Yellow': return 'bg-yellow-500 text-black';
            case 'Prime': return 'bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.5)]';
            default: return 'bg-blue-500';
        }
    };

    const getStatusText = (s: string) => {
        switch (s) {
            case 'Danger': return 'STRICT LOCKDOWN';
            case 'Red': return 'NO TRADE';
            case 'Yellow': return 'CAUTION / MINIMAL';
            case 'Prime': return 'PEAK OPPORTUNITY';
            default: return 'NORMAL PROTOCOL';
        }
    };

    return (
        <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
            {/* 1. Identity Banner */}
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 backdrop-blur-xl relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Shield size={80} />
                </div>
                <h2 className="text-zinc-400 text-sm font-medium uppercase tracking-widest mb-2">Identity Anchor</h2>
                <p className="text-xl sm:text-2xl font-light text-zinc-100 leading-relaxed italic">
                    "{SUDHANSHU_DATA.identityAnchor}"
                </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* 2. Today's Status Card */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="bg-zinc-900 border-zinc-800 overflow-hidden">
                        <CardHeader className="border-b border-zinc-800">
                            <div className="flex justify-between items-center">
                                <div>
                                    <CardTitle className="text-zinc-100">Cosmic Mission Status</CardTitle>
                                    <CardDescription>Real-time trading environment analysis</CardDescription>
                                </div>
                                <div className="text-right">
                                    <span className="text-xs text-zinc-500 block mb-1">Today's Moon Nakshatra</span>
                                    <select 
                                        className="bg-zinc-800 border-none text-zinc-100 text-xs rounded px-2 py-1 focus:ring-1 focus:ring-blue-500 outline-none"
                                        value={selectedNakshatra}
                                        onChange={(e) => setSelectedNakshatra(e.target.value)}
                                    >
                                        {NAKSHATRAS.map(n => <option key={n} value={n}>{n}</option>)}
                                    </select>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="grid grid-cols-1 md:grid-cols-2">
                                <div className="p-8 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-zinc-800">
                                    <motion.div 
                                        key={status.status}
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        className={`w-32 h-32 rounded-full flex items-center justify-center ${getStatusColor(status.status)} mb-4 transition-all duration-500`}
                                    >
                                        {status.status === 'Danger' || status.status === 'Red' ? <AlertTriangle size={48} className="text-white" /> : <TrendingUp size={48} className="text-white" />}
                                    </motion.div>
                                    <h3 className="text-2xl font-bold text-zinc-100 tracking-tight">{getStatusText(status.status)}</h3>
                                    <p className="text-sm text-zinc-500 mt-2 text-center max-w-[200px]">
                                        {status.reason}
                                    </p>
                                </div>
                                <div className="p-8 space-y-6 bg-zinc-900/30">
                                    <div>
                                        <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Today's Limits</h4>
                                        <div className="flex items-end gap-2">
                                            <span className="text-5xl font-black text-zinc-100">{status.tradeLimit}</span>
                                            <span className="text-zinc-500 mb-1">Max Trades</span>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Active Alerts</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {status.activeFlags.map(flag => (
                                                <Badge key={flag} variant="outline" className="bg-zinc-800 border-zinc-700 text-zinc-300 font-mono text-[10px]">
                                                    {flag}
                                                </Badge>
                                            ))}
                                            {status.activeFlags.length === 0 && <span className="text-xs text-zinc-600">No active restrictions</span>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* 3. Dasha Stack */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {[
                            { label: 'Mahadasha', val: status.currentPeriods.mahadasha, icon: <Activity size={14} /> },
                            { label: 'Antardasha', val: status.currentPeriods.antardasha, icon: <Clock size={14} /> },
                            { label: 'Pratyantar', val: status.currentPeriods.pratyantar, icon: <Zap size={14} /> },
                            { label: 'Mudda', val: status.currentPeriods.mudda, icon: <Info size={14} /> }
                        ].map((d, i) => (
                            <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                                <div className="flex items-center gap-2 text-zinc-500 mb-1">
                                    {d.icon}
                                    <span className="text-[10px] uppercase font-bold tracking-tighter">{d.label}</span>
                                </div>
                                <div className="text-zinc-100 font-semibold">{d.val}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 4. Protocols & Checklist Side Bar */}
                <div className="space-y-6">
                    <Card className="bg-zinc-900 border-zinc-800">
                        <CardHeader>
                            <CardTitle className="text-sm font-bold flex items-center gap-2">
                                <Shield size={16} className="text-blue-500" />
                                Strategic Protocols
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {SUDHANSHU_DATA.tradingLaws.map(law => (
                                <div key={law.id} className="group cursor-help">
                                    <h5 className="text-xs font-bold text-zinc-300 group-hover:text-blue-400 transition-colors">{law.name}</h5>
                                    <p className="text-[11px] text-zinc-500 leading-snug">{law.statement}</p>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card className="bg-blue-600/10 border-blue-500/30 border">
                        <CardHeader>
                            <CardTitle className="text-sm font-bold flex items-center gap-2 text-blue-400">
                                <CheckCircle2 size={16} />
                                Pre-Trade Checklist
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {SUDHANSHU_DATA.masterChecklist.map((item, i) => (
                                <div 
                                    key={i} 
                                    className="flex items-start gap-3 cursor-pointer select-none"
                                    onClick={() => setChecklist(prev => ({...prev, [i]: !prev[i]}))}
                                >
                                    <div className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center transition-colors ${checklist[i] ? 'bg-blue-500 border-blue-500' : 'border-zinc-700 bg-zinc-800'}`}>
                                        {checklist[i] && <CheckCircle2 size={12} className="text-white" />}
                                    </div>
                                    <span className={`text-[11px] leading-tight ${checklist[i] ? 'text-zinc-100 line-through opacity-50' : 'text-zinc-300'}`}>{item}</span>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
