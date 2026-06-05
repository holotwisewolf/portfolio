'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

type GraceMode = 'enabled' | 'disabled' | 'constant'
type CrystalMode = 'enabled' | 'disabled' | 'constant'
type ConnectorState = 'auto' | 'zen-only' | 'crystal-only' | 'none'

interface ExplosionModeContextType {
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
}

const ExplosionModeContext = createContext<ExplosionModeContextType | undefined>(undefined)

export function ExplosionModeProvider({ children }: { children: ReactNode }) {
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
      return saved === 'true' // Default false
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
      return saved !== 'false' // Default true
    }
    return true
  })

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
      setCalmnessEnabled: handleSetCalmnessEnabled
    }}>
      {children}
    </ExplosionModeContext.Provider>
  )
}

export { ExplosionModeContext }
