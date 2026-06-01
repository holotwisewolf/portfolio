'use client'

import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import StatRow from '@/components/ui/StatRow'
import ActivityGrid from '@/components/ui/ActivityGrid'
import LanguageBars, { Language } from '@/components/ui/LanguageBars'

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

// Initial mock prices
const INITIAL_PRICES = {
  SPY: 530,
  QQQ: 460
}

export default function StockCharts() {
  const [charts, setCharts] = useState<{ [key: string]: ChartData }>({})
  const [loading, setLoading] = useState(true)
  const [marketOpen, setMarketOpen] = useState(true)
  const [vix, setVix] = useState(18.4)

  const languages: Language[] = [
    { name: 'JavaScript', percentage: 48 },
    { name: 'TypeScript', percentage: 28 },
    { name: 'Python', percentage: 16 },
    { name: 'Other', percentage: 8 }
  ]

  // Generate mock historical data
  const generateChartData = (symbol: string, basePrice: number): ChartData => {
    const data: StockData[] = []
    let price = basePrice * 0.97
    const intervals = [4, 3.5, 3, 2.5, 2, 1.5, 1, 0.5, 0]
    for (const hours of intervals) {
      const change = (Math.random() - 0.45) * (basePrice * 0.015)
      price += change
      const timeLabel = hours === 0 ? 'now' : `${hours}h`
      data.push({
        time: timeLabel,
        price: parseFloat(price.toFixed(2))
      })
    }

    const currentPrice = data[data.length - 1].price
    const openPrice = data[0].price
    const change = currentPrice - openPrice
    const changePercent = (change / openPrice) * 100

    return {
      symbol,
      data,
      currentPrice,
      change,
      changePercent
    }
  }

  // Initialize and periodically update prices
  useEffect(() => {
    const initializeCharts = () => {
      const newCharts: { [key: string]: ChartData } = {}
      for (const [symbol, basePrice] of Object.entries(INITIAL_PRICES)) {
        newCharts[symbol] = generateChartData(symbol, basePrice + (Math.random() - 0.5) * 10)
      }
      setCharts(newCharts)
      setLoading(false)
    }

    initializeCharts()

    // Update every 5 minutes with small price variations
    const interval = setInterval(() => {
      setCharts(prev => {
        const updated: { [key: string]: ChartData } = {}
        for (const [symbol, chart] of Object.entries(prev)) {
          const newBasePrice = chart.currentPrice + (Math.random() - 0.5) * 5
          updated[symbol] = generateChartData(symbol, newBasePrice)
        }
        return updated
      })
      setVix(15 + Math.random() * 10)
    }, 5 * 60 * 1000) // 5 minutes

    return () => clearInterval(interval)
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
      <div className="text-[9px] tracking-widest text-white uppercase border-b border-gray-800 pb-2 mb-3">
        Stats
      </div>

      {/* Market Watch Block */}
      <div className="mb-4">
        <div className="text-[9px] text-gray-600 tracking-widest uppercase mb-2">Market watch</div>

        {loading ? (
          <div className="text-gray-500 text-center py-8">Loading...</div>
        ) : (
          <>
            {Object.values(charts).map((chart) => (
              <div key={chart.symbol} className="mb-3">
                <div className="flex justify-between items-baseline mb-1">
                  <span className="text-gray-300">{chart.symbol}</span>
                  <span className="text-white text-sm">
                    ${chart.currentPrice.toFixed(2)}{' '}
                    <span className={`text-[10px] ${chart.changePercent >= 0 ? 'text-white' : 'text-gray-400'}`}>
                      {chart.changePercent >= 0 ? '+' : ''}{chart.changePercent.toFixed(2)}%
                    </span>
                  </span>
                </div>
                <ResponsiveContainer width="100%" height={40}>
                  <LineChart data={chart.data} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                    <XAxis
                      dataKey="time"
                      stroke="#444"
                      tick={{ fill: '#444', fontSize: 8 }}
                      tickFormatter={(value) => value === 'now' ? 'n' : value.replace('h', '')}
                    />
                    <YAxis hide={true} domain={[chart.data[0]?.price * 0.99, chart.data[chart.data.length - 1]?.price * 1.01]} />
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
              </div>
            ))}

            <StatRow label="VIX" value={`${vix.toFixed(1)} ▲`} valueClass="text-white" />
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

      <div className="border-t border-gray-800 my-3" />

      {/* Dev Activity Block */}
      <div className="flex-1">
        <div className="text-[9px] text-gray-600 tracking-widest uppercase mb-2">Dev activity</div>

        <StatRow label="COMMITS (30D)" value="143" valueClass="text-white" />
        <StatRow label="GITHUB STARS" value="847" valueClass="text-white" />

        {/* Activity Dots */}
        <div className="my-3">
          <ActivityGrid dots={35} />
        </div>

        {/* Language Bars */}
        <div className="mb-3">
          <div className="text-[9px] text-gray-600 tracking-widest uppercase mb-2">Top languages</div>
          <LanguageBars languages={languages} />
        </div>

        {/* Contact Links */}
        <div>
          <div className="text-[9px] text-gray-600 tracking-widest uppercase mb-2">Contact</div>
          <ContactLink label="GitHub" />
          <ContactLink label="LinkedIn" />
          <ContactLink label="Email" />
        </div>
      </div>
    </div>
  )
}

function ContactLink({ label }: { label: string }) {
  return (
    <div className="flex justify-between py-1 text-gray-400 border-b border-gray-900 hover:text-white cursor-pointer">
      <span>{label}</span>
      <span>↗</span>
    </div>
  )
}
