'use client'

import { useEffect, useState } from 'react'
import Desktop from '@/components/window-manager/Desktop'
import TerminalBar from '@/components/terminal/TerminalBar'
import { WindowProvider, useWindowStore } from '@/components/window-manager/useWindows'
import Welcome from '@/components/windows/Welcome'
import CustomCursor from '@/components/ui/CustomCursor'
import StatusBar from '@/components/ui/StatusBar'
import PixelBackground from '@/components/ui/PixelBackground'
import StockCharts from '@/components/panels/StockCharts'
import FileListing from '@/components/panels/FileListing'

function AppContent() {
  const openWindow = useWindowStore((s) => s.openWindow)
  const [terminalPath, setTerminalPath] = useState('')

  useEffect(() => {
    // Auto-open welcome window on load
    openWindow('welcome' as any)
  }, [openWindow])

  return (
    <div className="h-screen w-screen overflow-hidden bg-black relative">
      <PixelBackground />
      <StatusBar />
      <div className="h-[calc(100%-24px)] relative z-10 flex">
        {/* Left Panel - File Listing */}
        <div className="w-64 flex-shrink-0">
          <FileListing currentPath={terminalPath} />
        </div>

        {/* Main Area - Desktop with Windows */}
        <div className="flex-1 relative">
          <Desktop />
          <TerminalBar onPathChange={setTerminalPath} />
          <CustomCursor />
        </div>

        {/* Right Panel - Stock Charts */}
        <div className="w-80 flex-shrink-0">
          <StockCharts />
        </div>
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
