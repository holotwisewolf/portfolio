// orderflow-visualizer project content — migrated from components/windows/ProjectOrderflowViz.tsx.

import type { DocContent } from '../../../DocFile'

export const readme: DocContent = {
  path: '// overview/README.md',
  title: 'ORDERFLOW DATA VISUALIZER',
  intro: 'A diagnostic tool for tick-data quality — what the feed contains before you trust it.',
  blocks: [
    {
      kind: 'text',
      paras: [
        { text: 'Purpose: Diagnostic tool for comparing raw tick data against ideal MBP-1 orderbook reconstruction.', tone: 'key' },
        { text: 'Problem: Tick data quality varies by venue. Some feeds include best bid/ask, others don’t.' },
        { text: 'Solution: Visualizer shows what information is available and detects data quality issues.', tone: 'good' },
      ],
    },
    {
      kind: 'bullets',
      heading: 'FEATURES',
      items: [
        { text: 'Tick-by-tick price visualization', mark: 'none' },
        { text: 'Simulated orderbook generation', mark: 'none' },
        { text: 'Bid/ask spread analysis', mark: 'none' },
        { text: 'Data quality metrics', mark: 'none' },
        { text: 'Gap detection', mark: 'none' },
      ],
    },
    {
      kind: 'bullets',
      heading: 'USE CASES',
      items: [
        { text: 'Verify data feed quality before backtesting', mark: 'none' },
        { text: 'Understand venue-specific tick formats', mark: 'none' },
        { text: 'Debug orderflow analysis issues', mark: 'none' },
      ],
    },
    {
      kind: 'text',
      heading: 'EXAMPLE — DETECTING MISSING BID/ASK DATA',
      paras: [
        { text: 'If the visualizer shows no spread information, the data feed doesn’t include NBBO (National Best Bid/Offer).' },
      ],
    },
  ],
}

const qualityScore = [
  { period: 'Q1', score: 92 },
  { period: 'Q2', score: 95 },
  { period: 'Q3', score: 94 },
  { period: 'Q4', score: 98 },
]

const issueDist = [
  { issue: 'Missing B/A', count: 12 },
  { issue: 'Gaps', count: 2 },
  { issue: 'Duplicates', count: 0 },
]

export const dataQuality: DocContent = {
  path: '// results/data-quality',
  title: 'DATA QUALITY',
  intro: 'Feed audit results across the sample period.',
  blocks: [
    {
      kind: 'metrics',
      title: 'QUALITY METRICS',
      metrics: [
        { label: 'COMPLETENESS', value: '98%', trend: 'up' },
        { label: 'BID/ASK PRESENT', value: '95%', trend: 'up' },
        { label: 'GAPS DETECTED', value: '2', trend: 'down' },
        { label: 'DUPLICATE TICKS', value: '0', trend: 'up' },
      ],
      chart: { kind: 'line', data: qualityScore, xKey: 'period', yKey: 'score', area: true },
    },
    {
      kind: 'metrics',
      title: 'ISSUE DISTRIBUTION',
      metrics: [
        { label: 'TOP ISSUE', value: 'Missing B/A', trend: 'neutral' },
        { label: 'OCCURRENCES', value: '12', trend: 'down' },
      ],
      chart: { kind: 'bar', data: issueDist, xKey: 'issue', yKey: 'count' },
    },
    {
      kind: 'bullets',
      heading: 'RECOMMENDATIONS',
      items: [
        { text: 'Data feed includes bid/ask — suitable for orderflow analysis', mark: 'check' },
        { text: '2 gaps detected — check for market hours or data provider issues', mark: 'none' },
        { text: 'No duplicate ticks — timestamp integrity is good', mark: 'check' },
      ],
    },
  ],
}
