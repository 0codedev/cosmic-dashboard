"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Gem,
    AlertTriangle,
    CheckCircle2,
    Info,
    Scale,
    Clock,
    Sparkles
} from "lucide-react"

interface GemstoneInfo {
    name: string
    hindiName: string
    planet: string
    planetSymbol: string
    color: string
    colorClass: string
    benefits: string[]
    carats: string
    metal: string
    finger: string
    day: string
    mantra: string
    alternatives: string[]
    precautions: string[]
    price: string
    suitable: boolean
    reason: string
}

// Sudhanshu's chart analysis for gemstone recommendations
const GEMSTONE_DATA: GemstoneInfo[] = [
    {
        name: "Blue Sapphire",
        hindiName: "Neelam",
        planet: "Saturn (Lagna Lord)",
        planetSymbol: "♄",
        color: "Deep Blue",
        colorClass: "from-blue-600 to-blue-900",
        benefits: [
            "Strengthens Lagna Lord Saturn",
            "Career success and recognition",
            "Discipline and focus",
            "Protection during Sade Sati",
            "Wealth accumulation"
        ],
        carats: "3-5 carats minimum",
        metal: "Silver or Platinum",
        finger: "Middle finger (right hand)",
        day: "Saturday, during Shani Hora",
        mantra: "Om Sham Shanicharaya Namah (108 times)",
        alternatives: ["Amethyst", "Blue Spinel", "Iolite"],
        precautions: [
            "MUST trial for 3 days before wearing permanently",
            "Observe dreams and events during trial",
            "Remove if negative effects occur",
            "Consult expert astrologer before wearing"
        ],
        price: "₹15,000 - ₹1,00,000+ per carat",
        suitable: true,
        reason: "Saturn is Lagna Lord in Aquarius - highly beneficial"
    },
    {
        name: "Emerald",
        hindiName: "Panna",
        planet: "Mercury (5th & 8th Lord)",
        planetSymbol: "☿",
        color: "Green",
        colorClass: "from-emerald-500 to-emerald-800",
        benefits: [
            "Enhances intelligence and communication",
            "Success in education and writing",
            "Business and trade success",
            "Nervous system health",
            "Mercury in 9th house benefits"
        ],
        carats: "3-6 carats",
        metal: "Gold or Silver",
        finger: "Little finger (right hand)",
        day: "Wednesday, during Budha Hora",
        mantra: "Om Bum Budhaya Namah (108 times)",
        alternatives: ["Peridot", "Green Tourmaline", "Tsavorite"],
        precautions: [
            "Ensure natural, untreated stone",
            "Mercury should not be combust",
            "May not suit Pisces or Sagittarius ascendant"
        ],
        price: "₹5,000 - ₹50,000+ per carat",
        suitable: true,
        reason: "Mercury in 9th house (own sign) - supports education & wisdom"
    },
    {
        name: "Diamond",
        hindiName: "Heera",
        planet: "Venus (4th & 9th Lord)",
        planetSymbol: "♀",
        color: "White/Colorless",
        colorClass: "from-gray-100 to-gray-300",
        benefits: [
            "Luxury and comfort",
            "Artistic abilities",
            "Relationship harmony",
            "Venus in 10th house - career authority",
            "Beauty and charm"
        ],
        carats: "0.5-1.5 carats",
        metal: "Platinum or White Gold",
        finger: "Ring finger (right hand)",
        day: "Friday, during Shukra Hora",
        mantra: "Om Shum Shukraya Namah (108 times)",
        alternatives: ["White Sapphire", "Zircon", "White Topaz"],
        precautions: [
            "May increase material desires",
            "Balance with spiritual practices",
            "Ensure certified natural diamond"
        ],
        price: "₹50,000 - ₹5,00,000+ per carat",
        suitable: true,
        reason: "Venus is Yogakaraka for Aquarius - highly auspicious"
    },
    {
        name: "Yellow Sapphire",
        hindiName: "Pukhraj",
        planet: "Jupiter (2nd & 11th Lord)",
        planetSymbol: "♃",
        color: "Yellow",
        colorClass: "from-yellow-400 to-amber-600",
        benefits: [
            "Wisdom and knowledge",
            "Wealth and prosperity",
            "Good fortune",
            "Jupiter Mahadasha benefits",
            "Spiritual growth"
        ],
        carats: "3-5 carats",
        metal: "Gold",
        finger: "Index finger (right hand)",
        day: "Thursday, during Guru Hora",
        mantra: "Om Brim Brihaspataye Namah (108 times)",
        alternatives: ["Citrine", "Yellow Topaz", "Golden Beryl"],
        precautions: [
            "Jupiter should not be debilitated",
            "May increase weight if diet not controlled",
            "Avoid cracked stones"
        ],
        price: "₹10,000 - ₹80,000+ per carat",
        suitable: true,
        reason: "Currently in Jupiter Mahadasha - excellent choice"
    },
    {
        name: "Red Coral",
        hindiName: "Moonga",
        planet: "Mars (3rd & 10th Lord)",
        planetSymbol: "♂",
        color: "Red/Orange",
        colorClass: "from-red-500 to-orange-600",
        benefits: [
            "Courage and confidence",
            "Victory over enemies",
            "Physical strength",
            "Property matters",
            "Leadership abilities"
        ],
        carats: "6-9 carats",
        metal: "Gold or Copper",
        finger: "Ring finger (right hand)",
        day: "Tuesday, during Mangal Hora",
        mantra: "Om Kram Kreem Kroum Sah Bhaumaya Namah (108 times)",
        alternatives: ["Carnelian", "Red Jasper"],
        precautions: [
            "May increase aggression if Mars is strong",
            "Test for Mangal Dosha compatibility",
            "Ensure natural sea coral"
        ],
        price: "₹500 - ₹5,000 per carat",
        suitable: false,
        reason: "Mars in 8th may intensify transformation - proceed with caution"
    },
    {
        name: "Hessonite",
        hindiName: "Gomed",
        planet: "Rahu (North Node)",
        planetSymbol: "☊",
        color: "Honey Brown",
        colorClass: "from-amber-600 to-amber-900",
        benefits: [
            "Protection from Rahu's negative effects",
            "Success in foreign lands",
            "Research and technology",
            "Overcoming confusion",
            "Financial gains"
        ],
        carats: "5-7 carats",
        metal: "Silver or Panchdhatu",
        finger: "Middle finger (right hand)",
        day: "Saturday or Wednesday, during Rahu Kaal",
        mantra: "Om Ram Rahave Namah (108 times)",
        alternatives: ["Orange Zircon", "Spessartite Garnet"],
        precautions: [
            "Rahu is a shadow planet - effects vary",
            "May increase ambition excessively",
            "Combine with Ketu stone if needed"
        ],
        price: "₹1,000 - ₹10,000 per carat",
        suitable: true,
        reason: "Rahu in 2nd house - can help wealth and speech"
    },
    {
        name: "Cat's Eye",
        hindiName: "Lehsunia",
        planet: "Ketu (South Node)",
        planetSymbol: "☋",
        color: "Greenish with Chatoyancy",
        colorClass: "from-green-700 to-gray-600",
        benefits: [
            "Spiritual liberation",
            "Protection from accidents",
            "Intuition enhancement",
            "Past life healing",
            "Detachment and wisdom"
        ],
        carats: "3-5 carats",
        metal: "Silver or Panchdhatu",
        finger: "Middle or Little finger",
        day: "Tuesday or Saturday",
        mantra: "Om Kem Ketave Namah (108 times)",
        alternatives: ["Chrysoberyl", "Tiger's Eye"],
        precautions: [
            "May cause detachment from material life",
            "Not for those seeking worldly success initially",
            "Can trigger spiritual awakening rapidly"
        ],
        price: "₹2,000 - ₹20,000 per carat",
        suitable: true,
        reason: "Ketu in 8th with Sun - spiritual transformation support"
    }
]

export default function GemstoneRecommendations() {
    const [selectedGem, setSelectedGem] = useState<GemstoneInfo | null>(null)

    const suitableGems = GEMSTONE_DATA.filter(g => g.suitable)
    const cautionGems = GEMSTONE_DATA.filter(g => !g.suitable)

    return (
        <div className="space-y-6">
            {/* Header */}
            <Card className="bg-gradient-to-br from-slate-900/50 to-purple-900/30 border-purple-500/30 p-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-gradient-to-br from-purple-500/20 to-cyan-500/20 rounded-full">
                        <Gem className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">Gemstone Recommendations</h2>
                        <p className="text-sm text-gray-400">Based on your planetary positions</p>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-3 text-center">
                        <div className="text-2xl font-bold text-green-400">{suitableGems.length}</div>
                        <div className="text-xs text-gray-400">Recommended</div>
                    </div>
                    <div className="bg-amber-900/20 border border-amber-500/30 rounded-lg p-3 text-center">
                        <div className="text-2xl font-bold text-amber-400">{cautionGems.length}</div>
                        <div className="text-xs text-gray-400">Use with Caution</div>
                    </div>
                </div>
            </Card>

            {/* Primary Recommendations */}
            <div>
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                    Recommended Gemstones
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {suitableGems.map((gem, idx) => (
                        <motion.div
                            key={gem.name}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                        >
                            <Card
                                className={`bg-gradient-to-br ${gem.colorClass} bg-opacity-10 border-purple-500/30 p-4 cursor-pointer hover:scale-105 transition-transform`}
                                onClick={() => setSelectedGem(gem)}
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <h4 className="font-semibold text-white">{gem.name}</h4>
                                        <p className="text-xs text-gray-300">{gem.hindiName}</p>
                                    </div>
                                    <span className="text-2xl">{gem.planetSymbol}</span>
                                </div>
                                <p className="text-xs text-gray-400 mb-2">{gem.planet}</p>
                                <Badge className="bg-green-500/20 text-green-300 border-green-500/30 text-xs">
                                    Suitable
                                </Badge>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Caution Stones */}
            {cautionGems.length > 0 && (
                <div>
                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-amber-400" />
                        Proceed with Caution
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {cautionGems.map((gem) => (
                            <Card
                                key={gem.name}
                                className="bg-amber-900/10 border-amber-500/30 p-4 cursor-pointer hover:scale-105 transition-transform"
                                onClick={() => setSelectedGem(gem)}
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <h4 className="font-semibold text-white">{gem.name}</h4>
                                        <p className="text-xs text-gray-300">{gem.hindiName}</p>
                                    </div>
                                    <span className="text-2xl">{gem.planetSymbol}</span>
                                </div>
                                <p className="text-xs text-amber-400">{gem.reason}</p>
                            </Card>
                        ))}
                    </div>
                </div>
            )}

            {/* Selected Gem Details Modal */}
            {selectedGem && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={() => setSelectedGem(null)}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-slate-900 border border-purple-500/30 rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className={`bg-gradient-to-r ${selectedGem.colorClass} p-6`}>
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-2xl font-bold text-white">{selectedGem.name}</h3>
                                    <p className="text-white/80">{selectedGem.hindiName} • {selectedGem.planet}</p>
                                </div>
                                <span className="text-4xl">{selectedGem.planetSymbol}</span>
                            </div>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Suitability */}
                            <div className={`p-4 rounded-lg ${selectedGem.suitable ? 'bg-green-900/20 border border-green-500/30' : 'bg-amber-900/20 border border-amber-500/30'}`}>
                                <div className="flex items-center gap-2 mb-2">
                                    {selectedGem.suitable ? (
                                        <CheckCircle2 className="w-5 h-5 text-green-400" />
                                    ) : (
                                        <AlertTriangle className="w-5 h-5 text-amber-400" />
                                    )}
                                    <span className={selectedGem.suitable ? "text-green-400 font-medium" : "text-amber-400 font-medium"}>
                                        {selectedGem.suitable ? "Highly Recommended" : "Use with Caution"}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-300">{selectedGem.reason}</p>
                            </div>

                            {/* Benefits */}
                            <div>
                                <h4 className="font-medium text-purple-400 mb-2 flex items-center gap-2">
                                    <Sparkles className="w-4 h-4" />
                                    Benefits
                                </h4>
                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    {selectedGem.benefits.map((benefit, idx) => (
                                        <li key={idx} className="text-sm text-gray-300 flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 bg-purple-400 rounded-full"></span>
                                            {benefit}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Wearing Instructions */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-slate-800/50 rounded-lg p-3">
                                    <div className="flex items-center gap-2 text-cyan-400 mb-1">
                                        <Scale className="w-4 h-4" />
                                        <span className="text-sm font-medium">Weight</span>
                                    </div>
                                    <p className="text-sm text-gray-300">{selectedGem.carats}</p>
                                </div>
                                <div className="bg-slate-800/50 rounded-lg p-3">
                                    <div className="flex items-center gap-2 text-cyan-400 mb-1">
                                        <Info className="w-4 h-4" />
                                        <span className="text-sm font-medium">Finger</span>
                                    </div>
                                    <p className="text-sm text-gray-300">{selectedGem.finger}</p>
                                </div>
                                <div className="bg-slate-800/50 rounded-lg p-3">
                                    <div className="flex items-center gap-2 text-cyan-400 mb-1">
                                        <Clock className="w-4 h-4" />
                                        <span className="text-sm font-medium">Best Day</span>
                                    </div>
                                    <p className="text-sm text-gray-300">{selectedGem.day}</p>
                                </div>
                                <div className="bg-slate-800/50 rounded-lg p-3">
                                    <div className="flex items-center gap-2 text-cyan-400 mb-1">
                                        <Gem className="w-4 h-4" />
                                        <span className="text-sm font-medium">Metal</span>
                                    </div>
                                    <p className="text-sm text-gray-300">{selectedGem.metal}</p>
                                </div>
                            </div>

                            {/* Mantra */}
                            <div className="bg-indigo-900/20 border border-indigo-500/30 rounded-lg p-4">
                                <h4 className="font-medium text-indigo-400 mb-2">Energizing Mantra</h4>
                                <p className="text-white font-sanskrit text-lg">{selectedGem.mantra}</p>
                            </div>

                            {/* Alternatives */}
                            <div>
                                <h4 className="font-medium text-gray-400 mb-2">Affordable Alternatives</h4>
                                <div className="flex flex-wrap gap-2">
                                    {selectedGem.alternatives.map((alt) => (
                                        <Badge key={alt} className="bg-slate-700 text-gray-300">{alt}</Badge>
                                    ))}
                                </div>
                            </div>

                            {/* Precautions */}
                            <div className="bg-red-900/10 border border-red-500/20 rounded-lg p-4">
                                <h4 className="font-medium text-red-400 mb-2 flex items-center gap-2">
                                    <AlertTriangle className="w-4 h-4" />
                                    Precautions
                                </h4>
                                <ul className="space-y-1">
                                    {selectedGem.precautions.map((precaution, idx) => (
                                        <li key={idx} className="text-sm text-gray-300">• {precaution}</li>
                                    ))}
                                </ul>
                            </div>

                            {/* Price Range */}
                            <div className="text-center text-gray-400">
                                <span className="text-sm">Approximate Price: </span>
                                <span className="text-purple-400 font-medium">{selectedGem.price}</span>
                            </div>

                            <Button
                                onClick={() => setSelectedGem(null)}
                                className="w-full bg-purple-500 hover:bg-purple-600"
                            >
                                Close
                            </Button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </div>
    )
}
