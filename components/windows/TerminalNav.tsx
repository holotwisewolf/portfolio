'use client'

// Navigator: same layout as before — system output box on top, nav list at bottom.
// Nav items swapped to: workspace, settings. Command docs live in the output box.

import { useState } from 'react'
import { useWindowStore } from '../window-manager/useWindows'

const COMMANDS: { cmd: string; desc: string }[] = [
  { cmd: 'help', desc: 'List all available commands' },
  { cmd: 'clear', desc: 'Clear terminal output' },
  { cmd: 'workspace', desc: 'Open the ~/projects/ filesystem workspace' },
  { cmd: 'projects', desc: 'Open the projects window' },
  { cmd: 'settings', desc: 'Open the settings window' },
  { cmd: 'about', desc: 'Open the about window' },
  { cmd: 'blog', desc: 'Open the blog window' },
  { cmd: 'ls [path]', desc: 'List files at path' },
  { cmd: 'cat [file]', desc: 'Read a file' },
  { cmd: 'whoami', desc: 'Show current user' },
  { cmd: 'status', desc: 'Show system status' },
]

export default function TerminalNav() {
  const [activeNav, setActiveNav] = useState('workspace')
  const openWorkspace = useWindowStore((s) => s.openWorkspace)
  const openWindow = useWindowStore((s) => s.openWindow)

  const navItems = ['Workspace', 'Settings']

  const handleNavClick = (e: React.MouseEvent, item: string) => {
    e.preventDefault()
    e.stopPropagation()
    setActiveNav(item)
    if (item === 'Workspace') {
      openWorkspace()
    } else if (item === 'Settings') {
      openWindow('settings' as any)
    }
  }

  return (
    <div className="h-full bg-[#0a0a0a] font-orbit text-[11px] p-4 flex flex-col">
      {/* Header */}
      <div className="text-[9px] tracking-[0.3em] text-[#555] mb-2">// navigator</div>
      <div className="text-[20px] tracking-tight text-white font-orbit">Navigator</div>
      <div className="mt-3 h-px bg-[#222] relative mb-4">
        <div className="absolute left-0 top-[-1px] h-[2px] w-10 bg-white" />
      </div>

      {/* System Commands */}
      <div className="flex-1 bg-black border border-[#2a2a2a] p-3 overflow-auto mb-4">
        <div className="text-[9px] tracking-[0.25em] text-[#555] uppercase mb-2">System commands</div>
        <div className="space-y-2">
          {COMMANDS.map((c) => (
            <div key={c.cmd} className="flex items-baseline gap-3">
              <span className="text-[#00ff9d] text-[10px] whitespace-nowrap">{c.cmd}</span>
              <span className="text-[#555] text-[9px] leading-relaxed">{c.desc}</span>
            </div>
          ))}
        </div>

        {/* Prompt with cursor */}
        <div className="mt-4 text-[#555]">
          ~/portfolio{' '}
          <span className="inline-block w-2 h-3 bg-white align-middle animate-pulse" />
        </div>
      </div>

      {/* Navigation — same layout as before */}
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
