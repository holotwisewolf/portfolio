'use client'

// Orderflow day explorer on REAL Databento NQ tick data (March 2025). Price path on
// top; per-bar aggressor delta and cumulative intraday delta below — actual buy/sell
// aggression computed from trade sides, not generated.

import { useMemo, useState } from 'react'
import data from './demo-data.json'

interface Day {
  date: string
  lo: number
  hi: number
  vpoc: number
  points: [string, number][]
  delta: number[]
  buy: number[]
  sell: number[]
}

const days = (data as unknown as { days: Day[] }).days

const VB_W = 900
const VB_H = 460
const PAD = { l: 58, r: 20, t: 26, b: 26 }
const PRICE_H = 240
const GAP = 34
const DELTA_H = VB_H - PAD.t - PAD.b - PRICE_H - GAP
const PLOT_W = VB_W - PAD.l - PAD.r
const FONT = 'Orbit, monospace'
const GRID = '#1c2e1c'

export default function OrderflowDayExplorer() {
  const [dayIdx, setDayIdx] = useState(0)
  const [hover, setHover] = useState<number | null>(null)
  const day = days[dayIdx]
  const n = day.points.length

  const { px, py, cum, dMax, yPrice, yCum, yDelta } = useMemo(() => {
    const pad = (day.hi - day.lo) * 0.06
    const yPrice = (p: number) => PAD.t + (1 - (p - (day.lo - pad)) / (day.hi + pad - day.lo + pad)) * PRICE_H
    let c = 0
    const cum = day.delta.map((d) => (c += d))
    const cMax = Math.max(...cum.map(Math.abs), 1)
    const dMax = Math.max(...day.delta.map(Math.abs), 1)
    const yCum = (v: number) => PAD.t + PRICE_H + GAP + DELTA_H / 2 - (v / cMax) * (DELTA_H / 2)
    const yDelta = (v: number) => yCum(0) - (v / dMax) * (DELTA_H / 2 - 6)
    return { px: (i: number) => PAD.l + (i / Math.max(1, n - 1)) * PLOT_W, py: yPrice, cum, dMax, yPrice, yCum, yDelta }
  }, [day, n])

  const pricePath = day.points.map(([, p], i) => `${i === 0 ? 'M' : 'L'}${px(i).toFixed(1)},${py(p).toFixed(1)}`).join(' ')
  const cumPath = cum.map((v, i) => `${i === 0 ? 'M' : 'L'}${px(i).toFixed(1)},${yCum(v).toFixed(1)}`).join(' ')
  const finalCum = cum[cum.length - 1]
  const buyVol = day.buy.reduce((a, b) => a + b, 0)
  const sellVol = day.sell.reduce((a, b) => a + b, 0)

  const onMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const relX = ((e.clientX - rect.left) / rect.width) * VB_W
    const i = Math.round(((relX - PAD.l) / PLOT_W) * (n - 1))
    setHover(Math.max(0, Math.min(n - 1, i)))
  }

  const hp = hover !== null ? day.points[hover] : null

  return (
    <div className="bg-[#0a0a0a] font-orbit">
      <div className="flex flex-wrap gap-[1px] bg-[#1c2e1c] border-b border-[#1c2e1c]">
        {days.map((d, i) => (
          <button
            key={d.date}
            onClick={() => { setDayIdx(i); setHover(null) }}
            className={`px-3 py-2 text-[10px] tracking-[0.15em] transition-colors ${
              i === dayIdx ? 'bg-[#0a1a0a] text-[#00ff9d]' : 'bg-[#0a0a0a] text-gray-500 hover:text-white'
            }`}
          >
            {d.date}
          </button>
        ))}
        <div className="flex-1 bg-[#0a0a0a] px-3 py-2 text-right text-[9px] tracking-[0.2em] text-[#444] flex items-center justify-end gap-4">
          <span>FINAL CUM Δ <span className={finalCum >= 0 ? 'text-[#00ff9d]' : 'text-[#ef4444]'}>{finalCum >= 0 ? '+' : ''}{finalCum.toLocaleString()}</span></span>
          <span>BUY <span className="text-[#00cc77]">{(buyVol / 1e6).toFixed(2)}M</span></span>
          <span>SELL <span className="text-[#ef4444]">{(sellVol / 1e6).toFixed(2)}M</span></span>
        </div>
      </div>

      <svg viewBox={`0 0 ${VB_W} ${VB_H}`} className="w-full h-auto block" onMouseMove={onMove} onMouseLeave={() => setHover(null)}>
        {/* price pane */}
        {[0, 1, 2, 3].map((i) => {
          const p = day.lo + ((day.hi - day.lo) * i) / 3
          return (
            <g key={`p${i}`}>
              <line x1={PAD.l} y1={py(p)} x2={PAD.l + PLOT_W} y2={py(p)} stroke={GRID} strokeWidth={1} strokeDasharray="3 3" />
              <text x={PAD.l - 8} y={py(p) + 3} fill="#666" fontSize={10} fontFamily={FONT} textAnchor="end">
                {p.toFixed(0)}
              </text>
            </g>
          )
        })}
        <text x={PAD.l + 4} y={PAD.t + 12} fill="#444" fontSize={9} fontFamily={FONT} letterSpacing={2}>PRICE</text>
        <path d={pricePath} fill="none" stroke="#00cc77" strokeWidth={1.5} />

        {/* delta pane */}
        <line x1={PAD.l} y1={yCum(0)} x2={PAD.l + PLOT_W} y2={yCum(0)} stroke={GRID} strokeWidth={1} />
        <text x={PAD.l + 4} y={yCum(0) - 6} fill="#444" fontSize={9} fontFamily={FONT} letterSpacing={2}>CUM DELTA / BAR DELTA</text>

        {/* per-bar aggressor delta */}
        {day.delta.map((d, i) => {
          const h = Math.abs(d) / dMax * (DELTA_H / 2 - 6)
          if (h < 0.5) return null
          return (
            <rect
              key={i}
              x={px(i) - 1}
              y={d > 0 ? yDelta(d) : yCum(0)}
              width={2}
              height={h}
              fill={d > 0 ? '#00cc77' : '#ef4444'}
              opacity={0.45}
            />
          )
        })}

        {/* cumulative delta line */}
        <path d={cumPath} fill="none" stroke="#00ff9d" strokeWidth={1.5} />

        {/* hover crosshair across both panes */}
        {hp && (
          <g pointerEvents="none">
            <line x1={px(hover!)} y1={PAD.t} x2={px(hover!)} y2={PAD.t + PRICE_H + GAP + DELTA_H} stroke="#00ff9d" strokeWidth={1} strokeOpacity={0.3} />
            <rect x={px(hover!) - 3} y={py(hp[1]) - 3} width={6} height={6} fill="#00ff9d" />
            <rect x={px(hover!) - 3} y={yCum(cum[hover!]) - 3} width={6} height={6} fill="none" stroke="#00ff9d" />
            <text x={Math.min(px(hover!) + 8, VB_W - 150)} y={PAD.t + 14} fill="#00ff9d" fontSize={10} fontFamily={FONT}>
              {`${hp[0]}  ${hp[1].toFixed(2)}  Δ${cum[hover!] >= 0 ? '+' : ''}${cum[hover!].toLocaleString()}`}
            </text>
          </g>
        )}
      </svg>

      <div className="border-t border-[#1c2e1c] px-3 py-2 flex flex-wrap gap-4 text-[9px] tracking-[0.15em] text-[#444]">
        <span><span className="inline-block w-[7px] h-[7px] bg-[#00ff9d] mr-1 align-middle" /> CUMULATIVE DELTA</span>
        <span><span className="inline-block w-[3px] h-[7px] bg-[#00cc77] mr-1 align-middle" /> BUY AGGRESSION</span>
        <span><span className="inline-block w-[3px] h-[7px] bg-[#ef4444] mr-1 align-middle" /> SELL AGGRESSION</span>
        <span className="ml-auto">{(data as any).source} — 2-min bars</span>
      </div>
    </div>
  )
}
