"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Flame,
    Calendar,
    Star,
    Clock,
    MapPin,
    CheckCircle2,
    Info
} from "lucide-react"

interface Puja {
    id: string
    name: string
    deity: string
    purpose: string
    timing: string
    duration: string
    cost: string
    benefits: string[]
    procedure: string[]
    recommended: boolean
    priority: "high" | "medium" | "low"
}

const RECOMMENDED_PUJAS: Puja[] = [
    {
        id: "shani",
        name: "Shani Shanti Puja",
        deity: "Lord Shani (Saturn)",
        purpose: "Saturn transit & Sade Sati relief",
        timing: "Saturday evenings",
        duration: "2-3 hours",
        cost: "₹2,100 - ₹5,100",
        benefits: [
            "Reduces Saturn's malefic effects",
            "Improves career stability",
            "Removes obstacles and delays",
            "Brings patience and discipline"
        ],
        procedure: [
            "Light sesame oil lamp",
            "Offer black til (sesame) to Shani",
            "Chant Shani mantra 108 times",
            "Donate black cloth to needy"
        ],
        recommended: true,
        priority: "high"
    },
    {
        id: "guru",
        name: "Guru Puja / Brihaspati Puja",
        deity: "Lord Brihaspati (Jupiter)",
        purpose: "Enhance Jupiter Mahadasha effects",
        timing: "Thursday mornings",
        duration: "1-2 hours",
        cost: "₹1,100 - ₹3,100",
        benefits: [
            "Amplifies wisdom and knowledge",
            "Attracts teachers and mentors",
            "Expands wealth and fortune",
            "Blesses with children"
        ],
        procedure: [
            "Wear yellow clothes",
            "Offer yellow flowers and sweets",
            "Chant 'Om Gram Greem Groom Sah Gurave Namaha'",
            "Feed Brahmins or donate to temple"
        ],
        recommended: true,
        priority: "high"
    },
    {
        id: "navagraha",
        name: "Navagraha Shanti Puja",
        deity: "Nine Planets",
        purpose: "Overall planetary harmony",
        timing: "Any auspicious day",
        duration: "3-4 hours",
        cost: "₹5,100 - ₹11,000",
        benefits: [
            "Balances all planetary energies",
            "Removes multiple doshas",
            "General protection and prosperity",
            "Comprehensive remedy solution"
        ],
        procedure: [
            "Set up Navagraha yantra",
            "Offer specific items to each planet",
            "Perform individual planet mantras",
            "Conclude with havan (fire ritual)"
        ],
        recommended: true,
        priority: "medium"
    },
    {
        id: "rahu",
        name: "Rahu Shanti Puja",
        deity: "Rahu (North Node)",
        purpose: "Control Rahu's influence on 2nd house",
        timing: "Rahu Kaal on Saturday",
        duration: "2 hours",
        cost: "₹2,100 - ₹5,100",
        benefits: [
            "Reduces confusion and anxiety",
            "Protects from sudden losses",
            "Removes obstacles in foreign matters",
            "Clears negative energies"
        ],
        procedure: [
            "Offer coconut and durva grass",
            "Chant Rahu beej mantra",
            "Donate to orphanages",
            "Feed crows on Wednesday"
        ],
        recommended: true,
        priority: "medium"
    },
    {
        id: "mahamrityunjaya",
        name: "Mahamrityunjaya Jaap",
        deity: "Lord Shiva",
        purpose: "Health protection and longevity",
        timing: "Any Monday or Shivratri",
        duration: "4-6 hours for 1.25 lakh jaap",
        cost: "₹5,100 - ₹11,000",
        benefits: [
            "Protection from illness",
            "Increases vitality",
            "Removes fear of death",
            "Spiritual purification"
        ],
        procedure: [
            "1.25 lakh mantra chanting",
            "Offer bilva leaves",
            "Abhishekam with milk and honey",
            "Rudrabhishek if possible"
        ],
        recommended: false,
        priority: "low"
    }
]

export default function PujaRecommendations() {
    const [selectedPuja, setSelectedPuja] = useState<string | null>("shani")

    const currentPuja = RECOMMENDED_PUJAS.find(p => p.id === selectedPuja)

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case "high": return "bg-red-500/20 text-red-400 border-red-500/30"
            case "medium": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
            case "low": return "bg-green-500/20 text-green-400 border-green-500/30"
            default: return ""
        }
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <Card className="bg-gradient-to-br from-orange-900/30 to-slate-900/50 border-orange-500/30 p-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-orange-500/20 rounded-full">
                        <Flame className="w-6 h-6 text-orange-400" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">Puja Recommendations</h2>
                        <p className="text-sm text-gray-400">Personalized ritual suggestions</p>
                    </div>
                </div>

                <p className="text-sm text-gray-400">
                    Based on your current planetary periods and transits, these pujas are recommended
                    for maximum spiritual benefit and obstacle removal.
                </p>
            </Card>

            {/* Puja Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {RECOMMENDED_PUJAS.filter(p => p.recommended).map((puja, idx) => (
                    <motion.div
                        key={puja.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                    >
                        <Card
                            className={`p-4 cursor-pointer transition-all h-full ${selectedPuja === puja.id
                                    ? 'ring-2 ring-orange-400 bg-orange-900/20'
                                    : 'bg-slate-800/50 border-purple-500/20 hover:border-orange-500/50'
                                }`}
                            onClick={() => setSelectedPuja(puja.id)}
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <Flame className="w-5 h-5 text-orange-400" />
                                    <h3 className="font-semibold text-white">{puja.name}</h3>
                                </div>
                                <Badge className={getPriorityColor(puja.priority)}>
                                    {puja.priority}
                                </Badge>
                            </div>

                            <p className="text-sm text-gray-400 mb-3">{puja.purpose}</p>

                            <div className="space-y-1 text-xs text-gray-500">
                                <div className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    <span>{puja.timing}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    <span>{puja.duration}</span>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Selected Puja Details */}
            {currentPuja && (
                <motion.div
                    key={currentPuja.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                >
                    {/* Benefits */}
                    <Card className="bg-green-900/20 border-green-500/20 p-6">
                        <h4 className="text-lg font-semibold text-green-400 mb-4 flex items-center gap-2">
                            <Star className="w-5 h-5" />
                            Benefits of {currentPuja.name}
                        </h4>
                        <div className="grid md:grid-cols-2 gap-2">
                            {currentPuja.benefits.map((benefit, idx) => (
                                <div key={idx} className="flex items-center gap-2 text-gray-300">
                                    <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                                    <span className="text-sm">{benefit}</span>
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* Procedure */}
                    <Card className="bg-slate-800/50 border-purple-500/20 p-6">
                        <h4 className="text-lg font-semibold text-purple-400 mb-4">Procedure Steps</h4>
                        <div className="space-y-2">
                            {currentPuja.procedure.map((step, idx) => (
                                <div key={idx} className="flex items-start gap-3">
                                    <div className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center text-xs font-bold flex-shrink-0">
                                        {idx + 1}
                                    </div>
                                    <span className="text-gray-300 text-sm">{step}</span>
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* Details */}
                    <Card className="bg-slate-800/50 border-purple-500/20 p-6">
                        <div className="grid md:grid-cols-3 gap-4">
                            <div>
                                <div className="text-xs text-gray-500 mb-1">Deity</div>
                                <div className="text-white font-medium">{currentPuja.deity}</div>
                            </div>
                            <div>
                                <div className="text-xs text-gray-500 mb-1">Best Time</div>
                                <div className="text-white font-medium">{currentPuja.timing}</div>
                            </div>
                            <div>
                                <div className="text-xs text-gray-500 mb-1">Estimated Cost</div>
                                <div className="text-amber-400 font-medium">{currentPuja.cost}</div>
                            </div>
                        </div>
                    </Card>
                </motion.div>
            )}

            {/* Info */}
            <Card className="bg-blue-900/20 border-blue-500/20 p-4">
                <div className="flex items-start gap-2">
                    <Info className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-gray-400">
                        Consult a qualified priest or astrologer before performing these pujas.
                        The effectiveness depends on proper procedures, timing, and sincere devotion.
                    </p>
                </div>
            </Card>
        </div>
    )
}
