'use client'

import { useEffect, useRef } from 'react'

export default function PixelBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Pixel grid settings
    const pixelSize = 4
    const pixels: Array<{ x: number; y: number; alpha: number; decay: number }> = []

    // Spawn random pixels
    const spawnPixel = () => {
      const x = Math.floor(Math.random() * (canvas.width / pixelSize)) * pixelSize
      const y = Math.floor(Math.random() * (canvas.height / pixelSize)) * pixelSize
      pixels.push({
        x,
        y,
        alpha: Math.random() * 0.5 + 0.3,
        decay: Math.random() * 0.02 + 0.005
      })
    }

    // Animation loop
    let animationId: number
    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Spawn new pixels randomly
      if (Math.random() < 0.3) {
        spawnPixel()
      }

      // Update and draw pixels
      for (let i = pixels.length - 1; i >= 0; i--) {
        const pixel = pixels[i]
        pixel.alpha -= pixel.decay

        if (pixel.alpha <= 0) {
          pixels.splice(i, 1)
          continue
        }

        const gray = Math.floor(Math.random() * 50 + 200)
        ctx.fillStyle = `rgba(${gray}, ${gray}, ${gray}, ${pixel.alpha})`
        ctx.fillRect(pixel.x, pixel.y, pixelSize - 1, pixelSize - 1)
      }

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  )
}
