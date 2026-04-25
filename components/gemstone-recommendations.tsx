"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useAstrologyStore } from "@/stores/astrology-store"
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

const GEMSTONE_TEMPLATES: Omit<GemstoneInfo, "suitable" | "reason" | "planet">[] = [
    {
        name: "Ruby",
        hindiName: "Manik",
        // planet: "Sun", // Handled dynamically
        planetSymbol: "☉",
        color: "Deep Red",
        colorClass: "from-red-600 to-red-900",
        benefits: ["Authority & Leadership", "Confidence", "Vitality", "Father's support", "Public Recognition"],
        carats: "3-5 carats",
        metal: "Gold or Copper",
        finger: "Ring finger",
        day: "Sunday",
        mantra: "Om Hram Hreem Hroum Sah Suryaya Namah",
        alternatives: ["Red Spinel", "Red Garnet"],
        precautions: ["Avoid if Sun is debilitated in Libra (check degrees)", "Increases body heat"],
        price: "₹5,000 - ₹50,000+"
    },
    {
        name: "Pearl",
        hindiName: "Moti",
        planetSymbol: "☽",
        color: "White/Cream",
        colorClass: "from-slate-100 to-slate-200",
        benefits: ["Emotional stability", "Mental peace", "Mother's health", "Creativity", "Intuition"],
        carats: "5-10 carats",
        metal: "Silver",
        finger: "Little finger",
        day: "Monday",
        mantra: "Om Shram Shreem Shroum Sah Chandraya Namah",
        alternatives: ["Moonstone"],
        precautions: ["Avoid if suffering from cough/cold often", "Emotional sensitivity increase"],
        price: "₹1,000 - ₹20,000+"
    },
    {
        name: "Red Coral",
        hindiName: "Moonga",
        planetSymbol: "♂",
        color: "Red/Orange",
        colorClass: "from-orange-500 to-red-500",
        benefits: ["Courage & Energy", "Property gains", "Overcoming enemies", "Technical skills", "Physical Strength"],
        carats: "6-12 carats",
        metal: "Gold/Copper",
        finger: "Ring finger",
        day: "Tuesday",
        mantra: "Om Kram Kreem Kroum Sah Bhaumaya Namah",
        alternatives: ["Carnelian"],
        precautions: ["Avoid if short tempered", "Increases aggression"],
        price: "₹500 - ₹5,000+"
    },
    {
        name: "Emerald",
        hindiName: "Panna",
        planetSymbol: "☿",
        color: "Green",
        colorClass: "from-emerald-400 to-emerald-700",
        benefits: ["Business & Trade", "Communication skills", "Education", "Memory", "Nervous system"],
        carats: "3-6 carats",
        metal: "Gold/Silver",
        finger: "Little finger",
        day: "Wednesday",
        mantra: "Om Bram Breem Broum Sah Budhaya Namah",
        alternatives: ["Peridot", "Green Tourmaline"],
        precautions: ["Avoid if Mercury is weak/combust"],
        price: "₹2,000 - ₹40,000+"
    },
    {
        name: "Yellow Sapphire",
        hindiName: "Pukhraj",
        planetSymbol: "♃",
        color: "Yellow",
        colorClass: "from-yellow-400 to-amber-500",
        benefits: ["Wisdom & Knowledge", "Wealth & Prosperity", "Marriage happiness", "Spiritual progress", "Liver health"],
        carats: "4-7 carats",
        metal: "Gold",
        finger: "Index finger",
        day: "Thursday",
        mantra: "Om Gram Greem Groum Sah Gurave Namah",
        alternatives: ["Citrine", "Yellow Topaz"],
        precautions: ["Avoid if Jupiter is 6/8/12 lord (unless strong)"],
        price: "₹10,000 - ₹1,00,000+"
    },
    {
        name: "Diamond",
        hindiName: "Heera",
        planetSymbol: "♀",
        color: "White/Clear",
        colorClass: "from-cyan-100 to-blue-100",
        benefits: ["Luxury & Wealth", "Love & Romance", "Artistic talent", "Vehicle comfort", "Charm"],
        carats: "0.5-2 carats",
        metal: "Platinum/Gold",
        finger: "Middle/Ring finger",
        day: "Friday",
        mantra: "Om Dram Dreem Droum Sah Shukraya Namah",
        alternatives: ["White Sapphire", "Opal", "Zircon"],
        precautions: ["Can lead to excessive indulgence", "Ensure high clarity"],
        price: "₹50,000+"
    },
    {
        name: "Blue Sapphire",
        hindiName: "Neelam",
        planetSymbol: "♄",
        color: "Deep Blue",
        colorClass: "from-blue-700 to-indigo-900",
        benefits: ["Career growth", "Discipline", "Political success", "Iron/Oil industries", "Mental focus"],
        carats: "4-7 carats",
        metal: "Silver/Iron",
        finger: "Middle finger",
        day: "Saturday",
        mantra: "Om Pram Preem Proum Sah Shanaischaraya Namah",
        alternatives: ["Amethyst", "Iolite", "Lapis Lazuli"],
        precautions: ["Must trial for 3 days", "Can cause accidents if unsuitable"],
        price: "₹10,000 - ₹2,00,000+"
    },
    {
        name: "Hessonite",
        hindiName: "Gomed",
        planetSymbol: "☊",
        color: "Honey/Red-Brown",
        colorClass: "from-orange-700 to-amber-900",
        benefits: ["Politics & Power", "Foreign dealings", "Winning court cases", "Sudden gains", "Gambling luck"],
        carats: "6-10 carats",
        metal: "Silver",
        finger: "Middle finger",
        day: "Saturday",
        mantra: "Om Bhram Bhreem Bhroum Sah Rahave Namah",
        alternatives: ["Spessartine"],
        precautions: ["Avoid if Rahu in 8/12", "Can cause mental confusion"],
        price: "₹500 - ₹5,000+"
    },
    {
        name: "Cat's Eye",
        hindiName: "Lehsunia",
        planetSymbol: "☋",
        color: "Gray/Green Chatoyant",
        colorClass: "from-gray-500 to-emerald-900",
        benefits: ["Spiritual Awakening", "Protection", "Intuition", "Moksha", "Occult knowledge"],
        carats: "4-7 carats",
        metal: "Silver",
        finger: "Ring/Middle finger",
        day: "Tuesday/Saturday",
        mantra: "Om Stram Streem Stroum Sah Ketave Namah",
        alternatives: ["Tiger Eye"],
        precautions: ["Detachment from world", "Not for material success"],
        price: "₹1,000 - ₹15,000+"
    }
];

export default function GemstoneRecommendations() {
    const { userData } = useAstrologyStore()
    const [selectedGem, setSelectedGem] = useState<GemstoneInfo | null>(null)

    const GEMSTONE_DATA = useMemo(() => {
        if (!userData) return [];

        const signs = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
        const lagna = userData.lagna || "Aries";
        const lagnaIndex = signs.indexOf(lagna);

        // Helper to get Lord of a House
        const getLordOfHouse = (houseNum: number): string => {
            // House num is 1-based (1..12). 
            // Logic: (LagnaIndex + HouseNum - 1) % 12 -> Sign Index -> Ruler
            const signIndex = (lagnaIndex + houseNum - 1) % 12;
            const sign = signs[signIndex];
            const rulers: Record<string, string> = {
                "Aries": "Mars", "Taurus": "Venus", "Gemini": "Mercury", "Cancer": "Moon",
                "Leo": "Sun", "Virgo": "Mercury", "Libra": "Venus", "Scorpio": "Mars",
                "Sagittarius": "Jupiter", "Capricorn": "Saturn", "Aquarius": "Saturn", "Pisces": "Jupiter"
            };
            return rulers[sign];
        };

        const lords = {
            1: getLordOfHouse(1),
            5: getLordOfHouse(5),
            9: getLordOfHouse(9),
            6: getLordOfHouse(6),
            8: getLordOfHouse(8),
            12: getLordOfHouse(12)
        };

        const mapPlanetToGemName: Record<string, string> = {
            "Sun": "Ruby", "Moon": "Pearl", "Mars": "Red Coral", "Mercury": "Emerald",
            "Jupiter": "Yellow Sapphire", "Venus": "Diamond", "Saturn": "Blue Sapphire",
            "Rahu": "Hessonite", "Ketu": "Cat's Eye"
        }

        return GEMSTONE_TEMPLATES.map(template => {
            // Determine Planet Name from Gem Name (Reverse map or manual check)
            let planetName = "";
            let suitable = false;
            let reason = "";

            if (template.name === "Ruby") planetName = "Sun";
            if (template.name === "Pearl") planetName = "Moon";
            if (template.name === "Red Coral") planetName = "Mars";
            if (template.name === "Emerald") planetName = "Mercury";
            if (template.name === "Yellow Sapphire") planetName = "Jupiter";
            if (template.name === "Diamond") planetName = "Venus";
            if (template.name === "Blue Sapphire") planetName = "Saturn";
            if (template.name === "Hessonite") planetName = "Rahu";
            if (template.name === "Cat's Eye") planetName = "Ketu";

            // Logic
            if (planetName === lords[1]) {
                suitable = true;
                reason = `Lagna Lord (${planetName}) - Highly beneficial for health and overall success.`;
            } else if (planetName === lords[9]) {
                suitable = true;
                reason = `9th Lord (${planetName}) - Best for luck and fortune (Bhagya).`;
            } else if (planetName === lords[5]) {
                suitable = true;
                reason = `5th Lord (${planetName}) - Good for intelligence and creativity.`;
            } else if ([lords[6], lords[8], lords[12]].includes(planetName)) {
                suitable = false;
                reason = `Lord of difficult house (6/8/12). Consult astrologer before wearing.`;
            } else {
                suitable = false;
                reason = `Neutral or mixed effects. Requires detailed analysis.`;
            }

            // Rahu/Ketu special logic (simplified)
            if (planetName === "Rahu" || planetName === "Ketu") {
                suitable = false;
                reason = "Nodes require specific placement analysis. Proceed with caution.";
            }

            // Override for Yogakaraka (Example: Saturn for Libra/Taurus)
            // Simplified Yogakaraka check: If planet rules (Kendra AND Trikona)
            // Need robust check. For now, leave as basic functional benefic check (1,5,9).

            return {
                ...template,
                planet: planetName,
                suitable,
                reason
            };
        });
    }, [userData]);

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
