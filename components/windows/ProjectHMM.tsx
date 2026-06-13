'use client'

import { useState, useMemo } from 'react'
import TradingLineChart from '../charts/TradingLineChart'
import TradingBarChart from '../charts/TradingBarChart'
import TradingMetricsCard from '../charts/TradingMetricsCard'

type TabType = 'overview' | 'regime-detection' | 'features' | 'comparison'

const TABS: { id: TabType; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'regime-detection', label: 'Regime Detection' },
  { id: 'features', label: 'Features' },
  { id: 'comparison', label: 'vs Zone Classifier' },
]

// Generate regime transition data
const generateRegimeData = () => {
  const regimes = ['CONSOLIDATION', 'BREAKOUT', 'TRENDING', 'NEUTRAL']
  const data = []
  let currentRegime = 0

  for (let i = 0; i < 60; i++) {
    // Random regime transitions
    if (Math.random() < 0.15) {
      currentRegime = Math.floor(Math.random() * 4)
    }
    data.push({
      day: i + 1,
      regime: regimes[currentRegime],
      confidence: 70 + Math.random() * 25,
    })
  }
  return data
}

// Generate state distribution
const generateStateDistribution = () => {
  return [
    { state: 'Consolidation', count: 35, color: '#f59e0b' },
    { state: 'Trending', count: 28, color: '#3b82f6' },
    { state: 'Breakout', count: 22, color: '#ef4444' },
    { state: 'Neutral', count: 15, color: '#666' },
  ]
}

export default function ProjectHMM() {
  const [activeTab, setActiveTab] = useState<TabType>('overview')

  // Real-time data
  const regimeData = useMemo(() => generateRegimeData(), [])
  const stateDistribution = useMemo(() => generateStateDistribution(), [])

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
              <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-3">HMM Analysis Overview</div>
              <div className="text-gray-400 space-y-2 text-[11px]">
                <p>Hidden Markov Models for market regime detection. Uses hmmlearn library with 4-state Gaussian HMM.</p>
                <p className="text-green-400">Classifies markets into: CONSOLIDATION, BREAKOUT, TRENDING states based on range, body, and volume characteristics.</p>
              </div>
            </div>

            <TradingMetricsCard
              title="Regime Transitions Over Time"
              metrics={[
                { label: 'Total Days', value: '60', trend: 'neutral' },
                { label: 'Regimes', value: '4', trend: 'neutral' },
                { label: 'Avg Confidence', value: '82%', trend: 'up' },
                { label: 'Transitions', value: '12', trend: 'neutral' },
              ]}
            >
              <TradingLineChart
                data={regimeData.map((d, i) => ({ ...d, regimeValue: d.regime === 'BREAKOUT' ? 3 : d.regime === 'TRENDING' ? 2 : d.regime === 'CONSOLIDATION' ? 1 : 0.5 }))}
                xKey="day"
                yKey="regimeValue"
                color="#8b5cf6"
                height={180}
                referenceLines={[{ y: 1, label: 'Consolidation', color: '#f59e0b' }, { y: 2, label: 'Trending', color: '#3b82f6' }]}
              />
            </TradingMetricsCard>

            <TradingMetricsCard
              title="State Distribution"
              metrics={[
                { label: 'Most Common', value: 'Consolidation', trend: 'neutral' },
                { label: '% Time', value: '35%', trend: 'neutral' },
                { label: 'Breakouts', value: '22%', trend: 'up' },
                { label: 'Neutral', value: '15%', trend: 'neutral' },
              ]}
            >
              <TradingBarChart
                data={stateDistribution}
                xKey="state"
                yKey="count"
                height={200}
              />
            </TradingMetricsCard>

            <div className="grid grid-cols-3 gap-3">
              <div className="bg-black/50 border border-white/10 p-3 rounded">
                <div className="text-gray-600 text-[10px] uppercase mb-1">States</div>
                <div className="text-gray-300">4 states</div>
              </div>
              <div className="bg-black/50 border border-white/10 p-3 rounded">
                <div className="text-gray-600 text-[10px] uppercase mb-1">Features</div>
                <div className="text-gray-300">4 features</div>
              </div>
              <div className="bg-black/50 border border-white/10 p-3 rounded">
                <div className="text-gray-600 text-[10px] uppercase mb-1">Library</div>
                <div className="text-gray-300">hmmlearn</div>
              </div>
            </div>

            <div className="bg-black/50 border border-white/10 p-4 rounded">
              <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-3">File</div>
              <div className="text-gray-400 text-[11px] font-mono">
                core/hmm_analysis_tool.py
              </div>
            </div>
          </div>
        )}

        {activeTab === 'regime-detection' && (
          <div className="p-4 space-y-4">
            <div className="bg-black/50 border border-white/10 p-4 rounded">
              <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-3">State Classification</div>
              <div className="text-gray-400 space-y-2 text-[11px]">
                <p>Each state is classified based on its characteristics:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li><span className="text-green-400">CONSOLIDATION:</span> Range {'<'} 0.3%, Body {'<'} 0.2%</li>
                  <li><span className="text-red-400">BREAKOUT:</span> Range {'>'} 1.0%</li>
                  <li><span className="text-blue-400">TRENDING:</span> Between consolidation and breakout thresholds</li>
                  <li><span className="text-gray-400">NEUTRAL:</span> All other states</li>
                </ul>
              </div>
            </div>

            <div className="bg-black/50 border border-white/10 p-4 rounded">
              <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-3">High Confidence Predictions</div>
              <div className="text-gray-400 text-[11px]">
                <p>Model tracks predictions with {'>'}70% probability as "high confidence."</p>
                <p>Lower confidence predictions indicate regime transition or uncertainty.</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'features' && (
          <div className="p-4 space-y-4">
            <div className="bg-black/50 border border-white/10 p-4 rounded">
              <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-3">HMM Features</div>
              <div className="text-gray-400 space-y-2 text-[11px]">
                <div className="flex gap-2">
                  <span className="text-green-400">1.</span>
                  <span><span className="text-white">range_pct:</span> (high - low) / close — volatility measure</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-green-400">2.</span>
                  <span><span className="text-white">body_pct:</span> body / close — directional strength</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-green-400">3.</span>
                  <span><span className="text-white">volume_ratio:</span> volume / volume_MA20 — relative volume</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-green-400">4.</span>
                  <span><span className="text-white">volatility:</span> range_pct rolling std(20) — volatility regime</span>
                </div>
              </div>
            </div>

            <div className="bg-black/50 border border-white/10 p-4 rounded">
              <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-3">Training Parameters</div>
              <div className="text-gray-400 text-[11px] space-y-1">
                <p>• 4-state Gaussian HMM</p>
                <p>• Full covariance matrix</p>
                <p>• 100 iteration convergence</p>
                <p>• Random state initialization</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'comparison' && (
          <div className="p-4 space-y-4">
            <div className="bg-black/50 border border-white/10 p-4 rounded">
              <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-3">HMM vs Zone Classifier</div>
              <div className="text-gray-400 text-[11px] space-y-2">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="pb-2">Aspect</th>
                      <th className="pb-2">HMM</th>
                      <th className="pb-2">Zone Classifier</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="py-2">Method</td>
                      <td>Unsupervised learning</td>
                      <td>Symbolic regression</td>
                    </tr>
                    <tr>
                      <td className="py-2">Interpretability</td>
                      <td>Black box states</td>
                      <td className="text-green-400">Readable formulas</td>
                    </tr>
                    <tr>
                      <td className="py-2">States</td>
                      <td>4 fixed states</td>
                      <td>3 dynamic classes</td>
                    </tr>
                    <tr>
                      <td className="py-2">Features</td>
                      <td>4 features</td>
                      <td>68 features</td>
                    </tr>
                    <tr>
                      <td className="py-2">Use case</td>
                      <td>Regime detection</td>
                      <td className="text-green-400">Trading signals</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-black/50 border border-white/10 p-4 rounded">
              <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-3">When to Use Each</div>
              <div className="text-gray-400 text-[11px] space-y-1">
                <p><span className="text-blue-400">HMM:</span> Exploratory analysis, discovering hidden market structures</p>
                <p><span className="text-green-400">Zone Classifier:</span> Production trading, interpretable signals, validated edge</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
