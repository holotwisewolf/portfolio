'use client'

import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

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
  const [loading, setLoading] = useState(true)

  const fetchStockData = async () => {
    try {
      const res = await fetch('/api/stocks?symbols=SPY,QQQ')
      const data = await res.json()

      if (data.quotes) {
        const newCharts: { [key: string]: ChartData } = {}

        for (const quote of data.quotes) {
          const symbol = quote.symbol
          const price = quote.price || 0
          const change = quote.change || 0
          const changePercent = quote.changePercent || 0

          // Generate mock historical data (since we only have current price)
          const historicalData: StockData[] = []
          let basePrice = price * 0.98
          for (let i = 20; i >= 0; i--) {
            const variation = (Math.random() - 0.5) * (price * 0.01)
            basePrice += variation
            historicalData.push({
              time: `${i}m`,
              price: parseFloat(basePrice.toFixed(2))
            })
          }
          historicalData.push({ time: 'now', price })

          newCharts[symbol] = {
            symbol,
            data: historicalData,
            currentPrice: price,
            change,
            changePercent
          }
        }

        setCharts(newCharts)
        setLoading(false)
      }
    } catch (error) {
      console.error('Failed to fetch stock data:', error)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStockData()
    const interval = setInterval(fetchStockData, 30000) // Update every 30s
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="h-full bg-black border-l-2 border-white p-2 flex flex-col">
      <h2 className="text-white text-sm font-bold mb-2 border-b border-white pb-1">
        STOCK CHARTS
      </h2>

      {loading ? (
        <div className="flex-1 flex items-center justify-center text-gray-500 text-xs">
          LOADING...
        </div>
      ) : (
        <div className="flex-1 flex flex-col gap-4 overflow-y-auto">
          {Object.values(charts).map((chart) => (
            <div key={chart.symbol} className="flex-1 min-h-0">
              <div className="flex items-center justify-between mb-1">
                <span className="text-white font-bold">{chart.symbol}</span>
                <div className="flex items-center gap-2">
                  <span className="text-white text-sm">${chart.currentPrice.toFixed(2)}</span>
                  <span className={`text-xs ${chart.changePercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {chart.changePercent >= 0 ? '+' : ''}{chart.changePercent.toFixed(2)}%
                  </span>
                </div>
              </div>

              <ResponsiveContainer width="100%" height={100}>
                <LineChart data={chart.data} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                  <CartesianGrid stroke="#333" strokeDasharray="2 2" />
                  <XAxis
                    dataKey="time"
                    stroke="#666"
                    tick={{ fill: '#666', fontSize: 8 }}
                    tickFormatter={(value) => value === 'now' ? 'now' : value}
                  />
                  <YAxis
                    stroke="#666"
                    tick={{ fill: '#666', fontSize: 8 }}
                    domain={[chart.data[0]?.price * 0.99, chart.data[chart.data.length - 1]?.price * 1.01]}
                    tickFormatter={(value) => value.toFixed(0)}
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#000', border: '1px solid #fff', borderRadius: 0 }}
                    itemStyle={{ color: '#fff' }}
                    labelStyle={{ color: '#fff' }}
                    formatter={(value: number) => [`$${value.toFixed(2)}`, 'Price']}
                  />
                  <Line
                    type="monotone"
                    dataKey="price"
                    stroke={chart.changePercent >= 0 ? '#4ade80' : '#f87171'}
                    strokeWidth={2}
                    dot={false}
                    isAnimationActive={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
