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
      <h1 className="crt-text text-4xl font-bold">PORTFOLIO</h1>
      <div className="text-lg font-mono">{text}</div>
      <div className="text-sm opacity-70">
        Double-click desktop icons to open windows
      </div>
    </div>
  )
}
