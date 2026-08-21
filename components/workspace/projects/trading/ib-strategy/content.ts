// ib-strategy project content — migrated from components/windows/ProjectIB.tsx.
// Trade log is the legacy simulated backtest — charts carry illustrative: true.

import type { DocContent } from '../../../DocFile'

export const readme: DocContent = {
  path: '// overview/README.md',
  title: 'INITIAL BALANCE STRATEGIES',
  intro: 'Two strategies built on one geometry: the first-hour range cloned above and below.',
  blocks: [
    {
      kind: 'text',
      heading: 'TWO STRATEGIES',
      paras: [
        { text: '1. Mean Reversion: Fade 100% extension moves. For ranging markets.', tone: 'good' },
        { text: '2. Sustained Auction: Break & retest of IB range. For trending markets.' },
        { text: 'Both use the "Cloned Box" geometry — IB height extended above/below the opening range.', tone: 'key' },
      ],
    },
    {
      kind: 'stats',
      items: [
        { label: 'IB PERIOD', value: '9:30 - 10:30 AM ET' },
        { label: 'INSTRUMENT', value: 'NQ / ES Futures' },
        { label: 'RETEST LEEWAY', value: '10% on entries' },
      ],
    },
  ],
}

export const rules: DocContent = {
  path: '// method/RULES.md',
  title: 'RULES',
  intro: 'The cloned box geometry and both playbooks.',
  blocks: [
    {
      kind: 'formula',
      heading: 'THE CLONED BOX',
      formulas: [
        'IB_High        = max(price) during 9:30-10:30',
        'IB_Low         = min(price) during 9:30-10:30',
        'Height         = IB_High − IB_Low',
        'Ext_100_Top    = IB_High + Height',
        'Ext_100_Bottom = IB_Low − Height',
        'Ext_50_Top     = IB_High + 0.5 × Height',
        'Ext_50_Bottom  = IB_Low − 0.5 × Height',
      ],
      notes: [
        { text: '100% extension is the primary level; 50% is the intermediate one.' },
      ],
    },
    {
      kind: 'text',
      heading: 'MEAN REVERSION',
      paras: [
        { text: 'Markets range 70% of the time. Extensions get faded.' },
        { text: '100% Extension: Primary target. Fade moves to IB edge.', tone: 'good' },
        { text: '50% Extension: Secondary target. More conservative.' },
      ],
    },
    {
      kind: 'bullets',
      heading: 'STOP TYPES',
      items: [
        { text: 'Structure Stop: 2 ticks beyond trigger candle high/low', mark: 'none' },
        { text: 'Smart Stop: Zone Height + 5 ticks (Filter 9 logic)', mark: 'none' },
        { text: 'Fixed Stop: 20 ticks (5 points)', mark: 'none' },
      ],
    },
    {
      kind: 'text',
      heading: 'SUSTAINED AUCTION (BREAK & RETEST)',
      paras: [
        { text: 'When price breaks IB range with conviction (5 ticks beyond IB high/low), it often retests before continuing — enter on the pullback to the IB edge.' },
        { text: '10% leeway on the stop allows for noise — real markets are not perfect.' },
        { text: 'Failed Auction Signal: If price blows through IB edge on retest, the auction failed. Exit with small loss. This filter alone saves many losing trades.', tone: 'key' },
      ],
    },
  ],
}

// Equity series computed from the legacy simulated trade log (start $10,000)
const equity = [
  { trade: 1, equity: 10150 },
  { trade: 2, equity: 10350 },
  { trade: 3, equity: 10325 },
  { trade: 4, equity: 10475 },
  { trade: 5, equity: 10650 },
  { trade: 6, equity: 10640 },
  { trade: 7, equity: 10790 },
  { trade: 8, equity: 10940 },
  { trade: 9, equity: 10865 },
  { trade: 10, equity: 11040 },
]

const strategySplit = [
  { strategy: 'Break & Retest', avgPnL: 125 },
  { strategy: 'Mean Reversion', avgPnL: 83 },
]

export const backtest: DocContent = {
  path: '// results/backtest',
  title: 'BACKTEST LOG',
  intro: 'Simulated NQ backtest — 0.25 tick size, $5/tick. Net of 2-tick slippage + 1-tick commission per round-trip.',
  blocks: [
    {
      kind: 'metrics',
      title: 'EQUITY CURVE',
      metrics: [
        { label: 'TOTAL P&L', value: '$1,040', trend: 'up' },
        { label: 'WIN RATE', value: '78%', trend: 'up' },
        { label: 'AVG P&L', value: '$104', trend: 'up' },
        { label: 'RECORD', value: '7W/2L/1F', trend: 'up' },
      ],
      chart: { kind: 'anim-line', data: equity, xKey: 'trade', yKey: 'equity', illustrative: true },
    },
    {
      kind: 'metrics',
      title: 'STRATEGY COMPARISON',
      metrics: [
        { label: 'BEST STRATEGY', value: 'Break & Retest', trend: 'neutral' },
        { label: 'B&R AVG', value: '$125/trade', trend: 'up' },
        { label: 'MR AVG', value: '$83/trade', trend: 'up' },
        { label: 'FLAT TRADES', value: '1', trend: 'neutral' },
      ],
      chart: { kind: 'bar', data: strategySplit, xKey: 'strategy', yKey: 'avgPnL', illustrative: true },
    },
    {
      kind: 'table',
      heading: 'TRADE LOG',
      headers: ['DATE', 'STRATEGY', 'ENTRY', 'RESULT', 'P&L'],
      rows: [
        ['2024-12-02', 'Break & Retest Long', '15150.0', { text: 'WIN', tone: 'good' }, { text: '+$150', tone: 'good' }],
        ['2024-12-03', 'Mean Rev 100% Short', '15220.0', { text: 'WIN', tone: 'good' }, { text: '+$200', tone: 'good' }],
        ['2024-12-04', 'Break & Retest Short', '15100.0', { text: 'LOSS', tone: 'bad' }, { text: '-$25', tone: 'bad' }],
        ['2024-12-05', 'Mean Rev 50% Long', '15080.0', { text: 'WIN', tone: 'good' }, { text: '+$150', tone: 'good' }],
        ['2024-12-06', 'Break & Retest Long', '15140.0', { text: 'WIN', tone: 'good' }, { text: '+$175', tone: 'good' }],
        ['2024-12-09', 'Mean Rev 100% Short', '15200.0', 'FLAT', '-$10'],
        ['2024-12-10', 'Mean Rev 50% Long', '15090.0', { text: 'WIN', tone: 'good' }, { text: '+$150', tone: 'good' }],
        ['2024-12-11', 'Break & Retest Short', '15130.0', { text: 'WIN', tone: 'good' }, { text: '+$150', tone: 'good' }],
        ['2024-12-12', 'Mean Rev 100% Short', '15225.0', { text: 'LOSS', tone: 'bad' }, { text: '-$75', tone: 'bad' }],
        ['2024-12-13', 'Break & Retest Long', '15125.0', { text: 'WIN', tone: 'good' }, { text: '+$175', tone: 'good' }],
      ],
    },
  ],
}
