'use client'

import { useWindowStore } from '../window-manager/useWindows'

// All trading research projects
const TRADING_PROJECTS = [
  {
    id: 'zone-classifier',
    title: 'Zone Classifier',
    emoji: '📊',
    description: 'ML-based market regime classification',
    color: 'border-green-500/30',
    windowId: 'project-zone'
  },
  {
    id: 'orderflow',
    title: 'Orderflow Research',
    emoji: '💹',
    description: 'Elasticity, Delta, and Microstructure',
    color: 'border-blue-500/30',
    windowId: 'project-orderflow'
  },
  {
    id: 'vpoc',
    title: 'VPOC Analysis',
    emoji: '🎯',
    description: 'Volume Point of Control patterns',
    color: 'border-purple-500/30',
    windowId: 'project-vpoc'
  },
  {
    id: 'ib-strategy',
    title: 'IB Strategy',
    emoji: '📊',
    description: 'Initial Balance & Cloned Box',
    color: 'border-yellow-500/30',
    windowId: 'project-ib'
  },
  {
    id: 'hmm',
    title: 'HMM Analysis',
    emoji: '🔄',
    description: 'Hidden Markov Regime Detection',
    color: 'border-cyan-500/30',
    windowId: 'project-hmm'
  },
  {
    id: 'walk-forward',
    title: 'Walk-Forward Analytics',
    emoji: '🔬',
    description: 'Robust validation framework',
    color: 'border-red-500/30',
    windowId: 'project-walkforward'
  },
  {
    id: 'symbolic',
    title: 'Symbolic Regression',
    emoji: '🧬',
    description: 'Interpretable AI formulas',
    color: 'border-pink-500/30',
    windowId: 'project-symbolic'
  },
  {
    id: 'ml-consolidation',
    title: 'ML Consolidation',
    emoji: '🤖',
    description: 'ML-based consolidation detection',
    color: 'border-indigo-500/30',
    windowId: 'project-ml-consol'
  },
  {
    id: 'orderflow-visualizer',
    title: 'Orderflow Visualizer',
    emoji: '👁️',
    description: 'Tick data diagnostics',
    color: 'border-teal-500/30',
    windowId: 'project-of-viz'
  },
  {
    id: 'neutral-candle',
    title: 'Neutral Candle',
    emoji: '🕯️',
    description: '12-filter grid search engine',
    color: 'border-amber-500/30',
    windowId: 'project-neutral'
  },
]

export default function TradingProjects() {
  const openWindow = useWindowStore((s) => s.openWindow)

  const handleProjectClick = (project: typeof TRADING_PROJECTS[0]) => {
    openWindow(project.windowId as any)
  }

  return (
    <div className="h-full flex flex-col bg-[#0a0a0a]">
      {/* Header */}
      <div className="border-b border-white/20 p-4 bg-black/50">
        <h2 className="text-lg font-bold text-white mb-1">🔬 Trading Research Projects</h2>
        <p className="text-gray-500 text-[10px]">Click a project to open its dedicated window</p>
      </div>

      {/* Projects Grid */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-2 gap-3">
          {TRADING_PROJECTS.map((project) => (
            <button
              key={project.id}
              onClick={() => handleProjectClick(project)}
              className={`text-left p-4 bg-black/50 border ${project.color} rounded hover:bg-white/5 transition-colors group`}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{project.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-white font-medium text-sm mb-1 group-hover:text-green-400 transition-colors">
                    {project.title}
                  </div>
                  <div className="text-gray-500 text-[10px] leading-tight">
                    {project.description}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-white/20 p-3 bg-black/50 text-[10px] text-gray-600">
        <div className="flex justify-between">
          <span>{TRADING_PROJECTS.length} research projects</span>
          <span>Double-click desktop icons to open windows</span>
        </div>
      </div>
    </div>
  )
}
