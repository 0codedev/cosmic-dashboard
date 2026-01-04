"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Hash, Sparkles, Star, Calendar } from "lucide-react"
import { SUDHANSHU_DATA } from "@/data/user-data"

// Numerology calculation utilities
function reduceToSingleDigit(num: number): number {
    while (num > 9 && num !== 11 && num !== 22 && num !== 33) {
        num = String(num).split('').reduce((acc, digit) => acc + parseInt(digit), 0)
    }
    return num
}

function calculateLifePathNumber(dateStr: string): number {
    // Parse date like "14 October 2005"
    const parts = dateStr.split(' ')
    const day = parseInt(parts[0])
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December']
    const month = monthNames.indexOf(parts[1]) + 1
    const year = parseInt(parts[2])

    const dayReduced = reduceToSingleDigit(day)
    const monthReduced = reduceToSingleDigit(month)
    const yearReduced = reduceToSingleDigit(year)

    return reduceToSingleDigit(dayReduced + monthReduced + yearReduced)
}

function calculateDestinyNumber(name: string): number {
    const letterValues: { [key: string]: number } = {
        a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8, i: 9,
        j: 1, k: 2, l: 3, m: 4, n: 5, o: 6, p: 7, q: 8, r: 9,
        s: 1, t: 2, u: 3, v: 4, w: 5, x: 6, y: 7, z: 8
    }

    const sum = name.toLowerCase()
        .split('')
        .filter(char => letterValues[char])
        .reduce((acc, char) => acc + letterValues[char], 0)

    return reduceToSingleDigit(sum)
}

function calculatePersonalYear(dob: string): number {
    const parts = dob.split(' ')
    const day = parseInt(parts[0])
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December']
    const month = monthNames.indexOf(parts[1]) + 1
    const currentYear = new Date().getFullYear()

    const dayReduced = reduceToSingleDigit(day)
    const monthReduced = reduceToSingleDigit(month)
    const yearReduced = reduceToSingleDigit(currentYear)

    return reduceToSingleDigit(dayReduced + monthReduced + yearReduced)
}

function calculateBirthDayNumber(dateStr: string): number {
    const day = parseInt(dateStr.split(' ')[0])
    return reduceToSingleDigit(day)
}

function getLuckyColors(lifePathNum: number): string[] {
    const colorMap: { [key: number]: string[] } = {
        1: ['Red', 'Orange', 'Gold'],
        2: ['White', 'Green', 'Cream'],
        3: ['Yellow', 'Purple', 'Violet'],
        4: ['Blue', 'Grey', 'Electric Blue'],
        5: ['Light Grey', 'White', 'Silver'],
        6: ['Pink', 'Blue', 'Green'],
        7: ['Violet', 'Purple', 'Sea Green'],
        8: ['Dark Blue', 'Black', 'Brown'],
        9: ['Red', 'Pink', 'Maroon'],
        11: ['Silver', 'White', 'Violet'],
        22: ['Coral', 'Cream', 'White'],
        33: ['Turquoise', 'Green', 'Pink']
    }
    return colorMap[lifePathNum] || ['Blue', 'White', 'Green']
}

function getLifePathMeaning(num: number): { title: string; description: string } {
    const meanings: { [key: number]: { title: string; description: string } } = {
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
        33: { title: "The Master Teacher", description: "Selfless, devoted, uplifting. Healing presence with powerful compassion." }
    }
    return meanings[num] || { title: "Unique Path", description: "Your numerology reveals a unique life journey." }
}

function getPersonalYearMeaning(year: number): string {
    const meanings: { [key: number]: string } = {
        1: "New beginnings, fresh starts, planting seeds",
        2: "Partnerships, patience, cooperation needed",
        3: "Creativity, self-expression, social expansion",
        4: "Hard work, building foundations, discipline",
        5: "Change, freedom, adventure, unexpected turns",
        6: "Responsibility, family, love, domestic focus",
        7: "Reflection, spirituality, rest, inner growth",
        8: "Achievement, success, material rewards, power",
        9: "Completion, endings, letting go, humanitarianism"
    }
    return meanings[year] || "A year of personal growth and transformation"
}

export default function NumerologyWidget() {
    const lifePathNumber = calculateLifePathNumber(SUDHANSHU_DATA.dob)
    const destinyNumber = calculateDestinyNumber(SUDHANSHU_DATA.name)
    const personalYear = calculatePersonalYear(SUDHANSHU_DATA.dob)
    const birthDayNumber = calculateBirthDayNumber(SUDHANSHU_DATA.dob)
    const lifePathMeaning = getLifePathMeaning(lifePathNumber)
    const luckyColors = getLuckyColors(lifePathNumber)
    const personalYearMeaning = getPersonalYearMeaning(personalYear)

    const luckyNumbers = [lifePathNumber, destinyNumber, birthDayNumber]
        .filter((v, i, a) => a.indexOf(v) === i) // Remove duplicates
        .slice(0, 4)

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
                    {/* Life Path Number */}
                    <div className="text-center p-4 bg-slate-800/30 rounded-xl border border-violet-500/20">
                        <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-lg shadow-violet-500/30">
                            {lifePathNumber}
                        </div>
                        <h4 className="font-semibold text-violet-300 text-sm">Life Path</h4>
                        <p className="text-xs text-violet-400 mt-1">{lifePathMeaning.title}</p>
                    </div>

                    {/* Destiny Number */}
                    <div className="text-center p-4 bg-slate-800/30 rounded-xl border border-cyan-500/20">
                        <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-lg shadow-cyan-500/30">
                            {destinyNumber}
                        </div>
                        <h4 className="font-semibold text-cyan-300 text-sm">Destiny</h4>
                        <p className="text-xs text-cyan-400 mt-1">Expression Number</p>
                    </div>

                    {/* Personal Year */}
                    <div className="text-center p-4 bg-slate-800/30 rounded-xl border border-yellow-500/20">
                        <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-lg shadow-yellow-500/30">
                            {personalYear}
                        </div>
                        <h4 className="font-semibold text-yellow-300 text-sm">Personal Year</h4>
                        <p className="text-xs text-yellow-400 mt-1">Current Cycle</p>
                    </div>

                    {/* Birthday Number */}
                    <div className="text-center p-4 bg-slate-800/30 rounded-xl border border-pink-500/20">
                        <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-pink-500 to-rose-600 rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-lg shadow-pink-500/30">
                            {birthDayNumber}
                        </div>
                        <h4 className="font-semibold text-pink-300 text-sm">Birthday</h4>
                        <p className="text-xs text-pink-400 mt-1">Talent Number</p>
                    </div>
                </div>

                {/* Description Section */}
                <div className="mt-6 grid md:grid-cols-2 gap-4">
                    <div className="bg-slate-800/20 rounded-lg p-4 border border-violet-500/10">
                        <div className="flex items-center mb-2">
                            <Sparkles className="w-4 h-4 text-violet-400 mr-2" />
                            <h5 className="font-semibold text-sm text-violet-300">Your Life Path: {lifePathMeaning.title}</h5>
                        </div>
                        <p className="text-xs text-gray-400">{lifePathMeaning.description}</p>
                    </div>

                    <div className="bg-slate-800/20 rounded-lg p-4 border border-yellow-500/10">
                        <div className="flex items-center mb-2">
                            <Calendar className="w-4 h-4 text-yellow-400 mr-2" />
                            <h5 className="font-semibold text-sm text-yellow-300">Personal Year {personalYear}</h5>
                        </div>
                        <p className="text-xs text-gray-400">{personalYearMeaning}</p>
                    </div>
                </div>

                {/* Lucky Numbers & Colors */}
                <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-400">Lucky Numbers:</span>
                        <div className="flex space-x-1">
                            {luckyNumbers.map((num, i) => (
                                <Badge key={i} className="bg-violet-500/20 text-violet-400 border-violet-500/30 px-2 py-0.5">
                                    {num}
                                </Badge>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-400">Lucky Colors:</span>
                        <div className="flex space-x-1">
                            {luckyColors.map((color, i) => (
                                <Badge key={i} className="bg-slate-700/50 text-gray-300 border-slate-600/50 px-2 py-0.5 text-xs">
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
