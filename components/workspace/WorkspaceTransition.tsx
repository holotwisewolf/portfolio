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

          {/* RECEIVING state — asymmetric layout per reference:
              Outer margins asymmetric (left 4.5%, right 9%), top panel WIDER than bottom row,
              middle bar aligns with bottom row (75% width) not top (91% width),
              2:1 negative space to panel ratio, no panel borders */}
          {isReceiving && (
            <div
              className="flex flex-col items-start"
              style={{
                width: '91%',          // top panel width
                paddingLeft: '4.5%',   // asymmetric: less on left
                paddingRight: '9%',    // asymmetric: more on right
                paddingTop: '2.5vh',
                paddingBottom: '2.5vh',
              }}
            >
              {/* TOP PANEL — full width of container (91%), 42vh tall, V-offset PRAXIS text */}
              <div
                className="relative overflow-hidden transition-all duration-500"
                style={{
                  width: '100%',
                  height: '42vh',
                  maxHeight: '400px',
                  opacity: rectsShown >= 1 ? 1 : 0,
                  transform: rectsShown >= 1 ? 'translateY(0)' : 'translateY(-10px)',
                  boxShadow: 'inset 0 0 80px rgba(0,0,0,0.5)',
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#2a2a2a] via-[#1a1a1a] to-[#0a0a0a]" />
                <div className="absolute inset-0 opacity-[0.12]"
                  style={{
                    backgroundImage: `repeating-linear-gradient(90deg, transparent 0, transparent 16px, rgba(255,255,255,1) 16px, rgba(255,255,255,1) 17px),
                                       repeating-linear-gradient(0deg, transparent 0, transparent 16px, rgba(255,255,255,0.3) 16px, rgba(255,255,255,0.3) 17px)`,
                  }}
                />
                {/* Central purple circle — 85% of panel height */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 aspect-square h-[85%]">
                  <div
                    className="absolute inset-0 rounded-full border-[3px] border-[#999]"
                    style={{
                      background: 'radial-gradient(circle at center, #4B0082 0%, #5D2A8C 30%, #6A5ACD 70%, #8B7FD9 100%)',
                      boxShadow: 'inset 0 0 50px rgba(0,0,0,0.5), 0 0 50px rgba(106,90,205,0.35)',
                    }}
                  />
                </div>
                {/* PRAXIS — V-offset at 40% from top (not centered) */}
                <div className="absolute left-1/2 -translate-x-1/2 text-center" style={{ top: '40%' }}>
                  <div
                    className="text-white text-[clamp(32px,6vw,60px)] font-bold leading-none tracking-[0.04em]"
                    style={{
                      fontFamily: '"Arial Narrow", "Helvetica Neue Condensed", system-ui, sans-serif',
                      fontStretch: 'condensed',
                      textShadow: '0 0 24px rgba(255,255,255,0.7), 0 0 6px rgba(255,255,255,0.9)',
                    }}
                  >
                    PRAXIS
                  </div>
                  <div
                    className="text-white text-[clamp(10px,1.3vw,14px)] tracking-[0.35em] mt-2 opacity-90"
                    style={{ fontFamily: '"Arial Narrow", system-ui, sans-serif', fontStretch: 'condensed' }}
                  >
                    PROJECT AR2
                  </div>
                </div>
                {/* "ENT" cut off on right edge */}
                <div
                  className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-[20%] text-white text-[clamp(40px,7vw,72px)] font-bold leading-none opacity-90"
                  style={{
                    fontFamily: '"Arial Narrow", system-ui, sans-serif',
                    fontStretch: 'condensed',
                    textShadow: '0 0 10px rgba(255,255,255,0.4)',
                  }}
                >
                  ENT
                </div>
              </div>

              {/* GAP — 6vh uniform (per reference) */}
              <div style={{ height: '6vh' }} />

              {/* MIDDLE BAR — 75% of top panel width, left-aligned with top panel's left edge */}
              <div
                className="bg-black flex items-center justify-center transition-all duration-300"
                style={{
                  width: '75%',         // matches bottom row, narrower than top (91%)
                  height: 'clamp(28px, 5vh, 48px)',
                  opacity: rectsShown >= 1 ? 1 : 0,
                }}
              >
                <div
                  className="text-white text-[clamp(12px,1.5vw,16px)] tracking-[0.45em] font-bold"
                  style={{ fontFamily: '"Arial Narrow", system-ui, sans-serif', fontStretch: 'condensed' }}
                >
                  RECIEVING SRC
                </div>
              </div>

              {/* GAP — 6vh uniform (per reference) */}
              <div style={{ height: '6vh' }} />

              {/* BOTTOM ROW — 75% width total, matches middle bar width, NOT top panel width */}
              <div className="flex" style={{ width: '75%', gap: '5%' }}>
                {/* BOTTOM-LEFT — 36% of 75% = ~27% screen, blue/grey, PRAXIS ENTERPR left-aligned near bottom */}
                <div
                  className="relative overflow-hidden transition-all duration-500"
                  style={{
                    width: '36%',         // % of bottom row
                    height: '28vh',
                    maxHeight: '260px',
                    opacity: rectsShown >= 2 ? 1 : 0,
                    transform: rectsShown >= 2 ? 'translateY(0)' : 'translateY(10px)',
                    boxShadow: 'inset 0 0 50px rgba(0,0,0,0.5)',
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-[#1a2842] via-[#243454] to-[#3d4a66]" />
                  <div className="absolute inset-0 opacity-[0.1]"
                    style={{
                      backgroundImage: `repeating-linear-gradient(0deg, transparent 0, transparent 3px, rgba(255,255,255,1) 3px, rgba(255,255,255,1) 4px)`,
                    }}
                  />
                  {/* PRAXIS ENTERPR — LEFT-aligned, near BOTTOM */}
                  <div className="absolute left-[6%] bottom-[20%]">
                    <div
                      className="text-white text-[clamp(20px,2.8vw,32px)] font-bold leading-[0.95] tracking-[0.02em]"
                      style={{ fontFamily: '"Arial Narrow", system-ui, sans-serif', fontStretch: 'condensed' }}
                    >
                      PRAXIS<br/>ENTERPR
                    </div>
                    <div
                      className="text-white text-[clamp(8px,1vw,12px)] tracking-[0.3em] mt-2 opacity-75"
                      style={{ fontFamily: '"Arial Narrow", system-ui, sans-serif', fontStretch: 'condensed' }}
                    >
                      PROJECT AR2
                    </div>
                  </div>
                </div>

                {/* BOTTOM-RIGHT — 59% of 75% = ~44% screen, lighter grey, PRAXIS left-aligned near top */}
                <div
                  className="relative overflow-hidden transition-all duration-500"
                  style={{
                    width: '59%',         // % of bottom row (rest after 36% + 5% gap)
                    height: '28vh',
                    maxHeight: '260px',
                    opacity: rectsShown >= 3 ? 1 : 0,
                    transform: rectsShown >= 3 ? 'translateY(0)' : 'translateY(10px)',
                    boxShadow: 'inset 0 0 40px rgba(0,0,0,0.35)',
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#6a6a6a] via-[#5a5a5a] to-[#4a4a4a]" />
                  <div className="absolute inset-0 opacity-[0.06]"
                    style={{
                      backgroundImage: `repeating-linear-gradient(45deg, transparent 0, transparent 5px, rgba(255,255,255,1) 5px, rgba(255,255,255,1) 6px)`,
                    }}
                  />
                  {/* PRAXIS — LEFT-aligned, near TOP */}
                  <div className="absolute left-[6%] top-[28%]">
                    <div
                      className="text-white text-[clamp(24px,3.5vw,40px)] font-bold leading-none tracking-[0.06em]"
                      style={{
                        fontFamily: '"Arial Narrow", system-ui, sans-serif',
                        fontStretch: 'condensed',
                        textShadow: '0 0 14px rgba(255,255,255,0.35)',
                      }}
                    >
                      PRAXIS
                    </div>
                    <div
                      className="text-white text-[clamp(9px,1.1vw,13px)] tracking-[0.35em] mt-3 opacity-80"
                      style={{ fontFamily: '"Arial Narrow", system-ui, sans-serif', fontStretch: 'condensed' }}
                    >
                      PROJECT AR2
                    </div>
                  </div>
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
