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
const GRID_COLOR = 'rgba(255, 255, 255, 0.05)'
const AXIS_COLOR = '#444'

const PRICE_COLORS = {
  up: '#10b981',
  down: '#ef4444',
  neutral: '#666',
}

const ZONE_COLORS = {
  neutral: 'rgba(107, 114, 128, 0.1)',
  consolidation: 'rgba(245, 158, 11, 0.1)',
  breakout: 'rgba(16, 185, 129, 0.1)',
  entry: 'rgba(59, 130, 246, 0.2)',
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

  // Calculate price range
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

  // SVG dimensions
  const chartWidth = width || '100%'
  const chartHeight = height
  const volumeHeight = showVolume ? 60 : 0
  const priceHeight = chartHeight - volumeHeight - 20 // 20px for padding
  const volumeBase = priceHeight + 10

  // Scale functions
  const scalePrice = (price: number) => {
    return priceHeight - ((price - minPrice) / priceRange) * priceHeight
  }

  const scaleVolume = (volume: number) => {
    if (!showVolume) return 0
    const scaled = (volume / maxVolume) * volumeHeight * 0.8
    return volumeBase - scaled
  }

  // Calculate price level for Y position
  const priceFromY = (y: number) => {
    const scaled = (priceHeight - y) / priceHeight
    return minPrice + scaled * priceRange
  }

  // Handle click
  const handleCandleClick = (candle: CandleData, index: number) => {
    if (!interactive) return
    setSelectedCandle({ candle, index })
    onCandleClick?.(candle, index)
  }

  return (
    <div className="relative w-full" style={{ height: chartHeight }}>
      <svg
        width={chartWidth}
        height={chartHeight}
        className="bg-black/50"
      >
        {/* Grid lines */}
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
                fontFamily="monospace"
              >
                {price.toFixed(2)}
              </text>
            </g>
          )
        })}

        {/* Zone backgrounds */}
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

        {/* Candles */}
        {data.map((candle, i) => {
          const isUp = candle.close >= candle.open
          const bodyTop = scalePrice(Math.max(candle.open, candle.close))
          const bodyBottom = scalePrice(Math.min(candle.open, candle.close))
          const wickTop = scalePrice(candle.high)
          const wickBottom = scalePrice(candle.low)
          const x = i * (CANDLE_WIDTH + CANDLE_GAP) + CANDLE_GAP
          const isHovered = hoveredIndex === i
          const isSelected = selectedCandle?.index === i

          // Volume bar
          const volHeight = candle.volume
            ? (candle.volume / maxVolume) * volumeHeight * 0.8
            : 0

          return (
            <g key={i}>
              {/* Volume bar */}
              {showVolume && candle.volume && (
                <rect
                  x={x}
                  y={volumeBase}
                  width={CANDLE_WIDTH}
                  height={-volHeight}
                  fill={isUp ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}
                  className="transition-opacity"
                  style={{ opacity: isHovered ? 0.8 : 0.4 }}
                />
              )}

              {/* Wick */}
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

              {/* Body */}
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

              {/* Entry/Exit markers */}
              {candle.annotation === 'entry' && (
                <circle
                  cx={x + CANDLE_WIDTH / 2}
                  cy={scalePrice(candle.low) + 15}
                  r={4}
                  fill="none"
                  stroke="#3b82f6"
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

        {/* Time labels */}
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
              fontFamily="monospace"
              textAnchor="middle"
            >
              {candle.time}
            </text>
          )
        })}
      </svg>

      {/* Hover tooltip */}
      {hoveredIndex !== null && data[hoveredIndex] && (
        <div
          className="absolute pointer-events-none bg-black/90 border border-white/20 p-2 rounded z-10"
          style={{
            left: `${hoveredIndex * (CANDLE_WIDTH + CANDLE_GAP) + CANDLE_WIDTH + 10}px`,
            top: '50%',
            transform: 'translateY(-50%)',
          }}
        >
          <div className="text-gray-400 text-[9px] font-mono">{data[hoveredIndex].time}</div>
          <div className="text-green-400 text-[10px] font-mono">O: {data[hoveredIndex].open.toFixed(2)}</div>
          <div className="text-green-400 text-[10px] font-mono">H: {data[hoveredIndex].high.toFixed(2)}</div>
          <div className="text-red-400 text-[10px] font-mono">L: {data[hoveredIndex].low.toFixed(2)}</div>
          <div className="text-green-400 text-[10px] font-mono">C: {data[hoveredIndex].close.toFixed(2)}</div>
          {data[hoveredIndex].zone && (
            <div className="text-yellow-400 text-[9px] mt-1 capitalize">{data[hoveredIndex].zone}</div>
          )}
        </div>
      )}

      {/* Selected candle details */}
      {selectedCandle && (
        <div className="absolute bottom-0 left-0 right-0 bg-black/90 border-t border-white/20 p-2">
          <div className="flex items-center justify-between">
            <div className="text-gray-400 text-[9px]">
              {selectedCandle.candle.time} — {selectedCandle.candle.zone && (
                <span className="capitalize text-yellow-400">{selectedCandle.candle.zone}</span>
              )}
            </div>
            <div className="flex gap-4 text-[10px] font-mono">
              <span className="text-gray-400">O: <span className="text-green-400">{selectedCandle.candle.open.toFixed(2)}</span></span>
              <span className="text-gray-400">H: <span className="text-green-400">{selectedCandle.candle.high.toFixed(2)}</span></span>
              <span className="text-gray-400">L: <span className="text-red-400">{selectedCandle.candle.low.toFixed(2)}</span></span>
              <span className="text-gray-400">C: <span className="text-green-400">{selectedCandle.candle.close.toFixed(2)}</span></span>
            </div>
            <button
              onClick={() => setSelectedCandle(null)}
              className="text-gray-500 hover:text-white text-[9px]"
            >
              [×]
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
