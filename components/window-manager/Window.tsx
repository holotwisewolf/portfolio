'use client'

import { useRef } from 'react'
import Draggable from 'react-draggable'
import { useWindowStore, type WindowId } from './useWindows'

interface WindowProps {
  windowId: WindowId
}

export default function Window({ windowId }: WindowProps) {
  const windowState = useWindowStore((s) => s.windows[windowId])
  const activeWindow = useWindowStore((s) => s.activeWindow)
  const closeWindow = useWindowStore((s) => s.closeWindow)
  const minimizeWindow = useWindowStore((s) => s.minimizeWindow)
  const maximizeWindow = useWindowStore((s) => s.maximizeWindow)
  const setActiveWindow = useWindowStore((s) => s.setActiveWindow)
  const updateWindowPosition = useWindowStore((s) => s.updateWindowPosition)

  const windowRef = useRef<HTMLDivElement>(null)

  if (!windowState || !windowState.isOpen || windowState.isMinimized) {
    return null
  }

  const isActive = activeWindow === windowId
  const Content = windowState.content as React.ComponentType | null

  const handleStop = (_e: any, data: { x: number; y: number }) => {
    updateWindowPosition(windowId, { x: data.x, y: data.y })
  }

  const handleClick = () => {
    setActiveWindow(windowId)
  }

  const isMaximized = windowState.isMaximized

  return (
    <Draggable
      handle=".window-titlebar"
      disabled={isMaximized}
      defaultPosition={windowState.position}
      onStop={handleStop}
      bounds="parent"
    >
      <div
        ref={windowRef}
        onClick={handleClick}
        className={`absolute flex flex-col border ${
          isActive ? 'border-white z-[9999]' : 'border-gray-600'
        } bg-black`}
        style={{
          width: isMaximized ? '100vw' : windowState.size.width,
          height: isMaximized ? 'calc(100vh - 48px)' : windowState.size.height,
          zIndex: windowState.zIndex,
          left: isMaximized ? 0 : windowState.position.x,
          top: isMaximized ? 0 : windowState.position.y,
        }}
      >
        {/* Title Bar */}
        <div className="window-titlebar flex items-center justify-between bg-white text-black px-2 py-1 cursor-move">
          <span className="font-semibold">{windowState.title}</span>
          <div className="flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation()
                minimizeWindow(windowId)
              }}
              className="hover:bg-gray-300 px-2 py-0.5"
              aria-label="Minimize"
            >
              –
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                maximizeWindow(windowId)
              }}
              className="hover:bg-gray-300 px-2 py-0.5"
              aria-label="Maximize"
            >
              □
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                closeWindow(windowId)
              }}
              className="hover:bg-red-600 hover:text-white px-2 py-0.5"
              aria-label="Close"
            >
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4">
          {Content && <Content />}
        </div>
      </div>
    </Draggable>
  )
}
