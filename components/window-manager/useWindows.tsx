'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { WindowManagerState, WindowId } from '@/lib/window-state'

// Window content registry - stores the component for each window ID
const windowContentRegistry = new Map<WindowId, React.ComponentType>()

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
}

export const useWindowStore = create<WindowStore>()(
  persist(
    (set, get) => ({
      windows: {},
      activeWindow: null,
      maxZIndex: 100,

      openWindow: (id) => {
        const content = windowContentRegistry.get(id)
        if (!content) return

        set((state) => {
          const existing = state.windows[id]
          const newZIndex = state.maxZIndex + 100

          if (existing) {
            return {
              windows: {
                ...state.windows,
                [id]: {
                  ...existing,
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
    }),
    {
      name: 'window-state',
    }
  )
)

export const WindowProvider = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>
}
