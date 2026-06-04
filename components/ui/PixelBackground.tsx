'use client'

import { useEffect, useRef, useState, useContext } from 'react'
import { ExplosionModeContext } from '@/contexts/ExplosionModeContext'

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
  _breakFreeTimer: number        // When >0, connector breaks free to explore
  _targetRecalcTimer: number     // When to recalculate target (optimization)
  _shortBreakTimer: number       // Short timer for 40% break chance
  _longBreakTimer: number        // Long timer for 60% break chance
  _localDensity: number         // Nearby connector count for redistribution
  _gracePeriodTimer: number     // Grace period for hard cap (10% chance, ~3 sec)
  _bounceCount: number          // Consecutive wall bounces (for corner escape)
  _connectorBrightness: number  // 0.15 (common) or 0.4 (rare) - fixed glow unaffected by density
  _stayTimer: number            // Frames spent in current area (for auto-break-free)
  _socialBattery: number        // 0-100: drains in crowds, recharges alone (extrovert/introvert cycle)
}

interface PixelBackgroundProps {
  explosionMode?: 'space' | 'radial'
}

export default function PixelBackground({ explosionMode = 'space' }: PixelBackgroundProps) {
  const [mounted, setMounted] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { graceMode, frameFreezeEnabled } = useContext(ExplosionModeContext)!
  const particlesRef = useRef<Particle[] | null>(null)
  const savedPositionsRef = useRef<{ x: number; y: number; vx: number; vy: number }[] | null>(null)
  const prevSettingsRef = useRef(`${graceMode}-${explosionMode}-${frameFreezeEnabled}`)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Save particle positions when settings change (for seamless transitions)
  useEffect(() => {
    const currentSettings = `${graceMode}-${explosionMode}-${frameFreezeEnabled}`
    if (currentSettings !== prevSettingsRef.current && particlesRef.current) {
      // Save current positions synchronously to ref
      savedPositionsRef.current = particlesRef.current.map(p => ({ x: p.x, y: p.y, vx: p.vx, vy: p.vy }))
      prevSettingsRef.current = currentSettings
    }
  }, [graceMode, explosionMode, frameFreezeEnabled])

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
    const CLUSTER_RADIUS = 55         // Wider attraction zone for more clustering
    const ATTRACT = 0.006            // Stronger attraction for more cluster formation
    const DAMPING = 0.98             // Smoother, longer-lasting glides
    const MAX_SPEED = 0.8            // Faster speed for more movement
    const CONNECTION_DISTANCE = 130   // Increased for more web connections

    // Connector mesh settings
    const CONNECTOR_SPACING = 120    // Optimal distance between connectors
    const CONNECTOR_ATTRACT = 0.003  // Weaker attraction to prevent clumping

    // Local crowd control system
    const HARD_CAP = 7              // 7+ neighbors = instant explosion (was 6)
    const UNSTABLE_MIN = 4          // 4-5 neighbors: unstable, will explode
    const UNSTABLE_MAX = 6          // 4-6 neighbors: unstable (was 5)
    const UNSTABLE_DURATION = 75    // ~1.25 seconds before unstable explodes (was 90)

    // Grace period settings (probabilistic, not cycles)
    const GRACE_MIN_DURATION = 120   // 2 seconds minimum
    const GRACE_MAX_DURATION = 720   // 12 seconds maximum

    // Explosion settings
    const EXPLOSION_FORCE = 3.5
    const COOLDOWN_FRAMES = 80  // ~1.3 seconds immunity (shorter for more connections)

    // Grace period state (probabilistic)
    let inGracePeriod = false
    let graceFrameCounter = 0
    let graceDuration = 0
    let recentExplosions = 0  // Track chaos level

    // Initialize particles
    const particles: Particle[] = []
    for (let i = 0; i < particleCount; i++) {
      // Random connector brightness: 0.2 (25%), 0.25 (25%), 0.3 (30%), 0.5 (20%)
      const brightnessRoll = Math.random()
      let connectorBrightness: number
      if (brightnessRoll < 0.25) connectorBrightness = 0.2
      else if (brightnessRoll < 0.5) connectorBrightness = 0.25
      else if (brightnessRoll < 0.8) connectorBrightness = 0.3
      else connectorBrightness = 0.5

      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() < 0.7 ? 2 : 3,
        base: Math.random() * 0.3 + 0.1,
        _neighbors: 0,
        _clusterTimer: 0,
        _isConnector: (i % 20 >= 18), // 10% are permanent bridge connectors (2 out of 20)
        _connectorTarget: null,
        _breakFreeTimer: 0,
        _shortBreakTimer: 90, // ~1.5 seconds before 40% break chance (was 120)
        _longBreakTimer: 180,   // ~3 seconds before 60% break chance (was 300)
        _localDensity: 0,       // Track nearby connector count
        _gracePeriodTimer: 0,   // Grace period for hard cap explosions
        _bounceCount: 0,
        _connectorBrightness: connectorBrightness,
        _targetRecalcTimer: 0,   // When to recalculate break-free target
        _stayTimer: 0,           // Frames spent in current area
        _socialBattery: 100      // Start fully charged (extrovert mode)
      })
    }

    particlesRef.current = particles

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

    // Track unstable clusters for timer-based explosions (per-cluster)
    const clusterTimers: Map<string, number> = new Map() // clusterId -> timer value

    // Generate cluster ID from sorted particle indices
    const getClusterId = (indices: number[]): string => {
      return indices.sort((a, b) => a - b).join('-')
    }

    const update = () => {
      // Restore saved positions if settings changed (particles stay in place)
      if (savedPositionsRef.current) {
        for (let i = 0; i < particles.length && i < savedPositionsRef.current.length; i++) {
          particles[i].x = savedPositionsRef.current[i].x
          particles[i].y = savedPositionsRef.current[i].y
          particles[i].vx = savedPositionsRef.current[i].vx
          particles[i].vy = savedPositionsRef.current[i].vy
        }
        savedPositionsRef.current = null // Clear after restore
      }

      // Handle grace period based on mode
      if (graceMode === 'constant') {
        // Constant mode - always in grace period (always slow-mo)
        inGracePeriod = true
      } else if (graceMode === 'disabled') {
        // Disabled mode - never in grace period
        inGracePeriod = false
        recentExplosions = 0
      } else {
        // Enabled mode - probabilistic grace periods
        if (inGracePeriod) {
          graceFrameCounter++
          if (graceFrameCounter >= graceDuration) {
            inGracePeriod = false
            graceFrameCounter = 0
          }
        } else {
          // Track chaos - increment when explosions happen
          // (This gets updated after explosion logic below)

          // Chance to enter grace - higher during chaos, but never guaranteed
          let enterChance = 0.0008  // Base 0.08% per frame (~1.2 seconds average wait if no chaos)

          // Chaos bonus (but even high chaos doesn't guarantee grace)
          if (recentExplosions >= 3) enterChance += 0.0015   // +0.15%
          if (recentExplosions >= 6) enterChance += 0.002    // +0.2%
          if (recentExplosions >= 10) enterChance += 0.002   // +0.2% more

          // Max ~0.63% per frame during extreme chaos = ~2.6 seconds average wait
          // But it's still probabilistic - could go 60+ seconds without grace

          // 35% chance to SKIP this check entirely (adds more unpredictability)
          if (Math.random() > 0.35 && Math.random() < enterChance) {
            inGracePeriod = true
            graceFrameCounter = 0
            // Random duration: 2-12 seconds (wide variance)
            graceDuration = GRACE_MIN_DURATION + Math.random() * (GRACE_MAX_DURATION - GRACE_MIN_DURATION)
            recentExplosions = 0  // Reset chaos counter
          }

          // Decay recentExplosions slowly (so grace doesn't trigger on old chaos)
          recentExplosions *= 0.98
        }
      }

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
        // Decrement grace period timer
        if (particles[i]._gracePeriodTimer > 0) {
          particles[i]._gracePeriodTimer--
        }

        // Check for hard cap (with grace period chance)
        if (neighborCounts[i] >= HARD_CAP && particles[i]._clusterTimer === 0 && particles[i]._gracePeriodTimer === 0) {
          // 10% chance to get a grace period
          if (Math.random() < 0.1) {
            particles[i]._gracePeriodTimer = 180 // ~3 seconds grace period
          } else {
            hardCapParticles.push(i)
          }
        }
      }

      // Instant hard cap explosion (with 10% grace period chance)
      // SKIP during global grace period
      if (hardCapParticles.length > 0 && !inGracePeriod) {
        recentExplosions += hardCapParticles.length  // Track chaos
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

      // Find unstable clusters (4-6 neighbors) using BFS for individual timers
      const visited = new Set<number>()
      const unstableClusters: number[][] = []

      for (let i = 0; i < particleCount; i++) {
        if (visited.has(i)) continue
        if (neighborCounts[i] < UNSTABLE_MIN || neighborCounts[i] >= HARD_CAP) continue
        if (particles[i]._clusterTimer > 0) continue

        // BFS to find this cluster
        const cluster: number[] = []
        const queue = [i]
        visited.add(i)

        while (queue.length > 0) {
          const current = queue.shift()!
          cluster.push(current)

          for (let j = 0; j < particleCount; j++) {
            if (visited.has(j)) continue
            if (particles[j]._clusterTimer > 0) continue
            if (neighborCounts[j] < UNSTABLE_MIN || neighborCounts[j] >= HARD_CAP) continue

            // Check if connected
            if (dist(particles[current], particles[j]) < CLUSTER_RADIUS) {
              visited.add(j)
              queue.push(j)
            }
          }
        }

        if (cluster.length > 0) {
          unstableClusters.push(cluster)
        }
      }

      // Update timers for each unstable cluster individually
      const clustersToExplode: number[][] = []

      unstableClusters.forEach(cluster => {
        const clusterId = getClusterId(cluster)
        const currentTimer = clusterTimers.get(clusterId) || 0

        // Increment timer for this cluster
        clusterTimers.set(clusterId, currentTimer + 1)

        // Check if this cluster should explode
        if (currentTimer + 1 > UNSTABLE_DURATION) {
          clustersToExplode.push(cluster)
          clusterTimers.delete(clusterId) // Remove timer, will restart if cluster reforms
        }
      })

      // Clean up timers for clusters that no longer exist
      const activeClusterIds = new Set(unstableClusters.map(c => getClusterId(c)))
      for (const [id] of clusterTimers) {
        if (!activeClusterIds.has(id)) {
          clusterTimers.delete(id)
        }
      }

      // Trigger explosions for clusters whose timers expired
      // SKIP during global grace period (timers still progress)
      if (!inGracePeriod && clustersToExplode.length > 0) {
        recentExplosions += clustersToExplode.length * 2  // Track chaos (cluster explosions = more chaos)
        clustersToExplode.forEach(cluster => {
          // Calculate center of this cluster
          let centerX = 0, centerY = 0
          cluster.forEach(i => {
            centerX += particles[i].x
            centerY += particles[i].y
          })
          centerX /= cluster.length
          centerY /= cluster.length

          // Get random blast force for this explosion
          const blastForce = getRandomBlastForce()

          // Gentle blast with space-finding
          cluster.forEach(i => {
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
        })
      }

      // Physics and Movement Application
      for (let i = 0; i < particleCount; i++) {
        const p = particles[i]

        // Validate position - reset to center if NaN
        if (isNaN(p.x) || isNaN(p.y)) {
          p.x = canvas.width / 2
          p.y = canvas.height / 2
          p.vx = 0
          p.vy = 0
        }

        let ax = 0, ay = 0

        // Decrement the immunity cooldown timer
        if (p._clusterTimer > 0) p._clusterTimer--

        // Use neighbor count from earlier pass (for glow rendering)
        p._neighbors = neighborCounts[i]

        // Only apply gravity if this specific particle is NOT immune/dispersing
        // Connectors have their own mesh network physics, skip normal attraction
        // SKIP ALL forces during grace period (time slow)
        if (p._clusterTimer === 0 && !p._isConnector && !inGracePeriod) {
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
            }

            // Balanced close-range repulsion
            if (d < 12 && d > 0) {
              ax -= (dx / d) * 0.15
              ay -= (dy / d) * 0.15
            }
          }
        }

        // Apply forces
        p.vx = (p.vx + ax) * DAMPING
        p.vy = (p.vy + ay) * DAMPING

        // Dynamic speed limit: much higher when breaking free or free roaming
        const currentMax = p._clusterTimer > 0 ? MAX_SPEED * 6 :
                          p._breakFreeTimer > 0 ? MAX_SPEED * 4 : MAX_SPEED
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy)
        if (speed > currentMax) {
          p.vx = (p.vx / speed) * currentMax
          p.vy = (p.vy / speed) * currentMax
        }

        // Gentle ambient wander (only for resting particles, skip during grace period)
        if (p._clusterTimer === 0 && !inGracePeriod) {
          p.vx += (Math.random() - 0.5) * 0.03
          p.vy += (Math.random() - 0.5) * 0.03
        }

        // Tiny ambient drift during grace period so they don't fully freeze
        if (inGracePeriod && p._clusterTimer === 0) {
          p.vx += (Math.random() - 0.5) * 0.005  // Much smaller than normal
          p.vy += (Math.random() - 0.5) * 0.005
        }

        // Bridge connector behavior: form dynamic mesh network in empty spaces
        // ACTIVE during grace period - proactive space finding
        if (p._isConnector && p._clusterTimer === 0) {
          // Calculate local particle density (ALL particles, not just connectors)
          p._localDensity = 0
          for (let j = 0; j < particleCount; j++) {
            if (i === j) continue
            const d = dist(p, particles[j])
            if (d < 150) p._localDensity++ // Count nearby particles within 150px
          }

          // GLOBAL AWARENESS: Find the emptiest and most crowded areas on screen
          let globalMinDensity = 999
          let globalMaxDensity = 0
          const gridSize = 100
          for (let gx = gridSize; gx < canvas.width; gx += gridSize) {
            for (let gy = gridSize; gy < canvas.height; gy += gridSize) {
              let density = 0
              for (let j = 0; j < particleCount; j++) {
                const dx = gx - particles[j].x
                const dy = gy - particles[j].y
                const d = Math.sqrt(dx * dx + dy * dy)
                if (d < 150) density++ // Use same radius as local density (150px)
              }
              if (density < globalMinDensity) {
                globalMinDensity = density
              }
              if (density > globalMaxDensity) {
                globalMaxDensity = density
              }
            }
          }

          // MARKET COMPETITION: Dynamic tolerance based on screen distribution
          const canvasContrast = globalMaxDensity - globalMinDensity
          const dynamicTolerance = 2 + canvasContrast * 0.4

          // Calculate fitness score: lower density = higher fitness
          // Fitness ranges from 0.0 (very bad, crowded) to 1.0 (perfect, isolated)
          const fitness = Math.max(0, 1 - (p._localDensity / 8)) // 0-8+ neighbors maps to 1-0 fitness

          // Decrement timers
          if (p._shortBreakTimer > 0) p._shortBreakTimer--
          if (p._longBreakTimer > 0) p._longBreakTimer--
          if (p._breakFreeTimer > 0) p._breakFreeTimer--

          // SOCIAL BATTERY: Drains in crowds, recharges when alone
          // Creates extrovert/introvert cycle - no staleness
          // LONER BONUS: Faster recharge when density 1-2 (reward good positioning)
          if (p._localDensity >= 3) {
            p._socialBattery = Math.max(0, p._socialBattery - 0.02) // Drains in ~5 seconds
          } else if (p._localDensity <= 2) {
            p._socialBattery = Math.min(100, p._socialBattery + 0.02) // 2x faster recharge for loners
          } else {
            p._socialBattery = Math.min(100, p._socialBattery + 0.01) // Normal recharge
          }

          // STAY TIMER: Auto break-free using RELATIVE + MARKET COMPETITION + SOCIAL BATTERY
          // Leave when significantly more crowded than the best available spot
          // Battery adds tolerance: full battery = stay longer, empty battery = leave quickly
          const batteryBonus = (p._socialBattery / 100) * 2 // 0-2 bonus based on battery

          // LONER BONUS: Extra patience when density 1-2 (reward good positioning)
          const lonerBonus = p._localDensity <= 2 ? 3.5 : 0 // +3.5 tolerance for loners

          const relativeThreshold = globalMinDensity + dynamicTolerance + batteryBonus + lonerBonus
          if (p._localDensity > relativeThreshold) {
            // Desync noise: timer ticks probabilistically, not every frame
            if (Math.random() < 0.85) {
              p._stayTimer++
            }

            // Unique patience threshold per connector (120-240 frames)
            const connectorIndex = i // Use particle index as connector identifier
            const uniquePatience = 120 + (connectorIndex % 7) * 20 // 120, 140, 160...240

            if (p._stayTimer > uniquePatience && p._breakFreeTimer === 0) {
              // Forced break-free - target the emptiest area
              p._breakFreeTimer = 120 + Math.random() * 60 // 2-3 seconds exploration
              p._stayTimer = 0 // Reset timer
            }
          } else {
            p._stayTimer = Math.max(0, p._stayTimer - 2) // Cool down faster when area is good
          }

          // GLOBAL AWARENESS: Compare current situation to global optimum
          // If there's a significantly better spot elsewhere, pressure to move
          const densityGap = p._localDensity - globalMinDensity // How much better is the emptiest area?

          // Check for break-free chances (FITNESS-AWARE)
          if (p._breakFreeTimer === 0) {
            // Bad connectors (low fitness) get pressured to move
            // Good connectors (high fitness) get rewarded with stability
            const densityBonus = Math.min(p._localDensity * 0.1, 0.25)
            const fitnessBonus = fitness * 0.2 // High fitness = less pressure

            const breakChanceShort = 0.25 + densityBonus - fitnessBonus // 25-50% adjusted by fitness
            const breakChanceLong = 0.5 + densityBonus - fitnessBonus // 50-75% adjusted by fitness

            // Short timer expired: dynamic chance to break free
            if (p._shortBreakTimer <= 0 && Math.random() < breakChanceShort) {
              // Longer break for high-density connectors, shorter for low-density
              const baseDuration = p._localDensity >= 5 ? 90 : 60
              const fitnessBonus = fitness * 30 // Good connectors get +0.5 sec more exploration
              p._breakFreeTimer = baseDuration + fitnessBonus + Math.random() * 30
              p._shortBreakTimer = 90
              p._longBreakTimer = 180
              p._stayTimer = 0 // Reset stay timer when breaking free
            }
            // Long timer expired: dynamic chance to break free
            else if (p._longBreakTimer <= 0 && Math.random() < breakChanceLong) {
              const baseDuration = p._localDensity >= 5 ? 90 : 60
              const fitnessBonus = fitness * 30 // Good connectors get +0.5 sec more exploration
              p._breakFreeTimer = baseDuration + fitnessBonus + Math.random() * 30
              p._shortBreakTimer = 90
              p._longBreakTimer = 180
              p._stayTimer = 0 // Reset stay timer when breaking free
            }
          }

          // Density-based forced redistribution (FITNESS-AWARE)
          // Bad connectors (low fitness) get pressured more aggressively
          if (p._breakFreeTimer === 0) {
            // High-density, low-fitness connectors get forced out
            if (p._localDensity >= 6 && fitness < 0.3) {
              // Bad connector in crowd - aggressive pressure
              if (Math.random() < 0.6) { // 60% chance per frame
                p._breakFreeTimer = 90 + Math.random() * 30
                p._stayTimer = 0 // Reset stay timer when breaking free
              }
            } else if (p._localDensity >= 4 && fitness < 0.5) {
              // Moderate density, mediocre fitness
              if (Math.random() < 0.25) { // 25% chance
                p._breakFreeTimer = 60 + Math.random() * 20
                p._stayTimer = 0 // Reset stay timer when breaking free
              }
            }
          }

          // Skip mesh forces when breaking free
          if (p._breakFreeTimer > 0) {
            // Decrement target recalc timer
            if (p._targetRecalcTimer > 0) p._targetRecalcTimer--

            // Only recalculate target every 5 frames (balance between performance and responsiveness)
            let targetX, targetY
            if (p._targetRecalcTimer === 0) {
              // Time to recalculate target
              p._targetRecalcTimer = 5 // Reset for next time

              // Find point FARTHEST from ALL particles (truly most isolated point)
              let bestX = canvas.width / 2
              let bestY = canvas.height / 2
              let maxMinDist = 0

              const gridSize = 50
              for (let gx = gridSize; gx < canvas.width; gx += gridSize) {
                for (let gy = gridSize; gy < canvas.height; gy += gridSize) {
                  let minDist = Infinity
                  for (let j = 0; j < particleCount; j++) {
                    // Consider ALL particles, not just connectors
                    const dx = gx - particles[j].x
                    const dy = gy - particles[j].y
                    const d = Math.sqrt(dx * dx + dy * dy)
                    if (d < minDist) minDist = d
                  }
                if (minDist > maxMinDist) {
                  maxMinDist = minDist
                  bestX = gx
                  bestY = gy
                }
              }
              targetX = bestX
              targetY = bestY

              // Cache the target
              p._connectorTarget = { x: targetX, y: targetY }
            } else {
              // Use cached target
              targetX = p._connectorTarget?.x || canvas.width / 2
              targetY = p._connectorTarget?.y || canvas.height / 2
            }

            // Move toward target
            // Add chaos offset so connectors fan out instead of clumping at same point
            const chaosOffsetX = (Math.random() - 0.5) * (canvas.width * 0.1)
            const chaosOffsetY = (Math.random() - 0.5) * (canvas.height * 0.1)

            const dx = (targetX + chaosOffsetX) - p.x
            const dy = (targetY + chaosOffsetY) - p.y
            const d = Math.sqrt(dx * dx + dy * dy) || 1

            // If close to target, force immediate recalculation (don't get stuck hovering)
            if (d < 50) {
              p._targetRecalcTimer = 0 // Force target recalc next frame
            }

            // Skip if too close to target (prevent NaN)
            if (d >= 30) {
              // Drift toward lowest density area (add to velocity, don't replace)
              // Reduced force for calmer movement
              const densityMultiplier = p._localDensity >= 5 ? 1.2 : 1.0
              p.vx += (dx / d) * 0.25 * densityMultiplier + (Math.random() - 0.5) * 0.15
              p.vy += (dy / d) * 0.25 * densityMultiplier + (Math.random() - 0.5) * 0.15
            }
          } else {
            // NOT breaking free - apply mesh network forces
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

              // Gentle drift toward nearby clusters (like regular particles)
              // Weaker than regular particles so connectors still seek space
              if (d < CLUSTER_RADIUS && d > 0) {
                const strength = ATTRACT * 0.4 * (1 - d / CLUSTER_RADIUS) // 40% of regular attraction
                ax -= (dx / d) * strength // Negative because dx is p - q (away from q)
                ay -= (dy / d) * strength
              }
            }

            // Part 2: VERY loose mesh with other connectors - density-aware
            for (let j = 0; j < particleCount; j++) {
              if (i === j || !particles[j]._isConnector) continue // Only other connectors
              const q = particles[j]
              const dx = q.x - p.x
              const dy = q.y - p.y
              const d = Math.sqrt(dx * dx + dy * dy)

              if (d > 0) {
                // Density-based modification: high density = less attraction, more repulsion
                const densityFactor = Math.min(p._localDensity / 4, 1.5) // 1.0 at 4 nearby, max 1.5

                if (d > CONNECTOR_SPACING * 3.0) {
                  // Too far - VERY WEAK attract (was preventing break-free)
                  // 8x weaker than original, also increased threshold to 360px
                  const strength = CONNECTOR_ATTRACT * 0.0625 * (1 - Math.min(d / 700, 1)) / densityFactor
                  ax += (dx / d) * strength
                  ay += (dy / d) * strength
                } else if (d < CONNECTOR_SPACING * 0.8) {
                  // Too close - repel (weakened, spacing increased to 96px)
                  ax -= (dx / d) * 0.03 * densityFactor
                  ay -= (dy / d) * 0.03 * densityFactor
                }
                // At optimal spacing (96-360px) - no force, free to drift
              }
            }

            // Apply mesh network forces (weakened for high-fitness connectors)
            const fitnessFactor = 1 - (fitness * 0.7) // High fitness = 0.3x force, low fitness = 1.0x force
            p.vx += ax * fitnessFactor
            p.vy += ay * fitnessFactor

            // Random wander (reduced for high-fitness connectors so they can lock in)
            const wanderAmount = 0.08 * (1 - fitness) // High fitness = near-zero wander
            p.vx += (Math.random() - 0.5) * wanderAmount
            p.vy += (Math.random() - 0.5) * wanderAmount
          }
        }

        // Position updates
        // TIME SLOW: Apply to position during grace period, not velocity
        // CONNECTORS move at full speed during grace period (fast af)
        // FRAME FREEZE: Skip position updates entirely (glow still calculated above)
        if (frameFreezeEnabled) {
          // Skip all movement when frame freeze is enabled
          continue  // Skip to next particle (includes boundary checks)
        } else if (inGracePeriod) {
          if (p._isConnector) {
            p.x += p.vx * 1.5  // 150% speed - connectors zoom during grace period
            p.y += p.vy * 1.5
          } else {
            p.x += p.vx * 0.6  // 60% speed for regular particles
            p.y += p.vy * 0.6
          }
        } else {
          p.x += p.vx
          p.y += p.vy
        }

        // Boundary bounces with minimal energy loss (equal/opposite reaction)
        let bounced = false
        if (p.x < 6) { p.x = 6; p.vx *= -0.98; bounced = true }
        if (p.x > canvas.width - 6) { p.x = canvas.width - 6; p.vx *= -0.98; bounced = true }
        if (p.y < 6) { p.y = 6; p.vy *= -0.98; bounced = true }
        if (p.y > canvas.height - 6) { p.y = canvas.height - 6; p.vy *= -0.98; bounced = true }

        // Track consecutive bounces for corner escape
        if (bounced) {
          p._bounceCount++
          // After 2+ consecutive bounces, add speed to escape corners
          if (p._bounceCount > 2) {
            const speedBoost = 1.0 + (p._bounceCount - 2) * 0.3 // Each bounce adds 30% speed
            p.vx *= speedBoost
            p.vy *= speedBoost
            // Cap the max boost
            const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy)
            if (speed > MAX_SPEED * 3) {
              p.vx = (p.vx / speed) * MAX_SPEED * 3
              p.vy = (p.vy / speed) * MAX_SPEED * 3
            }
          }
        } else {
          // Reset bounce count when not bouncing
          p._bounceCount = 0
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
        let alpha = p.base + density * 0.5
        const size = p.size + (density > 0.5 ? 1 : 0)

        // Connector particles get extra brightness bonus (influenced by density like regular particles)
        if (p._isConnector) {
          alpha = Math.min(alpha + p._connectorBrightness, 0.95)
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
  }, [mounted, explosionMode, graceMode, frameFreezeEnabled])

  if (!mounted) return null

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  )
}
