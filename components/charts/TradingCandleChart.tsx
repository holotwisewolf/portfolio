'use client'

import { useState, useMemo } from 'react'

interface CandleData {
  time: string
  open: number
  high: number
  low: number
  close: number
  volume?: number
  zone?: 'neutral' | 'consolidation' | 'breakout' | 'entry' | 'exit'
  annotation?: string
}

interface TradingCandleChartProps {
  data: CandleData[]
  height?: number
  width?: number
  showVolume?: boolean
  interactive?: boolean
  onCandleClick?: (candle: CandleData, index: number) => void
}

const CANDLE_WIDTH = 8
const CANDLE_GAP = 2
const GRID_COLOR = '#1c2e1c'
const AXIS_COLOR = '#666'

const PRICE_COLORS = {
  up: '#00cc77',
  down: '#ef4444',
  neutral: '#666',
}

const ZONE_COLORS = {
  neutral: 'rgba(107, 114, 128, 0.08)',
  consolidation: 'rgba(245, 158, 11, 0.1)',
  breakout: 'rgba(0, 255, 157, 0.1)',
  entry: 'rgba(0, 255, 157, 0.2)',
  exit: 'rgba(239, 68, 68, 0.2)',
}

export default function TradingCandleChart({
  data,
  height = 250,
  width,
  showVolume = true,
  interactive = true,
  onCandleClick,
}: TradingCandleChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [selectedCandle, setSelectedCandle] = useState<{ candle: CandleData; index: number } | null>(null)

  const { minPrice, maxPrice, maxVolume, priceRange } = useMemo(() => {
    const allHighs = data.map(d => d.high)
    const allLows = data.map(d => d.low)
    const allVolumes = data.map(d => d.volume || 0)

    const min = Math.min(...allLows)
    const max = Math.max(...allHighs)
    const range = max - min
    const padding = range * 0.1

    return {
      minPrice: min - padding,
      maxPrice: max + padding,
      maxVolume: Math.max(...allVolumes),
      priceRange: range + padding * 2,
    }
  }, [data])

  const chartWidth = width || '100%'
  const chartHeight = height
  const volumeHeight = showVolume ? 60 : 0
  const priceHeight = chartHeight - volumeHeight - 20
  const volumeBase = priceHeight + 10

  const scalePrice = (price: number) => {
    return priceHeight - ((price - minPrice) / priceRange) * priceHeight
  }

  const priceFromY = (y: number) => {
    const scaled = (priceHeight - y) / priceHeight
    return minPrice + scaled * priceRange
  }

  const handleCandleClick = (candle: CandleData, index: number) => {
    if (!interactive) return
    setSelectedCandle({ candle, index })
    onCandleClick?.(candle, index)
  }

  return (
    <div className="relative w-full border border-[#1c2e1c]" style={{ height: chartHeight }}>
      <svg
        width={chartWidth}
        height={chartHeight}
        className="bg-[#0a0a0a]"
      >
        {[0, 0.25, 0.5, 0.75, 1].map(pct => {
          const y = pct * priceHeight
          const price = priceFromY(y)
          return (
            <g key={pct}>
              <line
                x1={0}
                y1={y}
                x2="100%"
                y2={y}
                stroke={GRID_COLOR}
                strokeWidth={1}
              />
              <text
                x={5}
                y={y - 4}
                fill={AXIS_COLOR}
                fontSize={9}
                fontFamily="Orbit, monospace"
              >
                {price.toFixed(2)}
              </text>
            </g>
          )
        })}

        {data.map((candle, i) => {
          if (!candle.zone) return null
          const x = i * (CANDLE_WIDTH + CANDLE_GAP)
          return (
            <rect
              key={`zone-${i}`}
              x={x - CANDLE_GAP}
              y={0}
              width={CANDLE_WIDTH + CANDLE_GAP * 2}
              height={priceHeight}
              fill={ZONE_COLORS[candle.zone]}
            />
          )
        })}

        {data.map((candle, i) => {
          const isUp = candle.close >= candle.open
          const bodyTop = scalePrice(Math.max(candle.open, candle.close))
          const bodyBottom = scalePrice(Math.min(candle.open, candle.close))
          const wickTop = scalePrice(candle.high)
          const wickBottom = scalePrice(candle.low)
          const x = i * (CANDLE_WIDTH + CANDLE_GAP) + CANDLE_GAP
          const isHovered = hoveredIndex === i
          const isSelected = selectedCandle?.index === i

          const volHeight = candle.volume
            ? (candle.volume / maxVolume) * volumeHeight * 0.8
            : 0

          return (
            <g key={i}>
              {showVolume && candle.volume && (
                <rect
                  x={x}
                  y={volumeBase}
                  width={CANDLE_WIDTH}
                  height={-volHeight}
                  fill={isUp ? 'rgba(0, 204, 119, 0.3)' : 'rgba(239, 68, 68, 0.3)'}
                  className="transition-opacity"
                  style={{ opacity: isHovered ? 0.8 : 0.4 }}
                />
              )}

              <line
                x1={x + CANDLE_WIDTH / 2}
                y1={wickTop}
                x2={x + CANDLE_WIDTH / 2}
                y2={wickBottom}
                stroke={isUp ? PRICE_COLORS.up : PRICE_COLORS.down}
                strokeWidth={1}
                className="transition-opacity"
                style={{ opacity: isHovered || isSelected ? 1 : 0.7 }}
              />

              <rect
                x={x}
                y={bodyTop}
                width={CANDLE_WIDTH}
                height={Math.max(1, bodyBottom - bodyTop)}
                fill={isUp ? PRICE_COLORS.up : PRICE_COLORS.down}
                className="cursor-pointer transition-all"
                style={{
                  opacity: isHovered || isSelected ? 1 : 0.85,
                  outline: isSelected ? '2px solid #fff' : 'none',
                }}
                onClick={() => handleCandleClick(candle, i)}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              />

              {candle.annotation === 'entry' && (
                <circle
                  cx={x + CANDLE_WIDTH / 2}
                  cy={scalePrice(candle.low) + 15}
                  r={4}
                  fill="none"
                  stroke="#00ff9d"
                  strokeWidth={2}
                />
              )}
              {candle.annotation === 'exit' && (
                <circle
                  cx={x + CANDLE_WIDTH / 2}
                  cy={scalePrice(candle.high) - 15}
                  r={4}
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth={2}
                />
              )}
            </g>
          )
        })}

        {data.filter((_, i) => i % Math.max(1, Math.floor(data.length / 6)) === 0).map((candle, i) => {
          const index = data.indexOf(candle)
          const x = index * (CANDLE_WIDTH + CANDLE_GAP)
          return (
            <text
              key={index}
              x={x + CANDLE_WIDTH / 2}
              y={chartHeight - 5}
              fill={AXIS_COLOR}
              fontSize={9}
              fontFamily="Orbit, monospace"
              textAnchor="middle"
            >
              {candle.time}
            </text>
          )
        })}
      </svg>

      {hoveredIndex !== null && data[hoveredIndex] && (
        <div
          className="absolute pointer-events-none bg-[#0a0a0a] border border-[#1c2e1c] p-2 z-10"
          style={{
            left: `${hoveredIndex * (CANDLE_WIDTH + CANDLE_GAP) + CANDLE_WIDTH + 10}px`,
            top: '50%',
            transform: 'translateY(-50%)',
          }}
        >
          <div className="text-[#666] text-[9px] font-orbit">{data[hoveredIndex].time}</div>
          <div className="text-[#00ff9d] text-[10px] font-orbit">O: {data[hoveredIndex].open.toFixed(2)}</div>
          <div className="text-[#00ff9d] text-[10px] font-orbit">H: {data[hoveredIndex].high.toFixed(2)}</div>
          <div className="text-[#ef4444] text-[10px] font-orbit">L: {data[hoveredIndex].low.toFixed(2)}</div>
          <div className="text-[#00ff9d] text-[10px] font-orbit">C: {data[hoveredIndex].close.toFixed(2)}</div>
          {data[hoveredIndex].zone && (
            <div className="text-white text-[9px] mt-1 font-orbit uppercase tracking-wider">{data[hoveredIndex].zone}</div>
          )}
        </div>
      )}

      {selectedCandle && (
        <div className="absolute bottom-0 left-0 right-0 bg-[#0a0a0a] border-t border-[#1c2e1c] p-2">
          <div className="flex items-center justify-between">
            <div className="text-[#666] text-[9px] font-orbit">
              {selectedCandle.candle.time} {selectedCandle.candle.zone && (
                <span className="uppercase text-white tracking-wider">— {selectedCandle.candle.zone}</span>
              )}
            </div>
            <div className="flex gap-4 text-[10px] font-orbit">
              <span className="text-[#666]">O: <span className="text-[#00ff9d]">{selectedCandle.candle.open.toFixed(2)}</span></span>
              <span className="text-[#666]">H: <span className="text-[#00ff9d]">{selectedCandle.candle.high.toFixed(2)}</span></span>
              <span className="text-[#666]">L: <span className="text-[#ef4444]">{selectedCandle.candle.low.toFixed(2)}</span></span>
              <span className="text-[#666]">C: <span className="text-[#00ff9d]">{selectedCandle.candle.close.toFixed(2)}</span></span>
            </div>
            <button
              onClick={() => setSelectedCandle(null)}
              className="text-[#666] hover:text-white text-[9px]"
            >
              [x]
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
