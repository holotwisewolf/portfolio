// ml-consolidation project content — migrated from components/windows/ProjectMLConsol.tsx.

import type { DocContent } from '../../../DocFile'

export const readme: DocContent = {
  path: '// overview/README.md',
  title: 'ML CONSOLIDATION DETECTION',
  intro: 'Replacing hard-coded consolidation rules with learned patterns.',
  blocks: [
    {
      kind: 'text',
      paras: [
        { text: 'Goal: Replace hard-coded consolidation rules with learned patterns from data.', tone: 'key' },
        { text: 'Problem: Traditional consolidation rules (e.g., "range < 0.3%") are arbitrary and miss nuanced patterns.' },
        { text: 'Solution: Train ML models to recognize consolidation patterns from 20+ features.', tone: 'good' },
      ],
    },
    {
      kind: 'stats',
      items: [
        { label: 'SAMPLE SIZE', value: '5,200 labeled bars' },
        { label: 'FEATURES', value: '20+' },
        { label: 'MODELS', value: 'RF / LogReg / Decision Tree' },
      ],
    },
  ],
}

export const pipeline: DocContent = {
  path: '// method/PIPELINE.md',
  title: 'PIPELINE',
  intro: 'From hand-labeling to held-out validation — the real feature engineering from feature_engineering.py.',
  blocks: [
    {
      kind: 'bullets',
      heading: 'STEPS',
      items: [
        { text: '1. LABEL: an interactive labeling tool draws boxes around consolidation periods on real charts — those boxes are the ground truth', mark: 'none' },
        { text: '2. FEATURES: for each labeled window, ~30 features are computed from the candles inside it (full list below)', mark: 'none' },
        { text: '3. TRAIN: Random Forest, Logistic Regression, and Decision Tree on the feature/label pairs', mark: 'none' },
        { text: '4. VALIDATE: held-out split — accuracy, precision, recall per model', mark: 'none' },
      ],
    },
    {
      kind: 'formula',
      heading: 'SHAPE FEATURES — WHAT THE ZONE LOOKS LIKE',
      formulas: [
        'range_ticks   = max(high) − min(low)',
        'range_pct     = range_ticks / min(low)',
        'avg_body_size = mean(|close − open|)',
        'body_to_range = avg_body_size / range_ticks',
        'wick_balance  = |mean(upper_wick) − mean(lower_wick)|',
        'net_change    = |close[last] − close[first]|',
      ],
    },
    {
      kind: 'formula',
      heading: 'THE FOUR DERIVED SCORES — THE INTERESTING ONES',
      formulas: [
        'range_efficiency = |close[-1] − close[0]| / Σ(high − low)',
        'vol_deceleration = (early_roc − late_roc) / early_roc     clipped 0-1',
        'price_entropy    = −Σ p·log2(p)  over up/flat/down bins',
        'direction_balance = |up_candles − down_candles| / total',
      ],
      notes: [
        { text: 'Range efficiency: net displacement divided by total travel — 0 = pure chop, 1 = straight line. Consolidation should score near 0.', tone: 'key' },
        { text: 'Volume deceleration: early-half rate-of-change minus late-half — volume dying into the zone is the consolidation fingerprint.', tone: 'key' },
        { text: 'Price entropy: Shannon entropy of up/flat/down closes — random chopping scores high.', tone: 'key' },
        { text: 'Direction balance: up vs down candle counts — a tug-of-war scores near 0.', tone: 'key' },
      ],
    },
    {
      kind: 'formula',
      heading: 'VOLUME + CONTEXT FEATURES',
      formulas: [
        'avg_volume, vol_std, vol_trend (OLS slope)',
        'vol_zscore             = (mean_vol − expected) / std(expected)',
        'vol_relative_to_expected = mean_vol / mean(volume_by_hour)',
        'vol_roc                = (vol[-1] − vol[0]) / vol[0]',
        'range_vs_atr           = range_ticks / ATR',
        'num_up / num_down / num_doji, duration_minutes, start_hour',
      ],
    },
  ],
}

const modelAccuracy = [
  { model: 'Random Forest', accuracy: 78 },
  { model: 'Logistic', accuracy: 74 },
  { model: 'Decision Tree', accuracy: 71 },
]

const featureImportance = [
  { feature: 'range_pct', importance: 0.28 },
  { feature: 'volatility', importance: 0.22 },
  { feature: 'body_pct', importance: 0.18 },
  { feature: 'volume_ratio', importance: 0.15 },
  { feature: 'RSI', importance: 0.1 },
  { feature: 'MACD', importance: 0.07 },
]

export const modelAccuracyFile: DocContent = {
  path: '// results/model-accuracy',
  title: 'MODEL ACCURACY',
  intro: 'All three models clear the hard-coded baseline — the forest clears it most.',
  blocks: [
    {
      kind: 'metrics',
      title: 'MODEL PERFORMANCE COMPARISON',
      metrics: [
        { label: 'BEST MODEL', value: 'Random Forest', trend: 'neutral' },
        { label: 'ACCURACY', value: '78%', trend: 'up' },
        { label: 'BASELINE', value: '65% (rules)', trend: 'neutral' },
        { label: 'SAMPLE', value: '5,200', trend: 'neutral' },
      ],
      chart: { kind: 'bar', data: modelAccuracy, xKey: 'model', yKey: 'accuracy' },
    },
    {
      kind: 'table',
      heading: 'VALIDATION RESULTS',
      headers: ['MODEL', 'ACCURACY', 'PRECISION', 'RECALL'],
      rows: [
        [{ text: 'Random Forest', tone: 'good' }, '78%', '76%', '77%'],
        ['Logistic Regression', '74%', '72%', '73%'],
        ['Decision Tree', '71%', '69%', '70%'],
      ],
    },
    {
      kind: 'text',
      paras: [
        { text: 'All models significantly outperform hard-coded rules (65% baseline).', tone: 'warn' },
      ],
    },
    {
      kind: 'text',
      heading: 'WHY 78% IS NOT WHAT IT SOUNDS LIKE',
      paras: [
        { text: 'The models predict my hand-labels of consolidation — not returns. 78% accuracy means the forest agrees with the labeler 78% of the time; whether the labeler\'s consolidation zones contain tradeable structure is a different question this project never answered. That gap (label accuracy → market edge) is where every project in this folder went to die.', tone: 'key' },
        { text: 'See it happen on real candles: results/label-vs-outcome shows labeled zones side by side with the 10 bars that followed them.', tone: 'good' },
      ],
    },
    {
      kind: 'metrics',
      title: 'FEATURE IMPORTANCE',
      metrics: [
        { label: 'TOP FEATURE', value: 'range_pct', trend: 'neutral' },
        { label: 'WEIGHT', value: '28%', trend: 'up' },
        { label: 'TOTAL FEATURES', value: '20', trend: 'neutral' },
        { label: 'TEST SIZE', value: '20%', trend: 'neutral' },
      ],
      chart: { kind: 'bar', data: featureImportance, xKey: 'feature', yKey: 'importance' },
    },
  ],
}
