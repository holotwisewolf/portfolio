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
  intro: 'How a neutral-candle trade forms, and the full filter vocabulary the grid composes.',
  blocks: [
    {
      kind: 'text',
      heading: 'HOW A TRADE FORMS',
      paras: [
        { text: 'A NEUTRAL candle is a quiet bar — small body, inside the recent range. A BREAKOUT is the next candle (or up to 4, chained while momentum holds) closing beyond the neutral candle\'s high or low. Entry: at the neutral candle\'s extreme in the breakout direction. Each return to that level later in the day is a TOUCH — the simulator re-attempts the trade per touch. Filters are yes/no conditions a candidate must pass before entry; stops and targets come from the config.' },
      ],
    },
    {
      kind: 'table',
      heading: 'THE 18 FILTERS — REAL RULES FROM neutral_candle.py',
      headers: ['ID', 'NAME', 'RULE'],
      rows: [
        ['1', 'Breakout Strength', { text: 'breakout body > 10 ticks', tone: 'key' }],
        ['3', 'Trend Alignment', 'neutral close > SMA(20)'],
        ['4', 'Time Filter', '10:00 AM – 12:00 PM only'],
        ['5', 'Volume Filter', { text: 'breakout volume > 1.5 × average volume', tone: 'key' }],
        ['8', 'Strict Ratio', { text: 'neutral / breakout body ratio < 0.40', tone: 'key' }],
        ['9', 'Smart Stop', 'stop = zone height + 5 ticks (dynamic)'],
        ['10', 'HTF Breakout', 'combined multi-bar breakout body logic'],
        ['11', 'VWAP Trend', 'neutral close > VWAP'],
        ['12', 'Dynamic VWAP', 'target = progressive VWAP line'],
        ['13', 'Vol Confirmation', 'breakout volume > neutral volume'],
        ['15', 'Distance Confirm', 'entry only after price moves 30+ ticks away'],
        ['16', 'Vol Ratio', 'neutral efficiency / breakout efficiency'],
        ['17', 'Volume Surge', { text: 'breakout volume / neutral volume > 1.25', tone: 'key' }],
        ['18', 'Hybrid', 'combines 17 (surge) + 16 (ratio)'],
        ['19', 'Stop Protection', 'stop = zone + 12 ticks (safety override)'],
        ['20', 'VPOC Filter', 'VPOC must be inside the zone'],
        ['21', 'Vol ROC Allocation', 'volume acceleration > 0 and ROC > 0.3'],
      ],
    },
    {
      kind: 'text',
      heading: 'READING A FILTER SET',
      paras: [
        { text: 'A config like {8, 1, 3, 5} means: breakout body > 10 ticks (1) AND neutral/breakout ratio < 0.40 (8) AND neutral close above SMA(20) (3) AND breakout volume > 1.5× average (5) — all must pass before the entry fires.' },
      ],
    },
    {
      kind: 'bullets',
      heading: 'GRID SEARCH ENGINE',
      items: [
        { text: 'Tests all combinations of enabled filters × entry modes × target/stop pairs × slippage assumptions', mark: 'none' },
        { text: 'Evaluates by win rate, total PnL, recovery factor, EV per trade', mark: 'none' },
        { text: 'Fast path: pre-computes 0–500 tick outcomes for O(1) lookup during simulation', mark: 'none' },
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

const recoveryDist = [
  { bucket: '< -1', configs: 3251 },
  { bucket: '-1..0', configs: 1480 },
  { bucket: '0..1', configs: 35 },
  { bucket: '1..2', configs: 7 },
  { bucket: '> 2', configs: 2 },
]

export const bestCombos: DocContent = {
  path: '// results/best-combos',
  title: 'GRID SEARCH VERDICT',
  intro: 'The full run, and it is brutal: 4,775 configurations, 941,882 simulated trades, 44 profitable.',
  blocks: [
    {
      kind: 'text',
      heading: 'HOW TO READ THIS — WHAT THE NUMBERS MEAN',
      paras: [
        { text: 'One CONFIGURATION = a filter set + an entry mode + a target/stop pair + a slippage assumption (e.g. filters {8,1,3,5}, entry mode B, 200-tick target / 100-tick stop, 15-tick slip). The grid tests every combination and lets each one trade the same months of data.' },
        { text: 'N = how many trades that configuration actually took. WIN RATE (WR) = the fraction of those trades that hit target before stop — not a percentage of anything else. EV = average dollars per trade after slippage and commissions; negative EV means the config lost money on average. RECOVERY = total PnL / max drawdown — below zero means it never dug itself out.' },
        { text: 'The chart below counts CONFIGURATIONS per win-rate bucket: 3,617 of the 4,775 won under 40% of their trades. That bar chart is a distribution of strategies, not of trades.', tone: 'key' },
      ],
    },
    {
      kind: 'metrics',
      title: 'FULL GRID SEARCH (2026-01-13 RUN)',
      metrics: [
        { label: 'CONFIGS TESTED', value: '4,775', trend: 'neutral' },
        { label: 'TRADES', value: '941,882', trend: 'neutral' },
        { label: 'PROFITABLE', value: '44 (1%)', trend: 'down' },
        { label: 'NO-FILTER BASELINE', value: '-$90/trade', trend: 'down' },
      ],
      chart: { kind: 'bar', data: wrDistribution, xKey: 'bucket', yKey: 'configs' },
    },
    {
      kind: 'text',
      heading: 'THE ANCHOR — NO-FILTER BASELINE',
      paras: [
        { text: 'The empty filter set, traded on the same data: 1,170 trades, 28% win rate, −$90 EV, −$105,150 total. Everything else in the grid is measured against doing nothing clever. Only 44 of 4,775 attempts beat it.', tone: 'key' },
      ],
    },
    {
      kind: 'table',
      heading: 'TOP 10 BY EV WITH A SAMPLE FLOOR (N ≥ 20) — THE HONEST LEADERBOARD',
      headers: ['FILTERS', 'MODE', 'TF', 'N', 'WR', 'EV/TRADE', 'TOTAL PnL', 'RECOVERY'],
      rows: [
        [{ text: '{1, 3, 4}', tone: 'good' }, 'fixed/A', '5m', '39', '43.6%', { text: '$155.00', tone: 'good' }, { text: '$6,045', tone: 'good' }, { text: '2.89', tone: 'good' }],
        ['{1, 3, 4}', 'hybrid/A', '15m', '26', '53.8%', '$38.27', '$995', '0.67'],
        ['{1, 3, 4}', 'vwap/A', '15m', '23', '60.9%', '$29.35', '$675', '0.94'],
        ['{1, 3, 4}', 'vwap/A', '15m', '25', '52.0%', '$29.00', '$725', '0.47'],
        ['{8, 1, 11, 15}', 'fixed/A', '5m', '77', '31.2%', '$13.96', '$1,075', '0.09'],
        ['{8, 1}', 'fixed/A', '5m', '183', '32.8%', '$10.44', '$1,910', '0.13'],
        ['{16}', 'fixed/A', '5m', '45', '37.8%', '$9.00', '$405', '0.25'],
        ['{8, 1, 3, 13}', 'fixed/A', '5m', '76', '30.3%', '$3.62', '$275', '0.03'],
        ['{8, 1, 3}', 'fixed/A', '1m', '144', '34.0%', '$1.91', '$275', '0.05'],
        ['{8, 1, 3, 13}', 'fixed/A', '1m', '152', '33.6%', { text: '-$5.39', tone: 'bad' }, { text: '-$820', tone: 'bad' }, { text: '-0.10', tone: 'bad' }],
      ],
    },
    {
      kind: 'text',
      paras: [
        { text: 'The honest leaderboard\'s best ({1,3,4} on 5-min bars: breakout strength + trend alignment + time window) made $155/trade over 39 trades — but its recovery factor of 2.89 rode a $2,090 drawdown to make $6,045. The 10th row is already underwater. The leaderboard decays from $155 to negative within ten rows.', tone: 'key' },
      ],
    },
    {
      kind: 'table',
      heading: 'SLICE BY TIMEFRAME',
      headers: ['TIMEFRAME', 'CONFIGS', 'PROFITABLE', 'MAX EV'],
      rows: [
        ['1min', '1,621', '24', { text: '$372 (n=10 — tiny sample)', tone: 'warn' }],
        ['5min', '1,642', '13', '$155'],
        ['15min', '1,512', '7', '$48'],
      ],
    },
    {
      kind: 'table',
      heading: 'SLICE BY TARGET/STOP MODE',
      headers: ['TS MODE', 'PROFITABLE CONFIGS (OF 44)', 'MEDIAN WR'],
      rows: [
        ['fixed', { text: '31', tone: 'good' }, '11.4%'],
        ['vwap', '7', '15.2%'],
        ['hybrid', '3', '17.0%'],
        ['smart', '3', '7.7%'],
      ],
    },
    {
      kind: 'metrics',
      title: 'RECOVERY FACTOR DISTRIBUTION (HOW MANY CONFIGS EVER DUG OUT)',
      metrics: [
        { label: 'NEVER RECOVERED', value: '4,731', trend: 'down' },
        { label: 'RF > 1', value: '9', trend: 'up' },
        { label: 'RF > 2', value: '2', trend: 'up' },
        { label: 'BASELINE RF', value: '-0.94', trend: 'down' },
      ],
      chart: { kind: 'bar', data: recoveryDist, xKey: 'bucket', yKey: 'configs' },
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
        { text: 'Simple 2-3 filter sets ({1,3,4}, {8,1}) beat the elaborate 4-filter sets once a sample floor is applied', mark: 'check' },
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
