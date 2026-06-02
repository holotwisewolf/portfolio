'use client'

import { useEffect, useRef, useState } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  base: number
  _neighbors: number
  _clusterTimer: number
}

export default function PixelBackground() {
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

    const resizeCanvas = () => {
      canvas.width = canvas.parentElement?.clientWidth || window.innerWidth
      canvas.height = canvas.parentElement?.clientHeight || window.innerHeight
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Watch for size changes (terminal expand/collapse)
    const resizeObserver = new ResizeObserver(() => resizeCanvas())
    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement)
    }

    // Particle configuration
    const particleCount = 120
    const CLUSTER_RADIUS = 45         // Attraction zone
    const ATTRACT = 0.002            // Gentler attraction for slower clustering
    const DAMPING = 0.98             // Smoother, longer-lasting glides
    const MAX_SPEED = 0.6            // Slow, graceful gathering speed
    const CONNECTION_DISTANCE = 120

    // Three-tier cluster system for natural equilibrium
    const PEACEFUL_MAX = 3         // 1-3 particles: peaceful equilibrium
    const UNSTABLE_MIN = 4          // 4-5 particles: unstable, will explode
    const UNSTABLE_MAX = 5
    const DRAMA_MIN = 6             // 6-8 particles: drama, harder explosion
    const DRAMA_MAX = 8
    const UNSTABLE_DURATION = 120   // ~2 seconds before unstable explodes
    const DRAMA_DURATION = 180       // ~3 seconds before drama explodes

    // Explosion settings
    const EXPLOSION_FORCE = 3.5
    const COOLDOWN_FRAMES = 120  // ~2 seconds of immunity to prevent chain reactions

    // Initialize particles
    const particles: Particle[] = []
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() < 0.7 ? 2 : 3,
        base: Math.random() * 0.3 + 0.1,
        _neighbors: 0,
        _clusterTimer: 0
      })
    }

    const dist = (a: Particle, b: Particle) => {
      const dx = a.x - b.x
      const dy = a.y - b.y
      return Math.sqrt(dx * dx + dy * dy)
    }

    // Track cluster state for explosions
    let explodingCluster: Set<number> = new Set()
    let unstableTimer = 0
    let dramaTimer = 0

    const update = () => {
      // Count neighbors for each particle
      const neighborMap: number[][] = []
      for (let i = 0; i < particleCount; i++) {
        const neighbors: number[] = []
        for (let j = 0; j < particleCount; j++) {
          if (i !== j && dist(particles[i], particles[j]) < CLUSTER_RADIUS) {
            neighbors.push(j)
          }
        }
        neighborMap.push(neighbors)
      }

      // Find clusters using BFS
      const visited = new Set<number>()
      const clusters: number[][] = []

      for (let i = 0; i < particleCount; i++) {
        if (visited.has(i)) continue
        const group: number[] = [i]
        visited.add(i)

        let added = true
        while (added) {
          added = false
          for (const idx of [...group]) {
            for (const neighbor of neighborMap[idx]) {
              if (!visited.has(neighbor)) {
                visited.add(neighbor)
                group.push(neighbor)
                added = true
              }
            }
          }
        }
        clusters.push(group)
      }

      // Find the largest current cluster
      let largestCluster: number[] = []
      let maxClusterSize = 0
      for (const cluster of clusters) {
        if (cluster.length > maxClusterSize) {
          maxClusterSize = cluster.length
          largestCluster = cluster
        }
      }

      // Handle cluster timers (only if an explosion isn't currently happening)
      if (explodingCluster.size === 0) {
        if (maxClusterSize >= DRAMA_MIN) {
          dramaTimer++
          unstableTimer = 0
        } else if (maxClusterSize >= UNSTABLE_MIN) {
          unstableTimer++
          dramaTimer = 0
        } else {
          dramaTimer = 0
          unstableTimer = 0
        }
      }

      // Trigger explosions for unstable and drama clusters
      if (explodingCluster.size === 0) {
        let triggeredCluster: number[] = []
        if (dramaTimer > DRAMA_DURATION && maxClusterSize >= DRAMA_MIN) {
          triggeredCluster = largestCluster
        } else if (unstableTimer > UNSTABLE_DURATION && maxClusterSize >= UNSTABLE_MIN) {
          triggeredCluster = largestCluster
        }

        if (triggeredCluster.length > 0) {
          explodingCluster = new Set(triggeredCluster)
          dramaTimer = 0
          unstableTimer = 0

          // Calculate blast force based on cluster size tier (gentle nudges)
          const clusterSize = triggeredCluster.length
          let blastForce: number
          if (clusterSize <= UNSTABLE_MAX) {
            blastForce = 0.7 // Unstable (4-5): very gentle nudge
          } else if (clusterSize <= DRAMA_MAX) {
            blastForce = 1.0 // Drama (6-8): gentle push
          } else {
            blastForce = 1.3 // Larger: moderate push (rare)
          }

          // Calculate the center of mass of the collapsing cluster
          let centerX = 0, centerY = 0
          triggeredCluster.forEach(idx => {
            centerX += particles[idx].x
            centerY += particles[idx].y
          })
          centerX /= triggeredCluster.length
          centerY /= triggeredCluster.length

          // Blast particles away from cluster center (radial explosion)
          triggeredCluster.forEach(idx => {
            const p = particles[idx]
            const dx = p.x - centerX
            const dy = p.y - centerY
            const d = Math.sqrt(dx * dx + dy * dy) || 1

            p.vx = (dx / d) * blastForce + (Math.random() - 0.5) * 0.3
            p.vy = (dy / d) * blastForce + (Math.random() - 0.5) * 0.3
            p._clusterTimer = COOLDOWN_FRAMES
          })
        }
      }

      // Physics and Movement Application
      for (let i = 0; i < particleCount; i++) {
        const p = particles[i]
        let ax = 0, ay = 0, neighbors = 0

        // Decrement the immunity cooldown timer
        if (p._clusterTimer > 0) p._clusterTimer--

        // Only apply gravity if this specific particle is NOT immune/dispersing
        if (p._clusterTimer === 0) {
          for (let j = 0; j < particleCount; j++) {
            if (i === j) continue

            // Skip attracting if the neighbor is currently immune
            if (particles[j]._clusterTimer > 0) continue

            const q = particles[j]
            const dx = q.x - p.x
            const dy = q.y - p.y
            const d = Math.sqrt(dx * dx + dy * dy)

            if (d < CLUSTER_RADIUS && d > 0) {
              const strength = ATTRACT * (1 - d / CLUSTER_RADIUS)
              ax += (dx / d) * strength
              ay += (dy / d) * strength
              neighbors++
            }

            // Solid separation bounce so they don't overlap into single pixels
            if (d < 12 && d > 0) {
              ax -= (dx / d) * 0.12
              ay -= (dy / d) * 0.12
            }
          }
        }

        p._neighbors = neighbors

        // Apply forces
        p.vx = (p.vx + ax) * DAMPING
        p.vy = (p.vy + ay) * DAMPING

        // Dynamic speed limit: higher limit when dispersing
        const currentMax = p._clusterTimer > 0 ? MAX_SPEED * 6 : MAX_SPEED
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy)
        if (speed > currentMax) {
          p.vx = (p.vx / speed) * currentMax
          p.vy = (p.vy / speed) * currentMax
        }

        // Gentle ambient wander (only for resting particles)
        if (p._clusterTimer === 0) {
          p.vx += (Math.random() - 0.5) * 0.03
          p.vy += (Math.random() - 0.5) * 0.03
        }

        // Position updates
        p.x += p.vx
        p.y += p.vy

        // Boundary bounces with energy loss
        if (p.x < 6) { p.x = 6; p.vx *= -0.8 }
        if (p.x > canvas.width - 6) { p.x = canvas.width - 6; p.vx *= -0.8 }
        if (p.y < 6) { p.y = 6; p.vy *= -0.8 }
        if (p.y > canvas.height - 6) { p.y = canvas.height - 6; p.vy *= -0.8 }
      }

      // Clean global explosion state when all particles' immunities expire
      if (explodingCluster.size > 0) {
        const activeExplosions = Array.from(explodingCluster).some(idx => particles[idx]._clusterTimer > 0)
        if (!activeExplosions) {
          explodingCluster.clear()
        }
      }
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw connections first (behind particles)
      for (let i = 0; i < particleCount; i++) {
        const p = particles[i]
        for (let j = i + 1; j < particleCount; j++) {
          const q = particles[j]
          const d = dist(p, q)
          if (d < CONNECTION_DISTANCE) {
            const opacity = (1 - d / CONNECTION_DISTANCE) * 0.3
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(q.x, q.y)
            ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      }

      // Draw particles
      for (let i = 0; i < particleCount; i++) {
        const p = particles[i]
        const density = Math.min(p._neighbors / 6, 1)
        const alpha = p.base + density * 0.5
        const size = p.size + (density > 0.5 ? 1 : 0)

        ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(alpha, 0.9)})`
        ctx.fillRect(Math.floor(p.x), Math.floor(p.y), size, size)
      }
    }

    let animationId: number
    const animate = () => {
      update()
      draw()
      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      resizeObserver.disconnect()
      cancelAnimationFrame(animationId)
    }
  }, [mounted])

  if (!mounted) return null

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  )
}
