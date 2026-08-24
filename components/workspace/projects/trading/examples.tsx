'use client'

// Interactive "show example" blocks for method pages: real market data with the
// concept's geometry computed and drawn over it. Registry pattern mirrors
// diagrams.tsx; wired via DocFile's { kind: 'example', id } block.

import { useMemo, useState } from 'react'
import { useJson } from './useJson'
import { Candles, scales, type Bar } from './candle-utils'

interface DayBars {
  date: string
  bars: [string, number, number, number, number, number, number, number][]
}
type Payload = { days: DayBars[] }

const FONT = 'Orbit, monospace'
const GREEN = '#00ff9d'
const AMBER = '#eab308'
const GRAY = '#555'

const asBar = (b: [string, number, number, number, number, number, number, number]): Bar => ({
  t: b[0], o: b[1], h: b[2], l: b[3], c: b[4],
})

// The IB cloned box, computed live from a real trading day in the tick data:
// 09:30–10:30 ET high/low, cloned 100% and 50% above and below.
export function IbClonedBoxExample() {
  const data = useJson<Payload>('/data/vpoc-days.json')
  const [show, setShow] = useState(false)

  // pick the most instructive day: one whose price actually reached a 100% extension
  const pick = useMemo(() => {
    if (!data) return null
    for (const day of data.days) {
      const bars = day.bars.map(asBar)
      const ibBars = bars.filter((b) => b.t >= '09:30' && b.t < '10:30')
      if (ibBars.length < 10) continue
      const hi = Math.max(...ibBars.map((b) => b.h))
      const lo = Math.min(...ibBars.map((b) => b.l))
      const h = hi - lo
      const reached = bars.some((b) => b.h >= hi + h || b.l <= lo - h)
      if (reached) return { day, bars, ibBars, hi, lo, h }
    }
    const day = data.days[0]
    const bars = day.bars.map(asBar)
    const ibBars = bars.filter((b) => b.t >= '09:30' && b.t < '10:30')
    const hi = Math.max(...ibBars.map((b) => b.h))
    const lo = Math.min(...ibBars.map((b) => b.l))
    return { day, bars, ibBars, hi, lo, h: hi - lo }
  }, [data])

  if (!data || !pick) {
    return <div className="h-[120px] flex items-center justify-center text-[#444] text-[11px] tracking-[0.3em]">LOADING…</div>
  }

  const { day, bars, hi, lo, h } = pick
  const ext100t = hi + h
  const ext100b = lo - h
  const ext50t = hi + h * 0.5
  const ext50b = lo - h * 0.5

  const W = 900
  const H = 340
  const pad = { l: 56, r: 14, t: 20, b: 20 }
  const sc = scales(bars, W, H, pad, lo - h * 0.2, ext100t + h * 0.2)
  const ibX0 = sc.x(bars.findIndex((b) => b.t >= '09:30'))
  const ibX1 = sc.x(bars.findIndex((b) => b.t >= '10:30'))

  return (
    <div>
      <button
        onClick={() => setShow(!show)}
        className={`text-[10px] tracking-[0.15em] border-b-2 pb-[2px] transition-colors ${
          show ? 'text-[#00ff9d] border-[#00ff9d]' : 'text-[#666] border-transparent hover:text-white'
        }`}
      >
        {show ? '[x] HIDE EXAMPLE' : '> SHOW EXAMPLE — REAL DAY'}
      </button>

      {show && (
        <div className="mt-4">
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto block bg-[#0a0a0a]">
            {/* 100% extensions — the fade targets */}
            <rect x={pad.l} y={sc.y(ext100t)} width={W - pad.l - pad.r} height={sc.y(hi) - sc.y(ext100t)} fill={AMBER} opacity={0.05} />
            <line x1={pad.l} y1={sc.y(ext100t)} x2={W - pad.r} y2={sc.y(ext100t)} stroke={AMBER} strokeWidth={1} strokeDasharray="5 4" />
            <rect x={pad.l} y={sc.y(lo)} width={W - pad.l - pad.r} height={sc.y(ext100b) - sc.y(lo)} fill={AMBER} opacity={0.05} />
            <line x1={pad.l} y1={sc.y(ext100b)} x2={W - pad.r} y2={sc.y(ext100b)} stroke={AMBER} strokeWidth={1} strokeDasharray="5 4" />

            {/* 50% extensions */}
            <line x1={pad.l} y1={sc.y(ext50t)} x2={W - pad.r} y2={sc.y(ext50t)} stroke="#333" strokeWidth={1} strokeDasharray="2 4" />
            <line x1={pad.l} y1={sc.y(ext50b)} x2={W - pad.r} y2={sc.y(ext50b)} stroke="#333" strokeWidth={1} strokeDasharray="2 4" />

            {/* the IB itself */}
            <rect x={Math.max(pad.l, ibX0 - sc.step / 2)} y={sc.y(hi)} width={ibX1 - ibX0} height={sc.y(lo) - sc.y(hi)} fill={GREEN} opacity={0.12} />
            <line x1={pad.l} y1={sc.y(hi)} x2={W - pad.r} y2={sc.y(hi)} stroke={GREEN} strokeWidth={1.2} />
            <line x1={pad.l} y1={sc.y(lo)} x2={W - pad.r} y2={sc.y(lo)} stroke={GREEN} strokeWidth={1.2} />

            {/* candles over everything */}
            <Candles bars={bars} sc={sc} />

            {/* labels */}
            <text x={pad.l + 4} y={sc.y(hi) - 5} fill={GREEN} fontSize={10} fontFamily={FONT}>IB_HIGH {hi.toFixed(2)}</text>
            <text x={pad.l + 4} y={sc.y(lo) + 13} fill={GREEN} fontSize={10} fontFamily={FONT}>IB_LOW {lo.toFixed(2)}</text>
            <text x={W - pad.r - 4} y={sc.y(ext100t) - 5} fill={AMBER} fontSize={10} fontFamily={FONT} textAnchor="end">EXT_100_TOP (fade target)</text>
            <text x={W - pad.r - 4} y={sc.y(ext100b) + 13} fill={AMBER} fontSize={10} fontFamily={FONT} textAnchor="end">EXT_100_BOTTOM (fade target)</text>
          </svg>
          <div className="text-[9px] tracking-[0.2em] text-[#555] mt-3 leading-relaxed">
            {day.date} — REAL NQ CANDLES. THE BOX IS COMPUTED FROM THIS DAY&apos;S 09:30–10:30 RANGE, NOT DRAWN BY HAND.
            HEIGHT {h.toFixed(2)} · WATCH WHAT PRICE DID AT EACH DASHED LEVEL.
          </div>
        </div>
      )}
    </div>
  )
}

export const EXAMPLES: Record<string, typeof IbClonedBoxExample> = {
  'ib-cloned-box': IbClonedBoxExample,
}
