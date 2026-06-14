'use client'

import { useEffect } from 'react'
import { useWindowStore } from '@/components/window-manager/useWindows'
import WorkspaceBreadcrumb from './WorkspaceBreadcrumb'
import ProjectSidebar from './ProjectSidebar'
import FileContentView from './FileContentView'

const ESC_KEY = 'Escape'

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
    <div
      className="absolute inset-0 bg-[#0a0a0a] flex flex-col overflow-hidden font-orbit workspace-crt"
    >
      <WorkspaceBreadcrumb path={workspacePath} onExit={closeWorkspace} />

      <div className="flex-1 flex flex-col md:flex-row min-h-0">
        <ProjectSidebar path={workspacePath} />
        <FileContentView path={workspacePath} />
      </div>

      {/* CRT overlay — flicker + scanlines + RGB shift, above content but below interactive */}
      <div className="pointer-events-none absolute inset-0 z-[100]" aria-hidden>
        <div className="absolute inset-0 workspace-flicker" />
        <div className="absolute inset-0 workspace-scanlines" />
      </div>
    </div>
  )
}
