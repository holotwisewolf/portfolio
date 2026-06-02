'use client'

import { useEffect, useRef, useState } from 'react'

export default function AsciiGlobe() {
  const [mounted, setMounted] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    setMounted(true)
    console.log('AsciiGlobe mounted')
  }, [])

  useEffect(() => {
    if (!mounted) return

    const canvas = canvasRef.current
    if (!canvas) {
      console.log('No canvas ref')
      return
    }

    const ctx = canvas.getContext('2d')
    if (!ctx) {
      console.log('No 2d context')
      return
    }

    console.log('Canvas size:', canvas.width, canvas.height)

    // ASCII characters for different brightness levels
    const asciiChars = '@%#*+=-:. '
    const charWidth = 5
    const charHeight = 10

    // Globe parameters
    const radius = 15
    const frameDelay = 100

    let rotation = 0

    const render = () => {
      // Clear with transparent
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // TEST: Draw a red box first
      ctx.fillStyle = 'red'
      ctx.fillRect(10, 10, 100, 50)

      // Draw ASCII globe
      let output = ''

      for (let y = -radius; y <= radius; y++) {
        for (let x = -radius; x <= radius; x++) {
          const z = Math.sqrt(radius * radius - x * x - y * y)
          if (isNaN(z)) {
            output += ' '
          } else {
            // 3D rotation
            const cos = Math.cos(rotation)
            const sin = Math.sin(rotation)
            const rotatedX = x * cos - z * sin
            const rotatedZ = x * sin + z * cos

            // Calculate brightness based on rotated z
            const brightness = (rotatedZ + radius) / (2 * radius)
            const charIndex = Math.floor(brightness * (asciiChars.length - 1))
            output += asciiChars[charIndex]
          }
        }
        output += '\n'
      }

      // Draw text
      ctx.font = '10px monospace'
      ctx.fillStyle = '#fff'
      const lines = output.split('\n')
      const startY = (canvas.height - lines.length * charHeight) / 2

      lines.forEach((line, i) => {
        const lineStart = (canvas.width - line.length * charWidth) / 2
        ctx.fillText(line, lineStart, startY + i * charHeight)
      })

      rotation += 0.15
    }

    const interval = setInterval(render, frameDelay)

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
