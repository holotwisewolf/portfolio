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
  // ponytail: shared button class, variant only tweaks size via parent
  const base =
    'group relative border border-[#1c2e1c] bg-[#0a0a0a] hover:border-[#00ff9d] hover:bg-[#0f1a0f] transition-colors text-left overflow-hidden'
  return (
    <button onClick={onClick} className={base}>
      {/* index marker */}
      <div className="absolute top-3 left-3 text-[9px] tracking-[0.3em] text-[#444] group-hover:text-[#00ff9d] transition-colors">
        {variant === 'top' ? '01' : variant === 'left' ? '02' : '03'}
      </div>
      {/* arrow on hover */}
      <div className="absolute top-3 right-3 text-[#444] group-hover:text-[#00ff9d] transition-colors text-[12px]">
        →
      </div>
      <div className={`flex flex-col justify-end h-full ${variant === 'top' ? 'p-8' : 'p-6'}`}>
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
    <div className="flex-1 bg-[#0a0a0a] font-orbit p-[3vh] overflow-hidden">
      {/* Grid: METHOD (tall left col) | 50px gap | right column (overview / title / results)
          METHOD spans full height; OVERVIEW top-right shifted right by the gap;
          title sits beside METHOD in the middle; RESULTS fills bottom-right.
          METHOD + OVERVIEW meet at a right angle, gap reads as triangle negative space. */}
      <div
        className="grid h-full"
        style={{
          gridTemplateColumns: 'minmax(170px, 20%) 50px 1fr',
          gridTemplateRows: '1fr auto 1.3fr',
        }}
      >
        {/* METHOD — full-height left column (tall, narrow) */}
        <div style={{ gridColumn: 1, gridRow: '1 / 4' }}>
          <HubButton
            variant="left"
            label="METHOD"
            blurb="How it works. Methodology, features, build log."
            onClick={() => go('METHOD')}
          />
        </div>

        {/* OVERVIEW — top right (shifted right by the 50px gap column) */}
        <div style={{ gridColumn: 3, gridRow: 1 }}>
          <HubButton
            variant="top"
            label="OVERVIEW"
            blurb="What it is. The pitch, the takeaways, the one-screen version."
            onClick={() => go('OVERVIEW')}
          />
        </div>

        {/* TITLE — beside METHOD, below OVERVIEW */}
        <div style={{ gridColumn: 3, gridRow: 2 }} className="flex items-center py-[1vh]">
          <div className="border border-[#1c2e1c] px-8 py-2 bg-black">
            <div className="text-[#00ff9d] text-[11px] tracking-[0.4em]">
              {projectNode.name.toUpperCase()}
            </div>
          </div>
        </div>

        {/* RESULTS — bottom right */}
        <div style={{ gridColumn: 3, gridRow: 3 }}>
          <HubButton
            variant="right"
            label="RESULTS"
            blurb="The proof. Backtests, equity curves, zone data."
            onClick={() => go('RESULTS')}
          />
        </div>
      </div>
    </div>
  )
}
