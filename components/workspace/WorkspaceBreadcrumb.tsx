'use client'

// Path line: inline segments with green separators, no boxes. Last segment
// underlines green (you-are-here), exit is bare text that turns green on hover.

import { useWindowStore } from '@/components/window-manager/useWindows'

interface Props {
  path: string[]
  onExit: () => void
}

export default function WorkspaceBreadcrumb({ path, onExit }: Props) {
  const navigateWorkspace = useWindowStore((s) => s.navigateWorkspace)

  const segments = ['projects', ...path]

  return (
    <div className="flex items-center justify-between px-5 h-[38px] flex-shrink-0">
      <div className="flex items-baseline gap-[6px] text-[12px] tracking-[0.08em] overflow-x-auto whitespace-nowrap">
        <span className="text-[#555]">~</span>
        {segments.map((seg, i) => {
          const isLast = i === segments.length - 1
          const targetPath = segments.slice(1, i + 1)
          return (
            <span key={i} className="flex items-baseline gap-[6px]">
              <span className="text-[#00ff9d] text-[11px]">/</span>
              <button
                onClick={() => !isLast && navigateWorkspace(targetPath)}
                disabled={isLast}
                className={`transition-colors ${
                  isLast
                    ? 'text-white border-b border-[#00ff9d] pb-[2px] cursor-default'
                    : 'text-[#777] hover:text-white cursor-pointer'
                }`}
              >
                {seg}
              </button>
            </span>
          )
        })}
      </div>

      <button
        onClick={onExit}
        className="text-[10px] tracking-[0.3em] text-[#555] hover:text-[#00ff9d] transition-colors flex-shrink-0 ml-5"
      >
        [ESC] EXIT
      </button>
    </div>
  )
}
