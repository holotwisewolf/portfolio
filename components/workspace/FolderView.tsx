'use client'

// Folder landing typeset like a chapter opener: the folder name is the display
// anchor (huge, wrapping), the entry count a faint oversized numeral, and the
// entries run as a featured-first list with corner-bracket hovers instead of tiles.

import { useWindowStore } from '@/components/window-manager/useWindows'
import { projectTree } from './tree'
import { getNodeAtPath, isFolder, type TreeNode, type FolderNode } from './registry'

interface Props {
  path: string[]
}

function typeIndicator(node: TreeNode): string {
  if (node.type === 'category') return '[DIR]'
  if (node.type === 'project') return '[PROJ]'
  if (node.type === 'folder') return '[DIR]'
  if (node.type === 'file') return '[FILE]'
  return '[DIR]'
}

function nameDisplay(node: TreeNode): string {
  return isFolder(node) ? `${node.name}/` : node.name
}

// corner brackets revealed on hover — the entry "selects" like a print crop mark
function BracketHover() {
  return (
    <>
      <span className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#00ff9d] opacity-0 group-hover:opacity-100 transition-opacity" />
      <span className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#00ff9d] opacity-0 group-hover:opacity-100 transition-opacity" />
      <span className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[#00ff9d] opacity-0 group-hover:opacity-100 transition-opacity" />
      <span className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#00ff9d] opacity-0 group-hover:opacity-100 transition-opacity" />
    </>
  )
}

export default function FolderView({ path }: Props) {
  const navigateWorkspace = useWindowStore((s) => s.navigateWorkspace)
  const node = getNodeAtPath(projectTree, path)

  if (!node || !isFolder(node)) return null

  const folder = node as FolderNode
  const children = folder.children

  const folderTypeLabel =
    folder.type === 'root' ? 'ROOT DIRECTORY'
    : folder.type === 'category' ? 'CATEGORY'
    : folder.type === 'project' ? 'PROJECT'
    : 'DIRECTORY'

  const name = folder.type === 'root' ? 'projects' : folder.name

  return (
    <div className="px-8 py-10 max-w-[1200px] zc-rise">
      {/* chapter opener */}
      <div className="text-[9px] tracking-[0.3em] text-[#555]">{folderTypeLabel}</div>
      <h1 className="text-[56px] md:text-[80px] leading-[0.95] tracking-tight text-white mt-3 font-orbit break-words">
        {name}
        {folder.type !== 'root' && <span className="text-[#333]">/</span>}
      </h1>
      <div className="mt-6 h-px bg-[#222] w-full relative">
        <div className="absolute left-0 top-[-1px] h-[3px] w-16 bg-white" />
      </div>

      <div className="mt-10 md:flex gap-14 items-start">
        {/* margin column: description + huge faint count */}
        <div className="md:w-[220px] flex-shrink-0 mb-8 md:mb-0">
          <p className="text-[11px] text-[#777] leading-[1.8] max-w-[240px]">
            {folder.type === 'root' ? 'All project categories.' : folder.description}
          </p>
          <div className="mt-6">
            <div className="font-orbit leading-none text-[#1e1e1e] text-[96px] select-none">
              {children.length}
            </div>
            <div className="text-[9px] tracking-[0.25em] text-[#555] -mt-2">
              {children.length === 1 ? 'ENTRY' : 'ENTRIES'}
            </div>
          </div>
        </div>

        {/* entries — featured first, then the rest */}
        <div className="flex-1 min-w-0">
          {children.length === 0 ? (
            <div className="grid grid-cols-3 gap-6 pt-4">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="h-24 border border-dashed border-[#1a1a1a]" />
              ))}
            </div>
          ) : (
            <div className="divide-y divide-[#161616]">
              {children.map((child, i) => {
                const featured = i === 0
                return (
                  <button
                    key={child.name}
                    onClick={() => navigateWorkspace([...path, child.name])}
                    className={`group relative w-full text-left hover:bg-[#0e120e] transition-colors flex items-baseline gap-5 ${
                      featured ? 'py-6' : 'py-4'
                    } px-2 -mx-2`}
                  >
                    <BracketHover />
                    <span
                      className={`text-[9px] tracking-[0.25em] flex-shrink-0 ${
                        featured ? 'text-[#777]' : 'text-[#444]'
                      }`}
                    >
                      {typeIndicator(child)}
                    </span>
                    <span className="min-w-0">
                      <span
                        className={`block font-orbit tracking-wide text-white group-hover:text-[#00ff9d] transition-colors ${
                          featured ? 'text-[22px]' : 'text-[15px]'
                        }`}
                      >
                        {nameDisplay(child)}
                      </span>
                      <span className={`block text-[#666] leading-relaxed ${featured ? 'text-[11px] mt-1' : 'text-[10px]'}`}>
                        {child.description}
                      </span>
                    </span>
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
