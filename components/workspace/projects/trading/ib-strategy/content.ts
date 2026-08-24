// ib-strategy project content — REAL backtest run 2026-08-21 via scripts/run_real_ib.py:
// the author's ib_strategy.py on NQ March 2025 (9.9M clean ticks, 21 days, 254 trades,
// net of slippage/fees). Trade log: ./trade-log.csv in this folder.
// The previous 10-trade simulated log was fiction and is gone.

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
        { label: 'INSTRUMENT', value: 'NQ (NQH5, March 2025)' },
        { label: 'DATA', value: '9,912,376 clean ticks' },
        { label: 'CONFIRMATION', value: '5-min bars' },
      ],
    },
    {
      kind: 'text',
      heading: 'REAL BACKTEST VERDICT',
      paras: [
        { text: '254 trades across 21 days: 13.8% win rate overall. The mean-reversion book won 70-90% of its trades and lost six figures per variant. Only short-side break & retest finished positive.', tone: 'bad' },
        { text: 'High win rate with uncapped losers is not an edge — it is a steamroller with good marketing.', tone: 'key' },
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
      kind: 'diagram',
      id: 'cloned-box',
      caption: 'FIG 1 — THE CLONED BOX: the first hour\'s range, cloned 50% and 100% above and below.',
    },
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
      kind: 'example',
      id: 'ib-cloned-box',
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
      heading: 'STOP TYPES (ALL THREE TESTED)',
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

// Real per-strategy aggregates from trade-log.csv
const strategyPnl = [
  { strategy: 'B&R Short', pnl: 8148 },
  { strategy: 'B&R Long', pnl: -663 },
  { strategy: 'MR IB Mid', pnl: -121578 },
  { strategy: 'MR IB Edge', pnl: -201440 },
  { strategy: 'MR 100% Ext', pnl: -451875 },
  { strategy: 'MR 150% Ext', pnl: -575458 },
]

// Real cumulative PnL of all Break & Retest trades in exit order (38 trades)
const brEquity = [
  -747, -1481, -2216, -2694, -3173, -3709, -1174, 989, 527, 66, -460, -985, -1611,
  -2237, 150, -356, -993, -1630, -2023, -203, 1617, 3437, 2669, 1902, 939, 177, -509,
  -1196, -1553, -1814, -2025, 435, 40, -354, 2728, 5811, 5356, 7486,
]

export const backtest: DocContent = {
  path: '// results/backtest',
  title: 'REAL BACKTEST',
  intro: 'NQH5 March 2025 — 254 trades, net of slippage and fees. Trade log: trade-log.csv.',
  blocks: [
    {
      kind: 'metrics',
      title: 'TOTAL PnL BY STRATEGY ($)',
      metrics: [
        { label: 'TOTAL TRADES', value: '254', trend: 'neutral' },
        { label: 'ONLY WINNER', value: 'B&R Short', trend: 'up' },
        { label: 'B&R SHORT', value: '+$8,148', trend: 'up' },
        { label: 'WORST VARIANT', value: '-$575,458', trend: 'down' },
      ],
      chart: { kind: 'bar', data: strategyPnl, xKey: 'strategy', yKey: 'pnl' },
    },
    {
      kind: 'metrics',
      title: 'BREAK & RETEST EQUITY — CUMULATIVE PnL ($, 38 TRADES)',
      metrics: [
        { label: 'FINAL', value: '+$7,486', trend: 'up' },
        { label: 'MEAN TRADE', value: '$452.69', trend: 'up' },
        { label: 'SHARPE (ANN.)', value: '4.51', trend: 'up' },
        { label: 'MAX DD (MEDIAN)', value: '$3,057', trend: 'neutral' },
      ],
      chart: { kind: 'anim-line', data: brEquity.map((equity, i) => ({ trade: i + 1, equity })), xKey: 'trade', yKey: 'equity' },
    },
    {
      kind: 'table',
      heading: 'WIN RATE vs OUTCOME — THE LESSON',
      headers: ['STRATEGY', 'TRADES', 'WIN RATE', 'TOTAL PnL'],
      rows: [
        ['Break & Retest (Short)', '18', { text: '30%', tone: 'warn' }, { text: '+$8,148', tone: 'good' }],
        ['Break & Retest (Long)', '20', '20%', { text: '-$663', tone: 'bad' }],
        ['Mean Rev (IB Mid)', '54', { text: '70%', tone: 'good' }, { text: '-$121,578', tone: 'bad' }],
        ['Mean Rev (IB Edge)', '54', { text: '80%', tone: 'good' }, { text: '-$201,440', tone: 'bad' }],
        ['Mean Rev (100% Ext)', '54', { text: '90%', tone: 'good' }, { text: '-$451,875', tone: 'bad' }],
      ],
    },
    {
      kind: 'text',
      heading: 'PROP FIRM SIMULATOR (TOPSTEP MODEL, 1,000 SIMULATIONS)',
      paras: [
        { text: 'Break & Retest Short on a 100k account ($6k target / $3k trail): 84.2% pass rate, median 4 days. 50k account: 70.0% pass. Probability of loss: 0.0%. Monte Carlo 95% worst-case drawdown $4,886.' },
      ],
    },
    {
      kind: 'text',
      heading: 'WHY THE POSITIVE RESULT IS LIKELY A FALSE POSITIVE',
      paras: [
        { text: 'If +$452/trade with Sharpe 4.51 were real, this page would be a footnote under a fund. It is almost certainly selection noise, for five stacking reasons:', tone: 'key' },
      ],
    },
    {
      kind: 'bullets',
      items: [
        { text: '18 trades. A Sharpe ratio annualized from 18 observations is a random number generator with formatting.', mark: 'cross' },
        { text: 'The winner is SHORT-only, in a month where NQ fell ~4%. Direction aligned with regime is luck wearing a suit — flip to a rally month and the sign likely flips.', mark: 'cross' },
        { text: 'Max-of-many: the grid tested 6 strategies × 3 stop types × multiple target modes. The best of dozens of variants will look good by chance alone.', mark: 'cross' },
        { text: 'The 84% Topstep pass rate is simulated FROM the same 18 trades — the simulator resamples the sample, it does not validate it.', mark: 'cross' },
        { text: 'Slippage is an assumption in the code, not a measurement from live fills.', mark: 'cross' },
        { text: 'And the same run shows it: Break & Retest LONG lost money in the identical geometry. A real microstructure edge should not care which way the box breaks.', mark: 'cross' },
      ],
    },
    {
      kind: 'formula',
      heading: 'THE REALITY-CHECK LAYER — core/skepticism.py ("if it looks too good to be true, run this module")',
      formulas: [
        'fill_price  = price + (direction × slippage_ticks × tick_size)',
        'net_pnl     = raw_pnl − commissions_per_trade',
        'monte_carlo = resample trade sequence × 1,000 → drawdown distribution',
      ],
      notes: [
        { text: 'Buys pay more, sells receive less — slippage always cuts against you. Every trade in this log already has these applied (2-tick slip + commission per round trip).' },
        { text: 'The residual catch: the tick count is an assumption, not a measurement. The formula is honest; its input is a guess — and a strategy whose survival depends on slippage being exactly 2 ticks has no margin of safety.', tone: 'warn' },
      ],
    },
    {
      kind: 'text',
      paras: [
        { text: 'What survives skepticism: the negative result (mean reversion\'s high win rate hiding catastrophic tails) and the failed-auction filter logic. Not the Sharpe.', tone: 'warn' },
        { text: 'Source: ib_strategy.py via scripts/run_real_ib.py — full per-trade log with entries, exits, MAE in this folder. Slippage/commission formulas: core/skepticism.py.', tone: 'default' },
      ],
    },
  ],
}
