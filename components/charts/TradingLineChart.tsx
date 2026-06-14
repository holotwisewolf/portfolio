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

const DEFAULT_COLOR = '#00cc77'
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
        <p className="text-[#666] text-[10px] font-orbit">{label}</p>
        <p className="text-[#00ff9d] text-[11px] font-orbit">
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
          stroke={AXIS_COLOR}
          tick={{ fill: AXIS_COLOR, fontSize: 10, fontFamily: 'Orbit, monospace' }}
          tickLine={false}
          axisLine={{ stroke: AXIS_LINE }}
        />
        <YAxis
          stroke={AXIS_COLOR}
          tick={{ fill: AXIS_COLOR, fontSize: 10, fontFamily: 'Orbit, monospace' }}
          tickLine={false}
          axisLine={{ stroke: AXIS_LINE }}
        />
        <Tooltip
          content={<CustomTooltip formatTooltip={formatTooltip} />}
          cursor={{ stroke: '#00ff9d', strokeWidth: 1, strokeOpacity: 0.3 }}
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
            fillOpacity={0.25}
            strokeWidth={1.5}
            dot={showDots}
          />
        ) : (
          <Line
            type="monotone"
            dataKey={yKey}
            stroke={color}
            strokeWidth={1.5}
            dot={showDots}
            activeDot={{ r: 3, fill: color, stroke: '#fff', strokeWidth: 1 }}
          />
        )}
      </ChartComponent>
    </ResponsiveContainer>
  )
}
