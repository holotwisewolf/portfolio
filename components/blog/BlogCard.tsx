import type { BlogPost } from '@/lib/blog'

interface BlogCardProps {
  post: BlogPost
  onClick: () => void
}

export default function BlogCard({ post, onClick }: BlogCardProps) {
  const stars = '★'.repeat(post.rating) + '☆'.repeat(5 - post.rating)

  return (
    <button
      onClick={onClick}
      className="text-left p-4 border border-white hover:bg-white hover:text-black transition-colors w-full"
    >
      <h3 className="text-lg font-semibold mb-1">{post.title}</h3>
      <p className="text-sm opacity-70 mb-2">by {post.author}</p>
      <div className="text-yellow-500 mb-2">{stars}</div>
      <p className="text-sm opacity-80 mb-2">{post.excerpt}</p>
      <div className="text-xs opacity-60 flex gap-4">
        <span>{post.date}</span>
        <span>{post.readTime}</span>
      </div>
    </button>
  )
}
