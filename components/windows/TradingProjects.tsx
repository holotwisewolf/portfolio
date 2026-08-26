'use client'

// Trading project list with a summary stop: clicking a project shows its digest
// (pitch, headline real numbers, verdict) inside the window; the workspace is an
// explicit dive from there, not the default destination.

import { useState } from 'react'
import { useWindowStore } from '../window-manager/useWindows'
import { TRADING_SUMMARIES, type ProjectSummary } from './projectSummaries'

export default function TradingProjects() {
  const openWorkspace = useWindowStore((s) => s.openWorkspace)
  const [selected, setSelected] = useState<ProjectSummary | null>(null)

  const handleBrowseWorkspace = () => {
    openWorkspace(['trading'])
  }

  if (selected) {
    return (
      <div className="h-full flex flex-col bg-[#0a0a0a]">
        <div className="flex items-baseline justify-between px-4 pt-3">
          <button
            onClick={() => setSelected(null)}
            className="text-[10px] tracking-[0.2em] text-[#666] hover:text-white transition-colors"
          >
            &lt; ALL PROJECTS
          </button>
          <button
            onClick={() => openWorkspace(selected.workspacePath)}
            className="text-[10px] tracking-[0.2em] text-[#999] hover:text-white border-b border-[#333] hover:border-white pb-[2px] transition-colors"
          >
            GO TO WORKSPACE &gt;
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-6">
          <div className="text-[9px] tracking-[0.3em] text-[#555]">SUMMARY</div>
          <h2 className="text-[30px] leading-tight tracking-tight text-white font-orbit mt-2">
            {selected.title}
          </h2>
          <div className="mt-4 h-px bg-[#222] relative">
            <div className="absolute left-0 top-[-1px] h-[3px] w-10 bg-white" />
          </div>
          <p className="text-[12px] text-[#999] leading-[1.8] max-w-[52ch] mt-4">{selected.pitch}</p>

          <div className="flex flex-wrap gap-x-10 gap-y-5 mt-7">
            {selected.stats.map((s, i) => (
              <div key={s.label}>
                <div className={`font-orbit leading-none ${i === 0 ? 'text-[22px] text-white' : 'text-[18px] text-[#00ff9d]'}`}>
                  {s.value}
                </div>
                <div className="text-[9px] tracking-[0.2em] text-[#555] mt-2">{s.label}</div>
              </div>
            ))}
          </div>

          <p className="text-[11px] text-[#777] leading-[1.8] mt-7 max-w-[52ch] border-l-2 border-[#00ff9d] pl-4">
            {selected.verdict}
          </p>

          <button
            onClick={() => openWorkspace(selected.workspacePath)}
            className="mt-8 text-[11px] tracking-[0.2em] text-[#999] hover:text-white border-b border-[#333] hover:border-white pb-1 transition-colors"
          >
            OPEN THE FULL PROJECT IN THE WORKSPACE &gt;
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-[#0a0a0a]">
      <div className="px-4 pt-4 pb-3">
        <div className="text-[9px] tracking-[0.3em] text-[#555] mb-2">// trading research</div>
        <div className="flex items-baseline justify-between">
          <h2 className="text-[20px] tracking-tight text-white font-orbit">Projects</h2>
          <span className="text-[9px] tracking-[0.25em] text-[#555]">10 TOTAL</span>
        </div>
        <div className="mt-3 h-px bg-[#222] relative">
          <div className="absolute left-0 top-[-1px] h-[2px] w-10 bg-white" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="divide-y divide-[#161616]">
          {TRADING_SUMMARIES.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelected(p)}
              className="group w-full text-left px-4 py-3 hover:bg-[#101010] transition-colors flex items-baseline gap-4"
            >
              <span className="text-[14px] font-orbit text-[#bbb] group-hover:text-white transition-colors">
                {p.title}
              </span>
              <span className="text-[10px] text-[#666] leading-relaxed flex-1">{p.pitch}</span>
              <span className="text-[10px] text-[#444] group-hover:text-white transition-colors">&gt;</span>
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 py-3 flex items-center justify-between">
        <span className="text-[9px] text-[#444] tracking-[0.2em]">MEASURED RESULTS ONLY</span>
        <button
          onClick={handleBrowseWorkspace}
          className="text-[10px] tracking-[0.2em] text-[#999] hover:text-white border-b border-[#333] hover:border-white pb-[2px] transition-colors"
        >
          BROWSE WORKSPACE &gt;
        </button>
      </div>
    </div>
  )
}
