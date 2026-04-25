"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Check, Search, ArrowRight, RotateCcw, Sparkles } from "lucide-react"
import { useAstrologyStore } from "@/stores/astrology-store"
import { rectifyBirthTime, LifeEvent, RectificationResult } from "@/lib/rectification-engine"

export default function BirthTimeRectifier() {
    const { userData, setUserData } = useAstrologyStore()
    const [step, setStep] = useState<'intro' | 'input' | 'processing' | 'results'>('intro')
    const [events, setEvents] = useState<LifeEvent[]>([])
    const [results, setResults] = useState<RectificationResult[]>([])

    // Temporary event input state
    const [newEvent, setNewEvent] = useState<Partial<LifeEvent>>({
        type: 'career',
        date: undefined,
        description: ''
    })

    const handleAddEvent = () => {
        if (!newEvent.date || !newEvent.type) return;

        const event: LifeEvent = {
            id: Math.random().toString(36).substr(2, 9),
            type: newEvent.type as any,
            date: new Date(newEvent.date),
            description: newEvent.description || "Life Event"
        }

        setEvents([...events, event])
        setNewEvent({ type: 'career', date: undefined, description: '' })
    }

    const handleRemoveEvent = (id: string) => {
        setEvents(events.filter(e => e.id !== id))
    }

    const runRectification = () => {
        if (!userData) return;
        setStep('processing')

        // Simulate "deep analysis" delay
        setTimeout(() => {
            const res = rectifyBirthTime(userData.dob, userData.tob, events);
            setResults(res.slice(0, 5)); // Keep top 5
            setStep('results');
        }, 2000);
    }

    if (!userData) return null;

    return (
        <Card className="bg-slate-900/50 border-indigo-500/30 overflow-hidden min-h-[500px] flex flex-col">

            {/* Header */}
            <div className="p-6 bg-gradient-to-r from-indigo-900/50 to-purple-900/50 border-b border-indigo-500/20">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-500/40">
                        <Sparkles className="w-5 h-5 text-indigo-400" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-white">The Rectifier</h3>
                        <p className="text-sm text-gray-400">Birth Time Verification Wizard</p>
                    </div>
                </div>
            </div>

            <div className="p-6 flex-1 relative">
                <AnimatePresence mode="wait">

                    {/* STEP 1: INTRO */}
                    {step === 'intro' && (
                        <motion.div
                            key="intro"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6 text-center max-w-lg mx-auto mt-8"
                        >
                            <div className="w-24 h-24 bg-indigo-500/10 rounded-full mx-auto flex items-center justify-center mb-6 ring-4 ring-indigo-500/10">
                                <Search className="w-10 h-10 text-indigo-400" />
                            </div>
                            <h2 className="text-2xl font-bold text-white">Is your birth time exact?</h2>
                            <p className="text-gray-300 leading-relaxed">
                                Professional astrologers verify birth times by correlating major life events with planetary cycles.
                                Even a 5-minute error can change your divisional charts and predictions.
                            </p>
                            <p className="text-sm text-gray-400 bg-slate-800/50 p-4 rounded-lg">
                                We'll ask you for 2-3 major past events (e.g., first job, marriage, travel) and reverse-engineer your precise birth time.
                            </p>
                            <Button
                                className="w-full bg-indigo-600 hover:bg-indigo-500"
                                size="lg"
                                onClick={() => setStep('input')}
                            >
                                Start Verification
                            </Button>
                        </motion.div>
                    )}

                    {/* STEP 2: INPUT EVENTS */}
                    {step === 'input' && (
                        <motion.div
                            key="input"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <div className="flex justify-between items-center">
                                <h3 className="font-semibold text-white">Add Life Events</h3>
                                <Badge variant="outline" className="text-indigo-300 border-indigo-500/30">
                                    Current Info: {userData.tob}
                                </Badge>
                            </div>

                            <div className="grid md:grid-cols-4 gap-4 items-end bg-slate-800/30 p-4 rounded-lg border border-slate-700">
                                <div className="space-y-2 md:col-span-1">
                                    <Label>Event Type</Label>
                                    <Select
                                        value={newEvent.type}
                                        onValueChange={(val) => setNewEvent({ ...newEvent, type: val as any })}
                                    >
                                        <SelectTrigger className="bg-slate-900 border-slate-700 data-[placeholder]:text-gray-400">
                                            <SelectValue placeholder="Type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="career">Job / Career</SelectItem>
                                            <SelectItem value="marriage">Marriage</SelectItem>
                                            <SelectItem value="childbirth">Childbirth</SelectItem>
                                            <SelectItem value="travel">Travel</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <Label>Date of Event</Label>
                                    <Input
                                        type="date"
                                        className="bg-slate-900 border-slate-700"
                                        onChange={(e) => setNewEvent({ ...newEvent, date: new Date(e.target.value) })}
                                    />
                                </div>
                                <div className="md:col-span-1">
                                    <Button onClick={handleAddEvent} className="w-full bg-slate-700 hover:bg-slate-600" disabled={!newEvent.date}>
                                        Add
                                    </Button>
                                </div>
                            </div>

                            {/* Event List */}
                            <div className="space-y-3 min-h-[150px]">
                                {events.length === 0 ? (
                                    <div className="text-center text-gray-500 py-10 border-2 border-dashed border-slate-800 rounded-lg">
                                        No events added yet. Add at least 2 events for accurate results.
                                    </div>
                                ) : (
                                    events.map((e) => (
                                        <div key={e.id} className="flex items-center justify-between p-3 bg-slate-800/50 rounded border border-slate-700">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                                                    <Calendar className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <div className="font-medium text-white capitalize">{e.type}</div>
                                                    <div className="text-xs text-gray-400">{e.date.toLocaleDateString()}</div>
                                                </div>
                                            </div>
                                            <Button variant="ghost" size="sm" onClick={() => handleRemoveEvent(e.id)} className="text-red-400 hover:text-red-300">
                                                Remove
                                            </Button>
                                        </div>
                                    ))
                                )}
                            </div>

                            <div className="flex gap-3 pt-4">
                                <Button variant="outline" className="w-full" onClick={() => setStep('intro')}>Back</Button>
                                <Button
                                    className="w-full bg-indigo-600 hover:bg-indigo-500"
                                    disabled={events.length < 1}
                                    onClick={runRectification}
                                >
                                    Analyze & Rectify
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 3: PROCESSING */}
                    {step === 'processing' && (
                        <motion.div
                            key="processing"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex flex-col items-center justify-center h-[300px] text-center"
                        >
                            <div className="relative w-20 h-20 mb-6">
                                <div className="absolute inset-0 border-4 border-indigo-500/30 rounded-full animate-ping" />
                                <div className="absolute inset-2 border-4 border-t-indigo-500 border-r-transparent border-b-purple-500 border-l-transparent rounded-full animate-spin" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Analyzing Dasha Cycles...</h3>
                            <p className="text-gray-400">Correlating {events.length} life events with planetary timelines.</p>
                        </motion.div>
                    )}

                    {/* STEP 4: RESULTS */}
                    {step === 'results' && (
                        <motion.div
                            key="results"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="space-y-6"
                        >
                            <div className="text-center">
                                <h3 className="text-xl font-bold text-white">Analysis Complete</h3>
                                <p className="text-gray-400 text-sm">We scanned +/- 15 minutes from your input time.</p>
                            </div>

                            <div className="space-y-4">
                                {results.map((res, i) => (
                                    <div
                                        key={i}
                                        className={`p-4 rounded-lg border transition-all ${res.isBestFit ? 'bg-green-500/10 border-green-500/50 ring-1 ring-green-500/30' : 'bg-slate-800/30 border-slate-700 opacity-70 hover:opacity-100'}`}
                                    >
                                        <div className="flex justify-between items-center mb-2">
                                            <div className="flex items-center gap-2">
                                                <span className={`text-lg font-mono font-bold ${res.isBestFit ? 'text-green-400' : 'text-gray-300'}`}>
                                                    {res.adjustedTime}
                                                </span>
                                                <Badge variant="outline" className="text-xs">
                                                    {res.offsetMinutes === 0 ? "Original" : `${res.offsetMinutes > 0 ? '+' : ''}${res.offsetMinutes} min`}
                                                </Badge>
                                                {res.isBestFit && <Badge className="bg-green-500 text-black border-none hover:bg-green-400">Best Match</Badge>}
                                            </div>
                                            <div className="font-bold text-gray-500">Score: {res.score}</div>
                                        </div>

                                        {res.matchDetails.length > 0 && (
                                            <div className="text-xs text-gray-400 space-y-1 pl-2 border-l-2 border-slate-700">
                                                {res.matchDetails.map((detail, idx) => (
                                                    <div key={idx} className="flex items-center">
                                                        <Check className="w-3 h-3 mr-1 text-green-500" />
                                                        {detail}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="flex gap-3 pt-4 border-t border-slate-800">
                                <Button variant="ghost" onClick={() => setStep('input')} className="text-gray-400">
                                    <RotateCcw className="w-4 h-4 mr-2" />
                                    Try Again
                                </Button>
                                <Button className="w-full bg-green-600 hover:bg-green-500">
                                    Apply Best Time
                                </Button>
                            </div>
                        </motion.div>
                    )}

                </AnimatePresence>
            </div>
        </Card>
    )
}
