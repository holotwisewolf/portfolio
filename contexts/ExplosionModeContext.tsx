'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface ExplosionModeContextType {
  explosionMode: 'space' | 'radial'
  setExplosionMode: (mode: 'space' | 'radial') => void
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

  const handleSetExplosionMode = (mode: 'space' | 'radial') => {
    setExplosionMode(mode)
    localStorage.setItem('explosionMode', mode)
  }

  return (
    <ExplosionModeContext.Provider value={{ explosionMode, setExplosionMode: handleSetExplosionMode }}>
      {children}
    </ExplosionModeContext.Provider>
  )
}

export { ExplosionModeContext }
