'use client'

// Corner brackets revealed on hover — positioned OUTSIDE the border so they
// read as camera focus marks, not part of the element's edge. Like a
// viewfinder framing the content.

export function BracketHover() {
  return (
    <>
      <span className="absolute -top-[4px] -left-[4px] w-3 h-3 border-t-2 border-l-2 border-white opacity-0 group-hover:opacity-100 transition-opacity" />
      <span className="absolute -top-[4px] -right-[4px] w-3 h-3 border-t-2 border-r-2 border-white opacity-0 group-hover:opacity-100 transition-opacity" />
      <span className="absolute -bottom-[4px] -left-[4px] w-3 h-3 border-b-2 border-l-2 border-white opacity-0 group-hover:opacity-100 transition-opacity" />
      <span className="absolute -bottom-[4px] -right-[4px] w-3 h-3 border-b-2 border-r-2 border-white opacity-0 group-hover:opacity-100 transition-opacity" />
    </>
  )
}
