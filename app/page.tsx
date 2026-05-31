'use client'

import { useEffect } from 'react'
import Desktop from '@/components/window-manager/Desktop'
import TerminalBar from '@/components/terminal/TerminalBar'
import { WindowProvider, useWindowStore } from '@/components/window-manager/useWindows'
import Welcome from '@/components/windows/Welcome'
import CustomCursor from '@/components/ui/CustomCursor'
import StatusBar from '@/components/ui/StatusBar'

function AppContent() {
  const openWindow = useWindowStore((s) => s.openWindow)

  useEffect(() => {
    // Auto-open welcome window on load
    openWindow('welcome' as any)
  }, [openWindow])

  return (
    <div className="h-screen w-screen overflow-hidden bg-black relative">
      <div className="pulsing-grid" />
      <StatusBar />
      <div className="h-[calc(100%-24px)] relative z-10">
        <Desktop />
        <TerminalBar />
        <CustomCursor />
      </div>
    </div>
  )
}

export default function Home() {
  return (
    <WindowProvider>
      <AppContent />
    </WindowProvider>
  )
}
