'use client'

import { useEffect, useRef } from 'react'

interface ContextMenuProps {
  x: number
  y: number
  iconId?: string
  onClose: () => void
  onAction: (action: string) => void
}

export default function ContextMenu({ x, y, iconId, onClose, onAction }: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null)

  const handleAction = (action: string) => {
    onAction(action)
  }

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [onClose])

  // Adjust position if menu would go off screen
  useEffect(() => {
    if (menuRef.current) {
      const rect = menuRef.current.getBoundingClientRect()
      const screenWidth = window.innerWidth
      const screenHeight = window.innerHeight

      let adjustedX = x
      let adjustedY = y

      if (x + rect.width > screenWidth) {
        adjustedX = screenWidth - rect.width - 10
      }
      if (y + rect.height > screenHeight) {
        adjustedY = screenHeight - rect.height - 10
      }

      menuRef.current.style.left = `${adjustedX}px`
      menuRef.current.style.top = `${adjustedY}px`
    }
  }, [x, y])

  // Icon-specific menu items
  const iconMenuItems = [
    { label: 'Open', action: 'open', icon: '📂' },
    { divider: true },
    { label: 'Rename', action: 'rename', icon: '✏️' },
    { label: 'Delete', action: 'delete', icon: '🗑️' },
    { divider: true },
    { label: 'Properties', action: 'properties', icon: '⚙️' },
  ]

  // Desktop menu items
  const desktopMenuItems = [
    { label: 'New Folder', action: 'new-folder', icon: '📁' },
    { label: 'New File', action: 'new-file', icon: '📄' },
    { divider: true },
    { label: 'Refresh', action: 'refresh', icon: '🔄' },
    { label: 'Properties', action: 'properties', icon: '⚙️' },
  ]

  const menuItems = iconId ? iconMenuItems : desktopMenuItems

  return (
    <div
      ref={menuRef}
      className="fixed bg-black border border-white z-[10000] min-w-[200px] shadow-xl"
      style={{ left: x, top: y }}
    >
      {menuItems.map((item, index) => {
        if (item.divider) {
          return <div key={index} className="border-t border-gray-800 my-1" />
        }

        return (
          <button
            key={index}
            onClick={() => handleAction(item.action)}
            className="w-full text-left px-4 py-2 text-sm text-white hover:bg-white hover:text-black transition-colors flex items-center gap-3"
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </button>
        )
      })}
    </div>
  )
}
