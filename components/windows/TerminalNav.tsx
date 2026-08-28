'use client'

import { useState } from 'react'
import { useWindowStore } from '../window-manager/useWindows'

const navItems = ['Welcome', 'Projects', 'Blog', 'About', 'Contact']

export default function TerminalNav() {
  const [activeNav, setActiveNav] = useState('Welcome')
  const openWindow = useWindowStore((s) => s.openWindow)

  const handleNavClick = (e: React.MouseEvent, item: string) => {
    e.preventDefault()
    e.stopPropagation()
    setActiveNav(item)
    // Open corresponding window
    const windowId = item.toLowerCase() as any
    openWindow(windowId)
  }

  return (
    <div className="h-full bg-[#0a0a0a] font-orbit text-[11px] p-4 flex flex-col">
      {/* Header */}
      <div className="text-[9px] tracking-[0.3em] text-[#555] mb-2">// navigator</div>
      <div className="text-[20px] tracking-tight text-white font-orbit">Navigator</div>
      <div className="mt-3 h-px bg-[#222] relative mb-4">
        <div className="absolute left-0 top-[-1px] h-[2px] w-10 bg-white" />
      </div>

      {/* Terminal Output */}
      <div className="flex-1 bg-black border border-[#2a2a2a] p-3 overflow-auto mb-4">
        <div className="text-[9px] tracking-[0.25em] text-[#555] uppercase mb-2">System output</div>

        <div className="text-[#555] mb-1">$ whoami</div>
        <div className="text-[#666] mb-3">→ developer, designer, builder</div>

        <div className="text-[#555] mb-1">$ ls projects/</div>
        <div className="text-[#666] mb-3">project_01/ project_02/ project_03/</div>

        <div className="text-[#555] mb-1">$ cat status.txt</div>
        <div className="text-[#999] mb-3">Currently building cool stuff.</div>

        {/* Prompt with cursor */}
        <div className="mt-4 text-[#555]">
          ~/portfolio{' '}
          <span className="inline-block w-2 h-3 bg-white align-middle animate-pulse" />
        </div>
      </div>

      {/* Navigation */}
      <div>
        <div className="text-[9px] text-[#555] tracking-widest uppercase mb-2">Navigation</div>
        {navItems.map((item) => (
          <div
            key={item}
            onMouseDown={(e) => handleNavClick(e, item)}
            className={`py-1.5 border-b border-[#161616] cursor-pointer tracking-wider ${
              activeNav === item ? 'text-white' : 'text-[#777]'
            }`}
          >
            <span className={activeNav === item ? 'text-white' : 'text-[#333]'}>
              &gt;
            </span>{' '}
            {item.toLowerCase()}
          </div>
        ))}
      </div>
    </div>
  )
}
