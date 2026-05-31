# "Alive Feel" Features Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add terminal command input, triple-border hover effects, and 7 "alive feel" features (pulsing indicators, CRT effects, status bar, typing animations, boot animation, pulsing grid, glitch effects, loading bars) for a brutalist desktop portfolio.

**Architecture:** Terminal command bar replaces the current taskbar. Effects are layered via CSS animations and React components. All effects are cosmetic - no fake system messages.

**Tech Stack:** Next.js 15, TypeScript, Tailwind CSS, React hooks, Zustand

---

## Task 1: Create Terminal Command Bar Component

**Files:**
- Create: `components/terminal/TerminalBar.tsx`
- Modify: `app/page.tsx`
- Delete: `components/window-manager/Taskbar.tsx`

**Context:** The current Taskbar shows open windows. The new TerminalBar replaces it with a command input at the bottom that spans full width. Commands should work: `open <name>`, `ls`, `help`, `clear`, `close`. Command output appears above input in a scrollable area.

- [ ] **Step 1: Create TerminalBar component structure**

```tsx
// components/terminal/TerminalBar.tsx
'use client'

import { useState, useRef, useEffect } from 'react'
import { useWindowStore } from '../window-manager/useWindows'
import Window from '../window-manager/Window'

interface CommandEntry {
  input: string
  output: string
  timestamp: Date
}

export default function TerminalBar() {
  const [commandHistory, setCommandHistory] = useState<CommandEntry[]>([
    { input: '', output: 'TERMINAL READY. TYPE "help" FOR COMMANDS.', timestamp: new Date() }
  ])
  const [currentInput, setCurrentInput] = useState('')
  const [historyIndex, setHistoryIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const outputRef = useRef<HTMLDivElement>(null)

  const windows = useWindowStore((s) => s.windows)
  const openWindow = useWindowStore((s) => s.openWindow)
  const closeWindow = useWindowStore((s) => s.closeWindow)

  const availableWindows = ['welcome', 'projects', 'blog', 'about', 'admin']

  // Auto-scroll to bottom when new output
  useEffect(() => {
    outputRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [commandHistory])

  const executeCommand = (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase()
    let output = ''

    if (trimmed === 'help') {
      output = `AVAILABLE COMMANDS:
  open <name>  - Open a window (welcome, projects, blog, about, admin)
  close        - Close active window
  ls           - List available windows
  clear        - Clear terminal
  help         - Show this message`
    } else if (trimmed === 'ls') {
      output = availableWindows.join(' | ')
    } else if (trimmed === 'clear') {
      setCommandHistory([{ input: '', output: 'TERMINAL CLEARED.', timestamp: new Date() }])
      setCurrentInput('')
      return
    } else if (trimmed === 'close') {
      const openWindows = Object.values(windows).filter(w => w.isOpen)
      if (openWindows.length > 0) {
        closeWindow(openWindows[openWindows.length - 1].id)
        output = `Closed: ${openWindows[openWindows.length - 1].title}`
      } else {
        output = 'No windows open.'
      }
    } else if (trimmed.startsWith('open ')) {
      const target = trimmed.replace('open ', '').trim()
      if (availableWindows.includes(target)) {
        openWindow(target as any)
        output = `Opening: ${target.toUpperCase()}...`
      } else {
        output = `Unknown window: ${target}. Type "ls" for available windows.`
      }
    } else if (trimmed === '') {
      return
    } else {
      output = `Unknown command: ${trimmed}. Type "help" for available commands.`
    }

    setCommandHistory(prev => [...prev, { input: cmd, output, timestamp: new Date() }])
    setCurrentInput('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      executeCommand(currentInput)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      const executedCommands = commandHistory.filter(c => c.input).reverse()
      if (historyIndex < executedCommands.length - 1) {
        const newIndex = historyIndex + 1
        setHistoryIndex(newIndex)
        setCurrentInput(executedCommands[newIndex].input)
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1
        setHistoryIndex(newIndex)
        const executedCommands = commandHistory.filter(c => c.input).reverse()
        setCurrentInput(executedCommands[newIndex]?.input || '')
      } else if (historyIndex === 0) {
        setHistoryIndex(-1)
        setCurrentInput('')
      }
    }
  }

  // Focus input on terminal click
  const handleTerminalClick = () => {
    inputRef.current?.focus()
  }

  const openWindows = Object.values(windows).filter(w => w.isOpen)

  return (
    <>
      {/* Render open windows */}
      {openWindows.map((window) => (
        <Window key={window.id} windowId={window.id as any} />
      ))}

      {/* Terminal Bar */}
      <div
        className="fixed bottom-0 left-0 right-0 bg-black text-white font-mono text-sm border-t-4 border-white"
        style={{ zIndex: 10000 }}
      >
        {/* Output area */}
        <div className="max-h-48 overflow-y-auto p-2 space-y-1">
          {commandHistory.map((entry, i) => (
            <div key={i}>
              {entry.input && (
                <div className="text-green-400">
                  <span className="text-white">$</span> {entry.input}
                </div>
              )}
              <div className="text-gray-300 whitespace-pre-wrap">{entry.output}</div>
            </div>
          ))}
          <div ref={outputRef} />
        </div>

        {/* Input area */}
        <div
          className="flex items-center px-2 py-1 border-t border-gray-800 cursor-text"
          onClick={handleTerminalClick}
        >
          <span className="text-green-400 mr-2">$</span>
          <input
            ref={inputRef}
            type="text"
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent outline-none text-white"
            autoFocus
          />
          <span className="animate-pulse">_</span>
        </div>

        {/* Window indicators */}
        <div className="flex items-center gap-2 px-2 py-1 border-t border-gray-800 text-xs">
          <span className="text-gray-500">OPEN:</span>
          {openWindows.length === 0 ? (
            <span className="text-gray-600">NONE</span>
          ) : (
            openWindows.map((w) => (
              <span key={w.id} className="text-green-400">{w.title}</span>
            )).reduce((acc, curr) => acc ? <>{acc} | {curr}</> : curr, null as any) || null
          )}
        </div>
      </div>
    </>
  )
}
```

- [ ] **Step 2: Update page.tsx to use TerminalBar**

```tsx
// app/page.tsx
'use client'

import { useEffect } from 'react'
import Desktop from '@/components/window-manager/Desktop'
import TerminalBar from '@/components/terminal/TerminalBar'
import { WindowProvider, useWindowStore } from '@/components/window-manager/useWindows'
import Welcome from '@/components/windows/Welcome'
import CustomCursor from '@/components/ui/CustomCursor'

function AppContent() {
  const openWindow = useWindowStore((s) => s.openWindow)

  useEffect(() => {
    // Auto-open welcome window on load
    openWindow('welcome', 'Welcome', Welcome)
  }, [openWindow])

  return (
    <div className="h-screen w-screen overflow-hidden bg-black">
      <Desktop />
      <TerminalBar />
      <CustomCursor />
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

- [ ] **Step 3: Delete old Taskbar component**

Run: `rm components/window-manager/Taskbar.tsx`

- [ ] **Step 4: Test terminal commands**

Expected: `help` shows commands, `ls` lists windows, `open projects` opens Projects window, `clear` clears output, arrow keys navigate history

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add terminal command bar

Replaces Taskbar with TerminalBar that supports commands:
- open <name>: Open windows
- ls: List available windows
- close: Close active window
- clear: Clear terminal output
- help: Show commands
- Arrow keys: Navigate history"
```

---

## Task 2: Triple-Border Hover Effect

**Files:**
- Modify: `app/globals.css`

- [ ] **Step 1: Add triple-border hover CSS**

```css
/* app/globals.css - add after existing styles */

/* Triple-border hover effect - white → black gap → white */
@layer components {
  .triple-border-hover {
    position: relative;
    border: 2px solid transparent;
    transition: all 0.15s ease;
  }

  .triple-border-hover::before {
    content: '';
    position: absolute;
    inset: 0;
    border: 2px solid transparent;
    transition: all 0.15s ease;
    pointer-events: none;
  }

  .triple-border-hover:hover {
    border-color: white;
    box-shadow: 0 0 0 2px black, 0 0 0 4px white;
  }

  /* For buttons and clickable elements */
  button.triple-border-hover,
  a.triple-border-hover {
    border: 2px solid white;
  }

  button.triple-border-hover:hover,
  a.triple-border-hover:hover {
    background: white;
    color: black;
    box-shadow: 0 0 0 2px black, 0 0 0 4px white;
  }

  /* For desktop icons */
  .icon-triple-hover {
    border: 2px solid transparent;
    transition: all 0.15s ease;
  }

  .icon-triple-hover:hover {
    border-color: white;
    background: white;
    color: black;
    box-shadow: 0 0 0 2px black, 0 0 0 4px white;
  }
}
```

- [ ] **Step 2: Apply triple-border to clickable elements**

```tsx
// components/window-manager/Desktop.tsx - update button className
<button
  key={icon.id}
  onClick={() => handleIconClick(icon)}
  className="icon-triple-hover absolute flex flex-col items-center gap-1 p-2 transition-colors"
  style={{ left: icon.position.x, top: icon.position.y }}
>
  {/* ... rest of icon content ... */}
</button>

// components/terminal/TerminalBar.tsx - update window indicator spans
<span key={w.id} className="text-green-400 underline decoration-white decoration-2 underline-offset-2 hover:bg-white hover:text-black hover:px-1 transition-all cursor-pointer">
  {w.title}
</span>
```

- [ ] **Step 3: Test hover effects**

Expected: Hovering over desktop icons shows white border → black gap → outer white border. Same effect on buttons.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: add triple-border hover effect

White → black gap → outer white border on hover for brutalist contrast"
```

---

## Task 3: Pulsing Status Indicators

**Files:**
- Modify: `app/globals.css`
- Modify: `components/window-manager/Window.tsx`

- [ ] **Step 1: Add pulsing dot CSS animation**

```css
/* app/globals.css - add after existing styles */

/* Pulsing green status indicator */
@keyframes pulse-green {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.5;
    transform: scale(1.2);
  }
}

.status-pulse {
  display: inline-block;
  width: 8px;
  height: 8px;
  background: #00ff00;
  border-radius: 50%;
  animation: pulse-green 2s ease-in-out infinite;
}

/* Blinking cursor */
@keyframes blink-cursor {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

.cursor-blink {
  animation: blink-cursor 1s step-end infinite;
}
```

- [ ] **Step 2: Add pulsing indicator to window titlebars**

```tsx
// components/window-manager/Window.tsx - update titlebar JSX

<div
  onMouseDown={handleMouseDown}
  className="window-titlebar flex items-center justify-between bg-white text-black px-2 py-1 cursor-move select-none"
>
  <div className="flex items-center gap-2">
    <span className="status-pulse" />
    <span className="font-semibold">{windowState.title}</span>
  </div>
  {/* ... buttons ... */}
</div>
```

- [ ] **Step 3: Add pulsing indicator to terminal**

```tsx
// components/terminal/TerminalBar.tsx - add to input area
<div className="flex items-center px-2 py-1 border-t border-gray-800 cursor-text">
  <span className="status-pulse mr-2" />
  <span className="text-green-400 mr-2">$</span>
  {/* ... rest of input ... */}
</div>
```

- [ ] **Step 4: Test pulsing indicators**

Expected: Green dots pulse (scale + opacity) continuously on all window titlebars and terminal.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add pulsing status indicators

Green dots pulse on window titlebars and terminal for live feel"
```

---

## Task 4: CRT Effects (Flicker + RGB Shift)

**Files:**
- Modify: `app/globals.css`

- [ ] **Step 1: Add CRT effect CSS**

```css
/* app/globals.css - add after scanline effect */

/* CRT flicker effect */
@keyframes crt-flicker {
  0% { opacity: 0.97; }
  5% { opacity: 0.95; }
  10% { opacity: 0.9; }
  15% { opacity: 0.95; }
  20% { opacity: 0.99; }
  25% { opacity: 0.95; }
  30% { opacity: 0.9; }
  35% { opacity: 0.96; }
  40% { opacity: 0.98; }
  45% { opacity: 0.95; }
  50% { opacity: 0.99; }
  55% { opacity: 0.93; }
  60% { opacity: 0.9; }
  65% { opacity: 0.96; }
  70% { opacity: 0.98; }
  75% { opacity: 0.95; }
  80% { opacity: 0.99; }
  85% { opacity: 0.93; }
  90% { opacity: 0.95; }
  95% { opacity: 0.97; }
  100% { opacity: 0.99; }
}

/* Apply CRT flicker to main content */
body::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(18, 16, 16, 0.1);
  opacity: 0;
  pointer-events: none;
  z-index: 9998;
  animation: crt-flicker 0.15s infinite;
}

/* RGB color separation on edges (chromatic aberration) */
@keyframes rgb-shift {
  0%, 100% {
    text-shadow: -1px 0 rgba(255, 0, 0, 0.3), 1px 0 rgba(0, 255, 255, 0.3);
  }
  50% {
    text-shadow: 1px 0 rgba(255, 0, 0, 0.3), -1px 0 rgba(0, 255, 255, 0.3);
  }
}

.crt-text {
  animation: rgb-shift 3s ease-in-out infinite;
}
```

- [ ] **Step 2: Apply CRT text effect to headings**

```tsx
// Add .crt-text class to major headings in window components
// Example: components/windows/Welcome.tsx

<h1 className="crt-text text-2xl font-bold mb-4">WELCOME</h1>
```

- [ ] **Step 3: Test CRT effects**

Expected: Subtle screen flicker visible, text has slight RGB color shift that animates.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: add CRT flicker and RGB shift effects

Subtle screen flicker animation and chromatic aberration on text"
```

---

## Task 5: Terminal-Style Status Bar

**Files:**
- Create: `components/ui/StatusBar.tsx`
- Modify: `app/page.tsx`

- [ ] **Step 1: Create StatusBar component**

```tsx
// components/ui/StatusBar.tsx
'use client'

import { useState, useEffect } from 'react'

export default function StatusBar() {
  const [cpu, setCpu] = useState(45)
  const [mem, setMem] = useState(62)
  const [net, setNet] = useState('CONNECTED')

  useEffect(() => {
    // Randomly update stats every 2-4 seconds
    const interval = setInterval(() => {
      setCpu(Math.floor(Math.random() * 40) + 30) // 30-70%
      setMem(Math.floor(Math.random() * 30) + 50) // 50-80%
      setNet(Math.random() > 0.05 ? 'CONNECTED' : 'SYNCING...')
    }, Math.random() * 2000 + 2000)

    return () => clearInterval(interval)
  }, [])

  const renderBar = (value: number, char: string = '|') => {
    const filled = Math.floor(value / 10)
    const empty = 10 - filled
    return `${char.repeat(filled)}${'.'.repeat(empty)}`
  }

  return (
    <div className="fixed top-0 left-0 right-0 bg-black text-white text-xs font-mono border-b-2 border-white z-[10001] flex items-center justify-between px-2 py-1">
      <div className="flex items-center gap-4">
        <span className="text-green-400">SYSTEM_STATUS:</span>
        <span>CPU: [{renderBar(cpu)}] {cpu}%</span>
        <span>MEM: [{renderBar(mem)}] {mem}%</span>
        <span className={net === 'CONNECTED' ? 'text-green-400' : 'text-yellow-400'}>
          NET: {net}
        </span>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-gray-500">{new Date().toLocaleTimeString()}</span>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Add StatusBar to page**

```tsx
// app/page.tsx - import and add StatusBar
import StatusBar from '@/components/ui/StatusBar'

function AppContent() {
  // ... existing code ...

  return (
    <div className="h-screen w-screen overflow-hidden bg-black">
      <StatusBar />
      <div className="h-[calc(100%-24px)]"> {/* Adjust for status bar */}
        <Desktop />
        <TerminalBar />
        <CustomCursor />
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Test status bar**

Expected: Status bar at top shows CPU/MEM bars that update randomly, NET shows CONNECTED or SYNCING, clock shows time.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: add terminal-style status bar

Top bar shows animated CPU/MEM usage, network status, and time"
```

---

## Task 6: Typing Animation Hook

**Files:**
- Create: `hooks/useTypingAnimation.ts`
- Modify: `components/windows/Welcome.tsx`

- [ ] **Step 1: Create typing animation hook**

```ts
// hooks/useTypingAnimation.ts
import { useState, useEffect } from 'react'

export function useTypingAnimation(text: string, speed: number = 30, delay: number = 0) {
  const [displayText, setDisplayText] = useState('')
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    let timeout: NodeJS.Timeout

    const startTyping = () => {
      let index = 0

      const typeChar = () => {
        if (index < text.length) {
          setDisplayText(text.slice(0, index + 1))
          index++
          timeout = setTimeout(typeChar, speed)
        } else {
          setIsComplete(true)
        }
      }

      typeChar()
    }

    timeout = setTimeout(startTyping, delay)

    return () => clearTimeout(timeout)
  }, [text, speed, delay])

  return { displayText, isComplete }
}
```

- [ ] **Step 2: Apply to Welcome window**

```tsx
// components/windows/Welcome.tsx
import { useTypingAnimation } from '@/hooks/useTypingAnimation'

export default function Welcome() {
  const greeting = useTypingAnimation('Initializing portfolio interface...', 50, 0)
  const intro = useTypingAnimation('Welcome to my brutalist desktop.', 30, greeting.isComplete ? 100 : 2000)

  return (
    <div className="space-y-4">
      <p className="text-green-400">{greeting.displayText}<span className="cursor-blink">_</span></p>
      {greeting.isComplete && (
        <p>{intro.displayText}<span className="cursor-blink">_</span></p>
      )}
      {/* ... rest of content ... */}
    </div>
  )
}
```

- [ ] **Step 3: Test typing animation**

Expected: Text types out character by character, second line starts after first completes.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: add typing animation hook

Text types out character-by-character with blinking cursor"
```

---

## Task 7: Window Boot Animation

**Files:**
- Modify: `components/window-manager/Window.tsx`
- Modify: `app/globals.css`

- [ ] **Step 1: Add boot animation CSS**

```css
/* app/globals.css - add after existing animations */

@keyframes window-boot {
  0% {
    background: white;
    opacity: 1;
  }
  10% {
    background: white;
    opacity: 1;
  }
  15% {
    background: black;
    opacity: 1;
  }
  100% {
    background: black;
    opacity: 1;
  }
}

.window-booting {
  animation: window-boot 0.3s ease-out;
}
```

- [ ] **Step 2: Add boot state to Window component**

```tsx
// components/window-manager/Window.tsx - add boot state

const [isBooting, setIsBooting] = useState(true)

// Trigger boot animation on mount
useEffect(() => {
  const timer = setTimeout(() => setIsBooting(false), 300)
  return () => clearTimeout(timer)
}, [])

// Add booting class during animation
return (
  <div
    onClick={handleClick}
    className={`absolute flex flex-col border ${
      isActive ? 'border-white z-[9999]' : 'border-gray-600'
    } ${isBooting ? 'window-booting' : ''} bg-black`}
    style={{
      width: windowState.size.width,
      height: windowState.size.height,
      zIndex: windowState.zIndex,
      left: localPosition.x,
      top: localPosition.y,
    }}
  >
    {/* ... rest of window ... */}
  </div>
)
```

- [ ] **Step 3: Test boot animation**

Expected: Opening a window flashes white → black quickly, then content appears.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: add window boot animation

Windows flash white→black on open for BIOS boot feel"
```

---

## Task 8: Pulsing Grid Background

**Files:**
- Modify: `app/globals.css`
- Modify: `app/page.tsx`

- [ ] **Step 1: Add pulsing grid CSS**

```css
/* app/globals.css - add after existing effects */

@keyframes grid-pulse {
  0%, 100% { opacity: 0.03; }
  50% { opacity: 0.08; }
}

.pulsing-grid {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.5) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.5) 1px, transparent 1px);
  background-size: 40px 40px;
  pointer-events: none;
  z-index: 0;
  animation: grid-pulse 4s ease-in-out infinite;
}
```

- [ ] **Step 2: Add grid to page**

```tsx
// app/page.tsx - add grid element
function AppContent() {
  return (
    <div className="h-screen w-screen overflow-hidden bg-black relative">
      <div className="pulsing-grid" />
      <StatusBar />
      <div className="relative z-10">
        <Desktop />
      </div>
      <TerminalBar className="relative z-10" />
      <CustomCursor />
    </div>
  )
}
```

- [ ] **Step 3: Test pulsing grid**

Expected: Subtle grid pattern in background that fades in and out.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: add pulsing grid background

Subtle grid that breathes in background"
```

---

## Task 9: Glitch Effect on Hover

**Files:**
- Modify: `app/globals.css`
- Create: `hooks/useGlitchText.ts`
- Modify: `components/window-manager/Desktop.tsx`

- [ ] **Step 1: Add glitch CSS**

```css
/* app/globals.css - add glitch animations */

@keyframes glitch-skew {
  0% { transform: skew(0deg); }
  20% { transform: skew(-2deg); }
  40% { transform: skew(2deg); }
  60% { transform: skew(-1deg); }
  80% { transform: skew(1deg); }
  100% { transform: skew(0deg); }
}

.glitch-active {
  animation: glitch-skew 0.3s ease-out;
}
```

- [ ] **Step 2: Create glitch text hook**

```ts
// hooks/useGlitchText.ts
import { useState, useCallback } from 'react'

const glitchChars = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`'

export function useGlitchText(originalText: string) {
  const [displayText, setDisplayText] = useState(originalText)
  const [isGlitching, setIsGlitching] = useState(false)

  const triggerGlitch = useCallback(() => {
    if (isGlitching) return

    setIsGlitching(true)
    let iterations = 0
    const maxIterations = 5

    const glitchInterval = setInterval(() => {
      setDisplayText(
        originalText
          .split('')
          .map((char, i) => {
            if (Math.random() > 0.7) {
              return glitchChars[Math.floor(Math.random() * glitchChars.length)]
            }
            return char
          })
          .join('')
      )

      iterations++
      if (iterations >= maxIterations) {
        clearInterval(glitchInterval)
        setDisplayText(originalText)
        setTimeout(() => setIsGlitching(false), 100)
      }
    }, 50)

    return () => clearInterval(glitchInterval)
  }, [originalText, isGlitching])

  return { displayText, triggerGlitch, isGlitching }
}
```

- [ ] **Step 3: Apply to desktop icons**

```tsx
// components/window-manager/Desktop.tsx - use glitch hook
import { useGlitchText } from '@/hooks/useGlitchText'

export default function Desktop() {
  const openWindow = useWindowStore((s) => s.openWindow)

  return (
    <div className="relative h-full w-full">
      {icons.map((icon) => {
        const glitch = useGlitchText(icon.label)
        return (
          <button
            key={icon.id}
            onClick={() => handleIconClick(icon)}
            onMouseEnter={glitch.triggerGlitch}
            className={`icon-triple-hover absolute flex flex-col items-center gap-1 p-2 transition-colors ${glitch.isGlitching ? 'glitch-active' : ''}`}
            style={{ left: icon.position.x, top: icon.position.y }}
          >
            <div className="w-12 h-12 border border-current flex items-center justify-center text-2xl">
              {icon.label[0]}
            </div>
            <span className="text-xs">{glitch.displayText}</span>
          </button>
        )
      })}
    </div>
  )
}
```

- [ ] **Step 4: Test glitch effect**

Expected: Hovering over icons briefly shows random characters before settling on the original text.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add glitch effect on hover

Text briefly shows random characters on hover for cyberpunk feel"
```

---

## Task 10: Loading Bars for Window Open

**Files:**
- Modify: `components/window-manager/useWindows.tsx`
- Modify: `components/window-manager/Window.tsx`
- Modify: `app/globals.css`

- [ ] **Step 1: Add loading state to window store**

```ts
// components/window-manager/useWindows.tsx - add isLoading to WindowState

interface WindowState {
  id: WindowId
  title: string
  isOpen: boolean
  isMinimized: boolean
  isMaximized: boolean
  zIndex: number
  position: { x: number; y: number }
  size: { width: number; height: number }
  isLoading: boolean // Add this
  loadProgress: number // Add this
}

// Update initialWindowState
const initialWindowState = {
  isOpen: false,
  isMinimized: false,
  isMaximized: false,
  zIndex: 10,
  position: { x: 100 + Math.random() * 50, y: 100 + Math.random() * 50 },
  size: { width: 600, height: 400 },
  isLoading: false,
  loadProgress: 0
}

// Add setLoading and setLoadProgress actions
setLoading: (windowId: WindowId, loading: boolean) => void
setLoadProgress: (windowId: WindowId, progress: number) => void

// Implement in store
setLoading: (windowId, loading) => {
  set((state) => ({
    windows: {
      ...state.windows,
      [windowId]: {
        ...state.windows[windowId],
        isLoading: loading,
        loadProgress: loading ? 0 : 100
      }
    }
  }))
},
setLoadProgress: (windowId, progress) => {
  set((state) => ({
    windows: {
      ...state.windows,
      [windowId]: {
        ...state.windows[windowId],
        loadProgress: progress
      }
    }
  }))
}
```

- [ ] **Step 2: Add loading bar CSS**

```css
/* app/globals.css - add loading bar styles */

.loading-bar-container {
  width: 100%;
  height: 20px;
  background: #111;
  border: 1px solid white;
  position: relative;
  overflow: hidden;
}

.loading-bar-fill {
  height: 100%;
  background: white;
  transition: width 0.1s linear;
}

.loading-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 10px;
  font-family: monospace;
  color: white;
  text-shadow: 0 0 2px black;
}
```

- [ ] **Step 3: Add loading UI to Window component**

```tsx
// components/window-manager/Window.tsx - add loading state

const isLoading = windowState.isLoading
const loadProgress = windowState.loadProgress

// Simulate loading on mount
useEffect(() => {
  if (isLoading) {
    const interval = setInterval(() => {
      const newProgress = Math.min(loadProgress + Math.random() * 15, 100)
      updateWindowLoadProgress?.(windowId, newProgress)

      if (newProgress >= 100) {
        clearInterval(interval)
        setTimeout(() => {
          updateWindowLoading?.(windowId, false)
        }, 200)
      }
    }, 100)

    return () => clearInterval(interval)
  }
}, [isLoading, loadProgress, windowId])

// Add loading overlay
{isLoading && (
  <div className="absolute inset-0 bg-black z-50 flex flex-col items-center justify-center">
    <div className="loading-bar-container w-64">
      <div className="loading-bar-fill" style={{ width: `${loadProgress}%` }} />
      <span className="loading-text">LOADING: {Math.floor(loadProgress)}%</span>
    </div>
    <div className="mt-2 text-xs text-green-400 font-mono">
      {'> '.repeat(Math.floor(loadProgress / 10))}
    </div>
  </div>
)}
```

- [ ] **Step 4: Trigger loading when opening windows**

```tsx
// components/window-manager/useWindows.tsx - update openWindow

openWindow: (windowId, title, Content) => {
  set((state) => ({
    windows: {
      ...state.windows,
      [windowId]: {
        ...state.windows[windowId],
        title,
        isOpen: true,
        isLoading: true,
        loadProgress: 0
      }
    }
  }))
}
```

- [ ] **Step 5: Test loading bars**

Expected: Opening a window shows loading bar that fills from 0-100%, then window content appears.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add loading bars for window open

Windows show progress bar before content appears"
```

---

## Final Tasks

- [ ] **Step 1: Run dev server and test all features**

```bash
npm run dev
```

Expected: All features work together - terminal commands respond, hover effects show triple border, pulsing indicators animate, CRT flickers, status bar updates, typing animation plays, windows boot up, grid pulses, glitch triggers on hover, loading bars show.

- [ ] **Step 2: Final code review**

Check for:
- No TODO comments
- No console errors
- All animations are smooth
- Responsive behavior is acceptable

- [ ] **Step 3: Final commit**

```bash
git add -A
git commit -m "feat: complete alive-feel features

- Terminal command bar with history
- Triple-border hover effects
- Pulsing status indicators
- CRT flicker and RGB shift
- Terminal status bar with live stats
- Typing animation hook
- Window boot animation
- Pulsing grid background
- Glitch effect on hover
- Loading bars for windows"
```
