import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const contentDirectory = path.join(process.cwd(), 'content', 'blog')

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { action, password, postData } = body

    // Simple password check
    if (password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (action === 'publish') {
      const { title, author, rating, content } = postData
      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-')
      const filename = `${slug}.mdx`
      const filepath = path.join(contentDirectory, filename)

      const frontmatter = `---
title: "${title}"
author: "${author}"
rating: ${rating}
date: "${new Date().toISOString().split('T')[0]}"
readTime: "${Math.ceil(content.split(' ').length / 200)} min read"
---

${content}
`

      fs.writeFileSync(filepath, frontmatter)

      return NextResponse.json({ success: true, slug })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
