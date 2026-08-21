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
import OrderflowDemo from '@/components/projects/OrderflowDemo'

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
    description: 'Volume Point of Control (legacy window)',
    children: [],
  },
  {
    type: 'project' as const,
    name: 'ib-strategy',
    description: 'Initial Balance trading (legacy window)',
    children: [],
  },
  {
    type: 'project' as const,
    name: 'walkforward',
    description: 'Walk-forward validation (legacy window)',
    children: [],
  },
]

const discordChildren = [
  {
    type: 'project' as const,
    name: 'discord-bot',
    description: 'Research bot (legacy window)',
    children: [],
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
