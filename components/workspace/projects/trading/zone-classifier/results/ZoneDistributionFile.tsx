'use client'

import { useMemo, useState } from 'react'
import TradingBarChart from '@/components/charts/TradingBarChart'
import TradingMetricsCard from '@/components/charts/TradingMetricsCard'
import { generateZoneDistribution, defaultSettings } from '../data'

export default function ResultsZoneDistributionFile() {
  const [settings] = useState(defaultSettings)
  const zoneDistribution = useMemo(() => generateZoneDistribution(settings), [settings])

  return (
    <div className="p-6 space-y-3 max-w-[1200px]">
      <div className="text-[9px] tracking-[0.3em] text-[#444]">// results/zone-distribution</div>
      <h1 className="text-[26px] tracking-[0.15em] text-white">ZONE DISTRIBUTION</h1>
      <p className="text-[11px] text-gray-500 leading-relaxed max-w-[600px]">
        How often each zone regime occurs across the backtest period. Breakouts are rare but high-value.
      </p>

      <TradingMetricsCard
        title="DISTRIBUTION"
        metrics={[
          { label: 'NEUTRAL', value: `${zoneDistribution[0].count}%`, trend: 'neutral' },
          { label: 'CONSOLIDATION', value: `${zoneDistribution[1].count}%`, trend: 'neutral' },
          { label: 'BREAKOUT', value: `${zoneDistribution[2].count}%`, trend: 'up' },
          { label: 'TOTAL', value: '100 days' },
        ]}
      >
        <TradingBarChart data={zoneDistribution} xKey="zone" yKey="count" height={220} />
      </TradingMetricsCard>
    </div>
  )
}
