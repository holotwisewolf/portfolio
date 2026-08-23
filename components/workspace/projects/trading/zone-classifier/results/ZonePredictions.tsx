'use client'

// The model, live: the RF zone classifier (trained on the 25-zone real set)
// predicting 24 sampled windows from NQ June 2025 — a month it never saw.
// No ground truth exists here; the visitor is the ground truth.

import { useState } from 'react'
import { useJson } from '../../useJson'
import { Candles, scales, type Bar } from '../../candle-utils'
import { BracketHover } from '../../../../brackets'

interface Window {
  start: string
  end: string
  predicted: number
  predicted_name: string
  proba: Record<string, number>
  zone_from: number
  zone_to: number
  bars: [string, number, number, number, number][]
}
interface Payload {
  source: string
  windows: Window[]
}

const LABELS: Record<string, { color: string }> = {
  neutral: { color: '#666666' },
  consolidation: { color: '#eab308' },
  breakout: { color: '#00ff9d' },
}

const asBar = (b: [string, number, number, number, number]): Bar => ({
  t: b[0], o: b[1], h: b[2], l: b[3], c: b[4],
})

function ProbaBars({ proba }: { proba: Record<string, number> }) {
  const entries = Object.entries(proba).sort((a, b) => b[1] - a[1])
  return (
    <div className="space-y-[3px] mt-2">
      {entries.map(([name, p]) => (
        <div key={name} className="flex items-center gap-2">
          <span className="text-[8px] tracking-[0.1em] text-[#444] w-[70px] uppercase">{name}</span>
          <div className="flex-1 h-[6px] bg-[#111] border border-[#1c2e1c]">
            <div className="h-full" style={{ width: `${p * 100}%`, background: LABELS[name].color, opacity: 0.8 }} />
          </div>
          <span className="text-[8px] text-gray-500 w-[32px] text-right">{(p * 100).toFixed(0)}%</span>
        </div>
      ))}
    </div>
  )
}

export default function ZonePredictions() {
  const data = useJson<Payload>('/data/zone-predictions.json')
  const [expanded, setExpanded] = useState<number | null>(null)

  if (!data) {
    return (
      <div className="h-[300px] flex items-center justify-center text-[#444] text-[11px] tracking-[0.3em]">
        LOADING…
      </div>
    )
  }

  const wins = data.windows
  const counts = { neutral: 0, consolidation: 0, breakout: 0 }
  wins.forEach((w) => { counts[w.predicted_name as keyof typeof counts]++ })

  return (
    <div className="bg-[#0a0a0a] font-orbit">
      <div className="flex flex-wrap items-end gap-x-7 px-5 border-b border-[#1c1c1c] text-[9px] tracking-[0.2em]">
        <span className="pb-2 text-[#555]">THE MODEL, LIVE — RF TRAINED ON 25 ZONES, PREDICTING UNSEEN JUNE 2025</span>
        <span className="pb-2 flex items-center gap-4">
          {(['breakout', 'consolidation', 'neutral'] as const).map((n) => (
            <span key={n} style={{ color: LABELS[n].color }}>
              {n.toUpperCase()} <span className="font-orbit text-[12px]">{counts[n]}</span>
            </span>
          ))}
        </span>
        <span className="ml-auto pb-2 text-[#555]">NO GROUND TRUTH EXISTS — YOU ARE THE GROUND TRUTH</span>
      </div>

      <div className="max-h-[560px] overflow-y-auto grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-8 p-5">
        {wins.map((w, i) => {
          const big = expanded === i
          const bars = w.bars.map(asBar)
          const cw = big ? 900 : 200
          const ch = big ? 300 : 90
          const pad = big ? { l: 50, r: 12, t: 16, b: 16 } : { l: 4, r: 4, t: 4, b: 4 }
          const sc = scales(bars, cw, ch, pad)
          const meta = LABELS[w.predicted_name]
          const x0 = Math.max(pad.l, sc.x(w.zone_from) - sc.step / 2)
          const x1 = Math.min(cw - pad.r, sc.x(Math.max(w.zone_to - 1, w.zone_from)) + sc.step / 2)
          return (
            <button
              key={i}
              onClick={() => setExpanded(big ? null : i)}
              className={`group relative text-left p-2 -mx-2 transition-colors ${big ? 'col-span-2 md:col-span-4 ring-1 ring-[#00ff9d]' : 'hover:bg-[#0e120e]'}`}
            >
              <BracketHover />
              <div className="flex justify-between items-baseline mb-1">
                <span className="text-[9px] tracking-[0.15em]" style={{ color: meta.color }}>
                  PRED: {w.predicted_name.toUpperCase()}
                </span>
                <span className="text-[8px] text-[#444]">{w.start}</span>
              </div>
              <svg viewBox={`0 0 ${cw} ${ch}`} className="w-full h-auto block bg-[#0a0a0a]">
                <rect x={x0} y={pad.t} width={Math.max(2, x1 - x0)} height={ch - pad.t - pad.b} fill={meta.color} opacity={0.13} />
                <line x1={x0} y1={pad.t} x2={x0} y2={ch - pad.b} stroke={meta.color} strokeWidth={1} strokeDasharray="3 2" />
                <line x1={x1} y1={pad.t} x2={x1} y2={ch - pad.b} stroke={meta.color} strokeWidth={1} strokeDasharray="3 2" />
                <Candles bars={bars} sc={sc} />
                {big && (
                  <text x={pad.l + 6} y={pad.t + 12} fill={meta.color} fontSize={10} fontFamily="Orbit, monospace" letterSpacing={2}>
                    {`MODEL SAYS: ${w.predicted_name.toUpperCase()} — ${w.start} TO ${w.end}`}
                  </text>
                )}
              </svg>
              <ProbaBars proba={w.proba} />
              {big && (
                <div className="text-[9px] text-[#444] mt-2">
                  Window sampled per the labeler protocol (4–24 fifteen-minute candles). Features extracted with the
                  research code; probabilities from the trained forest. Click again to collapse.
                </div>
              )}
            </button>
          )
        })}
      </div>

      <div className="border-t border-[#1c2e1c] px-3 py-2 space-y-1">
        <div className="flex flex-wrap gap-4 text-[9px] tracking-[0.15em] text-[#444]">
          <span>SHADED = THE WINDOW THE MODEL CLASSIFIED · CLICK TO EXPAND · TIMES UTC</span>
          <span className="ml-auto">{data.source}</span>
        </div>
        <div className="text-[9px] text-[#eab308] tracking-[0.1em] leading-relaxed">
          NOTICE: THE FOREST NEVER CALLS CONSOLIDATION ON UNSEEN DATA — IT SAW ONLY 5 CONSOLIDATION
          EXAMPLES IN TRAINING, SO ITS PROBABILITY CEILS OUT AROUND 29%. THAT ASYMMETRY IS THE
          SMALL-SAMPLE STORY, VISIBLE IN THE NUMBERS.
        </div>
      </div>
    </div>
  )
}
