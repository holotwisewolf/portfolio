'use client'

import { useState } from 'react'
import { useWindowStore } from '@/components/window-manager/useWindows'
import { projectTree } from './tree'
import { getNodeAtPath, isFolder, isFile, type TreeNode, type FolderNode } from './registry'

interface Props {
  path: string[]
}

interface RowProps {
  node: TreeNode
  basePath: string[]
  activePath: string[]
  depth: number
}

function Row({ node, basePath, activePath, depth }: RowProps) {
  const navigateWorkspace = useWindowStore((s) => s.navigateWorkspace)
  const nodePath = [...basePath, node.name]
  const isActive = JSON.stringify(nodePath) === JSON.stringify(activePath)
  const isOnActivePath = activePath.length >= nodePath.length &&
    JSON.stringify(activePath.slice(0, nodePath.length)) === JSON.stringify(nodePath)

  const [expanded, setExpanded] = useState(isOnActivePath)

  if (isFile(node)) {
    return (
      <div>
        <button
          onClick={() => navigateWorkspace(nodePath)}
          className={`w-full text-left py-[3px] px-2 text-[11px] tracking-[0.05em] transition-colors flex items-center gap-1 ${
            isActive ? 'text-[#00ff9d] bg-[#0a1a0a]' : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
          style={{ paddingLeft: `${depth * 12 + 8}px` }}
        >
          <span className="text-[#444]">{isActive ? '>' : ' '}</span>
          <span>{node.name}</span>
        </button>
      </div>
    )
  }

  const folder = node as FolderNode
  return (
    <div>
      <button
        onClick={() => {
          setExpanded(!expanded)
          navigateWorkspace(nodePath)
        }}
        className={`w-full text-left py-[3px] px-2 text-[11px] tracking-[0.05em] transition-colors flex items-center gap-1 ${
          isActive ? 'text-[#00ff9d] bg-[#0a1a0a]' : 'text-gray-400 hover:text-white hover:bg-white/5'
        }`}
        style={{ paddingLeft: `${depth * 12 + 4}px` }}
      >
        <span className="text-[#666] w-[8px]">{expanded ? '▾' : '▸'}</span>
        <span>{folder.name}/</span>
      </button>
      {expanded && folder.children.length > 0 && (
        <div>
          {folder.children.map((child) => (
            <Row
              key={child.name}
              node={child}
              basePath={nodePath}
              activePath={activePath}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default function ProjectSidebar({ path }: Props) {
  return (
    <div className="w-[220px] flex-shrink-0 border-r border-[#1c2e1c] bg-black overflow-y-auto">
      <div className="text-[9px] tracking-[0.3em] text-[#444] px-3 py-2 border-b border-[#1c2e1c]">
        EXPLORER
      </div>
      <div className="py-2">
        {projectTree.children.map((child) => (
          <Row
            key={child.name}
            node={child}
            basePath={[]}
            activePath={path}
            depth={0}
          />
        ))}
      </div>
    </div>
  )
}
