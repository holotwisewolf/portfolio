export default function BuildLogFile() {
  return (
    <div className="p-6 space-y-3 max-w-[1100px]">
      <div className="text-[9px] tracking-[0.3em] text-[#444]">// BUILD_LOG.md</div>
      <h1 className="text-[26px] tracking-[0.15em] text-white">BUILD LOG</h1>

      <div className="border border-[#1c2e1c] p-3">
        <div className="text-[9px] tracking-[0.3em] text-[#444] mb-3">PROJECT ORIGINS</div>
        <div className="space-y-2 text-[11px] text-gray-400 leading-relaxed">
          <p><span className="text-white">Started with Volume Profile:</span> Analyzed VPOC — prior day's high-volume level as support/resistance.</p>
          <p><span className="text-white">The Problem:</span> VPOC touch analysis was too specific. Win rate ~52% — barely better than coin flip.</p>
          <p><span className="text-white">The Pivot:</span> Instead of "will price reverse at THIS level?", shifted to "what REGIME is the market in?" Zone Classification was born.</p>
        </div>
      </div>

      <div className="border border-[#1c2e1c] p-3">
        <div className="text-[9px] tracking-[0.3em] text-[#444] mb-3">ML MODELS COMPARED</div>
        <div className="space-y-1 text-[11px] text-gray-400 font-mono">
          <div><span className="text-[#666]">[ ]</span> <span className="text-white">Random Forest:</span> 76% accuracy, black box. Can't debug failures.</div>
          <div><span className="text-[#666]">[ ]</span> <span className="text-white">Gradient Boosting:</span> 78% accuracy, slower training, still opaque.</div>
          <div><span className="text-[#666]">[ ]</span> <span className="text-white">Logistic Regression:</span> 68% accuracy, too simple.</div>
          <div><span className="text-[#00ff9d]">[x]</span> <span className="text-white">Symbolic Regression:</span> 74% accuracy, interpretable formula. <span className="text-[#00ff9d]">Winner.</span></div>
        </div>
      </div>

      <div className="border border-[#1c2e1c] p-3">
        <div className="text-[9px] tracking-[0.3em] text-[#444] mb-3">ORDERFLOW DATA QUALITY — WHY ORIGINAL APPROACH FAILED</div>
        <div className="space-y-2 text-[11px] text-gray-400 leading-relaxed">
          <p><span className="text-white">The Core Thesis:</span> Acceleration/deceleration differences between buyers/sellers would PREDICT price moves.</p>
          <p><span className="text-white">The Reality:</span> TradingView "tick" data shows FILLED transactions (what actually traded), NOT orderbook depth (what was offered).</p>
          <p><span className="text-white">Critical Finding:</span> You cannot see institutional limit orders sitting at levels — only market orders executing against them. True orderflow analysis requires full MBP-1 (Market-by-Price) orderbook data, not trade tick data.</p>
          <p><span className="text-[#00ff9d]">Pivot:</span> Shifted from "predict price from orderflow" to "classify market regimes from price/volume patterns we CAN reliably measure."</p>
        </div>
      </div>

      <div className="border border-[#1c2e1c] p-3">
        <div className="text-[9px] tracking-[0.3em] text-[#444] mb-3">TECHNICAL STACK EVOLUTION</div>
        <div className="space-y-1 text-[11px] text-gray-400 font-mono">
          <div><span className="text-[#666]">v1</span> <span className="text-white">Manual feature engineering + scikit-learn models</span></div>
          <div><span className="text-[#666]">v2</span> <span className="text-white">Added symbolic regression (PySR from Julia)</span></div>
          <div><span className="text-[#666]">v3</span> <span className="text-white">FastAPI production deployment</span></div>
          <div><span className="text-[#00ff9d]">v4 [current]</span> <span className="text-white">Walk-forward validation integrated, overfitting prevention</span></div>
        </div>
      </div>

      <div className="border border-[#1c2e1c] p-3">
        <div className="text-[9px] tracking-[0.3em] text-[#444] mb-3">FILES & ARCHITECTURE</div>
        <div className="space-y-1 text-[11px] text-gray-400 font-mono">
          <div><span className="text-[#00ff9d]">core/</span>zone_classifier.py — Main classification engine</div>
          <div><span className="text-[#00ff9d]">core/</span>symbolic_regression.py — PySR wrapper</div>
          <div><span className="text-[#00ff9d]">core/</span>feature_extraction.py — 68-feature pipeline</div>
          <div><span className="text-[#00ff9d]">api.py</span> — Production FastAPI endpoint</div>
          <div><span className="text-[#00ff9d]">walk_forward_analytics/</span> — Validation framework</div>
        </div>
      </div>
    </div>
  )
}
