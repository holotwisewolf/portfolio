'use client'

import { useState } from 'react'
import { useWindowStore } from '../window-manager/useWindows'

const navItems = ['Welcome', 'Projects', 'Blog', 'About', 'Contact']

export default function TerminalNav() {
  const [activeNav, setActiveNav] = useState('Welcome')
  const openWindow = useWindowStore((s) => s.openWindow)

  const handleNavClick = (item: string) => {
    setActiveNav(item)
    // Open corresponding window
    const windowId = item.toLowerCase() as any
    openWindow(windowId)
  }

  return (
    <div className="h-full bg-black font-mono text-xs p-4 flex flex-col">
      {/* Header */}
      <div className="text-[10px] tracking-wider text-white uppercase border-b border-gray-800 pb-2 mb-4">
        Terminal Navigator
      </div>

      {/* Terminal Output */}
      <div className="flex-1 bg-gray-950 border border-gray-800 p-3 overflow-auto mb-4">
        <div className="text-[10px] tracking-wider text-white uppercase mb-2">System output</div>

        <div className="text-gray-700 mb-1">$ whoami</div>
        <div className="text-gray-400 mb-3">→ developer, designer, builder</div>

        <div className="text-gray-700 mb-1">$ ls projects/</div>
        <div className="text-gray-400 mb-3">project_01/ project_02/ project_03/</div>

        <div className="text-gray-700 mb-1">$ cat status.txt</div>
        <div className="text-gray-300 mb-3">Currently building cool stuff.</div>

        {/* Prompt with cursor */}
        <div className="mt-4 text-gray-700">
          ~/portfolio{' '}
          <span className="inline-block w-2 h-3 bg-white align-middle animate-pulse" />
        </div>
      </div>

      {/* Navigation */}
      <div>
        <div className="text-[9px] text-gray-600 tracking-widest uppercase mb-2">Navigation</div>
        {navItems.map((item) => (
          <div
            key={item}
            onClick={() => handleNavClick(item)}
            className={`py-1.5 border-b border-gray-900 cursor-pointer tracking-wider ${
              activeNav === item ? 'text-white' : 'text-gray-500'
            }`}
          >
            <span className={activeNav === item ? 'text-white' : 'text-gray-800'}>
              &gt;
            </span>{' '}
            {item.toLowerCase()}
          </div>
        ))}
      </div>
    </div>
  )
}
