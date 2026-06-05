'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

type GraceMode = 'enabled' | 'disabled' | 'constant'
type CrystalMode = 'enabled' | 'disabled' | 'constant'
type ConnectorState = 'auto' | 'zen-only' | 'crystal-only' | 'none'
type ConnectorHighlight = 'disabled' | 'red' | 'yellow' | 'cyan'

interface ExplosionModeContextType {
  // Basic settings
  explosionMode: 'space' | 'radial'
  setExplosionMode: (mode: 'space' | 'radial') => void
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
      return saved ? parseInt(saved) : 150
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

  // Handlers with localStorage
  const handleSetExplosionMode = (mode: 'space' | 'radial') => {
    setExplosionMode(mode)
    localStorage.setItem('explosionMode', mode)
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

  return (
    <ExplosionModeContext.Provider value={{
      explosionMode,
      setExplosionMode: handleSetExplosionMode,
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
      setEdgeMargin: handleSetEdgeMargin
    }}>
      {children}
    </ExplosionModeContext.Provider>
  )
}

export { ExplosionModeContext }
