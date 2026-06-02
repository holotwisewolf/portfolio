'use client'

import { useEffect, useRef, useState } from 'react'

export default function AsciiGlobe() {
  const [mounted, setMounted] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // ASCII characters for brightness
    const asciiChars = '@%#*+=-:. '

    // Globe parameters
    const radius = 12
    let angleX = 0
    let angleY = 0

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Generate sphere points
      const points: { x: number; y: number; z: number; char: string }[] = []

      for (let lat = -radius; lat <= radius; lat++) {
        for (let lon = 0; lon < 2 * Math.PI; lon += 0.3) {
          // Convert spherical to cartesian
          const x = radius * Math.cos(lat / radius * Math.PI / 2) * Math.cos(lon)
          const y = radius * Math.sin(lat / radius * Math.PI / 2)
          const z = radius * Math.cos(lat / radius * Math.PI / 2) * Math.sin(lon)

          // Rotate around X axis
          const cosX = Math.cos(angleX)
          const sinX = Math.sin(angleX)
          const y1 = y * cosX - z * sinX
          const z1 = y * sinX + z * cosX

          // Rotate around Y axis
          const cosY = Math.cos(angleY)
          const sinY = Math.sin(angleY)
          const x2 = x * cosY - z1 * sinY
          const z2 = x * sinY + z1 * cosY

          // Simple projection
          const projX = Math.floor(x2 + canvas.width / 2)
          const projY = Math.floor(y1 + canvas.height / 2)

          // Calculate brightness based on z-depth
          const brightness = (z2 + radius) / (2 * radius)
          const charIndex = Math.floor(brightness * (asciiChars.length - 1))
          const char = asciiChars[Math.max(0, Math.min(charIndex, asciiChars.length - 1))]

          // Only add visible points
          if (projX >= 0 && projX < canvas.width / 5 && projY >= 0 && projY < canvas.height / 10) {
            points.push({ x: projX, y: projY, z: z2, char })
          }
        }
      }

      // Sort by z-depth (draw back to front)
      points.sort((a, b) => a.z - b.z)

      // Draw characters
      ctx.font = '10px monospace'
      const charWidth = 5
      const charHeight = 10

      points.forEach(point => {
        const alpha = (point.z + radius) / (2 * radius) * 0.6 + 0.2
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`
        ctx.fillText(point.char, point.x * charWidth, point.y * charHeight)
      })

      angleX += 0.02
      angleY += 0.03
    }

    const interval = setInterval(render, 50)

    return () => clearInterval(interval)
  }, [mounted])

  if (!mounted) return null

  return (
    <canvas
      ref={canvasRef}
      width={280}
      height={160}
      className="w-full h-auto"
      style={{ zIndex: 9999 }}
    />
  )
}
