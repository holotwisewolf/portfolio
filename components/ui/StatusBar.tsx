'use client'

import { useState, useEffect } from 'react'

export default function StatusBar() {
  const [isConnected, setIsConnected] = useState(true)
  const [latency, setLatency] = useState(0)
  const [time, setTime] = useState('')
  const [connections, setConnections] = useState(1) // Start with 1 (you)

  // Measure actual network latency
  useEffect(() => {
    const measureLatency = async () => {
      const start = performance.now()
      try {
        await fetch('/api/health', { method: 'HEAD' })
        const end = performance.now()
        setLatency(Math.round(end - start))
        setIsConnected(true)
      } catch {
        setIsConnected(false)
        setLatency(0)
      }
    }

    measureLatency()
    const interval = setInterval(measureLatency, 2000)
    return () => clearInterval(interval)
  }, [])

  // Set initial time on mount (client-side only)
  useEffect(() => {
    setTime(new Date().toLocaleTimeString())
  }, [])

  useEffect(() => {
    // Update time every second
    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  // Simulate connections fluctuating
  useEffect(() => {
    const updateConnections = () => {
      // Randomly add/subtract visitors (0-3 at a time)
      const change = Math.floor(Math.random() * 7) - 3 // -3 to +3
      setConnections(prev => Math.max(1, prev + change)) // Always at least 1 (you)
    }

    updateConnections()
    const interval = setInterval(updateConnections, 10 * 60 * 1000) // Every 10 min
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="bg-black text-white text-xs font-mono border-b-2 border-white z-[10001] flex items-center justify-between px-2 py-1">
      <div className="flex items-center gap-4">
        <span className="text-white font-bold">&gt; PORTFOLIO</span>
        <span className="text-gray-500">|</span>
        <span className={isConnected ? 'text-green-400' : 'text-red-400'}>
          {isConnected ? 'SERVER_ONLINE' : 'SERVER_OFFLINE'}
        </span>
        <span className="text-gray-500">LATENCY: {latency}ms</span>
        <span className="text-gray-400">|</span>
        <span className="text-gray-300">CONNECTIONS: {connections}</span>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-gray-500">{time || '--:--:--'}</span>
      </div>
    </div>
  )
}
