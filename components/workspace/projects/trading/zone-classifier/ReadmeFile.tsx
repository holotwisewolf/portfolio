'use client'

import { useMemo, useState } from 'react'
import TradingLineChart from '@/components/charts/TradingLineChart'
import TradingMetricsCard from '@/components/charts/TradingMetricsCard'
import { generateBacktestData, defaultSettings } from './data'

export default function ReadmeFile() {
  const [settings] = useState(defaultSettings)
  const backtestData = useMemo(() => generateBacktestData(settings), [settings])

  return (
    <div className="p-6 space-y-3 max-w-[1100px]">
      <div className="text-[9px] tracking-[0.3em] text-[#444]">// README.md</div>
      <h1 className="text-[26px] tracking-[0.15em] text-white">ZONE CLASSIFIER</h1>
      <p className="text-[12px] text-gray-400 leading-relaxed max-w-[600px]">
        Market regime classification using symbolic regression. Three zones, one formula, zero black boxes.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-0 border-t border-l border-[#1c2e1c]">
        <div className="border-r border-b border-[#1c2e1c] p-3">
          <div className="text-[9px] tracking-[0.25em] text-[#444] mb-1">RESEARCH GOAL</div>
          <div className="text-[11px] text-gray-300">Discover interpretable entry signals without black-box models</div>
        </div>
        <div className="border-r border-b border-[#1c2e1c] p-3">
          <div className="text-[9px] tracking-[0.25em] text-[#444] mb-1">METHOD</div>
          <div className="text-[11px] text-gray-300">Symbolic regression + walk-forward validation</div>
        </div>
        <div className="border-r border-b border-[#1c2e1c] p-3">
          <div className="text-[9px] tracking-[0.25em] text-[#444] mb-1">STATUS</div>
          <div className="text-[11px] text-[#00ff9d]">Production API deployed</div>
        </div>
      </div>

      <div className="border border-[#1c2e1c] p-3">
        <div className="text-[9px] tracking-[0.3em] text-[#444] mb-2">THE PROBLEM</div>
        <div className="space-y-2 text-[11px] text-gray-400 leading-relaxed">
          <p>Most trading strategies fail because they're overfit to historical data. Black-box ML models may achieve high backtest Sharpe ratios but collapse in live trading when market regimes shift.</p>
          <p className="text-white"><span className="text-[#00ff9d]">[!]</span> You can't debug what you can't understand.</p>
        </div>
      </div>

      <div className="border border-[#1c2e1c] p-3">
        <div className="text-[9px] tracking-[0.3em] text-[#444] mb-2">THE SOLUTION</div>
        <div className="space-y-2 text-[11px] text-gray-400 leading-relaxed">
          <p><span className="text-[#00ff9d]">Symbolic Regression</span> — Genetic programming evolves human-readable formulas.</p>
          <p><span className="text-[#00ff9d]">Zone Classification</span> — 3 regimes: Neutral (wait), Consolidation (avoid), Breakout (enter).</p>
          <p><span className="text-[#00ff9d]">Walk-Forward Validation</span> — Rolling backtest simulates real deployment.</p>
        </div>
      </div>

      <TradingMetricsCard
        title="CURRENT PERFORMANCE"
        metrics={[
          { label: 'TOTAL RETURN', value: backtestData.metrics['Total Return'], trend: parseFloat(backtestData.metrics['Total Return']) > 0 ? 'up' : 'down' },
          { label: 'WIN RATE', value: backtestData.metrics['Win Rate'], trend: parseFloat(backtestData.metrics['Win Rate']) > 50 ? 'up' : 'down' },
          { label: 'SHARPE', value: backtestData.metrics['Sharpe Ratio'], trend: parseFloat(backtestData.metrics['Sharpe Ratio']) > 1 ? 'up' : 'neutral' },
          { label: 'MAX DD', value: backtestData.metrics['Max Drawdown'], trend: 'neutral' },
        ]}
      >
        <TradingLineChart
          data={backtestData.data}
          xKey="day"
          yKey="equity"
          area
          color="#00cc77"
          height={180}
        />
      </TradingMetricsCard>
    </div>
  )
}
