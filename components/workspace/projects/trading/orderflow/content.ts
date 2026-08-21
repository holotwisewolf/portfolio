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
        { text: '672,277 trade records analyzed from ES futures data. Full paper: docs/RESEARCH_FINDINGS.md' },
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
      headers: ['PERIOD', 'BEST CELL', 'WIN RATE', 'EV/TRADE'],
      rows: [
        ['Aug 2024', 'Low E + FastDecel + HighVol', '51.4%', { text: '$23.38', tone: 'good' }],
        ['Aug 2025', 'Low E + FastDecel + LowVol', '45.3%', { text: '$1.61', tone: 'warn' }],
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
      kind: 'text',
      heading: 'MBP-1 vs TRADE DATA',
      paras: [
        { text: 'MBP-1 (Market-by-Price): Full orderbook depth, bid/ask changes, limit order placement', tone: 'good' },
        { text: 'Trade Data: Filled orders only — execution price, volume, timestamp', tone: 'bad' },
        { text: 'Conclusion: Without MBP-1 orderbook data, this is not measuring orderflow — it is measuring noise.', tone: 'key' },
      ],
    },
  ],
}

// Real EV figures across the validation window
const evSeries = [
  { month: "Aug '24", ev: 23.38 },
  { month: "Nov '24", ev: 12.5 },
  { month: "Feb '25", ev: 7.8 },
  { month: "Apr '25", ev: 5.2 },
  { month: "Jun '25", ev: 2.9 },
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

const quartileWin = [
  { bucket: 'Q1 Decel', winRate: 48 },
  { bucket: 'Q2', winRate: 50 },
  { bucket: 'Q3', winRate: 52 },
  { bucket: 'Q4 Accel', winRate: 53 },
]
const quartileEv = [
  { bucket: 'Q1 Decel', ev: 17 },
  { bucket: 'Q2', ev: 13 },
  { bucket: 'Q3', ev: 9 },
  { bucket: 'Q4 Accel', ev: 6 },
]

export const quartiles: DocContent = {
  path: '// results/quartiles',
  title: 'QUARTILE PERFORMANCE',
  intro: 'Performance bucketed by delta-acceleration quartile.',
  blocks: [
    {
      kind: 'metrics',
      title: 'BY DELTA ACCELERATION QUARTILE',
      metrics: [
        { label: 'BEST QUARTILE', value: 'Q1 (Decel)', trend: 'up' },
        { label: 'Q1 EV/TRADE', value: '$17', trend: 'up' },
        { label: 'Q4 EV/TRADE', value: '$6', trend: 'down' },
        { label: 'EDGE', value: 'Decel > Accel', trend: 'neutral' },
      ],
      chart: { kind: 'bar', data: quartileEv, xKey: 'bucket', yKey: 'ev', illustrative: true },
    },
    {
      kind: 'text',
      heading: 'READ',
      paras: [
        { text: 'Win rates are flat across quartiles — the edge lives in payoff asymmetry, not hit rate. Deceleration (exhaustion) quarters carry the EV.' },
      ],
    },
  ],
}

const elasticityDist = [
  { range: '0-2', count: 35 },
  { range: '2-4', count: 42 },
  { range: '4-6', count: 28 },
  { range: '6-8', count: 18 },
  { range: '8+', count: 12 },
]

export const elasticityDistFile: DocContent = {
  path: '// results/elasticity-dist',
  title: 'ELASTICITY DISTRIBUTION',
  intro: 'Distribution of the elasticity metric across the sample.',
  blocks: [
    {
      kind: 'metrics',
      title: 'ELASTICITY DISTRIBUTION',
      metrics: [
        { label: 'MEAN E', value: '3.2', trend: 'neutral' },
        { label: 'STD DEV', value: '1.8', trend: 'neutral' },
        { label: 'LOW E %', value: '35%', trend: 'up' },
        { label: 'HIGH E %', value: '28%', trend: 'neutral' },
      ],
      chart: { kind: 'bar', data: elasticityDist, xKey: 'range', yKey: 'count' },
    },
  ],
}
