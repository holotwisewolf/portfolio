'use client'

import { useMemo, useState } from 'react'
import AnimatedLineChart from '@/components/charts/AnimatedLineChart'
import TradingMetricsCard from '@/components/charts/TradingMetricsCard'
import { generateBacktestData, defaultSettings } from '../data'

export default function ResultsEquityCurveFile() {
  const [settings] = useState(defaultSettings)
  const backtestData = useMemo(() => generateBacktestData(settings), [settings])

  return (
    <div className="p-6 space-y-3 max-w-[1200px]">
      <div className="text-[9px] tracking-[0.3em] text-[#444]">// results/equity-curve</div>
      <h1 className="text-[26px] tracking-[0.15em] text-white">EQUITY CURVE</h1>
      <p className="text-[11px] text-gray-500 leading-relaxed max-w-[600px]">
        90-day rolling backtest equity progression. Walk-forward validated to prevent overfitting.
      </p>

      <TradingMetricsCard
        title="PERFORMANCE METRICS"
        metrics={[
          { label: 'FINAL EQUITY', value: backtestData.metrics['Final Equity'], trend: 'up' },
          { label: 'TOTAL RETURN', value: backtestData.metrics['Total Return'], trend: parseFloat(backtestData.metrics['Total Return']) > 0 ? 'up' : 'down' },
          { label: 'WIN RATE', value: backtestData.metrics['Win Rate'] },
          { label: 'SHARPE', value: backtestData.metrics['Sharpe Ratio'] },
        ]}
      >
        <AnimatedLineChart
          data={backtestData.data}
          xKey="day"
          yKey="equity"
          color="#00cc77"
        />
      </TradingMetricsCard>
    </div>
  )
}
