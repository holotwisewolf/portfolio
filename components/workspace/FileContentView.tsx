'use client'

import { useState } from 'react'
import { projectTree } from './tree'
import { getNodeAtPath, isFile, isFolder } from './registry'
import FolderView from './FolderView'
import ProjectHub from './ProjectHub'

interface Props {
  path: string[]
}

// Status pop-up for the results directory home: compact corner card, uniform
// white border with a heavy RIGHT edge, blinking red mark, hard offset shadow.
// Click collapses the text into the right side, leaving just the blinking mark.
function ResultsStatusBar() {
  const [open, setOpen] = useState(true)
  return (
    <button
      onClick={() => setOpen(!open)}
      title="MEASURED RESULTS ONLY · EVERY POSITIVE CARRIES ITS COUNTER-ARGUMENT"
      className="absolute top-4 right-4 z-30 zc-rise flex items-center gap-3 border border-white border-r-[3px] bg-black/90 py-[7px] pl-3 pr-2 shadow-[4px_4px_0_#000] max-w-[75%]"
    >
      <span
        className={`text-[8px] tracking-[0.25em] text-white leading-relaxed whitespace-nowrap overflow-hidden transition-all duration-300 ${
          open ? 'max-w-[440px] opacity-100' : 'max-w-0 opacity-0'
        }`}
      >
        MEASURED RESULTS ONLY · EVERY POSITIVE CARRIES ITS COUNTER-ARGUMENT
      </span>
      <span className="w-[9px] h-[9px] border border-[#ef4444] flex items-center justify-center flex-shrink-0">
        <span className="w-[3px] h-[3px] bg-[#ef4444] blink-dot" />
      </span>
    </button>
  )
}

export default function FileContentView({ path }: Props) {
  const node = getNodeAtPath(projectTree, path)

  if (!node) {
    return (
      <div className="flex-1 p-6 text-[#777] text-[12px]">
        404 — path not found: {path.join('/')}
      </div>
    )
  }

  const isResultsDir = isFolder(node) && path[path.length - 1] === 'results'

  if (isFile(node) && node.component) {
    const Component = node.component
    return (
      <div className="absolute inset-0 overflow-y-auto dotted-bg">
        <Component />
      </div>
    )
  }

  if (isFile(node) && !node.component) {
    return (
      <div className="flex-1 p-6 text-[#777] text-[12px]">
        File has no content (component not registered): {node.name}
      </div>
    )
  }

  if (isFolder(node)) {
    // Project nodes get the hub layout; other folders get the tile grid
    if (node.type === 'project' && path.length > 0) {
      return (
        <div className="absolute inset-0">
          <ProjectHub projectNode={node} projectPath={path} />
        </div>
      )
    }
    return (
      <div className="absolute inset-0">
        <div className="absolute inset-0 overflow-y-auto dotted-bg">
          <FolderView path={path} />
        </div>
        {isResultsDir && <ResultsStatusBar />}
      </div>
    )
  }

  return null
}
