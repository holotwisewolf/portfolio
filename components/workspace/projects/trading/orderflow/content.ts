// orderflow project content — migrated from components/windows/ProjectOrderflow.tsx.
// Real figures from the research are verbatim; procedural charts carry illustrative: true.

import type { DocContent } from '../../../DocFile'

export const readme: DocContent = {
  path: '// overview/README.md',
  title: 'ORDERFLOW RESEARCH',
  intro: 'Delta acceleration and elasticity as predictors of short-term price movement.',
  blocks: [
    {
      kind: 'text',
      paras: [
        { text: 'Research into whether orderflow dynamics (delta acceleration, elasticity) predict short-term price movements in NQ futures.' },
        { text: 'Key Finding: Pattern exists but not robust across time. August 2024: $23.38/trade EV. August 2025: $1.61/trade EV.', tone: 'warn' },
      ],
    },
    {
      kind: 'stats',
      items: [
        { label: 'DATA SOURCE', value: 'Databento CME Globex MDP 3.0' },
        { label: 'INSTRUMENT', value: 'NQ (Nasdaq 100 E-mini)' },
        { label: 'SAMPLE SIZE', value: '247,883 observations' },
      ],
    },
    {
      kind: 'text',
      heading: 'RESEARCH SUMMARY',
      paras: [
        { text: '672,277 trade records analyzed from ES futures data (Dec 18 2024, main contract isolated from 7 instruments, core hours 9:45–15:45 ET, outlier prices removed). Full paper: docs/archive/orderflow_thesis.md' },
        { text: 'Conclusion: Low elasticity predicts better continuation than high elasticity — opposite of initial hypothesis. When aggressive flow meets resistance (price does not move), the resistance often breaks down and price continues.', tone: 'warn' },
      ],
    },
  ],
}

export const findings: DocContent = {
  path: '// overview/FINDINGS.md',
  title: 'FINDINGS',
  intro: 'Cross-validation across periods: what survived, what did not.',
  blocks: [
    {
      kind: 'table',
      heading: 'CROSS-VALIDATION RESULTS',
      headers: ['PERIOD', 'BEST SETUP', 'WIN RATE', 'EV/TRADE', 'MARKET CONDITIONS'],
      rows: [
        ['Aug 2024', '30t target / 20t stop', '51.4%', { text: '$23.38', tone: 'good' }, 'Avg range 18,697 — downtrend'],
        ['Aug 2025', '15t target / 10t stop', '45.3%', { text: '$1.61', tone: 'warn' }, 'Avg range 22,752 — downtrend'],
      ],
    },
    {
      kind: 'text',
      paras: [
        { text: 'The best-performing cell (Low E + FastDecel) is the same in both periods, which suggests the pattern captures real microstructure dynamics. The dramatic difference in profitability ($23.38 vs $1.61) indicates the optimal parameters are time-varying and the strategy as tested is not immediately tradeable without further refinement.', tone: 'key' },
      ],
    },
    {
      kind: 'bullets',
      heading: 'WHAT IS CONSISTENT',
      items: [
        { text: 'Low E + FastDecel is best-performing cell in both periods', mark: 'check' },
        { text: 'Pattern reliably identifies relative outperformers', mark: 'check' },
        { text: 'Underlying microstructure dynamics are captured', mark: 'check' },
      ],
    },
    {
      kind: 'bullets',
      heading: 'WHAT IS NOT CONSISTENT',
      items: [
        { text: 'Absolute profitability', mark: 'cross' },
        { text: 'Optimal target/stop parameters', mark: 'cross' },
        { text: "Volume's incremental value", mark: 'cross' },
      ],
    },
    {
      kind: 'table',
      heading: 'CONTINUATION BY THRESHOLD (LOW vs HIGH ELASTICITY)',
      headers: ['CONTINUATION THRESHOLD', 'HIGH ELAST', 'LOW ELAST', 'SPREAD'],
      rows: [
        ['1 tick', '48.6%', '81.6%', { text: '+33.0% for Low', tone: 'good' }],
        ['3 ticks', '27.3%', '55.1%', { text: '+27.8% for Low', tone: 'good' }],
        ['5 ticks', '16.4%', '38.4%', { text: '+22.0% for Low', tone: 'good' }],
        ['10 ticks', '5.7%', '11.8%', '+6.1% for Low'],
      ],
    },
    {
      kind: 'table',
      heading: 'CONTINUATION BY HORIZON',
      headers: ['HORIZON', 'HIGH ELAST', 'LOW ELAST', 'SPREAD'],
      rows: [
        ['30s', '29.9%', '56.9%', { text: '+27.0%', tone: 'good' }],
        ['60s', '38.4%', '55.3%', '+16.9%'],
        ['120s', '41.3%', '60.4%', '+19.2%'],
        ['300s', '41.5%', '67.9%', { text: '+26.4%', tone: 'good' }],
      ],
    },
    {
      kind: 'table',
      heading: 'ELASTICITY × ACCELERATION MATRIX (CONTINUATION RATE)',
      headers: ['', 'ACCELERATING', 'DECELERATING'],
      rows: [
        ['High Elasticity', '8.4%', '7.8%'],
        ['Low Elasticity', '9.5%', { text: '10.8% — best cell', tone: 'good' }],
      ],
    },
    {
      kind: 'text',
      paras: [
        { text: 'Source: docs/archive/RESEARCH_FINDINGS.md + orderflow_thesis.md — 672,277 ES trade records, Dec 18 2024, core hours 9:45–15:45 ET.', tone: 'default' },
      ],
    },
  ],
}

export const methodology: DocContent = {
  path: '// method/METHODOLOGY.md',
  title: 'METHODOLOGY',
  intro: 'Two derived metrics, bucketed by quartile, cross-validated across a year.',
  blocks: [
    {
      kind: 'formula',
      heading: 'ELASTICITY',
      formulas: ['E = R / |Δ|   (Price Range / Absolute Delta)'],
      notes: [
        { text: 'Low Elasticity: Large delta with small price movement → strong absorption by liquidity providers', tone: 'good' },
        { text: 'High Elasticity: Small delta with large price movement → thin order book, high impact', tone: 'bad' },
      ],
    },
    {
      kind: 'formula',
      heading: 'DELTA ACCELERATION',
      formulas: ['A = (Δ_recent − Δ_prior) / max(|Δ_prior|, ε)'],
      notes: [
        { text: 'Fast Deceleration (Q1): Aggressive side losing momentum, potential exhaustion' },
        { text: 'Fast Acceleration (Q4): Momentum building, continuation likely' },
      ],
    },
    {
      kind: 'text',
      heading: 'BEST CONFIGURATION',
      paras: [
        { text: 'Low Elasticity + Fast Deceleration + High Volume', tone: 'good' },
        { text: 'August 2024: 51.4% win rate, $23.38/trade EV' },
        { text: 'August 2025: 45.3% win rate, $1.61/trade EV' },
        { text: 'Pattern consistent, profitability not robust.', tone: 'warn' },
      ],
    },
  ],
}

export const dataNotes: DocContent = {
  path: '// method/DATA_NOTES.md',
  title: 'DATA NOTES',
  intro: 'The data limitation that explains the results.',
  blocks: [
    {
      kind: 'text',
      heading: 'CRITICAL DATA LIMITATION',
      paras: [
        { text: 'TradingView tick-by-tick data shows FILLED orders only, not the full orderbook.', tone: 'key' },
        { text: 'This is why orderflow strategies showed promise but failed in production — the data did not contain the signal we thought it did.', tone: 'warn' },
      ],
    },
    {
      kind: 'bullets',
      heading: 'WHY THIS MATTERS',
      items: [
        { text: 'True orderflow (Bookmap-style) shows bid/ask depth changes BEFORE fills', mark: 'none' },
        { text: 'TradingView only shows you what already happened', mark: 'none' },
        { text: 'By the time you see a "large buyer" in trade data, the institutional order is already filled', mark: 'none' },
        { text: "You're chasing shadows, not leading the market", mark: 'none' },
      ],
    },
    {
      kind: 'table',
      heading: 'MBP-1 vs TRADE DATA',
      headers: ['FEED', 'CONTAINS', 'VERDICT'],
      rows: [
        ['MBP-1 (Market-by-Price)', 'Full orderbook depth, bid/ask changes, limit order placement', { text: 'What orderflow needs', tone: 'good' }],
        ['Trade Data', 'Filled orders only — execution price, volume, timestamp', { text: 'Measures noise', tone: 'bad' }],
      ],
    },
    {
      kind: 'text',
      paras: [
        { text: 'Conclusion: Without MBP-1 orderbook data, this is not measuring orderflow — it is measuring noise.', tone: 'key' },
      ],
    },
  ],
}

// Real EV figures across the validation window (the four measured points)
const evSeries = [
  { month: "Aug '24", ev: 23.38 },
  { month: "Dec '24", ev: 12.5 },
  { month: "Apr '25", ev: 5.2 },
  { month: "Aug '25", ev: 1.61 },
]

export const evDecay: DocContent = {
  path: '// results/ev-decay',
  title: 'EV DECAY',
  intro: 'Expected value per trade across the validation window — the edge eroded.',
  blocks: [
    {
      kind: 'metrics',
      title: 'EXPECTED VALUE DECAY',
      metrics: [
        { label: 'AUG 2024', value: '$23.38', trend: 'up' },
        { label: 'DEC 2024', value: '$12.50', trend: 'up' },
        { label: 'APR 2025', value: '$5.20', trend: 'down' },
        { label: 'AUG 2025', value: '$1.61', trend: 'down' },
      ],
      chart: { kind: 'line', data: evSeries, xKey: 'month', yKey: 'ev', area: true },
    },
    {
      kind: 'text',
      paras: [
        { text: 'Breakeven sits near $5/trade after costs. The configuration cleared it comfortably in 2024 and fell through it by mid-2025.', tone: 'warn' },
      ],
    },
  ],
}

// Quartile performance file removed — those win-rate/EV values were procedural
// (formula-derived in the legacy window), not measured results. The measured
// cross-period figures live in FINDINGS.md and results/ev-decay.

// Real elasticity distribution from elasticity_analysis.csv (43,180 high-delta events,
// ES Dec 18 2024). Buckets = % of events.
const elasticityHist = [
  { range: '≤ -0.09', pct: 1.2 },
  { range: '-0.09..-0.04', pct: 6.0 },
  { range: '-0.04..0', pct: 51.1 },
  { range: '0..0.04', pct: 37.3 },
  { range: '0.04..0.09', pct: 3.7 },
  { range: '> 0.09', pct: 0.8 },
]

const continuationSplit = [
  { bucket: 'High E', rate: 8.2 },
  { bucket: 'All events', rate: 9.1 },
  { bucket: 'Low E', rate: 10.0 },
]

export const elasticityDistFile: DocContent = {
  path: '// results/elasticity-dist',
  title: 'ELASTICITY DISTRIBUTION',
  intro: '43,180 real high-delta events — where the elasticity metric actually lives.',
  blocks: [
    {
      kind: 'metrics',
      title: 'ELASTICITY DISTRIBUTION (% OF EVENTS)',
      metrics: [
        { label: 'EVENTS', value: '43,180', trend: 'neutral' },
        { label: 'MEAN E', value: '-0.0051', trend: 'neutral' },
        { label: 'STD DEV', value: '0.0297', trend: 'neutral' },
        { label: 'P10 / P90', value: '-0.037 / 0.024', trend: 'neutral' },
      ],
      chart: { kind: 'bar', data: elasticityHist, xKey: 'range', yKey: 'pct' },
    },
    {
      kind: 'metrics',
      title: 'CONTINUATION RATE BY ELASTICITY (10s HORIZON)',
      metrics: [
        { label: 'LOW E (≤ MEDIAN)', value: '10.0%', trend: 'up' },
        { label: 'HIGH E (> MEDIAN)', value: '8.2%', trend: 'down' },
        { label: 'OVERALL', value: '9.1%', trend: 'neutral' },
        { label: 'SPREAD', value: '+1.8%', trend: 'up' },
      ],
      chart: { kind: 'bar', data: continuationSplit, xKey: 'bucket', yKey: 'rate' },
    },
    {
      kind: 'text',
      paras: [
        { text: 'The distribution is tightly peaked around zero: in most high-delta events, price barely moves per unit of aggressive flow. The tail on the negative side is the absorption signature — large delta, no price movement — and that tail is where continuation concentrates.', tone: 'key' },
        { text: 'Source: elasticity_analysis.csv — 43,180 events, ES Dec 18 2024, core hours.', tone: 'default' },
      ],
    },
  ],
}
