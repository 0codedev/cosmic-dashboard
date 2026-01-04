"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Baby,
    Star,
    Heart,
    Search,
    Sparkles,
    BookOpen
} from "lucide-react"

interface BabyName {
    name: string
    meaning: string
    gender: "boy" | "girl" | "unisex"
    origin: string
    startingLetter: string
    nakshatra: string
    rashi: string
}

interface NakshatraData {
    name: string
    letters: string[]
    rashi: string
    deity: string
    quality: string
}

const NAKSHATRA_DATA: NakshatraData[] = [
    { name: "Ashwini", letters: ["Chu", "Che", "Cho", "La"], rashi: "Aries", deity: "Ashwini Kumaras", quality: "Swift, healing, beginning" },
    { name: "Bharani", letters: ["Li", "Lu", "Le", "Lo"], rashi: "Aries", deity: "Yama", quality: "Transformation, restraint" },
    { name: "Krittika", letters: ["A", "E", "U", "Ea"], rashi: "Aries/Taurus", deity: "Agni", quality: "Sharp, purifying, critical" },
    { name: "Rohini", letters: ["O", "Va", "Vi", "Vu"], rashi: "Taurus", deity: "Brahma", quality: "Growth, fertility, beauty" },
    { name: "Mrigashira", letters: ["Ve", "Vo", "Ka", "Ki"], rashi: "Taurus/Gemini", deity: "Soma", quality: "Searching, gentle, curious" },
    { name: "Ardra", letters: ["Ku", "Gha", "Ng", "Chh"], rashi: "Gemini", deity: "Rudra", quality: "Stormy, transformative" },
    { name: "Punarvasu", letters: ["Ke", "Ko", "Ha", "Hi"], rashi: "Gemini/Cancer", deity: "Aditi", quality: "Renewal, restoration" },
    { name: "Pushya", letters: ["Hu", "He", "Ho", "Da"], rashi: "Cancer", deity: "Brihaspati", quality: "Nourishing, auspicious" },
    { name: "Ashlesha", letters: ["Di", "Du", "De", "Do"], rashi: "Cancer", deity: "Nagas", quality: "Embracing, mystical" },
    { name: "Magha", letters: ["Ma", "Mi", "Mu", "Me"], rashi: "Leo", deity: "Pitris", quality: "Royal, ancestral, powerful" },
    { name: "Purva Phalguni", letters: ["Mo", "Ta", "Ti", "Tu"], rashi: "Leo", deity: "Bhaga", quality: "Creative, loving, leisure" },
    { name: "Uttara Phalguni", letters: ["Te", "To", "Pa", "Pi"], rashi: "Leo/Virgo", deity: "Aryaman", quality: "Friendship, healing" },
    { name: "Hasta", letters: ["Pu", "Sha", "Na", "Tha"], rashi: "Virgo", deity: "Savitar", quality: "Skillful, clever" },
    { name: "Chitra", letters: ["Pe", "Po", "Ra", "Ri"], rashi: "Virgo/Libra", deity: "Vishwakarma", quality: "Brilliant, artistic" },
    { name: "Swati", letters: ["Ru", "Re", "Ro", "Taa"], rashi: "Libra", deity: "Vayu", quality: "Independent, flexible" },
    { name: "Vishakha", letters: ["Ti", "Tu", "Te", "To"], rashi: "Libra/Scorpio", deity: "Indra-Agni", quality: "Determined, triumphant" },
    { name: "Anuradha", letters: ["Na", "Ni", "Nu", "Ne"], rashi: "Scorpio", deity: "Mitra", quality: "Devotional, friendly" },
    { name: "Jyeshtha", letters: ["No", "Ya", "Yi", "Yu"], rashi: "Scorpio", deity: "Indra", quality: "Chief, protective" },
    { name: "Moola", letters: ["Ye", "Yo", "Bha", "Bhi"], rashi: "Sagittarius", deity: "Nirriti", quality: "Root, investigative" },
    { name: "Purva Ashadha", letters: ["Bhu", "Dha", "Pha", "Da"], rashi: "Sagittarius", deity: "Apas", quality: "Invincible, purifying" },
    { name: "Uttara Ashadha", letters: ["Bhe", "Bho", "Ja", "Ji"], rashi: "Sagittarius/Capricorn", deity: "Vishvadevas", quality: "Universal, final victory" },
    { name: "Shravana", letters: ["Ju", "Je", "Jo", "Gha"], rashi: "Capricorn", deity: "Vishnu", quality: "Listening, learning" },
    { name: "Dhanishta", letters: ["Ga", "Gi", "Gu", "Ge"], rashi: "Capricorn/Aquarius", deity: "Vasus", quality: "Wealth, musical" },
    { name: "Shatabhisha", letters: ["Go", "Sa", "Si", "Su"], rashi: "Aquarius", deity: "Varuna", quality: "Healing, mystical" },
    { name: "Purva Bhadrapada", letters: ["Se", "So", "Da", "Di"], rashi: "Aquarius/Pisces", deity: "Aja Ekapada", quality: "Fiery, passionate" },
    { name: "Uttara Bhadrapada", letters: ["Du", "Tha", "Jha", "Da"], rashi: "Pisces", deity: "Ahir Budhnya", quality: "Deep, warrior" },
    { name: "Revati", letters: ["De", "Do", "Cha", "Chi"], rashi: "Pisces", deity: "Pushan", quality: "Nurturing, prosperous, final" },
]

// Sample names by nakshatra starting letters
const SAMPLE_NAMES: BabyName[] = [
    // Ashwini
    { name: "Chetan", meaning: "Consciousness, life", gender: "boy", origin: "Sanskrit", startingLetter: "Che", nakshatra: "Ashwini", rashi: "Aries" },
    { name: "Chetna", meaning: "Alertness, consciousness", gender: "girl", origin: "Sanskrit", startingLetter: "Che", nakshatra: "Ashwini", rashi: "Aries" },
    { name: "Lalit", meaning: "Beautiful, charming", gender: "boy", origin: "Sanskrit", startingLetter: "La", nakshatra: "Ashwini", rashi: "Aries" },
    { name: "Lalita", meaning: "Elegant, playful", gender: "girl", origin: "Sanskrit", startingLetter: "La", nakshatra: "Ashwini", rashi: "Aries" },

    // Rohini
    { name: "Vaibhav", meaning: "Prosperity, grandeur", gender: "boy", origin: "Sanskrit", startingLetter: "Va", nakshatra: "Rohini", rashi: "Taurus" },
    { name: "Varsha", meaning: "Rain, monsoon", gender: "girl", origin: "Sanskrit", startingLetter: "Va", nakshatra: "Rohini", rashi: "Taurus" },
    { name: "Virat", meaning: "Massive, supreme", gender: "boy", origin: "Sanskrit", startingLetter: "Vi", nakshatra: "Rohini", rashi: "Taurus" },
    { name: "Vaishnavi", meaning: "Devotee of Vishnu", gender: "girl", origin: "Sanskrit", startingLetter: "Va", nakshatra: "Rohini", rashi: "Taurus" },

    // Magha
    { name: "Mahesh", meaning: "Lord Shiva", gender: "boy", origin: "Sanskrit", startingLetter: "Ma", nakshatra: "Magha", rashi: "Leo" },
    { name: "Maithili", meaning: "Sita, daughter of Mithila", gender: "girl", origin: "Sanskrit", startingLetter: "Ma", nakshatra: "Magha", rashi: "Leo" },
    { name: "Mihir", meaning: "Sun, friend", gender: "boy", origin: "Sanskrit", startingLetter: "Mi", nakshatra: "Magha", rashi: "Leo" },
    { name: "Meera", meaning: "Ocean, devotee of Krishna", gender: "girl", origin: "Sanskrit", startingLetter: "Me", nakshatra: "Magha", rashi: "Leo" },

    // Pushya
    { name: "Harsh", meaning: "Happiness, joy", gender: "boy", origin: "Sanskrit", startingLetter: "Ha", nakshatra: "Pushya", rashi: "Cancer" },
    { name: "Harshita", meaning: "Joyful, happy", gender: "girl", origin: "Sanskrit", startingLetter: "Ha", nakshatra: "Pushya", rashi: "Cancer" },
    { name: "Dhruv", meaning: "Pole star, constant", gender: "boy", origin: "Sanskrit", startingLetter: "Da", nakshatra: "Pushya", rashi: "Cancer" },
    { name: "Daksha", meaning: "Skilled, capable", gender: "unisex", origin: "Sanskrit", startingLetter: "Da", nakshatra: "Pushya", rashi: "Cancer" },

    // Shatabhisha (Sudhanshu's Nakshatra)
    { name: "Siddharth", meaning: "One who has attained goals", gender: "boy", origin: "Sanskrit", startingLetter: "Si", nakshatra: "Shatabhisha", rashi: "Aquarius" },
    { name: "Sudhanshu", meaning: "Moon, nectar", gender: "boy", origin: "Sanskrit", startingLetter: "Su", nakshatra: "Shatabhisha", rashi: "Aquarius" },
    { name: "Saanvi", meaning: "Goddess Lakshmi", gender: "girl", origin: "Sanskrit", startingLetter: "Sa", nakshatra: "Shatabhisha", rashi: "Aquarius" },
    { name: "Siya", meaning: "Sita, goddess", gender: "girl", origin: "Sanskrit", startingLetter: "Si", nakshatra: "Shatabhisha", rashi: "Aquarius" },

    // Revati
    { name: "Chaitanya", meaning: "Consciousness, life", gender: "boy", origin: "Sanskrit", startingLetter: "Cha", nakshatra: "Revati", rashi: "Pisces" },
    { name: "Charvi", meaning: "Beautiful", gender: "girl", origin: "Sanskrit", startingLetter: "Cha", nakshatra: "Revati", rashi: "Pisces" },
    { name: "Devesh", meaning: "Lord of Gods", gender: "boy", origin: "Sanskrit", startingLetter: "De", nakshatra: "Revati", rashi: "Pisces" },
    { name: "Devika", meaning: "Little goddess", gender: "girl", origin: "Sanskrit", startingLetter: "De", nakshatra: "Revati", rashi: "Pisces" },
]

export default function BabyNames() {
    const [selectedNakshatra, setSelectedNakshatra] = useState<string>("Shatabhisha")
    const [genderFilter, setGenderFilter] = useState<"all" | "boy" | "girl">("all")
    const [searchQuery, setSearchQuery] = useState("")

    const currentNakshatra = NAKSHATRA_DATA.find(n => n.name === selectedNakshatra)

    const filteredNames = SAMPLE_NAMES.filter(name => {
        const matchesNakshatra = name.nakshatra === selectedNakshatra
        const matchesGender = genderFilter === "all" || name.gender === genderFilter || name.gender === "unisex"
        const matchesSearch = searchQuery === "" ||
            name.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            name.meaning.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesNakshatra && matchesGender && matchesSearch
    })

    const getGenderColor = (gender: string) => {
        switch (gender) {
            case "boy": return "bg-blue-500/20 text-blue-400"
            case "girl": return "bg-pink-500/20 text-pink-400"
            case "unisex": return "bg-purple-500/20 text-purple-400"
            default: return ""
        }
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <Card className="bg-gradient-to-br from-slate-900/50 to-pink-900/30 border-pink-500/30 p-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-pink-500/20 rounded-full">
                        <Baby className="w-6 h-6 text-pink-400" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">Baby Name Suggestions</h2>
                        <p className="text-sm text-gray-400">Auspicious names based on Nakshatra</p>
                    </div>
                </div>

                {/* Nakshatra Selector */}
                <div className="space-y-2">
                    <Label className="text-gray-400">Select Child's Nakshatra</Label>
                    <select
                        value={selectedNakshatra}
                        onChange={(e) => setSelectedNakshatra(e.target.value)}
                        className="w-full h-10 px-3 py-2 bg-slate-900/50 border border-pink-500/30 rounded-md text-white focus:ring-2 focus:ring-pink-500"
                    >
                        {NAKSHATRA_DATA.map(nak => (
                            <option key={nak.name} value={nak.name}>{nak.name} ({nak.rashi})</option>
                        ))}
                    </select>
                </div>
            </Card>

            {/* Nakshatra Info */}
            {currentNakshatra && (
                <Card className="bg-slate-800/50 border-purple-500/20 p-4">
                    <div className="flex items-center gap-2 mb-3">
                        <Star className="w-5 h-5 text-amber-400" />
                        <h3 className="font-semibold text-white">{currentNakshatra.name} Nakshatra</h3>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                            <span className="text-gray-500">Auspicious Letters:</span>
                            <div className="flex flex-wrap gap-2 mt-1">
                                {currentNakshatra.letters.map(letter => (
                                    <Badge key={letter} className="bg-amber-500/20 text-amber-300">{letter}</Badge>
                                ))}
                            </div>
                        </div>
                        <div>
                            <span className="text-gray-500">Rashi:</span>
                            <p className="text-cyan-400">{currentNakshatra.rashi}</p>
                        </div>
                        <div>
                            <span className="text-gray-500">Deity:</span>
                            <p className="text-purple-400">{currentNakshatra.deity}</p>
                        </div>
                        <div>
                            <span className="text-gray-500">Quality:</span>
                            <p className="text-gray-300">{currentNakshatra.quality}</p>
                        </div>
                    </div>
                </Card>
            )}

            {/* Filters */}
            <div className="flex flex-wrap gap-4">
                <div className="flex gap-2">
                    <Button
                        variant={genderFilter === "all" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setGenderFilter("all")}
                        className={genderFilter === "all" ? "bg-purple-500" : "border-purple-500/30"}
                    >
                        All
                    </Button>
                    <Button
                        variant={genderFilter === "boy" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setGenderFilter("boy")}
                        className={genderFilter === "boy" ? "bg-blue-500" : "border-blue-500/30"}
                    >
                        👦 Boy
                    </Button>
                    <Button
                        variant={genderFilter === "girl" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setGenderFilter("girl")}
                        className={genderFilter === "girl" ? "bg-pink-500" : "border-pink-500/30"}
                    >
                        👧 Girl
                    </Button>
                </div>

                <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <Input
                        placeholder="Search names..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 bg-slate-900/50 border-purple-500/30"
                    />
                </div>
            </div>

            {/* Name Results */}
            <div className="grid md:grid-cols-2 gap-3">
                {filteredNames.length > 0 ? (
                    filteredNames.map((name, idx) => (
                        <motion.div
                            key={name.name}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                        >
                            <Card className="p-4 bg-slate-800/50 border-purple-500/20 hover:border-pink-500/50 transition-all">
                                <div className="flex items-start justify-between mb-2">
                                    <div>
                                        <h4 className="text-lg font-semibold text-white">{name.name}</h4>
                                        <p className="text-sm text-gray-400">{name.meaning}</p>
                                    </div>
                                    <Badge className={getGenderColor(name.gender)}>
                                        {name.gender === "boy" ? "👦" : name.gender === "girl" ? "👧" : "⚧"} {name.gender}
                                    </Badge>
                                </div>

                                <div className="flex flex-wrap gap-2 text-xs">
                                    <Badge className="bg-slate-700 text-gray-300">Letter: {name.startingLetter}</Badge>
                                    <Badge className="bg-amber-500/10 text-amber-400">{name.origin}</Badge>
                                </div>
                            </Card>
                        </motion.div>
                    ))
                ) : (
                    <Card className="col-span-2 p-8 bg-slate-800/50 border-purple-500/20 text-center">
                        <Sparkles className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                        <p className="text-gray-400">No names found for this selection.</p>
                        <p className="text-sm text-gray-500">Try adjusting filters or select a different nakshatra.</p>
                    </Card>
                )}
            </div>

            {/* Tips */}
            <Card className="bg-gradient-to-br from-amber-900/20 to-slate-900/50 border-amber-500/20 p-4">
                <div className="flex items-center gap-2 mb-2">
                    <BookOpen className="w-5 h-5 text-amber-400" />
                    <h4 className="text-sm font-medium text-amber-400">Naming Guidelines</h4>
                </div>
                <ul className="space-y-1 text-xs text-gray-400">
                    <li>• Names starting with nakshatra syllables bring good fortune to the child</li>
                    <li>• Consider the meaning - positive meanings enhance the name's power</li>
                    <li>• The name should be easy to pronounce and remember</li>
                    <li>• Consult with elders and an astrologer for the final selection</li>
                </ul>
            </Card>
        </div>
    )
}
