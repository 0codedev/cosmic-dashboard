"use client"

import { useState, useEffect, createContext, useContext, ReactNode } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { User, Plus, Edit, Trash2, Check, X, ChevronDown, Calendar, MapPin, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

// Profile type
export interface UserProfile {
    id: string
    name: string
    birthDate: string  // "Day Month Year" format
    birthTime: string  // "HH:MM" format
    birthPlace: string
    moonSign: string
    sunSign: string
    ascendant: string
    isDefault: boolean
    createdAt: Date
}

// Default Sudhanshu profile
const DEFAULT_PROFILE: UserProfile = {
    id: "sudhanshu-default",
    name: "Sudhanshu",
    birthDate: "14 October 2005",
    birthTime: "13:12",
    birthPlace: "Hyderabad, India",
    moonSign: "Aquarius",
    sunSign: "Libra",
    ascendant: "Aquarius",
    isDefault: true,
    createdAt: new Date(),
}

// Context
interface ProfileContextType {
    profiles: UserProfile[]
    activeProfile: UserProfile
    setActiveProfile: (id: string) => void
    addProfile: (profile: Omit<UserProfile, "id" | "createdAt" | "isDefault">) => void
    updateProfile: (id: string, updates: Partial<UserProfile>) => void
    deleteProfile: (id: string) => void
}

const ProfileContext = createContext<ProfileContextType | null>(null)

export function useProfiles() {
    const context = useContext(ProfileContext)
    if (!context) {
        throw new Error("useProfiles must be used within ProfileProvider")
    }
    return context
}

// Provider
export function ProfileProvider({ children }: { children: ReactNode }) {
    const [profiles, setProfiles] = useState<UserProfile[]>([DEFAULT_PROFILE])
    const [activeProfileId, setActiveProfileId] = useState<string>(DEFAULT_PROFILE.id)

    // Load from localStorage
    useEffect(() => {
        const saved = localStorage.getItem("user-profiles")
        const activeId = localStorage.getItem("active-profile-id")
        if (saved) {
            const parsed = JSON.parse(saved)
            setProfiles(parsed.length > 0 ? parsed : [DEFAULT_PROFILE])
        }
        if (activeId) {
            setActiveProfileId(activeId)
        }
    }, [])

    // Save to localStorage
    useEffect(() => {
        localStorage.setItem("user-profiles", JSON.stringify(profiles))
        localStorage.setItem("active-profile-id", activeProfileId)
    }, [profiles, activeProfileId])

    const activeProfile = profiles.find(p => p.id === activeProfileId) || profiles[0]

    const setActiveProfile = (id: string) => {
        setActiveProfileId(id)
    }

    const addProfile = (profile: Omit<UserProfile, "id" | "createdAt" | "isDefault">) => {
        const newProfile: UserProfile = {
            ...profile,
            id: crypto.randomUUID(),
            createdAt: new Date(),
            isDefault: false,
        }
        setProfiles(prev => [...prev, newProfile])
        return newProfile
    }

    const updateProfile = (id: string, updates: Partial<UserProfile>) => {
        setProfiles(prev =>
            prev.map(p => p.id === id ? { ...p, ...updates } : p)
        )
    }

    const deleteProfile = (id: string) => {
        const profile = profiles.find(p => p.id === id)
        if (profile?.isDefault) return // Can't delete default profile

        setProfiles(prev => prev.filter(p => p.id !== id))
        if (activeProfileId === id) {
            setActiveProfileId(profiles[0].id)
        }
    }

    return (
        <ProfileContext.Provider value={{
            profiles,
            activeProfile,
            setActiveProfile,
            addProfile,
            updateProfile,
            deleteProfile,
        }}>
            {children}
        </ProfileContext.Provider>
    )
}

// Profile Switcher component for header
export function ProfileSwitcher() {
    const { profiles, activeProfile, setActiveProfile } = useProfiles()
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2 text-gray-200 hover:text-white">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center">
                            <User className="w-4 h-4 text-white" />
                        </div>
                        <span className="hidden sm:block">{activeProfile.name}</span>
                        <ChevronDown className="w-4 h-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-slate-900 border-purple-500/30">
                    {profiles.map(profile => (
                        <DropdownMenuItem
                            key={profile.id}
                            onClick={() => setActiveProfile(profile.id)}
                            className={`flex items-center gap-2 ${profile.id === activeProfile.id ? 'bg-purple-500/20' : ''}`}
                        >
                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-400 to-cyan-400 flex items-center justify-center text-xs text-white">
                                {profile.name.charAt(0)}
                            </div>
                            <span>{profile.name}</span>
                            {profile.id === activeProfile.id && <Check className="w-4 h-4 ml-auto text-green-400" />}
                        </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator className="bg-gray-700" />
                    <DropdownMenuItem onClick={() => setIsAddDialogOpen(true)} className="text-cyan-400">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Family Member
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <AddProfileDialog
                isOpen={isAddDialogOpen}
                onClose={() => setIsAddDialogOpen(false)}
            />
        </>
    )
}

// Add Profile Dialog
function AddProfileDialog({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const { addProfile } = useProfiles()
    const [formData, setFormData] = useState({
        name: "",
        birthDate: "",
        birthTime: "",
        birthPlace: "",
        moonSign: "",
        sunSign: "",
        ascendant: "",
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (formData.name && formData.birthDate) {
            addProfile(formData)
            setFormData({
                name: "",
                birthDate: "",
                birthTime: "",
                birthPlace: "",
                moonSign: "",
                sunSign: "",
                ascendant: "",
            })
            onClose()
        }
    }

    const zodiacSigns = [
        "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
        "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
    ]

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-slate-900 border-purple-500/30 text-white max-w-md">
                <DialogHeader>
                    <DialogTitle>Add Family Member</DialogTitle>
                    <DialogDescription className="text-gray-400">
                        Add a family member to view their astrological profile.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label>Name *</Label>
                        <Input
                            value={formData.name}
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="Enter name"
                            className="bg-slate-800 border-gray-700"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Birth Date *</Label>
                            <Input
                                value={formData.birthDate}
                                onChange={(e) => setFormData(prev => ({ ...prev, birthDate: e.target.value }))}
                                placeholder="14 October 2005"
                                className="bg-slate-800 border-gray-700"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Birth Time</Label>
                            <Input
                                type="time"
                                value={formData.birthTime}
                                onChange={(e) => setFormData(prev => ({ ...prev, birthTime: e.target.value }))}
                                className="bg-slate-800 border-gray-700"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Birth Place</Label>
                        <Input
                            value={formData.birthPlace}
                            onChange={(e) => setFormData(prev => ({ ...prev, birthPlace: e.target.value }))}
                            placeholder="City, Country"
                            className="bg-slate-800 border-gray-700"
                        />
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                        <div className="space-y-2">
                            <Label className="text-xs">Moon Sign</Label>
                            <select
                                value={formData.moonSign}
                                onChange={(e) => setFormData(prev => ({ ...prev, moonSign: e.target.value }))}
                                className="w-full p-2 bg-slate-800 border border-gray-700 rounded-md text-sm"
                            >
                                <option value="">Select</option>
                                {zodiacSigns.map(sign => (
                                    <option key={sign} value={sign}>{sign}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs">Sun Sign</Label>
                            <select
                                value={formData.sunSign}
                                onChange={(e) => setFormData(prev => ({ ...prev, sunSign: e.target.value }))}
                                className="w-full p-2 bg-slate-800 border border-gray-700 rounded-md text-sm"
                            >
                                <option value="">Select</option>
                                {zodiacSigns.map(sign => (
                                    <option key={sign} value={sign}>{sign}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs">Ascendant</Label>
                            <select
                                value={formData.ascendant}
                                onChange={(e) => setFormData(prev => ({ ...prev, ascendant: e.target.value }))}
                                className="w-full p-2 bg-slate-800 border border-gray-700 rounded-md text-sm"
                            >
                                <option value="">Select</option>
                                {zodiacSigns.map(sign => (
                                    <option key={sign} value={sign}>{sign}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="ghost" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" className="bg-purple-500 hover:bg-purple-600">
                            Add Profile
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

// ... imports
import BirthTimeRectifier from "@/components/birth-time-rectifier"

// Profile Card for Settings
export function ProfileCard({ profile }: { profile: UserProfile }) {
    const { updateProfile, deleteProfile, setActiveProfile, activeProfile } = useProfiles()
    const [isRectifying, setIsRectifying] = useState(false)

    const isActive = profile.id === activeProfile.id

    return (
        <>
            <Card className={`p-4 ${isActive ? 'bg-purple-900/30 border-purple-500/50' : 'bg-slate-800/50 border-gray-700'}`}>
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-xl text-white font-semibold">
                            {profile.name.charAt(0)}
                        </div>
                        <div>
                            <h4 className="font-semibold text-white flex items-center gap-2">
                                {profile.name}
                                {profile.isDefault && (
                                    <span className="text-xs bg-purple-500/30 text-purple-300 px-2 py-0.5 rounded">Primary</span>
                                )}
                            </h4>
                            <div className="flex items-center gap-4 text-xs text-gray-400 mt-1">
                                <span className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    {profile.birthDate}
                                </span>
                                <button
                                    onClick={() => setIsRectifying(true)}
                                    className="flex items-center gap-1 hover:text-indigo-400 transition-colors cursor-pointer group"
                                    title="Verify Birth Time"
                                >
                                    <Clock className="w-3 h-3 text-indigo-400 group-hover:animate-pulse" />
                                    {profile.birthTime}
                                    <span className="text-[10px] text-indigo-400 underline decoration-indigo-500/30 group-hover:decoration-indigo-500 ml-1">
                                        Verify?
                                    </span>
                                </button>
                                {profile.birthPlace && (
                                    <span className="flex items-center gap-1">
                                        <MapPin className="w-3 h-3" />
                                        {profile.birthPlace}
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                                {profile.sunSign && (
                                    <span className="text-xs bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded">
                                        ☉ {profile.sunSign}
                                    </span>
                                )}
                                {profile.moonSign && (
                                    <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded">
                                        ☽ {profile.moonSign}
                                    </span>
                                )}
                                {profile.ascendant && (
                                    <span className="text-xs bg-green-500/20 text-green-300 px-2 py-0.5 rounded">
                                        ASC {profile.ascendant}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-1">
                        {!isActive && (
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setActiveProfile(profile.id)}
                                className="text-xs text-cyan-400"
                            >
                                Switch
                            </Button>
                        )}
                        {!profile.isDefault && (
                            <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => deleteProfile(profile.id)}
                                className="text-red-400 hover:text-red-300"
                                aria-label="Delete profile"
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        )}
                    </div>
                </div>
            </Card>

            <Dialog open={isRectifying} onOpenChange={setIsRectifying}>
                <DialogContent className="bg-slate-950 border-indigo-500/30 text-white max-w-4xl p-0 overflow-hidden">
                    <BirthTimeRectifier />
                </DialogContent>
            </Dialog>
        </>
    )
}
