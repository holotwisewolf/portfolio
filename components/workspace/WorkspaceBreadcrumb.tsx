'use client'

import { useWindowStore } from '@/components/window-manager/useWindows'

interface Props {
  path: string[]
  onExit: () => void
}

export default function WorkspaceBreadcrumb({ path, onExit }: Props) {
  const navigateWorkspace = useWindowStore((s) => s.navigateWorkspace)
  const isAtRoot = path.length === 0
  const parentPath = path.slice(0, -1)

  const segments = ['projects', ...path]

  return (
    <div className="border-b border-[#1c2e1c] bg-black flex items-center justify-between px-3 h-[36px] flex-shrink-0 gap-3">
      <div className="flex items-center gap-2 min-w-0">
        <button
          onClick={() => !isAtRoot && navigateWorkspace(parentPath)}
          disabled={isAtRoot}
          className={`text-[12px] tracking-[0.1em] px-1 transition-colors flex-shrink-0 ${
            isAtRoot
              ? 'text-[#333] cursor-default'
              : 'text-[#00ff9d] hover:text-white border border-[#1c2e1c] hover:border-[#00ff9d] h-[22px] flex items-center'
          }`}
          title={isAtRoot ? 'At root' : 'Back to parent'}
        >
          {isAtRoot ? '[~]' : '< BACK'}
        </button>

        <div className="flex items-center gap-1 text-[12px] tracking-[0.1em] overflow-x-auto whitespace-nowrap min-w-0">
          <span className="text-[#555]">~/</span>
          {segments.map((seg, i) => {
            const isLast = i === segments.length - 1
            const targetPath = segments.slice(1, i + 1)
            return (
              <span key={i} className="flex items-center gap-1 flex-shrink-0">
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
      </div>

      <button
        onClick={onExit}
        className="text-[10px] tracking-[0.3em] text-[#666] hover:text-[#00ff9d] border border-[#1c2e1c] hover:border-[#00ff9d] px-2 py-1 transition-colors flex-shrink-0"
      >
        [ESC] EXIT
      </button>
    </div>
  )
}
