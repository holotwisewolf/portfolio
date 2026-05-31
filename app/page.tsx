'use client'

import Desktop from '@/components/window-manager/Desktop'
import Taskbar from '@/components/window-manager/Taskbar'
import { WindowProvider } from '@/components/window-manager/useWindows'

export default function Home() {
  return (
    <WindowProvider>
      <div className="h-screen w-screen overflow-hidden bg-black">
        <Desktop />
        <Taskbar />
      </div>
    </WindowProvider>
  )
}
