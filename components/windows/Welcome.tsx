'use client'

import { useTypingAnimation } from '@/hooks/useTypingAnimation'

export default function Welcome() {
  const greeting = useTypingAnimation('> initializing portfolio...', 50, 0)
  const intro = useTypingAnimation('Welcome to my brutalist desktop.', 30, greeting.isComplete ? 100 : 2000)

  return (
    <div className="h-full flex flex-col justify-center items-center gap-8">
      <h1 className="crt-text text-4xl font-bold">PORTFOLIO</h1>
      <div className="text-lg font-mono space-y-2">
        <p className="text-[#00ff9d]">
          {greeting.displayText}<span className="animate-pulse">_</span>
        </p>
        {greeting.isComplete && (
          <p>
            {intro.displayText}<span className="animate-pulse">_</span>
          </p>
        )}
      </div>
      <div className="text-sm opacity-70">
        Double-click desktop icons to open windows
      </div>
    </div>
  )
}
