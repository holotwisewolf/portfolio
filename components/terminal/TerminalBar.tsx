'use client'

import { useState, useRef, useEffect } from 'react'
import { useWindowStore } from '../window-manager/useWindows'

interface CommandEntry {
  input: string
  output: string
  timestamp: Date
}

interface TerminalBarProps {
  onPathChange?: (path: string) => void
}

export default function TerminalBar({ onPathChange }: TerminalBarProps) {
  const [commandHistory, setCommandHistory] = useState<CommandEntry[]>([
    { input: '', output: 'TERMINAL READY. TYPE "help" FOR COMMANDS.', timestamp: new Date() }
  ])
  const [currentInput, setCurrentInput] = useState('')
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [currentPath, setCurrentPath] = useState('')
  const [isExpanded, setIsExpanded] = useState(false) // Shows output area
  const [isMinimized, setIsMinimized] = useState(false) // Minimized to tiny bar
  const [terminalHeight, setTerminalHeight] = useState(192) // 48 * 4 (max-h-48 in px)
  const [isResizing, setIsResizing] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const outputRef = useRef<HTMLDivElement>(null)

  const windows = useWindowStore((s) => s.windows)
  const openWindow = useWindowStore((s) => s.openWindow)
  const closeWindow = useWindowStore((s) => s.closeWindow)
  const restoreWindow = useWindowStore((s) => s.restoreWindow)

  const availableWindows = ['welcome', 'projects', 'blog', 'about', 'admin']

  // Auto-scroll to bottom when new output
  useEffect(() => {
    outputRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [commandHistory])

  // Notify parent of path changes
  useEffect(() => {
    onPathChange?.(currentPath)
  }, [currentPath, onPathChange])

  const executeCommand = async (cmd: string) => {
    const trimmed = cmd.trim()
    const parts = trimmed.split(' ')
    const command = parts[0].toLowerCase()
    let output = ''

    if (command === 'help') {
      output = `AVAILABLE COMMANDS:
  cd <dir>    - Change directory
  ls          - List files in current directory
  cat <file>  - View file contents
  open <name> - Open a window (welcome, projects, blog, about, admin)
  close       - Close active window
  clear       - Clear terminal
  help        - Show this message`
    } else if (command === 'cd') {
      const targetDir = parts[1]
      if (!targetDir) {
        output = 'Usage: cd <directory>'
      } else if (targetDir === '..') {
        const newPath = currentPath.split('/').filter(Boolean).slice(0, -1).join('/')
        setCurrentPath(newPath)
        output = `Changed to: ${newPath || '/'}`
      } else if (targetDir === '/') {
        setCurrentPath('')
        output = 'Changed to: /'
      } else {
        const newPath = currentPath ? `${currentPath}/${targetDir}` : targetDir
        try {
          const res = await fetch(`/api/files?path=${encodeURIComponent(newPath)}&cmd=exists`)
          const data = await res.json()
          if (data.exists) {
            setCurrentPath(newPath)
            output = `Changed to: ${newPath}`
          } else {
            output = `Directory not found: ${targetDir}`
          }
        } catch {
          output = `Error checking directory: ${targetDir}`
        }
      }
    } else if (command === 'ls') {
      try {
        const res = await fetch(`/api/files?path=${encodeURIComponent(currentPath)}&cmd=list`)
        const data = await res.json()
        if (data.items) {
          const dirs = data.items.filter((i: any) => i.isDirectory).map((i: any) => i.name + '/')
          const files = data.items.filter((i: any) => !i.isDirectory).map((i: any) => i.name)
          output = [...dirs, ...files].join('  ') || '(empty)'
        } else {
          output = 'Error listing directory'
        }
      } catch {
        output = 'Error listing directory'
      }
    } else if (command === 'cat') {
      const filename = parts[1]
      if (!filename) {
        output = 'Usage: cat <filename>'
      } else {
        try {
          const res = await fetch(`/api/files?path=${encodeURIComponent(currentPath)}&cmd=read&file=${encodeURIComponent(filename)}`)
          const data = await res.json()
          if (data.error) {
            output = `Error: ${data.error}`
          } else {
            output = data.content + (data.truncated ? '\n...(truncated)' : '')
          }
        } catch {
          output = `Error reading file: ${filename}`
        }
      }
    } else if (command === 'clear') {
      setCommandHistory([{ input: '', output: 'TERMINAL CLEARED.', timestamp: new Date() }])
      setCurrentInput('')
      return
    } else if (command === 'close') {
      const openWindows = Object.values(windows).filter(w => w.isOpen)
      if (openWindows.length > 0) {
        closeWindow(openWindows[openWindows.length - 1].id)
        output = `Closed: ${openWindows[openWindows.length - 1].title}`
      } else {
        output = 'No windows open.'
      }
    } else if (command.startsWith('open ')) {
      const target = command.replace('open ', '').trim()
      if (availableWindows.includes(target)) {
        openWindow(target as any)
        output = `Opening: ${target.toUpperCase()}...`
      } else {
        output = `Unknown window: ${target}. Type "help" for available windows.`
      }
    } else if (trimmed === '') {
      return
    } else {
      output = `Unknown command: ${command}. Type "help" for available commands.`
    }

    setCommandHistory(prev => [...prev, { input: cmd, output, timestamp: new Date() }])
    setCurrentInput('')
    // Auto-expand terminal when command executes
    setIsExpanded(true)
    setIsMinimized(false)
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

  const toggleExpand = () => {
    setIsExpanded(!isExpanded)
    inputRef.current?.focus()
  }

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized)
    inputRef.current?.focus()
  }

  // Terminal resize handlers
  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsResizing(true)
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isResizing) {
        const newHeight = window.innerHeight - e.clientY
        // min 84 keeps the input + OPEN rows visible; max 600 caps at the old ceiling
        setTerminalHeight(Math.max(84, Math.min(600, newHeight)))
      }
    }

    const handleMouseUp = () => {
      setIsResizing(false)
    }

    if (isResizing) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
      return () => {
        window.removeEventListener('mousemove', handleMouseMove)
        window.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isResizing])

  const openWindows = Object.values(windows).filter(w => w.isOpen && !w.isMinimized)
  const minimizedWindows = Object.values(windows).filter(w => w.isOpen && w.isMinimized)

  const handleRestoreWindow = (id: string) => {
    restoreWindow(id as any)
  }

  const handleFocusWindow = (id: string) => {
    // Window will be focused by click in the Window component itself
    // This is just a visual indicator
  }

  return (
    <>
      {/* Terminal Bar */}
      <div
        id="terminal-bar"
        className="bg-[#0a0a0a] text-[#999] font-orbit text-[11px] border-t border-white flex flex-col overflow-hidden"
        style={{
          zIndex: 10000,
          height: isMinimized ? 28 : `${terminalHeight}px`,
          transition: isResizing ? 'none' : 'height 300ms ease-in-out',
        }}
      >
        {/* Resize handle - both directions supported */}
        {!isMinimized && (
          <div
            onMouseDown={handleResizeStart}
            className="relative top-0 left-0 right-0 h-1 cursor-ns-resize z-10 hover:bg-white/40"
            title="Drag to resize terminal"
          />
        )}

        {/* Output area - full when expanded, single line when collapsed */}
        {!isMinimized && (
          <div className="flex-1 min-h-0 overflow-hidden px-2 py-1">
            {isExpanded ? (
              <div className="h-full overflow-y-auto">
                {commandHistory.map((entry, i) => (
                  <div key={i}>
                    {entry.input && (
                      <div className="text-[#00ff9d]">
                        <span className="text-white">$</span>
                        <span className="text-[#777] mx-1">{currentPath || '~'}</span>
                        <span className="text-white">&gt;</span> {entry.input}
                      </div>
                    )}
                    <div className="text-[#999] text-[12px] whitespace-pre-wrap">{entry.output}</div>
                  </div>
                ))}
                <div ref={outputRef} />
              </div>
            ) : (
              // Show only last line when collapsed - SAME structure as expanded
              <div>
                <div className="text-[#999] text-[12px] whitespace-pre-wrap">
                  {commandHistory[commandHistory.length - 1]?.output.split('\n').slice(-1)[0] || 'TERMINAL READY'}
                </div>
                <div ref={outputRef} />
              </div>
            )}
          </div>
        )}

        {/* Active line with block cursor - always visible unless minimized */}
        {!isMinimized && (
          <div className="flex items-center px-2 py-1 text-white border-t border-[#2e2e2e]">
            <span className="text-[#00ff9d] mr-2">$</span>
            <span className="text-[#777] mr-2">{currentPath || '~'}</span>
            <span className="text-white mr-2">&gt;</span>
            <span className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="absolute inset-0 w-full h-full bg-transparent outline-none text-white opacity-0 cursor-text"
                autoFocus
              />
              <span className="text-[#5b9bd5]">
                {currentInput}<span className="block-cursor"></span>
              </span>
            </span>
            <button
              onClick={() => { setCurrentInput(''); inputRef.current?.focus() }}
              className="ml-2 px-2 py-[3px] leading-none text-[10px] border border-[#333] hover:border-[#ef4444] hover:text-[#ef4444] text-[#999] transition-colors"
              title="Clear input"
            >
              x
            </button>
            <button
              onClick={toggleMinimize}
              className="ml-1 px-2 py-[3px] leading-none text-[10px] border border-[#333] hover:border-white hover:text-white text-[#999] transition-colors"
              title={isMinimized ? 'Restore' : 'Minimize'}
            >
              {isMinimized ? '□' : '–'}
            </button>
          </div>
        )}

        {/* Minimized bar - tabs + bookmark restore tab */}
        {isMinimized && (
          <div className="relative flex items-center gap-2 px-2 text-white h-7 overflow-visible">
            <span className="text-[#555] text-[10px] tracking-[0.15em] leading-none">TABS:</span>
            {openWindows.length === 0 ? (
              <span className="text-[#444] text-[10px] leading-none">NONE</span>
            ) : (
              openWindows.map((w) => (
                <span
                  key={w.id}
                  className="text-[#00ff9d] px-1 text-[10px] leading-none cursor-pointer hover:text-white transition-colors"
                  onClick={() => handleFocusWindow(w.id)}
                >
                  {w.title}
                </span>
              ))
            )}
            {/* restore tab: thin handle on the top border, right-aligned */}
            <button
              onClick={toggleMinimize}
              className="group absolute right-3 -top-[5px] h-[5px] w-14 bg-[#555] hover:bg-[#00ff9d] transition-colors"
              title="Restore terminal"
            >
              <span className="absolute -bottom-[14px] left-1/2 -translate-x-1/2 text-[7px] text-[#444] group-hover:text-[#00ff9d] leading-none transition-colors opacity-0 group-hover:opacity-100">
                ▲
              </span>
            </button>
          </div>
        )}

        {/* Window indicators - hidden when minimized */}
        {!isMinimized && (
          <div className="flex items-center gap-2 px-2 h-7 border-t border-[#1c1c1c]">
            <span className="text-[#555] text-[10px] tracking-[0.15em] leading-none">TABS:</span>
            {openWindows.length === 0 ? (
              <span className="text-[#444] text-[10px] leading-none">NONE</span>
            ) : (
              openWindows.map((w) => (
                <span key={w.id} className="text-[#00ff9d] px-1 text-[10px] leading-none cursor-pointer hover:text-white transition-colors">{w.title}</span>
              )).reduce((acc, curr) => acc ? <>{acc} | {curr}</> : curr, null as any) || null
            )}
          </div>
        )}

        {/* Minimized windows - always visible */}
        {minimizedWindows.length > 0 && (
          <div className={`flex items-center gap-2 px-2 py-1 border-t border-[#1c1c1c] text-xs ${isMinimized ? 'border-t-0' : ''}`}>
            <span className="text-[#555]">MINIMIZED:</span>
            {minimizedWindows.map((w) => (
              <button
                key={w.id}
                onClick={() => handleRestoreWindow(w.id)}
                className="icon-triple-hover text-[#666] px-1 hover:text-white transition-colors text-xs"
              >
                {w.title}
              </button>
            )).reduce((acc, curr) => acc ? <>{acc} | {curr}</> : curr, null as any) || null}
          </div>
        )}
      </div>
    </>
  )
}
