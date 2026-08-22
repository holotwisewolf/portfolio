'use client'

// Shared candle-chart primitives for the real-data demos. Parents own the <svg>
// and compose: call scales() for coordinate mapping, drop <Candles/> inside,
// then draw pins/lines/shading with the same scale functions.

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
  explicitHi?: number
) {
  const lo = explicitLo ?? Math.min(...bars.map((b) => b.l))
  const hi = explicitHi ?? Math.max(...bars.map((b) => b.h))
  const p = (hi - lo) * 0.06 || 1
  const yLo = lo - p
  const yHi = hi + p
  const plotW = w - pad.l - pad.r
  const plotH = h - pad.t - pad.b
  const step = plotW / Math.max(1, bars.length)
  return {
    x: (i: number) => pad.l + step * (i + 0.5),
    step,
    y: (price: number) => pad.t + (1 - (price - yLo) / (yHi - yLo)) * plotH,
    lo,
    hi,
    w,
    h,
    pad,
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
