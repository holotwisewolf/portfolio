// neutral-candle project content — migrated from components/windows/ProjectNeutralCandle.tsx.

import type { DocContent } from '../../../DocFile'

export const readme: DocContent = {
  path: '// overview/README.md',
  title: 'NEUTRAL CANDLE OPTIMIZER',
  intro: 'A 12-filter grid search engine with built-in Monte Carlo robustness testing.',
  blocks: [
    {
      kind: 'text',
      paras: [
        { text: 'Role: Master grid search engine with 12-filter optimizer.', tone: 'key' },
        { text: 'Capability: Tests thousands of filter combinations across strategy parameters.' },
        { text: 'Key feature: Monte Carlo simulation built-in for robustness testing.', tone: 'good' },
      ],
    },
    {
      kind: 'text',
      heading: 'LEGACY SYSTEM',
      paras: [
        { text: 'Preserved in archive_legacy/old_systems/original_research/neutral_candle.py. Logic has been incorporated into newer systems (Zone Classifier, IB Strategy).', tone: 'warn' },
      ],
    },
  ],
}

export const filters: DocContent = {
  path: '// method/FILTERS.md',
  title: 'FILTERS',
  intro: 'The filter vocabulary the grid search composes.',
  blocks: [
    {
      kind: 'formula',
      heading: 'NOTABLE FILTERS',
      formulas: [
        'Filter 9 : Smart Stop    — dynamic stop, Zone Height + 5 ticks',
        'Filter 12: Dynamic VWAP  — targets progressive VWAP lines',
        'Filter 17: Volume Surge  — Breakout Vol / Neutral Vol > 1.25',
        'Filter 20: VPOC Filter   — requires VPOC inside zone',
      ],
    },
    {
      kind: 'bullets',
      heading: 'GRID SEARCH ENGINE',
      items: [
        { text: 'Tests all combinations of enabled filters', mark: 'none' },
        { text: 'Evaluates by win rate, total P&L, Sharpe ratio', mark: 'none' },
        { text: 'Returns ranked list of filter combinations', mark: 'none' },
      ],
    },
    {
      kind: 'text',
      heading: 'FAST PATH OPTIMIZATION',
      paras: [
        { text: 'Pre-calculates 0-500 tick outcomes for O(1) lookup during simulation.' },
      ],
    },
  ],
}

const combos = [
  { combo: 'F9+F12+F17', winRate: 58 },
  { combo: 'F9+F12', winRate: 54 },
  { combo: 'F9+F17', winRate: 52 },
  { combo: 'F12+F17', winRate: 50 },
  { combo: 'All 12', winRate: 47 },
]

export const bestCombos: DocContent = {
  path: '// results/best-combos',
  title: 'BEST COMBINATIONS',
  intro: 'Top filter combinations from the 4,096-combo grid search.',
  blocks: [
    {
      kind: 'metrics',
      title: 'GRID SEARCH RESULTS',
      metrics: [
        { label: 'COMBOS TESTED', value: '4,096', trend: 'neutral' },
        { label: 'BEST WIN RATE', value: '58%', trend: 'up' },
        { label: 'BEST SHARPE', value: '1.8', trend: 'up' },
        { label: 'OVERFIT RISK', value: 'Low', trend: 'neutral' },
      ],
      chart: { kind: 'bar', data: combos, xKey: 'combo', yKey: 'winRate' },
    },
    {
      kind: 'bullets',
      heading: 'KEY FINDINGS',
      items: [
        { text: 'F9 (Smart Stop) + F12 (Dynamic VWAP) + F17 (Volume Surge) = best combo', mark: 'check' },
        { text: 'More filters ≠ better results (diminishing returns after 3 filters)', mark: 'check' },
        { text: 'Monte Carlo confirms edge is statistically significant', mark: 'check' },
        { text: 'These insights informed Zone Classifier filter design', mark: 'none' },
      ],
    },
  ],
}

export const monteCarlo: DocContent = {
  path: '// results/monte-carlo',
  title: 'MONTE CARLO',
  intro: 'Separating edge from luck with 1,000 random trade sequences.',
  blocks: [
    {
      kind: 'metrics',
      title: 'LUCK DISTRIBUTION ANALYSIS',
      metrics: [
        { label: 'REAL RESULT', value: '$5,000', trend: 'up' },
        { label: 'PERCENTILE', value: '97th', trend: 'up' },
        { label: 'P-VALUE', value: '<0.05', trend: 'neutral' },
        { label: 'SIGNIFICANT?', value: 'Yes', trend: 'up' },
      ],
    },
    {
      kind: 'text',
      heading: 'METHOD',
      paras: [
        { text: 'Simulate 1,000 random trade sequences to build a "luck distribution."' },
        { text: 'Purpose: Distinguish strategy edge from random chance.' },
        { text: 'If real results fall outside 95% of simulations, the edge is statistically significant.', tone: 'good' },
        { text: 'Result sits in the top 5% of simulations — statistically significant edge detected.', tone: 'good' },
      ],
    },
  ],
}
