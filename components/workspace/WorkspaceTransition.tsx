'use client'

import { useEffect, useState, useRef, useMemo } from 'react'
import { useWindowStore } from '@/components/window-manager/useWindows'

const GRID_COLS = 5
const GRID_ROWS = 6
const TOTAL_CELLS = GRID_COLS * GRID_ROWS

const FLOWER_COLS = 60
const FLOWER_ROWS = 40

const STAGE_DELAYS = {
  waiting: 0,
  dot1: 500,
  dot2: 1000,
  dot3: 1500,
  established: 2000,
  rect1: 2400,
  rect2: 2650,
  rect3: 2900,
  fadeOut: 3300,
  complete: 3600,
}

const ESC_KEY = 'Escape'

// Deterministic pseudo-random for stable patterns
function pseudoRandom(x: number, y: number): number {
  const n = (x * 928371 + y * 1234567) % 233280
  return n / 233280
}

// Glitch text: randomly replace letters with X
function glitchText(text: string, seed: number): string {
  return text
    .split('')
    .map((char, i) => {
      if (char === ' ') return ' '
      // Use deterministic seed for stable output
      const r = pseudoRandom(i, seed)
      return r < 0.3 ? 'X' : char
    })
    .join('')
}

interface Stage {
  visibleCells: boolean[]
  leftText: string
  leftSubText?: string
  showRightPanel: boolean
  showRectangles: number // 0, 1, 2, 3
  isEstablished: boolean
}

// Pick which cells to hide at each stage (deterministic for stable animation)
function getCellsHiddenAtStage(stage: number): boolean[] {
  // Create array of cell indices shuffled deterministically
  const indices = Array.from({ length: TOTAL_CELLS }, (_, i) => i)
  // Simple deterministic shuffle
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(pseudoRandom(i, 42) * (i + 1))
    ;[indices[i], indices[j]] = [indices[j], indices[i]]
  }

  // Hide counts per stage — less aggressive, ~17% / 33% / 50% before full dissolve
  const hideCounts = [0, 5, 10, 15, 30] // stage 0-4
  const hideCount = hideCounts[Math.min(stage, 4)]

  const hidden = new Array(TOTAL_CELLS).fill(false)
  for (let i = 0; i < hideCount; i++) {
    hidden[indices[i]] = true
  }
  return hidden
}

function PixelFlowerCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size to match display size
    const rect = canvas.getBoundingClientRect()
    const dpr = window.devicePixelRatio || 1
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)

    const cellW = rect.width / FLOWER_COLS
    const cellH = rect.height / FLOWER_ROWS

    const cx = FLOWER_COLS / 2
    const cy = FLOWER_ROWS / 2

    // Draw peony-like pixel flower
    for (let y = 0; y < FLOWER_ROWS; y++) {
      for (let x = 0; x < FLOWER_COLS; x++) {
        const dx = x - cx
        const dy = (y - cy) * 1.05
        const dist = Math.sqrt(dx * dx + dy * dy)
        const angle = Math.atan2(dy, dx)

        // Multi-layer petal shape (peony-like — dense, ruffled)
        const petal1 = Math.sin(angle * 5) * 2.5
        const petal2 = Math.sin(angle * 7 + 0.5) * 1.5
        const petal3 = Math.sin(angle * 3 - 0.3) * 1.0
        const outerRadius = 14 + petal1 + petal2 + petal3

        let brightness = 0
        let r = 0, g = 255, b = 157 // Site green

        if (dist < 2.5) {
          // Bright center
          brightness = 1.0
        } else if (dist < outerRadius) {
          // Main flower body — varies with distance
          brightness = 1.0 - (dist / outerRadius) * 0.5
          // Add organic noise
          brightness += pseudoRandom(x, y) * 0.2 - 0.1
          // Shift color slightly for depth
          if (dist > outerRadius * 0.6) {
            // Outer petals — more muted
            r = 0; g = 200; b = 120
          }
        } else if (dist < outerRadius + 1.5) {
          // Edge halo — sparse
          if (pseudoRandom(x, y) > 0.5) {
            brightness = 0.25 + pseudoRandom(x + 7, y + 3) * 0.2
          }
        }

        if (brightness > 0) {
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${brightness})`
          // Small square pixel with tiny gap
          ctx.fillRect(x * cellW + 0.5, y * cellH + 0.5, cellW * 0.85, cellH * 0.85)
        }
      }
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
}

export default function WorkspaceTransition() {
  const completeWorkspaceTransition = useWindowStore((s) => s.completeWorkspaceTransition)
  const closeWorkspace = useWindowStore((s) => s.closeWorkspace)

  const [stage, setStage] = useState(0)
  const [rectsShown, setRectsShown] = useState(0)
  const [fadingOut, setFadingOut] = useState(false)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])

  useEffect(() => {
    const addTimer = (fn: () => void, delay: number) => {
      const t = setTimeout(fn, delay)
      timers.current.push(t)
    }

    addTimer(() => setStage(1), STAGE_DELAYS.dot1)
    addTimer(() => setStage(2), STAGE_DELAYS.dot2)
    addTimer(() => setStage(3), STAGE_DELAYS.dot3)
    addTimer(() => setStage(4), STAGE_DELAYS.established)
    addTimer(() => setRectsShown(1), STAGE_DELAYS.rect1)
    addTimer(() => setRectsShown(2), STAGE_DELAYS.rect2)
    addTimer(() => setRectsShown(3), STAGE_DELAYS.rect3)
    addTimer(() => setFadingOut(true), STAGE_DELAYS.fadeOut)
    addTimer(() => completeWorkspaceTransition(), STAGE_DELAYS.complete)

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

  const hiddenCells = useMemo(() => getCellsHiddenAtStage(stage), [stage])

  // Determine text content based on stage
  const getLeftText = () => {
    if (stage === 0) return { main: 'WAITING FOR SRC01', sub: undefined }
    if (stage >= 1 && stage <= 3) {
      return {
        main: `CONNECTING${' .' .repeat(stage)}`,
        sub: 'SIGNAL • ###',
      }
    }
    if (stage === 4) return { main: 'CHANNEL ESTABLISHED', sub: undefined, glitch: true }
    return { main: 'RECEIVING SRC', sub: undefined }
  }

  const text = getLeftText()
  const isReceiving = stage >= 4 && rectsShown > 0
  const isEstablished = stage === 4 && rectsShown === 0

  return (
    <div
      className={`fixed inset-0 z-[20000] bg-black flex transition-opacity duration-300 ${
        fadingOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* ESTABLISHED or RECEIVING state — full screen, no split */}
      {(isEstablished || isReceiving) && !fadingOut && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 px-8">
          {/* Small accent square at top (established state only) */}
          {isEstablished && (
            <>
              <div className="w-3 h-3 bg-[#00ff9d] mb-4" />
              <div className="border border-white px-6 py-3">
                <div className="text-white text-[14px] sm:text-[18px] tracking-[0.3em] font-orbit text-center">
                  {glitchText('CHANNEL ESTABLISHED', 7)}
                </div>
              </div>
            </>
          )}

          {/* Three rectangles for RECEIVING state — text in middle, content with bold PRAXIS text */}
          {isReceiving && (
            <div className="w-full max-w-[900px] flex flex-col items-center gap-3 mt-2">
              {/* Top wide rectangle with circular graphic */}
              <div
                className="w-[85%] h-[120px] border border-white relative overflow-hidden transition-all duration-300"
                style={{
                  opacity: rectsShown >= 1 ? 1 : 0,
                  transform: rectsShown >= 1 ? 'translateY(0)' : 'translateY(20px)',
                }}
              >
                {/* Textured gray background like film reel/mechanical */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#2a2a2a] via-[#1a1a1a] to-[#0a0a0a]" />
                <div className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage: `repeating-linear-gradient(90deg, transparent 0, transparent 12px, rgba(255,255,255,0.15) 12px, rgba(255,255,255,0.15) 13px)`,
                  }}
                />
                {/* Central circular graphic — green tinted to match site */}
                <div
                  className="absolute top-1/2 left-[35%] -translate-x-1/2 -translate-y-1/2 w-[80px] h-[80px] sm:w-[100px] sm:h-[100px] rounded-full border-2 border-[#888] flex items-center justify-center"
                  style={{
                    background: 'radial-gradient(circle at center, rgba(0,255,157,0.35) 0%, rgba(0,204,119,0.2) 40%, rgba(20,30,20,0.5) 80%, transparent 100%)',
                    boxShadow: 'inset 0 0 30px rgba(0,255,157,0.3)',
                  }}
                />
                {/* Bold PRAXIS title over circle */}
                <div className="absolute top-1/2 left-[35%] -translate-x-1/2 -translate-y-1/2 text-center">
                  <div className="text-white text-[20px] sm:text-[26px] tracking-[0.15em] font-orbit font-bold leading-none">
                    PRAXIS
                  </div>
                  <div className="text-white text-[8px] sm:text-[10px] tracking-[0.3em] font-orbit mt-1">
                    PROJECT AR2
                  </div>
                </div>
                {/* "ENT" cut off on right edge */}
                <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-[20%] text-white text-[28px] sm:text-[36px] tracking-[0.1em] font-orbit font-bold opacity-90">
                  ENT
                </div>
                <div className="absolute top-2 left-3 text-[9px] text-[#888] font-orbit tracking-[0.3em]">SRC / 01</div>
                <div className="absolute bottom-2 left-3 text-[8px] text-[#666] font-orbit">[ STREAM 01 ]</div>
              </div>

              {/* RECIEVING SRC text in middle (intentional typo matching reference) */}
              <div className="border border-white px-8 py-2 bg-black">
                <div className="text-white text-[13px] sm:text-[15px] tracking-[0.4em] font-orbit text-center">
                  RECIEVING SRC
                </div>
              </div>

              {/* Bottom two rectangles */}
              <div className="flex gap-3 w-full justify-center">
                {/* Bottom-left — darker, with metallic vertical bar */}
                <div
                  className="w-[42%] h-[110px] border border-white relative overflow-hidden transition-all duration-300"
                  style={{
                    opacity: rectsShown >= 2 ? 1 : 0,
                    transform: rectsShown >= 2 ? 'translateY(0)' : 'translateY(20px)',
                  }}
                >
                  {/* Dark gradient background */}
                  <div className="absolute inset-0 bg-gradient-to-b from-[#0a1a14] via-[#0a0a0a] to-[#1a1a14]" />
                  {/* Metallic vertical bar on right */}
                  <div className="absolute top-0 right-[20%] w-[12px] h-full"
                    style={{
                      background: 'linear-gradient(to bottom, #8B4513 0%, #6b3a0e 40%, #2F4F4F 80%, #1a2a2a 100%)',
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-start pl-4">
                    <div>
                      <div className="text-white text-[16px] sm:text-[20px] tracking-[0.1em] font-orbit font-bold leading-none">
                        PRAXIS ENTERPR
                      </div>
                      <div className="text-white text-[8px] sm:text-[10px] tracking-[0.3em] font-orbit mt-2">
                        PROJECT AR2
                      </div>
                    </div>
                  </div>
                  <div className="absolute bottom-2 right-3 text-[8px] text-[#666] font-orbit">[ STREAM 02 ]</div>
                </div>
                {/* Bottom-right — lighter solid */}
                <div
                  className="w-[42%] h-[110px] border border-white relative overflow-hidden transition-all duration-300"
                  style={{
                    opacity: rectsShown >= 3 ? 1 : 0,
                    transform: rectsShown >= 3 ? 'translateY(0)' : 'translateY(20px)',
                  }}
                >
                  {/* Light gray background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#3a3a3a] via-[#2a2a2a] to-[#1a1a1a]" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-white text-[16px] sm:text-[20px] tracking-[0.15em] font-orbit font-bold leading-none">
                        PRAXIS
                      </div>
                      <div className="text-white text-[8px] sm:text-[10px] tracking-[0.3em] font-orbit mt-2">
                        PROJECT AR2
                      </div>
                    </div>
                  </div>
                  <div className="absolute bottom-2 right-3 text-[8px] text-[#666] font-orbit">[ STREAM 03 ]</div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Split-screen layout for stages 0-3 */}
      {stage < 4 && (
        <>
          {/* LEFT — text panel */}
          <div className="w-1/2 flex items-center justify-center p-8 relative">
            <div className="border border-white px-8 py-6 min-w-[280px]">
              <div className="text-white text-[14px] sm:text-[18px] tracking-[0.3em] font-orbit text-center mb-2">
                {text.main}
              </div>
              {text.sub && (
                <div className="text-[#666] text-[10px] tracking-[0.3em] font-orbit text-center">
                  {text.sub}
                </div>
              )}
            </div>

            {/* ESC indicator */}
            <div className="absolute bottom-6 text-[#333] text-[9px] tracking-[0.3em] font-orbit">
              [ESC] CANCEL
            </div>
          </div>

          {/* RIGHT — grid + flower */}
          <div className="w-1/2 bg-[#0a1a0a] relative overflow-hidden border-l border-[#1c2e1c]">
            {/* Pixel flower underneath */}
            <PixelFlowerCanvas />

            {/* Grid overlay — cells hide flower as stage progresses. Grid frame stays visible */}
            <div
              className="absolute inset-0 grid"
              style={{
                gridTemplateColumns: `repeat(${GRID_COLS}, 1fr)`,
                gridTemplateRows: `repeat(${GRID_ROWS}, 1fr)`,
              }}
            >
              {hiddenCells.map((hidden, i) => (
                <div
                  key={i}
                  className={`border border-white/40 transition-colors duration-300 ${
                    hidden ? 'bg-black' : 'bg-transparent'
                  }`}
                />
              ))}
            </div>

            {/* Technical labels at grid corners */}
            <div className="absolute top-2 left-2 text-[8px] text-white/40 font-orbit tracking-[0.2em] pointer-events-none">
              VERTEX 04
            </div>
            <div className="absolute top-2 right-2 text-[8px] text-white/40 font-orbit tracking-[0.2em] pointer-events-none">
              PLATFORM / V05
            </div>
            <div className="absolute bottom-2 left-2 text-[8px] text-white/40 font-orbit tracking-[0.2em] pointer-events-none">
              VERTEX 07
            </div>
            <div className="absolute bottom-2 right-2 text-[8px] text-white/40 font-orbit tracking-[0.2em] pointer-events-none">
              SRC / 01
            </div>

            {/* Mid-grid intersection labels */}
            <div className="absolute top-1/2 left-2 -translate-y-1/2 text-[8px] text-white/30 font-orbit tracking-[0.2em] pointer-events-none">
              MID / X
            </div>
            <div className="absolute top-1/2 right-2 -translate-y-1/2 text-[8px] text-white/30 font-orbit tracking-[0.2em] pointer-events-none">
              MID / Y
            </div>
          </div>
        </>
      )}

      {/* Established state has a small accent square */}
      {stage === 4 && rectsShown === 0 && null}
    </div>
  )
}
