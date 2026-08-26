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
    <div className="h-full bg-[#0a0a0a] border-r border-[#222] p-3 flex flex-col">
      <div className="text-[10px] tracking-[0.25em] text-[#ccc] uppercase pb-2 mb-3 border-b border-[#222]">
        Files
      </div>

      <div className="text-[10px] text-[#555] mb-2 font-orbit tracking-wide">
        {currentPath || '~/'}
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center text-[#777] text-xs">
          LOADING...
        </div>
      ) : items.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-[#777] text-xs">
          (empty)
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto text-xs font-mono">
          {items.map((item, index) => (
            <div
              key={index}
              className={`flex items-center justify-between py-1 px-1 hover:bg-white hover:text-black transition-colors cursor-pointer ${
                item.isDirectory ? 'text-[#999]' : 'text-[#999]'
              }`}
            >
              <span>{item.name}{item.isDirectory ? '/' : ''}</span>
              {!item.isDirectory && (
                <span className="text-[#777]">
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
