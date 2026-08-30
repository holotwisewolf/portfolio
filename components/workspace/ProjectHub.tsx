'use client'

import { useWindowStore } from '@/components/window-manager/useWindows'
import type { FolderNode } from './registry'
import { BracketHover } from './brackets'

interface Props {
  projectNode: FolderNode
  projectPath: string[]
}

// Category → folder to open (shows the entry list for that section)
const CATEGORY_TARGETS: Record<string, string[]> = {
  OVERVIEW: ['overview'],
  METHOD: ['method'],
  RESULTS: ['results'],
}

const SECTION_NUM: Record<string, string> = { OVERVIEW: '01', METHOD: '02', RESULTS: '03' }

function HubButton({
  label,
  blurb,
  variant,
  fileCount,
  onClick,
}: {
  label: string
  blurb: string
  variant: 'top' | 'left' | 'right'
  fileCount: number
  onClick: () => void
}) {
  // ponytail: shared button class, fills its positioned wrapper. No overflow-hidden — edge pixels must protrude.
  const base =
    'group relative w-full h-full block border border-white bg-[#0a0a0a] hover:border-white hover:bg-[#101010] transition-colors text-left overflow-visible'
  return (
    <button onClick={onClick} className={base}>
      <BracketHover />
      {/* giant faint section numeral */}
      <div
        className="absolute font-orbit leading-none text-[#161616] group-hover:text-[#242424] transition-colors select-none pointer-events-none"
        style={{
          fontSize: 'clamp(60px, 9vw, 130px)',
          [variant === 'right' ? 'left' : 'right']: '14px',
          [variant === 'top' ? 'top' : 'bottom']: '-6px',
        }}
      >
        {SECTION_NUM[label]}
      </div>
      {/* edge-midpoint pixels — one standout pixel centered on each border edge */}
      <span className="absolute left-1/2 -translate-x-1/2 -top-[3px] w-[6px] h-[6px] bg-white" />
      <span className="absolute left-1/2 -translate-x-1/2 -bottom-[3px] w-[6px] h-[6px] bg-white" />
      <span className="absolute top-1/2 -translate-y-1/2 -left-[3px] w-[6px] h-[6px] bg-white" />
      <span className="absolute top-1/2 -translate-y-1/2 -right-[3px] w-[6px] h-[6px] bg-white" />
      <div
        className={`relative flex flex-col h-full ${variant === 'top' ? 'p-8' : 'p-6'} ${
          variant === 'right'
            ? 'justify-start items-end text-right'
            : 'justify-end items-start text-left'
        }`}
      >
        <div className="text-[9px] tracking-[0.3em] text-[#555] group-hover:text-white mb-2 transition-colors">
          {fileCount} {fileCount === 1 ? 'FILE' : 'FILES'}
        </div>
        <div
          className={`text-white group-hover:text-white transition-colors font-orbit tracking-[0.08em] ${
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

  const countOf = (folder: string) => {
    const child = projectNode.children.find((c) => c.name === folder)
    return child && 'children' in child ? child.children.length : 0
  }

  return (
    // Absolute-positioned cascade matching the ASCII sketch. Each box steps
    // further right (23% → 36% → 57% left edges). METHOD anchors bottom-left
    // tall; OVERVIEW top indented; TITLE beside METHOD wide-short; RESULTS
    // bottom-right indented most. METHOD+OVERVIEW form the right angle.
    <div className="h-full relative bg-[#0a0a0a] font-orbit overflow-hidden dotted-bg">
      {/* OVERVIEW — top, indented right */}
      <div className="absolute" style={{ left: '23%', top: '5%', width: '67%', height: '34%' }}>
        <HubButton
          variant="top"
          label="OVERVIEW"
          blurb="What it is. The pitch, the takeaways, the one-screen version."
          fileCount={countOf('overview')}
          onClick={() => go('OVERVIEW')}
        />
      </div>

      {/* METHOD — bottom-left, tall narrow (left edge ~6%) */}
      <div className="absolute" style={{ left: '6%', top: '42%', width: '26%', height: '52%' }}>
        <HubButton
          variant="left"
          label="METHOD"
          blurb="Formulas, parameters, data pipeline."
          fileCount={countOf('method')}
          onClick={() => go('METHOD')}
        />
      </div>

      {/* TITLE — beside METHOD, below OVERVIEW, wide short */}
      <div
        className="absolute border border-[#2a2a2a] bg-black px-8 flex items-center"
        style={{ left: '34%', top: '45%', width: '40%', height: '13%' }}
      >
        <div className="text-[#00ff9d] text-[14px] tracking-[0.45em]">
          {projectNode.name.toUpperCase()}
        </div>
      </div>

      {/* RESULTS — bottom-right, indented most */}
      <div className="absolute" style={{ left: '55%', top: '64%', width: '42%', height: '30%' }}>
        <HubButton
          variant="right"
          label="RESULTS"
          blurb="Measured numbers, real-data demos, false-positive autopsies."
          fileCount={countOf('results')}
          onClick={() => go('RESULTS')}
        />
      </div>

      {/* path provenance — above the terminal bar */}
      <div className="absolute top-2 right-6 text-[8px] tracking-[0.25em] text-[#333]">
        ~/projects/{projectPath.join('/')}
      </div>
    </div>
  )
}
