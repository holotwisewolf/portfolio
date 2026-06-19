'use client'

import { useEffect, useState } from 'react'
import { useWindowStore } from '@/components/window-manager/useWindows'

export default function WorkspaceTransition() {
  const complete = useWindowStore((s) => s.completeWorkspaceTransition)
  const close = useWindowStore((s) => s.closeWorkspace)
  const [dots, setDots] = useState(0)

  useEffect(() => {
    const timers = [
      setTimeout(() => setDots(1), 250),
      setTimeout(() => setDots(2), 500),
      setTimeout(() => setDots(3), 750),
      setTimeout(complete, 1100),
    ]
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close() }
    window.addEventListener('keydown', onKey)
    return () => { timers.forEach(clearTimeout); window.removeEventListener('keydown', onKey) }
  }, [complete, close])

  return (
    <div className="fixed inset-0 z-[20000] bg-black flex items-center justify-center font-orbit">
      <div className="text-center">
        <div className="text-[#00ff9d] text-[14px] tracking-[0.4em] mb-5">
          CONNECTING{'.'.repeat(dots)}
        </div>
        <div className="w-[200px] h-[2px] bg-[#1c2e1c] mx-auto overflow-hidden">
          <div
            className="h-full bg-[#00ff9d] transition-all duration-200 ease-linear"
            style={{ width: `${(dots / 3) * 100}%` }}
          />
        </div>
      </div>
      <div className="absolute bottom-8 text-[#333] text-[9px] tracking-[0.3em]">[ESC] CANCEL</div>
    </div>
  )
}
