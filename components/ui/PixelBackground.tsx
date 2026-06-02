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
  _isConnector: boolean
  _connectorTarget: { x: number; y: number } | null
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
    const particleCount = 150         // More particles for more activity
    const CLUSTER_RADIUS = 50         // Attraction zone (increased for more connections)
    const ATTRACT = 0.004            // Stronger attraction to pull particles together
    const DAMPING = 0.98             // Smoother, longer-lasting glides
    const MAX_SPEED = 0.8            // Faster speed for more movement
    const CONNECTION_DISTANCE = 130   // Increased for more web connections

    // Connector mesh settings
    const CONNECTOR_SPACING = 120    // Optimal distance between connectors
    const CONNECTOR_ATTRACT = 0.003  // Weaker attraction to prevent clumping

    // Local crowd control system
    const HARD_CAP = 6              // 6+ neighbors = instant explosion
    const UNSTABLE_MIN = 4          // 4-5 neighbors: unstable, will explode
    const UNSTABLE_MAX = 5
    const UNSTABLE_DURATION = 90    // ~1.5 seconds before unstable explodes

    // Explosion settings
    const EXPLOSION_FORCE = 3.5
    const COOLDOWN_FRAMES = 80  // ~1.3 seconds immunity (shorter for more connections)

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
        _clusterTimer: 0,
        _isConnector: (i % 20 >= 17), // 15% are permanent bridge connectors (3 out of 20)
        _connectorTarget: null
      })
    }

    const dist = (a: Particle, b: Particle) => {
      const dx = a.x - b.x
      const dy = a.y - b.y
      return Math.sqrt(dx * dx + dy * dy)
    }

    // Probability-based explosion force
    const getRandomBlastForce = (): { radial: number; spaceFinder: number } => {
      const roll = Math.random()
      if (roll < 0.4) {
        // 40% small - stay local
        return { radial: 0.8 + Math.random() * 0.4, spaceFinder: 0.6 + Math.random() * 0.3 }
      } else if (roll < 0.9) {
        // 50% medium - moderate dispersal
        return { radial: 1.5 + Math.random() * 0.7, spaceFinder: 1.2 + Math.random() * 0.5 }
      } else {
        // 10% large - escape to join other clusters (rare)
        return { radial: 2.8 + Math.random() * 0.8, spaceFinder: 2.2 + Math.random() * 0.6 }
      }
    }

    // Track unstable clusters for timer-based explosions
    let unstableTimer = 0

    const update = () => {
      // Count neighbors for each particle (local crowd detection)
      const neighborCounts: number[] = new Array(particleCount).fill(0)
      for (let i = 0; i < particleCount; i++) {
        for (let j = i + 1; j < particleCount; j++) {
          if (dist(particles[i], particles[j]) < CLUSTER_RADIUS) {
            neighborCounts[i]++
            neighborCounts[j]++
          }
        }
      }

      // Find particles that exceed hard cap (6+ neighbors) for instant explosion
      const hardCapParticles: number[] = []
      for (let i = 0; i < particleCount; i++) {
        if (neighborCounts[i] >= HARD_CAP && particles[i]._clusterTimer === 0) {
          hardCapParticles.push(i)
        }
      }

      // Instant hard cap explosion
      if (hardCapParticles.length > 0) {
        hardCapParticles.forEach(idx => {
          const p = particles[idx]
          // Find nearby particles to explode together
          const nearbyGroup: number[] = [idx]
          for (let j = 0; j < particleCount; j++) {
            if (j !== idx && dist(p, particles[j]) < CLUSTER_RADIUS && particles[j]._clusterTimer === 0) {
              nearbyGroup.push(j)
            }
          }

          // Calculate center of this local group
          let centerX = 0, centerY = 0
          nearbyGroup.forEach(i => {
            centerX += particles[i].x
            centerY += particles[i].y
          })
          centerX /= nearbyGroup.length
          centerY /= nearbyGroup.length

          // Get random blast force for this explosion
          const blastForce = getRandomBlastForce()

          // Blast all particles in this local group
          nearbyGroup.forEach(i => {
            const p2 = particles[i]
            const isSpaceFinder = (i % 10 >= 7) // 30% space-finders

            if (isSpaceFinder) {
              // Space-finder: drift toward empty space
              let avoidX = 0, avoidY = 0, closeCount = 0
              const scanRadius = 200

              for (let j = 0; j < particleCount; j++) {
                if (i === j) continue
                const q = particles[j]
                const dx = p2.x - q.x
                const dy = p2.y - q.y
                const d = Math.sqrt(dx * dx + dy * dy)

                if (d < scanRadius && d > 0) {
                  const weight = (scanRadius - d) / scanRadius
                  avoidX += (dx / d) * weight
                  avoidY += (dy / d) * weight
                  closeCount++
                }
              }

              if (closeCount > 0) {
                const avoidDist = Math.sqrt(avoidX * avoidX + avoidY * avoidY) || 1
                p2.vx = (avoidX / avoidDist) * blastForce.spaceFinder + (Math.random() - 0.5) * 0.5
                p2.vy = (avoidY / avoidDist) * blastForce.spaceFinder + (Math.random() - 0.5) * 0.5
              } else {
                p2.vx = (Math.random() - 0.5) * 1.5
                p2.vy = (Math.random() - 0.5) * 1.5
              }
            } else {
              // Normal radial blast
              const dx = p2.x - centerX
              const dy = p2.y - centerY
              const d = Math.sqrt(dx * dx + dy * dy) || 1

              p2.vx = (dx / d) * blastForce.radial + (Math.random() - 0.5) * 0.6
              p2.vy = (dy / d) * blastForce.radial + (Math.random() - 0.5) * 0.6
            }

            p2._clusterTimer = COOLDOWN_FRAMES
          })
        })
      }

      // Track unstable clusters (4-5 neighbors) for timer-based explosion
      const maxNeighbors = Math.max(...neighborCounts)
      if (maxNeighbors >= UNSTABLE_MIN && maxNeighbors < HARD_CAP) {
        unstableTimer++
      } else {
        unstableTimer = 0
      }

      // Trigger unstable explosion after timer
      if (unstableTimer > UNSTABLE_DURATION) {
        // Find all particles in unstable range
        const unstableParticles: number[] = []
        for (let i = 0; i < particleCount; i++) {
          if (neighborCounts[i] >= UNSTABLE_MIN && neighborCounts[i] < HARD_CAP && particles[i]._clusterTimer === 0) {
            unstableParticles.push(i)
          }
        }

        if (unstableParticles.length > 0) {
          // Calculate center of unstable group
          let centerX = 0, centerY = 0
          unstableParticles.forEach(i => {
            centerX += particles[i].x
            centerY += particles[i].y
          })
          centerX /= unstableParticles.length
          centerY /= unstableParticles.length

          // Get random blast force for this explosion
          const blastForce = getRandomBlastForce()

          // Gentle blast with space-finding
          unstableParticles.forEach(i => {
            const p = particles[i]
            const isSpaceFinder = (i % 10 >= 7) // 30% space-finders

            if (isSpaceFinder) {
              // Space-finder: drift toward empty space
              let avoidX = 0, avoidY = 0, closeCount = 0
              const scanRadius = 200

              for (let j = 0; j < particleCount; j++) {
                if (i === j) continue
                const q = particles[j]
                const dx = p.x - q.x
                const dy = p.y - q.y
                const d = Math.sqrt(dx * dx + dy * dy)

                if (d < scanRadius && d > 0) {
                  const weight = (scanRadius - d) / scanRadius
                  avoidX += (dx / d) * weight
                  avoidY += (dy / d) * weight
                  closeCount++
                }
              }

              if (closeCount > 0) {
                const avoidDist = Math.sqrt(avoidX * avoidX + avoidY * avoidY) || 1
                p.vx = (avoidX / avoidDist) * (blastForce.spaceFinder * 0.7) + (Math.random() - 0.5) * 0.4
                p.vy = (avoidY / avoidDist) * (blastForce.spaceFinder * 0.7) + (Math.random() - 0.5) * 0.4
              } else {
                p.vx = (Math.random() - 0.5) * 0.8
                p.vy = (Math.random() - 0.5) * 0.8
              }
            } else {
              // Normal radial blast
              const dx = p.x - centerX
              const dy = p.y - centerY
              const d = Math.sqrt(dx * dx + dy * dy) || 1

              p.vx = (dx / d) * (blastForce.radial * 0.7) + (Math.random() - 0.5) * 0.4
              p.vy = (dy / d) * (blastForce.radial * 0.7) + (Math.random() - 0.5) * 0.4
            }

            p._clusterTimer = COOLDOWN_FRAMES
          })
        }
        unstableTimer = 0
      }

      // Physics and Movement Application
      for (let i = 0; i < particleCount; i++) {
        const p = particles[i]
        let ax = 0, ay = 0, neighbors = 0

        // Decrement the immunity cooldown timer
        if (p._clusterTimer > 0) p._clusterTimer--

        // Only apply gravity if this specific particle is NOT immune/dispersing
        // Connectors have their own mesh network physics, skip normal attraction
        if (p._clusterTimer === 0 && !p._isConnector) {
          for (let j = 0; j < particleCount; j++) {
            if (i === j) continue

            // Skip attracting if the neighbor is currently immune or is a connector
            if (particles[j]._clusterTimer > 0 || particles[j]._isConnector) continue

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

            // Balanced close-range repulsion
            if (d < 12 && d > 0) {
              ax -= (dx / d) * 0.15
              ay -= (dy / d) * 0.15
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

        // Bridge connector behavior: form dynamic mesh network in empty spaces
        if (p._isConnector && p._clusterTimer === 0) {
          let ax = 0, ay = 0

          // Part 1: VERY gentle push away from regular particles (don't affect clusters)
          for (let j = 0; j < particleCount; j++) {
            if (i === j || particles[j]._isConnector) continue // Skip other connectors
            const q = particles[j]
            const dx = p.x - q.x
            const dy = p.y - q.y
            const d = Math.sqrt(dx * dx + dy * dy)

            // Very gentle avoidance - just enough to find empty space
            if (d > 0 && d < 200) {
              const weight = 1 / (d + 1)
              ax += (dx / d) * weight * 0.02
              ay += (dy / d) * weight * 0.02
            }
          }

          // Part 2: VERY loose mesh with other connectors - no rigid locking
          for (let j = 0; j < particleCount; j++) {
            if (i === j || !particles[j]._isConnector) continue // Only other connectors
            const q = particles[j]
            const dx = q.x - p.x
            const dy = q.y - p.y
            const d = Math.sqrt(dx * dx + dy * dy)

            if (d > 0) {
              if (d > CONNECTOR_SPACING * 2.5) {
                // Too far - very gentle attract
                const strength = CONNECTOR_ATTRACT * 0.5 * (1 - Math.min(d / 600, 1))
                ax += (dx / d) * strength
                ay += (dy / d) * strength
              } else if (d < CONNECTOR_SPACING * 0.6) {
                // Too close - gentle repel
                ax -= (dx / d) * 0.04
                ay -= (dy / d) * 0.04
              }
              // At optimal spacing - no force, free to drift
            }
          }

          // Apply mesh network forces
          p.vx += ax
          p.vy += ay

          // Add strong random wander so they keep exploring (don't lock)
          p.vx += (Math.random() - 0.5) * 0.08
          p.vy += (Math.random() - 0.5) * 0.08
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
        let alpha = p.base + density * 0.5
        const size = p.size + (density > 0.5 ? 1 : 0)

        // Connector particles are slightly brighter
        if (p._isConnector) {
          alpha = Math.min(alpha + 0.2, 0.95)
        }

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
