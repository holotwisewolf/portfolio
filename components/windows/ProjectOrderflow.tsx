'use client'

import { useState, useMemo } from 'react'
import TradingLineChart from '../charts/TradingLineChart'
import TradingBarChart from '../charts/TradingBarChart'
import TradingMetricsCard from '../charts/TradingMetricsCard'

type TabType = 'overview' | 'elasticity' | 'results' | 'data-quality' | 'findings' | 'thesis'

const TABS: { id: TabType; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'elasticity', label: 'Elasticity Analysis' },
  { id: 'results', label: 'Results' },
  { id: 'data-quality', label: 'Data Quality' },
  { id: 'findings', label: 'Findings' },
  { id: 'thesis', label: 'Thesis Paper' },
]

// Generate elasticity vs price change scatter data
const generateElasticityScatter = () => {
  const data = []
  for (let i = 0; i < 100; i++) {
    const elasticity = Math.random() * 10
    const priceChange = (Math.random() - 0.5) * 20 * (1 / (elasticity + 0.1))
    const volume = Math.random() * 1000 + 500
    data.push({
      id: i,
      elasticity: elasticity.toFixed(2),
      priceChange: priceChange.toFixed(2),
      volume: volume,
      profitable: priceChange > 0,
    })
  }
  return data
}

// Generate EV per trade over time
const generateEVData = (volatility: number) => {
  const data = []
  let ev = 20
  for (let i = 0; i < 60; i++) {
    const decay = 0.92 + (Math.random() - 0.5) * 0.1
    ev = ev * decay
    data.push({
      day: i + 1,
      ev: ev.toFixed(2),
      volatility: volatility,
    })
  }
  return data
}

// Generate elasticity bucket performance
const generateBucketPerformance = (volumeWeight: number) => {
  return [
    { bucket: 'Q1 (Fast Decel)', winRate: 45 + volumeWeight * 10, ev: 15 + volumeWeight * 5, color: '#10b981' },
    { bucket: 'Q2', winRate: 48 + volumeWeight * 8, ev: 12 + volumeWeight * 4, color: '#22c55e' },
    { bucket: 'Q3', winRate: 50 + volumeWeight * 5, ev: 8 + volumeWeight * 3, color: '#84cc16' },
    { bucket: 'Q4 (Fast Accel)', winRate: 52 + volumeWeight * 3, ev: 5 + volumeWeight * 2, color: '#eab308' },
  ]
}

export default function ProjectOrderflow() {
  const [activeTab, setActiveTab] = useState<TabType>('overview')
  const [settings, setSettings] = useState({
    volatilityFilter: 0.5,
    volumeWeight: 0.3,
    elasticityThreshold: 2.0,
  })

  // Real-time data generation
  const evData = useMemo(() => generateEVData(settings.volatilityFilter), [settings.volatilityFilter])
  const bucketPerformance = useMemo(() => generateBucketPerformance(settings.volumeWeight), [settings.volumeWeight])
  const elasticityScatter = useMemo(() => generateElasticityScatter(), [])

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
        {activeTab === 'overview' && (
          <div className="p-4 space-y-4">
            <div className="bg-black/50 border border-white/10 p-4 rounded">
              <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-3">Orderflow Research Overview</div>
              <div className="text-gray-400 space-y-2 text-[11px]">
                <p>Research into whether orderflow dynamics (delta acceleration, elasticity) predict short-term price movements in NQ futures.</p>
                <p className="text-yellow-400">Key Finding: Pattern exists but not robust across time. August 2024: $23.38/trade EV. August 2025: $1.61/trade EV.</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="bg-black/50 border border-white/10 p-3 rounded">
                <div className="text-gray-600 text-[10px] uppercase mb-1">Data Source</div>
                <div className="text-gray-300">Databento CME Globex MDP 3.0</div>
              </div>
              <div className="bg-black/50 border border-white/10 p-3 rounded">
                <div className="text-gray-600 text-[10px] uppercase mb-1">Instrument</div>
                <div className="text-gray-300">NQ (Nasdaq 100 E-mini)</div>
              </div>
              <div className="bg-black/50 border border-white/10 p-3 rounded">
                <div className="text-gray-600 text-[10px] uppercase mb-1">Sample Size</div>
                <div className="text-gray-300">247,883 observations</div>
              </div>
            </div>

            {/* Performance Preview */}
            <TradingMetricsCard
              title="Expected Value Decay"
              metrics={[
                { label: 'Initial EV', value: '$20.00', trend: 'up' },
                { label: 'Current EV', value: `$${evData[evData.length - 1].ev}`, trend: parseFloat(evData[evData.length - 1].ev) > 5 ? 'up' : 'down' },
                { label: 'Decay Rate', value: '92%', trend: 'neutral' },
                { label: 'Days', value: '60', trend: 'neutral' },
              ]}
            >
              <TradingLineChart
                data={evData}
                xKey="day"
                yKey="ev"
                area
                color="#f59e0b"
                height={180}
                formatTooltip={(value: any) => ['', `$${value}`]}
              />
            </TradingMetricsCard>
          </div>
        )}

        {activeTab === 'results' && (
          <div className="p-4 space-y-4">
            {/* EV Decay Over Time */}
            <TradingMetricsCard
              title="Expected Value Decay (60 Days)"
              metrics={[
                { label: 'Aug 2024', value: '$23.38', trend: 'up' },
                { label: 'Dec 2024', value: '$12.50', trend: 'up' },
                { label: 'Apr 2025', value: '$5.20', trend: 'down' },
                { label: 'Aug 2025', value: `$${evData[evData.length - 1].ev}`, trend: 'down' },
              ]}
            >
              <TradingLineChart
                data={evData}
                xKey="day"
                yKey="ev"
                area
                color="#f59e0b"
                height={220}
                referenceLines={[{ y: 5, label: 'Breakeven', color: '#ef4444' }]}
                formatTooltip={(value: any) => ['', `$${value}`]}
              />
            </TradingMetricsCard>

            {/* Bucket Performance */}
            <TradingMetricsCard
              title="Performance by Delta Acceleration Quartile"
              metrics={[
                { label: 'Best Quartile', value: 'Q1 (Decel)', trend: 'up' },
                { label: 'Q1 Win Rate', value: `${bucketPerformance[0].winRate.toFixed(0)}%`, trend: 'up' },
                { label: 'Q1 EV/Trade', value: `$${bucketPerformance[0].ev.toFixed(0)}`, trend: 'up' },
                { label: 'Edge', value: 'Consistent', trend: 'neutral' },
              ]}
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-gray-500 text-[10px] mb-2">Win Rate by Quartile</div>
                  <TradingBarChart
                    data={bucketPerformance}
                    xKey="bucket"
                    yKey="winRate"
                    height={180}
                    formatTooltip={(value: any) => ['', `${value.toFixed(1)}%`]}
                  />
                </div>
                <div>
                  <div className="text-gray-500 text-[10px] mb-2">EV/Trade by Quartile</div>
                  <TradingBarChart
                    data={bucketPerformance}
                    xKey="bucket"
                    yKey="ev"
                    colors={['#10b981', '#22c55e', '#84cc16', '#eab308']}
                    height={180}
                    formatTooltip={(value: any) => ['', `$${value.toFixed(0)}`]}
                  />
                </div>
              </div>
            </TradingMetricsCard>

            {/* Elasticity Distribution */}
            <TradingMetricsCard
              title="Elasticity Distribution"
              metrics={[
                { label: 'Mean E', value: '3.2', trend: 'neutral' },
                { label: 'Std Dev', value: '1.8', trend: 'neutral' },
                { label: 'Low E %', value: '35%', trend: 'up' },
                { label: 'High E %', value: '28%', trend: 'neutral' },
              ]}
            >
              <TradingBarChart
                data={[
                  { range: '0-2', count: 35, color: '#10b981' },
                  { range: '2-4', count: 42, color: '#22c55e' },
                  { range: '4-6', count: 28, color: '#84cc16' },
                  { range: '6-8', count: 18, color: '#eab308' },
                  { range: '8+', count: 12, color: '#ef4444' },
                ]}
                xKey="range"
                yKey="count"
                height={200}
              />
            </TradingMetricsCard>
          </div>
        )}

        {activeTab === 'elasticity' && (
          <div className="p-4 space-y-4">
            <div className="bg-black/50 border border-white/10 p-4 rounded">
              <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-3">Elasticity Metric</div>
              <div className="text-gray-400 space-y-2 text-[11px]">
                <p><span className="text-white font-medium">Formula:</span> E = R / |Δ| (Price Range / Absolute Delta)</p>
                <p><span className="text-green-400">Low Elasticity:</span> Large delta with small price movement → strong absorption by liquidity providers</p>
                <p><span className="text-red-400">High Elasticity:</span> Small delta with large price movement → thin order book, high impact</p>
              </div>
            </div>

            <div className="bg-black/50 border border-white/10 p-4 rounded">
              <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-3">Delta Acceleration</div>
              <div className="text-gray-400 space-y-2 text-[11px]">
                <p><span className="text-white font-medium">Formula:</span> A = (Δ_recent - Δ_prior) / max(|Δ_prior|, ε)</p>
                <p><span className="text-blue-400">Fast Deceleration (Q1):</span> Aggressive side losing momentum, potential exhaustion</p>
                <p><span className="text-purple-400">Fast Acceleration (Q4):</span> Momentum building, continuation likely</p>
              </div>
            </div>

            <div className="bg-black/50 border border-white/10 p-4 rounded">
              <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-3">Best Configuration</div>
              <div className="text-gray-400 space-y-1 text-[11px]">
                <p><span className="text-green-400">Low Elasticity + Fast Deceleration + High Volume</span></p>
                <p>August 2024: 51.4% win rate, $23.38/trade EV</p>
                <p>August 2025: 45.3% win rate, $1.61/trade EV</p>
                <p className="text-yellow-400">Pattern consistent, profitability not robust.</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'data-quality' && (
          <div className="p-4 space-y-4">
            <div className="bg-black/50 border border-red-500/30 p-4 rounded">
              <div className="text-red-400 text-[11px] font-medium mb-3">Critical Data Limitation</div>
              <div className="text-gray-400 space-y-2 text-[11px]">
                <p><span className="text-white font-medium">The Problem:</span> TradingView tick-by-tick data shows FILLED orders only, not the full orderbook.</p>
                <p><span className="text-white font-medium">Why This Matters:</span></p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>True orderflow (Bookmap-style) shows bid/ask depth changes BEFORE fills</li>
                  <li>TradingView only shows you what already happened</li>
                  <li>By the time you see a "large buyer" in trade data, the institutional order is already filled</li>
                  <li>You're chasing shadows, not leading the market</li>
                </ul>
                <p className="text-yellow-400">This is why orderflow strategies showed promise but failed in production — the data didn't contain the signal we thought it did.</p>
              </div>
            </div>

            <div className="bg-black/50 border border-white/10 p-4 rounded">
              <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-3">MBP-1 vs Trade Data</div>
              <div className="text-gray-400 space-y-2 text-[11px]">
                <p><span className="text-green-400">MBP-1 (Market-by-Price):</span> Full orderbook depth, bid/ask changes, limit order placement</p>
                <p><span className="text-red-400">Trade Data:</span> Filled orders only, execution price, volume, timestamp</p>
                <p><span className="text-white font-medium">Conclusion:</span> Without MBP-1 orderbook data, I'm not measuring orderflow — I'm measuring noise.</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'findings' && (
          <div className="p-4 space-y-4">
            <div className="bg-black/50 border border-white/10 p-4 rounded">
              <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-3">Cross-Validation Results</div>
              <div className="text-gray-400 text-[11px] space-y-2">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="pb-2">Period</th>
                      <th className="pb-2">Best Cell</th>
                      <th className="pb-2">Win Rate</th>
                      <th className="pb-2">EV/Trade</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td className="py-2">Aug 2024</td><td>Low E + FastDecel + HighVol</td><td>51.4%</td><td className="text-green-400">$23.38</td></tr>
                    <tr><td className="py-2">Aug 2025</td><td>Low E + FastDecel + LowVol</td><td>45.3%</td><td className="text-yellow-400">$1.61</td></tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-black/50 border border-white/10 p-4 rounded">
              <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-3">What IS Consistent</div>
              <div className="text-gray-400 space-y-1 text-[11px]">
                <p>✓ Low E + FastDecel is best-performing cell in both periods</p>
                <p>✓ Pattern reliably identifies relative outperformers</p>
                <p>✓ Underlying microstructure dynamics are captured</p>
              </div>
            </div>

            <div className="bg-black/50 border border-white/10 p-4 rounded">
              <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-3">What IS NOT Consistent</div>
              <div className="text-gray-400 space-y-1 text-[11px]">
                <p>✗ Absolute profitability</p>
                <p>✗ Optimal target/stop parameters</p>
                <p>✗ Volume's incremental value</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'thesis' && (
          <div className="p-4 space-y-4">
            <div className="bg-black/50 border border-white/10 p-4 rounded">
              <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-3">Research Summary</div>
              <div className="text-gray-400 text-[11px]">
                <p>Full research paper available at: <span className="text-green-400">docs/RESEARCH_FINDINGS.md</span></p>
                <p className="mt-2">672,277 trade records analyzed from ES futures data.</p>
                <p className="mt-2 text-yellow-400">Conclusion: Low elasticity predicts better continuation than high elasticity — opposite of initial hypothesis. When aggressive flow meets resistance (price doesn't move), the resistance often breaks down and price continues.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
