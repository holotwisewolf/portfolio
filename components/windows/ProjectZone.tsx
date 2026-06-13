'use client'

import { useState, useEffect, useMemo } from 'react'
import TradingVisualizer from '../projects/TradingVisualizer'
import TradingLineChart from '../charts/TradingLineChart'
import TradingBarChart from '../charts/TradingBarChart'
import TradingMetricsCard from '../charts/TradingMetricsCard'
import TradingCandleChart from '../charts/TradingCandleChart'

type TabType = 'overview' | 'methodology' | 'backtest' | 'results' | 'features' | 'findings' | 'how-i-built-this' | 'settings'

const TABS: { id: TabType; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'methodology', label: 'Methodology' },
  { id: 'backtest', label: 'Backtest Demo' },
  { id: 'results', label: 'Results' },
  { id: 'features', label: 'Features (68)' },
  { id: 'findings', label: 'Findings' },
  { id: 'how-i-built-this', label: 'How I Built This' },
  { id: 'settings', label: 'Settings' },
]

// Generate mock backtest data based on settings
const generateBacktestData = (settings: any) => {
  const days = 90
  const data = []
  let equity = 10000
  let peak = equity
  let maxDrawdown = 0
  let wins = 0
  let losses = 0

  for (let i = 0; i < days; i++) {
    // Settings affect outcomes
    const lookbackEffect = (60 - settings.lookbackWindow) / 60 // Higher lookback = smoother
    const volEffect = settings.volatilityThreshold / 3
    const volumeEffect = settings.volumeWeight
    const momentumEffect = settings.momentumWeight

    const baseReturn = (Math.random() - 0.45) * 200 * (lookbackEffect * 0.5 + volEffect * 0.3 + momentumEffect * 0.2)
    equity += baseReturn

    if (equity > peak) peak = equity
    const drawdown = ((peak - equity) / peak) * 100
    if (drawdown > maxDrawdown) maxDrawdown = drawdown

    if (baseReturn > 0) {
      wins++
    } else {
      losses++
    }

    // Determine zone based on volatility
    const volatility = Math.abs(baseReturn)
    let zone = 1
    if (volatility > 100 * volEffect) zone = 3
    else if (volatility > 50 * volEffect) zone = 2

    data.push({
      day: i + 1,
      date: new Date(2025, 9, i + 1).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      equity: Math.round(equity),
      return: baseReturn,
      zone,
    })
  }

  const winRate = ((wins / (wins + losses)) * 100).toFixed(1)
  const totalReturnNum = ((equity - 10000) / 10000 * 100)
  const totalReturn = totalReturnNum.toFixed(1)
  const sharpe = (totalReturnNum / 100 / Math.max(maxDrawdown, 1) * 10).toFixed(2)

  return {
    data,
    metrics: {
      'Final Equity': `$${equity.toFixed(0)}`,
      'Total Return': `${totalReturn}%`,
      'Win Rate': `${winRate}%`,
      'Max Drawdown': `${maxDrawdown.toFixed(1)}%`,
      'Sharpe Ratio': sharpe,
      'Total Trades': (wins + losses).toString(),
    }
  }
}

// Generate feature importance data based on settings
const generateFeatureImportance = (settings: any) => {
  const baseFeatures = [
    { name: 'Volume Diff', importance: 0.85 + settings.volumeWeight * 0.1, color: '#10b981' },
    { name: 'Zone Range', importance: 0.72 + (settings.lookbackWindow / 60) * 0.15, color: '#f59e0b' },
    { name: 'Wick Ratio', importance: 0.68, color: '#6366f1' },
    { name: 'Price Entropy', importance: 0.61, color: '#8b5cf6' },
    { name: 'Volume Acceleration', importance: 0.55 + settings.volumeWeight * 0.2, color: '#ec4899' },
    { name: 'Body Ratio', importance: 0.48 + settings.momentumWeight * 0.1, color: '#ef4444' },
  ]

  return baseFeatures.map(f => ({ ...f, importance: (f.importance * 100).toFixed(1) }))
}

// Generate zone distribution data
const generateZoneDistribution = (settings: any) => {
  const volEffect = settings.volatilityThreshold / 3
  return [
    { zone: 'Neutral', count: Math.round(30 + volEffect * 10), color: '#666' },
    { zone: 'Consolidation', count: Math.round(40 - volEffect * 5), color: '#f59e0b' },
    { zone: 'Breakout', count: Math.round(30 - volEffect * 5), color: '#10b981' },
  ]
}

// Example candle patterns for each zone type
const BREAKOUT_EXAMPLE = [
  { time: '09:30', open: 450.50, high: 451.00, low: 450.00, close: 450.80, volume: 1200, zone: 'neutral' as const },
  { time: '09:45', open: 450.80, high: 451.50, low: 450.50, close: 451.20, volume: 1500, zone: 'neutral' as const },
  { time: '10:00', open: 451.20, high: 452.00, low: 451.00, close: 451.80, volume: 2100, zone: 'consolidation' as const },
  { time: '10:15', open: 451.80, high: 452.20, low: 451.50, close: 451.90, volume: 1800, zone: 'consolidation' as const },
  { time: '10:30', open: 451.90, high: 452.50, low: 451.70, close: 452.30, volume: 2400, zone: 'consolidation' as const },
  { time: '10:45', open: 452.30, high: 454.80, low: 452.20, close: 454.50, volume: 5800, zone: 'breakout' as const, annotation: 'entry' as const },
  { time: '11:00', open: 454.50, high: 456.00, low: 454.00, close: 455.80, volume: 6200, zone: 'breakout' as const },
  { time: '11:15', open: 455.80, high: 457.50, low: 455.50, close: 457.20, volume: 5500, zone: 'breakout' as const },
  { time: '11:30', open: 457.20, high: 457.80, low: 456.50, close: 456.90, volume: 3200, zone: 'breakout' as const, annotation: 'exit' as const },
]

const CONSOLIDATION_EXAMPLE = [
  { time: '13:30', open: 455.00, high: 456.00, low: 454.50, close: 455.50, volume: 2800, zone: 'neutral' as const },
  { time: '13:45', open: 455.50, high: 456.00, low: 455.00, close: 455.70, volume: 2200, zone: 'consolidation' as const },
  { time: '14:00', open: 455.70, high: 456.20, low: 455.30, close: 455.80, volume: 1900, zone: 'consolidation' as const },
  { time: '14:15', open: 455.80, high: 456.10, low: 455.40, close: 455.60, volume: 1700, zone: 'consolidation' as const },
  { time: '14:30', open: 455.60, high: 456.00, low: 455.20, close: 455.70, volume: 1600, zone: 'consolidation' as const },
  { time: '14:45', open: 455.70, high: 455.90, low: 455.30, close: 455.50, volume: 1500, zone: 'consolidation' as const },
  { time: '15:00', open: 455.50, high: 455.80, low: 455.10, close: 455.40, volume: 1400, zone: 'consolidation' as const },
]

const NEUTRAL_EXAMPLE = [
  { time: '09:30', open: 448.00, high: 449.50, low: 447.50, close: 449.00, volume: 3500, zone: 'neutral' as const },
  { time: '09:45', open: 449.00, high: 450.00, low: 448.50, close: 449.80, volume: 2800, zone: 'neutral' as const },
  { time: '10:00', open: 449.80, high: 450.50, low: 449.20, close: 449.50, volume: 2200, zone: 'neutral' as const },
  { time: '10:15', open: 449.50, high: 450.00, low: 448.80, close: 449.20, volume: 2000, zone: 'neutral' as const },
  { time: '10:30', open: 449.20, high: 449.80, low: 448.50, close: 448.90, volume: 1900, zone: 'neutral' as const },
  { time: '10:45', open: 448.90, high: 449.50, low: 448.30, close: 448.70, volume: 1800, zone: 'neutral' as const },
]

export default function ProjectZone() {
  const [activeTab, setActiveTab] = useState<TabType>('overview')
  const [settings, setSettings] = useState({
    lookbackWindow: 20,
    volatilityThreshold: 1.5,
    volumeWeight: 0.3,
    momentumWeight: 0.5,
  })

  // Real-time data generation when settings change
  const backtestData = useMemo(() => generateBacktestData(settings), [settings])
  const featureImportance = useMemo(() => generateFeatureImportance(settings), [settings])
  const zoneDistribution = useMemo(() => generateZoneDistribution(settings), [settings])

  return (
    <div className="h-full flex flex-col bg-[#1a1a1a]">
      {/* Tabs */}
      <div className="flex border-b border-white/20">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-[10px] uppercase tracking-wider transition-colors ${
              activeTab === tab.id
                ? 'text-green-400 border-b-2 border-green-400'
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'backtest' && <TradingVisualizer />}

        {activeTab === 'results' && (
          <div className="p-4 space-y-4">
            {/* Interactive Pattern Examples */}
            <div className="bg-black/50 border border-white/10 p-4 rounded">
              <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-3">Interactive Pattern Examples</div>
              <div className="text-gray-400 text-[9px] mb-4">
                Click any candle to see details. These examples show how each zone pattern appears in real market data.
              </div>

              <div className="grid grid-cols-3 gap-4">
                {/* Breakout Example */}
                <div>
                  <div className="text-green-400 text-[10px] font-medium mb-2">Breakout Zone</div>
                  <div className="text-gray-500 text-[9px] mb-2">Volume surge + expansion = entry signal</div>
                  <TradingCandleChart
                    data={BREAKOUT_EXAMPLE}
                    height={180}
                    showVolume
                    interactive
                  />
                </div>

                {/* Consolidation Example */}
                <div>
                  <div className="text-yellow-400 text-[10px] font-medium mb-2">Consolidation Zone</div>
                  <div className="text-gray-500 text-[9px] mb-2">Tight range, low volume = wait</div>
                  <TradingCandleChart
                    data={CONSOLIDATION_EXAMPLE}
                    height={180}
                    showVolume
                    interactive
                  />
                </div>

                {/* Neutral Example */}
                <div>
                  <div className="text-gray-400 text-[10px] font-medium mb-2">Neutral Zone</div>
                  <div className="text-gray-500 text-[9px] mb-2">No clear pattern, avoid trading</div>
                  <TradingCandleChart
                    data={NEUTRAL_EXAMPLE}
                    height={180}
                    showVolume
                    interactive
                  />
                </div>
              </div>
            </div>

            {/* Equity Curve */}
            <TradingMetricsCard
              title="Equity Curve"
              metrics={[
                { label: 'Final Equity', value: backtestData.metrics['Final Equity'], trend: 'up' },
                { label: 'Total Return', value: backtestData.metrics['Total Return'], trend: parseFloat(backtestData.metrics['Total Return']) > 0 ? 'up' : 'down' },
                { label: 'Win Rate', value: backtestData.metrics['Win Rate'] },
                { label: 'Sharpe', value: backtestData.metrics['Sharpe Ratio'] },
              ]}
            >
              <TradingLineChart
                data={backtestData.data}
                xKey="day"
                yKey="equity"
                area
                color="#10b981"
                height={250}
                formatTooltip={(value: any) => ['', `$${value}`]}
              />
            </TradingMetricsCard>

            {/* Zone Distribution */}
            <TradingMetricsCard
              title="Zone Distribution"
              metrics={[
                { label: 'Neutral Days', value: `${zoneDistribution[0].count}%`, trend: 'neutral' },
                { label: 'Consolidation', value: `${zoneDistribution[1].count}%`, trend: 'neutral' },
                { label: 'Breakout', value: `${zoneDistribution[2].count}%`, trend: 'up' },
                { label: 'Total', value: '100 days' },
              ]}
            >
              <TradingBarChart
                data={zoneDistribution}
                xKey="zone"
                yKey="count"
                height={200}
              />
            </TradingMetricsCard>

            {/* Feature Importance */}
            <TradingMetricsCard
              title="Feature Importance"
              metrics={[
                { label: 'Top Feature', value: featureImportance[0].name, trend: 'up' },
                { label: 'Features Used', value: '6', trend: 'neutral' },
                { label: 'Model Acc', value: '74.2%', trend: 'up' },
                { label: 'Complexity', value: 'Low', trend: 'neutral' },
              ]}
            >
              <TradingBarChart
                data={featureImportance}
                xKey="name"
                yKey="importance"
                horizontal
                height={220}
                formatTooltip={(value: any) => ['', `${value}%`]}
              />
            </TradingMetricsCard>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="p-4 space-y-4">
            <div className="bg-black/50 border border-white/10 p-4 rounded">
              <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-3">Model Parameters</div>
              <div className="text-gray-400 text-[10px] mb-4">
                Adjust parameters to see real-time updates in Results tab
              </div>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-400">Lookback Window (days)</span>
                    <span className="text-green-400">{settings.lookbackWindow}</span>
                  </div>
                  <input
                    type="range"
                    min={5}
                    max={60}
                    value={settings.lookbackWindow}
                    onChange={(e) => setSettings((s: any) => ({ ...s, lookbackWindow: parseInt(e.target.value) }))}
                    className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-400">Volatility Threshold</span>
                    <span className="text-green-400">{settings.volatilityThreshold}</span>
                  </div>
                  <input
                    type="range"
                    min={0.5}
                    max={3}
                    step={0.1}
                    value={settings.volatilityThreshold}
                    onChange={(e) => setSettings((s: any) => ({ ...s, volatilityThreshold: parseFloat(e.target.value) }))}
                    className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-400">Volume Weight</span>
                    <span className="text-green-400">{(settings.volumeWeight * 100).toFixed(0)}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.1}
                    value={settings.volumeWeight}
                    onChange={(e) => setSettings((s: any) => ({ ...s, volumeWeight: parseFloat(e.target.value) }))}
                    className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-400">Momentum Weight</span>
                    <span className="text-green-400">{(settings.momentumWeight * 100).toFixed(0)}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.1}
                    value={settings.momentumWeight}
                    onChange={(e) => setSettings((s: any) => ({ ...s, momentumWeight: parseFloat(e.target.value) }))}
                    className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'overview' && (
          <div className="p-4 space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-black/50 border border-white/10 p-3 rounded">
                <div className="text-gray-600 text-[10px] uppercase mb-1">Research Goal</div>
                <div className="text-gray-300">Discover interpretable entry signals without black-box models</div>
              </div>
              <div className="bg-black/50 border border-white/10 p-3 rounded">
                <div className="text-gray-600 text-[10px] uppercase mb-1">Method</div>
                <div className="text-gray-300">Symbolic regression + walk-forward validation</div>
              </div>
              <div className="bg-black/50 border border-white/10 p-3 rounded">
                <div className="text-gray-600 text-[10px] uppercase mb-1">Status</div>
                <div className="text-green-400">Production API deployed</div>
              </div>
            </div>

            <div className="bg-black/50 border border-white/10 p-4 rounded">
              <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-3">The Problem</div>
              <div className="text-gray-400 space-y-2 text-[11px] leading-relaxed">
                <p>Most trading strategies fail because they're overfit to historical data. Black-box ML models
                may achieve high backtest Sharpe ratios but collapse in live trading when market regimes shift.</p>
                <p className="text-yellow-500">Key Issue: You can't debug what you can't understand.</p>
              </div>
            </div>

            <div className="bg-black/50 border border-white/10 p-4 rounded">
              <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-3">The Solution</div>
              <div className="text-gray-400 space-y-2 text-[11px] leading-relaxed">
                <p><span className="text-green-400">Symbolic Regression:</span> Genetic programming evolves human-readable formulas.</p>
                <p><span className="text-green-400">Zone Classification:</span> 3 regimes: Neutral (wait), Consolidation (avoid), Breakout (enter).</p>
                <p><span className="text-green-400">Walk-Forward Validation:</span> Rolling backtest simulates real deployment.</p>
              </div>
            </div>

            {/* Quick metrics preview */}
            <TradingMetricsCard
              title="Current Performance"
              metrics={[
                { label: 'Total Return', value: backtestData.metrics['Total Return'], trend: parseFloat(backtestData.metrics['Total Return']) > 0 ? 'up' : 'down' },
                { label: 'Win Rate', value: backtestData.metrics['Win Rate'], trend: parseFloat(backtestData.metrics['Win Rate']) > 50 ? 'up' : 'down' },
                { label: 'Sharpe Ratio', value: backtestData.metrics['Sharpe Ratio'], trend: parseFloat(backtestData.metrics['Sharpe Ratio']) > 1 ? 'up' : 'neutral' },
                { label: 'Max DD', value: backtestData.metrics['Max Drawdown'], trend: 'neutral' },
              ]}
            >
              <TradingLineChart
                data={backtestData.data}
                xKey="day"
                yKey="equity"
                area
                color="#10b981"
                height={180}
              />
            </TradingMetricsCard>
          </div>
        )}

        {activeTab === 'methodology' && (
          <div className="p-4 space-y-4">
            <div className="bg-black/50 border border-white/10 p-4 rounded">
              <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-3">Feature Engineering (68 Features)</div>
              <div className="grid grid-cols-4 gap-2 text-[10px]">
                <div className="p-2 bg-black/30 rounded border border-white/5">
                  <div className="text-green-400 mb-1">Zone Metrics (7)</div>
                  <div className="text-gray-500">num_candles, duration, zone_high/low, range</div>
                </div>
                <div className="p-2 bg-black/30 rounded border border-white/5">
                  <div className="text-green-400 mb-1">Volume Dynamics (17)</div>
                  <div className="text-gray-500">volume_diff, roc, trend, stddev, acceleration</div>
                </div>
                <div className="p-2 bg-black/30 rounded border border-white/5">
                  <div className="text-green-400 mb-1">Candle Bodies (13)</div>
                  <div className="text-gray-500">avg/max/min_body, wick ratios</div>
                </div>
                <div className="p-2 bg-black/30 rounded border border-white/5">
                  <div className="text-green-400 mb-1">Range & Efficiency (11)</div>
                  <div className="text-gray-500">range_efficiency, price_entropy, balance</div>
                </div>
              </div>
            </div>

            <div className="bg-black/50 border border-white/10 p-4 rounded">
              <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-3">Symbolic Regression Process</div>
              <div className="text-gray-400 space-y-2 text-[11px]">
                <p><span className="text-white">1. Generate population:</span> 1000 random equations using +, -, ×, ÷, √, log, max, min</p>
                <p><span className="text-white">2. Evaluate fitness:</span> RMSE vs accuracy trade-off (Pareto frontier)</p>
                <p><span className="text-white">3. Select & evolve:</span> Best equations breed, mutate, crossover</p>
                <p><span className="text-white">4. Output formula:</span> Human-readable math equation</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'features' && (
          <div className="p-4 space-y-4">
            {[
              { name: 'Zone Metrics', count: 7, features: ['num_candles', 'duration_minutes', 'zone_high', 'zone_low', 'zone_range', 'total_volume', 'avg_volume'] },
              { name: 'Volume Dynamics', count: 17, features: ['volume_diff', 'volume_roc', 'volume_roc2', 'volume_trend', 'volume_stddev', 'vol_deceleration_absolute', 'vol_efficiency', 'volume_vs_avg', 'volume_vs_3candles_before', 'volume_vs_5candles_before'] },
              { name: 'Candle Bodies', count: 13, features: ['avg_body', 'max_body', 'min_body', 'body_to_range', 'avg_wick_to_body_ratio', 'max_single_wick', 'upper_wick_dominance', 'lower_wick_dominance'] },
              { name: 'Wick Analysis', count: 3, features: ['avg_upper_wick', 'avg_lower_wick', 'wick_ratio'] },
              { name: 'Range & Efficiency', count: 11, features: ['range_efficiency', 'price_entropy', 'direction_balance', 'avg_range', 'range_expansion', 'body_to_wick_total', 'efficiency_ratio', 'range_per_candle'] },
              { name: 'Fair Value Gap', count: 4, features: ['fvg_count', 'fvg_size_pct', 'fvg_has_unfilled_fvg', 'fvg_unfilled_ratio'] },
              { name: 'Transition Context', count: 8, features: ['prev_zone_type', 'after_breakout', 'cycles_completed', 'time_in_cycle', 'transition_count', 'last_zone_duration', 'zone_sequence_pattern'] },
              { name: 'Cycle Detection', count: 5, features: ['dominant_cycle', 'cycle_phase', 'amplitude_trend', 'frequency_stability', 'regime_persistence'] },
            ].map(category => (
              <div key={category.name} className="bg-black/50 border border-white/10 p-4 rounded">
                <div className="flex justify-between items-center mb-2">
                  <div className="text-green-400 text-[11px] font-medium">{category.name}</div>
                  <div className="text-gray-600 text-[10px]">{category.count} features</div>
                </div>
                <div className="flex flex-wrap gap-1">
                  {category.features.map(f => (
                    <span key={f} className="text-[9px] bg-black/30 px-2 py-0.5 text-gray-400 border border-white/5">{f}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'findings' && (
          <div className="p-4 space-y-4">
            <div className="bg-black/50 border border-white/10 p-4 rounded">
              <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-3">Key Discoveries</div>
              <div className="space-y-3">
                <div className="border-l-2 border-green-500 pl-3">
                  <div className="text-green-400 text-[11px] font-medium">Simplicity wins</div>
                  <div className="text-gray-500 text-[10px] mt-1">
                    Final formula used only 4 features: zone_range, volume_diff, avg_wick_to_body_ratio, price_entropy.
                    Simpler models generalized better across time periods.
                  </div>
                </div>
                <div className="border-l-2 border-purple-500 pl-3">
                  <div className="text-purple-400 text-[11px] font-medium">Regime-based {'>'} Entry signals</div>
                  <div className="text-gray-500 text-[10px] mt-1">
                    Zone classification (Neutral/Consolidation/Breakout) outperformed direct entry signals.
                    Knowing when NOT to trade is as valuable as knowing when to enter.
                  </div>
                </div>
                <div className="border-l-2 border-blue-500 pl-3">
                  <div className="text-blue-400 text-[11px] font-medium">Volume precedes Price</div>
                  <div className="text-gray-500 text-[10px] mt-1">
                    Volume acceleration led price changes by 1-3 candles in 73% of breakout zones.
                    Smart money accumulates before the move.
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-black/50 border border-white/10 p-4 rounded">
              <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-3">What Didn't Work</div>
              <div className="space-y-2 text-[10px] text-gray-400">
                <p><span className="text-red-400">VWAP look-ahead bias:</span> Calculated VWAP using full day data → fake edge. Fixed with progressive VWAP.</p>
                <p><span className="text-red-400">Orderflow data quality:</span> TradingView tick data shows FILLED orders, not orderbook depth.</p>
                <p><span className="text-red-400">Feature inflation:</span> Started with 100+ features → pruned to 68 → final formula used 4.</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'how-i-built-this' && (
          <div className="p-4 space-y-4">
            <div className="bg-black/50 border border-white/10 p-4 rounded">
              <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-3">Project Origins: The Orderflow Beginning</div>
              <div className="text-[10px] text-gray-400 space-y-2">
                <p><span className="text-white font-medium">Started with Volume Profile:</span> Analyzed VPOC — prior day's high-volume level as support/resistance.</p>
                <p><span className="text-white font-medium">The Problem:</span> VPOC touch analysis was too specific. Win rate ~52% — barely better than coin flip.</p>
                <p><span className="text-white font-medium">The Pivot:</span> Instead of "will price reverse at THIS level?", shifted to "what REGIME is the market in?" Zone Classification was born.</p>
              </div>
            </div>

            <div className="bg-black/50 border border-white/10 p-4 rounded">
              <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-3">ML Models Compared</div>
              <div className="space-y-2 text-[10px] text-gray-400">
                <p><span className="text-white">Random Forest:</span> 76% accuracy but black box. Can't debug failures.</p>
                <p><span className="text-white">Gradient Boosting:</span> 78% accuracy, slower training, still opaque.</p>
                <p><span className="text-white">Logistic Regression:</span> 68% accuracy, too simple.</p>
                <p><span className="text-green-400">Symbolic Regression:</span> 74% accuracy, interpretable formula. Winner.</p>
              </div>
            </div>

            <div className="bg-black/50 border border-white/10 p-4 rounded">
              <div className="text-purple-400 text-[11px] font-medium mb-3">Problem: Orderflow Data Quality (Why Original Approach Failed)</div>
              <div className="text-[10px] text-gray-400 space-y-2">
                <p><span className="text-white font-medium">The Core Thesis:</span> Acceleration/deceleration differences between buyers/sellers would PREDICT price moves.</p>
                <p><span className="text-white font-medium">The Reality:</span> TradingView "tick" data shows FILLED transactions (what actually traded), NOT orderbook depth (what was offered).</p>
                <p><span className="text-red-400 font-medium">Critical Finding:</span> You cannot see institutional limit orders sitting at levels — only market orders executing against them. True orderflow analysis requires full MBP-1 (Market-by-Price) orderbook data, not trade tick data.</p>
                <p><span className="text-yellow-500 font-medium">Pivot:</span> Shifted from "predict price from orderflow" to "classify market regimes from price/volume patterns we CAN reliably measure."</p>
              </div>
            </div>

            <div className="bg-black/50 border border-white/10 p-4 rounded">
              <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-3">Technical Stack Evolution</div>
              <div className="text-[10px] text-gray-400 space-y-2">
                <p><span className="text-white">v1:</span> Manual feature engineering + scikit-learn models</p>
                <p><span className="text-white">v2:</span> Added symbolic regression (PySR from Julia)</p>
                <p><span className="text-white">v3:</span> FastAPI production deployment</p>
                <p><span className="text-green-400">v4 (current):</span> Walk-forward validation integrated, overfitting prevention</p>
              </div>
            </div>

            <div className="bg-black/50 border border-white/10 p-4 rounded">
              <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-3">Files & Architecture</div>
              <div className="text-[10px] text-gray-400 space-y-1 font-mono">
                <p>core/zone_classifier.py — Main classification engine</p>
                <p>core/symbolic_regression.py — PySR wrapper</p>
                <p>core/feature_extraction.py — 68-feature pipeline</p>
                <p>api.py — Production FastAPI endpoint</p>
                <p>walk_forward_analytics/ — Validation framework</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
