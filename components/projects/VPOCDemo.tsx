'use client'

import { useState, useMemo } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Area,
  AreaChart
} from 'recharts'

// Simulated VPOC touch test data
const generateVPOCTestData = (days: number) => {
  const data = []
  const basePrice = 4500
  let currentPrice = basePrice

  for (let day = 0; day < days; day++) {
    // Generate intraday price movement
    const dayData = []
    const dayHigh = currentPrice + Math.random() * 50
    const dayLow = currentPrice - Math.random() * 50
    const vpoc = dayLow + (dayHigh - dayLow) * (0.3 + Math.random() * 0.4) // VPOC in middle 80% of range

    let price = currentPrice
    let touchedVPOC = false
    let touchTime = -1
    let reversalAfterTouch = false
    let reversalDistance = 0

    // Simulate 100 intraday points
    for (let t = 0; t < 100; t++) {
      const noise = (Math.random() - 0.5) * 2
      price += noise

      // Drift toward VPOC sometimes (price attraction)
      if (t > 20 && t < 70 && !touchedVPOC) {
        price += (vpoc - price) * 0.05
      }

      // Check VPOC touch
      if (!touchedVPOC && Math.abs(price - vpoc) < 2) {
        touchedVPOC = true
        touchTime = t
        const directionBefore = price - dayData[Math.max(0, t - 10)]?.price || 0

        // Simulate reversal (50/50 in reality, but showing for demo)
        if (Math.random() > 0.45) { // Slightly biased for demo
          reversalAfterTouch = true
          reversalDistance = directionBefore > 0 ? 10 + Math.random() * 15 : -(10 + Math.random() * 15)
        }
      }

      // After touch, show reversal if it happened
      if (touchedVPOC && reversalAfterTouch && t > touchTime + 5) {
        const targetPrice = vpoc + reversalDistance
        price += (targetPrice - price) * 0.1
      }

      dayData.push({
        time: t,
        price: price,
        vpoc: vpoc,
        isVPOC: Math.abs(price - vpoc) < 2
      })
    }

    data.push({
      day: day + 1,
      vpoc: vpoc,
      touched: touchedVPOC,
      touchTime: touchTime,
      reversal: reversalAfterTouch,
      reversalDistance: reversalDistance,
      dayData: dayData
    })

    currentPrice = price
  }

  return data
}

export default function VPOCDemo() {
  const [selectedDay, setSelectedDay] = useState(0)
  const [viewMode, setViewMode] = useState<'overview' | 'day' | 'results'>('overview')
  const [testDays, setTestDays] = useState(20)

  const simulatedData = useMemo(() => generateVPOCTestData(testDays), [testDays])

  // Calculate overall statistics
  const stats = useMemo(() => {
    const touchedDays = simulatedData.filter(d => d.touched)
    const reversals = touchedDays.filter(d => d.reversal)

    return {
      totalDays: simulatedData.length,
      vpocTouches: touchedDays.length,
      reversals: reversals.length,
      winRate: touchedDays.length > 0 ? reversals.length / touchedDays.length : 0,
      avgReversal: reversals.length > 0
        ? reversals.reduce((sum, d) => sum + Math.abs(d.reversalDistance), 0) / reversals.length
        : 0
    }
  }, [simulatedData])

  const currentDay = simulatedData[selectedDay] || simulatedData[0]

  if (viewMode === 'overview') {
    return (
      <div className="h-full flex flex-col bg-[#1a1a1a] text-xs font-mono overflow-y-auto">
        {/* Header */}
        <div className="border-b border-white/20 p-4">
          <h2 className="text-lg font-bold text-white mb-1">🔬 VPOC Touch Reversal Research</h2>
          <p className="text-gray-500 text-[10px]">
            Legacy Project • Volume Point of Control Analysis • Archived Results
          </p>
        </div>

        <div className="p-4 space-y-4">
          {/* Theory & Conviction */}
          <div className="bg-black/50 border border-white/10 p-4 rounded">
            <div className="text-green-400 text-[11px] font-semibold mb-3">📚 The Theory</div>
            <div className="text-gray-400 space-y-2 text-[10px]">
              <p><span className="text-white font-medium">Core Thesis:</span> Volume Point of Control (VPOC) is the price level where the most volume traded during a session. This level represents "fair value" for that period.</p>

              <p><span className="text-white font-medium">The Hypothesis:</span> When price returns to a prior day's VPOC level, it should react — either bouncing off (support/resistance) or accelerating through (breakout). If I can detect which, I have an edge.</p>

              <p><span className="text-white font-medium">Expected Behavior:</span></p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Price approaches VPOC → consolidation, testing the level</li>
                <li>If VPOC holds → reversal (bounce) in opposite direction</li>
                <li>If VPOC breaks → accelerated move in breakout direction</li>
              </ul>

              <p className="text-yellow-400">⚠️ This was my first serious research project. I spent months on it. The results... taught me a lot.</p>
            </div>
          </div>

          {/* Methodology */}
          <div className="bg-black/50 border border-white/10 p-4 rounded">
            <div className="text-blue-400 text-[11px] font-semibold mb-3">🔬 How I Tested It</div>
            <div className="text-gray-400 space-y-2 text-[10px]">
              <div className="flex gap-2">
                <span className="text-green-400">1.</span>
                <span><span className="text-white">Data Collection:</span> Used SPY minute data. Calculated VPOC for each day (price level with highest cumulative volume).</span>
              </div>
              <div className="flex gap-2">
                <span className="text-green-400">2.</span>
                <span><span className="text-white">Touch Detection:</span> On day N+1, checked if price ever touched day N's VPOC (within tolerance).</span>
              </div>
              <div className="flex gap-2">
                <span className="text-green-400">3.</span>
                <span><span className="text-white">Direction Analysis:</span> Determined approach direction (from above = expect bounce up, from below = expect bounce down).</span>
              </div>
              <div className="flex gap-2">
                <span className="text-green-400">4.</span>
                <span><span className="text-white">Outcome Testing:</span> For each touch, tested various target/stop combinations (10t/5s, 20t/10s, etc.).</span>
              </div>
              <div className="flex gap-2">
                <span className="text-green-400">5.</span>
                <span><span className="text-white">Statistical Analysis:</span> Calculated win rate, expected value (EV), and sample size for each combo.</span>
              </div>
            </div>
          </div>

          {/* Quick Results */}
          <div className="bg-black/50 border border-white/10 p-4 rounded">
            <div className="text-purple-400 text-[11px] font-semibold mb-3">📊 Results Summary</div>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-2 bg-black rounded">
                <div className="text-gray-600 text-[10px]">VPOC Touches Detected</div>
                <div className="text-white text-lg font-bold">{stats.vpocTouches}/{stats.totalDays} days</div>
              </div>
              <div className="p-2 bg-black rounded">
                <div className="text-gray-600 text-[10px]">Reversals (Touches that Reversed)</div>
                <div className="text-white text-lg font-bold">{stats.reversals}/{stats.vpocTouches}</div>
              </div>
              <div className="p-2 bg-black rounded">
                <div className="text-gray-600 text-[10px]">Win Rate</div>
                <div className={`${stats.winRate > 0.55 ? 'text-green-400' : 'text-red-400'} text-lg font-bold`}>
                  {(stats.winRate * 100).toFixed(1)}%
                </div>
              </div>
              <div className="p-2 bg-black rounded">
                <div className="text-gray-600 text-[10px]">Avg Reversal Distance</div>
                <div className="text-white text-lg font-bold">${stats.avgReversal.toFixed(1)} ticks</div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('day')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
            >
              View Individual Days
            </button>
            <button
              onClick={() => setViewMode('results')}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded"
            >
              Detailed Results Table
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (viewMode === 'day') {
    return (
      <div className="h-full flex flex-col bg-[#1a1a1a] text-xs font-mono">
        {/* Header */}
        <div className="border-b border-white/20 p-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">Day {selectedDay + 1} VPOC Analysis</h2>
            <p className="text-gray-500 text-[10px]">
              {currentDay.touched ? 'VPOC touched' : 'No VPOC touch'} •
              {currentDay.reversal && ' Reversal detected'}
            </p>
          </div>
          <button
            onClick={() => setViewMode('overview')}
            className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded"
          >
            ← Back
          </button>
        </div>

        {/* Chart */}
        <div className="flex-1 p-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={currentDay.dayData}>
              <CartesianGrid stroke="#333" />
              <XAxis dataKey="time" stroke="white" label="Time (minutes)" />
              <YAxis stroke="white" label="Price" domain={['auto', 'auto']} />
              <Tooltip
                contentStyle={{ backgroundColor: 'black', border: '1px solid white' }}
                itemStyle={{ color: 'white' }}
                formatter={(value: any, name: string) => {
                  if (name === 'isVPOC') return [value ? 'At VPOC' : 'No', 'VPOC Touch']
                  return [value.toFixed(2), name]
                }}
              />
              <Line
                type="monotone"
                dataKey="price"
                stroke="#fff"
                dot={false}
                strokeWidth={1.5}
              />
              <ReferenceLine
                y={currentDay.vpoc}
                stroke="#00ff9d"
                strokeDasharray="5 5"
                label={{ value: 'VPOC', fill: '#00ff9d', fontSize: 10 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Day Stats */}
        <div className="p-4 border-t border-white/20 grid grid-cols-4 gap-4">
          <div>
            <div className="text-gray-600 text-[10px]">VPOC Level</div>
            <div className="text-green-400 font-bold">${currentDay.vpoc.toFixed(2)}</div>
          </div>
          {currentDay.touched && (
            <>
              <div>
                <div className="text-gray-600 text-[10px]">Touch Time</div>
                <div className="text-white font-bold">{currentDay.touchTime} min</div>
              </div>
              <div>
                <div className="text-gray-600 text-[10px]">Reversal?</div>
                <div className={`${currentDay.reversal ? 'text-green-400' : 'text-red-400'} font-bold`}>
                  {currentDay.reversal ? 'Yes ✓' : 'No ✗'}
                </div>
              </div>
              {currentDay.reversal && (
                <div>
                  <div className="text-gray-600 text-[10px]">Reversal Distance</div>
                  <div className="text-white font-bold">${Math.abs(currentDay.reversalDistance).toFixed(1)} ticks</div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Day Navigation */}
        <div className="p-4 border-t border-white/20 flex items-center gap-4">
          <button
            onClick={() => setSelectedDay(Math.max(0, selectedDay - 1))}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded disabled:opacity-50"
            disabled={selectedDay === 0}
          >
            ← Previous Day
          </button>
          <div className="flex-1 text-center text-gray-500">
            Day {selectedDay + 1} of {simulatedData.length}
          </div>
          <button
            onClick={() => setSelectedDay(Math.min(simulatedData.length - 1, selectedDay + 1))}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded disabled:opacity-50"
            disabled={selectedDay === simulatedData.length - 1}
          >
            Next Day →
          </button>
        </div>
      </div>
    )
  }

  if (viewMode === 'results') {
    return (
      <div className="h-full flex flex-col bg-[#1a1a1a] text-xs font-mono">
        <div className="border-b border-white/20 p-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Detailed Results Table</h2>
          <button
            onClick={() => setViewMode('overview')}
            className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded"
          >
            ← Back
          </button>
        </div>

        <div className="flex-1 overflow-auto p-4">
          <table className="w-full text-left">
            <thead className="sticky top-0 bg-[#1a1a1a]">
              <tr className="border-b border-white/20">
                <th className="p-2 text-gray-500">Day</th>
                <th className="p-2 text-gray-500">VPOC Level</th>
                <th className="p-2 text-gray-500">Touched?</th>
                <th className="p-2 text-gray-500">Reversal?</th>
                <th className="p-2 text-gray-500">Distance</th>
                <th className="p-2 text-gray-500">Result</th>
              </tr>
            </thead>
            <tbody>
              {simulatedData.map((day, idx) => (
                <tr key={idx} className="border-b border-white/10 hover:bg-white/5">
                  <td className="p-2 text-white">{idx + 1}</td>
                  <td className="p-2 text-green-400">${day.vpoc.toFixed(2)}</td>
                  <td className="p-2">
                    {day.touched ? (
                      <span className="text-yellow-400">Yes (t={day.touchTime})</span>
                    ) : (
                      <span className="text-gray-600">No</span>
                    )}
                  </td>
                  <td className="p-2">
                    {day.reversal ? (
                      <span className="text-green-400">✓ Reversed</span>
                    ) : day.touched ? (
                      <span className="text-red-400">✗ Failed</span>
                    ) : (
                      <span className="text-gray-600">—</span>
                    )}
                  </td>
                  <td className="p-2 text-white">
                    {day.reversal ? `$${Math.abs(day.reversalDistance).toFixed(1)}` : '—'}
                  </td>
                  <td className="p-2">
                    {day.reversal ? (
                      <span className="text-green-400">WIN</span>
                    ) : day.touched ? (
                      <span className="text-red-400">LOSS</span>
                    ) : (
                      <span className="text-gray-600">NO TOUCH</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  return null
}
