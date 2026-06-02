'use client'

import { useEffect, useRef } from 'react'
import ProfilePanel from '@/components/panels/ProfilePanel'
import StockCharts from '@/components/panels/StockCharts'
import TerminalBar from '@/components/terminal/TerminalBar'
import Desktop from '@/components/window-manager/Desktop'
import { WindowProvider, useWindowStore } from '@/components/window-manager/useWindows'
import Window from '@/components/window-manager/Window'
import CustomCursor from '@/components/ui/CustomCursor'
import StatusBar from '@/components/ui/StatusBar'
import PixelBackground from '@/components/ui/PixelBackground'

function AppContent() {
  const openWindow = useWindowStore((s) => s.openWindow)
  const hasOpenedTerminal = useRef(false)

  // Auto-open Terminal window on load (only once)
  useEffect(() => {
    if (!hasOpenedTerminal.current) {
      openWindow('terminalnav')
      hasOpenedTerminal.current = true
    }
  }, [openWindow])

  const windows = useWindowStore((s) => s.windows)
  const openWindows = Object.values(windows).filter(w => w.isOpen && !w.isMinimized)

  return (
    <>
      <div className="h-screen w-screen overflow-hidden relative flex flex-col">
        <StatusBar />
        <div className="flex-1 flex min-h-0">
          {/* Left Panel - Profile */}
          <div className="w-[280px] flex-shrink-0 border-r border-white bg-black relative z-0">
            <ProfilePanel />
          </div>

          {/* Center Panel - Desktop with Windows - higher z-index */}
          <div className="flex-1 relative z-10">
            <PixelBackground />
            <div className="absolute inset-0">
              <Desktop />
              {openWindows.map((window) => (
                <Window key={window.id} windowId={window.id as any} />
              ))}
            </div>
          </div>

          {/* Right Panel - Market+Dev */}
          <div className="w-[320px] flex-shrink-0 border-l border-white bg-black relative z-0">
            <StockCharts />
          </div>
        </div>

        {/* Terminal Bar - Full Width */}
        <div className="relative z-20">
          <TerminalBar />
        </div>
        <CustomCursor />
      </div>
    </>
  )
}

export default function Home() {
  return (
    <WindowProvider>
      <AppContent />
    </WindowProvider>
  )
}
