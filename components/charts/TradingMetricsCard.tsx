'use client'

// Metrics band: values do the talking. No boxes — a caption title, oversized
// numerals separated by hairline verticals, the first metric emphasized larger
// in white, the rest in data-green. Charts render below, unframed.

import { ReactNode } from 'react'

interface Metric {
  label: string
  value: string | number
  color?: string
  trend?: 'up' | 'down' | 'neutral'
}

interface TradingMetricsCardProps {
  title: string
  metrics: Metric[]
  children: ReactNode
  className?: string
}

const COLOR_MAP = {
  up: '#00ff9d',
  down: '#ef4444',
  neutral: '#00ff9d',
}

export default function TradingMetricsCard({ title, metrics, children, className = '' }: TradingMetricsCardProps) {
  return (
    <div className={className}>
      <div className="text-[9px] tracking-[0.25em] text-[#555] mb-4">
        <span className="text-[#00ff9d] mr-2">—</span>
        {title}
      </div>

      <div className="flex flex-wrap gap-y-5">
        {metrics.map((metric, i) => {
          const color = metric.color || COLOR_MAP[metric.trend || 'neutral']
          const first = i === 0
          return (
            <div
              key={i}
              className={`${i > 0 ? 'pl-6 ml-0 border-l border-[#1a2a1a]' : ''} ${first ? 'mr-6' : 'mr-6'}`}
            >
              <div
                className={`font-orbit leading-none ${first ? 'text-[30px]' : 'text-[22px]'}`}
                style={{ color: first ? '#ffffff' : color }}
              >
                {metric.value}
              </div>
              <div className="text-[9px] tracking-[0.2em] text-[#555] mt-2">{metric.label}</div>
            </div>
          )
        })}
      </div>

      <div className="mt-7">{children}</div>
    </div>
  )
}
