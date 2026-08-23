'use client'

import { projectTree } from './tree'
import { getNodeAtPath, isFile, isFolder } from './registry'
import FolderView from './FolderView'
import ProjectHub from './ProjectHub'

interface Props {
  path: string[]
}

export default function FileContentView({ path }: Props) {
  const node = getNodeAtPath(projectTree, path)

  if (!node) {
    return (
      <div className="flex-1 p-6 text-gray-500 text-[12px]">
        404 — path not found: {path.join('/')}
      </div>
    )
  }

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
      <div className="flex-1 p-6 text-gray-500 text-[12px]">
        File has no content (component not registered): {node.name}
      </div>
    )
  }

  if (isFolder(node)) {
    // Project nodes get the hub layout; other folders get the tile grid
    if (node.type === 'project' && path.length > 0) {
      return <ProjectHub projectNode={node} projectPath={path} />
    }
    return (
      <div className="absolute inset-0 overflow-y-auto dotted-bg">
        <FolderView path={path} />
      </div>
    )
  }

  return null
}
