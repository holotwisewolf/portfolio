'use client'

import { useState } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

const generateData = (points: number) => {
  return Array.from({ length: points }, (_, i) => ({
    time: i,
    price: 100 + Math.random() * 20 + Math.sin(i / 10) * 5,
    zone: Math.random() > 0.7 ? 3 : Math.random() > 0.4 ? 2 : 1,
  }))
}

const zoneNames: Record<number, string> = {
  1: 'Neutral (Wait)',
  2: 'Consolidation (Avoid fakeouts)',
  3: 'Breakout (Enter)',
}

export default function OrderflowDemo() {
  const [dataPoints, setDataPoints] = useState(50)
  const [data] = useState(() => generateData(50))

  const handleDataPointsChange = (value: number) => {
    setDataPoints(value)
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex gap-4 mb-4 items-center">
        <label className="text-sm">
          Data Points: {dataPoints}
        </label>
        <input
          type="range"
          min="20"
          max="100"
          value={dataPoints}
          onChange={(e) => handleDataPointsChange(parseInt(e.target.value))}
          className="flex-1"
        />
      </div>

      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid stroke="#333" />
            <XAxis dataKey="time" stroke="white" />
            <YAxis stroke="white" />
            <Tooltip
              contentStyle={{ backgroundColor: 'black', border: '1px solid white' }}
              itemStyle={{ color: 'white' }}
              formatter={(value: any, name: string, props: any) => {
                if (name === 'zone') {
                  return [zoneNames[value], 'Zone']
                }
                return [value.toFixed(2), name]
              }}
            />
            <Line
              type="monotone"
              dataKey="price"
              stroke="white"
              dot={false}
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 text-xs">
        <div className="flex gap-4">
          <span>Zone Legend:</span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 bg-gray-500 inline-block"></span>
            Neutral
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 bg-yellow-500 inline-block"></span>
            Consolidation
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 bg-green-500 inline-block"></span>
            Breakout
          </span>
        </div>
      </div>
    </div>
  )
}
