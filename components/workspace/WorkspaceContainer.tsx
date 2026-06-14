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
      className="absolute inset-0 bg-[#0a0a0a] flex flex-col overflow-hidden"
      style={{ fontFamily: '"Orbit", "Courier New", monospace' }}
    >
      <WorkspaceBreadcrumb path={workspacePath} onExit={closeWorkspace} />

      <div className="flex-1 flex flex-col md:flex-row min-h-0">
        <ProjectSidebar path={workspacePath} />
        <FileContentView path={workspacePath} />
      </div>
    </div>
  )
}
