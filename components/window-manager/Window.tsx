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
  const updateWindowSize = useWindowStore((s) => s.updateWindowSize)

  const dragStateRef = useRef({
    isDragging: false,
    startX: 0,
    startY: 0,
    initialLeft: 0,
    initialTop: 0
  })

  const resizeStateRef = useRef({
    isResizing: false,
    edge: '' as 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw' | '',
    startX: 0,
    startY: 0,
    initialWidth: 0,
    initialHeight: 0,
    initialLeft: 0,
    initialTop: 0
  })

  const [localPosition, setLocalPosition] = useState({ x: 0, y: 0 })
  const [localSize, setLocalSize] = useState({ width: 800, height: 600 })
  const localSizeRef = useRef({ width: 800, height: 600 })
  const [isBooting, setIsBooting] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [loadProgress, setLoadProgress] = useState(0)
  const [isDraggingOrResizing, setIsDraggingOrResizing] = useState(false)
  // Track when we're in the middle of a user interaction to prevent useEffect overrides
  const isInteractingRef = useRef(false)

  // Initialize local state from window state on mount
  useEffect(() => {
    if (windowState) {
      setLocalPosition(windowState.position)
      setLocalSize(windowState.size)
      localSizeRef.current = windowState.size
    }
  }, [windowId])

  // Update local position when window state changes (but not during interaction)
  useEffect(() => {
    if (!isInteractingRef.current && windowState && !dragStateRef.current.isDragging && !resizeStateRef.current.isResizing) {
      setLocalPosition(windowState.position)
      setLocalSize(windowState.size)
      localSizeRef.current = windowState.size
    }
  }, [windowState?.position, windowState?.size])

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

  // Early return if window shouldn't render (must be after all hooks)
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
    setIsDraggingOrResizing(true)
    isInteractingRef.current = true
  }, [setActiveWindow, windowId, localPosition])

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

  const handleResizeStart = useCallback((e: React.MouseEvent, edge: 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw') => {
    if (e.button !== 0 || isMaximized) return
    e.stopPropagation()
    setActiveWindow(windowId)

    resizeStateRef.current = {
      isResizing: true,
      edge,
      startX: e.clientX,
      startY: e.clientY,
      initialWidth: localSize.width,
      initialHeight: localSize.height,
      initialLeft: localPosition.x,
      initialTop: localPosition.y
    }
    setIsDraggingOrResizing(true)
    isInteractingRef.current = true
  }, [setActiveWindow, windowId, localSize, localPosition, isMaximized])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (dragStateRef.current.isDragging) {
      const dx = e.clientX - dragStateRef.current.startX
      const dy = e.clientY - dragStateRef.current.startY

      const newLeft = dragStateRef.current.initialLeft + dx
      const newTop = dragStateRef.current.initialTop + dy

      setLocalPosition({ x: newLeft, y: newTop })
    }

    if (resizeStateRef.current.isResizing) {
      const dx = e.clientX - resizeStateRef.current.startX
      const dy = e.clientY - resizeStateRef.current.startY

      let newWidth = resizeStateRef.current.initialWidth
      let newHeight = resizeStateRef.current.initialHeight
      let newLeft = resizeStateRef.current.initialLeft
      let newTop = resizeStateRef.current.initialTop

      const edge = resizeStateRef.current.edge

      if (edge.includes('e')) newWidth = resizeStateRef.current.initialWidth + dx
      if (edge.includes('w')) {
        newWidth = resizeStateRef.current.initialWidth - dx
        newLeft = resizeStateRef.current.initialLeft + dx
      }
      if (edge.includes('s')) newHeight = resizeStateRef.current.initialHeight + dy
      if (edge.includes('n')) {
        newHeight = resizeStateRef.current.initialHeight - dy
        newTop = resizeStateRef.current.initialTop + dy
      }

      const finalSize = { width: Math.max(400, newWidth), height: Math.max(300, newHeight) }
      setLocalSize(finalSize)
      localSizeRef.current = finalSize
      setLocalPosition({ x: newLeft, y: newTop })
    }
  }, [])

  const handleMouseUp = useCallback((e: MouseEvent) => {
    if (dragStateRef.current.isDragging) {
      const dx = e.clientX - dragStateRef.current.startX
      const dy = e.clientY - dragStateRef.current.startY

      const newLeft = dragStateRef.current.initialLeft + dx
      const newTop = dragStateRef.current.initialTop + dy

      dragStateRef.current.isDragging = false
      setLocalPosition({ x: newLeft, y: newTop })
      updateWindowPosition(windowId, { x: newLeft, y: newTop })
    }

    if (resizeStateRef.current.isResizing) {
      resizeStateRef.current.isResizing = false
      updateWindowSize(windowId, localSizeRef.current)
      updateWindowPosition(windowId, localPosition)
    }

    // Clear interaction flag AFTER updating store
    setIsDraggingOrResizing(false)
    isInteractingRef.current = false

    // Force clear refs if something went wrong
    setTimeout(() => {
      if (dragStateRef.current.isDragging) dragStateRef.current.isDragging = false
      if (resizeStateRef.current.isResizing) resizeStateRef.current.isResizing = false
    }, 100)
  }, [updateWindowPosition, updateWindowSize, windowId, localPosition])

  // Set up global mouse event listeners for drag and resize
  useEffect(() => {
    if (!isDraggingOrResizing) return

    const handleGlobalMouseMove = (e: MouseEvent) => {
      handleMouseMove(e)
    }

    const handleGlobalMouseUp = (e: MouseEvent) => {
      handleMouseUp(e)
    }

    window.addEventListener('mousemove', handleGlobalMouseMove)
    window.addEventListener('mouseup', handleGlobalMouseUp)

    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove)
      window.removeEventListener('mouseup', handleGlobalMouseUp)
    }
  }, [isDraggingOrResizing, handleMouseMove, handleMouseUp])

  // Safety net: add document-level mouseup when interaction starts
  useEffect(() => {
    if (!isDraggingOrResizing) return

    const handleSafetyMouseUp = () => {
      setTimeout(() => {
        if (dragStateRef.current.isDragging || resizeStateRef.current.isResizing) {
          dragStateRef.current.isDragging = false
          resizeStateRef.current.isResizing = false
          setIsDraggingOrResizing(false)
          isInteractingRef.current = false
        }
      }, 50)
    }

    document.addEventListener('mouseup', handleSafetyMouseUp)
    return () => document.removeEventListener('mouseup', handleSafetyMouseUp)
  }, [isDraggingOrResizing])

  if (isMaximized) {
    return (
      <div
        onClick={handleClick}
        className={`fixed flex flex-col border ${
          isActive ? 'border-white z-[9999]' : 'border-gray-600'
        } ${isBooting ? 'window-booting' : ''} bg-black`}
        style={{
          zIndex: windowState.zIndex,
          top: '24px', // Below StatusBar
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

        {/* Resize handles */}
        <div
          onMouseDown={(e) => handleResizeStart(e, 'n')}
          className="absolute top-0 left-0 right-0 h-2 cursor-n-resize z-10 hover:bg-gray-800/50"
        />
        <div
          onMouseDown={(e) => handleResizeStart(e, 's')}
          className="absolute bottom-0 left-0 right-0 h-2 cursor-s-resize z-10 hover:bg-gray-800/50"
        />
        <div
          onMouseDown={(e) => handleResizeStart(e, 'e')}
          className="absolute top-0 right-0 bottom-0 w-2 cursor-e-resize z-10 hover:bg-gray-800/50"
        />
        <div
          onMouseDown={(e) => handleResizeStart(e, 'w')}
          className="absolute top-0 left-0 bottom-0 w-2 cursor-w-resize z-10 hover:bg-gray-800/50"
        />
        <div
          onMouseDown={(e) => handleResizeStart(e, 'ne')}
          className="absolute top-0 right-0 w-4 h-4 cursor-ne-resize z-10 hover:bg-gray-800/50"
        />
        <div
          onMouseDown={(e) => handleResizeStart(e, 'nw')}
          className="absolute top-0 left-0 w-4 h-4 cursor-nw-resize z-10 hover:bg-gray-800/50"
        />
        <div
          onMouseDown={(e) => handleResizeStart(e, 'se')}
          className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize z-10 hover:bg-gray-800/50"
        />
        <div
          onMouseDown={(e) => handleResizeStart(e, 'sw')}
          className="absolute bottom-0 left-0 w-4 h-4 cursor-sw-resize z-10 hover:bg-gray-800/50"
        />
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
        width: localSize.width,
        height: localSize.height,
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

      {/* Resize handles */}
      <div
        onMouseDown={(e) => handleResizeStart(e, 'n')}
        className="absolute top-0 left-0 right-0 h-2 cursor-n-resize z-10 hover:bg-gray-800/50"
      />
      <div
        onMouseDown={(e) => handleResizeStart(e, 's')}
        className="absolute bottom-0 left-0 right-0 h-2 cursor-s-resize z-10 hover:bg-gray-800/50"
      />
      <div
        onMouseDown={(e) => handleResizeStart(e, 'e')}
        className="absolute top-0 right-0 bottom-0 w-2 cursor-e-resize z-10 hover:bg-gray-800/50"
      />
      <div
        onMouseDown={(e) => handleResizeStart(e, 'w')}
        className="absolute top-0 left-0 bottom-0 w-2 cursor-w-resize z-10 hover:bg-gray-800/50"
      />
      <div
        onMouseDown={(e) => handleResizeStart(e, 'ne')}
        className="absolute top-0 right-0 w-4 h-4 cursor-ne-resize z-10 hover:bg-gray-800/50"
      />
      <div
        onMouseDown={(e) => handleResizeStart(e, 'nw')}
        className="absolute top-0 left-0 w-4 h-4 cursor-nw-resize z-10 hover:bg-gray-800/50"
      />
      <div
        onMouseDown={(e) => handleResizeStart(e, 'se')}
        className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize z-10 hover:bg-gray-800/50"
      />
      <div
        onMouseDown={(e) => handleResizeStart(e, 'sw')}
        className="absolute bottom-0 left-0 w-4 h-4 cursor-sw-resize z-10 hover:bg-gray-800/50"
      />
    </div>
  )
}
