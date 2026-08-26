'use client'

import { useEffect, useState, useRef } from 'react'

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)
  const [isClicking, setIsClicking] = useState(false)
  const cursorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY })
    }

    const handleMouseDown = (e: MouseEvent) => {
      // Pressing a native scrollbar: the page gets no mousemove during the drag,
      // so hide the custom cursor for the duration — no frozen square, no
      // native hand. It returns on release.
      const target = e.target as HTMLElement
      const scroller = target.closest('.overflow-y-auto, .overflow-auto, .overflow-x-auto') as HTMLElement | null
      if (scroller && e.clientX > scroller.getBoundingClientRect().right - 16) {
        if (cursorRef.current) cursorRef.current.style.display = 'none'
        const restore = () => {
          if (cursorRef.current) cursorRef.current.style.display = ''
          window.removeEventListener('mouseup', restore)
        }
        window.addEventListener('mouseup', restore)
      }
      setIsClicking(true)
    }

    const handleMouseUp = () => {
      setIsClicking(false)
    }

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      // native resize handles show their own cursor — hide the custom one there
      if (target.className.toString().includes('resize')) {
        if (cursorRef.current) cursorRef.current.style.display = 'none'
        return
      }
      if (cursorRef.current && cursorRef.current.style.display === 'none') {
        cursorRef.current.style.display = ''
      }
      if (
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.classList.contains('cursor-pointer') ||
        target.classList.contains('window-titlebar') ||
        target.closest('button') ||
        target.closest('a')
      ) {
        setIsHovering(true)
      } else {
        setIsHovering(false)
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mouseup', handleMouseUp)
    window.addEventListener('mouseover', handleMouseOver)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mouseup', handleMouseUp)
      window.removeEventListener('mouseover', handleMouseOver)
    }
  }, [])

  const cursorClasses = `custom-cursor ${isHovering ? 'hover' : ''} ${isClicking ? 'clicking' : ''}`

  return (
    <div
      ref={cursorRef}
      className={cursorClasses}
      style={{ left: position.x, top: position.y, zIndex: 99999 }}
    />
  )
}
