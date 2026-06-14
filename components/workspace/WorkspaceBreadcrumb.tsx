'use client'

import { useWindowStore } from '@/components/window-manager/useWindows'

interface Props {
  path: string[]
  onExit: () => void
}

export default function WorkspaceBreadcrumb({ path, onExit }: Props) {
  const navigateWorkspace = useWindowStore((s) => s.navigateWorkspace)

  const segments = ['projects', ...path]

  return (
    <div className="border-b border-[#1c2e1c] bg-black flex items-center justify-between px-4 h-[36px] flex-shrink-0">
      <div className="flex items-center gap-1 text-[12px] tracking-[0.1em] overflow-x-auto whitespace-nowrap">
        <span className="text-[#555]">~</span>
        <span className="text-[#555]">/</span>
        {segments.map((seg, i) => {
          const isLast = i === segments.length - 1
          const targetPath = segments.slice(1, i + 1)
          return (
            <span key={i} className="flex items-center gap-1">
              <button
                onClick={() => !isLast && navigateWorkspace(targetPath)}
                disabled={isLast}
                className={`${
                  isLast ? 'text-[#00ff9d] cursor-default' : 'text-gray-400 hover:text-white cursor-pointer'
                } transition-colors`}
              >
                {seg}
              </button>
              {!isLast && <span className="text-[#555]">/</span>}
            </span>
          )
        })}
      </div>

      <button
        onClick={onExit}
        className="text-[10px] tracking-[0.3em] text-[#666] hover:text-[#00ff9d] border border-[#1c2e1c] hover:border-[#00ff9d] px-2 py-1 transition-colors flex-shrink-0 ml-4"
      >
        [ESC] EXIT
      </button>
    </div>
  )
}
