'use client'

// VPOC day explorer on REAL Databento NQ tick data (March 2025). Candle bars,
// session VPOC level, pinned touch moments with reaction extremes, and the
// volume-at-price profile that produced the VPOC. Dataset fetched from
// /public/data so it stays out of the JS bundle.

import { useMemo, useState } from 'react'
import { useJson } from '../useJson'
import { Candles, scales, type Bar } from '../candle-utils'

interface Touch {
  t: string
  price: number
  rt: string
  rprice: number
  move: number
}
interface Day {
  date: string
  lo: number
  hi: number
  vpoc: number
  bars: [string, number, number, number, number, number, number, number][]
  profile: [number, number][]
  touches: Touch[]
}
interface Payload {
  instrument: string
  source: string
  days: Day[]
}

const VB_W = 900
const VB_H = 400
const PAD = { l: 58, r: 92, t: 26, b: 26 }
const FONT = 'Orbit, monospace'
const GRID = '#1c2e1c'

const asBar = (b: [string, number, number, number, number, number, number, number]): Bar => ({
  t: b[0], o: b[1], h: b[2], l: b[3], c: b[4],
})

export default function VpocDayExplorer() {
  const data = useJson<Payload>('/data/vpoc-days.json')
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

  const sc = useMemo(() => scales(bars, VB_W, VB_H, PAD), [bars])
  const maxVol = Math.max(...day.profile.map(([, v]) => v), 1)
  // every touch gets a pin; only the 3 strongest reactions get labels
  const labeled = useMemo(
    () =>
      new Set(
        [...day.touches].sort((a, b) => Math.abs(b.move) - Math.abs(a.move)).slice(0, 3).map((t) => t.t + t.price)
      ),
    [day]
  )

  const idxOf = (t: string) => bars.findIndex((b) => b.t === t)
  const best = Math.max(...day.touches.map((t) => Math.abs(t.move)), 0)

  const onMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const relX = ((e.clientX - rect.left) / rect.width) * VB_W
    const i = Math.floor((relX - PAD.l) / sc.step)
    setHover(Math.max(0, Math.min(bars.length - 1, i)))
  }

  const hb = hover !== null ? bars[hover] : null

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
          <span>VPOC <span className="text-[#00ff9d]">{day.vpoc.toFixed(2)}</span></span>
          <span>TOUCHES <span className="text-white">{day.touches.length}</span></span>
          <span>BEST REACTION <span className="text-[#00ff9d]">{best.toFixed(2)}%</span></span>
        </div>
      </div>

      <svg viewBox={`0 0 ${VB_W} ${VB_H}`} className="w-full h-auto block" onMouseMove={onMove} onMouseLeave={() => setHover(null)}>
        {/* grid + y labels */}
        {[0, 1, 2, 3, 4].map((i) => {
          const p = day.lo + ((day.hi - day.lo) * i) / 4
          return (
            <g key={i}>
              <line x1={PAD.l} y1={sc.y(p)} x2={PAD.l + (VB_W - PAD.l - PAD.r)} y2={sc.y(p)} stroke={GRID} strokeWidth={1} strokeDasharray="3 3" />
              <text x={PAD.l - 8} y={sc.y(p) + 3} fill="#666" fontSize={10} fontFamily={FONT} textAnchor="end">
                {p.toFixed(0)}
              </text>
            </g>
          )
        })}

        {/* volume-at-price profile — right edge; VPOC bin highlighted */}
        {day.profile.map(([p, v], i) => {
          const isVpoc = Math.abs(p - day.vpoc) < (day.hi - day.lo) / 60
          return (
            <rect
              key={i}
              x={PAD.l + (VB_W - PAD.l - PAD.r) + 8}
              y={sc.y(p) - 2}
              width={Math.max(1, (v / maxVol) * 68)}
              height={4}
              fill={isVpoc ? '#00ff9d' : '#00cc77'}
              opacity={isVpoc ? 0.6 : 0.2}
            />
          )
        })}

        {/* VPOC level */}
        <line x1={PAD.l} y1={sc.y(day.vpoc)} x2={PAD.l + (VB_W - PAD.l - PAD.r)} y2={sc.y(day.vpoc)} stroke="#00ff9d" strokeWidth={1} strokeDasharray="6 4" opacity={0.8} />
        <text x={PAD.l + 4} y={sc.y(day.vpoc) - 5} fill="#00ff9d" fontSize={10} fontFamily={FONT}>
          VPOC {day.vpoc.toFixed(2)}
        </text>

        {/* candles */}
        <Candles bars={bars} sc={sc} />

        {/* touch + reaction pins */}
        {day.touches.map((t, i) => {
          const ti = idxOf(t.t)
          if (ti < 0) return null
          const x = sc.x(ti)
          const show = labeled.has(t.t + t.price)
          const up = t.move > 0
          return (
            <g key={i}>
              <rect x={x - 3} y={sc.y(t.price) - 3} width={6} height={6} fill="#00ff9d" />
              <line x1={x} y1={sc.y(t.price)} x2={sc.x(idxOf(t.rt))} y2={sc.y(t.rprice)} stroke="#00ff9d" strokeWidth={1} strokeDasharray="2 2" opacity={0.5} />
              <rect x={sc.x(idxOf(t.rt)) - 3} y={sc.y(t.rprice) - 3} width={6} height={6} fill="none" stroke="#ffffff" strokeWidth={1} />
              {show && (
                <g>
                  <text x={x + 6} y={sc.y(t.price) - 8} fill="#00ff9d" fontSize={9} fontFamily={FONT}>
                    {`TOUCH ${t.t} ${t.price.toFixed(0)}`}
                  </text>
                  <text x={sc.x(idxOf(t.rt)) + 6} y={sc.y(t.rprice) + (up ? 14 : -6)} fill="#fff" fontSize={9} fontFamily={FONT}>
                    {`REACT ${t.rt} ${up ? '+' : ''}${t.move.toFixed(2)}%`}
                  </text>
                </g>
              )}
            </g>
          )
        })}

        {/* hover crosshair */}
        {hb && (
          <g pointerEvents="none">
            <line x1={sc.x(hover!)} y1={PAD.t} x2={sc.x(hover!)} y2={PAD.t + (VB_H - PAD.t - PAD.b)} stroke="#00ff9d" strokeWidth={1} strokeOpacity={0.3} />
            <text x={Math.min(sc.x(hover!) + 8, VB_W - 130)} y={PAD.t + 14} fill="#00ff9d" fontSize={10} fontFamily={FONT}>
              {`${hb.t}  O${hb.o.toFixed(2)} H${hb.h.toFixed(2)} L${hb.l.toFixed(2)} C${hb.c.toFixed(2)}`}
            </text>
          </g>
        )}
      </svg>

      <div className="border-t border-[#1c2e1c] px-3 py-2 flex flex-wrap gap-4 text-[9px] tracking-[0.15em] text-[#444]">
        <span><span className="inline-block w-[7px] h-[7px] bg-[#00ff9d] mr-1 align-middle" /> TOUCH (all pinned)</span>
        <span><span className="inline-block w-[7px] h-[7px] border border-white mr-1 align-middle" /> REACTION EXTREME</span>
        <span className="ml-auto">{data.source} — 5-min candles</span>
      </div>
    </div>
  )
}
