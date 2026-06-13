'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

interface DataPoint {
  [key: string]: any
  color?: string
}

interface TradingBarChartProps {
  data: DataPoint[]
  xKey: string
  yKey: string
  colors?: string[]
  showGrid?: boolean
  horizontal?: boolean
  height?: number
  formatTooltip?: (value: any, name: string) => [string, string]
  barSize?: number
}

const DEFAULT_COLORS = ['#10b981', '#f59e0b', '#ef4444', '#6366f1', '#8b5cf6', '#ec4899']
const GRID_COLOR = 'rgba(255, 255, 255, 0.1)'

const CustomTooltip = ({ active, payload, label, formatTooltip }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0]
    return (
      <div
        style={{
          backgroundColor: '#1a1a1a',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '4px',
          padding: '8px 12px',
        }}
      >
        <p className="text-gray-400 text-[10px]">{label}</p>
        <p
          className="text-[11px] font-medium"
          style={{ color: data.payload.color || '#10b981' }}
        >
          {formatTooltip ? formatTooltip(data.value, data.name)[1] : `${data.name}: ${data.value}`}
        </p>
      </div>
    )
  }
  return null
}

export default function TradingBarChart({
  data,
  xKey,
  yKey,
  colors = DEFAULT_COLORS,
  showGrid = true,
  horizontal = false,
  height = 200,
  formatTooltip,
  barSize = 20,
}: TradingBarChartProps) {
  const getColor = (index: number, dataPoint?: DataPoint) => {
    if (dataPoint?.color) return dataPoint.color
    return colors[index % colors.length]
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart
        data={data}
        layout={horizontal ? 'vertical' : 'horizontal'}
        barSize={barSize}
      >
        {showGrid && (
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={GRID_COLOR}
            vertical={horizontal}
            horizontal={!horizontal}
          />
        )}
        <XAxis
          dataKey={horizontal ? yKey : xKey}
          stroke="#666"
          tick={{ fill: '#666', fontSize: 10 }}
          tickLine={false}
          axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
          type={horizontal ? 'number' : 'category'}
        />
        <YAxis
          stroke="#666"
          tick={{ fill: '#666', fontSize: 10 }}
          tickLine={false}
          axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
          type={horizontal ? 'category' : 'number'}
        />
        <Tooltip content={<CustomTooltip formatTooltip={formatTooltip} />} />
        <Bar dataKey={horizontal ? xKey : yKey}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={getColor(index, entry)} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
