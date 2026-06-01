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
    console.log('AppContent mounted')
    if (!hasOpenedTerminal.current) {
      openWindow('terminalnav')
      hasOpenedTerminal.current = true
    }
  }, [openWindow])

  const windows = useWindowStore((s) => s.windows)
  const openWindows = Object.values(windows).filter(w => w.isOpen && !w.isMinimized)

  console.log('AppContent render, openWindows:', openWindows.length)

  return (
    <div className="h-screen w-screen overflow-hidden bg-black relative flex flex-col" style={{ zIndex: 1 }}>
      <PixelBackground />
      <StatusBar />
      <div className="flex-1 flex min-h-0">
        {/* Left Panel - Profile */}
        <div
          className="w-[280px] flex-shrink-0 border-r border-white bg-black"
          style={{ minHeight: '100px', backgroundColor: '#000' }}
          data-testid="left-panel"
        >
          <div className="text-red-500 text-xs">LEFT PANEL DEBUG</div>
          <ProfilePanel />
        </div>

        {/* Center Panel - Desktop with Windows */}
        <div className="flex-1 relative bg-black">
          <div className="text-green-500 text-xs">CENTER PANEL</div>
          <Desktop />
          {openWindows.map((window) => (
            <Window key={`${window.id}-${window.zIndex}`} windowId={window.id as any} />
          ))}
        </div>

        {/* Right Panel - Market+Dev */}
        <div
          className="w-[320px] flex-shrink-0 border-l border-white bg-black"
          style={{ minHeight: '100px', backgroundColor: '#000' }}
          data-testid="right-panel"
        >
          <div className="text-blue-500 text-xs">RIGHT PANEL DEBUG</div>
          <StockCharts />
        </div>
      </div>

      {/* Terminal Bar - Full Width */}
      <TerminalBar />
      <CustomCursor />
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
