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
    <div className="p-8">
      <div className="text-[10px] tracking-[0.3em] text-[#444] mb-2">{folderTypeLabel}</div>
      <h1 className="text-3xl tracking-wider text-white mb-2">
        {folder.type === 'root' ? 'projects' : folder.name}{folder.type !== 'root' && '/'}
      </h1>
      {folder.description && folder.type !== 'root' && (
        <p className="text-[12px] text-gray-500 mb-8">{folder.description}</p>
      )}
      {folder.type === 'root' && (
        <p className="text-[12px] text-gray-500 mb-8">All project categories</p>
      )}

      {children.length === 0 ? (
        <div className="border border-[#1c2e1c] p-6 text-gray-600 text-[12px] tracking-[0.1em]">
          EMPTY DIRECTORY
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-[2px]">
          {children.map((child) => (
            <button
              key={child.name}
              onClick={() => navigateWorkspace([...path, child.name])}
              className="text-left border border-[#1c2e1c] p-4 hover:bg-[#0f1a0f] transition-colors group min-h-[110px] flex flex-col justify-between"
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
  )
}
