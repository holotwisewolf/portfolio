'use client'

import { useWindowStore } from '../window-manager/useWindows'
import ProjectDetail from './ProjectDetail'

interface Project {
  id: string
  title: string
  description: string
  tech: string[]
  workspacePath: string[]
}

const projects: Project[] = [
  {
    id: 'trading',
    title: 'Trading Research',
    description: 'ML Zone Classification System with symbolic regression. Classifies market regimes (Neutral/Consolidation/Breakout) using interpretable AI.',
    tech: ['Python', 'ML', 'FastAPI', 'NumPy'],
    workspacePath: ['trading'],
  },
  {
    id: 'discord',
    title: 'Discord Research Bot',
    description: 'Multi-AI research assistant coordinating Claude, GPT-4, and Gemini by cost/capability routing.',
    tech: ['Python', 'Discord.py', 'LLM API'],
    workspacePath: ['discord', 'discord-bot', 'overview', 'README.md'],
  },
]

export default function Projects() {
  const openWorkspace = useWindowStore((s) => s.openWorkspace)

  const handleProjectClick = (project: Project) => {
    openWorkspace(project.workspacePath)
  }

  return (
    <div className="h-full">
      <h2 className="crt-text text-2xl font-bold mb-6 border-b border-white pb-2">PROJECTS</h2>
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
