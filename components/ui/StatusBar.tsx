'use client'

import { useState, useEffect } from 'react'

export default function StatusBar() {
  const [isConnected, setIsConnected] = useState(true)
  const [latency, setLatency] = useState(42)
  const [time, setTime] = useState(new Date().toLocaleTimeString())
  const [stocks, setStocks] = useState({ SPY: 0, QQQ: 0 })

  useEffect(() => {
    // Simulate connection checks
    const interval = setInterval(() => {
      setLatency(Math.floor(Math.random() * 30) + 20)
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    // Update time every second
    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    // Fetch stock prices
    const fetchStocks = async () => {
      try {
        const res = await fetch('/api/stocks?symbols=SPY,QQQ')
        const data = await res.json()
        if (data.quotes) {
          const quotes = data.quotes.reduce((acc: any, q: any) => {
            acc[q.symbol] = q.price
            return acc
          }, {})
          setStocks(quotes)
        }
      } catch (e) {
        // Silently fail
      }
    }

    fetchStocks()
    const interval = setInterval(fetchStocks, 30000) // Every 30s

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed top-0 left-0 right-0 bg-black text-white text-xs font-mono border-b-2 border-white z-[10001] flex items-center justify-between px-2 py-1">
      <div className="flex items-center gap-4">
        <span className="text-green-400">SYSTEM_ONLINE</span>
        <span className={isConnected ? 'text-green-400' : 'text-red-400'}>
          {isConnected ? '●' : '○'} CONNECTED
        </span>
        <span className="text-gray-500">LATENCY: {latency}ms</span>
        <span className="text-gray-400">|</span>
        <span className="text-gray-300">SPY: ${stocks.SPY?.toFixed(2) || '---'}</span>
        <span className="text-gray-300">QQQ: ${stocks.QQQ?.toFixed(2) || '---'}</span>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-gray-500">{time}</span>
      </div>
    </div>
  )
}
