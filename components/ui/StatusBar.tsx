'use client'

import { useState, useEffect } from 'react'

export default function StatusBar() {
  const [cpu, setCpu] = useState(45)
  const [mem, setMem] = useState(62)
  const [net, setNet] = useState('CONNECTED')
  const [time, setTime] = useState(new Date().toLocaleTimeString())

  useEffect(() => {
    // Randomly update stats every 2-4 seconds
    const interval = setInterval(() => {
      setCpu(Math.floor(Math.random() * 40) + 30) // 30-70%
      setMem(Math.floor(Math.random() * 30) + 50) // 50-80%
      setNet(Math.random() > 0.05 ? 'CONNECTED' : 'SYNCING...')
    }, Math.random() * 2000 + 2000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    // Update time every second
    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const renderBar = (value: number, char: string = '|') => {
    const filled = Math.floor(value / 10)
    const empty = 10 - filled
    return `${char.repeat(filled)}${'.'.repeat(empty)}`
  }

  return (
    <div className="fixed top-0 left-0 right-0 bg-black text-white text-xs font-mono border-b-2 border-white z-[10001] flex items-center justify-between px-2 py-1">
      <div className="flex items-center gap-4">
        <span className="text-green-400">SYSTEM_STATUS:</span>
        <span>CPU: [{renderBar(cpu)}] {cpu}%</span>
        <span>MEM: [{renderBar(mem)}] {mem}%</span>
        <span className={net === 'CONNECTED' ? 'text-green-400' : 'text-yellow-400'}>
          NET: {net}
        </span>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-gray-500">{time}</span>
      </div>
    </div>
  )
}
