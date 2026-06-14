const CATEGORIES = [
  { name: 'ZONE METRICS', count: 7, features: ['num_candles', 'duration_minutes', 'zone_high', 'zone_low', 'zone_range', 'total_volume', 'avg_volume'] },
  { name: 'VOLUME DYNAMICS', count: 17, features: ['volume_diff', 'volume_roc', 'volume_roc2', 'volume_trend', 'volume_stddev', 'vol_deceleration_absolute', 'vol_efficiency', 'volume_vs_avg', 'volume_vs_3candles_before', 'volume_vs_5candles_before'] },
  { name: 'CANDLE BODIES', count: 13, features: ['avg_body', 'max_body', 'min_body', 'body_to_range', 'avg_wick_to_body_ratio', 'max_single_wick', 'upper_wick_dominance', 'lower_wick_dominance'] },
  { name: 'WICK ANALYSIS', count: 3, features: ['avg_upper_wick', 'avg_lower_wick', 'wick_ratio'] },
  { name: 'RANGE & EFFICIENCY', count: 11, features: ['range_efficiency', 'price_entropy', 'direction_balance', 'avg_range', 'range_expansion', 'body_to_wick_total', 'efficiency_ratio', 'range_per_candle'] },
  { name: 'FAIR VALUE GAP', count: 4, features: ['fvg_count', 'fvg_size_pct', 'fvg_has_unfilled_fvg', 'fvg_unfilled_ratio'] },
  { name: 'TRANSITION CONTEXT', count: 8, features: ['prev_zone_type', 'after_breakout', 'cycles_completed', 'time_in_cycle', 'transition_count', 'last_zone_duration', 'zone_sequence_pattern'] },
  { name: 'CYCLE DETECTION', count: 5, features: ['dominant_cycle', 'cycle_phase', 'amplitude_trend', 'frequency_stability', 'regime_persistence'] },
]

export default function FeaturesFile() {
  return (
    <div className="p-6 space-y-3 max-w-[1100px]">
      <div className="text-[9px] tracking-[0.3em] text-[#444]">// FEATURES.md</div>
      <h1 className="text-[26px] tracking-[0.15em] text-white">FEATURES <span className="text-[#444] text-[14px]">[68 TOTAL]</span></h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 border-t border-l border-[#1c2e1c]">
        {CATEGORIES.map((cat) => (
          <div key={cat.name} className="border-r border-b border-[#1c2e1c] p-3">
            <div className="flex justify-between items-baseline mb-2">
              <div className="text-[11px] tracking-[0.15em] text-[#00ff9d]">{cat.name}</div>
              <div className="text-[10px] text-[#444]">[{cat.count} features]</div>
            </div>
            <div className="flex flex-wrap gap-1">
              {cat.features.map((f) => (
                <span key={f} className="text-[10px] px-2 py-[2px] text-gray-400 border border-[#1c2e1c] bg-black">{f}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
