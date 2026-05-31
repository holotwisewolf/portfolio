'use client'

import { useWindowStore } from './useWindows'
import Window from './Window'

export default function Taskbar() {
  const windows = useWindowStore((s) => s.windows)
  const activeWindow = useWindowStore((s) => s.activeWindow)
  const restoreWindow = useWindowStore((s) => s.restoreWindow)
  const minimizeWindow = useWindowStore((s) => s.minimizeWindow)

  const openWindows = Object.values(windows).filter((w) => w.isOpen)

  const handleTaskbarClick = (windowId: string) => {
    const window = windows[windowId]
    if (window.isMinimized) {
      restoreWindow(windowId as any)
    } else if (activeWindow === windowId) {
      minimizeWindow(windowId as any)
    } else {
      restoreWindow(windowId as any)
    }
  }

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 h-12 bg-white text-black flex items-center px-2 gap-2 border-t-4 border-black">
        <div className="flex items-center gap-4">
          <span className="font-bold px-2">DESKTOP</span>
          <div className="h-6 w-px bg-black" />
          {openWindows.map((window) => (
            <button
              key={window.id}
              onClick={() => handleTaskbarClick(window.id)}
              className={`px-3 py-1 border border-black hover:bg-black hover:text-white transition-colors ${
                activeWindow === window.id ? 'bg-black text-white' : ''
              }`}
            >
              {window.title}
            </button>
          ))}
        </div>
      </div>

      {/* Render open windows */}
      {openWindows.map((window) => (
        <Window key={window.id} windowId={window.id as any} />
      ))}
    </>
  )
}
