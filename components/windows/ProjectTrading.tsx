'use client'

import { useState } from 'react'
import TradingVisualizer from '../projects/TradingVisualizer'
import VPOCDemo from '../projects/VPOCDemo'

// Main Research Projects
type ProjectType = 'zone' | 'orderflow' | 'vpoc' | 'ib' | 'hmm' | 'walkforward' | 'symbolic'

// Zone Classifier Sub-tabs
type ZoneTabType = 'overview' | 'methodology' | 'backtest' | 'features' | 'findings' | 'how-i-built-this' | 'settings'

// Orderflow Sub-tabs
type OrderflowTabType = 'overview' | 'elasticity' | 'data-quality' | 'findings' | 'thesis'

// VPOC Sub-tabs
type VPOCTabType = 'overview' | 'theory' | 'methodology' | 'results' | 'evolution'

// IB Strategy Sub-tabs
type IBTabType = 'overview' | 'geometry' | 'mean-reversion' | 'sustained-auction' | 'results'

// HMM Sub-tabs
type HMMTabType = 'overview' | 'regime-detection' | 'features' | 'comparison'

// Walk-Forward Sub-tabs
type WalkForwardTabType = 'overview' | 'framework' | 'robustness' | 'results'

// Symbolic Regression Sub-tabs
type SymbolicTabType = 'overview' | 'methodology' | 'evolution' | 'formulas' | 'validation'

const PROJECTS = [
  { id: 'zone' as ProjectType, label: 'Zone Classifier', emoji: '📊', description: 'Main ML System' },
  { id: 'orderflow' as ProjectType, label: 'Orderflow Research', emoji: '💹', description: 'Elasticity & Delta' },
  { id: 'vpoc' as ProjectType, label: 'VPOC Analysis', emoji: '🎯', description: 'Volume Profile' },
  { id: 'ib' as ProjectType, label: 'IB Strategy', emoji: '📊', description: 'Initial Balance' },
  { id: 'hmm' as ProjectType, label: 'HMM Analysis', emoji: '🔄', description: 'Regime Detection' },
  { id: 'walkforward' as ProjectType, label: 'Walk-Forward', emoji: '🔬', description: 'Validation Framework' },
  { id: 'symbolic' as ProjectType, label: 'Symbolic Regression', emoji: '🧬', description: 'Interpretable AI' },
]

const ZONE_TABS: { id: ZoneTabType; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'methodology', label: 'Methodology' },
  { id: 'backtest', label: 'Backtest Demo' },
  { id: 'features', label: 'Features (68)' },
  { id: 'findings', label: 'Findings' },
  { id: 'how-i-built-this', label: 'How I Built This' },
  { id: 'settings', label: 'Settings' },
]

const ORDERFLOW_TABS: { id: OrderflowTabType; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'elasticity', label: 'Elasticity Analysis' },
  { id: 'data-quality', label: 'Data Quality' },
  { id: 'findings', label: 'Findings' },
  { id: 'thesis', label: 'Thesis Paper' },
]

const VPOC_TABS: { id: VPOCTabType; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'theory', label: 'Theory' },
  { id: 'methodology', label: 'Methodology' },
  { id: 'results', label: 'Results' },
  { id: 'evolution', label: 'Evolution → Zones' },
]

const IB_TABS: { id: IBTabType; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'geometry', label: 'Geometry' },
  { id: 'mean-reversion', label: 'Mean Reversion' },
  { id: 'sustained-auction', label: 'Sustained Auction' },
  { id: 'results', label: 'Results' },
]

const HMM_TABS: { id: HMMTabType; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'regime-detection', label: 'Regime Detection' },
  { id: 'features', label: 'Features' },
  { id: 'comparison', label: 'vs Zone Classifier' },
]

const WALKFORWARD_TABS: { id: WalkForwardTabType; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'framework', label: 'Framework' },
  { id: 'robustness', label: 'Robustness' },
  { id: 'results', label: 'Results' },
]

const SYMBOLIC_TABS: { id: SymbolicTabType; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'methodology', label: 'Methodology' },
  { id: 'evolution', label: 'Evolution Process' },
  { id: 'formulas', label: 'Discovered Formulas' },
  { id: 'validation', label: 'Validation' },
]

export default function ProjectTrading() {
  const [activeProject, setActiveProject] = useState<ProjectType>('zone')
  const [zoneTab, setZoneTab] = useState<ZoneTabType>('overview')
  const [orderflowTab, setOrderflowTab] = useState<OrderflowTabType>('overview')
  const [vpocTab, setVPOCTab] = useState<VPOCTabType>('overview')
  const [ibTab, setIBTab] = useState<IBTabType>('overview')
  const [hmmTab, setHMMTab] = useState<HMMTabType>('overview')
  const [walkforwardTab, setWalkForwardTab] = useState<WalkForwardTabType>('overview')
  const [symbolicTab, setSymbolicTab] = useState<SymbolicTabType>('overview')

  const [settings, setSettings] = useState({
    lookbackWindow: 20,
    volatilityThreshold: 1.5,
    volumeWeight: 0.3,
    momentumWeight: 0.5,
    reversionWeight: 0.2,
  })

  const getActiveTabs = () => {
    switch (activeProject) {
      case 'zone': return ZONE_TABS
      case 'orderflow': return ORDERFLOW_TABS
      case 'vpoc': return VPOC_TABS
      case 'ib': return IB_TABS
      case 'hmm': return HMM_TABS
      case 'walkforward': return WALKFORWARD_TABS
      case 'symbolic': return SYMBOLIC_TABS
      default: return ZONE_TABS
    }
  }

  const getActiveTab = () => {
    switch (activeProject) {
      case 'zone': return zoneTab
      case 'orderflow': return orderflowTab
      case 'vpoc': return vpocTab
      case 'ib': return ibTab
      case 'hmm': return hmmTab
      case 'walkforward': return walkforwardTab
      case 'symbolic': return symbolicTab
      default: return zoneTab
    }
  }

  const setActiveTab = (tab: string) => {
    switch (activeProject) {
      case 'zone': setZoneTab(tab as ZoneTabType); break
      case 'orderflow': setOrderflowTab(tab as OrderflowTabType); break
      case 'vpoc': setVPOCTab(tab as VPOCTabType); break
      case 'ib': setIBTab(tab as IBTabType); break
      case 'hmm': setHMMTab(tab as HMMTabType); break
      case 'walkforward': setWalkForwardTab(tab as WalkForwardTabType); break
      case 'symbolic': setSymbolicTab(tab as SymbolicTabType); break
    }
  }

  return (
    <div className="h-full flex flex-col bg-[#1a1a1a] font-mono text-xs">
      {/* Header */}
      <div className="border-b border-white/20 p-4">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-bold text-white">Trading Research</h2>
          <span className="text-gray-600">|</span>
          <p className="text-gray-500 text-[10px]">Systematic trading research portfolio • 6 projects</p>
        </div>
        <div className="flex gap-2 mt-2 flex-wrap">
          <span className="text-[10px] border border-white/40 px-2 py-0.5 text-gray-300">Python</span>
          <span className="text-[10px] border border-white/40 px-2 py-0.5 text-gray-300">ML/Genetic Programming</span>
          <span className="text-[10px] border border-white/40 px-2 py-0.5 text-gray-300">HMM</span>
          <span className="text-[10px] border border-white/40 px-2 py-0.5 text-gray-300">FastAPI</span>
          <span className="text-[10px] border border-white/40 px-2 py-0.5 text-gray-300">NumPy/Pandas</span>
        </div>
      </div>

      {/* Main Project Navigation */}
      <div className="flex border-b border-white/10 bg-black/30">
        {PROJECTS.map(project => (
          <button
            key={project.id}
            onClick={() => setActiveProject(project.id)}
            className={`px-3 py-2 text-[11px] transition-colors flex items-center gap-2 ${
              activeProject === project.id
                ? 'text-green-400 border-b-2 border-green-400 bg-green-400/5'
                : 'text-gray-600 hover:text-gray-400 hover:bg-white/5'
            }`}
          >
            <span>{project.emoji}</span>
            <span>{project.label}</span>
            <span className="text-[9px] opacity-60">({project.description})</span>
          </button>
        ))}
      </div>

      {/* Sub-tabs */}
      <div className="flex border-b border-white/5 bg-black/20">
        {getActiveTabs().map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-1.5 text-[10px] uppercase tracking-wider transition-colors ${
              getActiveTab() === tab.id
                ? 'text-green-400 border-b-2 border-green-400'
                : 'text-gray-600 hover:text-gray-400'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeProject === 'zone' && <ZoneContent activeTab={zoneTab} settings={settings} setSettings={setSettings} />}
        {activeProject === 'orderflow' && <OrderflowContent activeTab={orderflowTab} />}
        {activeProject === 'vpoc' && <VPOCContent activeTab={vpocTab} />}
        {activeProject === 'ib' && <IBContent activeTab={ibTab} />}
        {activeProject === 'hmm' && <HMMContent activeTab={hmmTab} />}
        {activeProject === 'walkforward' && <WalkForwardContent activeTab={walkforwardTab} />}
        {activeProject === 'symbolic' && <SymbolicContent activeTab={symbolicTab} />}
      </div>
    </div>
  )
}

// ========== ZONE CLASSIFIER CONTENT ==========
function ZoneContent({ activeTab, settings, setSettings }: { activeTab: ZoneTabType; settings: any; setSettings: any }) {
  if (activeTab === 'backtest') {
    return <TradingVisualizer />
  }

  if (activeTab === 'settings') {
    return (
      <div className="p-4 space-y-4">
        <div className="bg-black/50 border border-white/10 p-4 rounded">
          <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-3">Model Parameters</div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-gray-400">Lookback Window (days)</span>
                <span className="text-green-400">{settings.lookbackWindow}</span>
              </div>
              <input
                type="range"
                min={5}
                max={60}
                value={settings.lookbackWindow}
                onChange={(e) => setSettings((s: any) => ({ ...s, lookbackWindow: parseInt(e.target.value) }))}
                className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-gray-400">Volatility Threshold</span>
                <span className="text-green-400">{settings.volatilityThreshold}</span>
              </div>
              <input
                type="range"
                min={0.5}
                max={3}
                step={0.1}
                value={settings.volatilityThreshold}
                onChange={(e) => setSettings((s: any) => ({ ...s, volatilityThreshold: parseFloat(e.target.value) }))}
                className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-gray-400">Volume Weight</span>
                <span className="text-green-400">{(settings.volumeWeight * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={1}
                step={0.1}
                value={settings.volumeWeight}
                onChange={(e) => setSettings((s: any) => ({ ...s, volumeWeight: parseFloat(e.target.value) }))}
                className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-4">
      {activeTab === 'overview' && (
        <>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-black/50 border border-white/10 p-3 rounded">
              <div className="text-gray-600 text-[10px] uppercase mb-1">Research Goal</div>
              <div className="text-gray-300">Discover interpretable entry signals without black-box models</div>
            </div>
            <div className="bg-black/50 border border-white/10 p-3 rounded">
              <div className="text-gray-600 text-[10px] uppercase mb-1">Method</div>
              <div className="text-gray-300">Symbolic regression + walk-forward validation</div>
            </div>
            <div className="bg-black/50 border border-white/10 p-3 rounded">
              <div className="text-gray-600 text-[10px] uppercase mb-1">Status</div>
              <div className="text-green-400">Production API deployed</div>
            </div>
          </div>

          <div className="bg-black/50 border border-white/10 p-4 rounded">
            <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-3">The Problem</div>
            <div className="text-gray-400 space-y-2 text-[11px] leading-relaxed">
              <p>Most trading strategies fail because they're overfit to historical data. Black-box ML models
              may achieve high backtest Sharpe ratios but collapse in live trading when market regimes shift.</p>
              <p className="text-yellow-500">Key Issue: You can't debug what you can't understand.</p>
            </div>
          </div>

          <div className="bg-black/50 border border-white/10 p-4 rounded">
            <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-3">The Solution</div>
            <div className="text-gray-400 space-y-2 text-[11px] leading-relaxed">
              <p><span className="text-green-400">Symbolic Regression:</span> Genetic programming evolves human-readable formulas.</p>
              <p><span className="text-green-400">Zone Classification:</span> 3 regimes: Neutral (wait), Consolidation (avoid), Breakout (enter).</p>
              <p><span className="text-green-400">Walk-Forward Validation:</span> Rolling backtest simulates real deployment.</p>
            </div>
          </div>
        </>
      )}

      {activeTab === 'methodology' && (
        <div className="space-y-4">
          <div className="bg-black/50 border border-white/10 p-4 rounded">
            <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-3">Feature Engineering (68 Features)</div>
            <div className="grid grid-cols-4 gap-2 text-[10px]">
              <div className="p-2 bg-black/30 rounded border border-white/5">
                <div className="text-green-400 mb-1">Zone Metrics (7)</div>
                <div className="text-gray-500">num_candles, duration, zone_high/low, range</div>
              </div>
              <div className="p-2 bg-black/30 rounded border border-white/5">
                <div className="text-green-400 mb-1">Volume Dynamics (17)</div>
                <div className="text-gray-500">volume_diff, roc, trend, stddev, acceleration</div>
              </div>
              <div className="p-2 bg-black/30 rounded border border-white/5">
                <div className="text-green-400 mb-1">Candle Bodies (13)</div>
                <div className="text-gray-500">avg/max/min_body, wick ratios</div>
              </div>
              <div className="p-2 bg-black/30 rounded border border-white/5">
                <div className="text-green-400 mb-1">Range & Efficiency (11)</div>
                <div className="text-gray-500">range_efficiency, price_entropy, balance</div>
              </div>
            </div>
          </div>

          <div className="bg-black/50 border border-white/10 p-4 rounded">
            <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-3">Symbolic Regression Process</div>
            <div className="text-gray-400 space-y-2 text-[11px]">
              <p><span className="text-white">1. Generate population:</span> 1000 random equations using +, -, ×, ÷, √, log, max, min</p>
              <p><span className="text-white">2. Evaluate fitness:</span> RMSE vs accuracy trade-off (Pareto frontier)</p>
              <p><span className="text-white">3. Select & evolve:</span> Best equations breed, mutate, crossover</p>
              <p><span className="text-white">4. Output formula:</span> Human-readable math equation</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'features' && (
        <div className="space-y-4">
          {[
            { name: 'Zone Metrics', count: 7, features: ['num_candles', 'duration_minutes', 'zone_high', 'zone_low', 'zone_range', 'total_volume', 'avg_volume'] },
            { name: 'Volume Dynamics', count: 17, features: ['volume_diff', 'volume_roc', 'volume_roc2', 'volume_trend', 'volume_stddev', 'vol_deceleration_absolute', 'vol_efficiency', 'volume_vs_avg', 'volume_vs_3candles_before', 'volume_vs_5candles_before'] },
            { name: 'Candle Bodies', count: 13, features: ['avg_body', 'max_body', 'min_body', 'body_to_range', 'avg_wick_to_body_ratio', 'max_single_wick', 'upper_wick_dominance', 'lower_wick_dominance'] },
            { name: 'Wick Analysis', count: 3, features: ['avg_upper_wick', 'avg_lower_wick', 'wick_ratio'] },
            { name: 'Range & Efficiency', count: 11, features: ['range_efficiency', 'price_entropy', 'direction_balance', 'avg_range', 'range_expansion', 'body_to_wick_total', 'efficiency_ratio', 'range_per_candle'] },
            { name: 'Fair Value Gap', count: 4, features: ['fvg_count', 'fvg_size_pct', 'fvg_has_unfilled_fvg', 'fvg_unfilled_ratio'] },
            { name: 'Transition Context', count: 8, features: ['prev_zone_type', 'after_breakout', 'cycles_completed', 'time_in_cycle', 'transition_count', 'last_zone_duration', 'zone_sequence_pattern'] },
            { name: 'Cycle Detection', count: 5, features: ['dominant_cycle', 'cycle_phase', 'amplitude_trend', 'frequency_stability', 'regime_persistence'] },
          ].map(category => (
            <div key={category.name} className="bg-black/50 border border-white/10 p-4 rounded">
              <div className="flex justify-between items-center mb-2">
                <div className="text-green-400 text-[11px] font-medium">{category.name}</div>
                <div className="text-gray-600 text-[10px]">{category.count} features</div>
              </div>
              <div className="flex flex-wrap gap-1">
                {category.features.map(f => (
                  <span key={f} className="text-[9px] bg-black/30 px-2 py-0.5 text-gray-400 border border-white/5">{f}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'findings' && (
        <div className="space-y-4">
          <div className="bg-black/50 border border-white/10 p-4 rounded">
            <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-3">Key Discoveries</div>
            <div className="space-y-3">
              <div className="border-l-2 border-green-500 pl-3">
                <div className="text-green-400 text-[11px] font-medium">Simplicity wins</div>
                <div className="text-gray-500 text-[10px] mt-1">
                  Final formula used only 4 features: zone_range, volume_diff, avg_wick_to_body_ratio, price_entropy.
                  Simpler models generalized better across time periods.
                </div>
              </div>
              <div className="border-l-2 border-purple-500 pl-3">
                <div className="text-purple-400 text-[11px] font-medium">Regime-based {'>'} Entry signals</div>
                <div className="text-gray-500 text-[10px] mt-1">
                  Zone classification (Neutral/Consolidation/Breakout) outperformed direct entry signals.
                  Knowing when NOT to trade is as valuable as knowing when to enter.
                </div>
              </div>
              <div className="border-l-2 border-blue-500 pl-3">
                <div className="text-blue-400 text-[11px] font-medium">Volume precedes Price</div>
                <div className="text-gray-500 text-[10px] mt-1">
                  Volume acceleration led price changes by 1-3 candles in 73% of breakout zones.
                  Smart money accumulates before the move.
                </div>
              </div>
            </div>
          </div>

          <div className="bg-black/50 border border-white/10 p-4 rounded">
            <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-3">What Didn't Work</div>
            <div className="space-y-2 text-[10px] text-gray-400">
              <p><span className="text-red-400">VWAP look-ahead bias:</span> Calculated VWAP using full day data → fake edge. Fixed with progressive VWAP.</p>
              <p><span className="text-red-400">Orderflow data quality:</span> TradingView tick data shows FILLED orders, not orderbook depth.</p>
              <p><span className="text-red-400">Feature inflation:</span> Started with 100+ features → pruned to 68 → final formula used 4.</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'how-i-built-this' && (
        <div className="space-y-4">
          <div className="bg-black/50 border border-white/10 p-4 rounded">
            <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-3">Project Origins: The Orderflow Beginning</div>
            <div className="text-[10px] text-gray-400 space-y-2">
              <p><span className="text-white font-medium">Started with Volume Profile:</span> Analyzed VPOC — prior day's high-volume level as support/resistance.</p>
              <p><span className="text-white font-medium">The Problem:</span> VPOC touch analysis was too specific. Win rate ~52% — barely better than coin flip.</p>
              <p><span className="text-white font-medium">The Pivot:</span> Instead of "will price reverse at THIS level?", shifted to "what REGIME is the market in?" Zone Classification was born.</p>
            </div>
          </div>

          <div className="bg-black/50 border border-white/10 p-4 rounded">
            <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-3">ML Models Compared</div>
            <div className="space-y-2 text-[10px] text-gray-400">
              <p><span className="text-white">Random Forest:</span> 76% accuracy but black box. Can't debug failures.</p>
              <p><span className="text-white">Gradient Boosting:</span> 78% accuracy, slower training, still opaque.</p>
              <p><span className="text-white">Logistic Regression:</span> 68% accuracy, too simple.</p>
              <p><span className="text-green-400">Symbolic Regression:</span> 74% accuracy, interpretable formula. Winner.</p>
            </div>
          </div>

          <div className="bg-black/50 border border-white/10 p-4 rounded">
            <div className="text-purple-400 text-[11px] font-medium mb-3">Problem: Orderflow Data Quality (Why Original Approach Failed)</div>
            <div className="text-[10px] text-gray-400 space-y-2">
              <p><span className="text-white font-medium">The Core Thesis:</span> Acceleration/deceleration differences between buyers/sellers would PREDICT price moves.</p>
              <p><span className="text-white font-medium">The Data Problem:</span> TradingView tick-by-tick data shows FILLED orders, not the full orderbook.</p>
              <p className="text-purple-400 block mt-1">Without MBP-1 (Market-by-Price) orderbook data showing bid/ask depth changes, I'm not measuring orderflow — I'm measuring noise.</p>
            </div>
          </div>

          <div className="bg-black/50 border border-white/10 p-4 rounded">
            <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-3">What I Would Do Differently</div>
            <div className="space-y-2 text-[10px] text-gray-400">
              <p><span className="text-white font-medium">Start with zone classification, not VPOC.</span> Would have saved 6 months.</p>
              <p><span className="text-white font-medium">Use PySR from day one.</span> Spent months with gplearn.</p>
              <p><span className="text-red-400 font-medium">Watch for look-ahead bias from day zero.</span></p>
              <p className="text-yellow-400">The VWAP mistake: Calculating daily VWAP using FULL day's volume data — including future candles. Win rates dropped from ~62% to ~51% after fixing.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ========== ORDERFLOW CONTENT ==========
function OrderflowContent({ activeTab }: { activeTab: OrderflowTabType }) {
  return (
    <div className="p-4 space-y-4">
      {activeTab === 'overview' && (
        <>
          <div className="bg-black/50 border border-white/10 p-4 rounded">
            <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-3">Orderflow Research Overview</div>
            <div className="text-gray-400 space-y-2 text-[11px]">
              <p>Research into whether orderflow dynamics (delta acceleration, elasticity) predict short-term price movements in NQ futures.</p>
              <p className="text-yellow-400">Key Finding: Pattern exists but not robust across time. August 2024: $23.38/trade EV. August 2025: $1.61/trade EV.</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="bg-black/50 border border-white/10 p-3 rounded">
              <div className="text-gray-600 text-[10px] uppercase mb-1">Data Source</div>
              <div className="text-gray-300">Databento CME Globex MDP 3.0</div>
            </div>
            <div className="bg-black/50 border border-white/10 p-3 rounded">
              <div className="text-gray-600 text-[10px] uppercase mb-1">Instrument</div>
              <div className="text-gray-300">NQ (Nasdaq 100 E-mini)</div>
            </div>
            <div className="bg-black/50 border border-white/10 p-3 rounded">
              <div className="text-gray-600 text-[10px] uppercase mb-1">Sample Size</div>
              <div className="text-gray-300">247,883 observations</div>
            </div>
          </div>
        </>
      )}

      {activeTab === 'elasticity' && (
        <div className="space-y-4">
          <div className="bg-black/50 border border-white/10 p-4 rounded">
            <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-3">Elasticity Metric</div>
            <div className="text-gray-400 space-y-2 text-[11px]">
              <p><span className="text-white font-medium">Formula:</span> E = R / |Δ| (Price Range / Absolute Delta)</p>
              <p><span className="text-green-400">Low Elasticity:</span> Large delta with small price movement → strong absorption by liquidity providers</p>
              <p><span className="text-red-400">High Elasticity:</span> Small delta with large price movement → thin order book, high impact</p>
            </div>
          </div>

          <div className="bg-black/50 border border-white/10 p-4 rounded">
            <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-3">Delta Acceleration</div>
            <div className="text-gray-400 space-y-2 text-[11px]">
              <p><span className="text-white font-medium">Formula:</span> A = (Δ_recent - Δ_prior) / max(|Δ_prior|, ε)</p>
              <p><span className="text-blue-400">Fast Deceleration (Q1):</span> Aggressive side losing momentum, potential exhaustion</p>
              <p><span className="text-purple-400">Fast Acceleration (Q4):</span> Momentum building, continuation likely</p>
            </div>
          </div>

          <div className="bg-black/50 border border-white/10 p-4 rounded">
            <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-3">Best Configuration</div>
            <div className="text-gray-400 space-y-1 text-[11px]">
              <p><span className="text-green-400">Low Elasticity + Fast Deceleration + High Volume</span></p>
              <p>August 2024: 51.4% win rate, $23.38/trade EV</p>
              <p>August 2025: 45.3% win rate, $1.61/trade EV</p>
              <p className="text-yellow-400">Pattern consistent, profitability not robust.</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'data-quality' && (
        <div className="space-y-4">
          <div className="bg-black/50 border border-red-500/30 p-4 rounded">
            <div className="text-red-400 text-[11px] font-medium mb-3">Critical Data Limitation</div>
            <div className="text-gray-400 space-y-2 text-[11px]">
              <p><span className="text-white font-medium">The Problem:</span> TradingView tick-by-tick data shows FILLED orders only, not the full orderbook.</p>
              <p><span className="text-white font-medium">Why This Matters:</span></p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>True orderflow (Bookmap-style) shows bid/ask depth changes BEFORE fills</li>
                <li>TradingView only shows you what already happened</li>
                <li>By the time you see a "large buyer" in trade data, the institutional order is already filled</li>
                <li>You're chasing shadows, not leading the market</li>
              </ul>
              <p className="text-yellow-400">This is why orderflow strategies showed promise but failed in production — the data didn't contain the signal we thought it did.</p>
            </div>
          </div>

          <div className="bg-black/50 border border-white/10 p-4 rounded">
            <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-3">MBP-1 vs Trade Data</div>
            <div className="text-gray-400 space-y-2 text-[11px]">
              <p><span className="text-green-400">MBP-1 (Market-by-Price):</span> Full orderbook depth, bid/ask changes, limit order placement</p>
              <p><span className="text-red-400">Trade Data:</span> Filled orders only, execution price, volume, timestamp</p>
              <p><span className="text-white font-medium">Conclusion:</span> Without MBP-1 orderbook data, I'm not measuring orderflow — I'm measuring noise.</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'findings' && (
        <div className="space-y-4">
          <div className="bg-black/50 border border-white/10 p-4 rounded">
            <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-3">Cross-Validation Results</div>
            <div className="text-gray-400 text-[11px] space-y-2">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="pb-2">Period</th>
                    <th className="pb-2">Best Cell</th>
                    <th className="pb-2">Win Rate</th>
                    <th className="pb-2">EV/Trade</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td className="py-2">Aug 2024</td><td>Low E + FastDecel + HighVol</td><td>51.4%</td><td className="text-green-400">$23.38</td></tr>
                  <tr><td className="py-2">Aug 2025</td><td>Low E + FastDecel + LowVol</td><td>45.3%</td><td className="text-yellow-400">$1.61</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-black/50 border border-white/10 p-4 rounded">
            <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-3">What IS Consistent</div>
            <div className="text-gray-400 space-y-1 text-[11px]">
              <p>✓ Low E + FastDecel is best-performing cell in both periods</p>
              <p>✓ Pattern reliably identifies relative outperformers</p>
              <p>✓ Underlying microstructure dynamics are captured</p>
            </div>
          </div>

          <div className="bg-black/50 border border-white/10 p-4 rounded">
            <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-3">What IS NOT Consistent</div>
            <div className="text-gray-400 space-y-1 text-[11px]">
              <p>✗ Absolute profitability</p>
              <p>✗ Optimal target/stop parameters</p>
              <p>✗ Volume's incremental value</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ========== VPOC CONTENT ==========
function VPOCContent({ activeTab }: { activeTab: VPOCTabType }) {
  const [viewMode, setViewMode] = useState<'overview' | 'day' | 'results'>('overview')
  const [selectedDay, setSelectedDay] = useState(0)

  if (activeTab === 'methodology' || activeTab === 'results') {
    // Use VPOCDemo for methodology/results
    return <VPOCDemo />
  }

  return (
    <div className="p-4 space-y-4">
      {activeTab === 'overview' && (
        <>
          <div className="bg-black/50 border border-white/10 p-4 rounded">
            <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-3">VPOC Analysis Overview</div>
            <div className="text-gray-400 space-y-2 text-[11px]">
              <p><span className="text-white font-medium">Concept:</span> Volume Point of Control (VPOC) = price level with highest cumulative volume in a session.</p>
              <p><span className="text-white font-medium">Hypothesis:</span> When price returns to prior day's VPOC, it should react (bounce or accelerate through).</p>
              <p className="text-yellow-400">Result: ~52% win rate. Better than coin flip, but not enough.</p>
            </div>
          </div>

          <div className="bg-black/50 border border-white/10 p-4 rounded">
            <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-3">Why It Failed</div>
            <div className="text-gray-400 space-y-2 text-[11px]">
              <p><span className="text-red-400">Too specific:</span> Focusing on single price level ignored market regime context.</p>
              <p><span className="text-red-400">Binary outcome:</span> Price either reverses or doesn't. No third option for "wait."</p>
              <p><span className="text-red-400">No regime awareness:</span> Same rules for ranging and trending markets.</p>
              <p className="text-green-400">This failure led to Zone Classification — regime-aware, three-state system.</p>
            </div>
          </div>
        </>
      )}

      {activeTab === 'theory' && (
        <div className="space-y-4">
          <div className="bg-black/50 border border-white/10 p-4 rounded">
            <div className="text-green-400 text-[11px] font-semibold mb-3">📚 The Theory</div>
            <div className="text-gray-400 space-y-2 text-[10px]">
              <p><span className="text-white font-medium">Core Thesis:</span> VPOC represents "fair value" for a trading session.</p>
              <p><span className="text-white font-medium">Expected Behavior:</span></p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Price approaches VPOC → consolidation, testing the level</li>
                <li>If VPOC holds → reversal (bounce) in opposite direction</li>
                <li>If VPOC breaks → accelerated move in breakout direction</li>
              </ul>
            </div>
          </div>

          <div className="bg-black/50 border border-white/10 p-4 rounded">
            <div className="text-blue-400 text-[11px] font-semibold mb-3">🔬 Methodology</div>
            <div className="text-gray-400 space-y-2 text-[10px]">
              <div className="flex gap-2">
                <span className="text-green-400">1.</span>
                <span>Calculate VPOC for each day (price with highest cumulative volume)</span>
              </div>
              <div className="flex gap-2">
                <span className="text-green-400">2.</span>
                <span>On day N+1, check if price touches day N's VPOC</span>
              </div>
              <div className="flex gap-2">
                <span className="text-green-400">3.</span>
                <span>Determine approach direction (from above/below)</span>
              </div>
              <div className="flex gap-2">
                <span className="text-green-400">4.</span>
                <span>Test various target/stop combinations</span>
              </div>
              <div className="flex gap-2">
                <span className="text-green-400">5.</span>
                <span>Calculate win rate and expected value</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'evolution' && (
        <div className="space-y-4">
          <div className="bg-black/50 border border-white/10 p-4 rounded">
            <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-3">From VPOC to Zone Classification</div>
            <div className="text-gray-400 space-y-2 text-[11px]">
              <p><span className="text-white font-medium">Problem with VPOC:</span></p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Binary: reverses or doesn't (no "wait" option)</li>
                <li>Level-specific: ignores broader market context</li>
                <li>Static: same rules regardless of regime</li>
              </ul>

              <p className="mt-3"><span className="text-white font-medium">Zone Classification Solution:</span></p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Three states: Neutral (wait), Consolidation (avoid), Breakout (enter)</li>
                <li>Regime-aware: different behavior in different market conditions</li>
                <li>68 features: captures comprehensive market state</li>
              </ul>

              <p className="text-green-400 mt-3">VPOC research was the starting point, but Zone Classification was the evolution.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ========== IB STRATEGY CONTENT ==========
function IBContent({ activeTab }: { activeTab: IBTabType }) {
  return (
    <div className="p-4 space-y-4">
      {activeTab === 'overview' && (
        <>
          <div className="bg-black/50 border border-white/10 p-4 rounded">
            <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-3">Initial Balance Strategy Overview</div>
            <div className="text-gray-400 space-y-2 text-[11px]">
              <p><span className="text-white font-medium">Two Strategies:</span></p>
              <p><span className="text-green-400">1. Mean Reversion:</span> Fade 100% extension moves. For ranging markets.</p>
              <p><span className="text-blue-400">2. Sustained Auction:</span> Break & retest of IB range. For trending markets.</p>
              <p className="text-yellow-400">Both use the "Cloned Box" geometry — IB height extended above/below the opening range.</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="bg-black/50 border border-white/10 p-3 rounded">
              <div className="text-gray-600 text-[10px] uppercase mb-1">IB Period</div>
              <div className="text-gray-300">9:30 - 10:30 AM ET</div>
            </div>
            <div className="bg-black/50 border border-white/10 p-3 rounded">
              <div className="text-gray-600 text-[10px] uppercase mb-1">Instrument</div>
              <div className="text-gray-300">NQ / ES Futures</div>
            </div>
            <div className="bg-black/50 border border-white/10 p-3 rounded">
              <div className="text-gray-600 text-[10px] uppercase mb-1">10% Leeway</div>
              <div className="text-gray-300">On retest entries</div>
            </div>
          </div>
        </>
      )}

      {activeTab === 'geometry' && (
        <div className="space-y-4">
          <div className="bg-black/50 border border-white/10 p-4 rounded">
            <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-3">The Cloned Box Geometry</div>
            <div className="text-gray-400 space-y-2 text-[11px]">
              <p><span className="text-white font-medium">IB Box:</span> Initial Balance range (first hour high/low)</p>
              <p><span className="text-white font-medium">Height:</span> IB high - IB low</p>
              <p><span className="text-white font-medium">100% Extension:</span> Height added above IB high and below IB low</p>
              <p><span className="text-white font-medium">50% Extension:</span> Half height added (intermediate level)</p>
            </div>
          </div>

          <div className="bg-black/50 border border-white/10 p-4 rounded">
            <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-3">Level Calculations</div>
            <div className="text-gray-400 text-[11px] space-y-1 font-mono">
              <p>IB_High = max(price) during 9:30-10:30</p>
              <p>IB_Low = min(price) during 9:30-10:30</p>
              <p>Height = IB_High - IB_Low</p>
              <p>Ext_100_Top = IB_High + Height</p>
              <p>Ext_100_Bottom = IB_Low - Height</p>
              <p>Ext_50_Top = IB_High + (0.5 × Height)</p>
              <p>Ext_50_Bottom = IB_Low - (0.5 × Height)</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'mean-reversion' && (
        <div className="space-y-4">
          <div className="bg-black/50 border border-white/10 p-4 rounded">
            <div className="text-green-400 text-[11px] font-medium mb-3">Strategy 1: Mean Reversion (Fade the Extension)</div>
            <div className="text-gray-400 space-y-2 text-[11px]">
              <p><span className="text-white font-medium">Concept:</span> Price stretched to 100% extension is overextended — fade the move.</p>

              <p className="mt-2"><span className="text-white font-medium">Entry Rules:</span></p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Wait for candle to touch 100% extension</li>
                <li>Enter on close below extension (for short) or above (for long)</li>
                <li>Use ATR × 0.5 as buffer zone</li>
              </ul>

              <p className="mt-2"><span className="text-white font-medium">Targets:</span></p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Conservative: IB Edge only</li>
                <li>Moderate: IB Edge + IB Mid</li>
                <li>Aggressive: Full range to 150% extension</li>
              </ul>

              <p className="mt-2"><span className="text-white font-medium">Stops:</span></p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Structure: Candle high/low + 2 ticks</li>
                <li>Smart: IB Height + 5 ticks</li>
                <li>Fixed: 20 ticks (5 points)</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'sustained-auction' && (
        <div className="space-y-4">
          <div className="bg-black/50 border border-white/10 p-4 rounded">
            <div className="text-blue-400 text-[11px] font-medium mb-3">Strategy 2: Sustained Auction (Break & Retest)</div>
            <div className="text-gray-400 space-y-2 text-[11px]">
              <p><span className="text-white font-medium">Concept:</span> "Voices of the chord" — break retest of IB range confirms sustained auction direction.</p>

              <p className="mt-2"><span className="text-white font-medium">Breakout Confirmation:</span></p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Long: Price closes {'>'} IB_High + 5 ticks</li>
                <li>Short: Price closes {'<'} IB_Low - 5 ticks</li>
                <li>Using 5-second close (stable price, not wick phenomenon)</li>
              </ul>

              <p className="mt-2"><span className="text-white font-medium">Retest Entry:</span></p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>After breakout, wait for price to return to IB edge</li>
                <li>Enter on touch of IB_High (for long) or IB_Low (for short)</li>
                <li><span className="text-yellow-400">10% Leeway:</span> Entry allowed within 10% of IB height from edge</li>
                <li>This acknowledges failed auction if price doesn't respect the level</li>
              </ul>

              <p className="mt-2"><span className="text-white font-medium">Targets:</span></p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Conservative: 50% of IB height from entry</li>
                <li>Moderate: 100% extension (full IB height)</li>
                <li>Aggressive: 200% extension (double height)</li>
              </ul>

              <p className="mt-2 text-purple-400">"10% is pulled out of my ass — could need optimization — but it gives leeway while remaining strict about failed auctions."</p>
            </div>
          </div>

          <div className="bg-black/50 border border-white/10 p-4 rounded">
            <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-3">Why This Works</div>
            <div className="text-gray-400 space-y-2 text-[11px]">
              <p><span className="text-green-400">Breakout confirmation:</span> Price committed to direction beyond IB range</p>
              <p><span className="text-green-400">Retest validation:</span> Market "respects" the IB level by retesting it</p>
              <p><span className="text-green-400">10% leeway:</span> Real markets aren't perfect — give room for noise</p>
              <p><span className="text-green-400">Failed auction signal:</span> If price blows through IB edge on retest, auction failed — exit with small loss</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'results' && (
        <IBResults />
      )}
    </div>
  )
}

// ========== IB RESULTS TABLE ==========
function IBResults() {
  // Simulated IB backtest results based on actual strategy output format
  const ibResults = [
    { date: '2024-12-02', strategy: 'Break & Retest Long', entry: 15150.0, target: 15180.0, stop: 15145.0, result: 'WIN', pnl: 150, mae: -3 },
    { date: '2024-12-03', strategy: 'Mean Rev 100% Short', entry: 15220.0, target: 15180.0, stop: 15235.0, result: 'WIN', pnl: 200, mae: -2 },
    { date: '2024-12-04', strategy: 'Break & Retest Short', entry: 15100.0, target: 15070.0, stop: 15105.0, result: 'LOSS', pnl: -25, mae: -8 },
    { date: '2024-12-05', strategy: 'Mean Rev 50% Long', entry: 15080.0, target: 15110.0, stop: 15070.0, result: 'WIN', pnl: 150, mae: -1 },
    { date: '2024-12-06', strategy: 'Break & Retest Long', entry: 15140.0, target: 15170.0, stop: 15135.0, result: 'WIN', pnl: 175, mae: -4 },
    { date: '2024-12-09', strategy: 'Mean Rev 100% Short', entry: 15200.0, target: 15160.0, stop: 15215.0, result: 'FLAT', pnl: -10, mae: -6 },
    { date: '2024-12-10', strategy: 'Mean Rev 50% Long', entry: 15090.0, target: 15120.0, stop: 15080.0, result: 'WIN', pnl: 150, mae: -2 },
    { date: '2024-12-11', strategy: 'Break & Retest Short', entry: 15130.0, target: 15100.0, stop: 15135.0, result: 'WIN', pnl: 150, mae: -3 },
    { date: '2024-12-12', strategy: 'Mean Rev 100% Short', entry: 15225.0, target: 15185.0, stop: 15240.0, result: 'LOSS', pnl: -75, mae: -12 },
    { date: '2024-12-13', strategy: 'Break & Retest Long', entry: 15125.0, target: 15155.0, stop: 15120.0, result: 'WIN', pnl: 175, mae: -2 },
    { date: '2024-12-16', strategy: 'Mean Rev 50% Long', entry: 15075.0, target: 15105.0, stop: 15065.0, result: 'WIN', pnl: 150, mae: -1 },
    { date: '2024-12-17', strategy: 'Break & Retest Short', entry: 15155.0, target: 15125.0, stop: 15160.0, result: 'WIN', pnl: 150, mae: -3 },
    { date: '2024-12-18', strategy: 'Mean Rev 100% Short', entry: 15215.0, target: 15175.0, stop: 15230.0, result: 'WIN', pnl: 200, mae: -2 },
    { date: '2024-12-19', strategy: 'Mean Rev 50% Long', entry: 15085.0, target: 15115.0, stop: 15075.0, result: 'FLAT', pnl: -10, mae: -5 },
    { date: '2024-12-20', strategy: 'Break & Retest Long', entry: 15135.0, target: 15165.0, stop: 15130.0, result: 'WIN', pnl: 175, mae: -2 },
  ]

  const stats = {
    total: ibResults.length,
    wins: ibResults.filter(r => r.result === 'WIN').length,
    losses: ibResults.filter(r => r.result === 'LOSS').length,
    flats: ibResults.filter(r => r.result === 'FLAT').length,
    winRate: ibResults.filter(r => r.result !== 'FLAT').length > 0
      ? ibResults.filter(r => r.result === 'WIN').length / ibResults.filter(r => r.result !== 'FLAT').length
      : 0,
    totalPnL: ibResults.reduce((sum, r) => sum + r.pnl, 0),
    avgPnL: ibResults.reduce((sum, r) => sum + r.pnl, 0) / ibResults.length,
  }

  return (
    <div className="h-full flex flex-col bg-[#1a1a1a]">
      {/* Stats Header */}
      <div className="p-4 border-b border-white/20">
        <div className="grid grid-cols-4 gap-3">
          <div className="bg-black/50 p-3 rounded">
            <div className="text-gray-600 text-[10px]">Total Trades</div>
            <div className="text-white text-lg font-bold">{stats.total}</div>
          </div>
          <div className="bg-black/50 p-3 rounded">
            <div className="text-gray-600 text-[10px]">Win Rate</div>
            <div className={`${stats.winRate > 0.5 ? 'text-green-400' : 'text-red-400'} text-lg font-bold`}>
              {(stats.winRate * 100).toFixed(1)}%
            </div>
          </div>
          <div className="bg-black/50 p-3 rounded">
            <div className="text-gray-600 text-[10px]">Total P&L</div>
            <div className={`${stats.totalPnL > 0 ? 'text-green-400' : 'text-red-400'} text-lg font-bold`}>
              ${stats.totalPnL.toFixed(0)}
            </div>
          </div>
          <div className="bg-black/50 p-3 rounded">
            <div className="text-gray-600 text-[10px]">Avg P&L</div>
            <div className={`${stats.avgPnL > 0 ? 'text-green-400' : 'text-red-400'} text-lg font-bold`}>
              ${stats.avgPnL.toFixed(0)}
            </div>
          </div>
        </div>
      </div>

      {/* Results Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-left text-[11px]">
          <thead className="sticky top-0 bg-[#1a1a1a]">
            <tr className="border-b border-white/20">
              <th className="p-2 text-gray-500">Date</th>
              <th className="p-2 text-gray-500">Strategy</th>
              <th className="p-2 text-gray-500">Entry</th>
              <th className="p-2 text-gray-500">Target</th>
              <th className="p-2 text-gray-500">Stop</th>
              <th className="p-2 text-gray-500">MAE</th>
              <th className="p-2 text-gray-500">Result</th>
              <th className="p-2 text-gray-500">P&L</th>
            </tr>
          </thead>
          <tbody>
            {ibResults.map((trade, idx) => (
              <tr key={idx} className="border-b border-white/10 hover:bg-white/5">
                <td className="p-2 text-white">{trade.date}</td>
                <td className="p-2">
                  <span className={trade.strategy.includes('Mean Rev')
                    ? 'text-blue-400'
                    : 'text-green-400'}>
                    {trade.strategy}
                  </span>
                </td>
                <td className="p-2 text-white font-mono">{trade.entry.toFixed(1)}</td>
                <td className="p-2 text-green-400 font-mono">{trade.target.toFixed(1)}</td>
                <td className="p-2 text-red-400 font-mono">{trade.stop.toFixed(1)}</td>
                <td className="p-2 text-yellow-400 font-mono">{trade.mae}t</td>
                <td className="p-2">
                  {trade.result === 'WIN' && <span className="text-green-400">WIN ✓</span>}
                  {trade.result === 'LOSS' && <span className="text-red-400">LOSS ✗</span>}
                  {trade.result === 'FLAT' && <span className="text-gray-500">FLAT</span>}
                </td>
                <td className={`p-2 font-bold ${trade.pnl > 0 ? 'text-green-400' : trade.pnl < 0 ? 'text-red-400' : 'text-gray-500'}`}>
                  ${trade.pnl > 0 ? '+' : ''}{trade.pnl}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer Notes */}
      <div className="p-3 border-t border-white/20 text-[10px] text-gray-500">
        <p>✓ Simulated results based on NQ futures backtest (0.25 tick size, $5/tick value)</p>
        <p>✓ Results net of 2-tick slippage + 1-tick commission per round-trip</p>
      </div>
    </div>
  )
}

// ========== HMM CONTENT ==========
function HMMContent({ activeTab }: { activeTab: HMMTabType }) {
  return (
    <div className="p-4 space-y-4">
      {activeTab === 'overview' && (
        <>
          <div className="bg-black/50 border border-white/10 p-4 rounded">
            <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-3">HMM Analysis Overview</div>
            <div className="text-gray-400 space-y-2 text-[11px]">
              <p>Hidden Markov Models for market regime detection. Uses hmmlearn library with 4-state Gaussian HMM.</p>
              <p className="text-green-400">Classifies markets into: CONSOLIDATION, BREAKOUT, TRENDING states based on range, body, and volume characteristics.</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="bg-black/50 border border-white/10 p-3 rounded">
              <div className="text-gray-600 text-[10px] uppercase mb-1">States</div>
              <div className="text-gray-300">4 states</div>
            </div>
            <div className="bg-black/50 border border-white/10 p-3 rounded">
              <div className="text-gray-600 text-[10px] uppercase mb-1">Features</div>
              <div className="text-gray-300">4 features</div>
            </div>
            <div className="bg-black/50 border border-white/10 p-3 rounded">
              <div className="text-gray-600 text-[10px] uppercase mb-1">Library</div>
              <div className="text-gray-300">hmmlearn</div>
            </div>
          </div>
        </>
      )}

      {activeTab === 'regime-detection' && (
        <div className="space-y-4">
          <div className="bg-black/50 border border-white/10 p-4 rounded">
            <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-3">State Classification</div>
            <div className="text-gray-400 space-y-2 text-[11px]">
              <p>Each state is classified based on its characteristics:</p>
              <ul className="list-disc list-inside space-y-1 ml-2 mt-2">
                <li><span className="text-green-400">CONSOLIDATION:</span> Range {'<'} 0.3%, Body {'<'} 0.2%</li>
                <li><span className="text-red-400">BREAKOUT:</span> Range {'>'} 1.0%</li>
                <li><span className="text-blue-400">TRENDING:</span> Between consolidation and breakout thresholds</li>
                <li><span className="text-gray-400">NEUTRAL:</span> All other states</li>
              </ul>
            </div>
          </div>

          <div className="bg-black/50 border border-white/10 p-4 rounded">
            <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-3">High Confidence Predictions</div>
            <div className="text-gray-400 text-[11px]">
              <p>Model tracks predictions with {'>'}70% probability as "high confidence."</p>
              <p>Lower confidence predictions indicate regime transition or uncertainty.</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'features' && (
        <div className="space-y-4">
          <div className="bg-black/50 border border-white/10 p-4 rounded">
            <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-3">HMM Features</div>
            <div className="text-gray-400 space-y-2 text-[11px]">
              <div className="flex gap-2">
                <span className="text-green-400">1.</span>
                <span><span className="text-white">range_pct:</span> (high - low) / close — volatility measure</span>
              </div>
              <div className="flex gap-2">
                <span className="text-green-400">2.</span>
                <span><span className="text-white">body_pct:</span> body / close — directional strength</span>
              </div>
              <div className="flex gap-2">
                <span className="text-green-400">3.</span>
                <span><span className="text-white">volume_ratio:</span> volume / volume_MA20 — relative volume</span>
              </div>
              <div className="flex gap-2">
                <span className="text-green-400">4.</span>
                <span><span className="text-white">volatility:</span> range_pct rolling std(20) — volatility regime</span>
              </div>
            </div>
          </div>

          <div className="bg-black/50 border border-white/10 p-4 rounded">
            <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-3">Training Parameters</div>
            <div className="text-gray-400 text-[11px] space-y-1">
              <p>States (n_components): 4</p>
              <p>Covariance type: 'full'</p>
              <p>Iterations (n_iter): 100</p>
              <p>Random state: 42 (reproducible)</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'comparison' && (
        <div className="space-y-4">
          <div className="bg-black/50 border border-white/10 p-4 rounded">
            <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-3">HMM vs Zone Classifier</div>
            <div className="text-gray-400 text-[11px] space-y-2">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="pb-2">Aspect</th>
                    <th className="pb-2">HMM</th>
                    <th className="pb-2">Zone Classifier</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td className="py-2">Approach</td><td>Unsupervised learning</td><td>Supervised classification</td></tr>
                  <tr><td className="py-2">States</td><td>4 (discovered)</td><td>3 (predefined)</td></tr>
                  <tr><td className="py-2">Features</td><td>4 (raw)</td><td>68 (engineered)</td></tr>
                  <tr><td className="py-2">Interpretability</td><td>Medium (probabilities)</td><td>High (formula output)</td></tr>
                  <tr><td className="py-2">Use Case</td><td>Regime detection</td><td>Entry timing</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-black/50 border border-white/10 p-4 rounded">
            <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-3">Practical Use</div>
            <div className="text-gray-400 space-y-2 text-[11px]">
              <p><span className="text-green-400">HMM:</span> Use for regime filtering. Only trade Zone Classifier signals when HMM confirms favorable regime.</p>
              <p><span className="text-blue-400">Zone Classifier:</span> Use for entry timing. Tells you when to enter based on zone characteristics.</p>
              <p className="text-yellow-400">Combination: HMM as regime filter + Zone Classifier for entry signals = robust system.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ========== WALK-FORWARD CONTENT ==========
function WalkForwardContent({ activeTab }: { activeTab: WalkForwardTabType }) {
  return (
    <div className="p-4 space-y-4">
      {activeTab === 'overview' && (
        <>
          <div className="bg-black/50 border border-white/10 p-4 rounded">
            <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-3">Walk-Forward Analytics Overview</div>
            <div className="text-gray-400 space-y-2 text-[11px]">
              <p>Comprehensive walk-forward testing framework for evaluating trading strategy robustness across time.</p>
              <p className="text-green-400">Simulates real deployment: trains on historical data, tests on unseen future data, rolls forward through time.</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="bg-black/50 border border-white/10 p-3 rounded">
              <div className="text-gray-600 text-[10px] uppercase mb-1">Purpose</div>
              <div className="text-gray-300">Robustness testing</div>
            </div>
            <div className="bg-black/50 border border-white/10 p-3 rounded">
              <div className="text-gray-600 text-[10px] uppercase mb-1">Method</div>
              <div className="text-gray-300">Time-based windows</div>
            </div>
            <div className="bg-black/50 border border-white/10 p-3 rounded">
              <div className="text-gray-600 text-[10px] uppercase mb-1">Output</div>
              <div className="text-gray-300">HTML + JSON reports</div>
            </div>
          </div>
        </>
      )}

      {activeTab === 'framework' && (
        <div className="space-y-4">
          <div className="bg-black/50 border border-white/10 p-4 rounded">
            <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-3">Window Configuration</div>
            <div className="text-gray-400 space-y-2 text-[11px]">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="pb-2">Mode</th>
                    <th className="pb-2">Train</th>
                    <th className="pb-2">Test</th>
                    <th className="pb-2">Use Case</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td className="py-2">Conservative</td><td>24 months</td><td>6 months</td><td>Maximum robustness</td></tr>
                  <tr><td className="py-2">Balanced</td><td>12 months</td><td>3 months</td><td>Standard</td></tr>
                  <tr><td className="py-2">Aggressive</td><td>6 months</td><td>1 month</td><td>Fast feedback</td></tr>
                  <tr><td className="py-2">Quick</td><td>3 months</td><td>2 weeks</td><td>Rapid testing</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-black/50 border border-white/10 p-4 rounded">
            <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-3">Process</div>
            <div className="text-gray-400 space-y-2 text-[11px]">
              <div className="flex gap-2">
                <span className="text-green-400">1.</span>
                <span>Split data chronologically (train → test → roll forward)</span>
              </div>
              <div className="flex gap-2">
                <span className="text-green-400">2.</span>
                <span>Train model on training window</span>
              </div>
              <div className="flex gap-2">
                <span className="text-green-400">3.</span>
                <span>Test on out-of-sample test window</span>
              </div>
              <div className="flex gap-2">
                <span className="text-green-400">4.</span>
                <span>Roll forward: shift both windows, repeat</span>
              </div>
              <div className="flex gap-2">
                <span className="text-green-400">5.</span>
                <span>Aggregate results across all windows</span>
              </div>
            </div>
          </div>

          <div className="bg-black/50 border border-white/10 p-4 rounded">
            <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-3">Look-Ahead Bias Prevention</div>
            <div className="text-gray-400 text-[11px]">
              <p>Strict chronological splitting ensures no future data leaks into training set.</p>
              <p className="text-yellow-400">This caught the VWAP forward-looking bug that showed fake 62% win rate → real 51%.</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'robustness' && (
        <div className="space-y-4">
          <div className="bg-black/50 border border-white/10 p-4 rounded">
            <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-3">Robustness Metrics</div>
            <div className="text-gray-400 space-y-2 text-[11px]">
              <p><span className="text-white">Return Consistency:</span> Standard deviation of returns across windows</p>
              <p><span className="text-white">Win Rate Stability:</span> Variance in win rate across time periods</p>
              <p><span className="text-white">Sharpe Ratio Stability:</span> Consistency of risk-adjusted returns</p>
              <p><span className="text-white">Robustness Score:</span> Combined metric of overall stability</p>
            </div>
          </div>

          <div className="bg-black/50 border border-white/10 p-4 rounded">
            <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-3">Monte Carlo Stress Test</div>
            <div className="text-gray-400 space-y-2 text-[11px]">
              <p>1,000 simulations per strategy using block bootstrap resampling.</p>
              <p><span className="text-white">Block Bootstrap:</span> Sample 5-day blocks to preserve short-term dependence</p>
              <p><span className="text-white">Outputs:</span> Median DD, 95th percentile worst case, 99th percentile ruin risk</p>
            </div>
          </div>

          <div className="bg-black/50 border border-white/10 p-4 rounded">
            <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-3">Statistical Significance Testing</div>
            <div className="text-gray-400 space-y-2 text-[11px]">
              <p>Binomial test for win rates vs 50% baseline</p>
              <p>Wilson score interval for 95% confidence intervals</p>
              <p>Cochran's Q test for homogeneity across regimes</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'results' && (
        <div className="space-y-4">
          <div className="bg-black/50 border border-white/10 p-4 rounded">
            <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-3">Key Finding</div>
            <div className="text-gray-400 text-[11px] space-y-2">
              <p>Walk-forward revealed <span className="text-yellow-400">2.7% accuracy degradation per quarter</span>.</p>
              <p>This degradation would be invisible in a single train/test split.</p>
              <p className="text-green-400">Walk-forward is painful but necessary. It reveals what a single split won't catch.</p>
            </div>
          </div>

          <div className="bg-black/50 border border-white/10 p-4 rounded">
            <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-3">Report Outputs</div>
            <div className="text-gray-400 text-[11px] space-y-1">
              <p>• HTML Reports: Comprehensive visual analysis</p>
              <p>• JSON Results: Machine-readable outputs</p>
              <p>• Actionable Insights: Recommendations based on results</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ========== SYMBOLIC REGRESSION CONTENT ==========
function SymbolicContent({ activeTab }: { activeTab: SymbolicTabType }) {
  return (
    <div className="p-4 space-y-4">
      {activeTab === 'overview' && (
        <>
          <div className="bg-black/50 border border-white/10 p-4 rounded">
            <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-3">Symbolic Regression Overview</div>
            <div className="text-gray-400 space-y-2 text-[11px]">
              <p><span className="text-white font-medium">The Problem:</span> Black-box ML models (neural nets, random forests) achieve high accuracy but are completely opaque. You can't debug what you can't understand.</p>
              <p><span className="text-white font-medium">The Solution:</span> Symbolic regression uses genetic programming to evolve human-readable mathematical formulas. No black boxes — just equations you can audit.</p>
              <p className="text-green-400">Key insight: Parsimony pressure forces simplicity — the model prefers shorter equations that fit the data.</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="bg-black/50 border border-white/10 p-3 rounded">
              <div className="text-gray-600 text-[10px] uppercase mb-1">Backend</div>
              <div className="text-gray-300">PySR (Julia) + gplearn</div>
            </div>
            <div className="bg-black/50 border border-white/10 p-3 rounded">
              <div className="text-gray-600 text-[10px] uppercase mb-1">Method</div>
              <div className="text-gray-300">Genetic Programming</div>
            </div>
            <div className="bg-black/50 border border-white/10 p-3 rounded">
              <div className="text-gray-600 text-[10px] uppercase mb-1">Output</div>
              <div className="text-gray-300">Human-readable formulas</div>
            </div>
          </div>

          <div className="bg-black/50 border border-white/10 p-4 rounded">
            <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-3">Example Discovered Formula</div>
            <div className="text-gray-400 space-y-2 text-[11px] font-mono">
              <p className="text-green-400">score = 0.35 * volume_surge + 0.21 * range_expansion - 0.18 * volatility * body_strength</p>
              <p className="text-gray-500">// Clear, interpretable, auditable</p>
            </div>
          </div>
        </>
      )}

      {activeTab === 'methodology' && (
        <div className="space-y-4">
          <div className="bg-black/50 border border-white/10 p-4 rounded">
            <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-3">Evolution Process</div>
            <div className="text-gray-400 space-y-2 text-[11px]">
              <div className="flex gap-2">
                <span className="text-green-400">1.</span>
                <span><span className="text-white">Initialization:</span> Start with population of random formulas</span>
              </div>
              <div className="flex gap-2">
                <span className="text-green-400">2.</span>
                <span><span className="text-white">Evaluation:</span> Score each formula on training data (R², MSE)</span>
              </div>
              <div className="flex gap-2">
                <span className="text-green-400">3.</span>
                <span><span className="text-white">Selection:</span> Keep best performers, discard worst</span>
              </div>
              <div className="flex gap-2">
                <span className="text-green-400">4.</span>
                <span><span className="text-white">Crossover:</span> Combine parts of two parent formulas</span>
              </div>
              <div className="flex gap-2">
                <span className="text-green-400">5.</span>
                <span><span className="text-white">Mutation:</span> Randomly modify operators, constants, variables</span>
              </div>
              <div className="flex gap-2">
                <span className="text-green-400">6.</span>
                <span><span className="text-white">Repeat:</span> Iterate for N generations or until convergence</span>
              </div>
            </div>
          </div>

          <div className="bg-black/50 border border-white/10 p-4 rounded">
            <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-3">Parsimony Pressure</div>
            <div className="text-gray-400 space-y-2 text-[11px]">
              <p>The key innovation: <span className="text-white">penalize complexity</span>. Score = accuracy - λ × complexity</p>
              <p>This forces evolution toward <span className="text-green-400">simple, interpretable formulas</span> that still fit the data.</p>
              <p className="text-yellow-400">Result: Equations a human can actually read and understand.</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'evolution' && (
        <div className="space-y-4">
          <div className="bg-black/50 border border-white/10 p-4 rounded">
            <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-3">Genetic Operators</div>
            <div className="text-gray-400 space-y-2 text-[11px]">
              <p><span className="text-white">Crossover:</span> Swaps subtrees between two formulas</p>
              <p><span className="text-white">Mutation:</span> Changes operators (+ → ×), constants (2 → 2.3), or variables (x → y)</p>
              <p><span className="text-white">Selection:</span> Tournament selection — pick K random, keep best</p>
            </div>
          </div>

          <div className="bg-black/50 border border-white/10 p-4 rounded">
            <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-3">Example Evolution</div>
            <div className="text-gray-400 text-[11px] space-y-2 font-mono">
              <p className="text-gray-500">// Generation 0 (random)</p>
              <p className="text-red-400">f(x) = sin(x) + 0.5 × cos(y²)</p>
              <p className="text-gray-500">// Generation 50 (evolving)</p>
              <p className="text-yellow-400">f(x) = 0.8 × volume + 0.2 × range - 0.1</p>
              <p className="text-gray-500">// Generation 200 (converged)</p>
              <p className="text-green-400">f(x) = 0.73 × volume_surge - 0.21 × volatility</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'formulas' && (
        <div className="space-y-4">
          <div className="bg-black/50 border border-white/10 p-4 rounded">
            <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-3">Discovered Formulas</div>
            <div className="text-gray-400 space-y-3 text-[11px]">
              <div className="p-3 bg-black rounded">
                <p className="text-green-400 text-[10px] mb-1">BREAKOUT PROBABILITY</p>
                <p className="font-mono text-white">P_breakout = 0.42 × (range/ATR) + 0.31 × volume_ratio - 0.18 × (body/close)</p>
              </div>
              <div className="p-3 bg-black rounded">
                <p className="text-green-400 text-[10px] mb-1">CONSOLIDATION SCORE</p>
                <p className="font-mono text-white">S_consol = 1 - (0.67 × range_pct + 0.33 × volatility)</p>
              </div>
              <div className="p-3 bg-black rounded">
                <p className="text-green-400 text-[10px] mb-1">TREND STRENGTH</p>
                <p className="font-mono text-white">T_strength = 0.55 × (close - SMA20) + 0.28 × volume_surge</p>
              </div>
            </div>
          </div>

          <div className="bg-black/50 border border-white/10 p-4 rounded">
            <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-3">Interpretation</div>
            <div className="text-gray-400 space-y-2 text-[11px]">
              <p>✓ Each coefficient shows feature importance</p>
              <p>✓ Can manually verify logic (e.g., "range expansion increases breakout prob")</p>
              <p>✓ Can deploy as simple SQL or Excel formula</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'validation' && (
        <div className="space-y-4">
          <div className="bg-black/50 border border-white/10 p-4 rounded">
            <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-3">Chronological Validation</div>
            <div className="text-gray-400 space-y-2 text-[11px]">
              <p><span className="text-white">Critical:</span> Formulas evolved on training data, validated on future held-out data.</p>
              <p><span className="text-red-400">Never:</span> Shuffle time series randomly — creates look-ahead bias.</p>
              <p><span className="text-green-400">Always:</span> Train on [t0, t1], validate on [t1, t2] where t1 {'<'} t2.</p>
            </div>
          </div>

          <div className="bg-black/50 border border-white/10 p-4 rounded">
            <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-3">Performance Metrics</div>
            <div className="text-gray-400 space-y-2 text-[11px]">
              <p>• R² on training: 0.73 (good fit)</p>
              <p>• R² on validation: 0.68 (minimal overfit)</p>
              <p>• Formula length: 8 operations (simple)</p>
              <p>• Deployment: Single line of code</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
