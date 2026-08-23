'use client'

// The benchmark: the hand-labeled zones themselves, on real candles. A few
// previews up front, VIEW ALL for the full grid, click any zone to expand it
// into a full chart — so visitors can judge whether they agree with the label.

import { useMemo, useState } from 'react'
import { useJson } from '../../useJson'
import { Candles, scales, type Bar } from '../../candle-utils'

interface Zone {
  date: string
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

const LABELS: Record<number, { name: string; color: string; blurb: string }> = {
  1: { name: 'NEUTRAL', color: '#666666', blurb: 'No edge — wait' },
  2: { name: 'CONSOLIDATION', color: '#eab308', blurb: 'Tight range — avoid fakeouts' },
  3: { name: 'BREAKOUT', color: '#00ff9d', blurb: 'Expansion — the trade' },
}

const FONT = 'Orbit, monospace'

const asBar = (b: [string, number, number, number, number, number, number, number]): Bar => ({
  t: b[0], o: b[1], h: b[2], l: b[3], c: b[4],
})

function ZoneChart({ zone, big }: { zone: Zone; big?: boolean }) {
  const bars = useMemo(() => zone.bars.map(asBar), [zone])
  const w = big ? 900 : 200
  const h = big ? 340 : 90
  const pad = big ? { l: 54, r: 14, t: 18, b: 18 } : { l: 4, r: 4, t: 4, b: 4 }
  const sc = useMemo(() => scales(bars, w, h, pad), [bars, w, h, pad])
  const meta = LABELS[zone.label]
  const x0 = sc.x(zone.zone_from) - sc.step / 2
  const x1 = sc.x(zone.zone_to - 1) + sc.step / 2
  const plotR = w - pad.r

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto block bg-[#0a0a0a]">
      {/* zone shading */}
      <rect x={Math.max(pad.l, x0)} y={pad.t} width={Math.max(2, x1 - x0)} height={h - pad.t - pad.b} fill={meta.color} opacity={0.12} />
      <line x1={Math.max(pad.l, x0)} y1={pad.t} x2={Math.max(pad.l, x0)} y2={h - pad.b} stroke={meta.color} strokeWidth={1} strokeDasharray="3 2" />
      <line x1={Math.min(plotR, x1)} y1={pad.t} x2={Math.min(plotR, x1)} y2={h - pad.b} stroke={meta.color} strokeWidth={1} strokeDasharray="3 2" />
      <Candles bars={bars} sc={sc} />
      {big && (
        <>
          {[0, 1, 2, 3].map((i) => {
            const p = sc.lo + ((sc.hi - sc.lo) * i) / 3
            return (
              <text key={i} x={pad.l - 6} y={sc.y(p) + 3} fill="#666" fontSize={10} fontFamily={FONT} textAnchor="end">
                {p.toFixed(0)}
              </text>
            )
          })}
          <text x={pad.l + 6} y={pad.t + 12} fill={meta.color} fontSize={10} fontFamily={FONT} letterSpacing={2}>
            {`${meta.name} — ${zone.start.split(' ')[1]} to ${zone.end.split(' ')[1]} ET`}
          </text>
          <text x={w - pad.r - 6} y={pad.t + 12} fill="#444" fontSize={9} fontFamily={FONT} textAnchor="end">
            {zone.start.split(' ')[0]}
          </text>
        </>
      )}
    </svg>
  )
}

export default function ZoneLabelGallery() {
  const data = useJson<Payload>('/data/zone-labels.json')
  if (!data) {
    return (
      <div className="h-[300px] flex items-center justify-center text-[#444] text-[11px] tracking-[0.3em]">
        LOADING…
      </div>
    )
  }
  return <Gallery zones={data.zones} />
}

function Gallery({ zones }: { zones: Zone[] }) {
  const [showAll, setShowAll] = useState(false)
  const [filter, setFilter] = useState<number | null>(null)
  const [expanded, setExpanded] = useState<number | null>(null)

  const visible = zones.filter((z) => filter === null || z.label === filter)
  const previews = [3, 2, 1].map((label) => zones.find((z) => z.label === label)).filter(Boolean) as Zone[]
  const counts = { 1: 0, 2: 0, 3: 0 }
  zones.forEach((z) => { counts[z.label as 1 | 2 | 3]++ })

  return (
    <div className="bg-[#0a0a0a] font-orbit">
      <div className="flex flex-wrap gap-[1px] bg-[#1c2e1c] border-b border-[#1c2e1c] text-[9px] tracking-[0.2em]">
        <span className="bg-[#0a0a0a] px-3 py-2 text-[#444] flex items-center">THE BENCHMARK — {zones.length} HAND-LABELED ZONES ON REAL NQ CANDLES</span>
        {([1, 2, 3] as const).map((l) => (
          <button
            key={l}
            onClick={() => setFilter(filter === l ? null : l)}
            className={`px-3 py-2 transition-colors ${filter === l ? 'bg-[#0a1a0a]' : 'bg-[#0a0a0a] hover:bg-[#0f1a0f]'}`}
            style={{ color: LABELS[l].color }}
          >
            {LABELS[l].name} — {counts[l]}
          </button>
        ))}
        <button
          onClick={() => { setShowAll(!showAll); setExpanded(null) }}
          className={`ml-auto px-3 py-2 transition-colors ${showAll ? 'text-[#00ff9d] bg-[#0a1a0a]' : 'text-gray-500 hover:text-white bg-[#0a0a0a]'}`}
        >
          {showAll ? '[x] COLLAPSE' : `> VIEW ALL (${visible.length})`}
        </button>
      </div>

      {/* previews */}
      {!showAll && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-[1px] bg-[#1c2e1c] border-b border-[#1c2e1c]">
          {previews.map((z, i) => (
            <button key={i} onClick={() => { setShowAll(true); setExpanded(zones.indexOf(z)) }} className="bg-[#0a0a0a] p-3 text-left hover:bg-[#0f1a0f] transition-colors">
              <div className="flex justify-between items-baseline mb-2">
                <span className="text-[9px] tracking-[0.2em]" style={{ color: LABELS[z.label].color }}>
                  {LABELS[z.label].name}
                </span>
                <span className="text-[9px] text-[#444]">{z.start.split(' ')[0]}</span>
              </div>
              <ZoneChart zone={z} />
              <div className="text-[9px] text-[#444] mt-2">{LABELS[z.label].blurb}</div>
            </button>
          ))}
        </div>
      )}

      {/* full grid */}
      {showAll && (
        <div className="max-h-[520px] overflow-y-auto grid grid-cols-2 md:grid-cols-4 gap-[1px] bg-[#1c2e1c]">
          {visible.map((z) => {
            const gi = zones.indexOf(z)
            return (
              <button
                key={gi}
                onClick={() => setExpanded(expanded === gi ? null : gi)}
                className={`bg-[#0a0a0a] p-2 text-left transition-colors ${expanded === gi ? 'ring-1 ring-[#00ff9d]' : 'hover:bg-[#0f1a0f]'}`}
              >
                <div className="flex justify-between items-baseline mb-1">
                  <span className="text-[9px] tracking-[0.15em]" style={{ color: LABELS[z.label].color }}>
                    {LABELS[z.label].name}
                  </span>
                  <span className="text-[8px] text-[#444]">{z.start.split(' ')[0].slice(5)} {z.start.split(' ')[1]}</span>
                </div>
                <ZoneChart zone={z} />
              </button>
            )
          })}
        </div>
      )}

      {/* expanded zone */}
      {showAll && expanded !== null && zones[expanded] && (
        <div className="border-t border-[#1c2e1c] p-3">
          <div className="flex flex-wrap gap-4 items-baseline mb-2">
            <span className="text-[10px] tracking-[0.25em]" style={{ color: LABELS[zones[expanded].label].color }}>
              {LABELS[zones[expanded].label].name}
            </span>
            <span className="text-[9px] text-[#444]">
              {zones[expanded].start} → {zones[expanded].end} ET
            </span>
            <span className="text-[9px] text-[#444]">{LABELS[zones[expanded].label].blurb}</span>
            <span className="ml-auto text-[9px] text-[#444]">SHADED REGION = THE LABELED ZONE — DO YOU AGREE?</span>
          </div>
          <div className="border border-[#1c2e1c]">
            <ZoneChart zone={zones[expanded]} big />
          </div>
        </div>
      )}

      <div className="border-t border-[#1c2e1c] px-3 py-2 flex flex-wrap gap-4 text-[9px] tracking-[0.15em] text-[#444]">
        {([1, 2, 3] as const).map((l) => (
          <span key={l}>
            <span className="inline-block w-[7px] h-[7px] mr-1 align-middle" style={{ background: LABELS[l].color, opacity: 0.5 }} />
            {LABELS[l].name}
          </span>
        ))}
        <span className="ml-auto">my_zone_labels.csv on real Databento NQ ticks — 5-min candles</span>
      </div>
    </div>
  )
}
