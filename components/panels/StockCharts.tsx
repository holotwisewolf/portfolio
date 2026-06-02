'use client'

import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import StatRow from '@/components/ui/StatRow'
import ActivityGrid from '@/components/ui/ActivityGrid'
import LanguageBars, { Language } from '@/components/ui/LanguageBars'
import AsciiGlobe from '@/components/ui/AsciiGlobe'

interface StockData {
  time: string
  price: number
}

interface ChartData {
  symbol: string
  data: StockData[]
  currentPrice: number
  change: number
  changePercent: number
}

export default function StockCharts() {
  const [charts, setCharts] = useState<{ [key: string]: ChartData }>({
    SPY: { symbol: 'SPY', data: [], currentPrice: 0, change: 0, changePercent: 0 },
    QQQ: { symbol: 'QQQ', data: [], currentPrice: 0, change: 0, changePercent: 0 }
  })
  const [vixData, setVixData] = useState<ChartData>({ symbol: 'VIX', data: [], currentPrice: 0, change: 0, changePercent: 0 })
  const [loading, setLoading] = useState(true)
  const [marketOpen, setMarketOpen] = useState(true)
  const [vix, setVix] = useState(18.4)
  const [previousVix, setPreviousVix] = useState(18.4)
  const [githubStats, setGithubStats] = useState({ repos: 0, followers: 0 })
  const [commitActivity, setCommitActivity] = useState<number[]>([])
  const [languages, setLanguages] = useState<Language[]>([
    { name: 'JavaScript', percentage: 48 },
    { name: 'TypeScript', percentage: 28 },
    { name: 'Python', percentage: 16 },
    { name: 'Other', percentage: 8 }
  ])

  const fetchStockData = async () => {
    try {
      const res = await fetch('/api/stocks?symbols=SPY,QQQ,^VIX')
      const data = await res.json()

      if (data.quotes) {
        const newCharts: { [key: string]: ChartData } = {}
        let vixQuote: any = null

        for (const quote of data.quotes) {
          const symbol = quote.symbol
          const price = quote.price || 0
          const change = quote.change || 0
          const changePercent = quote.changePercent || 0

          // Use real historical data from API, or fallback to empty array
          const historicalData: StockData[] = quote.historical?.map((h: any) => ({
            time: h.time,
            price: h.price
          })) || []

          if (symbol === '^VIX' || symbol === 'VIX') {
            // Store VIX separately, don't add to charts
            vixQuote = {
              symbol: 'VIX',
              data: historicalData,
              currentPrice: price,
              change,
              changePercent
            }
          } else {
            newCharts[symbol] = {
              symbol,
              data: historicalData,
              currentPrice: price,
              change,
              changePercent
            }
          }
        }

        setCharts(newCharts)
        setLoading(false)

        // Update VIX from real data
        if (vixQuote?.currentPrice) {
          setPreviousVix(vix)
          setVix(vixQuote.currentPrice)
        }
      }
    } catch (error) {
      console.error('Failed to fetch stock data:', error)
      // Keep showing previous data on error, don't clear it
    }
  }

  useEffect(() => {
    fetchStockData()
    // Poll every 30 minutes
    const interval = setInterval(fetchStockData, 30 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  // Fetch GitHub stats
  useEffect(() => {
    const fetchGitHubStats = async () => {
      try {
        const res = await fetch('/api/github')
        const data = await res.json()
        if (data && !data.error) {
          setGithubStats({
            repos: data.publicRepos || 0,
            followers: data.followers || 0
          })
          // Set commit activity if available
          if (data.commitActivity && Array.isArray(data.commitActivity)) {
            setCommitActivity(data.commitActivity)
          }
          // Set languages if available
          if (data.languages && Array.isArray(data.languages)) {
            setLanguages(data.languages.map((l: any) => ({ name: l.language, percentage: l.percentage })))
          }
        }
      } catch (error) {
        console.error('Failed to fetch GitHub stats:', error)
      }
    }
    fetchGitHubStats()
  }, [])

  // Check if market is open (9:30 AM - 4:00 PM ET, Mon-Fri)
  useEffect(() => {
    const now = new Date()
    const et = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }))
    const hour = et.getHours()
    const minute = et.getMinutes()
    const day = et.getDay()
    const time = hour * 60 + minute
    const marketStart = 9 * 60 + 30 // 9:30 AM
    const marketEnd = 16 * 60 // 4:00 PM
    setMarketOpen(day >= 1 && day <= 5 && time >= marketStart && time <= marketEnd)
  }, [])

  return (
    <div className="h-full bg-black border-l border-white font-mono text-xs flex flex-col p-3">
      {/* Panel Label */}
      <div className="text-[9px] tracking-widest text-white uppercase pb-1 mb-2">
        Stats
      </div>

      {/* Market Watch Block */}
      <div className="mb-3">
        <div className="text-[9px] text-gray-600 tracking-widest uppercase mb-1">Market watch</div>

        {loading ? (
          <div className="text-gray-500 text-center py-8">Loading...</div>
        ) : (
          <>
            {Object.values(charts).map((chart) => {
              // Check if we have valid data
              const hasData = chart.data && Array.isArray(chart.data) && chart.data.length > 0
              const validPrice = chart.currentPrice != null && !isNaN(chart.currentPrice) && chart.currentPrice > 0

              // If no valid data, show loading message
              if (!hasData || !validPrice) {
                return (
                  <div key={chart.symbol} className="mb-3">
                    <div className="flex justify-between items-baseline mb-1">
                      <span className="text-gray-300">{chart.symbol}</span>
                      <span className="text-gray-500 text-sm">Loading...</span>
                    </div>
                  </div>
                )
              }

              return (
              <div key={chart.symbol} className="mb-3">
                <div className="flex justify-between items-baseline mb-1">
                  <span className="text-gray-300">{chart.symbol}</span>
                  <span className="text-white text-sm">
                    ${chart.currentPrice.toFixed(2)}{' '}
                    {chart.changePercent != null && !isNaN(chart.changePercent) && (
                      <span className={`text-[10px] ${chart.changePercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {chart.changePercent >= 0 ? '+' : ''}{chart.changePercent.toFixed(2)}%
                      </span>
                    )}
                  </span>
                </div>
                {hasData && (
                  <ResponsiveContainer width="100%" height={40}>
                    <LineChart data={chart.data} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                    <XAxis
                      dataKey="time"
                      stroke="#444"
                      tick={{ fill: '#444', fontSize: 8 }}
                      tickFormatter={(value) => value === 'now' ? 'n' : value.replace('h', '')}
                    />
                    <YAxis
                      domain={[chart.data.reduce((min, d) => Math.min(min, d.price), Infinity) - 2, chart.data.reduce((max, d) => Math.max(max, d.price), -Infinity) + 2]}
                      stroke="#333"
                      tick={{ fill: '#666', fontSize: 7 }}
                      width={40}
                      tickCount={6}
                      interval="preserveStartEnd"
                      tickFormatter={(value) => value.toFixed(1)}
                    />
                    <Line
                      type="monotone"
                      dataKey="price"
                      stroke="white"
                      strokeWidth={1.5}
                      dot={false}
                      isAnimationActive={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
                )}
              </div>
              )
            })}

            <StatRow
              label="VIX"
              value={`${vix.toFixed(1)} ${vix > previousVix ? '▲' : vix < previousVix ? '▼' : '→'}`}
              valueClass={vix > 20 ? 'text-red-400' : 'text-green-400'}
            />
            <StatRow
              label="MARKET"
              value={marketOpen ? 'OPEN' : 'CLOSED'}
              valueClass={marketOpen ? 'text-white' : 'text-gray-600'}
            />

            <div className="text-[9px] text-gray-700 italic mt-2">
              wanna-be quant. paper trading only.
            </div>
          </>
        )}
      </div>

      {/* Dev Activity Block */}
      <div className="flex-1">
        <div className="text-[9px] text-gray-600 tracking-widest uppercase mb-2">Dev activity</div>

        {/* Activity Dots - right under header */}
        <div className="mb-3">
          <div className="text-[9px] text-gray-700 mb-1">Commit activity (35 days)</div>
          <ActivityGrid dots={35} commits={commitActivity} />
        </div>

        <StatRow label="REPOSITORIES" value={githubStats.repos.toString()} valueClass="text-white" />
        <StatRow label="FOLLOWERS" value={githubStats.followers.toString()} valueClass="text-white" />

        {/* Language Bars */}
        <div className="mb-3">
          <div className="text-[9px] text-gray-600 tracking-widest uppercase mb-2">Top languages in repos</div>
          <LanguageBars languages={languages} />
        </div>

        {/* Stack Tags */}
        <div className="mb-3">
          <div className="text-[9px] text-gray-600 tracking-widest uppercase mb-2">Stack</div>
          <div className="flex flex-wrap gap-1">
            {['React', 'Next.js', 'Node', 'Supabase', 'Figma'].map((tag) => (
              <span
                key={tag}
                className="border border-gray-700 text-gray-300 text-[9px] px-2 py-0.5"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* ASCII Globe */}
        <div className="mt-auto">
          <AsciiGlobe />
        </div>
      </div>
    </div>
  )
}
