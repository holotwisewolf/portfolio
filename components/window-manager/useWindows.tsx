'use client'

import create from 'zustand'
import { persist } from 'zustand/middleware'
import type { WindowManagerState, WindowId, WindowState } from '@/lib/window-state'

const initialWindows: Record<string, WindowState> = {
  welcome: {
    id: 'welcome',
    title: 'Welcome',
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    position: { x: 200, y: 100 },
    size: { width: 600, height: 400 },
    zIndex: 100,
    content: null as any,
  },
}

interface WindowStore extends Omit<WindowManagerState, 'windows'> {
  windows: Record<string, WindowState>
  _nextZIndex: number
  _getNextZIndex: () => number
}

export const useWindowStore = create<WindowStore>()(
  persist(
    (set, get) => ({
      windows: initialWindows,
      activeWindow: null,
      _nextZIndex: 100,

      _getNextZIndex: () => {
        const current = get()._nextZIndex
        set({ _nextZIndex: current + 1 })
        return current
      },

      openWindow: (id, title, content) => {
        set((state) => {
          const existing = state.windows[id]
          const zIndex = state._getNextZIndex()

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

          // Calculate staggered position for new windows
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
                title,
                isOpen: true,
                isMinimized: false,
                isMaximized: false,
                position,
                size: { width: 800, height: 600 },
                zIndex,
                content: content as any,
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
              isMaximized: !state.windows[id].isMaximized,
            },
          },
        }))
      },

      restoreWindow: (id) => {
        set((state) => {
          const zIndex = state._getNextZIndex()
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
          const zIndex = state._getNextZIndex()
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

      updateWindowSize: (id, size) => {
        set((state) => ({
          windows: {
            ...state.windows,
            [id]: {
              ...state.windows[id],
              size,
            },
          },
        }))
      },
    }),
    {
      name: 'window-state',
      partialize: (state) => ({
        windows: state.windows,
        // Don't persist content functions or active state
      }),
    }
  )
)

export const WindowProvider = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>
}
