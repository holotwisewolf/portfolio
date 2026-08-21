'use client'

// VPOC day explorer on REAL Databento NQ tick data (March 2025). Shows one trading
// day at a time: price path, the session VPOC level, pinned touch moments with the
// reaction extreme, and the volume-at-price profile that produced the VPOC.

import { useMemo, useState } from 'react'
import data from './demo-data.json'

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
  points: [string, number][]
  profile: [number, number][]
  touches: Touch[]
}

const days = (data as unknown as { instrument: string; source: string; days: Day[] }).days

const VB_W = 900
const VB_H = 400
const PAD = { l: 58, r: 92, t: 26, b: 26 }
const PLOT_W = VB_W - PAD.l - PAD.r
const PLOT_H = VB_H - PAD.t - PAD.b
const FONT = 'Orbit, monospace'
const GRID = '#1c2e1c'

export default function VpocDayExplorer() {
  const [dayIdx, setDayIdx] = useState(0)
  const [hover, setHover] = useState<number | null>(null)
  const day = days[dayIdx]

  const { xs, ys, maxVol, labeled } = useMemo(() => {
    const pad = (day.hi - day.lo) * 0.06
    const lo = day.lo - pad
    const hi = day.hi + pad
    const x = (i: number) => PAD.l + (i / Math.max(1, day.points.length - 1)) * PLOT_W
    const y = (p: number) => PAD.t + (1 - (p - lo) / (hi - lo)) * PLOT_H
    const mv = Math.max(...day.profile.map(([, v]) => v), 1)
    // label only the 3 strongest reactions — every touch gets a pin, not every pin a label
    const labeled = new Set(
      [...day.touches].sort((a, b) => Math.abs(b.move) - Math.abs(a.move)).slice(0, 3).map((t) => t.t + t.price)
    )
    return { xs: x, ys: y, maxVol: mv, labeled }
  }, [day])

  const idxOf = (t: string) => day.points.findIndex((p) => p[0] === t)
  const path = day.points.map(([, p], i) => `${i === 0 ? 'M' : 'L'}${xs(i).toFixed(1)},${ys(p).toFixed(1)}`).join(' ')
  const best = Math.max(...day.touches.map((t) => Math.abs(t.move)), 0)

  const onMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const relX = ((e.clientX - rect.left) / rect.width) * VB_W
    const i = Math.round(((relX - PAD.l) / PLOT_W) * (day.points.length - 1))
    setHover(Math.max(0, Math.min(day.points.length - 1, i)))
  }

  const hp = hover !== null ? day.points[hover] : null

  return (
    <div className="bg-[#0a0a0a] font-orbit">
      {/* day selector */}
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
              <line x1={PAD.l} y1={ys(p)} x2={PAD.l + PLOT_W} y2={ys(p)} stroke={GRID} strokeWidth={1} strokeDasharray="3 3" />
              <text x={PAD.l - 8} y={ys(p) + 3} fill="#666" fontSize={10} fontFamily={FONT} textAnchor="end">
                {p.toFixed(0)}
              </text>
            </g>
          )
        })}

        {/* volume-at-price profile — right edge; the VPOC bin highlighted */}
        {day.profile.map(([p, v], i) => (
          <rect
            key={i}
            x={PAD.l + PLOT_W + 8}
            y={ys(p) - 2}
            width={Math.max(1, (v / maxVol) * 68)}
            height={4}
            fill={Math.abs(p - day.vpoc) < (day.hi - day.lo) / 60 ? '#00ff9d' : '#00cc77'}
            opacity={Math.abs(p - day.vpoc) < (day.hi - day.lo) / 60 ? 0.6 : 0.2}
          />
        ))}

        {/* VPOC level */}
        <line x1={PAD.l} y1={ys(day.vpoc)} x2={PAD.l + PLOT_W} y2={ys(day.vpoc)} stroke="#00ff9d" strokeWidth={1} strokeDasharray="6 4" opacity={0.8} />
        <text x={PAD.l + 4} y={ys(day.vpoc) - 5} fill="#00ff9d" fontSize={10} fontFamily={FONT}>
          VPOC {day.vpoc.toFixed(2)}
        </text>

        {/* price path */}
        <path d={path} fill="none" stroke="#00cc77" strokeWidth={1.5} />

        {/* touch + reaction pins */}
        {day.touches.map((t, i) => {
          const ti = idxOf(t.t)
          if (ti < 0) return null
          const x = xs(ti)
          const show = labeled.has(t.t + t.price)
          const up = t.move > 0
          return (
            <g key={i}>
              <rect x={x - 3} y={ys(t.price) - 3} width={6} height={6} fill="#00ff9d" />
              <line x1={x} y1={ys(t.price)} x2={x} y2={ys(t.rprice)} stroke="#00ff9d" strokeWidth={1} strokeDasharray="2 2" opacity={0.5} />
              <rect x={xs(idxOf(t.rt)) - 3} y={ys(t.rprice) - 3} width={6} height={6} fill="none" stroke="#ffffff" strokeWidth={1} />
              {show && (
                <g>
                  <text x={x + 6} y={ys(t.price) - 8} fill="#00ff9d" fontSize={9} fontFamily={FONT}>
                    {`TOUCH ${t.t} ${t.price.toFixed(0)}`}
                  </text>
                  <text x={xs(idxOf(t.rt)) + 6} y={ys(t.rprice) + (up ? 14 : -6)} fill="#fff" fontSize={9} fontFamily={FONT}>
                    {`REACT ${t.rt} ${up ? '+' : ''}${t.move.toFixed(2)}%`}
                  </text>
                </g>
              )}
            </g>
          )
        })}

        {/* hover crosshair */}
        {hp && (
          <g pointerEvents="none">
            <line x1={xs(hover!)} y1={PAD.t} x2={xs(hover!)} y2={PAD.t + PLOT_H} stroke="#00ff9d" strokeWidth={1} strokeOpacity={0.3} />
            <rect x={xs(hover!) - 3} y={ys(hp[1]) - 3} width={6} height={6} fill="#00ff9d" />
            <text x={Math.min(xs(hover!) + 8, VB_W - 120)} y={PAD.t + 14} fill="#00ff9d" fontSize={10} fontFamily={FONT}>
              {`${hp[0]}  ${hp[1].toFixed(2)}`}
            </text>
          </g>
        )}
      </svg>

      <div className="border-t border-[#1c2e1c] px-3 py-2 flex flex-wrap gap-4 text-[9px] tracking-[0.15em] text-[#444]">
        <span><span className="inline-block w-[7px] h-[7px] bg-[#00ff9d] mr-1 align-middle" /> TOUCH (all pinned)</span>
        <span><span className="inline-block w-[7px] h-[7px] border border-white mr-1 align-middle" /> REACTION EXTREME</span>
        <span className="ml-auto">{(data as any).source} — 2-min bars</span>
      </div>
    </div>
  )
}
