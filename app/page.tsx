'use client'

import { useContext } from 'react'
import ProfilePanel from '@/components/panels/ProfilePanel'
import StockCharts from '@/components/panels/StockCharts'
import TerminalBar from '@/components/terminal/TerminalBar'
import Desktop from '@/components/window-manager/Desktop'
import { WindowProvider, useWindowStore } from '@/components/window-manager/useWindows'
import Window from '@/components/window-manager/Window'
import CustomCursor from '@/components/ui/CustomCursor'
import StatusBar from '@/components/ui/StatusBar'
import PixelBackground from '@/components/ui/PixelBackground'
import { ExplosionModeProvider, ExplosionModeContext } from '@/contexts/ExplosionModeContext'

function AppContent() {
  const windows = useWindowStore((s) => s.windows)
  const openWindows = Object.values(windows).filter(w => w.isOpen && !w.isMinimized)
  const { explosionMode } = useContext(ExplosionModeContext)!

  return (
    <>
      <div className="h-screen w-screen overflow-hidden relative flex flex-col">
        <StatusBar />
        <div className="flex-1 flex min-h-0">
          {/* Left Panel - Profile */}
          <div className="w-[280px] flex-shrink-0 border-r border-white bg-black relative z-10">
            <ProfilePanel />
          </div>

          {/* Center Panel - Desktop */}
          <div className="flex-1 relative z-0">
            <PixelBackground explosionMode={explosionMode} />
            <div className="absolute inset-0">
              <Desktop />
            </div>
          </div>

          {/* Right Panel - Market+Dev */}
          <div className="w-[320px] flex-shrink-0 border-l border-white bg-black relative z-10">
            <StockCharts />
          </div>
        </div>

        {/* Windows - separate layer above all panels */}
        <div className="absolute inset-0 pointer-events-none z-[10002]" style={{ top: '24px' }}>
          {openWindows.map((window) => (
            <div key={window.id} className="pointer-events-auto">
              <Window windowId={window.id as any} />
            </div>
          ))}
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
      <ExplosionModeProvider>
        <AppContent />
      </ExplosionModeProvider>
    </WindowProvider>
  )
}
