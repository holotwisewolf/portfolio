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
    openWindow(`blog-${post.slug}` as any)
  }

  return (
    <div className="h-full flex flex-col">
      <h2 className="crt-text text-2xl font-bold mb-6 border-b border-white pb-2">BLOG</h2>
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
