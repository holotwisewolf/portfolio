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
  title: 'THEORY',
  intro: 'The market-microstructure reasoning behind VPOC levels.',
  blocks: [
    {
      kind: 'text',
      heading: 'FAIR VALUE',
      paras: [
        { text: 'VPOC represents the price where most market participants agreed on value during a session.' },
        { text: 'Markets remember these levels. When price returns, participants reassess (memory effect).' },
      ],
    },
    {
      kind: 'bullets',
      heading: 'EXPECTED BEHAVIORS',
      items: [
        { text: 'Price approaches VPOC → consolidation, testing the level', mark: 'none' },
        { text: 'If VPOC holds → reversal (bounce) in opposite direction', mark: 'check' },
        { text: 'If VPOC breaks → accelerated move in breakout direction', mark: 'cross' },
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
  ],
}
