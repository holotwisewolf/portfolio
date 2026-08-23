'use client'

// Fetches a JSON payload from /public/data at mount so demo datasets stay out of
// the initial JS bundle. Returns null until loaded.

import { useEffect, useState } from 'react'

export function useJson<T>(url: string): T | null {
  const [data, setData] = useState<T | null>(null)
  useEffect(() => {
    let alive = true
    fetch(url)
      .then((r) => r.json())
      .then((d) => { if (alive) setData(d as T) })
      .catch(() => {})
    return () => { alive = false }
  }, [url])
  return data
}
