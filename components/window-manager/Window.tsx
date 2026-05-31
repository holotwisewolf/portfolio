'use client'

import { useState, useCallback } from 'react'
import { DraggableCore } from 'react-draggable'
import { useWindowStore, type WindowId, windowContentRegistry } from './useWindows'

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

  const [localPosition, setLocalPosition] = useState(
    windowState?.position || { x: 100, y: 100 }
  )

  if (!windowState || !windowState.isOpen || windowState.isMinimized) {
    return null
  }

  const isActive = activeWindow === windowId
  const Content = windowContentRegistry.get(windowId)
  const isMaximized = windowState.isMaximized

  const handleStart = useCallback(() => {
    setActiveWindow(windowId)
  }, [setActiveWindow, windowId])

  const handleDrag = useCallback((e: any, data: { x: number; y: number }) => {
    setLocalPosition({ x: data.x, y: data.y })
  }, [])

  const handleStop = useCallback((e: any, data: { x: number; y: number }) => {
    setLocalPosition({ x: data.x, y: data.y })
    updateWindowPosition(windowId, { x: data.x, y: data.y })
  }, [updateWindowPosition, windowId])

  const handleClick = useCallback(() => {
    setActiveWindow(windowId)
  }, [setActiveWindow, windowId])

  const handleClose = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    closeWindow(windowId)
  }, [closeWindow, windowId])

  const handleMinimize = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    minimizeWindow(windowId)
  }, [minimizeWindow, windowId])

  const handleMaximize = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    maximizeWindow(windowId)
  }, [maximizeWindow, windowId])

  if (isMaximized) {
    return (
      <div
        onClick={handleClick}
        className={`fixed inset-0 flex flex-col border ${
          isActive ? 'border-white z-[9999]' : 'border-gray-600'
        } bg-black`}
        style={{ zIndex: windowState.zIndex, top: 0, left: 0, bottom: 48 }}
      >
        <div className="window-titlebar flex items-center justify-between bg-white text-black px-2 py-1 cursor-move">
          <span className="font-semibold">{windowState.title}</span>
          <div className="flex gap-2">
            <button onClick={handleMinimize} className="hover:bg-gray-300 px-2 py-0.5">
              –
            </button>
            <button onClick={handleMaximize} className="hover:bg-gray-300 px-2 py-0.5">
              □
            </button>
            <button onClick={handleClose} className="hover:bg-red-600 hover:text-white px-2 py-0.5">
              ×
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-auto p-4">
          {Content ? <Content /> : <div>Content not found</div>}
        </div>
      </div>
    )
  }

  return (
    <div
      onClick={handleClick}
      className={`absolute flex flex-col border ${
        isActive ? 'border-white z-[9999]' : 'border-gray-600'
      } bg-black`}
      style={{
        width: windowState.size.width,
        height: windowState.size.height,
        zIndex: windowState.zIndex,
        left: localPosition.x,
        top: localPosition.y,
      }}
    >
      <DraggableCore
        onStart={handleStart}
        onDrag={handleDrag}
        onStop={handleStop}
      >
        <div className="window-titlebar flex items-center justify-between bg-white text-black px-2 py-1 cursor-move">
          <span className="font-semibold">{windowState.title}</span>
          <div className="flex gap-2">
            <button onClick={handleMinimize} className="hover:bg-gray-300 px-2 py-0.5">
              –
            </button>
            <button onClick={handleMaximize} className="hover:bg-gray-300 px-2 py-0.5">
              □
            </button>
            <button onClick={handleClose} className="hover:bg-red-600 hover:text-white px-2 py-0.5">
              ×
            </button>
          </div>
        </div>
      </DraggableCore>
      <div className="flex-1 overflow-auto p-4">
        {Content ? <Content /> : <div>Content not found</div>}
      </div>
    </div>
  )
}
