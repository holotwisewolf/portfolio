'use client'

import { useEffect, useState } from 'react'

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
        <h2 className="crt-text text-2xl font-bold mb-2">{frontmatter?.title}</h2>
        <p className="opacity-70 mb-2">by {frontmatter?.author}</p>
        <div className="text-[#eab308]">{stars}</div>
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
