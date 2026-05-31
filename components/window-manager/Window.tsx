'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
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

  const dragStateRef = useRef({
    isDragging: false,
    startX: 0,
    startY: 0,
    initialLeft: 0,
    initialTop: 0
  })

  const [localPosition, setLocalPosition] = useState({ x: 0, y: 0 })
  const [isBooting, setIsBooting] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [loadProgress, setLoadProgress] = useState(0)

  // Update local position when window state changes (but not during drag)
  useEffect(() => {
    if (windowState && !dragStateRef.current.isDragging) {
      setLocalPosition(windowState.position)
    }
  }, [windowState?.position])

  // Trigger boot animation on mount
  useEffect(() => {
    const timer = setTimeout(() => setIsBooting(false), 300)
    return () => clearTimeout(timer)
  }, [])

  // Simulate loading progress when window opens
  useEffect(() => {
    if (windowState?.isLoading) {
      setIsLoading(true)
      setLoadProgress(0)

      const interval = setInterval(() => {
        setLoadProgress((prev) => {
          const next = prev + Math.random() * 15 + 5
          if (next >= 100) {
            clearInterval(interval)
            setIsLoading(false)
            return 100
          }
          return next
        })
      }, 200)

      return () => clearInterval(interval)
    } else {
      setIsLoading(false)
      setLoadProgress(100)
    }
  }, [windowState?.isLoading])

  if (!windowState || !windowState.isOpen || windowState.isMinimized) {
    return null
  }

  const isActive = activeWindow === windowId
  const Content = windowContentRegistry.get(windowId)
  const isMaximized = windowState.isMaximized

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return // Only left click
    setActiveWindow(windowId)

    dragStateRef.current = {
      isDragging: true,
      startX: e.clientX,
      startY: e.clientY,
      initialLeft: localPosition.x,
      initialTop: localPosition.y
    }
  }, [setActiveWindow, windowId, localPosition])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!dragStateRef.current.isDragging) return

    const dx = e.clientX - dragStateRef.current.startX
    const dy = e.clientY - dragStateRef.current.startY

    const newLeft = dragStateRef.current.initialLeft + dx
    const newTop = dragStateRef.current.initialTop + dy

    setLocalPosition({ x: newLeft, y: newTop })
  }, [])

  const handleMouseUp = useCallback((e: MouseEvent) => {
    if (!dragStateRef.current.isDragging) return

    const dx = e.clientX - dragStateRef.current.startX
    const dy = e.clientY - dragStateRef.current.startY

    const newLeft = dragStateRef.current.initialLeft + dx
    const newTop = dragStateRef.current.initialTop + dy

    dragStateRef.current.isDragging = false
    setLocalPosition({ x: newLeft, y: newTop })
    updateWindowPosition(windowId, { x: newLeft, y: newTop })
  }, [updateWindowPosition, windowId])

  // Set up global mouse event listeners for drag
  useEffect(() => {
    if (dragStateRef.current.isDragging) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
      return () => {
        window.removeEventListener('mousemove', handleMouseMove)
        window.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [dragStateRef.current.isDragging, handleMouseMove, handleMouseUp])

  const handleClick = useCallback(() => {
    if (!dragStateRef.current.isDragging) {
      setActiveWindow(windowId)
    }
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
        className={`fixed flex flex-col border ${
          isActive ? 'border-white z-[9999]' : 'border-gray-600'
        } ${isBooting ? 'window-booting' : ''} bg-black`}
        style={{
          zIndex: windowState.zIndex,
          top: 0,
          left: 0,
          right: 0,
          bottom: '48px'
        }}
      >
        <div
          onMouseDown={handleMouseDown}
          className="window-titlebar flex items-center justify-between bg-white text-black px-2 py-1 cursor-move select-none"
        >
          <div className="flex items-center gap-2">
            <span className="status-pulse" />
            <span className="font-semibold">{windowState.title}</span>
          </div>
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
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="w-full max-w-xs">
                <div className="loading-bar-container">
                  <div
                    className="loading-bar-fill"
                    style={{ width: `${loadProgress}%` }}
                  />
                  <div className="loading-text">
                    LOADING {Math.floor(loadProgress)}%
                  </div>
                </div>
              </div>
            </div>
          ) : Content ? (
            <Content />
          ) : (
            <div>Content not found</div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div
      onClick={handleClick}
      className={`absolute flex flex-col border ${
        isActive ? 'border-white z-[9999]' : 'border-gray-600'
      } ${isBooting ? 'window-booting' : ''} bg-black`}
      style={{
        width: windowState.size.width,
        height: windowState.size.height,
        zIndex: windowState.zIndex,
        left: localPosition.x,
        top: localPosition.y,
      }}
    >
      <div
        onMouseDown={handleMouseDown}
        className="window-titlebar flex items-center justify-between bg-white text-black px-2 py-1 cursor-move select-none"
      >
        <div className="flex items-center gap-2">
          <span className="status-pulse" />
          <span className="font-semibold">{windowState.title}</span>
        </div>
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
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="w-full max-w-xs">
              <div className="loading-bar-container">
                <div
                  className="loading-bar-fill"
                  style={{ width: `${loadProgress}%` }}
                />
                <div className="loading-text">
                  LOADING {Math.floor(loadProgress)}%
                </div>
              </div>
            </div>
          </div>
        ) : Content ? (
          <Content />
        ) : (
          <div>Content not found</div>
        )}
      </div>
    </div>
  )
}
