'use client'

import { useEffect } from 'react'
import { useWindowStore, registerWindowContent } from './useWindows'
import Welcome from '../windows/Welcome'
import Projects from '../windows/Projects'
import Blog from '../windows/Blog'
import About from '../windows/About'
import Admin from '../windows/Admin'
import TerminalNav from '../windows/TerminalNav'

// Register all window contents immediately when this module loads
registerWindowContent('welcome', Welcome)
registerWindowContent('projects', Projects)
registerWindowContent('blog', Blog)
registerWindowContent('about', About)
registerWindowContent('admin', Admin)
registerWindowContent('terminalnav', TerminalNav)

interface DesktopIcon {
  id: string
  label: string
  position: { x: number; y: number }
}

const icons: DesktopIcon[] = [
  { id: 'terminalnav', label: 'Terminal', position: { x: 30, y: 30 } },
  { id: 'welcome', label: 'Welcome', position: { x: 30, y: 130 } },
  { id: 'projects', label: 'Projects', position: { x: 140, y: 30 } },
  { id: 'blog', label: 'Blog', position: { x: 140, y: 130 } },
  { id: 'about', label: 'About', position: { x: 250, y: 30 } },
  { id: 'admin', label: 'Admin', position: { x: 250, y: 130 } },
]

export default function Desktop() {
  const openWindow = useWindowStore((s) => s.openWindow)

  const handleIconClick = (e: React.MouseEvent, icon: DesktopIcon) => {
    e.preventDefault()
    e.stopPropagation()
    openWindow(icon.id as any)
  }

  return (
    <div className="relative h-full w-full">
      {icons.map((icon) => (
        <button
          key={icon.id}
          onMouseDown={(e) => handleIconClick(e, icon)}
          className="icon-triple-hover absolute flex flex-col items-center gap-1 p-2 transition-colors"
          style={{ left: icon.position.x, top: icon.position.y }}
        >
          <div className="w-12 h-12 border border-current flex items-center justify-center text-2xl">
            {icon.label[0]}
          </div>
          <span className="text-xs">{icon.label}</span>
        </button>
      ))}
    </div>
  )
}
