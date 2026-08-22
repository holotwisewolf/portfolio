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
  intro: 'From hand-labeling to held-out validation.',
  blocks: [
    {
      kind: 'bullets',
      heading: 'TRAINING PIPELINE',
      items: [
        { text: '1. Interactive labeling tool for ground truth', mark: 'none' },
        { text: '2. Feature extraction (20+ technical indicators)', mark: 'none' },
        { text: '3. Model training (Random Forest, Logistic Regression, Decision Tree)', mark: 'none' },
        { text: '4. Validation on held-out data', mark: 'none' },
      ],
    },
    {
      kind: 'formula',
      heading: 'CORE FEATURE SET',
      formulas: [
        'range_pct     = (high − low) / close',
        'body_pct      = |close − open| / close',
        'volume_ratio  = volume / MA(20)',
        'volatility    = rolling std(range_pct)',
        '+ 16 more technical features',
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
