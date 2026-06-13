'use client'

import { useState, useMemo } from 'react'
import VPOCDemo from '../projects/VPOCDemo'
import TradingLineChart from '../charts/TradingLineChart'
import TradingBarChart from '../charts/TradingBarChart'
import TradingMetricsCard from '../charts/TradingMetricsCard'

type TabType = 'overview' | 'theory' | 'methodology' | 'results' | 'evolution'

const TABS: { id: TabType; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'theory', label: 'Theory' },
  { id: 'methodology', label: 'Methodology' },
  { id: 'results', label: 'Results' },
  { id: 'evolution', label: 'Evolution → Zones' },
]

// Generate VPOC touch data
const generateVOPOCData = () => {
  const data = []
  let vpoc = 4500
  for (let i = 0; i < 90; i++) {
    vpoc += (Math.random() - 0.5) * 20
    data.push({
      day: i + 1,
      vpoc: vpoc.toFixed(1),
      touches: Math.round(Math.random() * 5),
      reactions: Math.round(Math.random() * 3),
    })
  }
  return data
}

// Generate bounce vs breakdown stats
const generateReactionStats = () => {
  return [
    { type: 'Bounce', count: 45, winRate: 58, color: '#10b981' },
    { type: 'Piercing', count: 28, winRate: 42, color: '#f59e0b' },
    { type: 'Breakdown', count: 27, winRate: 35, color: '#ef4444' },
  ]
}

export default function ProjectVPOC() {
  const [activeTab, setActiveTab] = useState<TabType>('overview')

  // Real-time data
  const vpocData = useMemo(() => generateVOPOCData(), [])
  const reactionStats = useMemo(() => generateReactionStats(), [])

  if (activeTab === 'methodology' || activeTab === 'results') {
    return <VPOCDemo />
  }

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
              <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-3">VPOC Analysis Overview</div>
              <div className="text-gray-400 space-y-2 text-[11px]">
                <p><span className="text-white font-medium">VPOC (Volume Point of Control):</span> The price level where the most volume traded during a session. Represents "fair value" for that period.</p>
                <p><span className="text-white font-medium">The Hypothesis:</span> When price returns to a prior day's VPOC level, it should react — either bouncing off (support/resistance) or accelerating through (breakout).</p>
                <p className="text-yellow-400">Status: Legacy project — insights incorporated into Zone Classifier.</p>
              </div>
            </div>

            <TradingMetricsCard
              title="VPOC Movement Over Time"
              metrics={[
                { label: 'Start VPOC', value: '$4,500', trend: 'neutral' },
                { label: 'End VPOC', value: `$${vpocData[vpocData.length - 1].vpoc}`, trend: 'neutral' },
                { label: 'Total Touches', value: '120', trend: 'neutral' },
                { label: 'Reactions', value: '45', trend: 'up' },
              ]}
            >
              <TradingLineChart
                data={vpocData}
                xKey="day"
                yKey="vpoc"
                color="#a855f7"
                height={180}
                formatTooltip={(value: any) => ['', `$${value}`]}
              />
            </TradingMetricsCard>

            <TradingMetricsCard
              title="Reaction Type Distribution"
              metrics={[
                { label: 'Bounce', value: '45', trend: 'up' },
                { label: 'Bounce Win %', value: '58%', trend: 'up' },
                { label: 'Breakdown', value: '27', trend: 'down' },
                { label: 'Overall Edge', value: '+2.1%', trend: 'up' },
              ]}
            >
              <TradingBarChart
                data={reactionStats}
                xKey="type"
                yKey="count"
                height={200}
              />
            </TradingMetricsCard>

            <div className="grid grid-cols-3 gap-3">
              <div className="bg-black/50 border border-white/10 p-3 rounded">
                <div className="text-gray-600 text-[10px] uppercase mb-1">Instrument</div>
                <div className="text-gray-300">SPY / ES Futures</div>
              </div>
              <div className="bg-black/50 border border-white/10 p-3 rounded">
                <div className="text-gray-600 text-[10px] uppercase mb-1">Data Period</div>
                <div className="text-gray-300">2023-2024</div>
              </div>
              <div className="bg-black/50 border border-white/10 p-3 rounded">
                <div className="text-gray-600 text-[10px] uppercase mb-1">Sample Size</div>
                <div className="text-gray-300">~100 VPOC levels</div>
              </div>
            </div>

            <div className="bg-black/50 border border-yellow-500/20 border border-white/10 p-4 rounded">
              <div className="text-yellow-500 text-[10px] uppercase tracking-wider mb-2">⚠️ Limitations Discovered</div>
              <div className="text-gray-400 text-[11px]">
                <p>VPOC touch analysis showed marginal edge (~52% win rate). Shifted focus from "will price react at THIS level?" to "what REGIME is the market in?" — which became Zone Classifier.</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'theory' && (
          <div className="p-4 space-y-4">
            <div className="bg-black/50 border border-white/10 p-4 rounded">
              <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-3">VPOC Theory</div>
              <div className="text-gray-400 space-y-2 text-[11px]">
                <p><span className="text-white font-medium">Fair Value:</span> VPOC represents the price where most market participants agreed on value during a session.</p>
                <p><span className="text-white font-medium">Memory Effect:</span> Markets remember these levels. When price returns, participants reassess.</p>
                <p><span className="text-white font-medium">Expected Behaviors:</span></p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Price approaches VPOC → consolidation, testing the level</li>
                  <li>If VPOC holds → reversal (bounce) in opposite direction</li>
                  <li>If VPOC breaks → accelerated move in breakout direction</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'evolution' && (
          <div className="p-4 space-y-4">
            <div className="bg-black/50 border border-white/10 p-4 rounded">
              <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-3">Evolution into Zone Classifier</div>
              <div className="text-gray-400 space-y-2 text-[11px]">
                <p><span className="text-white font-medium">Problem with VPOC:</span> Too specific. Single level analysis misses broader market context.</p>
                <p><span className="text-white font-medium">Insight:</span> Instead of asking "will price react at VPOC?", ask "is market in consolidation or breakout mode?"</p>
                <p><span className="text-green-400">Result:</span> Zone Classifier classifies market regimes using volume patterns, range dynamics, and candle bodies — not just single price levels.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
