'use client'

// Real labeled-zone distribution + HMM-measured regime shares for comparison.
// Both are measured, not generated: labels from my_zone_labels/zone_features,
// HMM numbers from the 2026-08-21 re-run on NQH5 March 2025.

import TradingBarChart from '@/components/charts/TradingBarChart'
import TradingMetricsCard from '@/components/charts/TradingMetricsCard'

const labeledZones = [
  { zone: 'Neutral', count: 10 },
  { zone: 'Consolidation', count: 5 },
  { zone: 'Breakout', count: 10 },
]

const hmmRegimes = [
  { zone: 'Consolidation', pct: 49.0 },
  { zone: 'Trending', pct: 23.2 },
  { zone: 'Neutral', pct: 16.9 },
  { zone: 'Breakout', pct: 10.9 },
]

export default function ResultsZoneDistributionFile() {
  return (
    <div className="p-6 space-y-3 max-w-[1200px]">
      <div className="text-[9px] tracking-[0.3em] text-[#444]">// results/zone-distribution</div>
      <h1 className="text-[26px] tracking-[0.15em] text-white">ZONE DISTRIBUTION</h1>
      <p className="text-[11px] text-gray-500 leading-relaxed max-w-[600px]">
        Two measured views: the hand-labeled training set, and what an unsupervised HMM
        sees across a full month of 15-minute bars.
      </p>

      <TradingMetricsCard
        title="HAND-LABELED TRAINING SET (25 ZONES)"
        metrics={[
          { label: 'NEUTRAL', value: '10', trend: 'neutral' },
          { label: 'CONSOLIDATION', value: '5', trend: 'neutral' },
          { label: 'BREAKOUT', value: '10', trend: 'up' },
          { label: 'SAMPLE', value: '25 zones', trend: 'neutral' },
        ]}
      >
        <TradingBarChart data={labeledZones} xKey="zone" yKey="count" height={180} />
      </TradingMetricsCard>

      <TradingMetricsCard
        title="HMM-MEASURED REGIMES — NQH5 MARCH 2025 (1,331 BARS)"
        metrics={[
          { label: 'CONSOLIDATION', value: '49.0%', trend: 'neutral' },
          { label: 'TRENDING', value: '23.2%', trend: 'neutral' },
          { label: 'NEUTRAL', value: '16.9%', trend: 'neutral' },
          { label: 'BREAKOUT', value: '10.9%', trend: 'up' },
        ]}
      >
        <TradingBarChart data={hmmRegimes} xKey="zone" yKey="pct" height={180} />
      </TradingMetricsCard>

      <div className="border border-[#1c2e1c] bg-black p-4 space-y-2">
        <div className="text-[10px] tracking-[0.2em] text-[#00ff9d]">WHY THEY DISAGREE</div>
        <p className="text-[11px] text-gray-400 leading-relaxed">
          The labels are balanced on purpose — breakout zones were deliberately over-sampled
          because they are rare and carry the trading value. The HMM shows the honest base rate:
          real breakouts are ~11% of bars. A classifier trained on the balanced set must be
          re-calibrated against this base rate before its probabilities mean anything for sizing.
        </p>
        <p className="text-[10px] text-[#444]">
          Sources: zone_features.csv (25 zones) and the hmm project&apos;s 2026-08-21 re-run.
        </p>
      </div>
    </div>
  )
}
