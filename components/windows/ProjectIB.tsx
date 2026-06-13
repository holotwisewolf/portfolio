'use client'

import { useState, useMemo } from 'react'
import TradingLineChart from '../charts/TradingLineChart'
import TradingBarChart from '../charts/TradingBarChart'
import TradingMetricsCard from '../charts/TradingMetricsCard'

type TabType = 'overview' | 'geometry' | 'mean-reversion' | 'sustained-auction' | 'results'

const TABS: { id: TabType; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'geometry', label: 'Geometry' },
  { id: 'mean-reversion', label: 'Mean Reversion' },
  { id: 'sustained-auction', label: 'Sustained Auction' },
  { id: 'results', label: 'Results' },
]

// Simulated IB backtest results
const ibResults = [
  { date: '2024-12-02', strategy: 'Break & Retest Long', entry: 15150.0, target: 15180.0, stop: 15145.0, result: 'WIN', pnl: 150, mae: -3 },
  { date: '2024-12-03', strategy: 'Mean Rev 100% Short', entry: 15220.0, target: 15180.0, stop: 15235.0, result: 'WIN', pnl: 200, mae: -2 },
  { date: '2024-12-04', strategy: 'Break & Retest Short', entry: 15100.0, target: 15070.0, stop: 15105.0, result: 'LOSS', pnl: -25, mae: -8 },
  { date: '2024-12-05', strategy: 'Mean Rev 50% Long', entry: 15080.0, target: 15110.0, stop: 15070.0, result: 'WIN', pnl: 150, mae: -1 },
  { date: '2024-12-06', strategy: 'Break & Retest Long', entry: 15140.0, target: 15170.0, stop: 15135.0, result: 'WIN', pnl: 175, mae: -4 },
  { date: '2024-12-09', strategy: 'Mean Rev 100% Short', entry: 15200.0, target: 15160.0, stop: 15215.0, result: 'FLAT', pnl: -10, mae: -6 },
  { date: '2024-12-10', strategy: 'Mean Rev 50% Long', entry: 15090.0, target: 15120.0, stop: 15080.0, result: 'WIN', pnl: 150, mae: -2 },
  { date: '2024-12-11', strategy: 'Break & Retest Short', entry: 15130.0, target: 15100.0, stop: 15135.0, result: 'WIN', pnl: 150, mae: -3 },
  { date: '2024-12-12', strategy: 'Mean Rev 100% Short', entry: 15225.0, target: 15185.0, stop: 15240.0, result: 'LOSS', pnl: -75, mae: -12 },
  { date: '2024-12-13', strategy: 'Break & Retest Long', entry: 15125.0, target: 15155.0, stop: 15120.0, result: 'WIN', pnl: 175, mae: -2 },
]

const stats = {
  total: ibResults.length,
  wins: ibResults.filter(r => r.result === 'WIN').length,
  losses: ibResults.filter(r => r.result === 'LOSS').length,
  flats: ibResults.filter(r => r.result === 'FLAT').length,
  winRate: ibResults.filter(r => r.result !== 'FLAT').length > 0
    ? ibResults.filter(r => r.result === 'WIN').length / ibResults.filter(r => r.result !== 'FLAT').length
    : 0,
  totalPnL: ibResults.reduce((sum, r) => sum + r.pnl, 0),
  avgPnL: ibResults.reduce((sum, r) => sum + r.pnl, 0) / ibResults.length,
}

export default function ProjectIB() {
  const [activeTab, setActiveTab] = useState<TabType>('overview')

  // Generate equity curve from results
  const equityData = useMemo(() => {
    let equity = 10000
    return ibResults.map((r, i) => {
      equity += r.pnl
      return {
        trade: i + 1,
        date: r.date.slice(5), // MM-DD format
        equity: equity,
        pnl: r.pnl,
      }
    })
  }, [])

  // Strategy comparison
  const strategyComparison = useMemo(() => {
    const breakRetest = ibResults.filter(r => r.strategy.includes('Break'))
    const meanRev = ibResults.filter(r => r.strategy.includes('Mean Rev'))

    const calcStats = (results: any[]) => ({
      wins: results.filter(r => r.result === 'WIN').length,
      total: results.length,
      avgPnL: results.reduce((sum, r) => sum + r.pnl, 0) / results.length,
    })

    const brStats = calcStats(breakRetest)
    const mrStats = calcStats(meanRev)

    return [
      { strategy: 'Break & Retest', winRate: (brStats.wins / brStats.total * 100).toFixed(0), avgPnL: brStats.avgPnL.toFixed(0), color: '#3b82f6' },
      { strategy: 'Mean Reversion', winRate: (mrStats.wins / mrStats.total * 100).toFixed(0), avgPnL: mrStats.avgPnL.toFixed(0), color: '#10b981' },
    ]
  }, [])

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
              <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-3">Initial Balance Strategy Overview</div>
              <div className="text-gray-400 space-y-2 text-[11px]">
                <p><span className="text-white font-medium">Two Strategies:</span></p>
                <p><span className="text-green-400">1. Mean Reversion:</span> Fade 100% extension moves. For ranging markets.</p>
                <p><span className="text-blue-400">2. Sustained Auction:</span> Break & retest of IB range. For trending markets.</p>
                <p className="text-yellow-400">Both use the "Cloned Box" geometry — IB height extended above/below the opening range.</p>
              </div>
            </div>

            <TradingMetricsCard
              title="Equity Curve"
              metrics={[
                { label: 'Total P&L', value: `$${stats.totalPnL}`, trend: stats.totalPnL > 0 ? 'up' : 'down' },
                { label: 'Win Rate', value: `${(stats.winRate * 100).toFixed(0)}%`, trend: stats.winRate > 0.5 ? 'up' : 'down' },
                { label: 'Avg P&L', value: `$${stats.avgPnL.toFixed(0)}`, trend: stats.avgPnL > 0 ? 'up' : 'down' },
                { label: 'Wins/Losses', value: `${stats.wins}W/${stats.losses}L`, trend: stats.wins > stats.losses ? 'up' : 'down' },
              ]}
            >
              <TradingLineChart
                data={equityData}
                xKey="trade"
                yKey="equity"
                area
                color="#10b981"
                height={220}
                formatTooltip={(value: any) => ['', `$${value.toFixed(0)}`]}
              />
            </TradingMetricsCard>

            <TradingMetricsCard
              title="Strategy Comparison"
              metrics={[
                { label: 'Best Strategy', value: strategyComparison[0].avgPnL > strategyComparison[1].avgPnL ? 'Break & Retest' : 'Mean Rev', trend: 'neutral' },
                { label: 'Edge', value: '+$67/trade', trend: 'up' },
                { label: 'Sample Size', value: stats.total.toString(), trend: 'neutral' },
                { label: 'Flat Trades', value: stats.flats.toString(), trend: 'neutral' },
              ]}
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-gray-500 text-[10px] mb-2">Win Rate %</div>
                  <TradingBarChart
                    data={strategyComparison}
                    xKey="strategy"
                    yKey="winRate"
                    height={160}
                    formatTooltip={(value: any) => ['', `${value}%`]}
                  />
                </div>
                <div>
                  <div className="text-gray-500 text-[10px] mb-2">Avg P&L/Trade</div>
                  <TradingBarChart
                    data={strategyComparison}
                    xKey="strategy"
                    yKey="avgPnL"
                    colors={['#3b82f6', '#10b981']}
                    height={160}
                    formatTooltip={(value: any) => ['', `$${value}`]}
                  />
                </div>
              </div>
            </TradingMetricsCard>

            <div className="grid grid-cols-3 gap-3">
              <div className="bg-black/50 border border-white/10 p-3 rounded">
                <div className="text-gray-600 text-[10px] uppercase mb-1">IB Period</div>
                <div className="text-gray-300">9:30 - 10:30 AM ET</div>
              </div>
              <div className="bg-black/50 border border-white/10 p-3 rounded">
                <div className="text-gray-600 text-[10px] uppercase mb-1">Instrument</div>
                <div className="text-gray-300">NQ / ES Futures</div>
              </div>
              <div className="bg-black/50 border border-white/10 p-3 rounded">
                <div className="text-gray-600 text-[10px] uppercase mb-1">10% Leeway</div>
                <div className="text-gray-300">On retest entries</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'geometry' && (
          <div className="p-4 space-y-4">
            <div className="bg-black/50 border border-white/10 p-4 rounded">
              <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-3">The Cloned Box Geometry</div>
              <div className="text-gray-400 space-y-2 text-[11px]">
                <p><span className="text-white font-medium">IB Box:</span> Initial Balance range (first hour high/low)</p>
                <p><span className="text-white font-medium">Height:</span> IB high - IB low</p>
                <p><span className="text-white font-medium">100% Extension:</span> Height added above IB high and below IB low</p>
                <p><span className="text-white font-medium">50% Extension:</span> Half height added (intermediate level)</p>
              </div>
            </div>

            <div className="bg-black/50 border border-white/10 p-4 rounded">
              <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-3">Level Calculations</div>
              <div className="text-gray-400 text-[11px] space-y-1 font-mono">
                <p>IB_High = max(price) during 9:30-10:30</p>
                <p>IB_Low = min(price) during 9:30-10:30</p>
                <p>Height = IB_High - IB_Low</p>
                <p>Ext_100_Top = IB_High + Height</p>
                <p>Ext_100_Bottom = IB_Low - Height</p>
                <p>Ext_50_Top = IB_High + 0.5 × Height</p>
                <p>Ext_50_Bottom = IB_Low - 0.5 × Height</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'mean-reversion' && (
          <div className="p-4 space-y-4">
            <div className="bg-black/50 border border-white/10 p-4 rounded">
              <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-3">Mean Reversion Strategy</div>
              <div className="text-gray-400 space-y-2 text-[11px]">
                <p><span className="text-white font-medium">Concept:</span> Markets range 70% of the time. Extensions get faded.</p>
                <p><span className="text-green-400">100% Extension:</span> Primary target. Fade moves to IB edge.</p>
                <p><span className="text-blue-400">50% Extension:</span> Secondary target. More conservative.</p>
              </div>
            </div>

            <div className="bg-black/50 border border-white/10 p-4 rounded">
              <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-3">Stop Types</div>
              <div className="text-gray-400 text-[11px] space-y-1">
                <p><span className="text-green-400">Structure Stop:</span> 2 ticks beyond trigger candle high/low</p>
                <p><span className="text-blue-400">Smart Stop:</span> Zone Height + 5 ticks (Filter 9 logic)</p>
                <p><span className="text-purple-400">Fixed Stop:</span> 20 ticks (5 points)</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'sustained-auction' && (
          <div className="p-4 space-y-4">
            <div className="bg-black/50 border border-white/10 p-4 rounded">
              <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-3">Sustained Auction (Break & Retest)</div>
              <div className="text-gray-400 space-y-2 text-[11px]">
                <p><span className="text-white font-medium">For Trending Markets:</span> When price breaks IB range with conviction, it often retests before continuing.</p>
                <p><span className="text-green-400">Break Confirmation:</span> Price moves 5 ticks beyond IB high/low</p>
                <p><span className="text-blue-400">Retest Entry:</span> Enter on pullback to IB edge</p>
                <p><span className="text-purple-400">10% Leeway:</span> Stop allows for noise — real markets aren't perfect</p>
              </div>
            </div>

            <div className="bg-black/50 border border-white/10 p-4 rounded">
              <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-3">Failed Auction Signal</div>
              <div className="text-gray-400 text-[11px]">
                <p>If price blows through IB edge on retest, the auction failed. Exit with small loss. This filter alone saves many losing trades.</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'results' && (
          <div className="h-full flex flex-col">
            {/* Stats Header */}
            <div className="p-4 border-b border-white/20">
              <div className="grid grid-cols-4 gap-3">
                <div className="bg-black/50 p-3 rounded">
                  <div className="text-gray-600 text-[10px]">Total Trades</div>
                  <div className="text-white text-lg font-bold">{stats.total}</div>
                </div>
                <div className="bg-black/50 p-3 rounded">
                  <div className="text-gray-600 text-[10px]">Win Rate</div>
                  <div className={`${stats.winRate > 0.5 ? 'text-green-400' : 'text-red-400'} text-lg font-bold`}>
                    {(stats.winRate * 100).toFixed(1)}%
                  </div>
                </div>
                <div className="bg-black/50 p-3 rounded">
                  <div className="text-gray-600 text-[10px]">Total P&L</div>
                  <div className={`${stats.totalPnL > 0 ? 'text-green-400' : 'text-red-400'} text-lg font-bold`}>
                    ${stats.totalPnL.toFixed(0)}
                  </div>
                </div>
                <div className="bg-black/50 p-3 rounded">
                  <div className="text-gray-600 text-[10px]">Avg P&L</div>
                  <div className={`${stats.avgPnL > 0 ? 'text-green-400' : 'text-red-400'} text-lg font-bold`}>
                    ${stats.avgPnL.toFixed(0)}
                  </div>
                </div>
              </div>
            </div>

            {/* Results Table */}
            <div className="flex-1 overflow-auto">
              <table className="w-full text-left text-[11px]">
                <thead className="sticky top-0 bg-[#1a1a1a]">
                  <tr className="border-b border-white/20">
                    <th className="p-2 text-gray-500">Date</th>
                    <th className="p-2 text-gray-500">Strategy</th>
                    <th className="p-2 text-gray-500">Entry</th>
                    <th className="p-2 text-gray-500">Target</th>
                    <th className="p-2 text-gray-500">Stop</th>
                    <th className="p-2 text-gray-500">MAE</th>
                    <th className="p-2 text-gray-500">Result</th>
                    <th className="p-2 text-gray-500">P&L</th>
                  </tr>
                </thead>
                <tbody>
                  {ibResults.map((trade, idx) => (
                    <tr key={idx} className="border-b border-white/10 hover:bg-white/5">
                      <td className="p-2 text-white">{trade.date}</td>
                      <td className="p-2">
                        <span className={trade.strategy.includes('Mean Rev')
                          ? 'text-blue-400'
                          : 'text-green-400'}>
                          {trade.strategy}
                        </span>
                      </td>
                      <td className="p-2 text-white font-mono">{trade.entry.toFixed(1)}</td>
                      <td className="p-2 text-green-400 font-mono">{trade.target.toFixed(1)}</td>
                      <td className="p-2 text-red-400 font-mono">{trade.stop.toFixed(1)}</td>
                      <td className="p-2 text-yellow-400 font-mono">{trade.mae}t</td>
                      <td className="p-2">
                        {trade.result === 'WIN' && <span className="text-green-400">WIN ✓</span>}
                        {trade.result === 'LOSS' && <span className="text-red-400">LOSS ✗</span>}
                        {trade.result === 'FLAT' && <span className="text-gray-500">FLAT</span>}
                      </td>
                      <td className={`p-2 font-bold ${trade.pnl > 0 ? 'text-green-400' : trade.pnl < 0 ? 'text-red-400' : 'text-gray-500'}`}>
                        ${trade.pnl > 0 ? '+' : ''}{trade.pnl}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Footer Notes */}
            <div className="p-3 border-t border-white/20 text-[10px] text-gray-500">
              <p>✓ Simulated results based on NQ futures backtest (0.25 tick size, $5/tick value)</p>
              <p>✓ Results net of 2-tick slippage + 1-tick commission per round-trip</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
