"use client"

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar, Search, Star, AlertTriangle, CheckCircle } from 'lucide-react'
import { useUser } from '@/contexts/user-context'
import { findNextAuspiciousDates, ActivityType, MuhurtaResult } from '@/lib/muhurta-engine'

export default function MuhurtaFinder() {
    const { userData } = useUser()
    const [activity, setActivity] = useState<ActivityType>('business')
    const [days, setDays] = useState(30)
    const [results, setResults] = useState<MuhurtaResult[]>([])
    const [isSearching, setIsSearching] = useState(false)

    const handleSearch = () => {
        setIsSearching(true)
        // Simulate delay for effect
        setTimeout(() => {
            const nakshatra = userData?.nakshatra || "Ashwini" // Default if missing
            const data = findNextAuspiciousDates(activity, new Date(), days, nakshatra)
            setResults(data)
            setIsSearching(false)
        }, 500)
    }

    const getRatingColor = (rating: string) => {
        switch (rating) {
            case 'Excellent': return 'bg-green-500/20 text-green-400 border-green-500/30'
            case 'Good': return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
            case 'Average': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
            case 'Avoid': return 'bg-red-500/20 text-red-400 border-red-500/30'
            default: return 'bg-slate-500/20 text-slate-400'
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4 items-end bg-slate-900/50 p-6 rounded-lg border border-indigo-500/20">
                <div className="w-full md:w-1/3 space-y-2">
                    <label className="text-sm text-gray-400 font-medium">Activity</label>
                    <select
                        className="w-full bg-slate-800 border-slate-700 text-white rounded-md h-10 px-3 focus:ring-purple-500 focus:border-purple-500"
                        value={activity}
                        onChange={(e) => setActivity(e.target.value as ActivityType)}
                    >
                        <option value="business">Business / Financial</option>
                        <option value="marriage">Marriage / Relationship</option>
                        <option value="travel">Travel / Journey</option>
                        <option value="property">Property / Real Estate</option>
                    </select>
                </div>

                <div className="w-full md:w-1/3 space-y-2">
                    <label className="text-sm text-gray-400 font-medium">Scan Range</label>
                    <select
                        className="w-full bg-slate-800 border-slate-700 text-white rounded-md h-10 px-3 focus:ring-purple-500 focus:border-purple-500"
                        value={days}
                        onChange={(e) => setDays(Number(e.target.value))}
                    >
                        <option value={15}>Next 15 Days</option>
                        <option value={30}>Next 30 Days</option>
                        <option value={60}>Next 60 Days</option>
                    </select>
                </div>

                <div className="w-full md:w-1/3">
                    <Button
                        onClick={handleSearch}
                        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500"
                        disabled={isSearching}
                    >
                        {isSearching ? "Calculating..." : (
                            <>
                                <Search className="w-4 h-4 mr-2" />
                                Find Auspicious Dates
                            </>
                        )}
                    </Button>
                </div>
            </div>

            {results.length > 0 && (
                <div className="grid gap-4">
                    <h3 className="text-lg font-semibold text-white flex items-center">
                        <Star className="w-5 h-5 text-yellow-400 mr-2" />
                        Best Muhurtas Found ({results.length})
                    </h3>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {results.slice(0, 6).map((muhurta, idx) => (
                            <Card key={idx} className="p-4 bg-slate-800/40 border-slate-700 hover:border-purple-500/50 transition-colors">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-center">
                                        <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                                        <span className="font-semibold text-white">
                                            {muhurta.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', weekday: 'short' })}
                                        </span>
                                    </div>
                                    <Badge className={getRatingColor(muhurta.rating)} variant="outline">
                                        {muhurta.score}/100
                                    </Badge>
                                </div>

                                <div className="space-y-2 text-sm text-gray-300 mb-4">
                                    <div className="flex justify-between">
                                        <span>Tithi:</span>
                                        <span className="text-white">{muhurta.factors.tithi}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Nakshatra:</span>
                                        <span className="text-white">{muhurta.factors.nakshatra}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Tara Bala:</span>
                                        <span className={muhurta.factors.taraBala.includes("Danger") || muhurta.factors.taraBala.includes("Obstacles") ? "text-red-400" : "text-green-400"}>
                                            {muhurta.factors.taraBala.split(' ')[0]}
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    {muhurta.analysis.slice(0, 2).map((note, i) => (
                                        <div key={i} className="text-xs flex items-start">
                                            {note.startsWith('Avoid') ? (
                                                <AlertTriangle className="w-3 h-3 text-red-500 mr-1 mt-0.5" />
                                            ) : (
                                                <CheckCircle className="w-3 h-3 text-green-500 mr-1 mt-0.5" />
                                            )}
                                            <span className={note.startsWith('Avoid') ? "text-red-300" : "text-gray-400"}>
                                                {note}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            )}

            {!isSearching && results.length === 0 && (
                <div className="text-center p-8 bg-slate-900/30 rounded-lg border border-dashed border-slate-700">
                    <p className="text-gray-400">Select an activity and scan range to find auspicious dates.</p>
                </div>
            )}
        </div>
    )
}
