'use client'

import { useState, useEffect } from 'react'

interface FileItem {
  name: string
  isDirectory: boolean
  size: number | null
}

interface FileListingProps {
  currentPath: string
}

export default function FileListing({ currentPath }: FileListingProps) {
  const [items, setItems] = useState<FileItem[]>([])
  const [loading, setLoading] = useState(false)

  const fetchFiles = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/files?path=${encodeURIComponent(currentPath)}&cmd=list`)
      const data = await res.json()
      if (data.items) {
        setItems(data.items)
      }
    } catch (error) {
      console.error('Failed to fetch files:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFiles()
  }, [currentPath])

  return (
    <div className="h-full bg-black border-r-2 border-white p-2 flex flex-col">
      <h2 className="text-white text-sm font-bold mb-2 border-b border-white pb-1">
        FILES
      </h2>

      <div className="text-xs text-blue-400 mb-2 font-mono">
        {currentPath || '~/'}
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center text-gray-500 text-xs">
          LOADING...
        </div>
      ) : items.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-gray-500 text-xs">
          (empty)
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto text-xs font-mono">
          {items.map((item, index) => (
            <div
              key={index}
              className={`flex items-center justify-between py-1 px-1 hover:bg-white hover:text-black transition-colors cursor-pointer ${
                item.isDirectory ? 'text-blue-300' : 'text-gray-300'
              }`}
            >
              <span>{item.name}{item.isDirectory ? '/' : ''}</span>
              {!item.isDirectory && (
                <span className="text-gray-500">
                  {item.size ? `${item.size}B` : ''}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
