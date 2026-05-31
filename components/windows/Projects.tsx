'use client'

import { useWindowStore } from '../window-manager/useWindows'
import ProjectDetail from './ProjectDetail'

interface Project {
  id: string
  title: string
  description: string
  tech: string[]
}

const projects: Project[] = [
  {
    id: 'orderflow',
    title: 'Orderflow Research',
    description: 'ML Zone Classification System for trading - replace hard-coded rules with data-driven machine learning.',
    tech: ['Python', 'ML', 'FastAPI', 'Next.js'],
  },
  {
    id: 'backtest',
    title: 'Trading Backtests',
    description: 'Strategy backtesting with parameter optimization and performance analytics.',
    tech: ['Python', 'pandas', 'numpy'],
  },
]

export default function Projects() {
  const openWindow = useWindowStore((s) => s.openWindow)

  const handleProjectClick = (project: Project) => {
    openWindow(
      `project-${project.id}` as any,
      project.title,
      () => <ProjectDetail project={project} />
    )
  }

  return (
    <div className="h-full">
      <h2 className="text-2xl font-bold mb-6 border-b border-white pb-2">PROJECTS</h2>
      <div className="grid grid-cols-1 gap-4">
        {projects.map((project) => (
          <button
            key={project.id}
            onClick={() => handleProjectClick(project)}
            className="text-left p-4 border border-white hover:bg-white hover:text-black transition-colors"
          >
            <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
            <p className="text-sm opacity-80 mb-3">{project.description}</p>
            <div className="flex gap-2 flex-wrap">
              {project.tech.map((t) => (
                <span key={t} className="text-xs border border-current px-2 py-0.5">
                  {t}
                </span>
              ))}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
