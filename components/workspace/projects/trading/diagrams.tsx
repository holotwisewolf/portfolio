'use client'

// Hand-authored concept diagrams: inline SVG in the site's design system
// (green = signal/data, gray = structure, red/amber = semantics). Wired into
// doc pages via DocFile's { kind: 'diagram', id } block.

import type { ComponentType } from 'react'

const FONT = 'Orbit, monospace'
const GREEN = '#00ff9d'
const FILL = '#00cc77'
const RED = '#ef4444'
const AMBER = '#eab308'
const GRAY = '#555'
const LGRAY = '#333'

function L({ x, y, children, color = GRAY, anchor = 'start', size = 10 }: { x: number; y: number; children: string; color?: string; anchor?: 'start' | 'middle' | 'end'; size?: number }) {
  return (
    <text x={x} y={y} fill={color} fontSize={size} fontFamily={FONT} textAnchor={anchor} letterSpacing={1.5}>
      {children}
    </text>
  )
}

/* 1. ABSORPTION / ELASTICITY — the core mechanism of the orderflow research */
function Absorption() {
  return (
    <svg viewBox="0 0 800 260" className="w-full h-auto block">
      {/* price path: flat under the wall, then breaks up */}
      <path d="M60 190 L180 190 L230 185 L280 192 L340 186 L400 190 L470 188 L540 120 L620 78 L700 60" fill="none" stroke={FILL} strokeWidth={2} />
      {/* passive liquidity wall */}
      {Array.from({ length: 7 }).map((_, i) => (
        <rect key={i} x={150 + i * 46} y={130} width={30} height={12} fill="#1f3a2a" stroke={GREEN} strokeWidth={1} opacity={1 - i * 0.13} />
      ))}
      <L x={300} y={112} color={GREEN}>PASSIVE LIQUIDITY (ABSORBING)</L>
      {/* delta arrows hammering the wall */}
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <line x1={90 + i * 90} y1={248} x2={165 + i * 60} y2={150} stroke={GREEN} strokeWidth={2} markerEnd="url(#ah)" />
        </g>
      ))}
      <defs>
        <marker id="ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M0 0 L10 5 L0 10 z" fill={GREEN} />
        </marker>
      </defs>
      <L x={90} y={238}>AGGRESSIVE DELTA (BUY VOLUME)</L>
      {/* annotations */}
      <L x={415} y={222} color="#777">price barely moves — LOW ELASTICITY</L>
      <line x1={400} y1={190} x2={470} y2={190} stroke={LGRAY} strokeWidth={1} strokeDasharray="2 2" />
      <line x1={540} y1={120} x2={540} y2={200} stroke={AMBER} strokeWidth={1} strokeDasharray="3 2" />
      <L x={548} y={196} color={AMBER}>wall depletes → CONTINUATION</L>
    </svg>
  )
}

/* 2. CLONED BOX — the IB geometry */
function ClonedBox() {
  const y = { ext100t: 40, ext50t: 92, ibh: 130, ibmid: 160, ibl: 190, ext50b: 228, ext100b: 268 }
  return (
    <svg viewBox="0 0 800 310" className="w-full h-auto block">
      {/* IB box */}
      <rect x={300} y={y.ibh} width={200} height={60} fill="#12241a" stroke={GREEN} strokeWidth={1.5} />
      <L x={510} y={y.ibmid} color={GREEN}>IB (09:30–10:30)</L>
      {/* 50% extensions */}
      <rect x={300} y={y.ext50t} width={200} height={38} fill="none" stroke={GRAY} strokeWidth={1} strokeDasharray="4 3" />
      <rect x={300} y={y.ibl} width={200} height={38} fill="none" stroke={GRAY} strokeWidth={1} strokeDasharray="4 3" />
      {/* 100% extensions */}
      <rect x={300} y={y.ext100t} width={200} height={52} fill="none" stroke={AMBER} strokeWidth={1.5} />
      <rect x={300} y={y.ext50b} width={200} height={40} fill="none" stroke={AMBER} strokeWidth={1.5} />
      {/* level labels */}
      <L x={288} y={y.ext100t + 6} anchor="end">EXT_100_TOP</L>
      <L x={288} y={y.ibh + 4} anchor="end" color={GREEN}>IB_HIGH</L>
      <L x={288} y={y.ibl + 10} anchor="end" color={GREEN}>IB_LOW</L>
      <L x={288} y={y.ext100b - 34} anchor="end">EXT_100_BOTTOM</L>
      {/* height brace */}
      <line x1={540} y1={y.ibh} x2={540} y2={y.ibl} stroke={GRAY} strokeWidth={1} />
      <L x={550} y={y.ibmid}>Height</L>
      {/* strategies */}
      <L x={300} y={y.ext100t - 12} color={AMBER}>MEAN REVERSION FADES HERE</L>
      <L x={300} y={y.ext100b + 22} color={AMBER}>…AND HERE</L>
      <L x={80} y={y.ibmid} color="#777">SUSTAINED AUCTION:</L>
      <L x={80} y={y.ibmid + 16} color="#777">BREAK + RETEST OF IB EDGE</L>
      <line x1={255} y1={y.ibmid} x2={296} y2={y.ibmid} stroke={GRAY} strokeWidth={1} strokeDasharray="2 2" />
    </svg>
  )
}

/* 3. THE 24-CELL GRID — elasticity × acceleration (× volume) */
function Grid24() {
  const acc = ['Q1 FAST DECEL', 'Q2', 'Q3', 'Q4 FAST ACCEL']
  const el = ['LOW E', 'MED E', 'HIGH E']
  const rate = (r: string, c: number) => (r === '0' ? 10.8 : r === '1' ? 9.5 : r === '2' ? 7.8 : c === 0 ? 8.4 : 7.8)
  return (
    <svg viewBox="0 0 800 250" className="w-full h-auto block">
      {acc.map((a, c) => (
        <L key={a} x={90 + c * 170 + 75} y={28} anchor="middle" size={9}>{a}</L>
      ))}
      {el.map((e, r) => (
        <g key={e}>
          <L x={80} y={50 + r * 62 + 34} anchor="end" size={9}>{e}</L>
          {acc.map((_, c) => {
            const best = r === 0 && c === 0
            const v = rate(String(r), c)
            return (
              <g key={c}>
                <rect x={90 + c * 170} y={50 + r * 62} width={150} height={50} fill={best ? '#0a2216' : '#0e0e0e'} stroke={best ? GREEN : LGRAY} strokeWidth={best ? 1.5 : 1} />
                <L x={90 + c * 170 + 75} y={50 + r * 62 + 30} anchor="middle" color={best ? GREEN : '#888'} size={13}>{`${v}%`}</L>
              </g>
            )
          })}
        </g>
      ))}
      <L x={90} y={244} size={9} color="#777">CONTINUATION RATE · EACH CELL ALSO SPLITS BY VOLUME (HIGH/LOW) → 3 × 4 × 2 = 24 CELLS</L>
      <L x={165} y={86} anchor="middle" color={GREEN} size={8}>BEST CELL</L>
    </svg>
  )
}

/* 4. WALK-FORWARD ROLLING WINDOWS */
function WalkForward() {
  const rows = [
    { train: [40, 200], test: [200, 280] },
    { train: [120, 280], test: [280, 360] },
    { train: [200, 360], test: [360, 440] },
  ]
  return (
    <svg viewBox="0 0 800 210" className="w-full h-auto block">
      {rows.map((r, i) => (
        <g key={i} transform={`translate(0 ${i * 52})`}>
          <L x={30} y={30} size={9}>{`WINDOW ${i + 1}`}</L>
          <rect x={90} y={12} width={r.train[1] - r.train[0]} height={26} fill="#12241a" stroke={GRAY} strokeWidth={1} />
          <L x={(r.train[0] + r.train[1]) / 2 + 90 - 40} y={30} size={9} color="#888">TRAIN (PAST)</L>
          <rect x={90 + r.test[0]} y={12} width={r.test[1] - r.test[0]} height={26} fill="#0a2216" stroke={GREEN} strokeWidth={1.5} />
          <L x={90 + r.test[0] + 6} y={30} size={9} color={GREEN}>TEST (FUTURE)</L>
        </g>
      ))}
      {/* roll arrow */}
      <path d="M560 40 C 640 40 640 130 560 130" fill="none" stroke={GRAY} strokeWidth={1} markerEnd="url(#wh)" />
      <defs>
        <marker id="wh" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M0 0 L10 5 L0 10 z" fill={GRAY} />
        </marker>
      </defs>
      <L x={655} y={90} size={9} color="#777">ROLL FORWARD,</L>
      <L x={655} y={106} size={9} color="#777">NEVER SHUFFLE</L>
    </svg>
  )
}

/* 5. LABEL vs FORWARD — the gap */
function LabelGap() {
  const wiggle = (x0: number, y0: number, w: number, amp: number) => {
    let d = `M${x0} ${y0}`
    for (let i = 0; i < 8; i++) {
      d += ` q${w / 16} ${i % 2 === 0 ? -amp : amp} ${w / 8} 0`
    }
    return d
  }
  return (
    <svg viewBox="0 0 800 250" className="w-full h-auto block">
      {/* left: the labeled zone */}
      <rect x={120} y={40} width={150} height={80} fill={AMBER} opacity={0.12} />
      <rect x={120} y={40} width={150} height={80} fill="none" stroke={AMBER} strokeWidth={1} strokeDasharray="4 3" />
      <path d={wiggle(70, 80, 260, 14)} fill="none" stroke={FILL} strokeWidth={1.5} />
      <L x={195} y={30} anchor="middle" color={AMBER} size={9}>LABEL: CONSOLIDATION</L>
      <L x={195} y={140} anchor="middle" size={9} color="#777">accurate description of the past</L>
      {/* arrow forward */}
      <line x1={300} y1={80} x2={380} y2={80} stroke={GRAY} strokeWidth={1} markerEnd="url(#gh)" />
      <defs>
        <marker id="gh" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M0 0 L10 5 L0 10 z" fill={GRAY} />
        </marker>
      </defs>
      <L x={340} y={66} anchor="middle" size={9} color="#777">NEXT 10 BARS</L>
      {/* right: two possible futures */}
      <path d={wiggle(420, 60, 240, 12)} fill="none" stroke={FILL} strokeWidth={1.5} />
      <L x={540} y={30} anchor="middle" size={9} color={FILL}>still chopping — accurate, untradeable</L>
      <path d="M420 200 q30 -4 60 -22 q40 -30 90 -70 q50 -44 90 -60" fill="none" stroke={RED} strokeWidth={1.5} />
      <L x={560} y={216} anchor="middle" size={9} color={RED}>expanded 4× the zone range</L>
      <L x={400} y={240} size={9} color="#777">SAME LABEL, OPPOSITE AFTERMATHS — AGREEMENT WITH THE LABELER IS NOT MARKET EDGE</L>
    </svg>
  )
}

/* 6. NEUTRAL-CANDLE FILTER PIPELINE */
function FilterPipeline() {
  const stages = [
    { x: 40, w: 120, label: 'TICKS', sub: '9.9M/day' },
    { x: 200, w: 120, label: 'NEUTRAL CANDLE', sub: 'quiet bar' },
    { x: 360, w: 120, label: 'BREAKOUT', sub: '≤4 chained bars' },
    { x: 520, w: 120, label: '18 FILTERS', sub: 'all must pass' },
    { x: 680, w: 100, label: 'ENTRY', sub: 'per touch' },
  ]
  return (
    <svg viewBox="0 0 800 150" className="w-full h-auto block">
      {stages.map((s, i) => (
        <g key={i}>
          <rect x={s.x} y={40} width={s.w} height={56} fill={i === 3 ? '#0a2216' : '#0e0e0e'} stroke={i === 3 ? GREEN : LGRAY} strokeWidth={i === 3 ? 1.5 : 1} />
          <L x={s.x + s.w / 2} y={64} anchor="middle" size={10} color={i === 3 ? GREEN : '#ccc'}>{s.label}</L>
          <L x={s.x + s.w / 2} y={82} anchor="middle" size={8} color={GRAY}>{s.sub}</L>
          {i < stages.length - 1 && <line x1={s.x + s.w + 2} y1={68} x2={stages[i + 1].x - 4} y2={68} stroke={GRAY} strokeWidth={1} markerEnd="url(#ph)" />}
        </g>
      ))}
      <defs>
        <marker id="ph" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto">
          <path d="M0 0 L10 5 L0 10 z" fill={GRAY} />
        </marker>
      </defs>
      <L x={580} y={118} anchor="middle" size={8} color={AMBER}>4,775 COMBINATIONS × THIS PIPELINE = 941,882 SIMULATED TRADES</L>
    </svg>
  )
}

/* 7. VPOC TOUCH + REVERSAL */
function VpocTouch() {
  return (
    <svg viewBox="0 0 800 220" className="w-full h-auto block">
      {/* prior day vpoc level */}
      <line x1={60} y1={110} x2={740} y2={110} stroke={GREEN} strokeWidth={1.5} strokeDasharray="7 4" />
      <L x={64} y={100} color={GREEN} size={9}>PRIOR-DAY VPOC (FAIR VALUE)</L>
      {/* approach from above */}
      <path d="M70 40 q60 8 120 20 q60 14 130 28 q40 10 70 20" fill="none" stroke={FILL} strokeWidth={1.5} />
      {/* touch */}
      <rect x={404} y={107} width={6} height={6} fill={GREEN} />
      <L x={410} y={94} color={GREEN} size={9}>TOUCH (within 2 ticks)</L>
      {/* reversal up */}
      <path d="M410 110 q60 -18 130 -34 q60 -14 120 -26" fill="none" stroke={GREEN} strokeWidth={2} />
      <line x1={660} y1={50} x2={690} y2={42} stroke={GREEN} strokeWidth={2} markerEnd="url(#vh)" />
      <defs>
        <marker id="vh" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M0 0 L10 5 L0 10 z" fill={GREEN} />
        </marker>
      </defs>
      <L x={640} y={26} anchor="end" color={GREEN} size={9}>BOUNCE OPPOSITE THE APPROACH</L>
      <L x={400} y={190} anchor="middle" size={9} color="#777">{'16 OUTCOME COMBOS PER TOUCH · TARGETS {10,20,30,50}t × STOPS {5,10,15,20}t · EV NET OF $5 COMMISSION'}</L>
    </svg>
  )
}

export const DIAGRAMS: Record<string, ComponentType> = {
  absorption: Absorption,
  'cloned-box': ClonedBox,
  'grid24': Grid24,
  'walkforward': WalkForward,
  'label-gap': LabelGap,
  'filter-pipeline': FilterPipeline,
  'vpoc-touch': VpocTouch,
}
