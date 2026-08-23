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
      kind: 'text',
      heading: 'THE REAL OUTPUT',
      paras: [
        { text: 'The actual evolved equation lives in method/FORMULAS.md — a nested max/sqrt/log tree over zone-range and duration variables, 11 operations, 75% test accuracy. Not pretty. Auditable.' },
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
      kind: 'stats',
      items: [
        { label: 'POPULATION', value: '1,000 equations/generation' },
        { label: 'GENERATIONS', value: '20' },
        { label: 'TOURNAMENT SIZE', value: '20' },
        { label: 'PARSIMONY λ', value: '0.001' },
        { label: 'STOPPING ERROR', value: '0.01' },
        { label: 'SEED', value: '42' },
      ],
    },
    {
      kind: 'text',
      heading: 'THE OPERATOR VOCABULARY — WHAT EVOLUTION COULD BUILD WITH',
      paras: [
        { text: 'The function set is exactly nine operators: add, sub, mul, div, sqrt, log, abs, max, min. No if-statements, no learned coefficients beyond what constants mutation injects. The nested max()/sqrt()/log() shape of the discovered equation is a direct consequence of this vocabulary — max() acts as the only "conditional" available, which is why it appears as guards throughout the tree.', tone: 'key' },
        { text: 'Inputs: the 53 zone-feature columns (range/context/body/volume families). Target: the zone label (1/2/3).', tone: 'default' },
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
  title: 'DISCOVERED FORMULA',
  intro: 'The actual gplearn output from the 2026-08-21 run on zone features — not a prettied-up rewrite.',
  blocks: [
    {
      kind: 'formula',
      heading: 'BEST EVOLVED EQUATION (11 OPERATIONS)',
      formulas: [
        'sqrt(add(log(div(max(duration_minutes5, zone_low1), zone_low6)),',
        '  sqrt(max(max(max(add(sqrt(max(zone_range5, duration_minutes3)),',
        '    sqrt(max(duration_minutes5, zone_low1))), duration_minutes3),',
        '    duration_minutes3), duration_minutes3))))',
      ],
      notes: [
        { text: 'Readable? Barely. Honest? Completely. This is what genetic programming actually evolves on 25 samples × 53 features — a nested max/sqrt/log tree that prefers zone-range and duration variables.', tone: 'key' },
        { text: 'Prettier hand-written approximations previously shown here were fabricated for the portfolio and have been removed.', tone: 'warn' },
      ],
    },
    {
      kind: 'bullets',
      heading: 'WHAT THE TREE PREFERS',
      items: [
        { text: 'zone_range / duration_minutes dominate the formula interior', mark: 'check' },
        { text: 'Price-level variables (zone_low) appear only as guards inside max()', mark: 'none' },
        { text: 'Deployable as a single expression — no ML runtime needed', mark: 'check' },
      ],
    },
  ],
}

export const validation: DocContent = {
  path: '// results/validation',
  title: 'VALIDATION',
  intro: 'Measured performance of the 2026-08-21 gplearn run (25 zones × 53 features).',
  blocks: [
    {
      kind: 'metrics',
      title: 'RUN PERFORMANCE',
      metrics: [
        { label: 'TRAIN ACC', value: '82.4%', trend: 'up' },
        { label: 'TEST ACC', value: '75.0%', trend: 'up' },
        { label: 'OVERFIT GAP', value: '7.4%', trend: 'neutral' },
        { label: 'TEST F1', value: '0.746', trend: 'up' },
      ],
    },
    {
      kind: 'stats',
      items: [
        { label: 'POPULATION', value: '1,000' },
        { label: 'GENERATIONS', value: '20' },
        { label: 'PARSIMONY', value: '0.001' },
        { label: 'COMPLEXITY', value: '11 operations' },
        { label: 'TRAIN MSE', value: '0.138' },
        { label: 'TEST MSE', value: '0.301' },
      ],
    },
    {
      kind: 'table',
      heading: 'MODEL COMPARISON (SAME FEATURES)',
      headers: ['MODEL', 'ACCURACY', 'INTERPRETABLE'],
      rows: [
        ['Gradient Boosting (zone trainer)', '~100% train', { text: 'No — and CV collapses to 55%', tone: 'bad' }],
        ['Random Forest (zone trainer)', '80% CV', { text: 'Importance table only', tone: 'warn' }],
        [{ text: 'Symbolic Regression (this run)', tone: 'key' }, '75% test', { text: 'Yes — auditable formula', tone: 'good' }],
      ],
    },
    {
      kind: 'text',
      heading: 'WHY 75% IS LIKELY INFLATED',
      paras: [
        { text: '25 zones, 5 of them in the test set — "75% test accuracy" means 4 of 5 zones. One different fold and this is a different number.', tone: 'key' },
      ],
    },
    {
      kind: 'bullets',
      items: [
        { text: '53 features vs 25 samples — the model has more knobs than data; parsimony punishes complexity but cannot create out-of-sample statistics', mark: 'cross' },
        { text: 'The run log itself shows it: the best individual\'s out-of-bag fitness (0.56–0.99) was consistently worse than its training fitness (0.23–0.47) in nearly every generation', mark: 'cross' },
        { text: 'Ground truth is one person\'s hand-labels — agreeing with the labeler is not predicting the market', mark: 'cross' },
        { text: 'Chance level on this label split is 40% (majority class) — the signal above chance is real but the sample is too small to trust its size', mark: 'none' },
      ],
    },
    {
      kind: 'text',
      paras: [
        { text: 'Entry point: core/symbolic_regression.py. Run reproduced 2026-08-21 via scripts/run_symbolic.py; equation saved to ml_models/symbolic_equation.txt.', tone: 'default' },
      ],
    },
  ],
}

// Real best-individual fitness by generation from the 2026-08-21 run log
// (gplearn fitness = error; lower is better)
const fitnessByGen = [
  { gen: 0, fitness: 0.471 },
  { gen: 2, fitness: 0.366 },
  { gen: 4, fitness: 0.283 },
  { gen: 6, fitness: 0.270 },
  { gen: 8, fitness: 0.283 },
  { gen: 10, fitness: 0.277 },
  { gen: 12, fitness: 0.264 },
  { gen: 14, fitness: 0.257 },
  { gen: 16, fitness: 0.238 },
  { gen: 19, fitness: 0.243 },
]

export const evolution: DocContent = {
  path: '// results/evolution',
  title: 'EVOLUTION RUN',
  intro: 'Best-individual fitness per generation, measured from the real run log.',
  blocks: [
    {
      kind: 'metrics',
      title: 'BEST FITNESS BY GENERATION (ERROR — LOWER IS BETTER)',
      metrics: [
        { label: 'GEN 0', value: '0.471', trend: 'neutral' },
        { label: 'GEN 19', value: '0.243', trend: 'down' },
        { label: 'IMPROVEMENT', value: '−48%', trend: 'up' },
        { label: 'POPULATION', value: '1,000', trend: 'neutral' },
      ],
      chart: { kind: 'line', data: fitnessByGen, xKey: 'gen', yKey: 'fitness' },
    },
    {
      kind: 'text',
      paras: [
        { text: 'Most of the gain lands in the first 6 generations; after that the parsimony pressure trades fitness for simplicity and the curve flattens.', tone: 'key' },
        { text: 'The previously shown feature-importance weights (42/31/18/9%) were invented for the portfolio and are removed. What the formula actually uses is visible in its tree: zone-range and duration variables dominate.', tone: 'warn' },
      ],
    },
  ],
}
