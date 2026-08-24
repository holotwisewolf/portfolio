'use client'

// Shared candle-chart primitives for the real-data demos. Parents own the <svg>
// and compose: call scales() for coordinate mapping, drop <Candles/> inside,
// then draw pins/lines/shading with the same scale functions.

import { useEffect, useRef, useState } from 'react'

export interface Bar {
  t: string
  o: number
  h: number
  l: number
  c: number
}

export const UP = '#00cc77'
export const DOWN = '#ef4444'

export function scales(
  bars: Bar[],
  w: number,
  h: number,
  pad: { l: number; r: number; t: number; b: number },
  explicitLo?: number,
  explicitHi?: number,
  xRange?: { from: number; to: number }
) {
  const lo = explicitLo ?? Math.min(...bars.map((b) => b.l))
  const hi = explicitHi ?? Math.max(...bars.map((b) => b.h))
  const p = (hi - lo) * 0.06 || 1
  const yLo = lo - p
  const yHi = hi + p
  const plotW = w - pad.l - pad.r
  const plotH = h - pad.t - pad.b
  const from = xRange?.from ?? 0
  const count = xRange ? xRange.to - xRange.from : bars.length
  const step = plotW / Math.max(1, count)
  return {
    x: (i: number) => pad.l + step * (i - from + 0.5),
    step,
    y: (price: number) => pad.t + (1 - (price - yLo) / (yHi - yLo)) * plotH,
    lo,
    hi,
    w,
    h,
    pad,
  }
}

// TradingView-style pan/zoom over the x-axis: wheel zooms around the cursor,
// drag pans, reset() restores the full view. Attach `ref` to the <svg>.
export function useZoom(count: number) {
  const ref = useRef<SVGSVGElement>(null)
  const [view, setView] = useState<[number, number]>([0, count])
  const viewRef = useRef(view)
  viewRef.current = view

  useEffect(() => {
    setView([0, count])
  }, [count])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      const rect = el.getBoundingClientRect()
      const frac = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width))
      const [a, b] = viewRef.current
      const span = b - a
      const next = Math.max(10, Math.min(count, Math.round(span * (e.deltaY > 0 ? 1.3 : 0.7))))
      let n0 = Math.round(a + frac * span - frac * next)
      n0 = Math.max(0, Math.min(count - next, n0))
      setView([n0, n0 + next])
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [count])

  const drag = useRef<{ x: number; view: [number, number] } | null>(null)

  useEffect(() => {
    const move = (e: MouseEvent) => {
      if (!drag.current || !ref.current) return
      const rect = ref.current.getBoundingClientRect()
      const [a, b] = drag.current.view
      const span = b - a
      const shift = Math.round(((e.clientX - drag.current.x) / rect.width) * span)
      let n0 = a + shift
      n0 = Math.max(0, Math.min(count - span, n0))
      setView([n0, n0 + span])
    }
    const up = () => {
      drag.current = null
    }
    window.addEventListener('mousemove', move)
    window.addEventListener('mouseup', up)
    return () => {
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mouseup', up)
    }
  }, [count])

  return {
    ref,
    view,
    onMouseDown: (e: React.MouseEvent) => {
      drag.current = { x: e.clientX, view }
    },
    reset: () => setView([0, count]),
  }
}

export function Candles({ bars, sc }: { bars: Bar[]; sc: ReturnType<typeof scales> }) {
  const bodyW = Math.max(1.5, sc.step * 0.62)
  return (
    <g>
      {bars.map((b, i) => {
        const up = b.c >= b.o
        const color = up ? UP : DOWN
        const x = sc.x(i)
        const top = sc.y(Math.max(b.o, b.c))
        const bot = sc.y(Math.min(b.o, b.c))
        return (
          <g key={i}>
            <line x1={x} y1={sc.y(b.h)} x2={x} y2={sc.y(b.l)} stroke={color} strokeWidth={1} opacity={0.9} />
            <rect
              x={x - bodyW / 2}
              y={top}
              width={bodyW}
              height={Math.max(1, bot - top)}
              fill={up ? '#0a0a0a' : color}
              stroke={color}
              strokeWidth={1}
            />
          </g>
        )
      })}
    </g>
  )
}
