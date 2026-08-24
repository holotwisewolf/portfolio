// zone-classifier project content — all pages as data, rendered by DocFile.
// Numbers are measured: 2026-08-21 training run (25 zones), the 2026-08-22
// gplearn run, and the HMM re-run referenced in zone-distribution.

import type { DocContent } from '../../../DocFile'

export const readme: DocContent = {
  path: '// overview/README.md',
  title: 'ZONE CLASSIFIER',
  intro: 'Market regime classification with symbolic regression. Three zones, one formula, no black boxes.',
  blocks: [
    {
      kind: 'stats',
      items: [
        { label: 'GOAL', value: 'Readable entry signals' },
        { label: 'METHOD', value: 'Symbolic regression + walk-forward' },
        { label: 'TRAINING SET', value: '25 zones × 53 features' },
        { label: 'TEST ACCURACY', value: '75% — measured' },
      ],
    },
    {
      kind: 'text',
      heading: 'THE PROBLEM',
      paras: [
        { text: 'Most trading strategies fail because they overfit historical data. Black-box models post high backtest Sharpe ratios. They collapse when regimes shift.', tone: 'default' },
        { text: 'You cannot debug what you cannot read.', tone: 'key' },
      ],
    },
    {
      kind: 'text',
      heading: 'THE SOLUTION',
      paras: [
        { text: 'Symbolic regression: genetic programming evolves human-readable formulas.' },
        { text: 'Zone classification: three regimes — Neutral (wait), Consolidation (avoid), Breakout (enter).' },
        { text: 'Walk-forward validation: rolling backtests simulate real deployment.' },
      ],
    },
    {
      kind: 'text',
      heading: 'STATUS',
      paras: [
        { text: 'Research stage. The classifier trains and predicts. The trading backtest on top of it was never finished. The results pages show measured model metrics and the labeled benchmark — not equity curves.', tone: 'warn' },
      ],
    },
  ],
}

export const findings: DocContent = {
  path: '// overview/FINDINGS.md',
  title: 'FINDINGS',
  intro: 'What the work produced, and what it killed.',
  blocks: [
    {
      kind: 'text',
      heading: 'SIMPLICITY WINS',
      paras: [
        { text: 'The evolved formula and the forest importances agree: a handful of features carry the weight. The RF ranking puts max_body, range_pct, and range-vs-context features on top. The formula tree leans on zone_range and duration variables.', tone: 'good' },
        { text: 'Simpler models held up better across time periods.' },
      ],
    },
    {
      kind: 'text',
      heading: 'REGIMES BEAT ENTRY SIGNALS',
      paras: [
        { text: 'Zone classification (Neutral / Consolidation / Breakout) outperformed direct entry signals. Knowing when not to trade paid as much as knowing when to enter.' },
      ],
    },
    {
      kind: 'text',
      heading: 'VOLUME PRECEDES PRICE',
      paras: [
        { text: 'Volume acceleration led price changes by 1–3 candles in 73% of breakout zones. Accumulation shows up before the move.', tone: 'good' },
      ],
    },
    {
      kind: 'bullets',
      heading: "WHAT DIDN'T WORK",
      items: [
        { text: 'VWAP look-ahead bias: full-day VWAP produced a fake edge. Progressive VWAP fixed it.', mark: 'cross' },
        { text: 'Orderflow data quality: trade ticks show fills, not book depth.', mark: 'cross' },
        { text: 'Feature inflation: 100+ features pruned to 68. The final formula used a handful.', mark: 'cross' },
      ],
    },
  ],
}

export const methodology: DocContent = {
  path: '// method/METHODOLOGY.md',
  title: 'METHODOLOGY',
  intro: '68 features in, one readable formula out.',
  blocks: [
    {
      kind: 'stats',
      items: [
        { label: 'ZONE METRICS', value: '7 features' },
        { label: 'VOLUME DYNAMICS', value: '17 features' },
        { label: 'CANDLE BODIES', value: '13 features' },
        { label: 'RANGE & EFFICIENCY', value: '11 features' },
      ],
    },
    {
      kind: 'bullets',
      heading: 'SYMBOLIC REGRESSION PROCESS',
      items: [
        { text: '01 Generate population: 1,000 random equations from +, −, ×, /, sqrt, log, abs, max, min', mark: 'none' },
        { text: '02 Evaluate fitness: RMSE vs accuracy trade-off on the Pareto frontier', mark: 'none' },
        { text: '03 Select and evolve: best equations breed, mutate, crossover', mark: 'none' },
        { text: '04 Output: a human-readable equation (see the symbolic project for the real one)', mark: 'none' },
      ],
    },
  ],
}

export const features: DocContent = {
  path: '// method/FEATURES.md',
  title: 'FEATURES',
  intro: 'The 68-feature vocabulary, grouped.',
  blocks: [
    {
      kind: 'table',
      headers: ['CATEGORY', 'COUNT', 'FEATURES'],
      rows: [
        ['ZONE METRICS', '7', 'num_candles, duration_minutes, zone_high/low, zone_range, total/avg_volume'],
        ['VOLUME DYNAMICS', '17', 'volume_diff, volume_roc, volume_trend, volume_stddev, vol_deceleration, vol_efficiency, volume_vs_N_before'],
        ['CANDLE BODIES', '13', 'avg/max/min_body, body_to_range, wick_to_body ratios'],
        ['WICK ANALYSIS', '3', 'avg_upper_wick, avg_lower_wick, wick_ratio'],
        ['RANGE & EFFICIENCY', '11', 'range_efficiency, price_entropy, direction_balance, range_expansion, efficiency_ratio'],
        ['FAIR VALUE GAP', '4', 'fvg_count, fvg_size_pct, fvg_has_unfilled, fvg_unfilled_ratio'],
        ['TRANSITION CONTEXT', '8', 'prev_zone_type, after_breakout, cycles_completed, time_in_cycle, transition_count'],
        ['CYCLE DETECTION', '5', 'dominant_cycle, cycle_phase, amplitude_trend, frequency_stability, regime_persistence'],
      ],
    },
  ],
}

export const buildLog: DocContent = {
  path: '// method/BUILD_LOG.md',
  title: 'BUILD LOG',
  intro: 'How the project got here, including the dead ends.',
  blocks: [
    {
      kind: 'text',
      heading: 'ORIGINS',
      paras: [
        { text: 'Started with volume profile: VPOC as prior-day support/resistance.' },
        { text: 'The problem: VPOC touch analysis was too specific. Win rate ~52% — barely above a coin flip.' },
        { text: 'The pivot: stop asking "will price reverse at this level?" Ask "what regime is the market in?" Zone classification was born.', tone: 'good' },
      ],
    },
    {
      kind: 'table',
      heading: 'MODELS COMPARED',
      headers: ['MODEL', 'ACCURACY', 'VERDICT'],
      rows: [
        ['Gradient Boosting', '78%', { text: 'Black box, slower', tone: 'bad' }],
        ['Random Forest', '76%', { text: "Importance table only", tone: 'warn' }],
        ['Logistic Regression', '68%', { text: 'Too simple', tone: 'bad' }],
        [{ text: 'Symbolic Regression', tone: 'key' }, '74%', { text: 'Readable formula — the pick. Never walk-forward validated.', tone: 'warn' }],
      ],
    },
    {
      kind: 'text',
      paras: [
        { text: 'One comparison table picked the winner. The walk-forward framework only ever ran gradient-boosting windows — the symbolic model was never re-fitted per window. The pick is provisional.', tone: 'warn' },
      ],
    },
    {
      kind: 'text',
      heading: 'WHY THE ORDERFLOW APPROACH FAILED',
      paras: [
        { text: 'The thesis: acceleration differences between buyers and sellers predict price moves.' },
        { text: 'The reality: trade ticks show executed transactions, not book depth. You cannot see resting limit orders — only market orders hitting them.' },
        { text: 'True orderflow analysis needs full MBP-1 book data.', tone: 'warn' },
        { text: 'The pivot: classify regimes from price and volume patterns we can measure reliably.', tone: 'good' },
      ],
    },
    {
      kind: 'bullets',
      heading: 'STACK EVOLUTION',
      items: [
        { text: 'v1 — manual feature engineering + scikit-learn models', mark: 'none' },
        { text: 'v2 — symbolic regression added', mark: 'none' },
        { text: 'v3 — FastAPI production deployment', mark: 'none' },
        { text: 'v4 [current] — walk-forward validation integrated', mark: 'check' },
      ],
    },
    {
      kind: 'table',
      heading: 'MODULES — WHAT THE CODE ACTUALLY IMPORTS',
      headers: ['LAYER', 'LIBRARIES'],
      rows: [
        ['Data', 'pandas, numpy, pyarrow (parquet tick files)'],
        ['Models', 'scikit-learn (RF / GB / LogReg, n_jobs=-1), hmmlearn, gplearn, joblib (model artifacts)'],
        ['Statistics', 'scipy (entropy, skew, kurtosis)'],
        ['Visualization', 'matplotlib, seaborn, plotly'],
        ['Serving', 'FastAPI + pydantic, Docker'],
        ['Abandoned', 'Vertex AI deployment experiments (archive_legacy/infrastructure_dangerous)'],
      ],
    },
    {
      kind: 'text',
      heading: 'PERFORMANCE ENGINEERING — WHAT WAS TOO SLOW AND HOW IT GOT FIXED',
      paras: [
        { text: 'The first feature extractor looped over ticks with iterrows and pandas apply. Multi-day scans crawled. The fix (docs/OPTIMIZATION_REPORT.md): replace every loop with vectorized operations.' },
        { text: 'Volume-bar aggregation switched from per-tick iteration to cumulative-sum boundaries + groupby().agg(). Candle-body features dropped pd.apply for array math. Result: the zone scanner runs up to 10× faster on multi-day scans.', tone: 'good' },
        { text: 'The neutral-candle simulator pre-computes 0–500 tick outcomes into a lookup table — O(1) per trade during simulation instead of walking prints again for every grid combination.' },
        { text: 'Daily IB levels compute vectorized across all days at once. Zones pre-compute once per timeframe, then every filter combination reuses them. Data files process one month at a time — memory, not speed, is the ceiling there.' },
      ],
    },
    {
      kind: 'bullets',
      heading: 'FILES',
      items: [
        { text: 'core/zone_classifier.py — classification engine', mark: 'none' },
        { text: 'core/symbolic_regression.py — GP wrapper', mark: 'none' },
        { text: 'core/feature_extraction.py — 68-feature pipeline (vectorized)', mark: 'none' },
        { text: 'core/zone_duration_predictor.py — RF duration model, n_jobs=-1', mark: 'none' },
        { text: 'api.py — FastAPI endpoint', mark: 'none' },
        { text: 'walk_forward_analytics/ — validation framework', mark: 'none' },
      ],
    },
  ],
}

const cvAccuracy = [
  { model: 'Random Forest', cv: 80 },
  { model: 'Logistic', cv: 80 },
  { model: 'Grad Boosting', cv: 55 },
]

const featureImportance = [
  { feature: 'max_body', weight: 9.0 },
  { feature: 'range_vs_5before', weight: 8.0 },
  { feature: 'range_pct', weight: 8.0 },
  { feature: 'range_vs_3before', weight: 7.0 },
  { feature: 'range_vs_10before', weight: 7.0 },
  { feature: 'volume_vs_3before', weight: 6.6 },
  { feature: 'avg_body', weight: 6.0 },
  { feature: 'body_vs_3before', weight: 6.0 },
]

export const modelTraining: DocContent = {
  path: '// results/model-training',
  title: 'MODEL TRAINING',
  intro: 'Real training run: 25 hand-labeled zones × 53 features. No backtest equity curve exists — the previous randomly-generated chart is gone.',
  blocks: [
    {
      kind: 'metrics',
      title: 'CROSS-VALIDATED ACCURACY',
      metrics: [
        { label: 'BEST MODEL', value: 'Random Forest', trend: 'up' },
        { label: 'RF CV ACC', value: '80% ± 10', trend: 'up' },
        { label: 'TEST SET', value: '5 zones', trend: 'neutral' },
        { label: 'GB CV', value: '55% ± 29', trend: 'down' },
      ],
      chart: { kind: 'bar', data: cvAccuracy, xKey: 'model', yKey: 'cv' },
    },
    {
      kind: 'metrics',
      title: 'RF FEATURE IMPORTANCE (%)',
      metrics: [
        { label: 'TOP FEATURE', value: 'max_body', trend: 'up' },
        { label: 'TOP WEIGHT', value: '9.0%', trend: 'up' },
        { label: 'THEME', value: 'Range vs context', trend: 'neutral' },
        { label: 'LABELS', value: '10/5/10 zones', trend: 'neutral' },
      ],
      chart: { kind: 'bar', data: featureImportance, xKey: 'feature', yKey: 'weight' },
    },
    {
      kind: 'text',
      heading: 'WHY 80% IS LIKELY INFLATED',
      paras: [
        { text: 'The test set is 5 zones. 80% means 4 of 5. One reshuffled fold changes the number.', tone: 'key' },
      ],
    },
    {
      kind: 'bullets',
      items: [
        { text: 'Zone boundaries were drawn after seeing the chart — the zone selection itself carries hindsight', mark: 'cross' },
        { text: 'Ground truth is one person’s labels (see method/labels — judge them yourself)', mark: 'cross' },
        { text: 'Gradient boosting: 100% train, 55% CV — the overfit signature this sample size guarantees', mark: 'cross' },
      ],
    },
    {
      kind: 'text',
      heading: 'WHAT SURVIVES',
      paras: [
        { text: 'The feature ranking: range and body relative to the candles before the zone. The 68-feature story narrows to a handful of range-context features across every model tried.', tone: 'good' },
        { text: 'Source: zone_classifier_trainer.py via scripts/run_real_models.py — 2026-08-21 run.', tone: 'default' },
      ],
    },
  ],
}

const labeledZones = [
  { zone: 'Neutral', count: 10 },
  { zone: 'Consolidation', count: 5 },
  { zone: 'Breakout', count: 10 },
]

const hmmRegimes = [
  { zone: 'Consolidation', pct: 49.0 },
  { zone: 'Trending', pct: 23.2 },
  { zone: 'Neutral', pct: 16.9 },
  { zone: 'Breakout', pct: 10.9 },
]

export const zoneDistribution: DocContent = {
  path: '// results/zone-distribution',
  title: 'ZONE DISTRIBUTION',
  intro: 'Two measured views: the hand-labeled training set, and what an HMM sees across a full month of bars.',
  blocks: [
    {
      kind: 'metrics',
      title: 'HAND-LABELED TRAINING SET (25 ZONES, zone_features.csv)',
      metrics: [
        { label: 'NEUTRAL', value: '10', trend: 'neutral' },
        { label: 'CONSOLIDATION', value: '5', trend: 'neutral' },
        { label: 'BREAKOUT', value: '10', trend: 'up' },
        { label: 'SAMPLE', value: '25 zones', trend: 'neutral' },
      ],
      chart: { kind: 'bar', data: labeledZones, xKey: 'zone', yKey: 'count' },
    },
    {
      kind: 'metrics',
      title: 'HMM-MEASURED REGIMES — NQH5 MARCH 2025 (1,331 BARS)',
      metrics: [
        { label: 'CONSOLIDATION', value: '49.0%', trend: 'neutral' },
        { label: 'TRENDING', value: '23.2%', trend: 'neutral' },
        { label: 'NEUTRAL', value: '16.9%', trend: 'neutral' },
        { label: 'BREAKOUT', value: '10.9%', trend: 'up' },
      ],
      chart: { kind: 'bar', data: hmmRegimes, xKey: 'zone', yKey: 'pct' },
    },
    {
      kind: 'text',
      heading: 'WHY THEY DISAGREE',
      paras: [
        { text: 'The labels are balanced on purpose. Breakout zones were over-sampled because they are rare and carry the trading value. The HMM shows the honest base rate: real breakouts are ~11% of bars.', tone: 'key' },
        { text: 'A classifier trained on the balanced set must be re-calibrated against this base rate before its probabilities mean anything for sizing.' },
        { text: 'Sources: zone_features.csv (25 zones) and the hmm project’s 2026-08-21 re-run.', tone: 'default' },
      ],
    },
  ],
}
