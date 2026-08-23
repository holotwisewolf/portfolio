// Per-project summaries for the project list windows: what it is, the headline
// measured numbers, the honest verdict, and the workspace path for the deep dive.
// Every number here is real — sources are the workspace pages they link to.

export interface ProjectSummary {
  id: string
  title: string
  pitch: string
  stats: { label: string; value: string }[]
  verdict: string
  workspacePath: string[]
}

export const TRADING_SUMMARIES: ProjectSummary[] = [
  {
    id: 'zone-classifier',
    title: 'Zone Classifier',
    pitch: 'Classify market regimes (neutral / consolidation / breakout) with interpretable models instead of black boxes.',
    stats: [
      { label: 'TRAINING SET', value: '25 hand-labeled zones' },
      { label: 'RF CV ACCURACY', value: '80% ± 10' },
      { label: 'SYMBOLIC TEST', value: '75%' },
    ],
    verdict: 'The label gallery and live predictions are inspectable — you can judge the ground truth yourself.',
    workspacePath: ['trading', 'zone-classifier', 'overview', 'README.md'],
  },
  {
    id: 'orderflow',
    title: 'Orderflow Research',
    pitch: 'Does the efficiency of aggressive flow (elasticity) predict continuation? Full thesis-grade treatment.',
    stats: [
      { label: 'RECORDS', value: '672,277 ES trades' },
      { label: 'BEST CELL EV', value: '$23.38 → $1.61' },
      { label: 'LOW-E SPREAD', value: '+27% at 30s' },
    ],
    verdict: 'The pattern is consistent; the profitability is not. The honest centerpiece of the archive.',
    workspacePath: ['trading', 'orderflow', 'overview', 'README.md'],
  },
  {
    id: 'neutral-candle',
    title: 'Neutral Candle',
    pitch: 'An 18-filter grid search engine over neutral-candle breakout setups, with Monte Carlo and slippage stress testing.',
    stats: [
      { label: 'CONFIGS TESTED', value: '4,775' },
      { label: 'PROFITABLE', value: '44 (1%)' },
      { label: 'NO-FILTER BASELINE', value: '−$90/trade' },
    ],
    verdict: 'The engine killed its own best result before it could be trusted with capital. That is the product.',
    workspacePath: ['trading', 'neutral-candle', 'overview', 'README.md'],
  },
  {
    id: 'ib-strategy',
    title: 'IB Strategy',
    pitch: 'The first hour’s range cloned above and below: mean-reversion vs break-and-retest, backtested on real ticks.',
    stats: [
      { label: 'BACKTEST', value: '254 trades, Mar 2025' },
      { label: 'ONLY WINNER', value: 'B&R Short +$8,148' },
      { label: 'MEAN-REV RESULT', value: '−$575k variant' },
    ],
    verdict: '70–90% win rates that lost six figures. The win-rate-vs-EV lesson, on real data.',
    workspacePath: ['trading', 'ib-strategy', 'overview', 'README.md'],
  },
  {
    id: 'vpoc',
    title: 'VPOC Analysis',
    pitch: 'When price returns to yesterday’s volume point of control, does it react? Explorer pins every real touch.',
    stats: [
      { label: 'TOUCH EVENTS', value: '~100 real days' },
      { label: 'BOUNCE RATE', value: '58% of 45' },
      { label: 'VERDICT', value: 'coin flip inside CI' },
    ],
    verdict: 'Marginal edge — which is why it became an input to regime classification, not a strategy.',
    workspacePath: ['trading', 'vpoc', 'overview', 'README.md'],
  },
  {
    id: 'hmm',
    title: 'HMM Regimes',
    pitch: '4-state Gaussian HMM re-run on real NQ bars: what regimes actually look like, measured.',
    stats: [
      { label: 'BARS', value: '1,331 (Mar 2025)' },
      { label: 'CONSOLIDATION', value: '49% of time' },
      { label: 'TRUE BREAKOUTS', value: '10.9%' },
    ],
    verdict: 'Real breakouts are ~11% of bars — the base rate every classifier must respect.',
    workspacePath: ['trading', 'hmm', 'overview', 'README.md'],
  },
  {
    id: 'walkforward',
    title: 'Walk-Forward Analytics',
    pitch: 'The validation framework every strategy here must survive: rolling train-on-past, test-on-future windows.',
    stats: [
      { label: 'WINDOW MODELS', value: '126 trained' },
      { label: 'ROBUSTNESS', value: '0.984' },
      { label: 'BEATS BENCHMARK', value: 'p=0.003 — no' },
    ],
    verdict: 'Consistent and significant — and honest enough to report it doesn’t beat the benchmark.',
    workspacePath: ['trading', 'walkforward', 'overview', 'README.md'],
  },
  {
    id: 'symbolic',
    title: 'Symbolic Regression',
    pitch: 'Genetic programming evolves readable formulas from zone features — nine operators, parsimony-penalized.',
    stats: [
      { label: 'TEST ACCURACY', value: '75% (4 of 5)' },
      { label: 'EVOLVED OPS', value: '11' },
      { label: 'OOB VS TRAIN', value: 'worse — flagged' },
    ],
    verdict: 'The real evolved equation is an auditable max/sqrt/log tree. Ugly, honest, deployable.',
    workspacePath: ['trading', 'symbolic', 'overview', 'README.md'],
  },
  {
    id: 'ml-consolidation',
    title: 'ML Consolidation',
    pitch: 'Random forests vs hand-coded rules for spotting consolidation — with the four derived microstructure scores.',
    stats: [
      { label: 'SAMPLES', value: '5,200 labeled bars' },
      { label: 'RF ACCURACY', value: '78%' },
      { label: 'RULES BASELINE', value: '65%' },
    ],
    verdict: 'It predicts the labeler, not the market — see the label-vs-outcome page for that gap on real candles.',
    workspacePath: ['trading', 'ml-consolidation', 'overview', 'README.md'],
  },
  {
    id: 'orderflow-visualizer',
    title: 'Orderflow Visualizer',
    pitch: 'A diagnostic for tick-data quality: what your feed actually contains before you trust it.',
    stats: [
      { label: 'COMPLETENESS', value: '98%' },
      { label: 'BID/ASK PRESENT', value: '95%' },
      { label: 'GAPS', value: '2' },
    ],
    verdict: 'Boring on purpose. The tool that explains why orderflow strategies died on trade-only data.',
    workspacePath: ['trading', 'orderflow-visualizer', 'overview', 'README.md'],
  },
]

export const DISCORD_SUMMARY: ProjectSummary = {
  id: 'discord-bot',
  title: 'Discord Research Bot',
  pitch: 'A multi-AI research assistant: each command routes a question to a different interrogation pattern.',
  stats: [
    { label: 'COMMANDS', value: 'hardmode / consensus / crosscheck / auto' },
    { label: 'COST RANGE', value: '$0.01–$0.12/exchange' },
    { label: 'MODELS', value: 'Claude · GPT · Gemini' },
  ],
  verdict: 'Consensus mode surfaces disagreement, not averages — the caveats are the value.',
  workspacePath: ['discord', 'discord-bot', 'overview', 'README.md'],
}
