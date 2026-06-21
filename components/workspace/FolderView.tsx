'use client'

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
    : folder.type === 'folder' ? 'DIRECTORY'
    : 'DIRECTORY'

  return (
    <div className="flex h-full">
      {/* LEFT — title column: DIRECTORY label on top, folder name vertically centered */}
      <div className="w-[30%] border-r border-[#1c2e1c] p-6 flex flex-col">
        <div className="text-[9px] tracking-[0.3em] text-[#444]">{folderTypeLabel}</div>
        <div className="flex-1 flex items-center">
          <div>
            <h1 className="text-[32px] sm:text-[42px] tracking-[0.05em] text-white font-orbit leading-none">
              {folder.type === 'root' ? 'projects' : folder.name}{folder.type !== 'root' && '/'}
            </h1>
            {folder.description && folder.type !== 'root' && (
              <p className="text-[11px] text-gray-500 mt-4 max-w-[280px] leading-relaxed">
                {folder.description}
              </p>
            )}
            {folder.type === 'root' && (
              <p className="text-[11px] text-gray-500 mt-4">All project categories</p>
            )}
          </div>
        </div>
        <div className="text-[9px] tracking-[0.3em] text-[#333]">
          {children.length} {children.length === 1 ? 'ENTRY' : 'ENTRIES'}
        </div>
      </div>

      {/* RIGHT — file grid (cell-style: gap on colored bg draws continuous grid lines) */}
      <div className="flex-1 p-6 overflow-auto">
        {children.length === 0 ? (
          <div className="border border-[#1c2e1c] p-6 text-gray-600 text-[12px] tracking-[0.1em]">
            EMPTY DIRECTORY
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-[1px] bg-[#1c2e1c] border border-[#1c2e1c]">
            {children.map((child) => (
              <button
                key={child.name}
                onClick={() => navigateWorkspace([...path, child.name])}
                className="text-left bg-[#0a0a0a] p-4 hover:bg-[#0f1a0f] transition-colors group min-h-[120px] flex flex-col justify-between"
              >
                <div>
                  <div className="text-[9px] tracking-[0.3em] text-[#444] group-hover:text-[#00ff9d] mb-2 transition-colors">
                    {typeIndicator(child)}
                  </div>
                  <div className="text-white text-[14px] tracking-wider group-hover:text-[#00ff9d] transition-colors">
                    {nameDisplay(child)}
                  </div>
                </div>
                <div className="text-[10px] text-gray-500 mt-3 leading-relaxed">
                  {child.description}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
