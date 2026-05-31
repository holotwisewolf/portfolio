'use client'

import { useWindowStore } from './useWindows'
import Welcome from '../windows/Welcome'
import Projects from '../windows/Projects'
import Blog from '../windows/Blog'
import About from '../windows/About'
import Admin from '../windows/Admin'

interface DesktopIcon {
  id: string
  label: string
  component: React.ComponentType
  position: { x: number; y: number }
}

const icons: DesktopIcon[] = [
  { id: 'welcome', label: 'Welcome', component: Welcome, position: { x: 50, y: 50 } },
  { id: 'projects', label: 'Projects', component: Projects, position: { x: 50, y: 150 } },
  { id: 'blog', label: 'Blog', component: Blog, position: { x: 50, y: 250 } },
  { id: 'about', label: 'About', component: About, position: { x: 50, y: 350 } },
  { id: 'admin', label: 'Admin', component: Admin, position: { x: 50, y: 450 } },
]

export default function Desktop() {
  const openWindow = useWindowStore((s) => s.openWindow)
  const windows = useWindowStore((s) => s.windows)

  const handleIconClick = (icon: DesktopIcon) => {
    openWindow(icon.id as any, icon.label, icon.component)
  }

  return (
    <div className="relative h-full w-full">
      {/* Desktop Icons */}
      {icons.map((icon) => (
        <button
          key={icon.id}
          onClick={() => handleIconClick(icon)}
          className="absolute flex flex-col items-center gap-1 p-2 hover:bg-white hover:text-black transition-colors"
          style={{ left: icon.position.x, top: icon.position.y }}
        >
          <div className="w-12 h-12 border border-current flex items-center justify-center text-2xl">
            {icon.label[0]}
          </div>
          <span className="text-xs">{icon.label}</span>
        </button>
      ))}

      {/* Render all open windows */}
      {Object.values(windows).map((window) => {
        if (window.isOpen) {
          return (
            <div key={window.id} className="absolute">
              <div className="pointer-events-none">
                {/* We'll render windows via a different mechanism */}
              </div>
            </div>
          )
        }
        return null
      })}
    </div>
  )
}
