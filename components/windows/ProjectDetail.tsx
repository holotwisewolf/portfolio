'use client'

import TradingVisualizer from '../projects/TradingVisualizer'

interface Project {
  id: string
  title: string
  description: string
  tech: string[]
}

interface ProjectDetailProps {
  project: Project
}

export default function ProjectDetail({ project }: ProjectDetailProps) {
  return (
    <div className="h-full flex flex-col">
      <h2 className="crt-text text-2xl font-bold mb-2">{project.title}</h2>
      <p className="mb-4 opacity-80">{project.description}</p>

      <div className="flex gap-2 mb-4">
        {project.tech.map((t) => (
          <span key={t} className="text-xs border border-white px-2 py-0.5">
            {t}
          </span>
        ))}
      </div>

      <div className="flex-1 border border-white">
        {project.id === 'trading' ? (
          <TradingVisualizer />
        ) : (
          <div className="flex items-center justify-center h-full opacity-50">
            Demo coming soon...
          </div>
        )}
      </div>
    </div>
  )
}
