'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

type GraceMode = 'enabled' | 'disabled' | 'constant'
type ConnectorState = 'auto' | 'zen-only' | 'crystal-only' | 'none'

interface ExplosionModeContextType {
  explosionMode: 'space' | 'radial'
  setExplosionMode: (mode: 'space' | 'radial') => void
  graceMode: GraceMode
  setGraceMode: (mode: GraceMode) => void
  frameFreezeEnabled: boolean
  setFrameFreezeEnabled: (enabled: boolean) => void
  crystallizationEnabled: boolean
  setCrystallizationEnabled: (enabled: boolean) => void
  connectorState: ConnectorState
  setConnectorState: (state: ConnectorState) => void
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

  const [crystallizationEnabled, setCrystallizationEnabled] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('crystallizationEnabled')
      return saved !== 'false' // Default true
    }
    return true
  })

  const [connectorState, setConnectorState] = useState<ConnectorState>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('connectorState') as ConnectorState | null
      return saved || 'auto'
    }
    return 'auto'
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

  const handleSetCrystallizationEnabled = (enabled: boolean) => {
    setCrystallizationEnabled(enabled)
    localStorage.setItem('crystallizationEnabled', enabled.toString())
  }

  const handleSetConnectorState = (state: ConnectorState) => {
    setConnectorState(state)
    localStorage.setItem('connectorState', state)
  }

  return (
    <ExplosionModeContext.Provider value={{
      explosionMode,
      setExplosionMode: handleSetExplosionMode,
      graceMode,
      setGraceMode: handleSetGraceMode,
      frameFreezeEnabled,
      setFrameFreezeEnabled: handleSetFrameFreezeEnabled,
      crystallizationEnabled,
      setCrystallizationEnabled: handleSetCrystallizationEnabled,
      connectorState,
      setConnectorState: handleSetConnectorState
    }}>
      {children}
    </ExplosionModeContext.Provider>
  )
}

export { ExplosionModeContext }
