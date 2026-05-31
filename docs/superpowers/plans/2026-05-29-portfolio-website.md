# Portfolio Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a portfolio website with window manager UI, interactive trading demos, and an admin panel for blog posts

**Architecture:** Next.js 15 with App Router, window manager state via Zustand, MDX for blog content, file-based content management

**Tech Stack:** Next.js 15, TypeScript, Tailwind CSS, Zustand, react-draggable, next-mdx, recharts

---

## File Structure Overview

```
portfolio/
├── app/
│   ├── page.tsx          # Main desktop entry
│   ├── layout.tsx        # Root layout
│   ├── globals.css       # Global styles
│   └── api/
│       └── admin/
│           └── route.ts  # Admin API for blog posts
├── components/
│   ├── window-manager/
│   │   ├── Window.tsx
│   │   ├── Taskbar.tsx
│   │   ├── Desktop.tsx
│   │   └── useWindows.ts
│   ├── windows/
│   │   ├── Welcome.tsx
│   │   ├── Projects.tsx
│   │   ├── ProjectDetail.tsx
│   │   ├── Blog.tsx
│   │   ├── BlogPost.tsx
│   │   ├── About.tsx
│   │   └── Admin.tsx
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   └── Textarea.tsx
│   ├── projects/
│   │   ├── OrderflowDemo.tsx
│   │   └── BacktestDemo.tsx
│   └── blog/
│       └── BlogCard.tsx
├── lib/
│   ├── window-state.ts
│   ├── blog.ts
│   └── utils.ts
├── content/
│   └── blog/             # MDX blog posts
├── public/
│   └── images/
├── styles/
│   └── globals.css
├── next.config.mjs
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

---

## Task 1: Initialize Next.js Project

**Files:**
- Create: `C:\Users\YJ\Desktop\portfolio\package.json`
- Create: `C:\Users\YJ\Desktop\portfolio\next.config.mjs`
- Create: `C:\Users\YJ\Desktop\portfolio\tsconfig.json`
- Create: `C:\Users\YJ\Desktop\portfolio\tailwind.config.ts`
- Create: `C:\Users\YJ\Desktop\portfolio\.env.local`

- [ ] **Step 1: Create package.json with dependencies**

```bash
cd "C:\Users\YJ\Desktop\portfolio"
```

Create `package.json`:

```json
{
  "name": "portfolio",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "next": "^15.1.0",
    "@types/node": "^22.0.0",
    "@types/react": "^18.3.0",
    "@types/react-dom": "^18.3.0",
    "typescript": "^5.6.0",
    "zustand": "^5.0.0",
    "react-draggable": "^4.4.6",
    "@types/react-draggable": "^0.0.6",
    "@mdx-js/loader": "^3.0.0",
    "@mdx-js/react": "^3.0.0",
    "next-mdx-remote": "^5.0.0",
    "recharts": "^2.12.0",
    "clsx": "^2.1.0",
    "date-fns": "^4.0.0"
  },
  "devDependencies": {
    "tailwindcss": "^3.4.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0"
  }
}
```

- [ ] **Step 2: Create next.config.mjs**

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

export default nextConfig
```

- [ ] **Step 3: Create tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 4: Create tailwind.config.ts**

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        black: '#000000',
        white: '#FFFFFF',
      },
      fontFamily: {
        orbit: ['Orbit', 'monospace'],
        mono: ['monospace'],
      },
    },
  },
  plugins: [],
}
export default config
```

- [ ] **Step 5: Create .env.local**

```env
ADMIN_PASSWORD=your_password_here
```

- [ ] **Step 6: Install dependencies**

```bash
npm install
```

- [ ] **Step 7: Create PostCSS config**

Create `postcss.config.js`:

```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

- [ ] **Step 8: Commit**

```bash
git add .
git commit -m "feat: initialize Next.js project with dependencies"
```

---

## Task 2: Set Up App Router Structure and Global Styles

**Files:**
- Create: `C:\Users\YJ\Desktop\portfolio\app\layout.tsx`
- Create: `C:\Users\YJ\Desktop\portfolio\app\globals.css`
- Create: `C:\Users\YJ\Desktop\portfolio\app\page.tsx`

- [ ] **Step 1: Create app/layout.tsx**

```typescript
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Portfolio',
  description: 'Portfolio with interactive trading demos and blog',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Orbit:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-black text-white font-mono">{children}</body>
    </html>
  )
}
```

- [ ] **Step 2: Create app/globals.css with Orbit font and terminal styles**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  * {
    @apply border-border;
  }
  
  body {
    @apply bg-black text-white;
    font-family: 'Orbit', monospace;
  }
  
  /* Scanline effect */
  body::after {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: repeating-linear-gradient(
      0deg,
      rgba(0, 0, 0, 0.15),
      rgba(0, 0, 0, 0.15) 1px,
      transparent 1px,
      transparent 2px
    );
    pointer-events: none;
    z-index: 9999;
  }
}

/* Sharp edges everywhere - no rounded corners */
* {
  border-radius: 0 !important;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #000;
}

::-webkit-scrollbar-thumb {
  background: #fff;
}

::-webkit-scrollbar-thumb:hover {
  background: #ccc;
}
```

- [ ] **Step 3: Create app/page.tsx as desktop entry point**

```typescript
'use client'

import Desktop from '@/components/window-manager/Desktop'
import Taskbar from '@/components/window-manager/Taskbar'
import { WindowProvider } from '@/components/window-manager/useWindows'

export default function Home() {
  return (
    <WindowProvider>
      <div className="h-screen w-screen overflow-hidden bg-black">
        <Desktop />
        <Taskbar />
      </div>
    </WindowProvider>
  )
}
```

- [ ] **Step 4: Commit**

```bash
git add app/
git commit -m "feat: set up app router structure and global styles"
```

---

## Task 3: Build Window Manager State System

**Files:**
- Create: `C:\Users\YJ\Desktop\portfolio\lib\window-state.ts`
- Create: `C:\Users\YJ\Desktop\portfolio\components\window-manager\useWindows.tsx`

- [ ] **Step 1: Create window state types and store**

Create `lib/window-state.ts`:

```typescript
export type WindowId = 'welcome' | 'projects' | 'blog' | 'about' | 'admin' | `project-${string}` | `blog-${string}`

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
```

- [ ] **Step 2: Create Zustand store with localStorage persistence**

Create `components/window-manager/useWindows.tsx`:

```typescript
'use client'

import create, { StoreApi } from 'zustand'
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
```

- [ ] **Step 3: Commit**

```bash
git add lib/ components/window-manager/
git commit -m "feat: build window manager state system with Zustand"
```

---

## Task 4: Build Window Component

**Files:**
- Create: `C:\Users\YJ\Desktop\portfolio\components\window-manager\Window.tsx`

- [ ] **Step 1: Create draggable Window component**

Create `components/window-manager/Window.tsx`:

```typescript
'use client'

import { useEffect, useRef } from 'react'
import Draggable from 'react-draggable'
import { useWindowStore, type WindowId } from './useWindows'

interface WindowProps {
  windowId: WindowId
}

export default function Window({ windowId }: WindowProps) {
  const windowState = useWindowStore((s) => s.windows[windowId])
  const activeWindow = useWindowStore((s) => s.activeWindow)
  const closeWindow = useWindowStore((s) => s.closeWindow)
  const minimizeWindow = useWindowStore((s) => s.minimizeWindow)
  const maximizeWindow = useWindowStore((s) => s.maximizeWindow)
  const setActiveWindow = useWindowStore((s) => s.setActiveWindow)
  const updateWindowPosition = useWindowStore((s) => s.updateWindowPosition)

  const windowRef = useRef<HTMLDivElement>(null)

  if (!windowState || !windowState.isOpen || windowState.isMinimized) {
    return null
  }

  const isActive = activeWindow === windowId
  const Content = windowState.content as React.ComponentType | null

  const handleStop = (_e: any, data: { x: number; y: number }) => {
    updateWindowPosition(windowId, { x: data.x, y: data.y })
  }

  const handleClick = () => {
    setActiveWindow(windowId)
  }

  const isMaximized = windowState.isMaximized

  return (
    <Draggable
      handle=".window-titlebar"
      disabled={isMaximized}
      defaultPosition={windowState.position}
      onStop={handleStop}
      bounds="parent"
    >
      <div
        ref={windowRef}
        onClick={handleClick}
        className={`absolute flex flex-col border ${
          isActive ? 'border-white z-[9999]' : 'border-gray-600'
        } bg-black`}
        style={{
          width: isMaximized ? '100vw' : windowState.size.width,
          height: isMaximized ? 'calc(100vh - 48px)' : windowState.size.height,
          zIndex: windowState.zIndex,
          left: isMaximized ? 0 : windowState.position.x,
          top: isMaximized ? 0 : windowState.position.y,
        }}
      >
        {/* Title Bar */}
        <div className="window-titlebar flex items-center justify-between bg-white text-black px-2 py-1 cursor-move">
          <span className="font-semibold">{windowState.title}</span>
          <div className="flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation()
                minimizeWindow(windowId)
              }}
              className="hover:bg-gray-300 px-2 py-0.5"
              aria-label="Minimize"
            >
              –
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                maximizeWindow(windowId)
              }}
              className="hover:bg-gray-300 px-2 py-0.5"
              aria-label="Maximize"
            >
              □
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                closeWindow(windowId)
              }}
              className="hover:bg-red-600 hover:text-white px-2 py-0.5"
              aria-label="Close"
            >
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4">
          {Content && <Content />}
        </div>
      </div>
    </Draggable>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/window-manager/Window.tsx
git commit -m "feat: build draggable Window component"
```

---

## Task 5: Build Desktop Component with Icons

**Files:**
- Create: `C:\Users\YJ\Desktop\portfolio\components\window-manager\Desktop.tsx`

- [ ] **Step 1: Create Desktop component**

Create `components/window-manager/Desktop.tsx`:

```typescript
'use client'

import { useWindowStore } from './useWindows'
import Welcome from '../windows/Welcome'
import Projects from '../windows/Projects'
import Blog from '../windows/Blog'
import About from '../windows/About'
import Admin from '../windows/Admin'

interface DesktopIcon {
  id: string
  label: string
  component: React.ComponentType
  position: { x: number; y: number }
}

const icons: DesktopIcon[] = [
  { id: 'welcome', label: 'Welcome', component: Welcome, position: { x: 50, y: 50 } },
  { id: 'projects', label: 'Projects', component: Projects, position: { x: 50, y: 150 } },
  { id: 'blog', label: 'Blog', component: Blog, position: { x: 50, y: 250 } },
  { id: 'about', label: 'About', component: About, position: { x: 50, y: 350 } },
  { id: 'admin', label: 'Admin', component: Admin, position: { x: 50, y: 450 } },
]

export default function Desktop() {
  const openWindow = useWindowStore((s) => s.openWindow)
  const windows = useWindowStore((s) => s.windows)

  const handleIconClick = (icon: DesktopIcon) => {
    openWindow(icon.id as any, icon.label, icon.component)
  }

  return (
    <div className="relative h-full w-full">
      {/* Desktop Icons */}
      {icons.map((icon) => (
        <button
          key={icon.id}
          onClick={() => handleIconClick(icon)}
          className="absolute flex flex-col items-center gap-1 p-2 hover:bg-white hover:text-black transition-colors"
          style={{ left: icon.position.x, top: icon.position.y }}
        >
          <div className="w-12 h-12 border border-current flex items-center justify-center text-2xl">
            {icon.label[0]}
          </div>
          <span className="text-xs">{icon.label}</span>
        </button>
      ))}

      {/* Render all open windows */}
      {Object.values(windows).map((window) => {
        if (window.isOpen) {
          return (
            <div key={window.id} className="absolute">
              <div className="pointer-events-none">
                {/* We'll render windows via a different mechanism */}
              </div>
            </div>
          )
        }
        return null
      })}
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/window-manager/Desktop.tsx
git commit -m "feat: build Desktop component with icons"
```

---

## Task 6: Build Taskbar Component

**Files:**
- Create: `C:\Users\YJ\Desktop\portfolio\components\window-manager\Taskbar.tsx`

- [ ] **Step 1: Create Taskbar component**

Create `components/window-manager/Taskbar.tsx`:

```typescript
'use client'

import { useWindowStore } from './useWindows'
import Window from './Window'

export default function Taskbar() {
  const windows = useWindowStore((s) => s.windows)
  const activeWindow = useWindowStore((s) => s.activeWindow)
  const restoreWindow = useWindowStore((s) => s.restoreWindow)
  const minimizeWindow = useWindowStore((s) => s.minimizeWindow)

  const openWindows = Object.values(windows).filter((w) => w.isOpen)

  const handleTaskbarClick = (windowId: string) => {
    const window = windows[windowId]
    if (window.isMinimized) {
      restoreWindow(windowId as any)
    } else if (activeWindow === windowId) {
      minimizeWindow(windowId as any)
    } else {
      restoreWindow(windowId as any)
    }
  }

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 h-12 bg-white text-black flex items-center px-2 gap-2 border-t-4 border-black">
        <div className="flex items-center gap-4">
          <span className="font-bold px-2">DESKTOP</span>
          <div className="h-6 w-px bg-black" />
          {openWindows.map((window) => (
            <button
              key={window.id}
              onClick={() => handleTaskbarClick(window.id)}
              className={`px-3 py-1 border border-black hover:bg-black hover:text-white transition-colors ${
                activeWindow === window.id ? 'bg-black text-white' : ''
              }`}
            >
              {window.title}
            </button>
          ))}
        </div>
      </div>

      {/* Render open windows */}
      {openWindows.map((window) => (
        <Window key={window.id} windowId={window.id as any} />
      ))}
    </>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/window-manager/Taskbar.tsx
git commit -m "feat: build Taskbar component"
```

---

## Task 7: Build Welcome Window

**Files:**
- Create: `C:\Users\YJ\Desktop\portfolio\components\windows\Welcome.tsx`

- [ ] **Step 1: Create Welcome window**

Create `components/windows/Welcome.tsx`:

```typescript
'use client'

import { useEffect, useState } from 'react'

export default function Welcome() {
  const [text, setText] = useState('')
  const fullText = '> initializing portfolio...'

  useEffect(() => {
    let i = 0
    const timer = setInterval(() => {
      if (i < fullText.length) {
        setText(fullText.slice(0, i + 1))
        i++
      } else {
        clearInterval(timer)
      }
    }, 50)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="h-full flex flex-col justify-center items-center gap-8">
      <h1 className="text-4xl font-bold">PORTFOLIO</h1>
      <div className="text-lg font-mono">{text}</div>
      <div className="text-sm opacity-70">
        Double-click desktop icons to open windows
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/windows/Welcome.tsx
git commit -m "feat: build Welcome window"
```

---

## Task 8: Build Projects Window

**Files:**
- Create: `C:\Users\YJ\Desktop\portfolio\components\windows\Projects.tsx`
- Create: `C:\Users\YJ\Desktop\portfolio\components\projects\OrderflowDemo.tsx`

- [ ] **Step 1: Create Projects window**

Create `components/windows/Projects.tsx`:

```typescript
'use client'

import { useWindowStore } from '../window-manager/useWindows'
import ProjectDetail from './ProjectDetail'

interface Project {
  id: string
  title: string
  description: string
  tech: string[]
}

const projects: Project[] = [
  {
    id: 'orderflow',
    title: 'Orderflow Research',
    description: 'ML Zone Classification System for trading - replace hard-coded rules with data-driven machine learning.',
    tech: ['Python', 'ML', 'FastAPI', 'Next.js'],
  },
  {
    id: 'backtest',
    title: 'Trading Backtests',
    description: 'Strategy backtesting with parameter optimization and performance analytics.',
    tech: ['Python', 'pandas', 'numpy'],
  },
]

export default function Projects() {
  const openWindow = useWindowStore((s) => s.openWindow)

  const handleProjectClick = (project: Project) => {
    openWindow(
      `project-${project.id}` as any,
      project.title,
      () => <ProjectDetail project={project} />
    )
  }

  return (
    <div className="h-full">
      <h2 className="text-2xl font-bold mb-6 border-b border-white pb-2">PROJECTS</h2>
      <div className="grid grid-cols-1 gap-4">
        {projects.map((project) => (
          <button
            key={project.id}
            onClick={() => handleProjectClick(project)}
            className="text-left p-4 border border-white hover:bg-white hover:text-black transition-colors"
          >
            <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
            <p className="text-sm opacity-80 mb-3">{project.description}</p>
            <div className="flex gap-2 flex-wrap">
              {project.tech.map((t) => (
                <span key={t} className="text-xs border border-current px-2 py-0.5">
                  {t}
                </span>
              ))}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Create ProjectDetail window**

Create `components/windows/ProjectDetail.tsx`:

```typescript
'use client'

import OrderflowDemo from '../projects/OrderflowDemo'

interface Project {
  id: string
  title: string
  description: string
  tech: string[]
}

interface ProjectDetailProps {
  project: Project
}

export default function ProjectDetail({ project }: ProjectDetailProps) {
  return (
    <div className="h-full flex flex-col">
      <h2 className="text-2xl font-bold mb-2">{project.title}</h2>
      <p className="mb-4 opacity-80">{project.description}</p>

      <div className="flex gap-2 mb-4">
        {project.tech.map((t) => (
          <span key={t} className="text-xs border border-white px-2 py-0.5">
            {t}
          </span>
        ))}
      </div>

      <div className="flex-1 border border-white p-4">
        {project.id === 'orderflow' ? (
          <OrderflowDemo />
        ) : (
          <div className="flex items-center justify-center h-full opacity-50">
            Demo coming soon...
          </div>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Create OrderflowDemo component**

Create `components/projects/OrderflowDemo.tsx`:

```typescript
'use client'

import { useState } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

const generateData = (points: number) => {
  return Array.from({ length: points }, (_, i) => ({
    time: i,
    price: 100 + Math.random() * 20 + Math.sin(i / 10) * 5,
    zone: Math.random() > 0.7 ? 3 : Math.random() > 0.4 ? 2 : 1,
  }))
}

const zoneColors: Record<number, string> = {
  1: 'gray',    // Neutral
  2: 'yellow',  // Consolidation
  3: 'green',   // Breakout
}

const zoneNames: Record<number, string> = {
  1: 'Neutral (Wait)',
  2: 'Consolidation (Avoid fakeouts)',
  3: 'Breakout (Enter)',
}

export default function OrderflowDemo() {
  const [dataPoints, setDataPoints] = useState(50)
  const [data] = useState(() => generateData(50))

  const handleDataPointsChange = (value: number) => {
    setDataPoints(value)
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex gap-4 mb-4 items-center">
        <label className="text-sm">
          Data Points: {dataPoints}
        </label>
        <input
          type="range"
          min="20"
          max="100"
          value={dataPoints}
          onChange={(e) => handleDataPointsChange(parseInt(e.target.value))}
          className="flex-1"
        />
      </div>

      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid stroke="#333" />
            <XAxis dataKey="time" stroke="white" />
            <YAxis stroke="white" />
            <Tooltip
              contentStyle={{ backgroundColor: 'black', border: '1px solid white' }}
              itemStyle={{ color: 'white' }}
              formatter={(value: any, name: string, props: any) => {
                if (name === 'zone') {
                  return [zoneNames[value], 'Zone']
                }
                return [value.toFixed(2), name]
              }}
            />
            <Line
              type="monotone"
              dataKey="price"
              stroke="white"
              dot={false}
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 text-xs">
        <div className="flex gap-4">
          <span>Zone Legend:</span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 bg-gray-500 inline-block"></span>
            Neutral
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 bg-yellow-500 inline-block"></span>
            Consolidation
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 bg-green-500 inline-block"></span>
            Breakout
          </span>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Commit**

```bash
git add components/windows/Projects.tsx components/windows/ProjectDetail.tsx components/projects/
git commit -m "feat: build Projects window with OrderflowDemo"
```

---

## Task 9: Build Blog Window and MDX System

**Files:**
- Create: `C:\Users\YJ\Desktop\portfolio\components\windows\Blog.tsx`
- Create: `C:\Users\YJ\Desktop\portfolio\lib\blog.ts`
- Create: `C:\Users\YJ\Desktop\portfolio\content\blog\sample-review.mdx`
- Create: `C:\Users\YJ\Desktop\portfolio\components\blog\BlogCard.tsx`

- [ ] **Step 1: Create blog utilities**

Create `lib/blog.ts`:

```typescript
import fs from 'fs'
import path from 'path'

const contentDirectory = path.join(process.cwd(), 'content', 'blog')

export interface BlogPost {
  slug: string
  title: string
  author: string // book author
  rating: number
  date: string
  readTime: string
  excerpt: string
}

export function getAllBlogPosts(): BlogPost[] {
  const fullPath = path.join(process.cwd(), 'content', 'blog')
  const filenames = fs.readdirSync(fullPath)

  const posts = filenames
    .filter((name) => name.endsWith('.mdx'))
    .map((filename) => {
      const slug = filename.replace(/\.mdx$/, '')
      // For now, return minimal data
      // In production, parse frontmatter from MDX
      return {
        slug,
        title: 'Sample Book Review',
        author: 'Author Name',
        rating: 4,
        date: new Date().toISOString().split('T')[0],
        readTime: '5 min read',
        excerpt: 'A brief summary of the book and its key takeaways...',
      }
    })

  return posts.sort((a, b) => (a.date > b.date ? -1 : 1))
}

export async function getBlogPost(slug: string) {
  try {
    const fullPath = path.join(contentDirectory, `${slug}.mdx`)
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    return {
      slug,
      content: fileContents,
    }
  } catch {
    return null
  }
}
```

- [ ] **Step 2: Create sample blog post**

Create `content/blog/sample-review.mdx`:

```mdx
---
title: "Thinking, Fast and Slow"
author: "Daniel Kahneman"
rating: 5
date: "2026-05-29"
readTime: "8 min read"
---

A groundbreaking exploration of the two systems that drive how we think.

## Summary

Kahneman divides thinking into two systems: System 1 (fast, intuitive) and System 2 (slow, deliberate). This book explores how these systems interact and often lead to cognitive biases.

## Key Takeaways

- System 1 operates automatically and quickly with little effort
- System 2 allocates attention to effortful mental activities
- We're overconfident in our intuitions and underestimate the role of chance
- Loss aversion makes losses hurt more than gains feel good

## Recommendation

**Highly recommended** for anyone interested in psychology, decision-making, or understanding human behavior. Essential reading for traders dealing with uncertainty.
```

- [ ] **Step 3: Create BlogCard component**

Create `components/blog/BlogCard.tsx`:

```typescript
import type { BlogPost } from '@/lib/blog'

interface BlogCardProps {
  post: BlogPost
  onClick: () => void
}

export default function BlogCard({ post, onClick }: BlogCardProps) {
  const stars = '★'.repeat(post.rating) + '☆'.repeat(5 - post.rating)

  return (
    <button
      onClick={onClick}
      className="text-left p-4 border border-white hover:bg-white hover:text-black transition-colors w-full"
    >
      <h3 className="text-lg font-semibold mb-1">{post.title}</h3>
      <p className="text-sm opacity-70 mb-2">by {post.author}</p>
      <div className="text-yellow-500 mb-2">{stars}</div>
      <p className="text-sm opacity-80 mb-2">{post.excerpt}</p>
      <div className="text-xs opacity-60 flex gap-4">
        <span>{post.date}</span>
        <span>{post.readTime}</span>
      </div>
    </button>
  )
}
```

- [ ] **Step 4: Create Blog window**

Create `components/windows/Blog.tsx`:

```typescript
'use client'

import { useEffect, useState } from 'react'
import { useWindowStore } from '../window-manager/useWindows'
import BlogPostWindow from './BlogPost'
import type { BlogPost } from '@/lib/blog'
import BlogCard from '../blog/BlogCard'

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const openWindow = useWindowStore((s) => s.openWindow)

  useEffect(() => {
    // In production, fetch from API
    setPosts([
      {
        slug: 'thinking-fast-slow',
        title: 'Thinking, Fast and Slow',
        author: 'Daniel Kahneman',
        rating: 5,
        date: '2026-05-29',
        readTime: '8 min read',
        excerpt: 'A groundbreaking exploration of the two systems that drive how we think.',
      },
    ])
  }, [])

  const handlePostClick = (post: BlogPost) => {
    openWindow(
      `blog-${post.slug}` as any,
      post.title,
      () => <BlogPostWindow slug={post.slug} />
    )
  }

  return (
    <div className="h-full flex flex-col">
      <h2 className="text-2xl font-bold mb-6 border-b border-white pb-2">BLOG</h2>
      <div className="text-sm mb-4 opacity-70">Book Reviews & Thoughts</div>
      <div className="flex-1 overflow-auto space-y-4">
        {posts.length === 0 ? (
          <div className="text-center opacity-50 py-8">
            No reviews yet. Check back soon!
          </div>
        ) : (
          posts.map((post) => (
            <BlogCard key={post.slug} post={post} onClick={() => handlePostClick(post)} />
          ))
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 5: Create BlogPost window**

Create `components/windows/BlogPost.tsx`:

```typescript
'use client'

import { useEffect, useState } from 'react'
import { MDXRemote } from 'next-mdx-remote/rsc'

interface BlogPostProps {
  slug: string
}

export default function BlogPostWindow({ slug }: BlogPostProps) {
  const [content, setContent] = useState<string>('')
  const [frontmatter, setFrontmatter] = useState<any>(null)

  useEffect(() => {
    // In production, fetch from API
    setContent(`A groundbreaking exploration of the two systems that drive how we think.

## Summary

Kahneman divides thinking into two systems: System 1 (fast, intuitive) and System 2 (slow, deliberate).

## Key Takeaways

- System 1 operates automatically and quickly
- System 2 allocates attention to effortful activities
- Loss aversion makes losses hurt more than gains feel good

## Recommendation

**Highly recommended** for anyone interested in psychology and decision-making.`)

    setFrontmatter({
      title: 'Thinking, Fast and Slow',
      author: 'Daniel Kahneman',
      rating: 5,
    })
  }, [slug])

  const stars = frontmatter ? '★'.repeat(frontmatter.rating) + '☆'.repeat(5 - frontmatter.rating) : ''

  return (
    <div className="h-full overflow-auto">
      <div className="mb-6 pb-4 border-b border-white">
        <h2 className="text-2xl font-bold mb-2">{frontmatter?.title}</h2>
        <p className="opacity-70 mb-2">by {frontmatter?.author}</p>
        <div className="text-yellow-500">{stars}</div>
      </div>

      <div className="prose prose-invert max-w-none">
        {content.split('\n').map((line, i) => {
          if (line.startsWith('## ')) {
            return (
              <h3 key={i} className="text-xl font-bold mt-6 mb-3">
                {line.replace('## ', '')}
              </h3>
            )
          }
          if (line.startsWith('- ')) {
            return (
              <li key={i} className="ml-4">
                {line.replace('- ', '')}
              </li>
            )
          }
          if (line.startsWith('**')) {
            return (
              <p key={i} className="font-semibold my-2">
                {line.replace(/\*\*/g, '')}
              </p>
            )
          }
          if (line.trim()) {
            return (
              <p key={i} className="my-2">
                {line}
              </p>
            )
          }
          return <br key={i} />
        })}
      </div>
    </div>
  )
}
```

- [ ] **Step 6: Commit**

```bash
git add components/windows/Blog.tsx components/windows/BlogPost.tsx lib/blog.ts content/blog/ components/blog/
git commit -m "feat: build Blog window with MDX support"
```

---

## Task 10: Build About Window

**Files:**
- Create: `C:\Users\YJ\Desktop\portfolio\components\windows\About.tsx`

- [ ] **Step 1: Create About window**

Create `components/windows/About.tsx`:

```typescript
export default function About() {
  return (
    <div className="h-full flex flex-col">
      <h2 className="text-2xl font-bold mb-6 border-b border-white pb-2">ABOUT</h2>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Bio</h3>
          <p className="opacity-80">
            Developer and trader exploring the intersection of machine learning and financial markets.
            Currently focused on orderflow research and algorithmic trading systems.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {['Python', 'TypeScript', 'React', 'Next.js', 'Machine Learning', 'Trading'].map((skill) => (
              <span key={skill} className="border border-white px-2 py-1 text-sm">
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Contact</h3>
          <div className="space-y-1 text-sm">
            <p>GitHub: @yourusername</p>
            <p>Email: your@email.com</p>
          </div>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/windows/About.tsx
git commit -m "feat: build About window"
```

---

## Task 11: Build Admin Panel

**Files:**
- Create: `C:\Users\YJ\Desktop\portfolio\components\windows\Admin.tsx`
- Create: `C:\Users\YJ\Desktop\portfolio\app\api\admin\route.ts`

- [ ] **Step 1: Create Admin API route**

Create `app/api/admin/route.ts`:

```typescript
import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const contentDirectory = path.join(process.cwd(), 'content', 'blog')

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { action, password, postData } = body

    // Simple password check
    if (password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (action === 'publish') {
      const { title, author, rating, content } = postData
      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-')
      const filename = `${slug}.mdx`
      const filepath = path.join(contentDirectory, filename)

      const frontmatter = `---
title: "${title}"
author: "${author}"
rating: ${rating}
date: "${new Date().toISOString().split('T')[0]}"
readTime: "${Math.ceil(content.split(' ').length / 200)} min read"
---

${content}
`

      fs.writeFileSync(filepath, frontmatter)

      return NextResponse.json({ success: true, slug })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
```

- [ ] **Step 2: Create Admin window**

Create `components/windows/Admin.tsx`:

```typescript
'use client'

import { useState } from 'react'

export default function Admin() {
  const [authenticated, setAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [rating, setRating] = useState(5)
  const [content, setContent] = useState('')
  const [message, setMessage] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    // In production, verify against API
    setAuthenticated(true)
  }

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'publish',
          password,
          postData: { title, author, rating, content },
        }),
      })

      const data = await response.json()

      if (data.success) {
        setMessage('Post published successfully!')
        setTitle('')
        setAuthor('')
        setContent('')
        setRating(5)
      } else {
        setMessage('Failed to publish: ' + data.error)
      }
    } catch (error) {
      setMessage('Error publishing post')
    }
  }

  if (!authenticated) {
    return (
      <div className="h-full flex items-center justify-center">
        <form onSubmit={handleLogin} className="w-full max-w-sm space-y-4">
          <h2 className="text-xl font-bold">Admin Login</h2>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full p-2 bg-black border border-white text-white"
            required
          />
          <button
            type="submit"
            className="w-full p-2 bg-white text-black hover:bg-gray-300"
          >
            Login
          </button>
        </form>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      <h2 className="text-2xl font-bold mb-6 border-b border-white pb-2">ADMIN</h2>

      <form onSubmit={handlePublish} className="space-y-4 flex-1 flex flex-col">
        <div>
          <label className="block text-sm mb-1">Book Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 bg-black border border-white text-white"
            required
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Author</label>
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="w-full p-2 bg-black border border-white text-white"
            required
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Rating (1-5)</label>
          <select
            value={rating}
            onChange={(e) => setRating(parseInt(e.target.value))}
            className="w-full p-2 bg-black border border-white text-white"
          >
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>
                {'★'.repeat(n)}{'☆'.repeat(5 - n)}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1">
          <label className="block text-sm mb-1">Content (Markdown supported)</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-full min-h-[200px] p-2 bg-black border border-white text-white font-mono text-sm resize-none"
            placeholder="## Summary&#10;&#10;Write your review here..."
            required
          />
        </div>

        {message && (
          <div className={`text-sm ${message.includes('success') ? 'text-green-500' : 'text-red-500'}`}>
            {message}
          </div>
        )}

        <button
          type="submit"
          className="w-full p-3 bg-white text-black hover:bg-gray-300 font-semibold"
        >
          Publish Post
        </button>
      </form>
    </div>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add app/api/admin/ components/windows/Admin.tsx
git commit -m "feat: build Admin panel with blog publishing"
```

---

## Task 12: Auto-Open Welcome Window on Load

**Files:**
- Modify: `C:\Users\YJ\Desktop\portfolio\app\page.tsx`

- [ ] **Step 1: Update page.tsx to auto-open Welcome window**

```typescript
'use client'

import { useEffect } from 'react'
import Desktop from '@/components/window-manager/Desktop'
import Taskbar from '@/components/window-manager/Taskbar'
import { WindowProvider, useWindowStore } from '@/components/window-manager/useWindows'
import Welcome from '@/components/windows/Welcome'

function AppContent() {
  const openWindow = useWindowStore((s) => s.openWindow)

  useEffect(() => {
    // Auto-open welcome window on load
    openWindow('welcome', 'Welcome', Welcome)
  }, [openWindow])

  return (
    <div className="h-screen w-screen overflow-hidden bg-black">
      <Desktop />
      <Taskbar />
    </div>
  )
}

export default function Home() {
  return (
    <WindowProvider>
      <AppContent />
    </WindowProvider>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add app/page.tsx
git commit -m "feat: auto-open Welcome window on load"
```

---

## Task 13: Fix Persist Issue with Window Content

**Files:**
- Modify: `C:\Users\YJ\Desktop\portfolio\components\window-manager\useWindows.tsx`

- [ ] **Step 1: Update useWindows to handle content restoration**

The persist middleware can't store functions. We need to re-attach content when windows are opened.

Update `components/window-manager/useWindows.tsx`:

```typescript
'use client'

import create from 'zustand'
import { persist } from 'zustand/middleware'
import type { WindowManagerState, WindowId } from '@/lib/window-state'

// Window content registry - stores the component for each window ID
const windowContentRegistry = new Map<WindowId, React.ComponentType>()

export function registerWindowContent(id: WindowId, component: React.ComponentType) {
  windowContentRegistry.set(id, component)
}

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
```

- [ ] **Step 2: Commit**

```bash
git add components/window-manager/useWindows.tsx
git commit -m "fix: update window store to handle content restoration"
```

---

## Task 14: Update Desktop to Register Window Content

**Files:**
- Modify: `C:\Users\YJ\Desktop\portfolio\components\window-manager\Desktop.tsx`

- [ ] **Step 1: Update Desktop to register window content**

Update `components/window-manager/Desktop.tsx`:

```typescript
'use client'

import { useEffect } from 'react'
import { useWindowStore, registerWindowContent } from './useWindows'
import Welcome from '../windows/Welcome'
import Projects from '../windows/Projects'
import Blog from '../windows/Blog'
import About from '../windows/About'
import Admin from '../windows/Admin'

interface DesktopIcon {
  id: string
  label: string
  component: React.ComponentType
  position: { x: number; y: number }
}

const icons: DesktopIcon[] = [
  { id: 'welcome', label: 'Welcome', component: Welcome, position: { x: 50, y: 50 } },
  { id: 'projects', label: 'Projects', component: Projects, position: { x: 50, y: 150 } },
  { id: 'blog', label: 'Blog', component: Blog, position: { x: 50, y: 250 } },
  { id: 'about', label: 'About', component: About, position: { x: 50, y: 350 } },
  { id: 'admin', label: 'Admin', component: Admin, position: { x: 50, y: 450 } },
]

export default function Desktop() {
  const openWindow = useWindowStore((s) => s.openWindow)

  useEffect(() => {
    // Register all window contents on mount
    icons.forEach((icon) => {
      registerWindowContent(icon.id as any, icon.component)
    })
  }, [])

  const handleIconClick = (icon: DesktopIcon) => {
    openWindow(icon.id as any)
  }

  return (
    <div className="relative h-full w-full">
      {icons.map((icon) => (
        <button
          key={icon.id}
          onClick={() => handleIconClick(icon)}
          className="absolute flex flex-col items-center gap-1 p-2 hover:bg-white hover:text-black transition-colors"
          style={{ left: icon.position.x, top: icon.position.y }}
        >
          <div className="w-12 h-12 border border-current flex items-center justify-center text-2xl">
            {icon.label[0]}
          </div>
          <span className="text-xs">{icon.label}</span>
        </button>
      ))}
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/window-manager/Desktop.tsx
git commit -m "fix: register window content in Desktop component"
```

---

## Task 15: Update Window to Get Content from Registry

**Files:**
- Modify: `C:\Users\YJ\Desktop\portfolio\components\window-manager\Window.tsx`

- [ ] **Step 1: Update Window component to use content registry**

Update `components/window-manager/Window.tsx`:

```typescript
'use client'

import Draggable from 'react-draggable'
import { useWindowStore, type WindowId, windowContentRegistry } from './useWindows'

interface WindowProps {
  windowId: WindowId
}

export default function Window({ windowId }: WindowProps) {
  const windowState = useWindowStore((s) => s.windows[windowId])
  const activeWindow = useWindowStore((s) => s.activeWindow)
  const closeWindow = useWindowStore((s) => s.closeWindow)
  const minimizeWindow = useWindowStore((s) => s.minimizeWindow)
  const maximizeWindow = useWindowStore((s) => s.maximizeWindow)
  const setActiveWindow = useWindowStore((s) => s.setActiveWindow)
  const updateWindowPosition = useWindowStore((s) => s.updateWindowPosition)

  if (!windowState || !windowState.isOpen || windowState.isMinimized) {
    return null
  }

  const isActive = activeWindow === windowId
  const Content = windowContentRegistry.get(windowId)

  const handleStop = (_e: any, data: { x: number; y: number }) => {
    updateWindowPosition(windowId, { x: data.x, y: data.y })
  }

  const handleClick = () => {
    setActiveWindow(windowId)
  }

  const isMaximized = windowState.isMaximized

  return (
    <Draggable
      handle=".window-titlebar"
      disabled={isMaximized}
      defaultPosition={windowState.position}
      onStop={handleStop}
      bounds="parent"
    >
      <div
        onClick={handleClick}
        className={`absolute flex flex-col border ${
          isActive ? 'border-white z-[9999]' : 'border-gray-600'
        } bg-black`}
        style={{
          width: isMaximized ? '100vw' : windowState.size.width,
          height: isMaximized ? 'calc(100vh - 48px)' : windowState.size.height,
          zIndex: windowState.zIndex,
          left: isMaximized ? 0 : windowState.position.x,
          top: isMaximized ? 0 : windowState.position.y,
        }}
      >
        <div className="window-titlebar flex items-center justify-between bg-white text-black px-2 py-1 cursor-move">
          <span className="font-semibold">{windowState.title}</span>
          <div className="flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation()
                minimizeWindow(windowId)
              }}
              className="hover:bg-gray-300 px-2 py-0.5"
              aria-label="Minimize"
            >
              –
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                maximizeWindow(windowId)
              }}
              className="hover:bg-gray-300 px-2 py-0.5"
              aria-label="Maximize"
            >
              □
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                closeWindow(windowId)
              }}
              className="hover:bg-red-600 hover:text-white px-2 py-0.5"
              aria-label="Close"
            >
              ×
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4">
          {Content ? <Content /> : <div>Content not found</div>}
        </div>
      </div>
    </Draggable>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/window-manager/Window.tsx
git commit -m "fix: update Window to use content registry"
```

---

## Task 16: Test and Deploy

**Files:**
- Create: `C:\Users\YJ\Desktop\portfolio\.gitignore`

- [ ] **Step 1: Create .gitignore**

Create `.gitignore`:

```
node_modules
.next
.env.local
dist
*.log
```

- [ ] **Step 2: Test the development server**

```bash
cd "C:\Users\YJ\Desktop\portfolio"
npm run dev
```

Open http://localhost:3000 and verify:
1. Welcome window auto-opens with typing animation
2. Desktop icons are clickable
3. Windows can be dragged, minimized, maximized, closed
4. Taskbar shows open windows
5. Projects window opens with Orderflow demo
6. Blog window opens with sample review
7. About and Admin windows work

- [ ] **Step 3: Build for production**

```bash
npm run build
```

- [ ] **Step 4: Test production build**

```bash
npm start
```

Verify the same functionality as development mode.

- [ ] **Step 5: Initialize git and commit final changes**

```bash
git init
git add .
git commit -m "feat: complete portfolio website with window manager UI"
```

- [ ] **Step 6: Push to GitHub and deploy to Vercel**

```bash
# Create repo on GitHub first, then:
git remote add origin https://github.com/YOUR_USERNAME/portfolio.git
git push -u origin main

# Then deploy via Vercel dashboard or:
npx vercel
```

- [ ] **Step 7: Final commit**

```bash
git add .gitignore
git commit -m "chore: add .gitignore and deployment preparation"
```

---

## Success Criteria Verification

After completing all tasks, verify:

1. ✅ Portfolio site deploys successfully on Vercel
2. ✅ Window manager UI works (drag, minimize, close, maximize)
3. ✅ Window positions persist across sessions (localStorage)
4. ✅ Trading demos are interactive and functional
5. ✅ Blog can be updated via admin panel without touching code
6. ✅ Visual aesthetic matches black/white terminal theme
7. ✅ Site is responsive (consider mobile adaptation)
