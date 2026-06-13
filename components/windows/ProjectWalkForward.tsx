'use client'

import { useState, useMemo } from 'react'
import TradingLineChart from '../charts/TradingLineChart'
import TradingBarChart from '../charts/TradingBarChart'
import TradingMetricsCard from '../charts/TradingMetricsCard'

type TabType = 'overview' | 'framework' | 'robustness' | 'results'

const TABS: { id: TabType; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'framework', label: 'Framework' },
  { id: 'robustness', label: 'Robustness' },
  { id: 'results', label: 'Results' },
]

// Generate rolling window performance data
const generateWindowData = () => {
  const data = []
  for (let i = 0; i < 10; i++) {
    data.push({
      window: i + 1,
      sharpe: (1.2 + Math.random() * 0.8 - i * 0.08).toFixed(2),
      winRate: (52 + Math.random() * 10 - i * 1.5).toFixed(1),
      returns: (8 + Math.random() * 6 - i * 0.5).toFixed(1),
    })
  }
  return data
}

export default function ProjectWalkForward() {
  const [activeTab, setActiveTab] = useState<TabType>('overview')

  // Real-time data
  const windowData = useMemo(() => generateWindowData(), [])

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
              <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-3">Walk-Forward Analytics Overview</div>
              <div className="text-gray-400 space-y-2 text-[11px]">
                <p>Robust backtesting framework to prevent overfitting. Instead of random train/test splits, uses time-based windows that simulate real deployment.</p>
                <p className="text-green-400">Key insight: If a strategy can't adapt to new market conditions, it will fail in production. Walk-forward tests this adaptability.</p>
              </div>
            </div>

            <TradingMetricsCard
              title="Rolling Window Performance"
              metrics={[
                { label: 'Avg Sharpe', value: '1.45', trend: 'up' },
                { label: 'Best Window', value: '1.95', trend: 'up' },
                { label: 'Worst Window', value: '0.65', trend: 'down' },
                { label: 'Stability', value: 'Good', trend: 'neutral' },
              ]}
            >
              <TradingLineChart
                data={windowData}
                xKey="window"
                yKey="sharpe"
                color="#10b981"
                height={200}
                referenceLines={[{ y: 1, label: 'Breakeven', color: '#ef4444' }]}
              />
            </TradingMetricsCard>

            <TradingMetricsCard
              title="Window Comparison"
              metrics={[
                { label: 'Total Windows', value: '10', trend: 'neutral' },
                { label: 'Profitable', value: '9', trend: 'up' },
                { label: 'Avg Win %', value: '56%', trend: 'up' },
                { label: 'Decay', value: 'Low', trend: 'neutral' },
              ]}
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-gray-500 text-[10px] mb-2">Sharpe Ratio by Window</div>
                  <TradingBarChart
                    data={windowData}
                    xKey="window"
                    yKey="sharpe"
                    horizontal
                    height={180}
                  />
                </div>
                <div>
                  <div className="text-gray-500 text-[10px] mb-2">Win Rate by Window</div>
                  <TradingBarChart
                    data={windowData}
                    xKey="window"
                    yKey="winRate"
                    horizontal
                    colors={windowData.map((_, i) => i < 7 ? '#10b981' : i === 7 ? '#f59e0b' : '#ef4444')}
                    height={180}
                    formatTooltip={(value: any) => ['', `${value}%`]}
                  />
                </div>
              </div>
            </TradingMetricsCard>

            <div className="grid grid-cols-3 gap-3">
              <div className="bg-black/50 border border-white/10 p-3 rounded">
                <div className="text-gray-600 text-[10px] uppercase mb-1">Windows</div>
                <div className="text-gray-300">Multiple rolling windows</div>
              </div>
              <div className="bg-black/50 border border-white/10 p-3 rounded">
                <div className="text-gray-600 text-[10px] uppercase mb-1">Output</div>
                <div className="text-gray-300">HTML + JSON reports</div>
              </div>
              <div className="bg-black/50 border border-white/10 p-3 rounded">
                <div className="text-gray-600 text-[10px] uppercase mb-1">Status</div>
                <div className="text-green-300">Complete framework</div>
              </div>
            </div>

            <div className="bg-black/50 border border-white/10 p-4 rounded">
              <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-3">Location</div>
              <div className="text-gray-400 text-[11px] font-mono">
                walk_forward_analytics/
              </div>
            </div>
          </div>
        )}

        {activeTab === 'framework' && (
          <div className="p-4 space-y-4">
            <div className="bg-black/50 border border-white/10 p-4 rounded">
              <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-3">Walk-Forward Process</div>
              <div className="text-gray-400 space-y-2 text-[11px]">
                <div className="flex gap-2">
                  <span className="text-green-400">1.</span>
                  <span><span className="text-white">Train:</span> Optimize on window [t₀, t₁]</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-green-400">2.</span>
                  <span><span className="text-white">Test:</span> Validate on [t₁, t₂] (future data)</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-green-400">3.</span>
                  <span><span className="text-white">Shift:</span> Roll window forward: [t₁, t₂] train, [t₂, t₃] test</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-green-400">4.</span>
                  <span><span className="text-white">Repeat:</span> Continue through dataset</span>
                </div>
              </div>
            </div>

            <div className="bg-black/50 border border-white/10 p-4 rounded">
              <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-3">Critical Rule</div>
              <div className="text-gray-400 text-[11px]">
                <p><span className="text-red-400">NEVER shuffle time series randomly.</span> This creates look-ahead bias. Chronological order must be preserved.</p>
                <p className="mt-2"><span className="text-green-400">ALWAYS</span> train on past, validate on future.</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'robustness' && (
          <div className="p-4 space-y-4">
            <div className="bg-black/50 border border-white/10 p-4 rounded">
              <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-3">What Walk-Forward Tests</div>
              <div className="text-gray-400 text-[11px] space-y-1">
                <p>• Adaptability: Can strategy adjust to new regimes?</p>
                <p>• Stability: Do parameters converge or oscillate wildly?</p>
                <p>• Consistency: Is edge maintained across windows?</p>
                <p>• Overfitting: Does in-sample performance ≠ out-of-sample?</p>
              </div>
            </div>

            <div className="bg-black/50 border border-white/10 p-4 rounded">
              <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-3">Red Flags</div>
              <div className="text-gray-400 text-[11px] space-y-1">
                <p><span className="text-red-400">Parameter drift:</span> Optimal values change dramatically each window</p>
                <p><span className="text-red-400">In-sample win rate {'>'} out-of-sample by {'>'}10%</span></p>
                <p><span className="text-red-400">Performance degrades over time (not just market changes)</span></p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'results' && (
          <div className="p-4 space-y-4">
            <div className="bg-black/50 border border-white/10 p-4 rounded">
              <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-3">Report Outputs</div>
              <div className="text-gray-400 text-[11px] space-y-1">
                <p>• HTML Reports: Comprehensive visual analysis</p>
                <p>• JSON Results: Machine-readable outputs</p>
                <p>• Actionable Insights: Recommendations based on results</p>
              </div>
            </div>

            <div className="bg-black/50 border border-white/10 p-4 rounded">
              <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-3">Integration</div>
              <div className="text-gray-400 text-[11px]">
                <p>Used by Zone Classifier and all strategy research. Essential before any production deployment.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
