"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"

// Generate star positions on client side only to avoid hydration mismatch
interface StarPosition {
  left: number
  top: number
  duration: number
  delay: number
}

export default function CosmicBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Generate random positions only on client to prevent hydration mismatch
  const [stars, setStars] = useState<StarPosition[]>([])
  const [shootingStars, setShootingStars] = useState<StarPosition[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Generate random positions on mount only
    setStars(
      Array.from({ length: 100 }, () => ({
        left: Math.random() * 100,
        top: Math.random() * 100,
        duration: Math.random() * 3 + 2,
        delay: Math.random() * 2,
      }))
    )
    setShootingStars(
      Array.from({ length: 3 }, (_, i) => ({
        left: Math.random() * 100,
        top: Math.random() * 50,
        duration: 2,
        delay: i * 5 + Math.random() * 10,
      }))
    )
    setMounted(true)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Create stars
    const canvasStars: Array<{ x: number; y: number; size: number; opacity: number; twinkleSpeed: number }> = []
    for (let i = 0; i < 200; i++) {
      canvasStars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.8 + 0.2,
        twinkleSpeed: Math.random() * 0.02 + 0.01,
      })
    }

    let animationId: number
    let time = 0

    const animate = () => {
      time += 0.01

      // Clear canvas with dark background
      ctx.fillStyle = "rgba(15, 23, 42, 1)" // slate-900
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw stars
      canvasStars.forEach((star, index) => {
        const twinkle = Math.sin(time * star.twinkleSpeed + index) * 0.3 + 0.7
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(139, 92, 246, ${star.opacity * twinkle})` // purple-500
        ctx.fill()
      })

      // Add subtle gradient overlay
      const gradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        Math.max(canvas.width, canvas.height) / 2,
      )
      gradient.addColorStop(0, "rgba(139, 92, 246, 0.05)")
      gradient.addColorStop(0.5, "rgba(59, 130, 246, 0.03)")
      gradient.addColorStop(1, "rgba(15, 23, 42, 0.1)")

      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
    }
  }, [])

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 -z-10 pointer-events-none"
        style={{
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)",
          opacity: 1,
        }}
      />

      {/* Animated Stars - Only render after mount to prevent hydration mismatch */}
      {mounted && stars.map((star, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-cyan-400 rounded-full"
          style={{
            left: `${star.left}%`,
            top: `${star.top}%`,
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: star.duration,
            repeat: Number.POSITIVE_INFINITY,
            delay: star.delay,
          }}
        />
      ))}

      {/* Nebula Effect */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

      {/* Shooting Stars - Only render after mount */}
      {mounted && shootingStars.map((star, i) => (
        <motion.div
          key={`shooting-${i}`}
          className="absolute w-1 h-1 bg-white rounded-full"
          style={{
            left: `${star.left}%`,
            top: `${star.top}%`,
          }}
          animate={{
            x: [0, 200],
            y: [0, 100],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: star.duration,
            repeat: Number.POSITIVE_INFINITY,
            delay: star.delay,
            repeatDelay: 15,
          }}
        />
      ))}
    </div>
  )
}
