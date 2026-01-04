"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
    GraduationCap,
    BookOpen,
    Star,
    CheckCircle2,
    Lock,
    Play,
    ChevronRight,
    Award,
    Sparkles
} from "lucide-react"

interface Lesson {
    id: string
    title: string
    description: string
    duration: string
    level: "beginner" | "intermediate" | "advanced"
    completed: boolean
    locked: boolean
}

interface Course {
    id: string
    title: string
    description: string
    icon: React.ReactNode
    color: string
    lessons: Lesson[]
    progress: number
}

const COURSES: Course[] = [
    {
        id: "fundamentals",
        title: "Astrology Fundamentals",
        description: "Learn the basics of Vedic astrology",
        icon: <Star className="w-5 h-5" />,
        color: "amber",
        progress: 60,
        lessons: [
            { id: "f1", title: "What is Vedic Astrology?", description: "Introduction to Jyotish Shastra", duration: "5 min", level: "beginner", completed: true, locked: false },
            { id: "f2", title: "The Birth Chart (Kundli)", description: "Understanding your cosmic blueprint", duration: "8 min", level: "beginner", completed: true, locked: false },
            { id: "f3", title: "Houses & Their Meanings", description: "12 houses and their significance", duration: "10 min", level: "beginner", completed: true, locked: false },
            { id: "f4", title: "Planetary Strengths", description: "Exaltation, debilitation, and dignity", duration: "12 min", level: "beginner", completed: false, locked: false },
            { id: "f5", title: "Aspects & Conjunctions", description: "How planets influence each other", duration: "15 min", level: "beginner", completed: false, locked: true },
        ]
    },
    {
        id: "planets",
        title: "The Nine Planets (Navagraha)",
        description: "Deep dive into planetary energies",
        icon: <Sparkles className="w-5 h-5" />,
        color: "purple",
        progress: 30,
        lessons: [
            { id: "p1", title: "Sun (Surya) - The Soul", description: "Authority, father, vitality", duration: "8 min", level: "beginner", completed: true, locked: false },
            { id: "p2", title: "Moon (Chandra) - The Mind", description: "Emotions, mother, intuition", duration: "8 min", level: "beginner", completed: true, locked: false },
            { id: "p3", title: "Mars (Mangal) - The Warrior", description: "Courage, energy, passion", duration: "8 min", level: "beginner", completed: false, locked: false },
            { id: "p4", title: "Mercury (Budh) - The Messenger", description: "Communication, intellect, trade", duration: "8 min", level: "beginner", completed: false, locked: true },
            { id: "p5", title: "Jupiter (Guru) - The Teacher", description: "Wisdom, expansion, blessings", duration: "8 min", level: "intermediate", completed: false, locked: true },
            { id: "p6", title: "Venus (Shukra) - The Artist", description: "Love, beauty, luxury", duration: "8 min", level: "intermediate", completed: false, locked: true },
            { id: "p7", title: "Saturn (Shani) - The Judge", description: "Karma, discipline, time", duration: "10 min", level: "intermediate", completed: false, locked: true },
            { id: "p8", title: "Rahu - The North Node", description: "Desires, illusion, obsession", duration: "10 min", level: "advanced", completed: false, locked: true },
            { id: "p9", title: "Ketu - The South Node", description: "Spirituality, detachment, past life", duration: "10 min", level: "advanced", completed: false, locked: true },
        ]
    },
    {
        id: "signs",
        title: "The Twelve Signs (Rashis)",
        description: "Explore zodiac characteristics",
        icon: <BookOpen className="w-5 h-5" />,
        color: "cyan",
        progress: 0,
        lessons: [
            { id: "s1", title: "Aries to Virgo", description: "First six signs of the zodiac", duration: "15 min", level: "beginner", completed: false, locked: false },
            { id: "s2", title: "Libra to Pisces", description: "Last six signs of the zodiac", duration: "15 min", level: "beginner", completed: false, locked: true },
            { id: "s3", title: "Elements & Modalities", description: "Fire, Earth, Air, Water signs", duration: "10 min", level: "intermediate", completed: false, locked: true },
            { id: "s4", title: "Sign Compatibility", description: "Natural friendships and conflicts", duration: "12 min", level: "intermediate", completed: false, locked: true },
        ]
    },
    {
        id: "dasha",
        title: "Dasha System (Timing)",
        description: "Predict life events with Mahadasha",
        icon: <Award className="w-5 h-5" />,
        color: "green",
        progress: 0,
        lessons: [
            { id: "d1", title: "What is Vimshottari Dasha?", description: "120-year planetary periods", duration: "10 min", level: "intermediate", completed: false, locked: false },
            { id: "d2", title: "Mahadasha Effects", description: "Major period interpretations", duration: "15 min", level: "intermediate", completed: false, locked: true },
            { id: "d3", title: "Antardasha & Pratyantar", description: "Sub-periods and sub-sub-periods", duration: "12 min", level: "advanced", completed: false, locked: true },
            { id: "d4", title: "Transit Effects", description: "Current planetary movements", duration: "15 min", level: "advanced", completed: false, locked: true },
        ]
    }
]

export default function LearningAcademy() {
    const [selectedCourse, setSelectedCourse] = useState<string | null>("fundamentals")
    const [selectedLesson, setSelectedLesson] = useState<string | null>(null)

    const currentCourse = COURSES.find(c => c.id === selectedCourse)
    const totalCompleted = COURSES.reduce((sum, c) => sum + c.lessons.filter(l => l.completed).length, 0)
    const totalLessons = COURSES.reduce((sum, c) => sum + c.lessons.length, 0)

    const getLevelColor = (level: string) => {
        switch (level) {
            case "beginner": return "bg-green-500/20 text-green-400"
            case "intermediate": return "bg-amber-500/20 text-amber-400"
            case "advanced": return "bg-red-500/20 text-red-400"
            default: return "bg-gray-500/20 text-gray-400"
        }
    }

    const getCourseColor = (color: string) => {
        return `from-${color}-900/30 to-slate-900/50 border-${color}-500/30`
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <Card className="bg-gradient-to-br from-slate-900/50 to-indigo-900/30 border-indigo-500/30 p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-indigo-500/20 rounded-full">
                            <GraduationCap className="w-6 h-6 text-indigo-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">Astrology Academy</h2>
                            <p className="text-sm text-gray-400">Learn Vedic astrology step by step</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-2xl font-bold text-indigo-400">{totalCompleted}/{totalLessons}</div>
                        <div className="text-xs text-gray-400">Lessons Completed</div>
                    </div>
                </div>

                {/* Overall Progress */}
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Overall Progress</span>
                        <span className="text-indigo-400">{Math.round((totalCompleted / totalLessons) * 100)}%</span>
                    </div>
                    <Progress value={(totalCompleted / totalLessons) * 100} className="h-2" />
                </div>
            </Card>

            {/* Course Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {COURSES.map((course) => (
                    <motion.div
                        key={course.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <Card
                            className={`p-4 cursor-pointer transition-all ${selectedCourse === course.id
                                    ? `bg-gradient-to-br ${getCourseColor(course.color)} ring-2 ring-${course.color}-400`
                                    : 'bg-slate-800/50 border-purple-500/20 hover:border-purple-500/50'
                                }`}
                            onClick={() => setSelectedCourse(course.id)}
                        >
                            <div className={`p-2 bg-${course.color}-500/20 rounded-lg w-fit mb-3 text-${course.color}-400`}>
                                {course.icon}
                            </div>
                            <h3 className="font-semibold text-white text-sm mb-1">{course.title}</h3>
                            <p className="text-xs text-gray-400 mb-3">{course.description}</p>

                            <div className="space-y-1">
                                <div className="flex justify-between text-xs">
                                    <span className="text-gray-500">{course.lessons.length} lessons</span>
                                    <span className={`text-${course.color}-400`}>{course.progress}%</span>
                                </div>
                                <Progress value={course.progress} className="h-1" />
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Lesson List */}
            {currentCourse && (
                <Card className="bg-slate-800/50 border-purple-500/20 p-6">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        {currentCourse.icon}
                        {currentCourse.title}
                    </h3>

                    <div className="space-y-2">
                        {currentCourse.lessons.map((lesson, idx) => (
                            <motion.div
                                key={lesson.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className={`p-4 rounded-lg border transition-all ${lesson.locked
                                        ? 'bg-slate-900/50 border-slate-700 opacity-60'
                                        : lesson.completed
                                            ? 'bg-green-900/20 border-green-500/30'
                                            : 'bg-slate-900/30 border-purple-500/20 hover:border-purple-500/50 cursor-pointer'
                                    }`}
                                onClick={() => !lesson.locked && setSelectedLesson(lesson.id)}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${lesson.completed
                                                ? 'bg-green-500/20 text-green-400'
                                                : lesson.locked
                                                    ? 'bg-slate-700 text-slate-500'
                                                    : 'bg-purple-500/20 text-purple-400'
                                            }`}>
                                            {lesson.completed ? (
                                                <CheckCircle2 className="w-4 h-4" />
                                            ) : lesson.locked ? (
                                                <Lock className="w-4 h-4" />
                                            ) : (
                                                <Play className="w-4 h-4" />
                                            )}
                                        </div>
                                        <div>
                                            <h4 className={`font-medium ${lesson.locked ? 'text-gray-500' : 'text-white'}`}>
                                                {lesson.title}
                                            </h4>
                                            <p className="text-xs text-gray-500">{lesson.description}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <Badge className={getLevelColor(lesson.level)}>
                                            {lesson.level}
                                        </Badge>
                                        <span className="text-xs text-gray-500">{lesson.duration}</span>
                                        {!lesson.locked && <ChevronRight className="w-4 h-4 text-gray-500" />}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </Card>
            )}

            {/* Quick Tips */}
            <Card className="bg-gradient-to-br from-amber-900/20 to-slate-900/50 border-amber-500/20 p-4">
                <h4 className="text-sm font-medium text-amber-400 mb-2">💡 Learning Tip</h4>
                <p className="text-xs text-gray-400">
                    Start with the Fundamentals course to build a strong foundation. Each lesson includes
                    practical examples from your own birth chart to help you understand concepts better.
                </p>
            </Card>
        </div>
    )
}
