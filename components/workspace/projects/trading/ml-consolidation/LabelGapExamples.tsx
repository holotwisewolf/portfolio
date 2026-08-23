'use client'

// THE GAP, made concrete: real labeled zones with what actually happened in the
// 10 bars AFTER each zone. Label accuracy is measured backwards; trading needs it
// forwards. Every example computed live from the real zone-labels.json candles.

import { useMemo, useState } from 'react'
import { useJson } from '../useJson'
import { Candles, scales, type Bar } from '../candle-utils'

interface Zone {
  start: string
  end: string
  label: number
  zone_from: number
  zone_to: number
  bars: [string, number, number, number, number, number, number, number][]
}
interface Payload {
  source: string
  zones: Zone[]
}

const LABELS: Record<number, { name: string; color: string }> = {
  1: { name: 'NEUTRAL', color: '#666666' },
  2: { name: 'CONSOLIDATION', color: '#eab308' },
  3: { name: 'BREAKOUT', color: '#00ff9d' },
}

const asBar = (b: [string, number, number, number, number, number, number, number]): Bar => ({
  t: b[0], o: b[1], h: b[2], l: b[3], c: b[4],
})

function rangePct(bars: Bar[]) {
  if (!bars.length) return 0
  const hi = Math.max(...bars.map((b) => b.h))
  const lo = Math.min(...bars.map((b) => b.l))
  return ((hi - lo) / lo) * 100
}

interface Example {
  zone: Zone
  zoneRange: number
  fwdRange: number
  ratio: number
  verdict: string
}

export default function LabelGapExamples() {
  const data = useJson<Payload>('/data/zone-labels.json')
  if (!data) {
    return (
      <div className="h-[200px] flex items-center justify-center text-[#444] text-[11px] tracking-[0.3em]">
        LOADING…
      </div>
    )
  }
  return <Examples zones={data.zones} />
}

function Examples({ zones }: { zones: Zone[] }) {
  const [show, setShow] = useState(false)

  // forward window = the bars after the labeled zone (zone end + up to 10 bars,
  // already in the JSON as trailing context)
  const examples = useMemo<Example[]>(() => {
    const scored = zones.map((z) => {
      const bars = z.bars.map(asBar)
      const zoneBars = bars.slice(z.zone_from, z.zone_to)
      const fwdBars = bars.slice(z.zone_to, z.zone_to + 10)
      const zoneRange = rangePct(zoneBars)
      const fwdRange = rangePct(fwdBars)
      return { zone: z, zoneRange, fwdRange, ratio: fwdRange / (zoneRange || 1e-9) }
    }).filter((s) => s.zoneRange > 0 && s.zone.zone_to - s.zone.zone_from >= 2)

    const consol = scored.filter((s) => s.zone.label === 2)
    const breakouts = scored.filter((s) => s.zone.label === 3)

    const pick = <T,>(arr: T[], cmp: (a: T, b: T) => number) => [...arr].sort(cmp)[0]

    const quietAfter = pick(consol, (a, b) => a.ratio - b.ratio) // label "worked": still chopping
    const explodedAfter = pick(consol, (a, b) => b.ratio - a.ratio) // label said chop, market trended
    const fizzledBreakout = pick(breakouts, (a, b) => a.ratio - b.ratio) // breakout label, nothing followed

    return [
      quietAfter && {
        ...quietAfter,
        verdict: 'Label was an accurate DESCRIPTION — the chop continued. And a description of chop gives you no entry, no direction, no edge. Accurate, untradeable.',
      },
      explodedAfter && {
        ...explodedAfter,
        verdict: `Same label, opposite aftermath: price expanded ${explodedAfter.ratio.toFixed(1)}× the zone range right after. A consolidation signal you cannot act on is indistinguishable from noise.`,
      },
      fizzledBreakout && {
        ...fizzledBreakout,
        verdict: 'A breakout label followed by less movement than the "breakout" itself. The labeler saw expansion; the market did not agree going forwards.',
      },
    ].filter(Boolean) as Example[]
  }, [])

  return (
    <div className="bg-[#0a0a0a] font-orbit">
      <div className="flex gap-[1px] bg-[#1c2e1c] border-b border-[#1c2e1c] items-stretch">
        <span className="bg-[#0a0a0a] px-3 py-2 text-[9px] tracking-[0.2em] text-[#444] flex items-center">
          THE GAP — LABEL vs WHAT HAPPENED NEXT (REAL ZONES, REAL CANDLES)
        </span>
        <button
          onClick={() => setShow(!show)}
          className={`ml-auto px-3 py-2 text-[10px] tracking-[0.15em] transition-colors ${
            show ? 'text-[#00ff9d] bg-[#0a1a0a]' : 'text-gray-500 hover:text-white bg-[#0a0a0a]'
          }`}
        >
          {show ? '[x] HIDE EXAMPLES' : '> SHOW REAL EXAMPLES'}
        </button>
      </div>

      {show && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-[1px] bg-[#1c2e1c]">
          {examples.map((ex, i) => {
            const bars = ex.zone.bars.map(asBar)
            const w = 300
            const h = 130
            const pad = { l: 4, r: 4, t: 6, b: 6 }
            const sc = scales(bars, w, h, pad)
            const meta = LABELS[ex.zone.label]
            const z0 = Math.max(pad.l, sc.x(ex.zone.zone_from) - sc.step / 2)
            const z1 = sc.x(ex.zone.zone_to - 1) + sc.step / 2
            const f1 = Math.min(w - pad.r, sc.x(Math.min(ex.zone.zone_to + 10, bars.length) - 1) + sc.step / 2)
            return (
              <div key={i} className="bg-[#0a0a0a] p-3">
                <div className="flex justify-between items-baseline mb-2">
                  <span className="text-[9px] tracking-[0.2em]" style={{ color: meta.color }}>{meta.name}</span>
                  <span className="text-[9px] text-[#444]">{ex.zone.start}</span>
                </div>
                <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto block bg-[#0a0a0a]">
                  <rect x={z0} y={pad.t} width={z1 - z0} height={h - pad.t - pad.b} fill={meta.color} opacity={0.14} />
                  <rect x={z1} y={pad.t} width={Math.max(1, f1 - z1)} height={h - pad.t - pad.b} fill="none" stroke="#fff" strokeWidth={1} strokeDasharray="2 2" opacity={0.5} />
                  <Candles bars={bars} sc={sc} />
                </svg>
                <div className="grid grid-cols-3 gap-2 mt-2 text-[9px] tracking-[0.1em]">
                  <div><div className="text-[#444]">ZONE RANGE</div><div className="text-white">{ex.zoneRange.toFixed(2)}%</div></div>
                  <div><div className="text-[#444]">NEXT 10 BARS</div><div className={ex.fwdRange > ex.zoneRange ? 'text-[#ef4444]' : 'text-[#00cc77]'}>{ex.fwdRange.toFixed(2)}%</div></div>
                  <div><div className="text-[#444]">EXPANSION</div><div className="text-white">{ex.ratio.toFixed(1)}×</div></div>
                </div>
                <p className="text-[10px] text-gray-400 leading-relaxed mt-2">{ex.verdict}</p>
              </div>
            )
          })}
        </div>
      )}

      <div className="border-t border-[#1c2e1c] px-3 py-2 text-[9px] tracking-[0.15em] text-[#444]">
        SHADED = THE LABELED ZONE · DASHED OUTLINE = THE 10 BARS AFTER IT · 5-MIN CANDLES FROM REAL NQ TICKS
      </div>
    </div>
  )
}
