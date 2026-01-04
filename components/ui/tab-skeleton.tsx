"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"

interface TabSkeletonProps {
    title?: string
    cardCount?: number
}

export default function TabSkeleton({
    title = "Loading...",
    cardCount = 3
}: TabSkeletonProps) {
    return (
        <div className="space-y-6 animate-pulse">
            {/* Header Skeleton */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center space-y-4"
            >
                <div className="h-10 w-64 mx-auto bg-gradient-to-r from-slate-700/50 to-slate-600/50 rounded-lg" />
                <div className="h-4 w-96 max-w-full mx-auto bg-slate-700/30 rounded" />
            </motion.div>

            {/* Card Grid Skeleton */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: cardCount }).map((_, i) => (
                    <Card
                        key={i}
                        className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/30 p-6 backdrop-blur-sm"
                    >
                        <div className="space-y-4">
                            {/* Card Header */}
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-slate-700/50 rounded-full" />
                                <div className="space-y-2 flex-1">
                                    <div className="h-4 w-24 bg-slate-700/50 rounded" />
                                    <div className="h-3 w-16 bg-slate-700/30 rounded" />
                                </div>
                            </div>

                            {/* Card Content */}
                            <div className="space-y-3">
                                <div className="h-3 w-full bg-slate-700/30 rounded" />
                                <div className="h-3 w-5/6 bg-slate-700/30 rounded" />
                                <div className="h-3 w-4/6 bg-slate-700/30 rounded" />
                            </div>

                            {/* Card Footer */}
                            <div className="flex justify-between pt-2">
                                <div className="h-6 w-16 bg-cyan-500/20 rounded-full" />
                                <div className="h-6 w-12 bg-slate-700/30 rounded" />
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Loading Message */}
            <div className="text-center">
                <motion.div
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="inline-flex items-center space-x-2 text-cyan-400"
                >
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" />
                    <span className="text-sm">{title}</span>
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                </motion.div>
            </div>
        </div>
    )
}

// Compact skeleton for smaller sections
export function CompactSkeleton({ lines = 3 }: { lines?: number }) {
    return (
        <div className="space-y-3 animate-pulse">
            {Array.from({ length: lines }).map((_, i) => (
                <div
                    key={i}
                    className="h-4 bg-slate-700/30 rounded"
                    style={{ width: `${100 - i * 15}%` }}
                />
            ))}
        </div>
    )
}

// Widget skeleton for sidebar items
export function WidgetSkeleton() {
    return (
        <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/30 p-4 animate-pulse">
            <div className="space-y-3">
                <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-slate-700/50 rounded-full" />
                    <div className="h-4 w-24 bg-slate-700/50 rounded" />
                </div>
                <div className="h-3 w-full bg-slate-700/30 rounded" />
                <div className="h-3 w-3/4 bg-slate-700/30 rounded" />
            </div>
        </Card>
    )
}
