'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

type GraceMode = 'enabled' | 'disabled' | 'constant'
type CrystalMode = 'enabled' | 'disabled' | 'constant'
type ConnectorState = 'auto' | 'zen-only' | 'crystal-only' | 'none'
type ConnectorHighlight = 'disabled' | 'red' | 'yellow' | 'cyan'
type CursorInteractionMode = 'none' | 'attract' | 'collide' | 'ring' | 'gather'
type WoozyMode = 'disabled' | 'enabled' | 'extreme'
type DiscoMode = 'disabled' | 'enabled' | 'extreme'
type ParticleShape = 'square' | 'circle' | 'triangle' | 'pentagon' | 'hexagon'

// Safe localStorage parsers with NaN validation
const safeParseFloat = (value: string | null, defaultValue: number): number => {
  if (value === null) return defaultValue
  const parsed = parseFloat(value)
  return isNaN(parsed) ? defaultValue : parsed
}

const safeParseInt = (value: string | null, defaultValue: number): number => {
  if (value === null) return defaultValue
  const parsed = parseInt(value, 10)
  return isNaN(parsed) ? defaultValue : parsed
}

interface ExplosionModeContextType {
  // Basic settings
  explosionMode: 'space' | 'radial'
  setExplosionMode: (mode: 'space' | 'radial') => void
  spaceFinderRatio: number
  setSpaceFinderRatio: (ratio: number) => void
  graceMode: GraceMode
  setGraceMode: (mode: GraceMode) => void
  frameFreezeEnabled: boolean
  setFrameFreezeEnabled: (enabled: boolean) => void
  crystalMode: CrystalMode
  setCrystalMode: (mode: CrystalMode) => void
  connectorState: ConnectorState
  setConnectorState: (state: ConnectorState) => void
  calmnessEnabled: boolean
  setCalmnessEnabled: (enabled: boolean) => void
  connectorHighlight: ConnectorHighlight
  setConnectorHighlight: (color: ConnectorHighlight) => void

  // Advanced physics settings
  particleCount: number
  setParticleCount: (count: number) => void
  connectorRatio: number
  setConnectorRatio: (ratio: number) => void
  maxSpeed: number
  setMaxSpeed: (speed: number) => void
  damping: number
  setDamping: (damping: number) => void
  clusterRadius: number
  setClusterRadius: (radius: number) => void
  attract: number
  setAttract: (attract: number) => void
  connectionDistance: number
  setConnectionDistance: (distance: number) => void
  connectorSpacing: number
  setConnectorSpacing: (spacing: number) => void
  edgeMargin: number
  setEdgeMargin: (margin: number) => void
  connectorAttract: number
  setConnectorAttract: (attract: number) => void
  connectorAttractBase: number
  setConnectorAttractBase: (base: number) => void
  connectorAttractRangeNormal: number
  setConnectorAttractRangeNormal: (range: number) => void
  connectorAttractRangeCrystal: number
  setConnectorAttractRangeCrystal: (range: number) => void
  connectorRepelStrength: number
  setConnectorRepelStrength: (strength: number) => void
  connectorRepelRange: number
  setConnectorRepelRange: (range: number) => void
  targetSeekForce: number
  setTargetSeekForce: (force: number) => void
  edgeRepelForceNormal: number
  setEdgeRepelForceNormal: (force: number) => void
  edgeRepelForceUrgent: number
  setEdgeRepelForceUrgent: (force: number) => void
  edgeUrgent: number
  setEdgeUrgent: (urgent: number) => void
  edgeMomentumReaction: number
  setEdgeMomentumReaction: (reaction: number) => void

  // Cursor interactions
  cursorInteractionMode: CursorInteractionMode
  setCursorInteractionMode: (mode: CursorInteractionMode) => void
  cursorRippleEnabled: boolean
  setCursorRippleEnabled: (enabled: boolean) => void
  cursorConnectParticles: boolean
  setCursorConnectParticles: (enabled: boolean) => void
  cursorClickExplodeCluster: boolean
  setCursorClickExplodeCluster: (enabled: boolean) => void

  // Visual settings
  connectionOpacity: number
  setConnectionOpacity: (opacity: number) => void
  discoMode: DiscoMode
  setDiscoMode: (mode: DiscoMode) => void
  woozyMode: WoozyMode
  setWoozyMode: (mode: WoozyMode) => void
  particleShape: ParticleShape
  setParticleShape: (shape: ParticleShape) => void

  // Desktop icon interactions
  iconAttractParticles: boolean
  setIconAttractParticles: (enabled: boolean) => void
  iconCollideParticles: boolean
  setIconCollideParticles: (enabled: boolean) => void
  iconConnectParticles: boolean
  setIconConnectParticles: (enabled: boolean) => void
}

const ExplosionModeContext = createContext<ExplosionModeContextType | undefined>(undefined)

export function ExplosionModeProvider({ children }: { children: ReactNode }) {
  // Basic settings
  const [explosionMode, setExplosionMode] = useState<'space' | 'radial'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('explosionMode') as 'space' | 'radial' | null
      return saved || 'radial'
    }
    return 'radial'
  })

  const [spaceFinderRatio, setSpaceFinderRatio] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('spaceFinderRatio')
      return safeParseFloat(saved, 0.3)
    }
    return 0.3
  })

  const [graceMode, setGraceMode] = useState<GraceMode>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('graceMode') as GraceMode | null
      return saved || 'enabled'
    }
    return 'enabled'
  })

  const [frameFreezeEnabled, setFrameFreezeEnabled] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('frameFreezeEnabled')
      return saved === 'true'
    }
    return false
  })

  const [crystalMode, setCrystalMode] = useState<CrystalMode>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('crystalMode') as CrystalMode | null
      return saved || 'enabled'
    }
    return 'enabled'
  })

  const [connectorState, setConnectorState] = useState<ConnectorState>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('connectorState') as ConnectorState | null
      return saved || 'auto'
    }
    return 'auto'
  })

  const [calmnessEnabled, setCalmnessEnabled] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('calmnessEnabled')
      return saved !== 'false'
    }
    return true
  })

  const [connectorHighlight, setConnectorHighlight] = useState<ConnectorHighlight>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('connectorHighlight') as ConnectorHighlight | null
      return saved || 'disabled'
    }
    return 'disabled'
  })

  // Advanced physics settings
  const [particleCount, setParticleCount] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('particleCount')
      return safeParseInt(saved, 150)
    }
    return 150
  })

  const [connectorRatio, setConnectorRatio] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('connectorRatio')
      return saved ? parseFloat(saved) : 0.1
    }
    return 0.1
  })

  const [maxSpeed, setMaxSpeed] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('maxSpeed')
      return saved ? parseFloat(saved) : 0.8
    }
    return 0.8
  })

  const [damping, setDamping] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('damping')
      return saved ? parseFloat(saved) : 0.98
    }
    return 0.98
  })

  const [clusterRadius, setClusterRadius] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('clusterRadius')
      return saved ? parseInt(saved) : 55
    }
    return 55
  })

  const [attract, setAttract] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('attract')
      return saved ? parseFloat(saved) : 0.006
    }
    return 0.006
  })

  const [connectionDistance, setConnectionDistance] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('connectionDistance')
      return saved ? parseInt(saved) : 130
    }
    return 130
  })

  const [connectorSpacing, setConnectorSpacing] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('connectorSpacing')
      return saved ? parseInt(saved) : 120
    }
    return 120
  })

  const [edgeMargin, setEdgeMargin] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('edgeMargin')
      return saved ? parseInt(saved) : 15
    }
    return 15
  })

  const [connectorAttract, setConnectorAttract] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('connectorAttract')
      return saved ? parseFloat(saved) : 0.003
    }
    return 0.003
  })

  const [connectorAttractBase, setConnectorAttractBase] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('connectorAttractBase')
      return saved ? parseFloat(saved) : 0.0625
    }
    return 0.0625
  })

  const [connectorAttractRangeNormal, setConnectorAttractRangeNormal] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('connectorAttractRangeNormal')
      return saved ? parseInt(saved) : 360
    }
    return 360
  })

  const [connectorAttractRangeCrystal, setConnectorAttractRangeCrystal] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('connectorAttractRangeCrystal')
      return saved ? parseInt(saved) : 180
    }
    return 180
  })

  const [connectorRepelStrength, setConnectorRepelStrength] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('connectorRepelStrength')
      return saved ? parseFloat(saved) : 0.03
    }
    return 0.03
  })

  const [connectorRepelRange, setConnectorRepelRange] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('connectorRepelRange')
      return saved ? parseInt(saved) : 96
    }
    return 96
  })

  const [targetSeekForce, setTargetSeekForce] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('targetSeekForce')
      return saved ? parseFloat(saved) : 0.2
    }
    return 0.2
  })

  const [edgeRepelForceNormal, setEdgeRepelForceNormal] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('edgeRepelForceNormal')
      return saved ? parseFloat(saved) : 0.03
    }
    return 0.03
  })

  const [edgeRepelForceUrgent, setEdgeRepelForceUrgent] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('edgeRepelForceUrgent')
      return saved ? parseFloat(saved) : 0.06
    }
    return 0.06
  })

  const [edgeUrgent, setEdgeUrgent] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('edgeUrgent')
      return saved ? parseInt(saved) : 10
    }
    return 10
  })

  const [edgeMomentumReaction, setEdgeMomentumReaction] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('edgeMomentumReaction')
      return saved ? parseFloat(saved) : 0.5
    }
    return 0.5
  })

  // Cursor interaction settings
  const [cursorInteractionMode, setCursorInteractionMode] = useState<CursorInteractionMode>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('cursorInteractionMode') as CursorInteractionMode | null
      return saved || 'none'
    }
    return 'none'
  })

  const [cursorRippleEnabled, setCursorRippleEnabled] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('cursorRippleEnabled')
      return saved === 'true'
    }
    return false
  })

  const [cursorConnectParticles, setCursorConnectParticles] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('cursorConnectParticles')
      return saved === 'true'
    }
    return false
  })

  const [cursorClickExplodeCluster, setCursorClickExplodeCluster] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('cursorClickExplodeCluster')
      return saved === 'true'
    }
    return false
  })

  // Visual settings
  const [connectionOpacity, setConnectionOpacity] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('connectionOpacity')
      return safeParseFloat(saved, 0.3)
    }
    return 0.3
  })

  const [discoMode, setDiscoMode] = useState<DiscoMode>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('discoMode') as DiscoMode | null
      return saved || 'disabled'
    }
    return 'disabled'
  })

  const [woozyMode, setWoozyMode] = useState<WoozyMode>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('woozyMode') as WoozyMode | null
      return saved || 'disabled'
    }
    return 'disabled'
  })

  const [particleShape, setParticleShape] = useState<ParticleShape>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('particleShape') as ParticleShape | null
      return saved || 'square'
    }
    return 'square'
  })

  // Panel collision — particles bounce off side panel borders
  const [panelCollision, setPanelCollision] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('panelCollision') === 'true'
    }
    return false
  })

  // Window interaction settings
  const [iconAttractParticles, setIconAttractParticles] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('iconAttractParticles')
      return saved === 'true'
    }
    return false
  })

  const [iconCollideParticles, setIconCollideParticles] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('iconCollideParticles')
      return saved === 'true'
    }
    return false
  })

  const [iconConnectParticles, setIconConnectParticles] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('iconConnectParticles')
      return saved === 'true'
    }
    return false
  })

  // Handlers with localStorage
  const handleSetExplosionMode = (mode: 'space' | 'radial') => {
    setExplosionMode(mode)
    localStorage.setItem('explosionMode', mode)
  }

  const handleSetSpaceFinderRatio = (ratio: number) => {
    setSpaceFinderRatio(ratio)
    localStorage.setItem('spaceFinderRatio', ratio.toString())
  }

  const handleSetGraceMode = (mode: GraceMode) => {
    setGraceMode(mode)
    localStorage.setItem('graceMode', mode)
  }

  const handleSetFrameFreezeEnabled = (enabled: boolean) => {
    setFrameFreezeEnabled(enabled)
    localStorage.setItem('frameFreezeEnabled', enabled.toString())
  }

  const handleSetCrystalMode = (mode: CrystalMode) => {
    setCrystalMode(mode)
    localStorage.setItem('crystalMode', mode)
  }

  const handleSetConnectorState = (state: ConnectorState) => {
    setConnectorState(state)
    localStorage.setItem('connectorState', state)
  }

  const handleSetCalmnessEnabled = (enabled: boolean) => {
    setCalmnessEnabled(enabled)
    localStorage.setItem('calmnessEnabled', enabled.toString())
  }

  const handleSetConnectorHighlight = (color: ConnectorHighlight) => {
    setConnectorHighlight(color)
    localStorage.setItem('connectorHighlight', color)
  }

  const handleSetParticleCount = (count: number) => {
    setParticleCount(count)
    localStorage.setItem('particleCount', count.toString())
  }

  const handleSetConnectorRatio = (ratio: number) => {
    setConnectorRatio(ratio)
    localStorage.setItem('connectorRatio', ratio.toString())
  }

  const handleSetMaxSpeed = (speed: number) => {
    setMaxSpeed(speed)
    localStorage.setItem('maxSpeed', speed.toString())
  }

  const handleSetDamping = (damping: number) => {
    setDamping(damping)
    localStorage.setItem('damping', damping.toString())
  }

  const handleSetClusterRadius = (radius: number) => {
    setClusterRadius(radius)
    localStorage.setItem('clusterRadius', radius.toString())
  }

  const handleSetAttract = (attract: number) => {
    setAttract(attract)
    localStorage.setItem('attract', attract.toString())
  }

  const handleSetConnectionDistance = (distance: number) => {
    setConnectionDistance(distance)
    localStorage.setItem('connectionDistance', distance.toString())
  }

  const handleSetConnectorSpacing = (spacing: number) => {
    setConnectorSpacing(spacing)
    localStorage.setItem('connectorSpacing', spacing.toString())
  }

  const handleSetEdgeMargin = (margin: number) => {
    setEdgeMargin(margin)
    localStorage.setItem('edgeMargin', margin.toString())
  }

  const handleSetConnectorAttract = (attract: number) => {
    setConnectorAttract(attract)
    localStorage.setItem('connectorAttract', attract.toString())
  }

  const handleSetConnectorAttractBase = (base: number) => {
    setConnectorAttractBase(base)
    localStorage.setItem('connectorAttractBase', base.toString())
  }

  const handleSetConnectorAttractRangeNormal = (range: number) => {
    setConnectorAttractRangeNormal(range)
    localStorage.setItem('connectorAttractRangeNormal', range.toString())
  }

  const handleSetConnectorAttractRangeCrystal = (range: number) => {
    setConnectorAttractRangeCrystal(range)
    localStorage.setItem('connectorAttractRangeCrystal', range.toString())
  }

  const handleSetConnectorRepelStrength = (strength: number) => {
    setConnectorRepelStrength(strength)
    localStorage.setItem('connectorRepelStrength', strength.toString())
  }

  const handleSetConnectorRepelRange = (range: number) => {
    setConnectorRepelRange(range)
    localStorage.setItem('connectorRepelRange', range.toString())
  }

  const handleSetTargetSeekForce = (force: number) => {
    setTargetSeekForce(force)
    localStorage.setItem('targetSeekForce', force.toString())
  }

  const handleSetEdgeRepelForceNormal = (force: number) => {
    setEdgeRepelForceNormal(force)
    localStorage.setItem('edgeRepelForceNormal', force.toString())
  }

  const handleSetEdgeRepelForceUrgent = (force: number) => {
    setEdgeRepelForceUrgent(force)
    localStorage.setItem('edgeRepelForceUrgent', force.toString())
  }

  const handleSetEdgeUrgent = (urgent: number) => {
    setEdgeUrgent(urgent)
    localStorage.setItem('edgeUrgent', urgent.toString())
  }

  const handleSetEdgeMomentumReaction = (reaction: number) => {
    setEdgeMomentumReaction(reaction)
    localStorage.setItem('edgeMomentumReaction', reaction.toString())
  }

  const handleSetCursorInteractionMode = (mode: CursorInteractionMode) => {
    setCursorInteractionMode(mode)
    localStorage.setItem('cursorInteractionMode', mode)
  }

  const handleSetCursorRippleEnabled = (enabled: boolean) => {
    setCursorRippleEnabled(enabled)
    localStorage.setItem('cursorRippleEnabled', enabled.toString())
  }

  const handleSetCursorConnectParticles = (enabled: boolean) => {
    setCursorConnectParticles(enabled)
    localStorage.setItem('cursorConnectParticles', enabled.toString())
  }

  const handleSetCursorClickExplodeCluster = (enabled: boolean) => {
    setCursorClickExplodeCluster(enabled)
    localStorage.setItem('cursorClickExplodeCluster', enabled.toString())
  }

  const handleSetConnectionOpacity = (opacity: number) => {
    setConnectionOpacity(opacity)
    localStorage.setItem('connectionOpacity', opacity.toString())
  }

  const handleSetDiscoMode = (mode: DiscoMode) => {
    // Runtime validation to prevent invalid enum values
    const validModes: DiscoMode[] = ['disabled', 'enabled', 'extreme']
    if (!validModes.includes(mode)) {
      console.warn(`Invalid discoMode: ${mode}, defaulting to 'disabled'`)
      mode = 'disabled'
    }
    setDiscoMode(mode)
    localStorage.setItem('discoMode', mode)
  }

  const handleSetWoozyMode = (mode: WoozyMode) => {
    // Runtime validation to prevent invalid enum values
    const validModes: WoozyMode[] = ['disabled', 'enabled', 'extreme']
    if (!validModes.includes(mode)) {
      console.warn(`Invalid woozyMode: ${mode}, defaulting to 'disabled'`)
      mode = 'disabled'
    }
    setWoozyMode(mode)
    localStorage.setItem('woozyMode', mode)
  }

  const handleSetParticleShape = (shape: ParticleShape) => {
    // Runtime validation to prevent invalid enum values
    const validShapes: ParticleShape[] = ['square', 'circle', 'triangle', 'pentagon', 'hexagon']
    if (!validShapes.includes(shape)) {
      console.warn(`Invalid particleShape: ${shape}, defaulting to 'square'`)
      shape = 'square'
    }
    setParticleShape(shape)
    localStorage.setItem('particleShape', shape)
  }

  const handleSetIconAttractParticles = (enabled: boolean) => {
    setIconAttractParticles(enabled)
    localStorage.setItem('iconAttractParticles', enabled.toString())
  }

  const handleSetIconCollideParticles = (enabled: boolean) => {
    setIconCollideParticles(enabled)
    localStorage.setItem('iconCollideParticles', enabled.toString())
  }

  const handleSetIconConnectParticles = (enabled: boolean) => {
    setIconConnectParticles(enabled)
    localStorage.setItem('iconConnectParticles', enabled.toString())
  }

  return (
    <ExplosionModeContext.Provider value={{
      explosionMode,
      setExplosionMode: handleSetExplosionMode,
      spaceFinderRatio,
      setSpaceFinderRatio: handleSetSpaceFinderRatio,
      graceMode,
      setGraceMode: handleSetGraceMode,
      frameFreezeEnabled,
      setFrameFreezeEnabled: handleSetFrameFreezeEnabled,
      crystalMode,
      setCrystalMode: handleSetCrystalMode,
      connectorState,
      setConnectorState: handleSetConnectorState,
      calmnessEnabled,
      setCalmnessEnabled: handleSetCalmnessEnabled,
      connectorHighlight,
      setConnectorHighlight: handleSetConnectorHighlight,
      particleCount,
      setParticleCount: handleSetParticleCount,
      connectorRatio,
      setConnectorRatio: handleSetConnectorRatio,
      maxSpeed,
      setMaxSpeed: handleSetMaxSpeed,
      damping,
      setDamping: handleSetDamping,
      clusterRadius,
      setClusterRadius: handleSetClusterRadius,
      attract,
      setAttract: handleSetAttract,
      connectionDistance,
      setConnectionDistance: handleSetConnectionDistance,
      connectorSpacing,
      setConnectorSpacing: handleSetConnectorSpacing,
      edgeMargin,
      setEdgeMargin: handleSetEdgeMargin,
      connectorAttract,
      setConnectorAttract: handleSetConnectorAttract,
      connectorAttractBase,
      setConnectorAttractBase: handleSetConnectorAttractBase,
      connectorAttractRangeNormal,
      setConnectorAttractRangeNormal: handleSetConnectorAttractRangeNormal,
      connectorAttractRangeCrystal,
      setConnectorAttractRangeCrystal: handleSetConnectorAttractRangeCrystal,
      connectorRepelStrength,
      setConnectorRepelStrength: handleSetConnectorRepelStrength,
      connectorRepelRange,
      setConnectorRepelRange: handleSetConnectorRepelRange,
      targetSeekForce,
      setTargetSeekForce: handleSetTargetSeekForce,
      edgeRepelForceNormal,
      setEdgeRepelForceNormal: handleSetEdgeRepelForceNormal,
      edgeRepelForceUrgent,
      setEdgeRepelForceUrgent: handleSetEdgeRepelForceUrgent,
      edgeUrgent,
      setEdgeUrgent: handleSetEdgeUrgent,
      edgeMomentumReaction,
      setEdgeMomentumReaction: handleSetEdgeMomentumReaction,
      cursorInteractionMode,
      setCursorInteractionMode: handleSetCursorInteractionMode,
      cursorRippleEnabled,
      setCursorRippleEnabled: handleSetCursorRippleEnabled,
      cursorConnectParticles,
      setCursorConnectParticles: handleSetCursorConnectParticles,
      cursorClickExplodeCluster,
      setCursorClickExplodeCluster: handleSetCursorClickExplodeCluster,
      connectionOpacity,
      setConnectionOpacity: handleSetConnectionOpacity,
      discoMode,
      setDiscoMode: handleSetDiscoMode,
      woozyMode,
      setWoozyMode: handleSetWoozyMode,
      particleShape,
      setParticleShape: handleSetParticleShape,
      panelCollision,
      setPanelCollision: (v: boolean) => {
        setPanelCollision(v)
        localStorage.setItem('panelCollision', String(v))
      },
      iconAttractParticles,
      setIconAttractParticles: handleSetIconAttractParticles,
      iconCollideParticles,
      setIconCollideParticles: handleSetIconCollideParticles,
      iconConnectParticles,
      setIconConnectParticles: handleSetIconConnectParticles
    }}>
      {children}
    </ExplosionModeContext.Provider>
  )
}

export { ExplosionModeContext }
