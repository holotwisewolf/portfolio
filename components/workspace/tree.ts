import type { FolderNode } from './registry'
import { makeDoc, makeDemo } from './DocFile'
import {
  ReadmeFile,
  MethodologyFile,
  FeaturesFile,
  FindingsFile,
  BuildLogFile,
  ResultsEquityCurveFile,
  ResultsZoneDistributionFile,
  ZoneLabelGallery,
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
import VpocDayExplorer from './projects/trading/vpoc/VpocDayExplorer'
import OrderflowDayExplorer from './projects/trading/orderflow/OrderflowDayExplorer'
import ProjectDiscord from '@/components/windows/ProjectDiscord'
import * as discord from './projects/discord/content'
import { terms } from './projects/trading/terms'

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
    ],
  },
  {
    type: 'folder' as const,
    name: 'results',
    description: 'The proof',
    children: [
      { type: 'file' as const, name: 'labels', description: 'The benchmark — hand-labeled zones on real candles', component: makeDemo(ZoneLabelGallery, { path: '// results/labels', title: 'THE LABELED ZONES', intro: 'The ground truth this project trains against: 88 hand-labeled zones on real NQ candles. Click any zone to expand it and judge for yourself whether the label fits.', realData: true }) },
      { type: 'file' as const, name: 'model-training', description: 'Real training metrics + importances', component: ResultsEquityCurveFile },
      { type: 'file' as const, name: 'zone-distribution', description: 'Labeled vs measured distribution', component: ResultsZoneDistributionFile },
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
          { type: 'file' as const, name: 'elasticity-dist', description: 'Elasticity distribution', component: makeDoc(orderflow.elasticityDistFile) },
          { type: 'file' as const, name: 'demo', description: 'Real-tick delta explorer', component: makeDemo(OrderflowDayExplorer, { path: '// results/demo', title: 'ORDERFLOW EXPLORER', intro: 'Price vs real aggressor delta — cumulative intraday delta and per-bar buy/sell aggression from Databento NQ ticks.', realData: true }) },
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
          { type: 'file' as const, name: 'demo', description: 'Real-tick VPOC explorer', component: makeDemo(VpocDayExplorer, { path: '// results/demo', title: 'VPOC EXPLORER', intro: 'Real trading days with the session VPOC pinned — every touch marked with its reaction extreme, volume profile on the right.', realData: true }) },
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
          { type: 'file' as const, name: 'backtest', description: 'Real backtest — Mar 2025', component: makeDoc(ib.backtest) },
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
          { type: 'file' as const, name: 'grid-verdict', description: 'Full grid search results', component: makeDoc(neutralCandle.bestCombos) },
          { type: 'file' as const, name: 'slippage', description: 'EV vs execution costs', component: makeDoc(neutralCandle.slippage) },
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
      children: [
        { type: 'file' as const, name: 'TERMS.md', description: 'Vocabulary + formulas used everywhere', component: makeDoc(terms) },
        ...tradingChildren,
      ],
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
