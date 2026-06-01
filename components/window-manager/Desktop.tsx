'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { useWindowStore, registerWindowContent } from './useWindows'
import Welcome from '../windows/Welcome'
import Projects from '../windows/Projects'
import Blog from '../windows/Blog'
import About from '../windows/About'
import Admin from '../windows/Admin'
import TerminalNav from '../windows/TerminalNav'
import ContextMenu from './ContextMenu'

// Register all window contents
registerWindowContent('welcome', Welcome)
registerWindowContent('projects', Projects)
registerWindowContent('blog', Blog)
registerWindowContent('about', About)
registerWindowContent('admin', Admin)
registerWindowContent('terminalnav', TerminalNav)

const GRID_SIZE = 80 // Grid cell size for icon snap

interface DesktopIcon {
  id: string
  label: string
  position: { x: number; y: number }
}

const initialIcons: DesktopIcon[] = [
  { id: 'terminalnav', label: 'Terminal', position: { x: 30, y: 30 } },
  { id: 'welcome', label: 'Welcome', position: { x: 30, y: 130 } },
  { id: 'projects', label: 'Projects', position: { x: 140, y: 30 } },
  { id: 'blog', label: 'Blog', position: { x: 140, y: 130 } },
  { id: 'about', label: 'About', position: { x: 250, y: 30 } },
  { id: 'admin', label: 'Admin', position: { x: 250, y: 130 } },
]

export default function Desktop() {
  const openWindow = useWindowStore((s) => s.openWindow)
  const [icons, setIcons] = useState<DesktopIcon[]>(initialIcons)
  const [draggingIcon, setDraggingIcon] = useState<string | null>(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [snapPosition, setSnapPosition] = useState<{ x: number; y: number } | null>(null)
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null)

  const desktopRef = useRef<HTMLDivElement>(null)

  // Handle icon click
  const handleIconClick = (e: React.MouseEvent, icon: DesktopIcon) => {
    e.preventDefault()
    e.stopPropagation()
    openWindow(icon.id as any)
  }

  // Handle icon drag start
  const handleIconMouseDown = (e: React.MouseEvent, icon: DesktopIcon) => {
    if (e.button !== 0) return // Only left click for drag

    e.preventDefault()
    e.stopPropagation()

    const rect = (e.target as HTMLElement).getBoundingClientRect()
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    })
    setDraggingIcon(icon.id)
  }

  // Handle mouse move during drag
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!draggingIcon || !desktopRef.current) return

    const desktopRect = desktopRef.current.getBoundingClientRect()
    const x = e.clientX - desktopRect.left - dragOffset.x
    const y = e.clientY - desktopRect.top - dragOffset.y

    // Calculate snap grid position
    const snapX = Math.round(x / GRID_SIZE) * GRID_SIZE
    const snapY = Math.round(y / GRID_SIZE) * GRID_SIZE

    setSnapPosition({ x: snapX, y: snapY })
  }, [draggingIcon, dragOffset])

  // Handle mouse up to end drag
  const handleMouseUp = useCallback(() => {
    if (!draggingIcon || !snapPosition) return

    setIcons(prev => prev.map(icon =>
      icon.id === draggingIcon
        ? { ...icon, position: snapPosition }
        : icon
    ))

    setDraggingIcon(null)
    setSnapPosition(null)
  }, [draggingIcon, snapPosition])

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
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
    setContextMenu({ x: e.clientX, y: e.clientY })
  }

  const closeContextMenu = () => setContextMenu(null)

  // Handle context menu actions
  const handleMenuAction = (action: string) => {
    console.log('Context menu action:', action)
    // TODO: Implement actions (create folder, etc.)
    closeContextMenu()
  }

  return (
    <div
      ref={desktopRef}
      className="relative h-full w-full"
      onContextMenu={handleContextMenu}
      onClick={closeContextMenu}
    >
      {/* Snap preview */}
      {snapPosition && (
        <div
          className="absolute bg-white/10 border border-white pointer-events-none"
          style={{
            left: snapPosition.x,
            top: snapPosition.y,
            width: 64,
            height: 64,
          }}
        />
      )}

      {/* Icons */}
      {icons.map((icon) => {
        const isDragging = icon.id === draggingIcon
        const displayPosition = isDragging && snapPosition
          ? snapPosition
          : icon.position

        return (
          <button
            key={icon.id}
            onMouseDown={(e) => handleIconMouseDown(e, icon)}
            onClick={(e) => handleIconClick(e, icon)}
            className={`icon-triple-hover absolute flex flex-col items-center gap-1 p-2 transition-colors ${
              isDragging ? 'cursor-grabbing z-50' : 'cursor-grab'
            }`}
            style={{ left: displayPosition.x, top: displayPosition.y }}
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
          onClose={closeContextMenu}
          onAction={handleMenuAction}
        />
      )}
    </div>
  )
}
