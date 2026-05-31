'use client'

import { useEffect } from 'react'
import Desktop from '@/components/window-manager/Desktop'
import Taskbar from '@/components/window-manager/Taskbar'
import { WindowProvider, useWindowStore } from '@/components/window-manager/useWindows'
import Welcome from '@/components/windows/Welcome'

function AppContent() {
  const openWindow = useWindowStore((s) => s.openWindow)

  useEffect(() => {
    // Auto-open welcome window on load
    openWindow('welcome', 'Welcome', Welcome)
  }, [openWindow])

  return (
    <div className="h-screen w-screen overflow-hidden bg-black">
      <Desktop />
      <Taskbar />
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
