'use client'

import create from 'zustand'
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
}

interface WindowStore {
  windows: Record<string, WindowState>
  activeWindow: WindowId | null
  openWindow: (id: WindowId) => void
  closeWindow: (id: WindowId) => void
  minimizeWindow: (id: WindowId) => void
  maximizeWindow: (id: WindowId) => void
  restoreWindow: (id: WindowId) => void
  setActiveWindow: (id: WindowId) => void
  updateWindowPosition: (id: WindowId, position: { x: number; y: number }) => void
}

export const useWindowStore = create<WindowStore>()(
  persist(
    (set, get) => ({
      windows: {},
      activeWindow: null,

      openWindow: (id) => {
        const content = windowContentRegistry.get(id)
        if (!content) return

        set((state) => {
          const existing = state.windows[id]
          const zIndex = (Object.keys(state.windows).length + 1) * 100

          if (existing) {
            return {
              windows: {
                ...state.windows,
                [id]: {
                  ...existing,
                  isOpen: true,
                  isMinimized: false,
                  zIndex,
                },
              },
              activeWindow: id,
            }
          }

          const windowCount = Object.keys(state.windows).length
          const position = {
            x: 100 + (windowCount * 30) % 300,
            y: 100 + (windowCount * 30) % 200,
          }

          return {
            windows: {
              ...state.windows,
              [id]: {
                id,
                title: id.charAt(0).toUpperCase() + id.slice(1),
                isOpen: true,
                isMinimized: false,
                isMaximized: false,
                position,
                size: { width: 800, height: 600 },
                zIndex,
              },
            },
            activeWindow: id,
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
          const zIndex = (Object.keys(state.windows).length + 1) * 100
          return {
            windows: {
              ...state.windows,
              [id]: {
                ...state.windows[id],
                isMinimized: false,
                zIndex,
              },
            },
            activeWindow: id,
          }
        })
      },

      setActiveWindow: (id) => {
        set((state) => {
          const zIndex = (Object.keys(state.windows).length + 1) * 100
          return {
            windows: {
              ...state.windows,
              [id]: {
                ...state.windows[id],
                zIndex,
              },
            },
            activeWindow: id,
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
    }),
    {
      name: 'window-state',
    }
  )
)

export const WindowProvider = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>
}
