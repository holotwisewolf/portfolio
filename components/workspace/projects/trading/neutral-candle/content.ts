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
      heading: 'OUTCOME',
      paras: [
        { text: 'The full grid verdict: 99% of 4,775 configurations lost money, and the earlier star configuration collapsed under the fuller evaluation. The engine did its job — it killed its own best result before it could be trusted with capital.', tone: 'warn' },
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

// Real grid-search results from full_grid_search_results_2026-01-13_05-39-19.csv
// (4,775 configs, 941,882 trades) and top_10_configurations.csv (earlier parameterization).
const wrDistribution = [
  { bucket: '<40%', configs: 3617 },
  { bucket: '40-50%', configs: 81 },
  { bucket: '50-60%', configs: 10 },
  { bucket: '60-70%', configs: 1 },
  { bucket: '70%+', configs: 0 },
]

export const bestCombos: DocContent = {
  path: '// results/best-combos',
  title: 'GRID SEARCH VERDICT',
  intro: 'The full run, and it is brutal: 4,775 configurations, 941,882 simulated trades, 44 profitable.',
  blocks: [
    {
      kind: 'metrics',
      title: 'FULL GRID SEARCH (2026-01-13 RUN)',
      metrics: [
        { label: 'CONFIGS TESTED', value: '4,775', trend: 'neutral' },
        { label: 'TRADES', value: '941,882', trend: 'neutral' },
        { label: 'PROFITABLE', value: '44 (1%)', trend: 'down' },
        { label: 'BEST EV', value: '$372/trade', trend: 'up' },
      ],
      chart: { kind: 'bar', data: wrDistribution, xKey: 'bucket', yKey: 'configs' },
    },
    {
      kind: 'table',
      heading: 'BEST CONFIG BY EV — FINAL FULL RUN',
      headers: ['FILTERS', 'MODE', 'N', 'WIN RATE', 'EV/TRADE', 'RECOVERY'],
      rows: [
        ['{1, 3, 21}', 'fixed / A, 200t/100t', '10', '60.0%', { text: '$372.50', tone: 'good' }, '2.28'],
      ],
    },
    {
      kind: 'text',
      paras: [
        { text: 'Sample-size caveat: the best-by-EV configuration traded only 10 times. That is not an edge, that is noise with good posture.', tone: 'warn' },
      ],
    },
    {
      kind: 'table',
      heading: 'WHAT HAPPENED TO THE STAR CONFIG',
      headers: ['RUN', 'FILTERS', 'N', 'WIN RATE', 'EV/TRADE'],
      rows: [
        ['Earlier parameterization', '{8, 1, 3, 5} vwap/B', '38', { text: '73.7%', tone: 'good' }, { text: '$1,042.76', tone: 'good' }],
        ['Final full run (best of 162 variants)', '{8, 1, 3, 5} fixed/B', '132', { text: '32.6%', tone: 'bad' }, { text: '-$8.75', tone: 'bad' }],
      ],
    },
    {
      kind: 'bullets',
      heading: 'KEY FINDINGS',
      items: [
        { text: '99% of configurations lost money across the full grid', mark: 'cross' },
        { text: 'The earlier "best" config collapsed under the fuller evaluation — classic selection survivorship', mark: 'cross' },
        { text: 'Win rates above 60% essentially do not exist at realistic sample sizes', mark: 'none' },
        { text: 'These insights informed Zone Classifier filter design', mark: 'none' },
      ],
    },
    {
      kind: 'text',
      paras: [
        { text: 'Source: old_systems/original_research/neutral_candle_results/ — full_grid_search_results_2026-01-13_05-39-19.csv (4,775 configs) and top_10_configurations.csv.', tone: 'default' },
      ],
    },
  ],
}

const slippageSensitivity = [
  { regime: '5-15t', ev: 565 },
  { regime: '15-30t', ev: 522 },
  { regime: '30-50t', ev: 451 },
]

export const slippage: DocContent = {
  path: '// results/slippage',
  title: 'SLIPPAGE SENSITIVITY',
  intro: 'How the star configuration\'s EV decays as assumed execution costs rise.',
  blocks: [
    {
      kind: 'metrics',
      title: 'EV BY SLIPPAGE REGIME — FILTERS {8,1,3,5}',
      metrics: [
        { label: 'TIGHT (5-15t)', value: '$565', trend: 'up' },
        { label: 'BASE (15-30t)', value: '$522', trend: 'neutral' },
        { label: 'WIDE (30-50t)', value: '$451', trend: 'down' },
        { label: 'DECAY', value: '-20%', trend: 'down' },
      ],
      chart: { kind: 'bar', data: slippageSensitivity, xKey: 'regime', yKey: 'ev' },
    },
    {
      kind: 'text',
      heading: 'READ',
      paras: [
        { text: 'This is from the earlier parameterization where the config showed positive EV — the point of the table is the slope, not the level: every assumption of worse execution bleeds the edge, before the fuller run removed it entirely.' },
        { text: 'Source: slippage_impact_analysis.csv.', tone: 'default' },
      ],
    },
  ],
}
