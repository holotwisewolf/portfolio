'use client'

import { useContext, useEffect, useState } from 'react'
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
import WorkspaceContainer from '@/components/workspace/WorkspaceContainer'
import WorkspaceTransition from '@/components/workspace/WorkspaceTransition'

function AppContent() {
  const windows = useWindowStore((s) => s.windows)
  const activeWorkspace = useWindowStore((s) => s.activeWorkspace)
  const workspaceTransitioning = useWindowStore((s) => s.workspaceTransitioning)
  const openWindows = Object.values(windows).filter(w => w.isOpen && !w.isMinimized)
  const { explosionMode } = useContext(ExplosionModeContext)!

  // collapsible side panels — state survives reloads via localStorage
  const [leftCollapsed, setLeftCollapsed] = useState(false)
  const [rightCollapsed, setRightCollapsed] = useState(false)
  const [leftZone, setLeftZone] = useState(false)
  const [rightZone, setRightZone] = useState(false)

  useEffect(() => {
    setLeftCollapsed(localStorage.getItem('panel:left') === '1')
    setRightCollapsed(localStorage.getItem('panel:right') === '1')
  }, [])

  useEffect(() => {
    const toggle = (e: KeyboardEvent) => {
      if (e.key === '[') setLeftCollapsed(v => { localStorage.setItem('panel:left', v ? '0' : '1'); return !v })
      if (e.key === ']') setRightCollapsed(v => { localStorage.setItem('panel:right', v ? '0' : '1'); return !v })
    }
    window.addEventListener('keydown', toggle)
    return () => window.removeEventListener('keydown', toggle)
  }, [])

  return (
    <>
      <div className="h-screen w-screen overflow-hidden relative flex flex-col">
        <StatusBar />
        {workspaceTransitioning || activeWorkspace ? null : (
          <div className="flex-1 flex min-h-0">
            {/* Left Panel - Profile (absolute overlay, doesn't affect layout) */}
            <div
              className={`absolute left-0 top-0 bottom-0 bg-black z-20 border-r border-[#333] transition-transform duration-300 ease-in-out ${
                leftCollapsed ? '-translate-x-full' : 'translate-x-0'
              }`}
              style={{ width: 280 }}
            >
              <ProfilePanel />
            </div>
            {/* Left collapse zone - white glow + arrow, click to toggle */}
            <div
              onMouseEnter={() => setLeftZone(true)}
              onMouseLeave={() => setLeftZone(false)}
              onClick={() => setLeftCollapsed(v => { localStorage.setItem('panel:left', v ? '0' : '1'); return !v })}
              className={`absolute left-0 top-0 bottom-0 w-8 z-10 cursor-pointer transition-opacity duration-300 ${
                leftZone || leftCollapsed ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <div
                className={`absolute left-0 top-0 bottom-0 w-full transition-shadow duration-300 ${
                  leftZone ? 'shadow-[inset_72px_0_96px_-16px_rgba(255,255,255,0.1)]' : 'shadow-none'
                }`}
              />
              {leftCollapsed && (
                <div className="absolute top-1/2 -translate-y-1/2 left-2 text-[#555] text-[14px] font-orbit select-none">
                  {leftZone ? '››' : '›'}
                </div>
              )}
            </div>

            {/* Center Panel - Desktop (particles full-width, icons constrained to visible center) */}
            <div className="flex-1 relative z-0">
              <PixelBackground explosionMode={explosionMode} />
              <div
                className="absolute inset-y-0 transition-[left,right] duration-300 ease-in-out"
                style={{
                  left: leftCollapsed ? 0 : 280,
                  right: rightCollapsed ? 0 : 320,
                }}
              >
                <Desktop />
              </div>
            </div>

            {/* Right Panel - Market+Dev (absolute overlay) */}
            <div
              className={`absolute right-0 top-0 bottom-0 bg-black z-20 border-l border-[#333] transition-transform duration-300 ease-in-out ${
                rightCollapsed ? 'translate-x-full' : 'translate-x-0'
              }`}
              style={{ width: 320 }}
            >
              <StockCharts />
            </div>
            {/* Right collapse zone - white glow + arrow, click to toggle */}
            <div
              onMouseEnter={() => setRightZone(true)}
              onMouseLeave={() => setRightZone(false)}
              onClick={() => setRightCollapsed(v => { localStorage.setItem('panel:right', v ? '0' : '1'); return !v })}
              className={`absolute right-0 top-0 bottom-0 w-8 z-10 cursor-pointer transition-opacity duration-300 ${
                rightZone || rightCollapsed ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <div
                className={`absolute right-0 top-0 bottom-0 w-full transition-shadow duration-300 ${
                  rightZone ? 'shadow-[inset_-72px_0_96px_-16px_rgba(255,255,255,0.1)]' : 'shadow-none'
                }`}
              />
              {rightCollapsed && (
                <div className="absolute top-1/2 -translate-y-1/2 right-2 text-[#555] text-[14px] font-orbit select-none">
                  {rightZone ? '‹‹' : '‹'}
                </div>
              )}
            </div>
          </div>
        )}

        {activeWorkspace && !workspaceTransitioning && (
          <div className="flex-1 min-h-0 relative">
            <WorkspaceContainer />
          </div>
        )}

        {/* Windows - separate layer above all panels (hidden during workspace) */}
        {!activeWorkspace && !workspaceTransitioning && (
          <div className="absolute inset-0 pointer-events-none z-[10002]" style={{ top: '24px' }}>
            {openWindows.map((window) => (
              <div key={window.id} className="pointer-events-auto">
                <Window windowId={window.id as any} />
              </div>
            ))}
          </div>
        )}

        {/* Transition overlay - above everything */}
        {workspaceTransitioning && <WorkspaceTransition />}

        {/* Terminal Bar - overlays the bottom so panels never shift on resize/minimize */}
        {!workspaceTransitioning && (
          <div className="absolute bottom-0 left-0 right-0 z-20">
            <TerminalBar />
          </div>
        )}
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
