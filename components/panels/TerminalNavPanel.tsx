'use client'

import { useState } from 'react'

const navItems = ['Welcome', 'Projects', 'Blog', 'About', 'Contact']

export default function TerminalNavPanel() {
  const [activeNav, setActiveNav] = useState('Welcome')

  return (
    <div className="h-full bg-black font-mono text-xs flex flex-col p-3">
      {/* Panel Label */}
      <div className="text-[9px] tracking-widest text-white uppercase border-b border-gray-800 pb-2 mb-3">
        Terminal
      </div>

      {/* Navigation Block */}
      <div className="mb-4">
        <div className="text-[9px] text-gray-600 tracking-widest uppercase mb-2">Navigation</div>
        {navItems.map((item) => (
          <div
            key={item}
            onClick={() => setActiveNav(item)}
            className={`py-1.5 border-b border-gray-900 cursor-pointer tracking-wider ${
              activeNav === item ? 'text-white' : 'text-gray-500'
            }`}
          >
            <span className={activeNav === item ? 'text-white' : 'text-gray-800'}>
              &gt;
            </span>{' '}
            {item.toLowerCase()}
          </div>
        ))}
      </div>

      {/* Terminal Output Block */}
      <div className="flex-1 bg-gray-950 border border-gray-800 p-3 overflow-auto">
        <div className="text-[10px] tracking-wider text-white uppercase mb-2">System output</div>

        <div className="text-gray-700 mb-1">$ whoami</div>
        <div className="text-gray-400 mb-3">→ developer, designer, builder</div>

        <div className="text-gray-700 mb-1">$ ls projects/</div>
        <div className="text-gray-400 mb-3">project_01/ project_02/ project_03/</div>

        <div className="text-gray-700 mb-1">$ cat status.txt</div>
        <div className="text-gray-300 mb-3">Currently building cool stuff.</div>

        {/* Content Area */}
        <div className="mt-4 pt-3 border-t border-gray-800">
          <div className="text-[9px] text-gray-600 tracking-wider uppercase mb-2">
            {activeNav} content
          </div>
          <ContentDisplay activeNav={activeNav} />
        </div>

        {/* Prompt with cursor */}
        <div className="mt-4 text-gray-700">
          ~/portfolio{' '}
          <span className="inline-block w-2 h-3 bg-white align-middle animate-pulse" />
        </div>
      </div>
    </div>
  )
}

function ContentDisplay({ activeNav }: { activeNav: string }) {
  const content: Record<string, { lines: string[] }> = {
    Welcome: {
      lines: [
        'Welcome to my portfolio.',
        'I build full-stack applications',
        'with a focus on clean code and',
        'great user experiences.'
      ]
    },
    Projects: {
      lines: [
        '► Project Alpha (2024)',
        '  Fintech dashboard | React + Node',
        '',
        '► Project Beta (2023)',
        '  E-commerce platform | Next.js',
        '',
        '► Project Gamma (2023)',
        '  API integration | Python + FastAPI'
      ]
    },
    Blog: {
      lines: [
        'Recent posts:',
        '• Building scalable APIs',
        '• UI patterns for dashboards',
        '• Terminal-style interfaces'
      ]
    },
    About: {
      lines: [
        'Full-stack developer with 3+ years',
        'of experience building web apps.',
        'Currently exploring trading algorithms',
        'and quantitative analysis.'
      ]
    },
    Contact: {
      lines: [
        'GitHub: @username',
        'LinkedIn: /in/username',
        'Email: user@example.com',
        '',
        'Open to opportunities!'
      ]
    }
  }

  const currentContent = content[activeNav] || { lines: ['Content not found'] }

  return (
    <div className="text-gray-400 leading-relaxed">
      {currentContent.lines.map((line, i) => (
        <div key={i}>{line}</div>
      ))}
    </div>
  )
}
