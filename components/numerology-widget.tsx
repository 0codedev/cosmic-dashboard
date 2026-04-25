"use client"

import { useMemo } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Hash, Sparkles, Calendar } from "lucide-react"
import { useResolvedUserData } from "@/contexts/user-context"

function reduceToSingleDigit(num: number): number {
    while (num > 9 && num !== 11 && num !== 22 && num !== 33) {
        num = String(num).split("").reduce((acc, digit) => acc + parseInt(digit, 10), 0)
    }
    return num
}

function parseDob(dateStr: string) {
    let day = 0
    let month = 0
    let year = 0

    if (dateStr.includes("/")) {
        const parts = dateStr.split("/")
        day = parseInt(parts[0], 10)
        month = parseInt(parts[1], 10)
        year = parseInt(parts[2], 10)
    } else {
        const parts = dateStr.split(" ")
        day = parseInt(parts[0], 10)
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
        month = monthNames.indexOf(parts[1]) + 1
        year = parseInt(parts[2], 10)
    }

    return { day, month, year }
}

function calculateLifePathNumber(dateStr: string): number {
    const { day, month, year } = parseDob(dateStr)
    if (isNaN(day) || isNaN(month) || isNaN(year)) return 0
    return reduceToSingleDigit(reduceToSingleDigit(day) + reduceToSingleDigit(month) + reduceToSingleDigit(year))
}

function calculateDestinyNumber(name: string): number {
    const letterValues: Record<string, number> = {
        a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8, i: 9,
        j: 1, k: 2, l: 3, m: 4, n: 5, o: 6, p: 7, q: 8, r: 9,
        s: 1, t: 2, u: 3, v: 4, w: 5, x: 6, y: 7, z: 8,
    }

    const sum = name.toLowerCase()
        .split("")
        .filter((char) => letterValues[char])
        .reduce((acc, char) => acc + letterValues[char], 0)

    return reduceToSingleDigit(sum)
}

function calculatePersonalYear(dob: string): number {
    const { day, month } = parseDob(dob)
    const currentYear = new Date().getFullYear()
    if (isNaN(day) || isNaN(month)) return 0
    return reduceToSingleDigit(reduceToSingleDigit(day) + reduceToSingleDigit(month) + reduceToSingleDigit(currentYear))
}

function calculateBirthDayNumber(dateStr: string): number {
    const { day } = parseDob(dateStr)
    return reduceToSingleDigit(day)
}

function getLuckyColors(lifePathNum: number): string[] {
    const colorMap: Record<number, string[]> = {
        1: ["Red", "Orange", "Gold"],
        2: ["White", "Green", "Cream"],
        3: ["Yellow", "Purple", "Violet"],
        4: ["Blue", "Grey", "Electric Blue"],
        5: ["Light Grey", "White", "Silver"],
        6: ["Pink", "Blue", "Green"],
        7: ["Violet", "Purple", "Sea Green"],
        8: ["Dark Blue", "Black", "Brown"],
        9: ["Red", "Pink", "Maroon"],
        11: ["Silver", "White", "Violet"],
        22: ["Coral", "Cream", "White"],
        33: ["Turquoise", "Green", "Pink"],
    }
    return colorMap[lifePathNum] || ["Blue", "White", "Green"]
}

function getLifePathMeaning(num: number): { title: string; description: string } {
    const meanings: Record<number, { title: string; description: string }> = {
        1: { title: "The Leader", description: "Independent, pioneering, ambitious. Natural leader with innovative ideas." },
        2: { title: "The Diplomat", description: "Cooperative, sensitive, balanced. Natural peacemaker with intuitive gifts." },
        3: { title: "The Communicator", description: "Creative, expressive, optimistic. Born entertainer with artistic talent." },
        4: { title: "The Builder", description: "Practical, organized, reliable. Foundation layer with strong work ethic." },
        5: { title: "The Freedom Seeker", description: "Adventurous, versatile, dynamic. Change agent with magnetic personality." },
        6: { title: "The Nurturer", description: "Responsible, caring, harmonious. Natural healer and counselor." },
        7: { title: "The Seeker", description: "Analytical, spiritual, introspective. Truth seeker with mystical interests." },
        8: { title: "The Achiever", description: "Ambitious, authoritative, successful. Material master with business acumen." },
        9: { title: "The Humanitarian", description: "Compassionate, generous, idealistic. Global thinker serving humanity." },
        11: { title: "The Illuminator", description: "Intuitive, inspired, visionary. Master number bringing spiritual insight." },
        22: { title: "The Master Builder", description: "Practical visionary, powerful, disciplined. Turns dreams into reality." },
        33: { title: "The Master Teacher", description: "Selfless, devoted, uplifting. Healing presence with powerful compassion." },
    }
    return meanings[num] || { title: "Unique Path", description: "Your numerology reveals a unique life journey." }
}

function getPersonalYearMeaning(year: number): string {
    const meanings: Record<number, string> = {
        1: "New beginnings, fresh starts, planting seeds",
        2: "Partnerships, patience, cooperation needed",
        3: "Creativity, self-expression, social expansion",
        4: "Hard work, building foundations, discipline",
        5: "Change, freedom, adventure, unexpected turns",
        6: "Responsibility, family, love, domestic focus",
        7: "Reflection, spirituality, rest, inner growth",
        8: "Achievement, success, material rewards, power",
        9: "Completion, endings, letting go, humanitarianism",
    }
    return meanings[year] || "A year of personal growth and transformation"
}

export default function NumerologyWidget() {
    const user = useResolvedUserData()

    const numerology = useMemo(() => {
        const lifePathNumber = calculateLifePathNumber(user.dob)
        const destinyNumber = calculateDestinyNumber(user.name)
        const personalYear = calculatePersonalYear(user.dob)
        const birthDayNumber = calculateBirthDayNumber(user.dob)
        const lifePathMeaning = getLifePathMeaning(lifePathNumber)
        const luckyColors = getLuckyColors(lifePathNumber)
        const personalYearMeaning = getPersonalYearMeaning(personalYear)
        const luckyNumbers = [lifePathNumber, destinyNumber, birthDayNumber]
            .filter((value, index, values) => values.indexOf(value) === index)
            .slice(0, 4)

        return {
            birthDayNumber,
            destinyNumber,
            lifePathMeaning,
            lifePathNumber,
            luckyColors,
            luckyNumbers,
            personalYear,
            personalYearMeaning,
        }
    }, [user.dob, user.name])

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
        >
            <Card className="bg-gradient-to-br from-violet-900/30 via-slate-900/50 to-indigo-900/30 border-violet-500/30 p-6 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-violet-400 flex items-center">
                        <Hash className="w-5 h-5 mr-2" />
                        Numerology Insights
                    </h3>
                    <Badge className="bg-violet-500/20 text-violet-400 border-violet-500/30">
                        {new Date().getFullYear()}
                    </Badge>
                </div>

                <div className="grid md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-slate-800/30 rounded-xl border border-violet-500/20">
                        <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-lg shadow-violet-500/30">
                            {numerology.lifePathNumber}
                        </div>
                        <h4 className="font-semibold text-violet-300 text-sm">Life Path</h4>
                        <p className="text-xs text-violet-400 mt-1">{numerology.lifePathMeaning.title}</p>
                    </div>

                    <div className="text-center p-4 bg-slate-800/30 rounded-xl border border-cyan-500/20">
                        <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-lg shadow-cyan-500/30">
                            {numerology.destinyNumber}
                        </div>
                        <h4 className="font-semibold text-cyan-300 text-sm">Destiny</h4>
                        <p className="text-xs text-cyan-400 mt-1">Expression Number</p>
                    </div>

                    <div className="text-center p-4 bg-slate-800/30 rounded-xl border border-yellow-500/20">
                        <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-lg shadow-yellow-500/30">
                            {numerology.personalYear}
                        </div>
                        <h4 className="font-semibold text-yellow-300 text-sm">Personal Year</h4>
                        <p className="text-xs text-yellow-400 mt-1">Current Cycle</p>
                    </div>

                    <div className="text-center p-4 bg-slate-800/30 rounded-xl border border-pink-500/20">
                        <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-pink-500 to-rose-600 rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-lg shadow-pink-500/30">
                            {numerology.birthDayNumber}
                        </div>
                        <h4 className="font-semibold text-pink-300 text-sm">Birthday</h4>
                        <p className="text-xs text-pink-400 mt-1">Talent Number</p>
                    </div>
                </div>

                <div className="mt-6 grid md:grid-cols-2 gap-4">
                    <div className="bg-slate-800/20 rounded-lg p-4 border border-violet-500/10">
                        <div className="flex items-center mb-2">
                            <Sparkles className="w-4 h-4 text-violet-400 mr-2" />
                            <h5 className="font-semibold text-sm text-violet-300">Your Life Path: {numerology.lifePathMeaning.title}</h5>
                        </div>
                        <p className="text-xs text-gray-400">{numerology.lifePathMeaning.description}</p>
                    </div>

                    <div className="bg-slate-800/20 rounded-lg p-4 border border-yellow-500/10">
                        <div className="flex items-center mb-2">
                            <Calendar className="w-4 h-4 text-yellow-400 mr-2" />
                            <h5 className="font-semibold text-sm text-yellow-300">Personal Year {numerology.personalYear}</h5>
                        </div>
                        <p className="text-xs text-gray-400">{numerology.personalYearMeaning}</p>
                    </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-400">Lucky Numbers:</span>
                        <div className="flex space-x-1">
                            {numerology.luckyNumbers.map((num, index) => (
                                <Badge key={index} className="bg-violet-500/20 text-violet-400 border-violet-500/30 px-2 py-0.5">
                                    {num}
                                </Badge>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-400">Lucky Colors:</span>
                        <div className="flex space-x-1">
                            {numerology.luckyColors.map((color, index) => (
                                <Badge key={index} className="bg-slate-700/50 text-gray-300 border-slate-600/50 px-2 py-0.5 text-xs">
                                    {color}
                                </Badge>
                            ))}
                        </div>
                    </div>
                </div>
            </Card>
        </motion.div>
    )
}
