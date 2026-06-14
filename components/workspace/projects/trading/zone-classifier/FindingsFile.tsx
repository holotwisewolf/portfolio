export default function FindingsFile() {
  return (
    <div className="p-6 space-y-3 max-w-[1100px]">
      <div className="text-[9px] tracking-[0.3em] text-[#444]">// FINDINGS.md</div>
      <h1 className="text-[26px] tracking-[0.15em] text-white">FINDINGS</h1>

      <div className="border border-[#1c2e1c] p-3">
        <div className="text-[9px] tracking-[0.3em] text-[#444] mb-3">KEY DISCOVERIES</div>
        <div className="space-y-3">
          <div className="border-l border-[#00ff9d] pl-3">
            <div className="text-[11px] tracking-[0.1em] text-[#00ff9d]">SIMPLICITY WINS</div>
            <div className="text-[10px] text-gray-500 mt-1 leading-relaxed">
              Final formula used only 4 features: zone_range, volume_diff, avg_wick_to_body_ratio, price_entropy.
              Simpler models generalized better across time periods.
            </div>
          </div>
          <div className="border-l border-[#00ff9d] pl-3">
            <div className="text-[11px] tracking-[0.1em] text-[#00ff9d]">REGIME-BASED &gt; ENTRY SIGNALS</div>
            <div className="text-[10px] text-gray-500 mt-1 leading-relaxed">
              Zone classification (Neutral/Consolidation/Breakout) outperformed direct entry signals.
              Knowing when NOT to trade is as valuable as knowing when to enter.
            </div>
          </div>
          <div className="border-l border-[#00ff9d] pl-3">
            <div className="text-[11px] tracking-[0.1em] text-[#00ff9d]">VOLUME PRECEDES PRICE</div>
            <div className="text-[10px] text-gray-500 mt-1 leading-relaxed">
              Volume acceleration led price changes by 1-3 candles in 73% of breakout zones.
              Smart money accumulates before the move.
            </div>
          </div>
        </div>
      </div>

      <div className="border border-[#1c2e1c] p-3">
        <div className="text-[9px] tracking-[0.3em] text-[#444] mb-3">WHAT DIDN'T WORK</div>
        <div className="space-y-2 text-[11px] text-gray-400 font-orbit leading-relaxed">
          <div><span className="text-[#666]">[x]</span> <span className="text-white">VWAP look-ahead bias:</span> Calculated VWAP using full day data, fake edge. Fixed with progressive VWAP.</div>
          <div><span className="text-[#666]">[x]</span> <span className="text-white">Orderflow data quality:</span> TradingView tick data shows FILLED orders, not orderbook depth.</div>
          <div><span className="text-[#666]">[x]</span> <span className="text-white">Feature inflation:</span> Started with 100+ features, pruned to 68, final formula used 4.</div>
        </div>
      </div>
    </div>
  )
}
