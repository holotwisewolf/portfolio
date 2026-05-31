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
