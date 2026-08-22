'use client'

// Real training results (2026-08-21 run on 25 hand-labeled zones × 53 features).
// Replaces the previous Math.random equity curve — no real backtest exists for
// this model, so none is shown.

import TradingBarChart from '@/components/charts/TradingBarChart'
import TradingMetricsCard from '@/components/charts/TradingMetricsCard'

const modelAccuracy = [
  { model: 'Random Forest', cv: 80 },
  { model: 'Logistic', cv: 80 },
  { model: 'Grad Boosting', cv: 55 },
]

const featureImportance = [
  { feature: 'max_body', weight: 9.0 },
  { feature: 'range_vs_5before', weight: 8.0 },
  { feature: 'range_pct', weight: 8.0 },
  { feature: 'range_vs_3before', weight: 7.0 },
  { feature: 'range_vs_10before', weight: 7.0 },
  { feature: 'volume_vs_3before', weight: 6.6 },
  { feature: 'avg_body', weight: 6.0 },
  { feature: 'body_vs_3before', weight: 6.0 },
]

export default function ResultsEquityCurveFile() {
  return (
    <div className="p-6 space-y-3 max-w-[1200px]">
      <div className="text-[9px] tracking-[0.3em] text-[#444]">// results/model-training</div>
      <h1 className="text-[26px] tracking-[0.15em] text-white">MODEL TRAINING</h1>
      <p className="text-[11px] text-gray-500 leading-relaxed max-w-[600px]">
        Real training run on 25 hand-labeled zones × 53 features. No backtest equity curve exists for this
        model — the previous chart here was randomly generated and has been removed.
      </p>

      <TradingMetricsCard
        title="CROSS-VALIDATED ACCURACY"
        metrics={[
          { label: 'BEST MODEL', value: 'Random Forest', trend: 'up' },
          { label: 'RF CV ACC', value: '80% ± 10', trend: 'up' },
          { label: 'TEST SET', value: '5 zones', trend: 'neutral' },
          { label: 'GB CV COLLAPSE', value: '55% ± 29', trend: 'down' },
        ]}
      >
        <TradingBarChart data={modelAccuracy} xKey="model" yKey="cv" height={200} />
      </TradingMetricsCard>

      <TradingMetricsCard
        title="RF FEATURE IMPORTANCE (%)"
        metrics={[
          { label: 'TOP FEATURE', value: 'max_body', trend: 'up' },
          { label: 'TOP WEIGHT', value: '9.0%', trend: 'up' },
          { label: 'THEME', value: 'Range vs context', trend: 'neutral' },
          { label: 'LABELS', value: '10/5/10 zones', trend: 'neutral' },
        ]}
      >
        <TradingBarChart data={featureImportance} xKey="feature" yKey="weight" height={220} />
      </TradingMetricsCard>

      <div className="border border-[#1c2e1c] bg-black p-4 space-y-2">
        <div className="text-[10px] tracking-[0.2em] text-[#00ff9d]">HONEST READ</div>
        <p className="text-[11px] text-gray-400 leading-relaxed">
          With 25 labeled zones and a 5-zone test set, these accuracies are directional, not definitive —
          the CV standard deviations say so themselves. What the model consistently ranks as signal:
          range and body relative to the candles before the zone. The 68-feature story narrows to a
          handful of range-context features actually carrying weight.
        </p>
        <p className="text-[10px] text-[#444]">
          Source: zone_classifier_trainer.py via scripts/run_real_models.py — 2026-08-21 run.
        </p>
      </div>
    </div>
  )
}
