// vpoc project content — migrated from components/windows/ProjectVPOC.tsx.

import type { DocContent } from '../../../DocFile'

export const readme: DocContent = {
  path: '// overview/README.md',
  title: 'VPOC TOUCH ANALYSIS',
  intro: 'Does price react when it returns to a prior session’s Volume Point of Control?',
  blocks: [
    {
      kind: 'text',
      paras: [
        { text: 'VPOC (Volume Point of Control): The price level where the most volume traded during a session. Represents "fair value" for that period.', tone: 'key' },
        { text: 'The Hypothesis: When price returns to a prior day’s VPOC level, it should react — either bouncing off (support/resistance) or accelerating through (breakout).' },
        { text: 'Status: Legacy project — insights incorporated into Zone Classifier.', tone: 'warn' },
      ],
    },
    {
      kind: 'stats',
      items: [
        { label: 'INSTRUMENT', value: 'SPY / ES Futures' },
        { label: 'DATA PERIOD', value: '2023-2024' },
        { label: 'SAMPLE SIZE', value: '~100 VPOC levels' },
      ],
    },
    {
      kind: 'text',
      heading: 'LIMITATIONS DISCOVERED',
      paras: [
        { text: 'VPOC touch analysis showed marginal edge (~52% win rate). Shifted focus from "will price react at THIS level?" to "what REGIME is the market in?" — which became Zone Classifier.', tone: 'warn' },
      ],
    },
  ],
}

export const findings: DocContent = {
  path: '// overview/FINDINGS.md',
  title: 'FINDINGS',
  intro: 'Why single-level analysis evolved into regime classification.',
  blocks: [
    {
      kind: 'text',
      heading: 'EVOLUTION INTO ZONE CLASSIFIER',
      paras: [
        { text: 'Problem with VPOC: Too specific. Single level analysis misses broader market context.', tone: 'key' },
        { text: 'Insight: Instead of asking "will price react at VPOC?", ask "is market in consolidation or breakout mode?"' },
        { text: 'Result: Zone Classifier classifies market regimes using volume patterns, range dynamics, and candle bodies — not just single price levels.', tone: 'good' },
      ],
    },
  ],
}

export const methodology: DocContent = {
  path: '// method/METHODOLOGY.md',
  title: 'METHODOLOGY',
  intro: 'The exact mechanics from vpoc_analysis.py — how a touch became a measurable trade.',
  blocks: [
    {
      kind: 'formula',
      heading: 'STEP 1 — VPOC, AT EXACT TRADE-PRICE GRANULARITY',
      formulas: ['VPOC(day) = argmax_price  Σ size  at that exact price'],
      notes: [
        { text: 'Not binned, not approximated: every print is summed at its exact price, and the day\'s VPOC is the single price with the most traded volume. (The workspace explorer shows a 60-bin profile for readability; the research used exact prices.)' },
      ],
    },
    {
      kind: 'formula',
      heading: 'STEP 2 — TOUCH DETECTION ON THE NEXT DAY',
      formulas: [
        'touch   = |price(day N+1) − VPOC(day N)| ≤ 2 ticks',
        'entry   = first qualifying print',
        'limit   = outcomes walked over the next 50,000 prints (~5 minutes)',
      ],
    },
    {
      kind: 'formula',
      heading: 'STEP 3 — DIRECTION: REVERSAL OPPOSITE THE APPROACH',
      formulas: ['direction = −sign(price 10 prints before touch − entry price)'],
      notes: [
        { text: 'Price approached the level from above → expect a bounce UP (sellers exhausted into prior value); approached from below → expect a bounce DOWN. The approach, not the level, sets the trade.' },
      ],
    },
    {
      kind: 'text',
      heading: 'STEP 4 — THE 16-COMBINATION OUTCOME GRID',
      paras: [
        { text: 'Every touch was evaluated against targets {10, 20, 30, 50} ticks × stops {5, 10, 15, 20} ticks — 16 trades per touch, each walked print-by-print to whichever level hit first. Roughly 100 touches produced the full grid.' },
      ],
    },
    {
      kind: 'formula',
      heading: 'EV PER COMBINATION',
      formulas: ['EV = wr × target × $5 − (1 − wr) × stop × $5 − $5 commission'],
      notes: [
        { text: '$5 = one NQ tick. The flat $5 commission is charged per round trip — the reason marginal configurations die even at positive gross expectancy.', tone: 'warn' },
      ],
    },
    {
      kind: 'bullets',
      heading: 'WHY THIS DESIGN',
      items: [
        { text: 'Prior-day VPOC is known before the session opens — no look-ahead in the level itself', mark: 'check' },
        { text: 'First-touch-only avoids double-counting one visit as many signals', mark: 'check' },
        { text: 'Path-walking to target/stop mirrors real fills better than fixed-horizon returns', mark: 'check' },
        { text: 'The full 16-combo grid pre-empts "you just picked a lucky target" — the marginal results across the grid were the finding', mark: 'none' },
      ],
    },
  ],
}

const reactionStats = [
  { type: 'Bounce', count: 45 },
  { type: 'Piercing', count: 28 },
  { type: 'Breakdown', count: 27 },
]

export const touchAnalysis: DocContent = {
  path: '// results/touch-analysis',
  title: 'TOUCH ANALYSIS',
  intro: 'How price behaved at prior-session VPOC levels.',
  blocks: [
    {
      kind: 'metrics',
      title: 'REACTION TYPE DISTRIBUTION',
      metrics: [
        { label: 'BOUNCE', value: '45', trend: 'up' },
        { label: 'BOUNCE WIN %', value: '58%', trend: 'up' },
        { label: 'BREAKDOWN', value: '27', trend: 'down' },
        { label: 'OVERALL EDGE', value: '+2.1%', trend: 'up' },
      ],
      chart: { kind: 'bar', data: reactionStats, xKey: 'type', yKey: 'count' },
    },
    {
      kind: 'text',
      paras: [
        { text: 'Bounces were the modal reaction, but the edge over coin-flip was marginal — not enough to trade alone.', tone: 'warn' },
      ],
    },
    {
      kind: 'text',
      heading: 'WHY +2.1% IS LIKELY NOISE',
      paras: [
        { text: '58% win rate over 45 bounces is ~26 of 45. The 95% confidence interval on that spans roughly 43%–72% — a coin flip lives comfortably inside it. Add spread + slippage (the reality-check formulas in TERMS.md) and the +2.1% evaporates before the order fills. This is why VPOC-touch became an input to regime classification instead of a strategy.', tone: 'key' },
      ],
    },
  ],
}
