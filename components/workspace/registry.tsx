import type { ComponentType } from 'react'

export type NodeType = 'root' | 'category' | 'project' | 'folder' | 'file'

export interface FileNode {
  type: 'file'
  name: string
  description: string
  component?: ComponentType
}

export interface FolderNode {
  type: 'root' | 'category' | 'project' | 'folder'
  name: string
  description: string
  children: Array<FileNode | FolderNode>
}

export type TreeNode = FileNode | FolderNode

export const isFolder = (n: TreeNode): n is FolderNode =>
  n.type === 'root' || n.type === 'category' || n.type === 'project' || n.type === 'folder'

export const isFile = (n: TreeNode): n is FileNode => n.type === 'file'

export function getNodeAtPath(root: FolderNode, path: string[]): TreeNode | null {
  if (path.length === 0) return root
  let current: TreeNode = root
  for (const segment of path) {
    if (!isFolder(current)) return null
    const next: TreeNode | undefined = current.children.find((c: TreeNode) => c.name === segment)
    if (!next) return null
    current = next
  }
  return current
}

export function getParentPath(path: string[]): string[] {
  return path.slice(0, -1)
}

export function getPathLabel(path: string[]): string {
  if (path.length === 0) return '~/projects/'
  return `~/projects/${path.join('/')}/`
}
