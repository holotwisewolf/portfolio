'use client'

import { useState, useEffect } from 'react'
import { useWindowStore } from '@/components/window-manager/useWindows'
import { projectTree } from './tree'
import { isFolder, isFile, type TreeNode, type FolderNode } from './registry'

interface Props {
  path: string[]
}

interface RowProps {
  node: TreeNode
  basePath: string[]
  activePath: string[]
  depth: number
  onSelect?: () => void
}

function Row({ node, basePath, activePath, depth, onSelect }: RowProps) {
  const navigateWorkspace = useWindowStore((s) => s.navigateWorkspace)
  const nodePath = [...basePath, node.name]
  const isActive = JSON.stringify(nodePath) === JSON.stringify(activePath)
  const isOnActivePath = activePath.length >= nodePath.length &&
    JSON.stringify(activePath.slice(0, nodePath.length)) === JSON.stringify(nodePath)

  const [expanded, setExpanded] = useState(isOnActivePath)

  // Auto-expand folders when they land on the active path (after navigation),
  // so the explorer traversal follows clicks. Doesn't force-collapse when
  // navigating away — manually opened folders stay open.
  useEffect(() => {
    if (isOnActivePath) setExpanded(true)
  }, [isOnActivePath])

  if (isFile(node)) {
    return (
      <button
        onClick={() => {
          navigateWorkspace(nodePath)
          onSelect?.()
        }}
        className={`w-full text-left py-[3px] px-2 text-[11px] tracking-[0.05em] transition-colors flex items-center gap-1 ${
          isActive ? 'text-[#00ff9d] bg-[#0a1a0a]' : 'text-gray-400 hover:text-white hover:bg-white/5'
        }`}
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
      >
        <span className="text-[#444]">{isActive ? '>' : ' '}</span>
        <span>{node.name}</span>
      </button>
    )
  }

  const folder = node as FolderNode
  return (
    <div>
      <button
        onClick={() => {
          setExpanded(!expanded)
          navigateWorkspace(nodePath)
          onSelect?.()
        }}
        className={`w-full text-left py-[3px] px-2 text-[11px] tracking-[0.05em] transition-colors flex items-center gap-1 ${
          isActive ? 'text-[#00ff9d] bg-[#0a1a0a]' : 'text-gray-400 hover:text-white hover:bg-white/5'
        }`}
        style={{ paddingLeft: `${depth * 12 + 4}px` }}
      >
        <span className="text-[#666] w-[8px]">{expanded ? 'v' : '>'}</span>
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
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default function ProjectSidebar({ path }: Props) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  if (isMobile) {
    return (
      <>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="w-full border-b border-[#1c1c1c] bg-black px-3 py-2 text-left text-[10px] tracking-[0.3em] text-[#999] hover:text-white transition-colors"
        >
          {mobileOpen ? '[x] CLOSE EXPLORER' : '> OPEN EXPLORER'}
        </button>
        {mobileOpen && (
          <div className="border-b border-[#1c1c1c] bg-black max-h-[300px] overflow-y-auto">
            <div className="text-[9px] tracking-[0.3em] text-[#444] px-3 py-2 border-b border-[#1c1c1c]">
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
                  onSelect={() => setMobileOpen(false)}
                />
              ))}
            </div>
          </div>
        )}
      </>
    )
  }

  return (
    <div className="w-[220px] flex-shrink-0 border-r border-[#1c1c1c] bg-black overflow-y-auto">
      <div className="text-[9px] tracking-[0.3em] text-[#444] px-3 py-2 border-b border-[#1c1c1c]">
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
