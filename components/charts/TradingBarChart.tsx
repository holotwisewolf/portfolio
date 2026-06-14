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

const DEFAULT_COLORS = ['#00cc77', '#00aa66', '#008855', '#006644', '#004433', '#003322']
const GRID_COLOR = '#1c2e1c'
const AXIS_COLOR = '#666'
const AXIS_LINE = '#1c2e1c'

const CustomTooltip = ({ active, payload, label, formatTooltip }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0]
    return (
      <div
        style={{
          backgroundColor: '#0a0a0a',
          border: '1px solid #1c2e1c',
          padding: '6px 10px',
        }}
      >
        <p className="text-[#666] text-[10px] font-mono">{label}</p>
        <p
          className="text-[11px] font-mono"
          style={{ color: data.payload.color || '#00ff9d' }}
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
          stroke={AXIS_COLOR}
          tick={{ fill: AXIS_COLOR, fontSize: 10, fontFamily: 'monospace' }}
          tickLine={false}
          axisLine={{ stroke: AXIS_LINE }}
          type={horizontal ? 'number' : 'category'}
        />
        <YAxis
          stroke={AXIS_COLOR}
          tick={{ fill: AXIS_COLOR, fontSize: 10, fontFamily: 'monospace' }}
          tickLine={false}
          axisLine={{ stroke: AXIS_LINE }}
          type={horizontal ? 'category' : 'number'}
        />
        <Tooltip content={<CustomTooltip formatTooltip={formatTooltip} />} cursor={{ fill: '#1c2e1c', fillOpacity: 0.5 }} />
        <Bar dataKey={horizontal ? xKey : yKey}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={getColor(index, entry)} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
