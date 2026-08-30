'use client'

import { useEffect } from 'react'
import { useWindowStore } from '@/components/window-manager/useWindows'
import WorkspaceBreadcrumb from './WorkspaceBreadcrumb'
import ProjectSidebar from './ProjectSidebar'
import FileContentView from './FileContentView'
import PixelBlastBg from './PixelBlastBg'

const ESC_KEY = 'Escape'

// Print register marks for the content frame corners (crosshairs, like proof sheets)
function RegisterMark({ className }: { className: string }) {
  return (
    <svg className={`absolute w-4 h-4 pointer-events-none ${className}`} viewBox="0 0 16 16" aria-hidden>
      <line x1="8" y1="0" x2="8" y2="16" stroke="#333" strokeWidth="1" />
      <line x1="0" y1="8" x2="16" y2="8" stroke="#333" strokeWidth="1" />
    </svg>
  )
}

export default function WorkspaceContainer() {
  const closeWorkspace = useWindowStore((s) => s.closeWorkspace)
  const workspacePath = useWindowStore((s) => s.workspacePath)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === ESC_KEY) {
        closeWorkspace()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [closeWorkspace])

  return (
    <div className="absolute inset-0 bg-[#0a0a0a] flex flex-col overflow-hidden font-orbit">
      {/* PixelBlast background — behind everything, click-through disabled by pointer-events-none */}
      <div className="absolute inset-0 z-0">
        <PixelBlastBg color="#00cc77" pixelSize={5} patternScale={3} patternDensity={0.7} speed={0.3} />
      </div>

      <WorkspaceBreadcrumb path={workspacePath} onExit={closeWorkspace} />

      <div className="flex-1 flex flex-col md:flex-row min-h-0">
        <ProjectSidebar path={workspacePath} />
        {/* content frame — register marks pinned at the corners; scrolling happens inside */}
        <div className="relative flex-1 min-w-0">
          <RegisterMark className="top-2 right-3 z-[10]" />
          <RegisterMark className="bottom-2 right-3 z-[10]" />
          <FileContentView path={workspacePath} />
        </div>
      </div>

      {/* CRT overlay — scanlines only */}
      <div className="pointer-events-none absolute inset-0 z-[100]" aria-hidden>
        <div className="absolute inset-0 workspace-scanlines" />
      </div>
    </div>
  )
}
