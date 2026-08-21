// hmm project content — migrated from components/windows/ProjectHMM.tsx.

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
        { label: 'ENTRY POINT', value: 'core/hmm_analysis_tool.py' },
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
        { text: 'Random state initialization', mark: 'none' },
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
    },
  ],
}

// Representative regime sequence (values: 3=breakout, 2=trending, 1=consolidation, 0.5=neutral)
const regimeSeries = [
  1, 1, 0.5, 1, 2, 2, 1, 1, 3, 2, 2, 1, 0.5, 0.5, 1, 2, 3, 3, 2, 1, 1, 0.5, 1, 2,
].map((regimeValue, i) => ({ day: i + 1, regimeValue }))

export const regimeTransitions: DocContent = {
  path: '// results/regime-transitions',
  title: 'REGIME TRANSITIONS',
  intro: 'Detected regime per day over the analysis window (3=breakout, 2=trending, 1=consolidation, 0.5=neutral).',
  blocks: [
    {
      kind: 'metrics',
      title: 'REGIME TRANSITIONS OVER TIME',
      metrics: [
        { label: 'TOTAL DAYS', value: '60', trend: 'neutral' },
        { label: 'REGIMES', value: '4', trend: 'neutral' },
        { label: 'AVG CONFIDENCE', value: '82%', trend: 'up' },
        { label: 'TRANSITIONS', value: '12', trend: 'neutral' },
      ],
      chart: { kind: 'line', data: regimeSeries, xKey: 'day', yKey: 'regimeValue', illustrative: true },
    },
  ],
}

const stateDistribution = [
  { state: 'Consolidation', count: 35 },
  { state: 'Trending', count: 28 },
  { state: 'Breakout', count: 22 },
  { state: 'Neutral', count: 15 },
]

export const stateDistributionFile: DocContent = {
  path: '// results/state-distribution',
  title: 'STATE DISTRIBUTION',
  intro: 'Share of time the market spent in each detected state.',
  blocks: [
    {
      kind: 'metrics',
      title: 'STATE DISTRIBUTION',
      metrics: [
        { label: 'MOST COMMON', value: 'Consolidation', trend: 'neutral' },
        { label: '% TIME', value: '35%', trend: 'neutral' },
        { label: 'BREAKOUTS', value: '22%', trend: 'up' },
        { label: 'NEUTRAL', value: '15%', trend: 'neutral' },
      ],
      chart: { kind: 'bar', data: stateDistribution, xKey: 'state', yKey: 'count' },
    },
  ],
}
