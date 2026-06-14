'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { WindowManagerState, WindowId } from '@/lib/window-state'
import Welcome from '@/components/windows/Welcome'
import Projects from '@/components/windows/Projects'
import Blog from '@/components/windows/Blog'
import About from '@/components/windows/About'
import Admin from '@/components/windows/Admin'
import TerminalNav from '@/components/windows/TerminalNav'
import Settings from '@/components/windows/Settings'
import AdvancedSettings from '@/components/windows/AdvancedSettings'
import TradingProjects from '@/components/windows/TradingProjects'
import ProjectZone from '@/components/windows/ProjectZone'
import ProjectOrderflow from '@/components/windows/ProjectOrderflow'
import ProjectVPOC from '@/components/windows/ProjectVPOC'
import ProjectIB from '@/components/windows/ProjectIB'
import ProjectHMM from '@/components/windows/ProjectHMM'
import ProjectWalkForward from '@/components/windows/ProjectWalkForward'
import ProjectSymbolic from '@/components/windows/ProjectSymbolic'
import ProjectMLConsol from '@/components/windows/ProjectMLConsol'
import ProjectOrderflowViz from '@/components/windows/ProjectOrderflowViz'
import ProjectNeutralCandle from '@/components/windows/ProjectNeutralCandle'
import ProjectDiscord from '@/components/windows/ProjectDiscord'

// Re-export WindowId type for use in other components
export type { WindowId }

// Window content registry - stores the component for each window ID
const windowContentRegistry = new Map<WindowId, React.ComponentType>()

// Register all window contents
windowContentRegistry.set('welcome', Welcome)
windowContentRegistry.set('projects', Projects)
windowContentRegistry.set('blog', Blog)
windowContentRegistry.set('about', About)
windowContentRegistry.set('admin', Admin)
windowContentRegistry.set('terminalnav', TerminalNav)
windowContentRegistry.set('settings', Settings)
windowContentRegistry.set('advanced-physics-settings', AdvancedSettings)
windowContentRegistry.set('project-trading', TradingProjects)
windowContentRegistry.set('project-zone', ProjectZone)
windowContentRegistry.set('project-orderflow', ProjectOrderflow)
windowContentRegistry.set('project-vpoc', ProjectVPOC)
windowContentRegistry.set('project-ib', ProjectIB)
windowContentRegistry.set('project-hmm', ProjectHMM)
windowContentRegistry.set('project-walkforward', ProjectWalkForward)
windowContentRegistry.set('project-symbolic', ProjectSymbolic)
windowContentRegistry.set('project-ml-consol', ProjectMLConsol)
windowContentRegistry.set('project-of-viz', ProjectOrderflowViz)
windowContentRegistry.set('project-neutral', ProjectNeutralCandle)
windowContentRegistry.set('project-discord', ProjectDiscord)

export function registerWindowContent(id: WindowId, component: React.ComponentType) {
  windowContentRegistry.set(id, component)
}

export { windowContentRegistry }

interface WindowState {
  id: WindowId
  title: string
  isOpen: boolean
  isMinimized: boolean
  isMaximized: boolean
  position: { x: number; y: number }
  size: { width: number; height: number }
  zIndex: number
  isLoading: boolean
  loadProgress: number
}

interface WindowStore {
  windows: Record<string, WindowState>
  activeWindow: WindowId | null
  maxZIndex: number
  activeWorkspace: boolean
  workspacePath: string[]
  workspaceTransitioning: boolean
  openWindow: (id: WindowId) => void
  closeWindow: (id: WindowId) => void
  minimizeWindow: (id: WindowId) => void
  maximizeWindow: (id: WindowId) => void
  restoreWindow: (id: WindowId) => void
  setActiveWindow: (id: WindowId) => void
  updateWindowPosition: (id: WindowId, position: { x: number; y: number }) => void
  updateWindowSize: (id: WindowId, size: { width: number; height: number }) => void
  updateLoadProgress: (id: WindowId, progress: number) => void
  setLoadingComplete: (id: WindowId) => void
  openWorkspace: (initialPath?: string[]) => void
  closeWorkspace: () => void
  navigateWorkspace: (path: string[]) => void
  completeWorkspaceTransition: () => void
}

export const useWindowStore = create<WindowStore>()(
  persist(
    (set, get) => ({
      windows: {},
      activeWindow: null,
      maxZIndex: 100,
      activeWorkspace: false,
      workspacePath: [],
      workspaceTransitioning: false,

      openWindow: (id) => {
        const content = windowContentRegistry.get(id)
        if (!content) return

        set((state) => {
          const existing = state.windows[id]
          const newZIndex = state.maxZIndex + 100

          if (existing) {
            // Validate existing window data
            const validPosition = {
              x: isNaN(existing.position.x) ? 100 : existing.position.x,
              y: isNaN(existing.position.y) ? 100 : existing.position.y
            }
            const validSize = {
              width: isNaN(existing.size.width) ? 800 : Math.max(400, existing.size.width),
              height: isNaN(existing.size.height) ? 600 : Math.max(300, existing.size.height)
            }

            return {
              windows: {
                ...state.windows,
                [id]: {
                  ...existing,
                  position: validPosition,
                  size: validSize,
                  isOpen: true,
                  isMinimized: false,
                  zIndex: newZIndex,
                  isLoading: existing.isLoading ?? true,
                  loadProgress: existing.loadProgress ?? 0,
                },
              },
              activeWindow: id,
              maxZIndex: newZIndex,
            }
          }

          const windowCount = Object.keys(state.windows).length
          const position = {
            x: 100 + (windowCount * 30) % 300,
            y: 100 + (windowCount * 30) % 200,
          }

          // Custom sizes for specific windows
          const customSize = id === 'terminalnav' ? { width: 450, height: 400 } : { width: 800, height: 600 }
          const customTitle = id === 'terminalnav' ? 'Terminal' : id.charAt(0).toUpperCase() + id.slice(1)

          return {
            windows: {
              ...state.windows,
              [id]: {
                id,
                title: customTitle,
                isOpen: true,
                isMinimized: false,
                isMaximized: false,
                position,
                size: customSize,
                zIndex: newZIndex,
                isLoading: true,
                loadProgress: 0,
              },
            },
            activeWindow: id,
            maxZIndex: newZIndex,
          }
        })
      },

      closeWindow: (id) => {
        set((state) => ({
          windows: {
            ...state.windows,
            [id]: {
              ...state.windows[id],
              isOpen: false,
              isMinimized: false,
              isMaximized: false,
            },
          },
          activeWindow: state.activeWindow === id ? null : state.activeWindow,
        }))
      },

      minimizeWindow: (id) => {
        set((state) => ({
          windows: {
            ...state.windows,
            [id]: {
              ...state.windows[id],
              isMinimized: true,
            },
          },
          activeWindow: state.activeWindow === id ? null : state.activeWindow,
        }))
      },

      maximizeWindow: (id) => {
        set((state) => ({
          windows: {
            ...state.windows,
            [id]: {
              ...state.windows[id],
              isMaximized: !state.windows[id]?.isMaximized,
            },
          },
        }))
      },

      restoreWindow: (id) => {
        set((state) => {
          const newZIndex = state.maxZIndex + 100
          return {
            windows: {
              ...state.windows,
              [id]: {
                ...state.windows[id],
                isMinimized: false,
                zIndex: newZIndex,
              },
            },
            activeWindow: id,
            maxZIndex: newZIndex,
          }
        })
      },

      setActiveWindow: (id) => {
        set((state) => {
          const newZIndex = state.maxZIndex + 100
          return {
            windows: {
              ...state.windows,
              [id]: {
                ...state.windows[id],
                zIndex: newZIndex,
              },
            },
            activeWindow: id,
            maxZIndex: newZIndex,
          }
        })
      },

      updateWindowPosition: (id, position) => {
        set((state) => ({
          windows: {
            ...state.windows,
            [id]: {
              ...state.windows[id],
              position,
            },
          },
        }))
      },

      updateWindowSize: (id, size) => {
        set((state) => ({
          windows: {
            ...state.windows,
            [id]: {
              ...state.windows[id],
              size: {
                width: Math.max(400, size.width),
                height: Math.max(300, size.height),
              },
            },
          },
        }))
      },

      updateLoadProgress: (id, progress) => {
        set((state) => ({
          windows: {
            ...state.windows,
            [id]: {
              ...state.windows[id],
              loadProgress: Math.min(100, Math.max(0, progress)),
            },
          },
        }))
      },

      setLoadingComplete: (id) => {
        set((state) => ({
          windows: {
            ...state.windows,
            [id]: {
              ...state.windows[id],
              isLoading: false,
              loadProgress: 100,
            },
          },
        }))
      },

      openWorkspace: (initialPath) => {
        set({
          workspaceTransitioning: true,
          workspacePath: initialPath ?? [],
        })
      },

      completeWorkspaceTransition: () => {
        set({
          workspaceTransitioning: false,
          activeWorkspace: true,
        })
      },

      closeWorkspace: () => {
        set({
          activeWorkspace: false,
          workspaceTransitioning: false,
          workspacePath: [],
        })
      },

      navigateWorkspace: (path) => {
        set({ workspacePath: path })
      },
    }),
    {
      name: 'window-state',
      partialize: (state) => ({
        windows: state.windows,
        activeWindow: state.activeWindow,
        // Don't persist maxZIndex - recalculate on each session
      }),
      onRehydrateStorage: () => (state) => {
        // Validate and fix corrupted data from localStorage
        if (state?.windows) {
          Object.keys(state.windows).forEach(id => {
            const win = state.windows[id]
            if (win) {
              // Fix NaN positions
              if (isNaN(win.position.x) || isNaN(win.position.y)) {
                win.position = { x: 100, y: 100 }
              }
              // Fix NaN sizes
              if (isNaN(win.size.width) || isNaN(win.size.height)) {
                win.size = { width: 800, height: 600 }
              }
              // Ensure minimum sizes
              win.size.width = Math.max(400, win.size.width)
              win.size.height = Math.max(300, win.size.height)
            }
          })
        }
      },
    }
  )
)

export const WindowProvider = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>
}
