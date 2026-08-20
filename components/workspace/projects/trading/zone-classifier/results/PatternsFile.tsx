'use client'

import TradingCandleChart from '@/components/charts/TradingCandleChart'
import { BREAKOUT_EXAMPLE, CONSOLIDATION_EXAMPLE, NEUTRAL_EXAMPLE } from '../data'

export default function ResultsPatternsFile() {
  return (
    <div className="p-6 space-y-3 max-w-[1400px]">
      <div className="text-[9px] tracking-[0.3em] text-[#444]">// results/patterns</div>
      <h1 className="text-[26px] tracking-[0.15em] text-white">PATTERN EXAMPLES</h1>
      <p className="text-[11px] text-gray-500 leading-relaxed max-w-[600px]">
        Click any candle to see details. Examples show how each zone pattern appears in real market data.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 border-t border-l border-[#1c2e1c]">
        <div className="border-r border-b border-[#1c2e1c] p-3">
          <div className="text-[10px] tracking-[0.2em] text-[#00ff9d] mb-1">BREAKOUT ZONE</div>
          <div className="text-[10px] text-[#444] mb-3">Volume surge + expansion = entry signal</div>
          <TradingCandleChart data={BREAKOUT_EXAMPLE} height={180} showVolume interactive animate animateDelay={0} />
        </div>

        <div className="border-r border-b border-[#1c2e1c] p-3">
          <div className="text-[10px] tracking-[0.2em] text-[#00ff9d] mb-1">CONSOLIDATION ZONE</div>
          <div className="text-[10px] text-[#444] mb-3">Tight range, low volume = wait</div>
          <TradingCandleChart data={CONSOLIDATION_EXAMPLE} height={180} showVolume interactive animate animateDelay={500} />
        </div>

        <div className="border-r border-b border-[#1c2e1c] p-3">
          <div className="text-[10px] tracking-[0.2em] text-[#00ff9d] mb-1">NEUTRAL ZONE</div>
          <div className="text-[10px] text-[#444] mb-3">No clear pattern, avoid trading</div>
          <TradingCandleChart data={NEUTRAL_EXAMPLE} height={180} showVolume interactive animate animateDelay={1000} />
        </div>
      </div>
    </div>
  )
}
