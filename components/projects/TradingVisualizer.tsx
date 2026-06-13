'use client'

import { useState, useEffect, useRef } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  ReferenceArea,
  BarChart,
  Bar,
  Cell
} from 'recharts'

// Mock equity curve data (sample/anonymized)
const generateEquityData = (days = 90) => {
  const data = []
  let equity = 10000
  let peak = equity
  let maxDrawdown = 0

  for (let i = 0; i < days; i++) {
    const dailyReturn = (Math.random() - 0.45) * 200 // Slight positive drift
    equity += dailyReturn

    if (equity > peak) peak = equity
    const drawdown = ((peak - equity) / peak) * 100
    if (drawdown > maxDrawdown) maxDrawdown = drawdown

    // Determine regime based on volatility pattern
    const volatility = Math.abs(dailyReturn)
    let zone = 1 // Neutral
    if (volatility > 100) zone = 3 // Breakout
    else if (volatility > 50) zone = 2 // Consolidation

    data.push({
      day: i + 1,
      date: new Date(2025, 9, i + 1).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      equity: Math.round(equity),
      return: dailyReturn,
      returnColor: dailyReturn >= 0 ? '#10b981' : '#ef4444',
      drawdown: ((peak - equity) / peak) * 100,
      zone,
      isDrawdownPeriod: drawdown > 5
    })
  }

  return { data, maxDrawdown, finalEquity: equity }
}

// Zone colors
const ZONE_COLORS = {
  1: '#555', // Neutral - gray
  2: '#f59e0b', // Consolidation - amber
  3: '#10b981' // Breakout - green
}

const ZONE_NAMES = {
  1: 'Neutral (Wait)',
  2: 'Consolidation (Avoid)',
  3: 'Breakout (Enter)'
}

export default function TradingVisualizer() {
  const [equityData, setEquityData] = useState(generateEquityData())
  const [animateIndex, setAnimateIndex] = useState(0)
  const [showZones, setShowZones] = useState(true)
  const [selectedMetric, setSelectedMetric] = useState<'equity' | 'returns' | 'zones'>('equity')
  const intervalRef = useRef<NodeJS.Timeout>()

  // Animation for equity curve
  useEffect(() => {
    if (animateIndex < equityData.data.length) {
      intervalRef.current = setTimeout(() => {
        setAnimateIndex(prev => Math.min(prev + 2, equityData.data.length))
      }, 30)
    }
    return () => clearInterval(intervalRef.current)
  }, [animateIndex, equityData.data.length])

  const replayAnimation = () => {
    setAnimateIndex(0)
    setEquityData(generateEquityData()) // Fresh data on replay
  }

  // Calculate stats
  const totalReturn = ((equityData.finalEquity - 10000) / 10000) * 100
  const returns = equityData.data.map(d => d.return)
  const avgReturn = returns.reduce((a, b) => a + b, 0) / returns.length
  const winRate = (returns.filter(r => r > 0).length / returns.length) * 100
  const volatility = Math.sqrt(returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / returns.length)
  const sharpe = (avgReturn / volatility) * Math.sqrt(252) // Annualized

  // Zone distribution
  const zoneDistribution = [
    { zone: 'Neutral', count: equityData.data.filter(d => d.zone === 1).length, color: ZONE_COLORS[1] },
    { zone: 'Consolidation', count: equityData.data.filter(d => d.zone === 2).length, color: ZONE_COLORS[2] },
    { zone: 'Breakout', count: equityData.data.filter(d => d.zone === 3).length, color: ZONE_COLORS[3] }
  ]

  const displayedData = equityData.data.slice(0, animateIndex)

  return (
    <div className="h-full flex flex-col p-4 bg-black font-mono text-xs">
      {/* Header */}
      <div className="flex justify-between items-start border-b border-gray-800 pb-3 mb-4">
        <div>
          <h2 className="text-lg font-bold text-white mb-1">Strategy Backtest Results</h2>
          <div className="text-gray-500">90-Day Walk-Forward Analysis • Sample Data</div>
        </div>
        <button
          onClick={replayAnimation}
          className="px-3 py-1.5 border border-white hover:bg-white hover:text-black transition-colors"
        >
          Replay Animation
        </button>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-4 gap-3 mb-4">
        <div className="border border-gray-800 p-3">
          <div className="text-gray-600 text-[10px] uppercase tracking-wider mb-1">Total Return</div>
          <div className={`text-lg font-bold ${totalReturn >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {totalReturn >= 0 ? '+' : ''}{totalReturn.toFixed(1)}%
          </div>
        </div>
        <div className="border border-gray-800 p-3">
          <div className="text-gray-600 text-[10px] uppercase tracking-wider mb-1">Sharpe Ratio</div>
          <div className="text-lg font-bold text-white">{sharpe.toFixed(2)}</div>
        </div>
        <div className="border border-gray-800 p-3">
          <div className="text-gray-600 text-[10px] uppercase tracking-wider mb-1">Max Drawdown</div>
          <div className="text-lg font-bold text-red-400">{equityData.maxDrawdown.toFixed(1)}%</div>
        </div>
        <div className="border border-gray-800 p-3">
          <div className="text-gray-600 text-[10px] uppercase tracking-wider mb-1">Win Rate</div>
          <div className="text-lg font-bold text-white">{winRate.toFixed(0)}%</div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setSelectedMetric('equity')}
          className={`px-3 py-1.5 border transition-colors ${
            selectedMetric === 'equity'
              ? 'border-green-400 text-green-400'
              : 'border-gray-700 text-gray-500 hover:border-white'
          }`}
        >
          Equity Curve
        </button>
        <button
          onClick={() => setSelectedMetric('returns')}
          className={`px-3 py-1.5 border transition-colors ${
            selectedMetric === 'returns'
              ? 'border-green-400 text-green-400'
              : 'border-gray-700 text-gray-500 hover:border-white'
          }`}
        >
          Daily Returns
        </button>
        <button
          onClick={() => setSelectedMetric('zones')}
          className={`px-3 py-1.5 border transition-colors ${
            selectedMetric === 'zones'
              ? 'border-green-400 text-green-400'
              : 'border-gray-700 text-gray-500 hover:border-white'
          }`}
        >
          Zone Classification
        </button>
        <button
          onClick={() => setShowZones(!showZones)}
          className={`px-3 py-1.5 border transition-colors ${
            showZones
              ? 'border-green-400 text-green-400'
              : 'border-gray-700 text-gray-500 hover:border-white'
          }`}
        >
          {showZones ? 'Hide Zones' : 'Show Zones'}
        </button>
      </div>

      {/* Charts */}
      <div className="flex-1 min-h-0">
        {selectedMetric === 'equity' && (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={displayedData}>
              <defs>
                <linearGradient id="equityGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#333" strokeDasharray="2 2"/>
              <XAxis
                dataKey="day"
                stroke="#666"
                tick={{ fill: '#666', fontSize: 10 }}
                tickFormatter={(v) => `Day ${v}`}
              />
              <YAxis
                stroke="#666"
                tick={{ fill: '#666', fontSize: 10 }}
                tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                domain={[9500, 11500]}
              />
              <Tooltip
                contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}
                itemStyle={{ color: '#fff' }}
                labelStyle={{ color: '#666' }}
                formatter={(value: any, name: string) => {
                  if (name === 'equity') return [`$${value.toFixed(0)}`, 'Equity']
                  return [value, name]
                }}
                labelFormatter={(label) => `Day ${label}`}
              />
              <Area
                type="monotone"
                dataKey="equity"
                stroke="#10b981"
                strokeWidth={2}
                fill="url(#equityGradient)"
                isAnimationActive={false}
              />
              {/* Drawdown highlight */}
              {displayedData.map((d, i) =>
                d.isDrawdownPeriod && i > 0 && displayedData[i - 1].isDrawdownPeriod ? (
                  <ReferenceArea
                    key={`dd-${i}`}
                    x1={i - 1} x2={i}
                    stroke="#ef4444"
                    strokeOpacity={0.2}
                    fill="#ef4444"
                    fillOpacity={0.1}
                  />
                ) : null
              )}
            </AreaChart>
          </ResponsiveContainer>
        )}

        {selectedMetric === 'returns' && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={displayedData}>
              <CartesianGrid stroke="#333" strokeDasharray="2 2"/>
              <XAxis
                dataKey="day"
                stroke="#666"
                tick={{ fill: '#666', fontSize: 10 }}
              />
              <YAxis
                stroke="#666"
                tick={{ fill: '#666', fontSize: 10 }}
                tickFormatter={(v) => `$${v}`}
              />
              <Tooltip
                contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}
                itemStyle={{ color: '#fff' }}
                formatter={(value: any) => [`$${value.toFixed(0)}`, 'Return']}
              />
              <Bar dataKey="return" isAnimationActive={false}>
                {displayedData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.returnColor} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}

        {selectedMetric === 'zones' && (
          <div className="h-full flex flex-col">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={zoneDistribution} layout="horizontal">
                <CartesianGrid stroke="#333" strokeDasharray="2 2"/>
                <XAxis
                  type="number"
                  stroke="#666"
                  tick={{ fill: '#666', fontSize: 10 }}
                />
                <YAxis
                  type="category"
                  dataKey="zone"
                  stroke="#666"
                  tick={{ fill: '#666', fontSize: 10 }}
                  width={120}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}
                  itemStyle={{ color: '#fff' }}
                  formatter={(value: any) => [`${value} days`, 'Days']}
                />
                <Bar dataKey="count" isAnimationActive={false}>
                  {zoneDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>

            {/* Zone Timeline */}
            <div className="flex-1 mt-4 border-t border-gray-800 pt-4">
              <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-2">Regime Timeline</div>
              <div className="flex h-8 rounded overflow-hidden">
                {displayedData.map((d, i) => (
                  <div
                    key={i}
                    className="flex-1"
                    style={{ backgroundColor: ZONE_COLORS[d.zone as keyof typeof ZONE_COLORS] }}
                    title={`Day ${d.day}: ${ZONE_NAMES[d.zone as keyof typeof ZONE_NAMES]}`}
                  />
                ))}
              </div>
              <div className="flex justify-between mt-2 text-[10px] text-gray-600">
                <span>Day 1</span>
                <span>Day {displayedData.length}</span>
              </div>
            </div>

            {/* Zone Legend */}
            <div className="flex gap-4 mt-4 text-[10px]">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3" style={{ backgroundColor: ZONE_COLORS[1] }} />
                <span className="text-gray-400">{ZONE_NAMES[1]}</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3" style={{ backgroundColor: ZONE_COLORS[2] }} />
                <span className="text-gray-400">{ZONE_NAMES[2]}</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3" style={{ backgroundColor: ZONE_COLORS[3] }} />
                <span className="text-gray-400">{ZONE_NAMES[3]}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Symbolic Formula Display */}
      <div className="mt-4 pt-4 border-t border-gray-800">
        <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-2">Discovered Symbolic Formula (Interpretable ML)</div>
        <div className="text-[10px] text-gray-400 bg-gray-900 p-3 rounded font-mono leading-relaxed">
          <div className="text-green-400 mb-1">
            regime_signal = 0.52 × ATR_ratio + 0.31 × volume_surge - 0.18 / (price_velocity + 0.1)
          </div>
          <div className="text-gray-500">
            • Discovered via symbolic regression (genetic programming)<br/>
            • Uses classic features: ATR, volume momentum, price velocity<br/>
            • 11 operations | Interpretable | Zero inference overhead
          </div>
        </div>
        <div className="mt-2 text-[10px] text-gray-600">
          <span className="text-gray-500">Features:</span> ATR (Average True Range) measures volatility,
          volume_surge detects participation changes, price_velocity captures momentum speed.
          Standard technical indicators combined via symbolic discovery.
        </div>
      </div>
    </div>
  )
}
