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

    // Coherent pixel grid - organized rows that scan down
    const pixelSize = 8
    const gridCols = Math.ceil(canvas.width / pixelSize)
    const gridRows = Math.ceil(canvas.height / pixelSize)

    // Each row has a state
    const rowStates: Array<{ active: boolean; alpha: number; targetX: number }> = []

    for (let y = 0; y < gridRows; y++) {
      rowStates.push({
        active: false,
        alpha: 0,
        targetX: Math.floor(Math.random() * gridCols)
      })
    }

    // Animation loop
    let animationId: number
    let scanLine = 0
    let lastTime = 0
    const scanSpeed = 0.05 // How fast the scan line moves

    const animate = (time: number) => {
      const delta = time - lastTime
      lastTime = time

      // Clear with slight fade
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Update scan line
      scanLine = (scanLine + scanSpeed) % gridRows
      const currentRow = Math.floor(scanLine)

      // Activate current row
      if (rowStates[currentRow]) {
        rowStates[currentRow].active = true
        rowStates[currentRow].alpha = 1
        rowStates[currentRow].targetX = Math.floor(Math.random() * gridCols)
      }

      // Draw and update each row
      for (let y = 0; y < gridRows; y++) {
        const state = rowStates[y]
        if (!state) continue

        if (state.active) {
          state.alpha -= 0.02
          if (state.alpha <= 0) {
            state.active = false
            continue
          }

          // Draw pixel at target position
          const x = state.targetX * pixelSize
          const brightness = Math.floor(state.alpha * 80 + 40)
          ctx.fillStyle = `rgba(${brightness}, ${brightness}, ${brightness}, ${state.alpha})`
          ctx.fillRect(x, y * pixelSize, pixelSize - 2, pixelSize - 2)

          // Occasionally add a neighboring pixel for coherence
          if (Math.random() < 0.3 && state.targetX > 0) {
            const neighborX = (state.targetX - 1) * pixelSize
            ctx.fillStyle = `rgba(${brightness}, ${brightness}, ${brightness}, ${state.alpha * 0.5})`
            ctx.fillRect(neighborX, y * pixelSize, pixelSize - 2, pixelSize - 2)
          }
        }
      }

      // Draw scan line indicator (subtle)
      const scanY = currentRow * pixelSize
      ctx.fillStyle = 'rgba(255, 255, 255, 0.02)'
      ctx.fillRect(0, scanY, canvas.width, pixelSize)

      animationId = requestAnimationFrame(animate)
    }

    animate(0)

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none"
      style={{ zIndex: -1 }}
    />
  )
}
