"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Sparkles, Star, ArrowRight, Loader2 } from "lucide-react"
import { useUser } from "@/contexts/user-context"
import { calculateBirthChart } from "@/lib/cosmic-engine"
import CosmicBackground from "@/components/cosmic-background"

export default function LandingPage() {
    const { setUserData, setIsLoading, isLoading } = useUser()
    const [formData, setFormData] = useState({
        name: "",
        date: "",
        time: "",
        location: "Hyderabad, India", // Default for ease
    })

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            // Logic to convert simple string location to lat/long would go here
            const data = await calculateBirthChart({
                ...formData,
                latitude: 17.385, // Mock lat
                longitude: 78.486 // Mock long
            })

            setUserData(data)
        } catch (error) {
            console.error("Calculation failed", error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 relative overflow-hidden">
            <CosmicBackground />

            <div className="relative z-10 w-full max-w-md px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <div className="w-20 h-20 bg-gradient-to-tr from-cyan-400 to-purple-500 rounded-full mx-auto flex items-center justify-center mb-6 shadow-lg shadow-purple-500/30">
                        <Star className="w-10 h-10 text-white fill-current" />
                    </div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-cyan-200 to-purple-200 bg-clip-text text-transparent mb-2">
                        Cosmic Path
                    </h1>
                    <p className="text-slate-400">Discover your celestial blueprint</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="bg-slate-900/50 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl"
                >
                    <form onSubmit={handleGenerate} className="space-y-6">
                        <div className="space-y-2">
                            <Label className="text-cyan-200">Full Name</Label>
                            <Input
                                placeholder="Enter your name"
                                className="bg-slate-800/50 border-slate-700 focus:border-cyan-500 text-white"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-purple-200">Date of Birth</Label>
                                <Input
                                    type="date"
                                    className="bg-slate-800/50 border-slate-700 focus:border-purple-500 text-white"
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-purple-200">Time</Label>
                                <Input
                                    type="time"
                                    className="bg-slate-800/50 border-slate-700 focus:border-purple-500 text-white"
                                    value={formData.time}
                                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-pink-200">Place of Birth</Label>
                            <Input
                                placeholder="City, Country"
                                className="bg-slate-800/50 border-slate-700 focus:border-pink-500 text-white"
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                required
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-bold py-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02]"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <span className="flex items-center">
                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                    Aligning Stars...
                                </span>
                            ) : (
                                <span className="flex items-center">
                                    Reveal My Destiny <ArrowRight className="w-5 h-5 ml-2" />
                                </span>
                            )}
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-xs text-slate-500">
                            Calculated using Lahiri Ayanamsha • Privacy Focused
                        </p>
                        <div onClick={() => setFormData({ name: "Sudhanshu Gaddam", date: "2005-10-14", time: "15:33", location: "Hyderabad, India" })} className="mt-4 text-xs text-cyan-500/50 hover:text-cyan-400 cursor-pointer transition-colors">
                            [Demo Mode: Load Sudhanshu]
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
