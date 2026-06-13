'use client'

import { useState, useMemo } from 'react'
import TradingLineChart from '../charts/TradingLineChart'
import TradingBarChart from '../charts/TradingBarChart'
import TradingMetricsCard from '../charts/TradingMetricsCard'

type TabType = 'overview' | 'features' | 'examples' | 'data-quality'

const TABS: { id: TabType; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'features', label: 'Features' },
  { id: 'examples', label: 'Examples' },
  { id: 'data-quality', label: 'Data Quality' },
]

// Generate tick-by-tick price movement
const generateTickData = () => {
  const data = []
  let price = 4500
  for (let i = 0; i < 100; i++) {
    price += (Math.random() - 0.5) * 2
    data.push({
      tick: i + 1,
      price: price.toFixed(2),
      bid: (price - 0.25).toFixed(2),
      ask: (price + 0.25).toFixed(2),
      spread: 0.5,
    })
  }
  return data
}

// Generate spread analysis
const generateSpreadData = () => {
  return [
    { range: '0.25', count: 45, color: '#10b981' },
    { range: '0.50', count: 32, color: '#22c55e' },
    { range: '0.75', count: 15, color: '#84cc16' },
    { range: '1.00+', count: 8, color: '#ef4444' },
  ]
}

export default function ProjectOrderflowViz() {
  const [activeTab, setActiveTab] = useState<TabType>('overview')
  const [settings, setSettings] = useState({
    tickWindow: 100,
    showSpread: true,
  })

  // Real-time data
  const tickData = useMemo(() => generateTickData(), [settings.tickWindow])
  const spreadData = useMemo(() => generateSpreadData(), [])

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
              <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-3">Orderflow Data Visualizer</div>
              <div className="text-gray-400 space-y-2 text-[11px]">
                <p><span className="text-white font-medium">Purpose:</span> Diagnostic tool for comparing raw tick data against ideal MBP-1 orderbook reconstruction.</p>
                <p><span className="text-white font-medium">Problem:</span> Tick data quality varies by venue. Some feeds include best bid/ask, others don't.</p>
                <p className="text-green-400">Solution: Visualizer shows what information is available and detects data quality issues.</p>
              </div>
            </div>

            <TradingMetricsCard
              title="Tick-by-Tick Price Movement"
              metrics={[
                { label: 'Ticks', value: settings.tickWindow.toString(), trend: 'neutral' },
                { label: 'Avg Spread', value: '$0.50', trend: 'neutral' },
                { label: 'Price Range', value: '$4.25', trend: 'neutral' },
                { label: 'Data Quality', value: 'Good', trend: 'up' },
              ]}
            >
              <TradingLineChart
                data={tickData}
                xKey="tick"
                yKey="price"
                color="#10b981"
                height={200}
                showDots={false}
                formatTooltip={(value: any) => ['', `$${value}`]}
              />
            </TradingMetricsCard>

            <TradingMetricsCard
              title="Bid/Ask Spread Distribution"
              metrics={[
                { label: 'Tight Spread', value: '45%', trend: 'up' },
                { label: 'Avg Spread', value: '$0.50', trend: 'neutral' },
                { label: 'Wide Spread', value: '8%', trend: 'down' },
                { label: 'Samples', value: tickData.length.toString(), trend: 'neutral' },
              ]}
            >
              <TradingBarChart
                data={spreadData}
                xKey="range"
                yKey="count"
                height={200}
                formatTooltip={(value: any) => ['', `${value}%`]}
              />
            </TradingMetricsCard>
          </div>
        )}

        {activeTab === 'features' && (
          <div className="p-4 space-y-4">
            <div className="bg-black/50 border border-white/10 p-4 rounded">
              <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-3">Features</div>
              <div className="text-gray-400 text-[11px] space-y-1">
                <p>• Tick-by-tick price visualization</p>
                <p>• Simulated orderbook generation</p>
                <p>• Bid/ask spread analysis</p>
                <p>• Data quality metrics</p>
                <p>• Gap detection</p>
              </div>
            </div>

            <div className="bg-black/50 border border-white/10 p-4 rounded">
              <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-3">Use Cases</div>
              <div className="text-gray-400 text-[11px] space-y-1">
                <p>• Verify data feed quality before backtesting</p>
                <p>• Understand venue-specific tick formats</p>
                <p>• Debug orderflow analysis issues</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'examples' && (
          <div className="p-4 space-y-4">
            <div className="bg-black/50 border border-white/10 p-4 rounded">
              <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-3">Visual Examples</div>
              <div className="text-gray-400 text-[11px] space-y-2">
                <p className="text-white text-[10px]">Example: Detecting Missing Bid/Ask Data</p>
                <p className="text-gray-500 text-[10px]">If visualizer shows no spread information, your data feed doesn't include NBBO (National Best Bid/Offer).</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'data-quality' && (
          <div className="p-4 space-y-4">
            <TradingMetricsCard
              title="Data Quality Metrics"
              metrics={[
                { label: 'Completeness', value: '98%', trend: 'up' },
                { label: 'Bid/Ask Present', value: '95%', trend: 'up' },
                { label: 'Gap Detected', value: '2', trend: 'down' },
                { label: 'Duplicate Ticks', value: '0', trend: 'up' },
              ]}
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-gray-500 text-[10px] mb-2">Quality Score Over Time</div>
                  <TradingLineChart
                    data={[
                      { period: 'Q1', score: 92 },
                      { period: 'Q2', score: 95 },
                      { period: 'Q3', score: 94 },
                      { period: 'Q4', score: 98 },
                    ]}
                    xKey="period"
                    yKey="score"
                    color="#10b981"
                    height={160}
                  />
                </div>
                <div>
                  <div className="text-gray-500 text-[10px] mb-2">Issue Distribution</div>
                  <TradingBarChart
                    data={[
                      { issue: 'Missing B/A', count: 12, color: '#ef4444' },
                      { issue: 'Gaps', count: 2, color: '#f59e0b' },
                      { issue: 'Duplicates', count: 0, color: '#10b981' },
                    ]}
                    xKey="issue"
                    yKey="count"
                    height={160}
                  />
                </div>
              </div>
            </TradingMetricsCard>

            <div className="bg-black/50 border border-white/10 p-4 rounded">
              <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-3">Recommendations</div>
              <div className="text-gray-400 space-y-1 text-[11px]">
                <p>✓ Data feed includes bid/ask — suitable for orderflow analysis</p>
                <p>⚠ 2 gaps detected — check for market hours or data provider issues</p>
                <p>✓ No duplicate ticks — timestamp integrity is good</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
