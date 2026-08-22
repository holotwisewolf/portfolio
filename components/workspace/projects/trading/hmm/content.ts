// hmm project content — RE-RUN for real on 2026-08-21: 4-state GaussianHMM
// (hmmlearn, full covariance, seed 42) on 1,331 15-min NQH5 bars (March 2025)
// built from raw Databento ticks. Deviations from the original tool, both noted:
// bars built directly from ticks (its data cleaner dropped 85% of candles) and
// features standardized before fit.

import type { DocContent } from '../../../DocFile'

export const readme: DocContent = {
  path: '// overview/README.md',
  title: 'HIDDEN MARKOV REGIMES',
  intro: 'Market regime detection with a 4-state Gaussian HMM.',
  blocks: [
    {
      kind: 'text',
      paras: [
        { text: 'Hidden Markov Models for market regime detection. Uses the hmmlearn library with a 4-state Gaussian HMM.' },
        { text: 'Classifies markets into CONSOLIDATION, BREAKOUT, TRENDING, NEUTRAL states based on range, body, and volume characteristics.', tone: 'good' },
      ],
    },
    {
      kind: 'stats',
      items: [
        { label: 'STATES', value: '4 states' },
        { label: 'FEATURES', value: '4 features' },
        { label: 'LIBRARY', value: 'hmmlearn' },
        { label: 'RUN', value: 'NQH5 Mar 2025 — 1,331 bars' },
      ],
    },
    {
      kind: 'text',
      heading: 'RE-RUN RESULT',
      paras: [
        { text: 'Trained on 1,331 fifteen-minute bars from real NQH5 ticks (March 2025). 97.7% of bar assignments carry >70% model confidence. Consolidation dominates at 49% of bars; true breakout conditions are 11%. Full distribution below in results.', tone: 'key' },
      ],
    },
  ],
}

export const findings: DocContent = {
  path: '// overview/FINDINGS.md',
  title: 'FINDINGS',
  intro: 'How the unsupervised approach compares to the symbolic one.',
  blocks: [
    {
      kind: 'table',
      heading: 'HMM vs ZONE CLASSIFIER',
      headers: ['ASPECT', 'HMM', 'ZONE CLASSIFIER'],
      rows: [
        ['Method', 'Unsupervised learning', 'Symbolic regression'],
        ['Interpretability', 'Black box states', { text: 'Readable formulas', tone: 'good' }],
        ['States', '4 fixed states', '3 dynamic classes'],
        ['Features', '4 features', '68 features'],
        ['Use case', 'Regime detection', { text: 'Trading signals', tone: 'good' }],
      ],
    },
    {
      kind: 'text',
      heading: 'WHEN TO USE EACH',
      paras: [
        { text: 'HMM: Exploratory analysis, discovering hidden market structures.' },
        { text: 'Zone Classifier: Production trading, interpretable signals, validated edge.', tone: 'good' },
      ],
    },
  ],
}

export const methodology: DocContent = {
  path: '// method/METHODOLOGY.md',
  title: 'METHODOLOGY',
  intro: 'State classification rules and training configuration.',
  blocks: [
    {
      kind: 'bullets',
      heading: 'STATE CLASSIFICATION',
      items: [
        { text: 'CONSOLIDATION: Range < 0.3%, Body < 0.2%', mark: 'check' },
        { text: 'BREAKOUT: Range > 1.0%', mark: 'cross' },
        { text: 'TRENDING: Between consolidation and breakout thresholds', mark: 'none' },
        { text: 'NEUTRAL: All other states', mark: 'none' },
      ],
    },
    {
      kind: 'text',
      heading: 'HIGH CONFIDENCE PREDICTIONS',
      paras: [
        { text: 'Model tracks predictions with >70% probability as "high confidence."' },
        { text: 'Lower confidence predictions indicate regime transition or uncertainty.' },
      ],
    },
    {
      kind: 'bullets',
      heading: 'TRAINING PARAMETERS',
      items: [
        { text: '4-state Gaussian HMM', mark: 'none' },
        { text: 'Full covariance matrix', mark: 'none' },
        { text: '100 iteration convergence', mark: 'none' },
        { text: 'Random state 42', mark: 'none' },
      ],
    },
  ],
}

export const features: DocContent = {
  path: '// method/FEATURES.md',
  title: 'FEATURES',
  intro: 'The four features feeding the HMM.',
  blocks: [
    {
      kind: 'formula',
      heading: 'FEATURE SET',
      formulas: [
        '1. range_pct    = (high − low) / close   — volatility measure',
        '2. body_pct     = body / close           — directional strength',
        '3. volume_ratio = volume / volume_MA20   — relative volume',
        '4. volatility   = range_pct rolling std(20) — volatility regime',
      ],
      notes: [
        { text: 'Features standardized before fitting (full-covariance HMMs need comparable scales).' },
      ],
    },
  ],
}

// Real state profiles from the March 2025 run (means in original units)
const stateDistribution = [
  { state: 'Consolidation', bars: 49.0 },
  { state: 'Trending', bars: 23.2 },
  { state: 'Neutral', bars: 16.9 },
  { state: 'Breakout', bars: 10.9 },
]

export const stateDistributionFile: DocContent = {
  path: '// results/state-distribution',
  title: 'STATE DISTRIBUTION',
  intro: 'Measured on 1,331 real 15-min NQH5 bars, March 2025.',
  blocks: [
    {
      kind: 'metrics',
      title: 'TIME IN EACH STATE (% OF BARS)',
      metrics: [
        { label: 'MOST COMMON', value: 'Consolidation', trend: 'neutral' },
        { label: 'CONSOLIDATION', value: '49.0%', trend: 'neutral' },
        { label: 'BREAKOUT', value: '10.9%', trend: 'up' },
        { label: 'HIGH CONFIDENCE', value: '97.7%', trend: 'up' },
      ],
      chart: { kind: 'bar', data: stateDistribution, xKey: 'state', yKey: 'bars' },
    },
    {
      kind: 'table',
      heading: 'STATE PROFILES (FEATURE MEANS) — HOW STATES WERE LABELED',
      headers: ['STATE', 'RANGE %', 'BODY %', 'VOL RATIO', 'VOLATILITY'],
      rows: [
        ['Consolidation (49.0%)', '0.16', '0.08', '1.16', '0.00065'],
        ['Trending (23.2%)', '0.40', '0.20', '0.89', '0.00174'],
        ['Neutral (16.9%)', '0.14', '0.07', { text: '0.17', tone: 'warn' }, '0.00172'],
        ['Breakout (10.9%)', { text: '0.53', tone: 'good' }, '0.27', { text: '3.05', tone: 'good' }, '0.00206'],
      ],
    },
    {
      kind: 'text',
      paras: [
        { text: 'Labeling follows the classification rules: the tightest range/body state is consolidation, the widest-range state with 3× relative volume is breakout, the lowest-volume state is neutral, and the remaining wide-range normal-volume state is trending.', tone: 'default' },
        { text: 'Source: re-run 2026-08-21 via scripts/run_real_models2.py — hmmlearn GaussianHMM on raw Databento NQH5 ticks.', tone: 'default' },
      ],
    },
  ],
}

// Real daily dominant-state sequence (18 trading days, March 2025)
const dailyStates = [
  { day: 1, state: 1 }, { day: 2, state: 1 }, { day: 3, state: 1 }, { day: 4, state: 1 },
  { day: 5, state: 1 }, { day: 6, state: 1 }, { day: 7, state: 0 }, { day: 8, state: 0 },
  { day: 9, state: 1 }, { day: 10, state: 1 }, { day: 11, state: 1 }, { day: 12, state: 1 },
  { day: 13, state: 2 }, { day: 14, state: 1 }, { day: 15, state: 1 }, { day: 16, state: 1 },
  { day: 17, state: 1 }, { day: 18, state: 1 },
]

export const regimeTransitions: DocContent = {
  path: '// results/regime-transitions',
  title: 'REGIME SEQUENCE',
  intro: 'Dominant state per trading day, March 2025 (0=trending, 1=consolidation, 2=neutral, 3=breakout).',
  blocks: [
    {
      kind: 'metrics',
      title: 'REGIME SEQUENCE — DAILY DOMINANT STATE',
      metrics: [
        { label: 'TRADING DAYS', value: '18', trend: 'neutral' },
        { label: 'TRANSITIONS (BAR-LEVEL)', value: '103', trend: 'neutral' },
        { label: 'CONSOL. DAYS', value: '15 / 18', trend: 'neutral' },
        { label: 'TRENDING DAYS', value: '3 / 18', trend: 'neutral' },
      ],
      chart: { kind: 'line', data: dailyStates, xKey: 'day', yKey: 'state' },
    },
    {
      kind: 'text',
      paras: [
        { text: 'March 2025 was a grinding consolidation month with one trending stretch (days 7-8) and one quiet day (13). Bar-level regime flips (103 across 1,331 bars) are frequent — the daily mode smooths them into what a human would call "the kind of day it was."', tone: 'key' },
        { text: 'Source: re-run 2026-08-21 — same model as state-distribution.', tone: 'default' },
      ],
    },
  ],
}
