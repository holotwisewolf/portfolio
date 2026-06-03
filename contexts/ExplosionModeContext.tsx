'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

type GraceMode = 'enabled' | 'disabled' | 'constant'

interface ExplosionModeContextType {
  explosionMode: 'space' | 'radial'
  setExplosionMode: (mode: 'space' | 'radial') => void
  graceMode: GraceMode
  setGraceMode: (mode: GraceMode) => void
  frameFreezeEnabled: boolean
  setFrameFreezeEnabled: (enabled: boolean) => void
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

  return (
    <ExplosionModeContext.Provider value={{
      explosionMode,
      setExplosionMode: handleSetExplosionMode,
      graceMode,
      setGraceMode: handleSetGraceMode,
      frameFreezeEnabled,
      setFrameFreezeEnabled: handleSetFrameFreezeEnabled
    }}>
      {children}
    </ExplosionModeContext.Provider>
  )
}

export { ExplosionModeContext }
