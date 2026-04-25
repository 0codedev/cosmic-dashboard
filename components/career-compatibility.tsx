"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
    Briefcase,
    Star,
    TrendingUp,
    Award,
    Target,
    CheckCircle2,
    XCircle
} from "lucide-react"

interface CareerField {
    id: string
    name: string
    icon: string
    compatibility: number
    strengths: string[]
    challenges: string[]
    bestRoles: string[]
    planetarySupport: string[]
}

const CAREER_FIELDS: CareerField[] = [
    {
        id: "tech",
        name: "Technology & IT",
        icon: "💻",
        compatibility: 85,
        strengths: [
            "Saturn in 1st provides discipline for coding",
            "Rahu in 2nd attracts innovative technologies",
            "Mercury aspecting 3rd enhances analytical skills"
        ],
        challenges: [
            "May feel isolated in solo work",
            "Need for human connection in tech roles"
        ],
        bestRoles: ["Software Engineer", "Data Analyst", "System Architect", "AI/ML Specialist"],
        planetarySupport: ["Saturn", "Rahu", "Mercury"]
    },
    {
        id: "healing",
        name: "Healthcare & Healing",
        icon: "🏥",
        compatibility: 92,
        strengths: [
            "Jupiter in 9th blesses healing abilities",
            "Shatabhisha nakshatra is 'hundred healers'",
            "6th house connection supports medical service"
        ],
        challenges: [
            "Emotional absorption from patients",
            "Need for work-life balance"
        ],
        bestRoles: ["Doctor", "Therapist", "Alternative Medicine", "Medical Researcher"],
        planetarySupport: ["Jupiter", "Moon", "Sun"]
    },
    {
        id: "teaching",
        name: "Education & Teaching",
        icon: "📚",
        compatibility: 88,
        strengths: [
            "Jupiter Mahadasha supports teaching",
            "9th house emphasis favors higher education",
            "Natural ability to explain complex concepts"
        ],
        challenges: [
            "Patience with slower learners",
            "Administrative overhead"
        ],
        bestRoles: ["Professor", "Corporate Trainer", "Online Educator", "Mentor"],
        planetarySupport: ["Jupiter", "Mercury", "Sun"]
    },
    {
        id: "research",
        name: "Research & Science",
        icon: "🔬",
        compatibility: 90,
        strengths: [
            "Rahu in 2nd drives investigation",
            "Saturn provides patience for long studies",
            "Aquarius rising loves unconventional approaches"
        ],
        challenges: [
            "Publication pressure",
            "Funding uncertainties"
        ],
        bestRoles: ["Research Scientist", "Academic Researcher", "R&D Lead", "Data Scientist"],
        planetarySupport: ["Saturn", "Rahu", "Jupiter"]
    },
    {
        id: "spiritual",
        name: "Spiritual & Counseling",
        icon: "🧘",
        compatibility: 86,
        strengths: [
            "Ketu in 8th enhances intuition",
            "Jupiter in 9th supports spiritual teaching",
            "Natural counseling abilities"
        ],
        challenges: [
            "Monetizing spiritual work",
            "Energy boundaries with clients"
        ],
        bestRoles: ["Astrologer", "Spiritual Coach", "Meditation Teacher", "Counselor"],
        planetarySupport: ["Jupiter", "Ketu", "Moon"]
    },
    {
        id: "business",
        name: "Business & Entrepreneurship",
        icon: "🏢",
        compatibility: 72,
        strengths: [
            "Mars in 3rd supports initiative",
            "Rahu can bring sudden gains",
            "Independent thinking of Aquarius"
        ],
        challenges: [
            "Risk-taking may feel uncomfortable",
            "Team management requires effort"
        ],
        bestRoles: ["Startup Founder", "Consultant", "Freelancer", "Product Manager"],
        planetarySupport: ["Mars", "Rahu", "Sun"]
    }
]

export default function CareerCompatibility() {
    const [selectedField, setSelectedField] = useState<string>("healing")

    const currentField = CAREER_FIELDS.find(f => f.id === selectedField)
    const sortedFields = [...CAREER_FIELDS].sort((a, b) => b.compatibility - a.compatibility)

    const getCompatibilityColor = (score: number) => {
        if (score >= 85) return "text-green-400"
        if (score >= 70) return "text-cyan-400"
        if (score >= 55) return "text-yellow-400"
        return "text-red-400"
    }

    const getCompatibilityBg = (score: number) => {
        if (score >= 85) return "from-green-900/30"
        if (score >= 70) return "from-cyan-900/30"
        if (score >= 55) return "from-yellow-900/30"
        return "from-red-900/30"
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <Card className="bg-gradient-to-br from-orange-900/30 to-slate-900/50 border-orange-500/30 p-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-orange-500/20 rounded-full">
                        <Briefcase className="w-6 h-6 text-orange-400" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">Career Compatibility</h2>
                        <p className="text-sm text-gray-400">Best career fields based on your chart</p>
                    </div>
                </div>

                {/* Top 3 */}
                <div className="grid grid-cols-3 gap-3">
                    {sortedFields.slice(0, 3).map((field, idx) => (
                        <div
                            key={field.id}
                            className="text-center p-3 bg-slate-800/50 rounded-lg cursor-pointer hover:bg-slate-700/50 transition-all"
                            onClick={() => setSelectedField(field.id)}
                        >
                            <div className="flex items-center justify-center gap-2 mb-1">
                                {idx === 0 && <Award className="w-4 h-4 text-yellow-400" />}
                                <span className="text-2xl">{field.icon}</span>
                            </div>
                            <div className="text-xs text-gray-400">{field.name}</div>
                            <div className={`font-bold ${getCompatibilityColor(field.compatibility)}`}>
                                {field.compatibility}%
                            </div>
                        </div>
                    ))}
                </div>
            </Card>

            {/* Field Selection */}
            <div className="flex flex-wrap gap-2">
                {CAREER_FIELDS.map(field => (
                    <Badge
                        key={field.id}
                        className={`cursor-pointer transition-all ${selectedField === field.id
                            ? 'bg-orange-500 text-white'
                            : 'bg-slate-700/50 text-gray-400 hover:bg-slate-600/50'
                            }`}
                        onClick={() => setSelectedField(field.id)}
                    >
                        {field.icon} {field.name}
                    </Badge>
                ))}
            </div>

            {/* Selected Field Details */}
            <AnimatePresence mode="wait">
                {currentField && (
                    <motion.div
                        key={currentField.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                        className="space-y-4"
                    >
                        {/* Compatibility Score */}
                        <Card className={`bg-gradient-to-br ${getCompatibilityBg(currentField.compatibility)} to-slate-900/50 border-orange-500/20 p-6`}>
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <span className="text-4xl">{currentField.icon}</span>
                                    <div>
                                        <h3 className="text-xl font-bold text-white">{currentField.name}</h3>
                                        <p className="text-sm text-gray-400">Career field analysis</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className={`text-3xl font-bold ${getCompatibilityColor(currentField.compatibility)}`}>
                                        {currentField.compatibility}%
                                    </div>
                                    <div className="text-xs text-gray-400">Compatibility</div>
                                </div>
                            </div>

                            <Progress value={currentField.compatibility} className="h-2" />
                        </Card>

                        {/* Strengths & Challenges */}
                        <div className="grid md:grid-cols-2 gap-4">
                            <Card className="bg-green-900/20 border-green-500/20 p-6">
                                <h4 className="text-lg font-semibold text-green-400 mb-4 flex items-center gap-2">
                                    <CheckCircle2 className="w-5 h-5" />
                                    Your Strengths
                                </h4>
                                <div className="space-y-2">
                                    {currentField.strengths.map((strength, idx) => (
                                        <div key={idx} className="flex items-start gap-2 text-sm text-gray-300">
                                            <Star className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                                            {strength}
                                        </div>
                                    ))}
                                </div>
                            </Card>

                            <Card className="bg-red-900/10 border-red-500/20 p-6">
                                <h4 className="text-lg font-semibold text-red-400 mb-4 flex items-center gap-2">
                                    <XCircle className="w-5 h-5" />
                                    Challenges to Navigate
                                </h4>
                                <div className="space-y-2">
                                    {currentField.challenges.map((challenge, idx) => (
                                        <div key={idx} className="flex items-start gap-2 text-sm text-gray-300">
                                            <Target className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                                            {challenge}
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </div>

                        {/* Best Roles */}
                        <Card className="bg-slate-800/50 border-purple-500/20 p-6">
                            <h4 className="text-lg font-semibold text-purple-400 mb-4 flex items-center gap-2">
                                <TrendingUp className="w-5 h-5" />
                                Best Roles for You
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {currentField.bestRoles.map((role, idx) => (
                                    <Badge key={idx} className="bg-purple-500/20 text-purple-400 py-1.5">
                                        {role}
                                    </Badge>
                                ))}
                            </div>

                            <div className="mt-4 pt-4 border-t border-slate-700">
                                <div className="text-sm text-gray-400 mb-2">Supporting Planets:</div>
                                <div className="flex gap-2">
                                    {currentField.planetarySupport.map((planet, idx) => (
                                        <Badge key={idx} className="bg-amber-500/20 text-amber-400">
                                            {planet}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
