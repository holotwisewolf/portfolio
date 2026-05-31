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
              <span key={w.id} className="icon-triple-hover text-green-400 px-1 cursor-pointer">{w.title}</span>
            )).reduce((acc, curr) => acc ? <>{acc} | {curr}</> : curr, null as any) || null
          )}
        </div>
      </div>
    </>
  )
}
