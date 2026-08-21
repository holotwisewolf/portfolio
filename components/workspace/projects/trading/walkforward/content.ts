// walkforward project content — migrated from components/windows/ProjectWalkForward.tsx.

import type { DocContent } from '../../../DocFile'

export const readme: DocContent = {
  path: '// overview/README.md',
  title: 'WALK-FORWARD ANALYTICS',
  intro: 'A robust backtesting framework that prevents overfitting by simulating real deployment.',
  blocks: [
    {
      kind: 'text',
      paras: [
        { text: 'Robust backtesting framework to prevent overfitting. Instead of random train/test splits, uses time-based windows that simulate real deployment.' },
        { text: 'Key insight: If a strategy can’t adapt to new market conditions, it will fail in production. Walk-forward tests this adaptability.', tone: 'good' },
      ],
    },
    {
      kind: 'stats',
      items: [
        { label: 'WINDOWS', value: 'Multiple rolling windows' },
        { label: 'OUTPUT', value: 'HTML + JSON reports' },
        { label: 'STATUS', value: 'Complete framework' },
        { label: 'LOCATION', value: 'walk_forward_analytics/' },
      ],
    },
    {
      kind: 'text',
      heading: 'INTEGRATION',
      paras: [
        { text: 'Used by Zone Classifier and all strategy research. Essential before any production deployment.' },
      ],
    },
  ],
}

export const methodology: DocContent = {
  path: '// method/METHODOLOGY.md',
  title: 'METHODOLOGY',
  intro: 'The rolling-window process and what it tests.',
  blocks: [
    {
      kind: 'bullets',
      heading: 'WALK-FORWARD PROCESS',
      items: [
        { text: '1. Train: Optimize on window [t₀, t₁]', mark: 'none' },
        { text: '2. Test: Validate on [t₁, t₂] (future data)', mark: 'none' },
        { text: '3. Shift: Roll window forward — [t₁, t₂] train, [t₂, t₃] test', mark: 'none' },
        { text: '4. Repeat: Continue through dataset', mark: 'none' },
      ],
    },
    {
      kind: 'text',
      heading: 'CRITICAL RULE',
      paras: [
        { text: 'NEVER shuffle time series randomly. This creates look-ahead bias. Chronological order must be preserved.', tone: 'bad' },
        { text: 'ALWAYS train on past, validate on future.', tone: 'good' },
      ],
    },
    {
      kind: 'bullets',
      heading: 'WHAT IT TESTS',
      items: [
        { text: 'Adaptability: Can the strategy adjust to new regimes?', mark: 'none' },
        { text: 'Stability: Do parameters converge or oscillate wildly?', mark: 'none' },
        { text: 'Consistency: Is the edge maintained across windows?', mark: 'none' },
        { text: 'Overfitting: Does in-sample performance ≠ out-of-sample?', mark: 'none' },
      ],
    },
    {
      kind: 'bullets',
      heading: 'RED FLAGS',
      items: [
        { text: 'Parameter drift: optimal values change dramatically each window', mark: 'cross' },
        { text: 'In-sample win rate > out-of-sample by >10%', mark: 'cross' },
        { text: 'Performance degrades over time (not just market changes)', mark: 'cross' },
      ],
    },
  ],
}

const windowSharpe = [
  { window: 'W1', sharpe: 1.95 },
  { window: 'W2', sharpe: 1.72 },
  { window: 'W3', sharpe: 1.68 },
  { window: 'W4', sharpe: 1.55 },
  { window: 'W5', sharpe: 1.48 },
  { window: 'W6', sharpe: 1.36 },
  { window: 'W7', sharpe: 1.24 },
  { window: 'W8', sharpe: 1.02 },
  { window: 'W9', sharpe: 0.88 },
  { window: 'W10', sharpe: 0.65 },
]

export const windows: DocContent = {
  path: '// results/windows',
  title: 'WINDOW PERFORMANCE',
  intro: 'Sharpe per rolling window — the decay pattern walk-forward exists to expose.',
  blocks: [
    {
      kind: 'metrics',
      title: 'ROLLING WINDOW PERFORMANCE',
      metrics: [
        { label: 'AVG SHARPE', value: '1.45', trend: 'up' },
        { label: 'BEST WINDOW', value: '1.95', trend: 'up' },
        { label: 'WORST WINDOW', value: '0.65', trend: 'down' },
        { label: 'PROFITABLE', value: '9 / 10', trend: 'up' },
      ],
      chart: { kind: 'bar', data: windowSharpe, xKey: 'window', yKey: 'sharpe', illustrative: true },
    },
    {
      kind: 'text',
      paras: [
        { text: 'A gentle monotonic decay — not a cliff — is the healthy signature: the edge erodes as regimes shift but the strategy adapts.' },
      ],
    },
  ],
}
