export type WindowId = 'welcome' | 'projects' | 'blog' | 'about' | 'admin' | 'terminalnav' | `project-${string}` | `blog-${string}`

export interface WindowState {
  id: WindowId
  title: string
  isOpen: boolean
  isMinimized: boolean
  isMaximized: boolean
  position: { x: number; y: number }
  size: { width: number; height: number }
  zIndex: number
  content: React.ComponentType
}

export interface WindowManagerState {
  windows: Record<WindowId, WindowState>
  activeWindow: WindowId | null
  openWindow: (id: WindowId, title: string, content: React.ComponentType) => void
  closeWindow: (id: WindowId) => void
  minimizeWindow: (id: WindowId) => void
  maximizeWindow: (id: WindowId) => void
  restoreWindow: (id: WindowId) => void
  setActiveWindow: (id: WindowId) => void
  updateWindowPosition: (id: WindowId, position: { x: number; y: number }) => void
  updateWindowSize: (id: WindowId, size: { width: number; height: number }) => void
}

const DEFAULT_POSITION = { x: 100, y: 100 }
const DEFAULT_SIZE = { width: 800, height: 600 }
const DEFAULT_Z_INDEX = 100
