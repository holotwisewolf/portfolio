export default function MethodologyFile() {
  return (
    <div className="p-6 space-y-3 max-w-[1100px]">
      <div className="text-[9px] tracking-[0.3em] text-[#444]">// METHODOLOGY.md</div>
      <h1 className="text-[26px] tracking-[0.15em] text-white">METHODOLOGY</h1>

      <div className="border border-[#1c2e1c] p-3">
        <div className="text-[9px] tracking-[0.3em] text-[#444] mb-3">FEATURE ENGINEERING — 68 FEATURES</div>
        <div className="grid grid-cols-4 gap-0 border-t border-l border-[#1c2e1c]">
          {[
            { name: 'ZONE METRICS', count: 7, items: 'num_candles, duration, zone_high/low, range' },
            { name: 'VOLUME DYNAMICS', count: 17, items: 'volume_diff, roc, trend, stddev, acceleration' },
            { name: 'CANDLE BODIES', count: 13, items: 'avg/max/min_body, wick ratios' },
            { name: 'RANGE & EFFICIENCY', count: 11, items: 'range_efficiency, price_entropy, balance' },
          ].map((cat) => (
            <div key={cat.name} className="border-r border-b border-[#1c2e1c] p-2">
              <div className="flex justify-between items-baseline mb-1">
                <div className="text-[10px] tracking-[0.15em] text-[#00ff9d]">{cat.name}</div>
                <div className="text-[9px] text-[#444]">[{cat.count}]</div>
              </div>
              <div className="text-[10px] text-gray-500 leading-relaxed">{cat.items}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="border border-[#1c2e1c] p-3">
        <div className="text-[9px] tracking-[0.3em] text-[#444] mb-3">SYMBOLIC REGRESSION PROCESS</div>
        <div className="space-y-2 text-[11px] text-gray-400 font-mono">
          <div><span className="text-[#444]">01</span> <span className="text-white">Generate population:</span> 1000 random equations using +, -, x, /, sqrt, log, max, min</div>
          <div><span className="text-[#444]">02</span> <span className="text-white">Evaluate fitness:</span> RMSE vs accuracy trade-off (Pareto frontier)</div>
          <div><span className="text-[#444]">03</span> <span className="text-white">Select & evolve:</span> Best equations breed, mutate, crossover</div>
          <div><span className="text-[#444]">04</span> <span className="text-white">Output formula:</span> Human-readable math equation</div>
        </div>
      </div>
    </div>
  )
}
