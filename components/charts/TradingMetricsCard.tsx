'use client'

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
  neutral: '#999',
}

export default function TradingMetricsCard({ title, metrics, children, className = '' }: TradingMetricsCardProps) {
  return (
    <div className={`border border-[#1c2e1c] bg-black ${className}`}>
      <div className="border-b border-[#1c2e1c] px-3 py-1 text-[9px] tracking-[0.3em] text-[#666]">
        {title}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-0 border-b border-[#1c2e1c]">
        {metrics.map((metric, i) => {
          const color = metric.color || COLOR_MAP[metric.trend || 'neutral']
          return (
            <div
              key={i}
              className={`p-2 ${i < metrics.length - 1 ? 'border-r border-[#1c2e1c]' : ''} ${
                i % 2 === 1 ? 'md:border-r' : ''
              } ${i < metrics.length - 2 ? 'border-b md:border-b-0' : ''}`}
            >
              <div className="text-[8px] tracking-[0.25em] text-[#444] mb-1">{metric.label}</div>
              <div className="text-[12px] font-mono" style={{ color }}>
                {metric.value}
              </div>
            </div>
          )
        })}
      </div>

      <div className="p-3">{children}</div>
    </div>
  )
}
