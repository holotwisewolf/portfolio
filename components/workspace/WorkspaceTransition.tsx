'use client'

import { useEffect, useState, useMemo, useRef } from 'react'
import { useWindowStore } from '@/components/window-manager/useWindows'

const GRID_W = 28
const GRID_H = 22
const STAGE_DELAY = 450
const FINAL_HOLD = 250
const ESC_KEY = 'Escape'

const BOOT_LINES = [
  '> INITIALIZING SESSION',
  '> LOADING filesystem',
  '> MOUNTING projects/',
]

// Generate a flower-like pattern in the grid.
// Returns boolean[] where true = filled cell.
function generateFlowerGrid(): boolean[] {
  const cells: boolean[] = []
  const cx = GRID_W / 2
  const cy = GRID_H / 2

  for (let y = 0; y < GRID_H; y++) {
    for (let x = 0; x < GRID_W; x++) {
      const dx = x - cx
      const dy = (y - cy) * 1.1
      const dist = Math.sqrt(dx * dx + dy * dy)
      const angle = Math.atan2(dy, dx)

      // 6-petal flower: r = base + amplitude * sin(petals * angle)
      const petalRadius = 6.5 + Math.sin(angle * 6) * 2.2
      const inFlower = dist < petalRadius

      // Tighter inner ring (the flower center)
      const inCenter = dist < 1.8

      // Sparse outer halo for atmosphere
      const haloChance = dist < 9.5 && dist > petalRadius ? 0.12 : 0
      const inHalo = haloChance > 0 && pseudoRandom(x, y) < haloChance

      cells.push(inFlower || inCenter || inHalo)
    }
  }
  return cells
}

// Deterministic pseudo-random for stable initial pattern across renders
function pseudoRandom(x: number, y: number): number {
  const n = (x * 928371 + y * 1234567) % 233280
  return n / 233280
}

export default function WorkspaceTransition() {
  const completeWorkspaceTransition = useWindowStore((s) => s.completeWorkspaceTransition)
  const closeWorkspace = useWindowStore((s) => s.closeWorkspace)

  const initialGrid = useMemo(() => generateFlowerGrid(), [])
  const [visibleCells, setVisibleCells] = useState<boolean[]>(initialGrid)
  const [dots, setDots] = useState(0)
  const [visibleBootLines, setVisibleBootLines] = useState(0)
  const [rectsShown, setRectsShown] = useState(0)
  const [fadingOut, setFadingOut] = useState(false)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])

  useEffect(() => {
    const addTimer = (fn: () => void, delay: number) => {
      const t = setTimeout(fn, delay)
      timers.current.push(t)
    }

    // Stage 1: first dot, drop ~30% of currently visible cells
    addTimer(() => {
      setDots(1)
      setVisibleBootLines(1)
      setVisibleCells((prev) => prev.map((c) => c && Math.random() > 0.3))
    }, STAGE_DELAY)

    // Stage 2: second dot, drop another ~40%
    addTimer(() => {
      setDots(2)
      setVisibleBootLines(2)
      setVisibleCells((prev) => prev.map((c) => c && Math.random() > 0.4))
    }, STAGE_DELAY * 2)

    // Stage 3: third dot, drop another ~60% (most cells now gone)
    addTimer(() => {
      setDots(3)
      setVisibleBootLines(3)
      setVisibleCells((prev) => prev.map((c) => c && Math.random() > 0.6))
    }, STAGE_DELAY * 3)

    // Three rectangles appear one after another after grid is dissolved
    addTimer(() => setRectsShown(1), STAGE_DELAY * 3 + 150)
    addTimer(() => setRectsShown(2), STAGE_DELAY * 3 + 350)
    addTimer(() => setRectsShown(3), STAGE_DELAY * 3 + 550)

    // Fade out + complete
    addTimer(() => setFadingOut(true), STAGE_DELAY * 3 + 850)
    addTimer(() => completeWorkspaceTransition(), STAGE_DELAY * 3 + 850 + FINAL_HOLD)

    const onKey = (e: KeyboardEvent) => {
      if (e.key === ESC_KEY) {
        timers.current.forEach(clearTimeout)
        closeWorkspace()
      }
    }
    window.addEventListener('keydown', onKey)

    return () => {
      timers.current.forEach(clearTimeout)
      window.removeEventListener('keydown', onKey)
    }
  }, [completeWorkspaceTransition, closeWorkspace])

  const dotsFilled = '.'.repeat(dots)
  const dotsEmpty = '.'.repeat(3 - dots)

  return (
    <div
      className={`fixed inset-0 z-[20000] bg-black flex transition-opacity duration-200 ${
        fadingOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* LEFT — status text */}
      <div className="flex-1 flex flex-col justify-center pl-12 sm:pl-20 pr-4">
        <div className="text-[#00ff9d] text-[16px] sm:text-[20px] tracking-[0.4em] mb-6 whitespace-nowrap">
          CONNECTING<span className="text-[#00ff9d]">{dotsFilled}</span>
          <span className="text-[#1c2e1c]">{dotsEmpty}</span>
        </div>

        <div className="space-y-1 mb-8 min-h-[80px]">
          {BOOT_LINES.slice(0, visibleBootLines).map((line, i) => (
            <div key={i} className="text-[#666] text-[10px] sm:text-[11px] tracking-[0.2em] font-orbit">
              {line}
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div className="w-[200px] h-[2px] bg-[#1c2e1c] mb-2">
          <div
            className="h-full bg-[#00ff9d] transition-[width] duration-200 ease-linear"
            style={{ width: `${(dots / 3) * 100}%` }}
          />
        </div>
        <div className="text-[#444] text-[9px] tracking-[0.3em] font-orbit">
          STAGE {dots} / 3
        </div>
      </div>

      {/* RIGHT — animated pixel flower grid + final rectangles */}
      <div className="hidden md:flex w-[40%] lg:w-[45%] items-center justify-center relative">
        <div
          className="grid gap-[1px]"
          style={{
            gridTemplateColumns: `repeat(${GRID_W}, 1fr)`,
            gridTemplateRows: `repeat(${GRID_H}, 1fr)`,
          }}
        >
          {visibleCells.map((visible, i) => {
            const x = i % GRID_W
            const y = Math.floor(i / GRID_W)
            const cx = GRID_W / 2
            const cy = GRID_H / 2
            const dist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2)
            // Cells closer to center are brighter
            const brightness = Math.max(0.3, 1 - dist / 12)
            return (
              <div
                key={i}
                className="w-[8px] h-[8px] sm:w-[10px] sm:h-[10px] lg:w-[12px] lg:h-[12px] transition-opacity duration-300"
                style={{
                  backgroundColor: visible ? '#00ff9d' : 'transparent',
                  opacity: visible ? brightness : 0,
                }}
              />
            )
          })}
        </div>

        {/* Three rectangles appearing in sequence after grid dissolves */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 pointer-events-none">
          {[0, 1, 2].map((idx) => {
            const shown = rectsShown > idx
            return (
              <div
                key={idx}
                className="border border-[#00ff9d] bg-black"
                style={{
                  width: '60%',
                  maxWidth: '280px',
                  height: '12px',
                  opacity: shown ? 1 : 0,
                  transform: shown ? 'scaleX(1)' : 'scaleX(0)',
                  transformOrigin: 'left center',
                  transition: 'opacity 200ms ease-out, transform 250ms ease-out',
                  transitionDelay: shown ? '0ms' : '0ms',
                }}
              >
                <div
                  className="h-full bg-[#00ff9d]"
                  style={{
                    width: shown ? '100%' : '0%',
                    transition: 'width 300ms ease-out',
                  }}
                />
              </div>
            )
          })}
        </div>

        {/* Corner brackets — eDEX-UI vibe */}
        <div className="absolute top-6 left-6 w-4 h-4 border-t border-l border-[#1c2e1c]" />
        <div className="absolute top-6 right-6 w-4 h-4 border-t border-r border-[#1c2e1c]" />
        <div className="absolute bottom-6 left-6 w-4 h-4 border-b border-l border-[#1c2e1c]" />
        <div className="absolute bottom-6 right-6 w-4 h-4 border-b border-r border-[#1c2e1c]" />
      </div>

      {/* ESC indicator */}
      <div className="absolute bottom-4 left-12 sm:left-20 text-[#444] text-[9px] tracking-[0.3em] font-orbit">
        [ESC] CANCEL
      </div>
    </div>
  )
}
