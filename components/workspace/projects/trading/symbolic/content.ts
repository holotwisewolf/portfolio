// symbolic project content — migrated from components/windows/ProjectSymbolic.tsx
// (+ model comparison table from ProjectTrading.tsx).

import type { DocContent } from '../../../DocFile'

export const readme: DocContent = {
  path: '// overview/README.md',
  title: 'SYMBOLIC REGRESSION',
  intro: 'Evolving human-readable formulas instead of training black boxes.',
  blocks: [
    {
      kind: 'text',
      heading: 'THE PROBLEM',
      paras: [
        { text: 'Black-box ML models (neural nets, random forests) achieve high accuracy but are completely opaque. You can’t debug what you can’t understand.', tone: 'key' },
      ],
    },
    {
      kind: 'text',
      heading: 'THE SOLUTION',
      paras: [
        { text: 'Symbolic regression uses genetic programming to evolve human-readable mathematical formulas. No black boxes — just equations you can audit.' },
        { text: 'Key insight: Parsimony pressure forces simplicity — the model prefers shorter equations that fit the data.', tone: 'good' },
      ],
    },
    {
      kind: 'formula',
      heading: 'EXAMPLE DISCOVERED FORMULA',
      formulas: ['score = 0.35 × volume_surge + 0.21 × range_expansion − 0.18 × volatility × body_strength'],
      notes: [
        { text: 'Clear, interpretable, auditable.' },
      ],
    },
  ],
}

export const methodology: DocContent = {
  path: '// method/METHODOLOGY.md',
  title: 'METHODOLOGY',
  intro: 'Genetic programming with a complexity penalty.',
  blocks: [
    {
      kind: 'bullets',
      heading: 'EVOLUTION PROCESS',
      items: [
        { text: '1. Initialization: Start with a population of random formulas', mark: 'none' },
        { text: '2. Evaluation: Score each formula on training data (R², MSE)', mark: 'none' },
        { text: '3. Selection: Keep best performers, discard worst', mark: 'none' },
        { text: '4. Crossover: Combine parts of two parent formulas', mark: 'none' },
        { text: '5. Mutation: Randomly modify operators, constants, variables', mark: 'none' },
        { text: '6. Repeat: Iterate for N generations or until convergence', mark: 'none' },
      ],
    },
    {
      kind: 'formula',
      heading: 'PARSIMONY PRESSURE',
      formulas: ['Score = accuracy − λ × complexity'],
      notes: [
        { text: 'The key innovation: penalize complexity. This forces evolution toward simple, interpretable formulas that still fit the data.', tone: 'key' },
        { text: 'Result: Equations a human can actually read and understand.', tone: 'good' },
      ],
    },
    {
      kind: 'text',
      heading: 'GENETIC OPERATORS',
      paras: [
        { text: 'Crossover: Swaps subtrees between two formulas.' },
        { text: 'Mutation: Changes operators (+ → ×), constants (2 → 2.3), or variables (x → y).' },
        { text: 'Selection: Tournament selection — pick K random, keep best.' },
      ],
    },
    {
      kind: 'formula',
      heading: 'EXAMPLE EVOLUTION',
      formulas: [
        'Gen 0    (random)    f(x) = sin(x) + 0.5 × cos(y²)',
        'Gen 50   (evolving)  f(x) = 0.8 × volume + 0.2 × range − 0.1',
        'Gen 200  (converged) f(x) = 0.73 × volume_surge − 0.21 × volatility',
      ],
    },
  ],
}

export const formulas: DocContent = {
  path: '// method/FORMULAS.md',
  title: 'DISCOVERED FORMULAS',
  intro: 'The outputs — each deployable as a single line of code.',
  blocks: [
    {
      kind: 'formula',
      heading: 'BREAKOUT PROBABILITY',
      formulas: ['P_breakout = 0.42 × (range/ATR) + 0.31 × volume_ratio − 0.18 × (body/close)'],
    },
    {
      kind: 'formula',
      heading: 'CONSOLIDATION SCORE',
      formulas: ['S_consol = 1 − (0.67 × range_pct + 0.33 × volatility)'],
    },
    {
      kind: 'formula',
      heading: 'TREND STRENGTH',
      formulas: ['T_strength = 0.55 × (close − SMA20) + 0.28 × volume_surge'],
    },
    {
      kind: 'bullets',
      heading: 'INTERPRETATION',
      items: [
        { text: 'Each coefficient shows feature importance', mark: 'check' },
        { text: 'Can manually verify logic (e.g., "range expansion increases breakout prob")', mark: 'check' },
        { text: 'Can deploy as simple SQL or Excel formula', mark: 'check' },
      ],
    },
  ],
}

export const validation: DocContent = {
  path: '// results/validation',
  title: 'VALIDATION',
  intro: 'Chronological train/validate — the same rule the walk-forward framework enforces.',
  blocks: [
    {
      kind: 'metrics',
      title: 'PERFORMANCE',
      metrics: [
        { label: 'TRAINING R²', value: '0.73', trend: 'up' },
        { label: 'VALIDATION R²', value: '0.68', trend: 'up' },
        { label: 'OVERFIT GAP', value: '0.05', trend: 'neutral' },
        { label: 'FORMULA OPS', value: '8', trend: 'neutral' },
      ],
    },
    {
      kind: 'text',
      heading: 'CHRONOLOGICAL VALIDATION',
      paras: [
        { text: 'Formulas evolved on training data, validated on future held-out data.' },
        { text: 'Never shuffle time series randomly — creates look-ahead bias.', tone: 'bad' },
        { text: 'Always train on [t₀, t₁], validate on [t₁, t₂] where t₁ < t₂.', tone: 'good' },
        { text: 'Entry point: core/symbolic_regression.py' },
      ],
    },
    {
      kind: 'table',
      heading: 'MODEL COMPARISON',
      headers: ['MODEL', 'ACCURACY', 'INTERPRETABLE'],
      rows: [
        ['Random Forest', '76%', { text: 'No — black box', tone: 'bad' }],
        ['Gradient Boosting', '78%', { text: 'No — opaque, slower', tone: 'bad' }],
        ['Logistic Regression', '68%', { text: 'Yes, but too simple', tone: 'warn' }],
        [{ text: 'Symbolic Regression', tone: 'key' }, '74%', { text: 'Yes — auditable formula', tone: 'good' }],
      ],
    },
    {
      kind: 'bullets',
      heading: 'DEPLOYMENT READINESS',
      items: [
        { text: 'Formula validated on out-of-sample data', mark: 'check' },
        { text: 'Complexity low enough for production use', mark: 'check' },
        { text: 'No significant overfitting detected', mark: 'check' },
        { text: 'Ready for integration into Zone Classifier', mark: 'check' },
      ],
    },
  ],
}

const featureImportance = [
  { feature: 'volume_surge', importance: 0.42 },
  { feature: 'range_expansion', importance: 0.31 },
  { feature: 'body_strength', importance: 0.18 },
  { feature: 'volatility', importance: 0.09 },
]

export const evolution: DocContent = {
  path: '// results/evolution',
  title: 'EVOLUTION RUN',
  intro: 'Run configuration and the feature weights it converged to.',
  blocks: [
    {
      kind: 'stats',
      items: [
        { label: 'GENERATIONS', value: '200' },
        { label: 'POPULATION', value: '100' },
        { label: 'PARSIMONY λ', value: '0.1' },
        { label: 'FEATURES USED', value: '4' },
      ],
    },
    {
      kind: 'metrics',
      title: 'FEATURE IMPORTANCE',
      metrics: [
        { label: 'VOLUME SURGE', value: '42%', trend: 'up' },
        { label: 'RANGE EXPANSION', value: '31%', trend: 'up' },
        { label: 'TOP FEATURE', value: 'volume_surge', trend: 'neutral' },
        { label: 'R² SCORE', value: '0.73', trend: 'up' },
      ],
      chart: { kind: 'bar', data: featureImportance, xKey: 'feature', yKey: 'importance' },
    },
  ],
}
