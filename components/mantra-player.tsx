"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Play, Pause, Volume2, VolumeX, RotateCcw, Repeat } from "lucide-react"

interface MantraPlayerProps {
    mantra: string
    title: string
    repetitions?: number
    className?: string
}

export default function MantraPlayer({
    mantra,
    title,
    repetitions = 108,
    className = ""
}: MantraPlayerProps) {
    const [isPlaying, setIsPlaying] = useState(false)
    const [isPaused, setIsPaused] = useState(false)
    const [currentRep, setCurrentRep] = useState(0)
    const [volume, setVolume] = useState(80)
    const [isMuted, setIsMuted] = useState(false)
    const [rate, setRate] = useState(0.9)
    const [isLooping, setIsLooping] = useState(true)

    const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)
    const currentRepRef = useRef(0)
    const isPlayingRef = useRef(false)

    useEffect(() => {
        return () => {
            // Cleanup on unmount
            window.speechSynthesis.cancel()
        }
    }, [])

    const speakMantra = () => {
        if (!('speechSynthesis' in window)) {
            console.error('Speech synthesis not supported')
            return
        }

        const utterance = new SpeechSynthesisUtterance(mantra)
        utterance.lang = 'hi-IN' // Hindi for Sanskrit mantras
        utterance.rate = rate
        utterance.volume = isMuted ? 0 : volume / 100
        utterance.pitch = 1

        // Try to find a Hindi voice
        const voices = window.speechSynthesis.getVoices()
        const hindiVoice = voices.find(v => v.lang.startsWith('hi')) || voices[0]
        if (hindiVoice) {
            utterance.voice = hindiVoice
        }

        utterance.onend = () => {
            currentRepRef.current += 1
            setCurrentRep(currentRepRef.current)

            if (currentRepRef.current < repetitions && isPlayingRef.current && isLooping) {
                // Small delay between repetitions
                setTimeout(() => {
                    if (isPlayingRef.current) {
                        speakMantra()
                    }
                }, 500)
            } else if (currentRepRef.current >= repetitions) {
                setIsPlaying(false)
                isPlayingRef.current = false
            }
        }

        utteranceRef.current = utterance
        window.speechSynthesis.speak(utterance)
    }

    const handlePlay = () => {
        if (!isPlaying) {
            setIsPlaying(true)
            setIsPaused(false)
            isPlayingRef.current = true

            if (currentRep === 0) {
                speakMantra()
            } else if (window.speechSynthesis.paused) {
                window.speechSynthesis.resume()
            } else {
                speakMantra()
            }
        }
    }

    const handlePause = () => {
        if (isPlaying) {
            window.speechSynthesis.pause()
            setIsPlaying(false)
            setIsPaused(true)
            isPlayingRef.current = false
        }
    }

    const handleStop = () => {
        window.speechSynthesis.cancel()
        setIsPlaying(false)
        setIsPaused(false)
        setCurrentRep(0)
        currentRepRef.current = 0
        isPlayingRef.current = false
    }

    const handleVolumeChange = (value: number[]) => {
        setVolume(value[0])
        setIsMuted(value[0] === 0)
        if (utteranceRef.current) {
            utteranceRef.current.volume = value[0] / 100
        }
    }

    const toggleMute = () => {
        setIsMuted(!isMuted)
        if (utteranceRef.current) {
            utteranceRef.current.volume = !isMuted ? 0 : volume / 100
        }
    }

    const progress = (currentRep / repetitions) * 100

    return (
        <div className={`bg-slate-800/30 rounded-xl p-4 border border-indigo-500/20 ${className}`}>
            <div className="flex items-center justify-between mb-3">
                <div>
                    <h4 className="font-semibold text-indigo-300 text-sm">{title}</h4>
                    <p className="text-xs text-gray-400 italic mt-1">"{mantra}"</p>
                </div>
                <div className="flex items-center space-x-2">
                    <Button
                        size="icon"
                        variant="ghost"
                        onClick={toggleMute}
                        className="h-8 w-8 text-gray-400 hover:text-white"
                        aria-label={isMuted ? "Unmute" : "Mute"}
                    >
                        {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </Button>
                    <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => setIsLooping(!isLooping)}
                        className={`h-8 w-8 ${isLooping ? 'text-indigo-400' : 'text-gray-400'} hover:text-white`}
                        aria-label={isLooping ? "Loop enabled" : "Loop disabled"}
                    >
                        <Repeat className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-3">
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>{currentRep} / {repetitions} repetitions</span>
                    <span>{Math.round(progress)}%</span>
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    {!isPlaying ? (
                        <Button
                            onClick={handlePlay}
                            size="sm"
                            className="bg-indigo-500 hover:bg-indigo-600 text-white"
                            aria-label="Play mantra"
                        >
                            <Play className="w-4 h-4 mr-1" />
                            {isPaused ? 'Resume' : 'Play'}
                        </Button>
                    ) : (
                        <Button
                            onClick={handlePause}
                            size="sm"
                            variant="outline"
                            className="border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/10"
                            aria-label="Pause mantra"
                        >
                            <Pause className="w-4 h-4 mr-1" />
                            Pause
                        </Button>
                    )}
                    <Button
                        onClick={handleStop}
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-gray-400 hover:text-white"
                        aria-label="Reset"
                    >
                        <RotateCcw className="w-4 h-4" />
                    </Button>
                </div>

                {/* Volume Slider */}
                <div className="flex items-center space-x-2 w-24">
                    <Slider
                        value={[isMuted ? 0 : volume]}
                        onValueChange={handleVolumeChange}
                        max={100}
                        step={1}
                        className="w-full"
                        aria-label="Volume control"
                    />
                </div>
            </div>

            {/* Speed Control */}
            <div className="mt-3 flex items-center justify-between text-xs">
                <span className="text-gray-400">Speed:</span>
                <div className="flex space-x-1">
                    {[0.7, 0.9, 1.0, 1.2].map(speed => (
                        <button
                            key={speed}
                            onClick={() => setRate(speed)}
                            className={`px-2 py-1 rounded ${rate === speed ? 'bg-indigo-500/30 text-indigo-300' : 'bg-slate-700/50 text-gray-400'} hover:bg-indigo-500/20`}
                        >
                            {speed}x
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}

// Compact version for embedding in cards
export function MantraPlayerCompact({ mantra, title }: { mantra: string; title: string }) {
    const [isPlaying, setIsPlaying] = useState(false)

    const handleToggle = () => {
        if (isPlaying) {
            window.speechSynthesis.cancel()
            setIsPlaying(false)
        } else {
            const utterance = new SpeechSynthesisUtterance(mantra)
            utterance.lang = 'hi-IN'
            utterance.rate = 0.9
            utterance.onend = () => setIsPlaying(false)
            window.speechSynthesis.speak(utterance)
            setIsPlaying(true)
        }
    }

    return (
        <Button
            onClick={handleToggle}
            size="sm"
            variant="ghost"
            className={`${isPlaying ? 'text-indigo-400' : 'text-gray-400'} hover:text-indigo-300`}
            aria-label={isPlaying ? `Stop ${title}` : `Play ${title}`}
        >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </Button>
    )
}
