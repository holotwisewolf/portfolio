'use client'

// Zone classifier overview. Real facts only: 25 hand-labeled zones, 53 features,
// symbolic equation at 75% test accuracy. No fabricated performance metrics.

export default function ReadmeFile() {
  return (
    <div className="p-6 space-y-3 max-w-[1100px]">
      <div className="text-[9px] tracking-[0.3em] text-[#444]">// README.md</div>
      <h1 className="text-[26px] tracking-[0.15em] text-white">ZONE CLASSIFIER</h1>
      <p className="text-[12px] text-gray-400 leading-relaxed max-w-[600px]">
        Market regime classification using symbolic regression. Three zones, one formula, zero black boxes.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-0 border-t border-l border-[#1c2e1c]">
        <div className="border-r border-b border-[#1c2e1c] p-3">
          <div className="text-[9px] tracking-[0.25em] text-[#444] mb-1">RESEARCH GOAL</div>
          <div className="text-[11px] text-gray-300">Interpretable entry signals without black-box models</div>
        </div>
        <div className="border-r border-b border-[#1c2e1c] p-3">
          <div className="text-[9px] tracking-[0.25em] text-[#444] mb-1">METHOD</div>
          <div className="text-[11px] text-gray-300">Symbolic regression + walk-forward validation</div>
        </div>
        <div className="border-r border-b border-[#1c2e1c] p-3">
          <div className="text-[9px] tracking-[0.25em] text-[#444] mb-1">TRAINING SET</div>
          <div className="text-[11px] text-gray-300">25 hand-labeled zones × 53 features</div>
        </div>
        <div className="border-r border-b border-[#1c2e1c] p-3">
          <div className="text-[9px] tracking-[0.25em] text-[#444] mb-1">TEST ACCURACY</div>
          <div className="text-[11px] text-[#00ff9d]">75% — measured, not projected</div>
        </div>
      </div>

      <div className="border border-[#1c2e1c] p-3">
        <div className="text-[9px] tracking-[0.3em] text-[#444] mb-2">THE PROBLEM</div>
        <div className="space-y-2 text-[11px] text-gray-400 leading-relaxed">
          <p>Most trading strategies fail because they&apos;re overfit to historical data. Black-box ML models may achieve high backtest Sharpe ratios but collapse in live trading when market regimes shift.</p>
          <p className="text-white"><span className="text-[#00ff9d]">[!]</span> You can&apos;t debug what you can&apos;t understand.</p>
        </div>
      </div>

      <div className="border border-[#1c2e1c] p-3">
        <div className="text-[9px] tracking-[0.3em] text-[#444] mb-2">THE SOLUTION</div>
        <div className="space-y-2 text-[11px] text-gray-400 leading-relaxed">
          <p><span className="text-[#00ff9d]">Symbolic Regression</span> — Genetic programming evolves human-readable formulas.</p>
          <p><span className="text-[#00ff9d]">Zone Classification</span> — 3 regimes: Neutral (wait), Consolidation (avoid), Breakout (enter).</p>
          <p><span className="text-[#00ff9d]">Walk-Forward Validation</span> — Rolling backtest simulates real deployment.</p>
        </div>
      </div>

      <div className="border border-[#1c2e1c] bg-black p-3">
        <div className="text-[9px] tracking-[0.3em] text-[#444] mb-2">STATUS</div>
        <p className="text-[11px] text-gray-400 leading-relaxed">
          Research stage. The classifier trains and predicts; the trading backtest on top of it was
          never completed — results pages show measured model metrics, labeled-zone benchmarks, and
          pattern examples, not equity curves.
        </p>
      </div>
    </div>
  )
}
