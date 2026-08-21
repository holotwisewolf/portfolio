import type { FolderNode } from './registry'
import { makeDoc, makeDemo } from './DocFile'
import {
  ReadmeFile,
  MethodologyFile,
  FeaturesFile,
  FindingsFile,
  BuildLogFile,
  SettingsConf,
  BacktestDemoFile,
  ResultsPatternsFile,
  ResultsEquityCurveFile,
  ResultsZoneDistributionFile,
  ResultsFeatureImportanceFile,
} from './projects/trading/zone-classifier'
import * as orderflow from './projects/trading/orderflow/content'
import * as hmm from './projects/trading/hmm/content'
import * as vpoc from './projects/trading/vpoc/content'
import * as ib from './projects/trading/ib-strategy/content'
import * as walkforward from './projects/trading/walkforward/content'
import * as symbolic from './projects/trading/symbolic/content'
import * as mlConsol from './projects/trading/ml-consolidation/content'
import * as orderflowViz from './projects/trading/orderflow-visualizer/content'
import * as neutralCandle from './projects/trading/neutral-candle/content'
import OrderflowDemo from '@/components/projects/OrderflowDemo'
import VPOCDemo from '@/components/projects/VPOCDemo'
import ProjectDiscord from '@/components/windows/ProjectDiscord'
import * as discord from './projects/discord/content'

const zoneClassifierChildren = [
  {
    type: 'folder' as const,
    name: 'overview',
    description: 'What it is',
    children: [
      { type: 'file' as const, name: 'README.md', description: 'Project overview', component: ReadmeFile },
      { type: 'file' as const, name: 'FINDINGS.md', description: 'Key discoveries', component: FindingsFile },
    ],
  },
  {
    type: 'folder' as const,
    name: 'method',
    description: 'How it works',
    children: [
      { type: 'file' as const, name: 'METHODOLOGY.md', description: 'How the model works', component: MethodologyFile },
      { type: 'file' as const, name: 'FEATURES.md', description: '68 engineered features', component: FeaturesFile },
      { type: 'file' as const, name: 'BUILD_LOG.md', description: 'How I built this', component: BuildLogFile },
      { type: 'file' as const, name: 'settings.conf', description: 'Model parameters', component: SettingsConf },
    ],
  },
  {
    type: 'folder' as const,
    name: 'results',
    description: 'The proof',
    children: [
      { type: 'file' as const, name: 'demo', description: 'Interactive backtest demo', component: BacktestDemoFile },
      { type: 'file' as const, name: 'patterns', description: 'Pattern examples', component: ResultsPatternsFile },
      { type: 'file' as const, name: 'equity-curve', description: 'Equity curve over time', component: ResultsEquityCurveFile },
      { type: 'file' as const, name: 'zone-distribution', description: 'Zone distribution', component: ResultsZoneDistributionFile },
      { type: 'file' as const, name: 'feature-importance', description: 'Feature importance ranking', component: ResultsFeatureImportanceFile },
    ],
  },
]

const tradingChildren = [
  {
    type: 'project' as const,
    name: 'zone-classifier',
    description: 'Market regime classification',
    children: zoneClassifierChildren,
  },
  {
    type: 'project' as const,
    name: 'orderflow',
    description: 'Delta acceleration analysis',
    children: [
      {
        type: 'folder' as const,
        name: 'overview',
        description: 'What it is',
        children: [
          { type: 'file' as const, name: 'README.md', description: 'Project overview', component: makeDoc(orderflow.readme) },
          { type: 'file' as const, name: 'FINDINGS.md', description: 'Cross-validation results', component: makeDoc(orderflow.findings) },
        ],
      },
      {
        type: 'folder' as const,
        name: 'method',
        description: 'How it works',
        children: [
          { type: 'file' as const, name: 'METHODOLOGY.md', description: 'Elasticity + delta acceleration', component: makeDoc(orderflow.methodology) },
          { type: 'file' as const, name: 'DATA_NOTES.md', description: 'MBP-1 vs trade data', component: makeDoc(orderflow.dataNotes) },
        ],
      },
      {
        type: 'folder' as const,
        name: 'results',
        description: 'The proof',
        children: [
          { type: 'file' as const, name: 'ev-decay', description: 'EV per trade over time', component: makeDoc(orderflow.evDecay) },
          { type: 'file' as const, name: 'quartiles', description: 'Performance by quartile', component: makeDoc(orderflow.quartiles) },
          { type: 'file' as const, name: 'elasticity-dist', description: 'Elasticity distribution', component: makeDoc(orderflow.elasticityDistFile) },
          { type: 'file' as const, name: 'demo', description: 'Interactive simulator', component: makeDemo(OrderflowDemo, { path: '// results/demo', title: 'ORDERFLOW DEMO', intro: 'Interactive delta/zone simulator on generated data.' }) },
        ],
      },
    ],
  },
  {
    type: 'project' as const,
    name: 'hmm',
    description: 'Hidden Markov regime detection',
    children: [
      {
        type: 'folder' as const,
        name: 'overview',
        description: 'What it is',
        children: [
          { type: 'file' as const, name: 'README.md', description: 'Project overview', component: makeDoc(hmm.readme) },
          { type: 'file' as const, name: 'FINDINGS.md', description: 'HMM vs Zone Classifier', component: makeDoc(hmm.findings) },
        ],
      },
      {
        type: 'folder' as const,
        name: 'method',
        description: 'How it works',
        children: [
          { type: 'file' as const, name: 'METHODOLOGY.md', description: 'States + training params', component: makeDoc(hmm.methodology) },
          { type: 'file' as const, name: 'FEATURES.md', description: 'The 4 HMM features', component: makeDoc(hmm.features) },
        ],
      },
      {
        type: 'folder' as const,
        name: 'results',
        description: 'The proof',
        children: [
          { type: 'file' as const, name: 'regime-transitions', description: 'Regime over time', component: makeDoc(hmm.regimeTransitions) },
          { type: 'file' as const, name: 'state-distribution', description: 'Time in each state', component: makeDoc(hmm.stateDistributionFile) },
        ],
      },
    ],
  },
  {
    type: 'project' as const,
    name: 'vpoc',
    description: 'Volume Point of Control analysis',
    children: [
      {
        type: 'folder' as const,
        name: 'overview',
        description: 'What it is',
        children: [
          { type: 'file' as const, name: 'README.md', description: 'Project overview', component: makeDoc(vpoc.readme) },
          { type: 'file' as const, name: 'FINDINGS.md', description: 'Evolution into Zone Classifier', component: makeDoc(vpoc.findings) },
        ],
      },
      {
        type: 'folder' as const,
        name: 'method',
        description: 'How it works',
        children: [
          { type: 'file' as const, name: 'METHODOLOGY.md', description: 'VPOC theory', component: makeDoc(vpoc.methodology) },
        ],
      },
      {
        type: 'folder' as const,
        name: 'results',
        description: 'The proof',
        children: [
          { type: 'file' as const, name: 'touch-analysis', description: 'Reaction types at VPOC', component: makeDoc(vpoc.touchAnalysis) },
          { type: 'file' as const, name: 'demo', description: 'Interactive touch simulator', component: makeDemo(VPOCDemo, { path: '// results/demo', title: 'VPOC DEMO', intro: 'Interactive VPOC touch-test simulator on generated data.' }) },
        ],
      },
    ],
  },
  {
    type: 'project' as const,
    name: 'ib-strategy',
    description: 'Initial Balance trading',
    children: [
      {
        type: 'folder' as const,
        name: 'overview',
        description: 'What it is',
        children: [
          { type: 'file' as const, name: 'README.md', description: 'Project overview', component: makeDoc(ib.readme) },
        ],
      },
      {
        type: 'folder' as const,
        name: 'method',
        description: 'How it works',
        children: [
          { type: 'file' as const, name: 'RULES.md', description: 'Cloned box geometry + playbooks', component: makeDoc(ib.rules) },
        ],
      },
      {
        type: 'folder' as const,
        name: 'results',
        description: 'The proof',
        children: [
          { type: 'file' as const, name: 'backtest', description: 'Trade log + equity', component: makeDoc(ib.backtest) },
        ],
      },
    ],
  },
  {
    type: 'project' as const,
    name: 'walkforward',
    description: 'Walk-forward validation framework',
    children: [
      {
        type: 'folder' as const,
        name: 'overview',
        description: 'What it is',
        children: [
          { type: 'file' as const, name: 'README.md', description: 'Project overview', component: makeDoc(walkforward.readme) },
        ],
      },
      {
        type: 'folder' as const,
        name: 'method',
        description: 'How it works',
        children: [
          { type: 'file' as const, name: 'METHODOLOGY.md', description: 'Rolling-window process', component: makeDoc(walkforward.methodology) },
        ],
      },
      {
        type: 'folder' as const,
        name: 'results',
        description: 'The proof',
        children: [
          { type: 'file' as const, name: 'windows', description: 'Per-window performance', component: makeDoc(walkforward.windows) },
        ],
      },
    ],
  },
  {
    type: 'project' as const,
    name: 'symbolic',
    description: 'Symbolic regression research',
    children: [
      {
        type: 'folder' as const,
        name: 'overview',
        description: 'What it is',
        children: [
          { type: 'file' as const, name: 'README.md', description: 'Project overview', component: makeDoc(symbolic.readme) },
        ],
      },
      {
        type: 'folder' as const,
        name: 'method',
        description: 'How it works',
        children: [
          { type: 'file' as const, name: 'METHODOLOGY.md', description: 'Genetic programming + parsimony', component: makeDoc(symbolic.methodology) },
          { type: 'file' as const, name: 'FORMULAS.md', description: 'Discovered formulas', component: makeDoc(symbolic.formulas) },
        ],
      },
      {
        type: 'folder' as const,
        name: 'results',
        description: 'The proof',
        children: [
          { type: 'file' as const, name: 'validation', description: 'R² validation + model comparison', component: makeDoc(symbolic.validation) },
          { type: 'file' as const, name: 'evolution', description: 'Evolution run + feature weights', component: makeDoc(symbolic.evolution) },
        ],
      },
    ],
  },
  {
    type: 'project' as const,
    name: 'ml-consolidation',
    description: 'ML consolidation detection',
    children: [
      {
        type: 'folder' as const,
        name: 'overview',
        description: 'What it is',
        children: [
          { type: 'file' as const, name: 'README.md', description: 'Project overview', component: makeDoc(mlConsol.readme) },
        ],
      },
      {
        type: 'folder' as const,
        name: 'method',
        description: 'How it works',
        children: [
          { type: 'file' as const, name: 'PIPELINE.md', description: 'Training pipeline + features', component: makeDoc(mlConsol.pipeline) },
        ],
      },
      {
        type: 'folder' as const,
        name: 'results',
        description: 'The proof',
        children: [
          { type: 'file' as const, name: 'model-accuracy', description: 'Model comparison + importance', component: makeDoc(mlConsol.modelAccuracyFile) },
        ],
      },
    ],
  },
  {
    type: 'project' as const,
    name: 'orderflow-visualizer',
    description: 'Tick data quality diagnostics',
    children: [
      {
        type: 'folder' as const,
        name: 'overview',
        description: 'What it is',
        children: [
          { type: 'file' as const, name: 'README.md', description: 'Project overview', component: makeDoc(orderflowViz.readme) },
        ],
      },
      {
        type: 'folder' as const,
        name: 'method',
        description: 'How it works',
        children: [],
      },
      {
        type: 'folder' as const,
        name: 'results',
        description: 'The proof',
        children: [
          { type: 'file' as const, name: 'data-quality', description: 'Feed audit results', component: makeDoc(orderflowViz.dataQuality) },
        ],
      },
    ],
  },
  {
    type: 'project' as const,
    name: 'neutral-candle',
    description: '12-filter grid search optimizer',
    children: [
      {
        type: 'folder' as const,
        name: 'overview',
        description: 'What it is',
        children: [
          { type: 'file' as const, name: 'README.md', description: 'Project overview', component: makeDoc(neutralCandle.readme) },
        ],
      },
      {
        type: 'folder' as const,
        name: 'method',
        description: 'How it works',
        children: [
          { type: 'file' as const, name: 'FILTERS.md', description: 'Filter vocabulary + grid search', component: makeDoc(neutralCandle.filters) },
        ],
      },
      {
        type: 'folder' as const,
        name: 'results',
        description: 'The proof',
        children: [
          { type: 'file' as const, name: 'best-combos', description: 'Top filter combinations', component: makeDoc(neutralCandle.bestCombos) },
          { type: 'file' as const, name: 'monte-carlo', description: 'Luck distribution analysis', component: makeDoc(neutralCandle.monteCarlo) },
        ],
      },
    ],
  },
]

const discordChildren = [
  {
    type: 'project' as const,
    name: 'discord-bot',
    description: 'Multi-AI research bot',
    children: [
      {
        type: 'folder' as const,
        name: 'overview',
        description: 'What it is',
        children: [
          { type: 'file' as const, name: 'README.md', description: 'Bot + command reference', component: makeDoc(discord.readme) },
        ],
      },
      {
        type: 'folder' as const,
        name: 'method',
        description: 'How it works',
        children: [
          { type: 'file' as const, name: 'ARCHITECTURE.md', description: 'Routing + costs', component: makeDoc(discord.architecture) },
        ],
      },
      {
        type: 'folder' as const,
        name: 'results',
        description: 'The proof',
        children: [
          { type: 'file' as const, name: 'demo', description: 'Interactive chat demo', component: makeDemo(ProjectDiscord, { path: '// results/demo', title: 'LIVE DEMO', intro: 'Type a command or click one of the quick commands to see the bot respond.' }) },
        ],
      },
    ],
  },
]

const otherChildren: any[] = []

export const projectTree: FolderNode = {
  type: 'root',
  name: 'projects',
  description: 'All projects',
  children: [
    {
      type: 'category',
      name: 'trading',
      description: 'Quantitative trading research',
      children: tradingChildren,
    },
    {
      type: 'category',
      name: 'discord',
      description: 'Discord automation',
      children: discordChildren,
    },
    {
      type: 'category',
      name: 'other',
      description: 'Misc projects',
      children: otherChildren,
    },
  ],
}
