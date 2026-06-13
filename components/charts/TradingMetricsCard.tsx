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

const DEFAULT_COLOR = '#10b981'
const COLOR_MAP = {
  up: '#10b981',
  down: '#ef4444',
  neutral: '#666',
}

export default function TradingMetricsCard({ title, metrics, children, className = '' }: TradingMetricsCardProps) {
  return (
    <div className={`bg-black/50 border border-white/10 p-4 rounded ${className}`}>
      <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-3">{title}</div>

      <div className="grid grid-cols-4 gap-3 mb-4">
        {metrics.map((metric, i) => (
          <div key={i} className="bg-black/30 border border-white/5 p-2 rounded">
            <div className="text-gray-600 text-[9px] uppercase mb-1">{metric.label}</div>
            <div
              className="text-white text-[11px] font-medium"
              style={{ color: metric.color || COLOR_MAP[metric.trend || 'neutral'] || DEFAULT_COLOR }}
            >
              {metric.value}
            </div>
          </div>
        ))}
      </div>

      {children}
    </div>
  )
}
