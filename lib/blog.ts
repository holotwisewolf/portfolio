import fs from 'fs'
import path from 'path'

const contentDirectory = path.join(process.cwd(), 'content', 'blog')

export interface BlogPost {
  slug: string
  title: string
  author: string // book author
  rating: number
  date: string
  readTime: string
  excerpt: string
}

export function getAllBlogPosts(): BlogPost[] {
  const fullPath = path.join(process.cwd(), 'content', 'blog')
  const filenames = fs.readdirSync(fullPath)

  const posts = filenames
    .filter((name) => name.endsWith('.mdx'))
    .map((filename) => {
      const slug = filename.replace(/\.mdx$/, '')
      // For now, return minimal data
      // In production, parse frontmatter from MDX
      return {
        slug,
        title: 'Sample Book Review',
        author: 'Author Name',
        rating: 4,
        date: new Date().toISOString().split('T')[0],
        readTime: '5 min read',
        excerpt: 'A brief summary of the book and its key takeaways...',
      }
    })

  return posts.sort((a, b) => (a.date > b.date ? -1 : 1))
}

export async function getBlogPost(slug: string) {
  try {
    const fullPath = path.join(contentDirectory, `${slug}.mdx`)
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    return {
      slug,
      content: fileContents,
    }
  } catch {
    return null
  }
}
