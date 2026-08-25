'use client'

import { useEffect, useState } from 'react'
import { useWindowStore } from '@/components/window-manager/useWindows'

const BOOT_LINES = [
  '> INITIALIZING SESSION',
  '> LOADING filesystem',
  '> MOUNTING projects/',
  '> CONNECTED',
]

const LINE_DELAY = 200
const FINAL_HOLD = 250
const ESC_KEY = 'Escape'

export default function WorkspaceTransition() {
  const completeWorkspaceTransition = useWindowStore((s) => s.completeWorkspaceTransition)
  const closeWorkspace = useWindowStore((s) => s.closeWorkspace)
  const [visibleLines, setVisibleLines] = useState(0)
  const [progress, setProgress] = useState(0)
  const [fadingOut, setFadingOut] = useState(false)

  useEffect(() => {
    const lineTimers: ReturnType<typeof setTimeout>[] = []
    BOOT_LINES.forEach((_, i) => {
      lineTimers.push(setTimeout(() => setVisibleLines(i + 1), LINE_DELAY * (i + 1)))
    })

    const totalDuration = LINE_DELAY * BOOT_LINES.length
    const progressStart = Date.now()
    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - progressStart
      const pct = Math.min(100, (elapsed / totalDuration) * 100)
      setProgress(pct)
      if (pct >= 100) clearInterval(progressInterval)
    }, 16)

    const fadeTimer = setTimeout(() => setFadingOut(true), totalDuration + 50)
    const completeTimer = setTimeout(() => {
      completeWorkspaceTransition()
    }, totalDuration + FINAL_HOLD)

    const onKey = (e: KeyboardEvent) => {
      if (e.key === ESC_KEY) {
        lineTimers.forEach(clearTimeout)
        clearTimeout(fadeTimer)
        clearTimeout(completeTimer)
        clearInterval(progressInterval)
        closeWorkspace()
      }
    }
    window.addEventListener('keydown', onKey)

    return () => {
      lineTimers.forEach(clearTimeout)
      clearTimeout(fadeTimer)
      clearTimeout(completeTimer)
      clearInterval(progressInterval)
      window.removeEventListener('keydown', onKey)
    }
  }, [completeWorkspaceTransition, closeWorkspace])

  return (
    <div
      className={`fixed inset-0 z-[20000] bg-black flex flex-col items-center justify-center transition-opacity duration-200 ${
        fadingOut ? 'opacity-0' : 'opacity-100'
      }`}
      style={{ fontFamily: '"Orbit", "Courier New", monospace' }}
    >
      <div className="text-white text-[14px] tracking-[0.4em] mb-6">CONNECTING . . .</div>

      <div className="w-[240px] h-[3px] bg-[#1c1c1c] mb-8">
        <div
          className="h-full bg-[#00ff9d] transition-[width] duration-100 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="text-[#00ff9d] text-[11px] tracking-[0.2em] space-y-1 min-h-[80px]">
        {BOOT_LINES.slice(0, visibleLines).map((line, i) => (
          <div key={i} className={i === BOOT_LINES.length - 1 ? 'text-white' : 'text-[#00ff9d]'}>
            {line}
          </div>
        ))}
      </div>

      <div className="absolute bottom-8 text-[#444] text-[10px] tracking-[0.3em]">
        [ESC] CANCEL
      </div>
    </div>
  )
}
