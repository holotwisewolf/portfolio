'use client'

import { useState } from 'react'

export default function Admin() {
  const [authenticated, setAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [rating, setRating] = useState(5)
  const [content, setContent] = useState('')
  const [message, setMessage] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    // In production, verify against API
    setAuthenticated(true)
  }

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'publish',
          password,
          postData: { title, author, rating, content },
        }),
      })

      const data = await response.json()

      if (data.success) {
        setMessage('Post published successfully!')
        setTitle('')
        setAuthor('')
        setContent('')
        setRating(5)
      } else {
        setMessage('Failed to publish: ' + data.error)
      }
    } catch (error) {
      setMessage('Error publishing post')
    }
  }

  if (!authenticated) {
    return (
      <div className="h-full flex items-center justify-center">
        <form onSubmit={handleLogin} className="w-full max-w-sm space-y-4">
          <h2 className="crt-text text-xl font-bold">Admin Login</h2>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full p-2 bg-black border border-white text-white"
            required
          />
          <button
            type="submit"
            className="w-full p-2 bg-white text-black hover:bg-gray-300"
          >
            Login
          </button>
        </form>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      <h2 className="crt-text text-2xl font-bold mb-6 border-b border-white pb-2">ADMIN</h2>

      <form onSubmit={handlePublish} className="space-y-4 flex-1 flex flex-col">
        <div>
          <label className="block text-sm mb-1">Book Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 bg-black border border-white text-white"
            required
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Author</label>
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="w-full p-2 bg-black border border-white text-white"
            required
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Rating (1-5)</label>
          <select
            value={rating}
            onChange={(e) => setRating(parseInt(e.target.value))}
            className="w-full p-2 bg-black border border-white text-white"
          >
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>
                {'★'.repeat(n)}{'☆'.repeat(5 - n)}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1">
          <label className="block text-sm mb-1">Content (Markdown supported)</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-full min-h-[200px] p-2 bg-black border border-white text-white font-mono text-sm resize-none"
            placeholder="## Summary&#10;&#10;Write your review here..."
            required
          />
        </div>

        {message && (
          <div className={`text-sm ${message.includes('success') ? 'text-green-500' : 'text-red-500'}`}>
            {message}
          </div>
        )}

        <button
          type="submit"
          className="w-full p-3 bg-white text-black hover:bg-gray-300 font-semibold"
        >
          Publish Post
        </button>
      </form>
    </div>
  )
}
