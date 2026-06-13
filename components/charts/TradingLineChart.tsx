'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, ReferenceArea } from 'recharts'

interface DataPoint {
  [key: string]: any
}

interface TradingLineChartProps {
  data: DataPoint[]
  xKey: string
  yKey: string
  color?: string
  area?: boolean
  showGrid?: boolean
  showDots?: boolean
  height?: number
  formatTooltip?: (value: any, name: string) => [string, string]
  referenceLines?: { y?: number; x?: number; label?: string; color?: string }[]
}

const DEFAULT_COLOR = '#10b981'
const GRID_COLOR = 'rgba(255, 255, 255, 0.1)'
const TOOLTIP_STYLE = {
  backgroundColor: '#1a1a1a',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: '4px',
  padding: '8px 12px',
}

const CustomTooltip = ({ active, payload, label, formatTooltip }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0]
    return (
      <div style={TOOLTIP_STYLE}>
        <p className="text-gray-400 text-[10px]">{label}</p>
        <p className="text-green-400 text-[11px] font-medium">
          {formatTooltip ? formatTooltip(data.value, data.name)[1] : `${data.name}: ${data.value}`}
        </p>
      </div>
    )
  }
  return null
}

export default function TradingLineChart({
  data,
  xKey,
  yKey,
  color = DEFAULT_COLOR,
  area = false,
  showGrid = true,
  showDots = false,
  height = 200,
  formatTooltip,
  referenceLines = [],
}: TradingLineChartProps) {
  const ChartComponent = area ? AreaChart : LineChart

  return (
    <ResponsiveContainer width="100%" height={height}>
      <ChartComponent data={data}>
        {showGrid && (
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={GRID_COLOR}
            vertical={false}
          />
        )}
        <XAxis
          dataKey={xKey}
          stroke="#666"
          tick={{ fill: '#666', fontSize: 10 }}
          tickLine={false}
          axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
        />
        <YAxis
          stroke="#666"
          tick={{ fill: '#666', fontSize: 10 }}
          tickLine={false}
          axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
        />
        <Tooltip
          content={<CustomTooltip formatTooltip={formatTooltip} />}
          cursor={{ stroke: 'rgba(16, 185, 129, 0.3)', strokeWidth: 1 }}
        />
        {referenceLines.map((line, i) => (
          <ReferenceArea
            key={i}
            y1={line.y}
            y2={line.y}
            stroke={line.color || '#555'}
            strokeDasharray="3 3"
            label={line.label}
            ifOverflow="visible"
          />
        ))}
        {area ? (
          <Area
            type="monotone"
            dataKey={yKey}
            stroke={color}
            fill={color}
            fillOpacity={0.3}
            strokeWidth={2}
            dot={showDots}
          />
        ) : (
          <Line
            type="monotone"
            dataKey={yKey}
            stroke={color}
            strokeWidth={2}
            dot={showDots}
            activeDot={{ r: 4, fill: color, stroke: '#fff', strokeWidth: 2 }}
          />
        )}
      </ChartComponent>
    </ResponsiveContainer>
  )
}
