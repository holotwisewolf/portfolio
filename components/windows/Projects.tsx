'use client'

import { useState } from 'react'
import { useWindowStore } from '../window-manager/useWindows'
import { DISCORD_SUMMARY } from './projectSummaries'

export default function Projects() {
  const openWindow = useWindowStore((s) => s.openWindow)
  const openWorkspace = useWindowStore((s) => s.openWorkspace)
  const [showDiscord, setShowDiscord] = useState(false)

  if (showDiscord) {
    return (
      <div className="h-full flex flex-col bg-[#0a0a0a]">
        <div className="flex items-baseline justify-between px-4 pt-3">
          <button
            onClick={() => setShowDiscord(false)}
            className="text-[10px] tracking-[0.2em] text-[#666] hover:text-white transition-colors"
          >
            &lt; ALL PROJECTS
          </button>
          <button
            onClick={() => openWorkspace(DISCORD_SUMMARY.workspacePath)}
            className="text-[10px] tracking-[0.2em] text-[#999] hover:text-white border-b border-[#333] hover:border-white pb-[2px] transition-colors"
          >
            GO TO WORKSPACE &gt;
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-6">
          <div className="text-[9px] tracking-[0.3em] text-[#555]">SUMMARY</div>
          <h2 className="text-[30px] leading-tight tracking-tight text-white font-orbit mt-2">
            {DISCORD_SUMMARY.title}
          </h2>
          <div className="mt-4 h-px bg-[#222] relative">
            <div className="absolute left-0 top-[-1px] h-[3px] w-10 bg-white" />
          </div>
          <p className="text-[12px] text-[#999] leading-[1.8] max-w-[52ch] mt-4">{DISCORD_SUMMARY.pitch}</p>
          <div className="flex flex-wrap gap-x-10 gap-y-5 mt-7">
            {DISCORD_SUMMARY.stats.map((s, i) => (
              <div key={s.label}>
                <div className={`font-orbit leading-none ${i === 0 ? 'text-[20px] text-white' : 'text-[17px] text-[#00ff9d]'}`}>
                  {s.value}
                </div>
                <div className="text-[9px] tracking-[0.2em] text-[#555] mt-2">{s.label}</div>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-[#777] leading-[1.8] mt-7 max-w-[52ch] border-l-2 border-[#00ff9d] pl-4">
            {DISCORD_SUMMARY.verdict}
          </p>
          <button
            onClick={() => openWorkspace(DISCORD_SUMMARY.workspacePath)}
            className="mt-8 text-[11px] tracking-[0.2em] text-[#999] hover:text-white border-b border-[#333] hover:border-white pb-1 transition-colors"
          >
            TRY THE LIVE CHAT DEMO IN THE WORKSPACE &gt;
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-[#0a0a0a]">
      <div className="px-4 pt-4 pb-3">
        <div className="text-[9px] tracking-[0.3em] text-[#555] mb-2">// projects</div>
        <div className="flex items-baseline justify-between">
          <h2 className="text-[20px] tracking-tight text-white font-orbit">Projects</h2>
          <span className="text-[9px] tracking-[0.25em] text-[#555]">2 CATEGORIES</span>
        </div>
        <div className="mt-3 h-px bg-[#222] relative">
          <div className="absolute left-0 top-[-1px] h-[2px] w-10 bg-white" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto divide-y divide-[#161616]">
        <button
          onClick={() => openWindow('project-trading' as any)}
          className="group w-full text-left px-4 py-4 hover:bg-[#101010] transition-colors"
        >
          <div className="flex items-baseline">
            <span className="text-[16px] font-orbit text-[#bbb] group-hover:text-white transition-colors">
              Trading Research
            </span>
            <span className="ml-auto text-[10px] text-[#444] group-hover:text-white transition-colors">&gt;</span>
          </div>
          <p className="text-[10px] text-[#666] leading-relaxed mt-1">
            Ten quantitative research projects — regime classification, orderflow microstructure, grid-search
            validation. Measured results only.
          </p>
        </button>

        <button
          onClick={() => setShowDiscord(true)}
          className="group w-full text-left px-4 py-4 hover:bg-[#101010] transition-colors"
        >
          <div className="flex items-baseline">
            <span className="text-[16px] font-orbit text-[#bbb] group-hover:text-white transition-colors">
              Discord Research Bot
            </span>
            <span className="ml-auto text-[10px] text-[#444] group-hover:text-white transition-colors">&gt;</span>
          </div>
          <p className="text-[10px] text-[#666] leading-relaxed mt-1">
            Multi-AI research assistant routing questions across Claude, GPT, and Gemini — with a live chat demo.
          </p>
        </button>
      </div>

      <div className="px-4 py-3 flex justify-end">
        <button
          onClick={() => openWorkspace()}
          className="text-[10px] tracking-[0.2em] text-[#999] hover:text-white border-b border-[#333] hover:border-white pb-[2px] transition-colors"
        >
          BROWSE WORKSPACE &gt;
        </button>
      </div>
    </div>
  )
}
