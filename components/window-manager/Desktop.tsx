'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { useWindowStore, registerWindowContent } from './useWindows'
import Welcome from '../windows/Welcome'
import Projects from '../windows/Projects'
import Blog from '../windows/Blog'
import About from '../windows/About'
import Admin from '../windows/Admin'
import TerminalNav from '../windows/TerminalNav'
import Settings from '../windows/Settings'
import ContextMenu from './ContextMenu'

// Register all window contents
registerWindowContent('welcome', Welcome)
registerWindowContent('projects', Projects)
registerWindowContent('blog', Blog)
registerWindowContent('about', About)
registerWindowContent('admin', Admin)
registerWindowContent('terminalnav', TerminalNav)
registerWindowContent('settings', Settings)

const GRID_SIZE = 100
const ICON_WIDTH = 64
const ICON_HEIGHT = 88
const SNAP_THRESHOLD = 60 // Distance to snap to grid

interface DesktopIcon {
  id: string
  label: string
  position: { x: number; y: number }
}

// Grid-aligned positions (GRID_SIZE=100, so positions at 0, 100, 200...)
// Padding configuration (pixels)
const PADDING = { top: 40, left: 20, right: 20, bottom: 100 }

// Icons positioned on the grid within the padded area (start at 0,0 relative to usable area)
const initialIcons: DesktopIcon[] = [
  { id: 'terminalnav', label: 'Terminal', position: { x: 0, y: 0 } },
  { id: 'welcome', label: 'Welcome', position: { x: 100, y: 0 } },
  { id: 'projects', label: 'Projects', position: { x: 200, y: 0 } },
  { id: 'blog', label: 'Blog', position: { x: 0, y: 100 } },
  { id: 'about', label: 'About', position: { x: 100, y: 100 } },
  { id: 'admin', label: 'Admin', position: { x: 200, y: 100 } },
  { id: 'settings', label: 'Settings', position: { x: 300, y: 0 } },
]

export default function Desktop() {
  const openWindow = useWindowStore((s) => s.openWindow)
  const [icons, setIcons] = useState<DesktopIcon[]>(initialIcons)
  const [draggingIcon, setDraggingIcon] = useState<string | null>(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [currentPosition, setCurrentPosition] = useState<{ x: number; y: number } | null>(null)
  const [snapPosition, setSnapPosition] = useState<{ x: number; y: number } | null>(null)
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; iconId?: string } | null>(null)
  const [clickCount, setClickCount] = useState(0)
  const [clickTimer, setClickTimer] = useState<NodeJS.Timeout | null>(null)

  const desktopRef = useRef<HTMLDivElement>(null)

  // Handle double-click to open
  const handleIconClick = (e: React.MouseEvent, icon: DesktopIcon) => {
    e.preventDefault()
    e.stopPropagation()

    setClickCount(prev => {
      const newCount = prev + 1

      if (clickTimer) {
        clearTimeout(clickTimer)
      }

      const timer = setTimeout(() => {
        setClickCount(0)
      }, 300)
      setClickTimer(timer)

      if (newCount === 2) {
        clearTimeout(timer)
        setClickCount(0)
        setTimeout(() => openWindow(icon.id as any), 0)
      }

      return newCount
    })
  }

  // Handle icon drag start
  const handleIconMouseDown = (e: React.MouseEvent, icon: DesktopIcon) => {
    if (e.button !== 0) return

    e.preventDefault()
    e.stopPropagation()

    const rect = (e.target as HTMLElement).closest('button')?.getBoundingClientRect()
    if (!rect) return

    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    })
    setDraggingIcon(icon.id)
    setCurrentPosition(icon.position)
  }

  // Handle mouse move during drag
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!draggingIcon || !desktopRef.current) return

    const desktopRect = desktopRef.current.getBoundingClientRect()

    let x = e.clientX - desktopRect.left - dragOffset.x
    let y = e.clientY - desktopRect.top - dragOffset.y

    // Calculate usable area (accounting for padding)
    const usableWidth = desktopRect.width - PADDING.left - PADDING.right
    const usableHeight = desktopRect.height - PADDING.top - PADDING.bottom

    // Current position relative to usable area
    const relativeX = x - PADDING.left
    const relativeY = y - PADDING.top

    // Snap to grid within usable area
    const snapX = Math.round(relativeX / GRID_SIZE) * GRID_SIZE
    const snapY = Math.round(relativeY / GRID_SIZE) * GRID_SIZE

    // Enforce boundaries (relative to usable area)
    const minX = 0
    const maxX = usableWidth - ICON_WIDTH
    const minY = 0
    const maxY = usableHeight - ICON_HEIGHT

    // Constrain position to usable area
    const constrainedX = Math.max(minX, Math.min(relativeX, maxX))
    const constrainedY = Math.max(minY, Math.min(relativeY, maxY))

    setCurrentPosition({ x: constrainedX, y: constrainedY })

    // Check if near snap position
    const distance = Math.sqrt(Math.pow(relativeX - snapX, 2) + Math.pow(relativeY - snapY, 2))
    const isNearSnap = distance < SNAP_THRESHOLD

    if (isNearSnap) {
      const clampedSnapX = Math.max(minX, Math.min(snapX, maxX))
      const clampedSnapY = Math.max(minY, Math.min(snapY, maxY))
      setSnapPosition({ x: clampedSnapX, y: clampedSnapY })
    } else {
      setSnapPosition(null)
    }
  }, [draggingIcon, dragOffset])

  // Handle mouse up to end drag
  const handleMouseUp = useCallback(() => {
    if (!draggingIcon || !desktopRef.current) return

    // Use snap position if available, otherwise use current position
    const finalPosition = snapPosition || currentPosition

    if (finalPosition) {
      setIcons(prev => {
        // Check if another icon is at the target position
        const targetIcon = prev.find(icon =>
          icon.id !== draggingIcon &&
          Math.abs(icon.position.x - finalPosition.x) < 5 &&
          Math.abs(icon.position.y - finalPosition.y) < 5
        )

        const draggedIcon = prev.find(icon => icon.id === draggingIcon)
        const originalPosition = draggedIcon?.position

        return prev.map(icon => {
          if (icon.id === draggingIcon) {
            return { ...icon, position: finalPosition }
          }
          if (targetIcon && icon.id === targetIcon.id && originalPosition) {
            // Swap positions
            return { ...icon, position: originalPosition }
          }
          return icon
        })
      })
    }

    setDraggingIcon(null)
    setCurrentPosition(null)
    setSnapPosition(null)
  }, [draggingIcon, snapPosition, currentPosition])

  // Set up global mouse event listeners
  useEffect(() => {
    if (!draggingIcon) return

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [draggingIcon, handleMouseMove, handleMouseUp])

  // Handle right-click context menu
  const handleContextMenu = (e: React.MouseEvent, iconId?: string) => {
    e.preventDefault()
    e.stopPropagation()
    setContextMenu({ x: e.clientX, y: e.clientY, iconId })
  }

  const closeContextMenu = () => setContextMenu(null)

  // Handle context menu actions
  const handleMenuAction = (action: string) => {
    if (action === 'open' && contextMenu?.iconId) {
      openWindow(contextMenu.iconId as any)
    } else {
      console.log('Context menu action:', action)
    }
    closeContextMenu()
  }

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (clickTimer) {
        clearTimeout(clickTimer)
      }
    }
  }, [clickTimer])

  return (
    <div
      ref={desktopRef}
      className="relative h-full w-full"
      onContextMenu={(e) => handleContextMenu(e)}
      onClick={closeContextMenu}
    >
      {/* Spacer bars for padding - icons positioned within the center area */}
      <div className="absolute left-0 top-0 bottom-0 pointer-events-none" style={{ width: `${PADDING.left}px` }} />
      <div className="absolute right-0 top-0 bottom-0 pointer-events-none" style={{ width: `${PADDING.right}px` }} />
      <div className="absolute left-0 right-0 top-0 pointer-events-none" style={{ height: `${PADDING.top}px` }} />
      <div className="absolute left-0 right-0 bottom-0 pointer-events-none" style={{ height: `${PADDING.bottom}px` }} />
      {/* Snap preview highlight */}
      {snapPosition && (
        <div
          className="absolute bg-white/10 border border-white/50 pointer-events-none rounded"
          style={{
            left: snapPosition.x + PADDING.left,
            top: snapPosition.y + PADDING.top,
            width: ICON_WIDTH,
            height: ICON_HEIGHT,
          }}
        />
      )}

      {/* Icons */}
      {icons.map((icon) => {
        const isDragging = icon.id === draggingIcon
        const displayPosition = isDragging && currentPosition
          ? currentPosition
          : icon.position

        // Add padding offset when rendering (icons stored relative to usable area)
        const renderX = displayPosition.x + PADDING.left
        const renderY = displayPosition.y + PADDING.top

        return (
          <button
            key={icon.id}
            onMouseDown={(e) => handleIconMouseDown(e, icon)}
            onClick={(e) => handleIconClick(e, icon)}
            onContextMenu={(e) => handleContextMenu(e, icon.id)}
            className={`icon-triple-hover absolute flex flex-col items-center gap-1 p-2 transition-colors ${
              isDragging ? 'cursor-grabbing z-50' : 'cursor-grab'
            }`}
            style={{ left: renderX, top: renderY }}
          >
            <div className="w-12 h-12 border border-current flex items-center justify-center text-2xl">
              {icon.label[0]}
            </div>
            <span className="text-xs">{icon.label}</span>
          </button>
        )
      })}

      {/* Context Menu */}
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          iconId={contextMenu.iconId}
          onClose={closeContextMenu}
          onAction={handleMenuAction}
        />
      )}
    </div>
  )
}
