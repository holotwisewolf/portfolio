'use client'

// Orderflow day explorer on REAL Databento NQ tick data (March 2025). Candle
// bars colored by close direction, per-bar aggressor delta strip, and cumulative
// intraday delta — actual buy/sell aggression computed from trade sides.

import { useMemo, useState } from 'react'
import { useJson } from '../useJson'
import { Candles, scales, useZoom, type Bar } from '../candle-utils'

interface Day {
  date: string
  lo: number
  hi: number
  vpoc: number
  bars: [string, number, number, number, number, number, number, number][]
}
interface Payload {
  source: string
  days: Day[]
}

const VB_W = 900
const VB_H = 470
const PAD = { l: 58, r: 20, t: 26, b: 26 }
const PRICE_H = 250
const GAP = 30
const DELTA_H = VB_H - PAD.t - PAD.b - PRICE_H - GAP
const PLOT_W = VB_W - PAD.l - PAD.r
const FONT = 'Orbit, monospace'
const GRID = '#1c2e1c'

const asBar = (b: [string, number, number, number, number, number, number, number]): Bar => ({
  t: b[0], o: b[1], h: b[2], l: b[3], c: b[4],
})

export default function OrderflowDayExplorer() {
  const data = useJson<Payload>('/data/orderflow-days.json')
  if (!data) {
    return (
      <div className="h-[300px] flex items-center justify-center text-[#444] text-[11px] tracking-[0.3em]">
        LOADING…
      </div>
    )
  }
  return <Explorer data={data} />
}

function Explorer({ data }: { data: Payload }) {
  const days = data.days
  const [dayIdx, setDayIdx] = useState(0)
  const [hover, setHover] = useState<number | null>(null)
  const day = days[dayIdx]
  const bars = useMemo(() => day.bars.map(asBar), [day])
  const deltas = day.bars.map((b) => b[5])
  const n = bars.length

  const zoom = useZoom(n)

  const priceSc = useMemo(
    () => scales(bars, VB_W, PRICE_H + PAD.t + PAD.b, PAD, undefined, undefined, { from: zoom.view[0], to: zoom.view[1] }),
    [bars, zoom.view]
  )

  const { cum, dMax, cumMax } = useMemo(() => {
    let c = 0
    const cum = deltas.map((d) => (c += d))
    return {
      cum,
      cumMax: Math.max(...cum.map(Math.abs), 1),
      dMax: Math.max(...deltas.map(Math.abs), 1),
    }
  }, [deltas])

  const deltaTop = PAD.t + PRICE_H + GAP
  const cumY = (v: number) => deltaTop + DELTA_H / 2 - (v / cumMax) * (DELTA_H / 2)
  const deltaY = (v: number) => cumY(0) - (v / dMax) * (DELTA_H / 2 - 4)

  const cumPath = cum.map((v, i) => `${i === 0 ? 'M' : 'L'}${priceSc.x(i).toFixed(1)},${cumY(v).toFixed(1)}`).join(' ')
  const finalCum = cum[cum.length - 1]
  const buyVol = day.bars.reduce((a, b) => a + b[6], 0)
  const sellVol = day.bars.reduce((a, b) => a + b[7], 0)

  const onMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const relX = ((e.clientX - rect.left) / rect.width) * VB_W
    const i = Math.floor((relX - PAD.l) / priceSc.step) + zoom.view[0]
    setHover(Math.max(zoom.view[0], Math.min(zoom.view[1] - 1, i)))
  }

  const hb = hover !== null ? bars[hover] : null

  return (
    <div className="bg-[#0a0a0a] font-orbit">
      <div className="flex flex-wrap items-end gap-x-7 px-5 border-b border-[#1c1c1c]">
        {days.map((d, i) => (
          <button
            key={d.date}
            onClick={() => { setDayIdx(i); setHover(null) }}
            className={`pt-2 pb-2 text-[10px] tracking-[0.15em] transition-colors border-b-2 -mb-px ${
              i === dayIdx ? 'text-white border-[#00ff9d]' : 'text-[#666] border-transparent hover:text-white'
            }`}
          >
            {d.date}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-6 pb-2 text-[9px] tracking-[0.2em] text-[#555]">
          <span>FINAL CUM Δ <span className={`text-[13px] font-orbit ml-1 ${finalCum >= 0 ? 'text-[#00ff9d]' : 'text-[#ef4444]'}`}>{finalCum >= 0 ? '+' : ''}{finalCum.toLocaleString()}</span></span>
          <span>BUY <span className="text-[13px] text-[#00cc77] font-orbit ml-1">{(buyVol / 1e6).toFixed(2)}M</span></span>
          <span>SELL <span className="text-[13px] text-[#ef4444] font-orbit ml-1">{(sellVol / 1e6).toFixed(2)}M</span></span>
        </div>
      </div>

      <svg
        ref={zoom.ref}
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        className="w-full h-auto block cursor-crosshair"
        onMouseMove={onMove}
        onMouseLeave={() => setHover(null)}
        onMouseDown={zoom.onMouseDown}
        onDoubleClick={zoom.reset}
      >
        {/* price pane */}
        {[0, 1, 2, 3].map((i) => {
          const p = day.lo + ((day.hi - day.lo) * i) / 3
          return (
            <g key={`p${i}`}>
              <line x1={PAD.l} y1={priceSc.y(p)} x2={PAD.l + PLOT_W} y2={priceSc.y(p)} stroke={GRID} strokeWidth={1} strokeDasharray="3 3" />
              <text x={PAD.l - 8} y={priceSc.y(p) + 3} fill="#666" fontSize={10} fontFamily={FONT} textAnchor="end">
                {p.toFixed(0)}
              </text>
            </g>
          )
        })}
        <text x={PAD.l + 4} y={PAD.t + 12} fill="#444" fontSize={9} fontFamily={FONT} letterSpacing={2}>PRICE — 5-MIN CANDLES</text>
        <Candles bars={bars} sc={priceSc} />

        {/* delta pane */}
        <line x1={PAD.l} y1={cumY(0)} x2={PAD.l + PLOT_W} y2={cumY(0)} stroke={GRID} strokeWidth={1} />
        <text x={PAD.l + 4} y={cumY(0) - 6} fill="#444" fontSize={9} fontFamily={FONT} letterSpacing={2}>CUM DELTA / BAR DELTA</text>

        {/* per-bar aggressor delta, colored by side */}
        {deltas.map((d, i) => {
          const h = (Math.abs(d) / dMax) * (DELTA_H / 2 - 4)
          if (h < 0.5) return null
          return (
            <rect
              key={i}
              x={priceSc.x(i) - 1}
              y={d > 0 ? deltaY(d) : cumY(0)}
              width={2}
              height={h}
              fill={d > 0 ? '#00cc77' : '#ef4444'}
              opacity={0.5}
            />
          )
        })}

        {/* cumulative delta line */}
        <path d={cumPath} fill="none" stroke="#00ff9d" strokeWidth={1.5} />

        {/* hover crosshair across both panes */}
        {hb && (
          <g pointerEvents="none">
            <line x1={priceSc.x(hover!)} y1={PAD.t} x2={priceSc.x(hover!)} y2={deltaTop + DELTA_H} stroke="#00ff9d" strokeWidth={1} strokeOpacity={0.3} />
            <rect x={priceSc.x(hover!) - 3} y={priceSc.y(hb.c) - 3} width={6} height={6} fill="#00ff9d" />
            <rect x={priceSc.x(hover!) - 3} y={cumY(cum[hover!]) - 3} width={6} height={6} fill="none" stroke="#00ff9d" />
            <text x={Math.min(priceSc.x(hover!) + 8, VB_W - 170)} y={PAD.t + 14} fill="#00ff9d" fontSize={10} fontFamily={FONT}>
              {`${hb.t}  C${hb.c.toFixed(2)}  Δ${cum[hover!] >= 0 ? '+' : ''}${cum[hover!].toLocaleString()}`}
            </text>
          </g>
        )}
      </svg>

      <div className="border-t border-[#1c1c1c] px-3 py-2 space-y-2">
        <div className="flex flex-wrap gap-4 text-[9px] tracking-[0.15em] text-[#444]">
          <span><span className="inline-block w-[7px] h-[7px] bg-[#00ff9d] mr-1 align-middle" /> CUMULATIVE DELTA</span>
          <span><span className="inline-block w-[3px] h-[7px] bg-[#00cc77] mr-1 align-middle" /> BUY AGGRESSION</span>
          <span><span className="inline-block w-[3px] h-[7px] bg-[#ef4444] mr-1 align-middle" /> SELL AGGRESSION</span>
          <span className="ml-auto">{data.source} — 5-min candles · SCROLL TO ZOOM · DRAG TO PAN · DBL-CLICK RESET</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[1px] bg-[#1c1c1c] border border-[#1c1c1c]">
          <div className="bg-[#0a0a0a] p-2">
            <div className="text-[9px] tracking-[0.2em] text-[#00ff9d] mb-1">WHAT THIS IS</div>
            <div className="text-[9px] text-[#777] leading-relaxed">
              One real trading day. Top pane: price as 5-min candles. Bottom pane: aggression — each tick
              signed by who crossed the spread (green = buyer aggressed, red = seller), shown per bar and
              as the running total for the day.
            </div>
          </div>
          <div className="bg-[#0a0a0a] p-2">
            <div className="text-[9px] tracking-[0.2em] text-[#00ff9d] mb-1">WHAT TO LOOK FOR — DIVERGENCE</div>
            <div className="text-[9px] text-[#777] leading-relaxed">
              Price pushing to new highs while cumulative delta flattens or falls = buyers printing volume
              into passive sellers without moving price. That is absorption — the low-elasticity condition
              from this project&apos;s method page, visible in the raw feed.
            </div>
          </div>
          <div className="bg-[#0a0a0a] p-2">
            <div className="text-[9px] tracking-[0.2em] text-[#00ff9d] mb-1">WHAT TO LOOK FOR — SPIKES</div>
            <div className="text-[9px] text-[#777] leading-relaxed">
              A tall one-sided delta bar with a small candle body = heavy aggression, no movement = a wall
              of passive liquidity. The header&apos;s FINAL CUM Δ is the day&apos;s net aggression: positive
              means buyers dominated the session.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
