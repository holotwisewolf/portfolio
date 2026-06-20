'use client'

import { useWindowStore } from '@/components/window-manager/useWindows'
import type { FolderNode } from './registry'

interface Props {
  projectNode: FolderNode
  projectPath: string[]
}

// Category → first file to open when clicked (tree gets reorganized into real folders later)
const CATEGORY_TARGETS: Record<string, string[]> = {
  OVERVIEW: ['README.md'],
  METHOD: ['METHODOLOGY.md'],
  RESULTS: ['results', 'equity-curve'],
}

function HubButton({
  label,
  blurb,
  variant,
  onClick,
}: {
  label: string
  blurb: string
  variant: 'top' | 'left' | 'right'
  onClick: () => void
}) {
  // ponytail: shared button class, fills its positioned wrapper
  const base =
    'group relative w-full h-full block border border-[#1c2e1c] bg-[#0a0a0a] hover:border-[#00ff9d] hover:bg-[#0f1a0f] transition-colors text-left overflow-hidden'
  return (
    <button onClick={onClick} className={base}>
      {/* index marker */}
      <div className="absolute top-3 left-3 text-[9px] tracking-[0.3em] text-[#444] group-hover:text-[#00ff9d] transition-colors">
        {variant === 'top' ? '01' : variant === 'left' ? '02' : '03'}
      </div>
      {/* edge-midpoint pixels — one standout pixel centered on each border edge */}
      <span className="absolute left-1/2 -translate-x-1/2 -top-[3px] w-[6px] h-[6px] bg-[#00ff9d]" />
      <span className="absolute left-1/2 -translate-x-1/2 -bottom-[3px] w-[6px] h-[6px] bg-[#00ff9d]" />
      <span className="absolute top-1/2 -translate-y-1/2 -left-[3px] w-[6px] h-[6px] bg-[#00ff9d]" />
      <span className="absolute top-1/2 -translate-y-1/2 -right-[3px] w-[6px] h-[6px] bg-[#00ff9d]" />
      <div
        className={`flex flex-col h-full ${variant === 'top' ? 'p-8' : 'p-6'} ${
          variant === 'right'
            ? 'justify-start items-end text-right'
            : 'justify-end items-start text-left'
        }`}
      >
        <div
          className={`text-white group-hover:text-[#00ff9d] transition-colors font-orbit tracking-[0.1em] ${
            variant === 'top' ? 'text-[28px] sm:text-[36px]' : 'text-[22px] sm:text-[28px]'
          }`}
        >
          {label}
        </div>
        <div className="text-[#666] text-[11px] tracking-[0.15em] mt-2 leading-relaxed">{blurb}</div>
      </div>
    </button>
  )
}

export default function ProjectHub({ projectNode, projectPath }: Props) {
  const navigate = useWindowStore((s) => s.navigateWorkspace)

  const go = (category: keyof typeof CATEGORY_TARGETS) => {
    navigate([...projectPath, ...CATEGORY_TARGETS[category]])
  }

  return (
    // Absolute-positioned cascade matching the ASCII sketch. Each box steps
    // further right (23% → 36% → 57% left edges). METHOD anchors bottom-left
    // tall; OVERVIEW top indented; TITLE beside METHOD wide-short; RESULTS
    // bottom-right indented most. METHOD+OVERVIEW form the right angle.
    <div className="flex-1 relative bg-[#0a0a0a] font-orbit overflow-hidden">
      {/* OVERVIEW — top, indented right (~23% left edge, 5% narrower from right) */}
      <div className="absolute" style={{ left: '23%', top: '7%', width: '67%', height: '34%' }}>
        <HubButton
          variant="top"
          label="OVERVIEW"
          blurb="What it is. The pitch, the takeaways, the one-screen version."
          onClick={() => go('OVERVIEW')}
        />
      </div>

      {/* METHOD — bottom-left, tall narrow (left edge ~6%) */}
      <div className="absolute" style={{ left: '6%', top: '44%', width: '26%', height: '52%' }}>
        <HubButton
          variant="left"
          label="METHOD"
          blurb="Methodology, features, build log."
          onClick={() => go('METHOD')}
        />
      </div>

      {/* TITLE — beside METHOD, below OVERVIEW, wide short (left edge ~36%) */}
      <div
        className="absolute border border-[#1c2e1c] bg-black px-8 flex items-center"
        style={{ left: '34%', top: '47%', width: '52%', height: '13%' }}
      >
        <div className="text-[#00ff9d] text-[14px] tracking-[0.45em]">
          {projectNode.name.toUpperCase()}
        </div>
      </div>

      {/* RESULTS — bottom-right, indented most (left edge ~55%, ~5% wider) */}
      <div className="absolute" style={{ left: '55%', top: '66%', width: '42%', height: '30%' }}>
        <HubButton
          variant="right"
          label="RESULTS"
          blurb="Backtests, equity curves, zone data."
          onClick={() => go('RESULTS')}
        />
      </div>
    </div>
  )
}
