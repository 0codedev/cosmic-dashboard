"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Badge } from "@/components/ui/badge"

interface HouseData {
    sign: string
    planets: string[]
    ruler: string
    meaning?: string
}

interface NorthIndianChartProps {
    houses: Record<number, HouseData>
    theme?: "light" | "dark"
    className?: string
    onHouseClick?: (houseId: number) => void
}

const parsePlanets = (planetStrings: string[]) => {
    return planetStrings.map(p => {
        const isRetro = p.toLowerCase().includes("retro") || p.includes("*")
        const isCombust = p.includes("^")
        const isVargottama = p.includes("□")
        // Clean name: remove special chars and generic " Retrograde" text
        let name = p.split("(")[0].replace(/[*^□]/g, "").trim()

        return { name, retro: isRetro, combust: isCombust, vargottama: isVargottama }
    })
}

// SVG Polygon Points for North Indian Chart (Diamond Layout)
const HOUSE_PATHS = {
    1: "50,50 25,25 50,0 75,25", // Top Diamond
    2: "25,25 0,0 50,0",          // Top Left Triangle
    3: "25,25 0,0 0,50",          // Left Top Triangle
    4: "50,50 25,25 0,50 25,75",  // Left Diamond
    5: "0,50 0,100 25,75",        // Left Bottom Triangle
    6: "0,100 25,75 50,100",      // Bottom Left Triangle
    7: "50,50 25,75 50,100 75,75",// Bottom Diamond
    8: "50,100 75,75 100,100",    // Bottom Right Triangle
    9: "75,75 100,50 100,100",    // Right Bottom Triangle
    10: "50,50 75,75 100,50 75,25",// Right Diamond
    11: "100,50 100,0 75,25",     // Right Top Triangle
    12: "75,25 100,0 50,0",       // Top Right Triangle
}

// Text Label Positions (Approximate centers)
const HOUSE_CENTERS = {
    1: { x: 50, y: 25 },
    2: { x: 25, y: 12 },
    3: { x: 12, y: 25 },
    4: { x: 25, y: 50 },
    5: { x: 12, y: 75 },
    6: { x: 25, y: 88 },
    7: { x: 50, y: 75 },
    8: { x: 75, y: 88 },
    9: { x: 88, y: 75 },
    10: { x: 75, y: 50 },
    11: { x: 88, y: 25 },
    12: { x: 75, y: 12 },
}

const SIGN_NUMBERS: Record<string, number> = {
    "Aries": 1, "Taurus": 2, "Gemini": 3, "Cancer": 4,
    "Leo": 5, "Virgo": 6, "Libra": 7, "Scorpio": 8,
    "Sagittarius": 9, "Capricorn": 10, "Aquarius": 11, "Pisces": 12
}

const PLANET_SYMBOLS: Record<string, string> = {
    "Sun": "Su", "Moon": "Mo", "Mars": "Ma", "Mercury": "Me",
    "Jupiter": "Ju", "Venus": "Ve", "Saturn": "Sa", "Rahu": "Ra", "Ketu": "Ke", "Neptune": "Ne", "Uranus": "Ur", "Pluto": "Pl"
}

export default function NorthIndianChart({
    houses,
    theme = "dark",
    className = "",
    onHouseClick
}: NorthIndianChartProps) {
    const [hoveredHouse, setHoveredHouse] = useState<number | null>(null)

    // Premium Theme Colors
    const colors = theme === "dark" ? {
        stroke: "#eab308", // gold-500
        fill: "#1e1b4b",   // indigo-950
        fillHover: "#312e81", // indigo-900
        text: "#fbbf24",   // amber-400
        textSec: "#94a3b8", // slate-400
        bg: "bg-slate-900/90",
        border: "border-amber-500/30",
        signNum: "rgba(234, 179, 8, 0.4)"
    } : {
        stroke: "#d97706",
        fill: "#fffbeb",
        fillHover: "#fde68a",
        text: "#92400e",
        textSec: "#78350f",
        bg: "bg-white/90",
        border: "border-amber-500/30",
        signNum: "rgba(217, 119, 6, 0.3)"
    }

    return (
        <div className={`aspect-square w-full relative ${className}`}>
            {/* Container with shadow and border to look like a card */}
            <div className="w-full h-full rounded-xl overflow-hidden shadow-2xl border border-amber-500/20 bg-slate-950/50 backdrop-blur-sm p-4">

                <svg viewBox="0 0 100 100" className="w-full h-full filter drop-shadow-lg">
                    <defs>
                        <filter id="glow">
                            <feGaussianBlur stdDeviation="0.3" result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                        <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#FCD34D" />
                            <stop offset="50%" stopColor="#F59E0B" />
                            <stop offset="100%" stopColor="#D97706" />
                        </linearGradient>
                    </defs>

                    {/* Background Rect */}
                    <rect x="0" y="0" width="100" height="100" fill={colors.fill} stroke="none" />

                    {/* Houses */}
                    {Object.entries(HOUSE_PATHS).map(([id, points]) => {
                        const houseId = Number(id)
                        const data = houses[houseId]
                        const isHovered = hoveredHouse === houseId
                        const center = HOUSE_CENTERS[houseId as keyof typeof HOUSE_CENTERS]
                        const signNum = SIGN_NUMBERS[data.sign] || 0
                        const planets = parsePlanets(data.planets)

                        return (
                            <g
                                key={houseId}
                                onClick={() => onHouseClick?.(houseId)}
                                onMouseEnter={() => setHoveredHouse(houseId)}
                                onMouseLeave={() => setHoveredHouse(null)}
                                className="cursor-pointer transition-all duration-300"
                            >
                                {/* House Shape */}
                                <polygon
                                    points={points}
                                    fill={isHovered ? colors.fillHover : 'transparent'}
                                    stroke="url(#goldGradient)"
                                    strokeWidth="0.4"
                                    className="transition-colors duration-300"
                                />

                                {/* Sign Number - Large & Faded Background */}
                                <text
                                    x={center.x}
                                    y={center.y + (houseId === 1 || houseId === 4 || houseId === 7 || houseId === 10 ? 0 : 0)}
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                    fontSize="12"
                                    fill={colors.signNum}
                                    fontWeight="bold"
                                    style={{ pointerEvents: 'none', userSelect: 'none' }}
                                >
                                    {signNum}
                                </text>

                                {/* Planets - Stacked */}
                                {planets.length > 0 && (
                                    <g transform={`translate(${center.x}, ${center.y})`}>
                                        {planets.map((planet, idx) => {
                                            // Adjust stacking to center vertically based on count
                                            // lineHeight = 4
                                            const totalHeight = (planets.length - 1) * 4
                                            const startY = -totalHeight / 2
                                            const yOffset = startY + (idx * 4) + 0.5 // small nudge

                                            return (
                                                <text
                                                    key={idx}
                                                    x="0"
                                                    y={yOffset}
                                                    textAnchor="middle"
                                                    dominantBaseline="middle"
                                                    fontSize="3.2"
                                                    fill={colors.text} // Amber/Gold text
                                                    fontWeight="700"
                                                    filter="url(#glow)"
                                                >
                                                    {PLANET_SYMBOLS[planet.name] || planet.name.slice(0, 2)}
                                                    {planet.retro && <tspan fontSize="2.5" dy="-1" fill="#ef4444">*</tspan>}
                                                </text>
                                            )
                                        })}
                                    </g>
                                )}
                            </g>
                        )
                    })}
                </svg>

                {/* Floating Tooltip */}
                <AnimatePresence>
                    {hoveredHouse && houses[hoveredHouse] && (
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-48 p-3 rounded-xl shadow-2xl backdrop-blur-md border ${colors.border} ${colors.bg}`}
                        >
                            <div className="flex items-center justify-between mb-2 pb-2 border-b border-amber-500/20">
                                <span className="text-xs font-bold uppercase tracking-wider text-amber-500">
                                    House {hoveredHouse}
                                </span>
                                <Badge variant="outline" className="text-[10px] h-5 border-amber-500/40 text-amber-200">
                                    {houses[hoveredHouse].sign}
                                </Badge>
                            </div>

                            <div className="space-y-1.5 text-xs">
                                <div className="flex justify-between text-gray-300">
                                    <span>Ruler</span>
                                    <span className="font-semibold text-amber-100">{houses[hoveredHouse].ruler}</span>
                                </div>

                                {(houses[hoveredHouse] as any).strength && (
                                    <div className="flex justify-between text-gray-300">
                                        <span>Strength</span>
                                        <span className={`font-semibold capitalize ${(houses[hoveredHouse] as any).strength === 'excellent' ? 'text-emerald-400' :
                                            (houses[hoveredHouse] as any).strength === 'challenging' ? 'text-red-400' : 'text-amber-100'
                                            }`}>
                                            {(houses[hoveredHouse] as any).strength}
                                        </span>
                                    </div>
                                )}

                                {(houses[hoveredHouse].planets.length > 0) ? (
                                    <div className="pt-2 mt-1">
                                        <div className="flex flex-wrap gap-1.5">
                                            {houses[hoveredHouse].planets.map((p, i) => (
                                                <div key={i} className="flex items-center gap-1 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                                                    <span className="text-amber-200 font-medium">{p}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <p className="opacity-40 italic mt-1 text-[10px] text-center">Empty House</p>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}
