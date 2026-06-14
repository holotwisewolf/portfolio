'use client'

import { useMemo, useState } from 'react'
import TradingBarChart from '@/components/charts/TradingBarChart'
import TradingMetricsCard from '@/components/charts/TradingMetricsCard'
import { generateFeatureImportance, defaultSettings } from '../data'

export default function ResultsFeatureImportanceFile() {
  const [settings] = useState(defaultSettings)
  const featureImportance = useMemo(() => generateFeatureImportance(settings), [settings])

  return (
    <div className="p-6 space-y-3 max-w-[1200px]">
      <div className="text-[9px] tracking-[0.3em] text-[#444]">// results/feature-importance</div>
      <h1 className="text-[26px] tracking-[0.15em] text-white">FEATURE IMPORTANCE</h1>
      <p className="text-[11px] text-gray-500 leading-relaxed max-w-[600px]">
        Which of the 68 features actually drove the final formula. The top 4 captured most of the signal.
      </p>

      <TradingMetricsCard
        title="TOP CONTRIBUTORS"
        metrics={[
          { label: 'TOP FEATURE', value: featureImportance[0].name, trend: 'up' },
          { label: 'FEATURES USED', value: '6', trend: 'neutral' },
          { label: 'MODEL ACC', value: '74.2%', trend: 'up' },
          { label: 'COMPLEXITY', value: 'Low', trend: 'neutral' },
        ]}
      >
        <TradingBarChart
          data={featureImportance}
          xKey="name"
          yKey="importance"
          horizontal
          height={240}
          formatTooltip={(value: any) => ['', `${value}%`]}
        />
      </TradingMetricsCard>
    </div>
  )
}
