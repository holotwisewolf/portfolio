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
        { label: 'WINDOW PRESETS', value: 'conservative / balanced / aggressive / quick' },
        { label: 'MODELS TRAINED', value: 'gradient-boosting per window — 126 saved artifacts' },
        { label: 'OUTPUT', value: 'HTML + JSON reports per run' },
        { label: 'LOCATION', value: 'walk_forward_analytics/' },
      ],
    },
    {
      kind: 'text',
      heading: 'WHAT IT ACTUALLY RAN',
      paras: [
        { text: 'The February 2026 runs trained a gradient-boosting model per rolling window on the zone features, then scored each window\'s model on the NEXT window\'s data — 126 window models accumulated across runs, each saved as a .joblib artifact with its HTML report. The consistency metrics on the results page come from comparing per-window behavior across those runs.' },
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

// Real consistency metrics from walk_forward_analytics/outputs/results/
// walk_forward_report_20260209_085720.html (2026-02-09 run, gradient-boosting windows)
const consistency = [
  { metric: 'Return', score: 0.94 },
  { metric: 'Sharpe', score: 0.998 },
  { metric: 'Win Rate', score: 1.0 },
  { metric: 'Drawdown', score: 0.999 },
]

export const windows: DocContent = {
  path: '// results/windows',
  title: 'WINDOW PERFORMANCE',
  intro: 'Robustness metrics from the real February 2026 walk-forward run (126 trained window models).',
  blocks: [
    {
      kind: 'metrics',
      title: 'CONSISTENCY ACROSS WINDOWS (1.0 = IDENTICAL BEHAVIOR)',
      metrics: [
        { label: 'ROBUSTNESS SCORE', value: '0.984', trend: 'up' },
        { label: 'WINDOWS PROFITABLE', value: '100%', trend: 'up' },
        { label: 'SIGNIFICANCE', value: 'p = 0.0031', trend: 'up' },
        { label: 'MC P(POSITIVE)', value: '1.000', trend: 'up' },
      ],
      chart: { kind: 'bar', data: consistency, xKey: 'metric', yKey: 'score' },
    },
    {
      kind: 'text',
      heading: 'WHY PERFECTION IS SUSPICIOUS',
      paras: [
        { text: 'Consistency 0.984, 100% of windows profitable, Monte Carlo P(positive) = 1.000. Results this clean are usually a leak, not an edge. If this framework certified real money-making, it would be a fund by now.', tone: 'key' },
      ],
    },
    {
      kind: 'bullets',
      items: [
        { text: 'The walk-forwarded models predict labels, not PnL — "consistent" means consistently agreeing with hand-labels, which is one person\'s opinion of the chart', mark: 'cross' },
        { text: 'Rolling windows overlap: adjacent windows share most of their data, so "independent confirmation" isn\'t independent', mark: 'cross' },
        { text: 'P(positive) = 1.000 from Monte Carlo resampling of the same trade sequence — the simulator resamples the sample (same self-referential trap as the prop-firm simulator)', mark: 'cross' },
        { text: 'The report itself flags probability of beating the benchmark as 0.000 — positive, but not better than the naive comparison', mark: 'cross' },
        { text: 'Robustness of the pipeline, yes; robustness of an edge, unproven — the two are not the same claim', mark: 'none' },
      ],
    },
    {
      kind: 'text',
      paras: [
        { text: 'Source: walk_forward_analytics outputs — 2026-02-09 run, 126 window models.', tone: 'default' },
      ],
    },
  ],
}
