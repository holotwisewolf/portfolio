'use client'

import dynamic from 'next/dynamic'

const TradingVisualizer = dynamic(() => import('@/components/projects/TradingVisualizer'), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] flex items-center justify-center text-[#444] text-[11px] tracking-[0.3em]">
      LOADING VISUALIZER...
    </div>
  ),
})

export default function BacktestDemoFile() {
  return (
    <div className="p-6 space-y-3 max-w-[1400px]">
      <div className="text-[9px] tracking-[0.3em] text-[#444]">// backtest/demo</div>
      <h1 className="text-[26px] tracking-[0.15em] text-white">BACKTEST DEMO</h1>
      <p className="text-[11px] text-gray-500 leading-relaxed max-w-[600px]">
        Interactive visualization of zone classification on historical market data.
      </p>

      <div className="border border-[#1c2e1c]">
        <TradingVisualizer />
      </div>
    </div>
  )
}
