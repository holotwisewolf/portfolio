'use client'

// Navigator: quick-access entry points + documentation for all terminal commands.

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
  const openWorkspace = useWindowStore((s) => s.openWorkspace)
  const openWindow = useWindowStore((s) => s.openWindow)

  return (
    <div className="h-full bg-[#0a0a0a] font-orbit text-[11px] p-4 flex flex-col">
      {/* Header */}
      <div className="text-[9px] tracking-[0.3em] text-[#555] mb-2">// navigator</div>
      <div className="text-[20px] tracking-tight text-white font-orbit">Navigator</div>
      <div className="mt-3 h-px bg-[#222] relative mb-4">
        <div className="absolute left-0 top-[-1px] h-[2px] w-10 bg-white" />
      </div>

      {/* Quick access */}
      <div className="mb-4">
        <div className="text-[9px] text-[#555] tracking-[0.25em] uppercase mb-2">Quick access</div>
        <button
          onClick={() => openWorkspace()}
          className="group w-full text-left py-2 border-b border-[#161616] cursor-pointer tracking-wider text-[#777] hover:text-white transition-colors"
        >
          <span className="text-[#333] group-hover:text-white transition-colors">&gt;</span>{' '}
          workspace
        </button>
        <button
          onClick={() => openWindow('settings' as any)}
          className="group w-full text-left py-2 border-b border-[#161616] cursor-pointer tracking-wider text-[#777] hover:text-white transition-colors"
        >
          <span className="text-[#333] group-hover:text-white transition-colors">&gt;</span>{' '}
          settings
        </button>
      </div>

      {/* System Commands */}
      <div className="flex-1 bg-black border border-[#2a2a2a] p-3 overflow-auto">
        <div className="text-[9px] tracking-[0.25em] text-[#555] uppercase mb-3">System commands</div>
        <div className="space-y-2">
          {COMMANDS.map((c) => (
            <div key={c.cmd} className="flex items-baseline gap-3">
              <span className="text-[#00ff9d] text-[10px] whitespace-nowrap">{c.cmd}</span>
              <span className="text-[#555] text-[9px] leading-relaxed">{c.desc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
