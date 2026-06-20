import type { FolderNode } from './registry'
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
    description: 'Delta acceleration analysis (legacy window)',
    children: [],
  },
  {
    type: 'project' as const,
    name: 'hmm',
    description: 'Hidden Markov Models (legacy window)',
    children: [],
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
