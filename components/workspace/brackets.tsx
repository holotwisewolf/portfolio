'use client'

// Corner brackets revealed on hover — elements "select" like print crop marks.
// Shared by FolderView and the gallery grids.

export function BracketHover() {
  return (
    <>
      <span className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#00ff9d] opacity-0 group-hover:opacity-100 transition-opacity" />
      <span className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#00ff9d] opacity-0 group-hover:opacity-100 transition-opacity" />
      <span className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[#00ff9d] opacity-0 group-hover:opacity-100 transition-opacity" />
      <span className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#00ff9d] opacity-0 group-hover:opacity-100 transition-opacity" />
    </>
  )
}
