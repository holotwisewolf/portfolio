'use client'

import { useWindowStore } from '../window-manager/useWindows'

interface TradingProject {
  id: string
  title: string
  description: string
  windowId: string
  workspacePath?: string[]
  migrated?: boolean
}

const TRADING_PROJECTS: TradingProject[] = [
  {
    id: 'zone-classifier',
    title: 'Zone Classifier',
    description: 'ML-based market regime classification',
    windowId: 'project-zone',
    workspacePath: ['trading', 'zone-classifier', 'README.md'],
    migrated: true,
  },
  {
    id: 'orderflow',
    title: 'Orderflow Research',
    description: 'Elasticity, Delta, and Microstructure',
    windowId: 'project-orderflow',
  },
  {
    id: 'vpoc',
    title: 'VPOC Analysis',
    description: 'Volume Point of Control patterns',
    windowId: 'project-vpoc',
  },
  {
    id: 'ib-strategy',
    title: 'IB Strategy',
    description: 'Initial Balance & Cloned Box',
    windowId: 'project-ib',
  },
  {
    id: 'hmm',
    title: 'HMM Analysis',
    description: 'Hidden Markov Regime Detection',
    windowId: 'project-hmm',
  },
  {
    id: 'walk-forward',
    title: 'Walk-Forward Analytics',
    description: 'Robust validation framework',
    windowId: 'project-walkforward',
  },
  {
    id: 'symbolic',
    title: 'Symbolic Regression',
    description: 'Interpretable AI formulas',
    windowId: 'project-symbolic',
  },
  {
    id: 'ml-consolidation',
    title: 'ML Consolidation',
    description: 'ML-based consolidation detection',
    windowId: 'project-ml-consol',
  },
  {
    id: 'orderflow-visualizer',
    title: 'Orderflow Visualizer',
    description: 'Tick data diagnostics',
    windowId: 'project-of-viz',
  },
  {
    id: 'neutral-candle',
    title: 'Neutral Candle',
    description: '12-filter grid search engine',
    windowId: 'project-neutral',
  },
]

export default function TradingProjects() {
  const openWindow = useWindowStore((s) => s.openWindow)
  const openWorkspace = useWindowStore((s) => s.openWorkspace)

  const handleProjectClick = (project: TradingProject) => {
    if (project.workspacePath) {
      openWorkspace(project.workspacePath)
    } else {
      openWindow(project.windowId as any)
    }
  }

  const handleBrowseWorkspace = () => {
    openWorkspace()
  }

  return (
    <div className="h-full flex flex-col bg-[#0a0a0a]">
      <div className="border-b border-[#1c2e1c] p-3 bg-black">
        <div className="text-[9px] tracking-[0.3em] text-[#444] mb-1">// trading research</div>
        <h2 className="text-[14px] tracking-[0.15em] text-white mb-2">PROJECTS [10]</h2>
        <p className="text-[#666] text-[10px] mb-3">Click any project to open</p>

        <button
          onClick={handleBrowseWorkspace}
          className="w-full text-left p-2 border border-[#1c2e1c] hover:border-[#00ff9d] hover:bg-[#0f1a0f] transition-colors text-[#00ff9d] text-[11px] tracking-[0.15em]"
        >
          &gt; BROWSE WORKSPACE
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        <div className="grid grid-cols-2 gap-0 border-t border-l border-[#1c2e1c]">
          {TRADING_PROJECTS.map((project) => (
            <button
              key={project.id}
              onClick={() => handleProjectClick(project)}
              className="text-left border-r border-b border-[#1c2e1c] p-3 hover:bg-[#0f1a0f] transition-colors group min-h-[80px] flex flex-col justify-between"
            >
              <div>
                <div className="text-[9px] tracking-[0.3em] text-[#444] group-hover:text-[#00ff9d] mb-1 transition-colors">
                  {project.migrated ? '[WORKSPACE]' : '[LEGACY]'}
                </div>
                <div className="text-white text-[12px] tracking-[0.05em] group-hover:text-[#00ff9d] transition-colors mb-1">
                  {project.title}
                </div>
                <div className="text-[#666] text-[10px] leading-relaxed">
                  {project.description}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-[#1c2e1c] p-2 bg-black text-[9px] text-[#444] tracking-[0.2em] flex justify-between">
        <span>{TRADING_PROJECTS.length} PROJECTS</span>
        <span>[ESC] EXITS WORKSPACE</span>
      </div>
    </div>
  )
}
