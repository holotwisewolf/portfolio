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
