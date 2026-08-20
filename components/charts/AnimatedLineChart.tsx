'use client'

// Manim-style SVG line/area chart: axes draw on, grid + labels fade in staggered,
// the curve draws itself left→right, area fills under it, endpoint pulses.
// Animation is pure CSS (pathLength={1} normalizes the dash math — no JS measuring).

import { useMemo, useState } from 'react'

interface AnimatedLineChartProps {
  data: Record<string, any>[]
  xKey: string
  yKey: string
  color?: string
  yFormat?: (v: number) => string
}

const VB_W = 800
const VB_H = 300
const PAD = { l: 54, r: 20, t: 20, b: 30 }
const PLOT_W = VB_W - PAD.l - PAD.r
const PLOT_H = VB_H - PAD.t - PAD.b
const FONT = 'Orbit, monospace'
const GRID = '#1c2e1c'
const AXIS = '#666'

export default function AnimatedLineChart({
  data,
  xKey,
  yKey,
  color = '#00cc77',
  yFormat = (v) => `$${(v / 1000).toFixed(1)}k`,
}: AnimatedLineChartProps) {
  const [hover, setHover] = useState<number | null>(null)

  const { points, yTicks, xTicks } = useMemo(() => {
    const values = data.map((d) => Number(d[yKey]))
    const min = Math.min(...values)
    const max = Math.max(...values)
    const pad = (max - min || 1) * 0.08
    const lo = min - pad
    const hi = max + pad

    const px = (i: number) => PAD.l + (i / Math.max(1, data.length - 1)) * PLOT_W
    const py = (v: number) => PAD.t + (1 - (v - lo) / (hi - lo)) * PLOT_H

    const pts = data.map((d, i) => ({ x: px(i), y: py(Number(d[yKey])), raw: d }))

    const ticks = [0, 1, 2, 3, 4].map((i) => {
      const v = lo + (i / 4) * (hi - lo)
      return { v, y: py(v) }
    })

    const step = Math.max(1, Math.round(data.length / 6))
    const xt = data
      .map((d, i) => ({ d, i }))
      .filter(({ i }) => i % step === 0 || i === data.length - 1)
      .map(({ d, i }) => ({ label: String(d[xKey]), x: px(i) }))

    return { points: pts, yTicks: ticks, xTicks: xt }
  }, [data, xKey, yKey])

  if (data.length < 2) return null

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')
  const areaPath = `${linePath} L${points[points.length - 1].x.toFixed(1)},${PAD.t + PLOT_H} L${points[0].x.toFixed(1)},${PAD.t + PLOT_H} Z`
  const last = points[points.length - 1]
  const hovered = hover !== null ? points[hover] : null

  const onMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const relX = ((e.clientX - rect.left) / rect.width) * VB_W
    const t = (relX - PAD.l) / PLOT_W
    const idx = Math.round(t * (data.length - 1))
    setHover(Math.max(0, Math.min(data.length - 1, idx)))
  }

  return (
    <svg
      viewBox={`0 0 ${VB_W} ${VB_H}`}
      className="w-full h-auto bg-[#0a0a0a] block"
      onMouseMove={onMove}
      onMouseLeave={() => setHover(null)}
    >
      {/* axes — draw on */}
      <line
        x1={PAD.l} y1={PAD.t} x2={PAD.l} y2={PAD.t + PLOT_H}
        stroke={GRID} strokeWidth={1} pathLength={1} strokeDasharray={1}
        className="zc-anim" style={{ animation: 'zc-draw 300ms linear 0ms both' }}
      />
      <line
        x1={PAD.l} y1={PAD.t + PLOT_H} x2={PAD.l + PLOT_W} y2={PAD.t + PLOT_H}
        stroke={GRID} strokeWidth={1} pathLength={1} strokeDasharray={1}
        className="zc-anim" style={{ animation: 'zc-draw 300ms linear 100ms both' }}
      />

      {/* grid + y labels — staggered fade */}
      {yTicks.map((t, i) => (
        <g
          key={`y${i}`}
          className="zc-anim"
          style={{ animation: `zc-fade 250ms ease ${250 + i * 40}ms both` }}
        >
          <line x1={PAD.l} y1={t.y} x2={PAD.l + PLOT_W} y2={t.y} stroke={GRID} strokeWidth={1} strokeDasharray="3 3" />
          <text x={PAD.l - 8} y={t.y + 3} fill={AXIS} fontSize={10} fontFamily={FONT} textAnchor="end">
            {yFormat(t.v)}
          </text>
        </g>
      ))}

      {/* x labels */}
      {xTicks.map((t, i) => (
        <text
          key={`x${i}`}
          x={t.x} y={VB_H - 8} fill={AXIS} fontSize={10} fontFamily={FONT} textAnchor="middle"
          className="zc-anim" style={{ animation: `zc-fade 250ms ease ${400 + i * 40}ms both` }}
        >
          {t.label}
        </text>
      ))}

      {/* area fill under curve */}
      <path
        d={areaPath}
        fill={color}
        fillOpacity={0.15}
        className="zc-anim"
        style={{ animation: 'zc-fade 600ms ease 1400ms both' }}
      />

      {/* the curve — draws itself */}
      <path
        d={linePath}
        fill="none"
        stroke={color}
        strokeWidth={2}
        pathLength={1}
        strokeDasharray={1}
        className="zc-anim"
        style={{ animation: 'zc-draw 1800ms linear 500ms both' }}
      />

      {/* endpoint beacon */}
      <g className="zc-anim" style={{ animation: 'zc-fade 300ms ease 2200ms both' }}>
        <rect x={last.x - 3} y={last.y - 3} width={6} height={6} fill="#00ff9d" />
        <text
          x={Math.min(last.x, VB_W - PAD.r - 8)} y={last.y - 10}
          fill="#00ff9d" fontSize={11} fontFamily={FONT} textAnchor="end"
        >
          {yFormat(Number(last.raw[yKey]))}
        </text>
      </g>

      {/* hover crosshair */}
      {hovered && (
        <g pointerEvents="none">
          <line x1={hovered.x} y1={PAD.t} x2={hovered.x} y2={PAD.t + PLOT_H} stroke="#00ff9d" strokeWidth={1} strokeOpacity={0.3} />
          <rect x={hovered.x - 3} y={hovered.y - 3} width={6} height={6} fill="#00ff9d" />
          <text
            x={hovered.x > VB_W - 140 ? hovered.x - 10 : hovered.x + 10}
            y={hovered.y - 10}
            fill="#00ff9d" fontSize={11} fontFamily={FONT}
            textAnchor={hovered.x > VB_W - 140 ? 'end' : 'start'}
          >
            {`D${hovered.raw[xKey]} ${yFormat(Number(hovered.raw[yKey]))}`}
          </text>
        </g>
      )}
    </svg>
  )
}
