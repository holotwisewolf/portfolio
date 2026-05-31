import { NextRequest, NextResponse } from 'next/server'
import { readdir, stat, readFile } from 'fs/promises'
import { join } from 'path'

// Security: Only allow access to portfolio directory
const PORTFOLIO_ROOT = process.cwd()

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const path = searchParams.get('path') || ''
  const command = searchParams.get('cmd') || 'list' // list, read, exists

  // Resolve and ensure path is within portfolio directory
  const resolvedPath = join(PORTFOLIO_ROOT, path).replace(/\\/g, '/')
  const normalizedResolved = resolvedPath.toLowerCase()
  const normalizedRoot = PORTFOLIO_ROOT.toLowerCase()

  if (!normalizedResolved.startsWith(normalizedRoot)) {
    return NextResponse.json({ error: 'Access denied' }, { status: 403 })
  }

  try {
    if (command === 'list') {
      const entries = await readdir(resolvedPath, { withFileTypes: true })
      const items = await Promise.all(
        entries.map(async (entry) => {
          const fullPath = join(resolvedPath, entry.name)
          const stats = await stat(fullPath)

          // Skip node_modules and .git
          if (entry.name === 'node_modules' || entry.name === '.git' || entry.name === '.next') {
            return null
          }

          return {
            name: entry.name,
            isDirectory: entry.isDirectory(),
            size: entry.isDirectory() ? null : stats.size
          }
        })
      )

      // Filter nulls and sort (directories first, then alphabetically)
      const filtered = items.filter((item): item is NonNullable<typeof item> => item !== null)
      filtered.sort((a, b) => {
        if (a.isDirectory !== b.isDirectory) {
          return a.isDirectory ? -1 : 1
        }
        return a.name.localeCompare(b.name)
      })

      return NextResponse.json({ items: filtered, currentPath: path || '/' })
    } else if (command === 'read') {
      const filename = searchParams.get('file')
      if (!filename) {
        return NextResponse.json({ error: 'No file specified' }, { status: 400 })
      }

      const filePath = join(resolvedPath, filename)
      const content = await readFile(filePath, 'utf-8')

      // Only show first 500 chars for preview
      const preview = content.slice(0, 500)
      const isTruncated = content.length > 500

      return NextResponse.json({
        content: preview,
        truncated: isTruncated,
        size: content.length
      })
    } else if (command === 'exists') {
      const filename = searchParams.get('file')
      if (!filename) {
        return NextResponse.json({ error: 'No file specified' }, { status: 400 })
      }

      try {
        const filePath = join(resolvedPath, filename)
        await stat(filePath)
        return NextResponse.json({ exists: true })
      } catch {
        return NextResponse.json({ exists: false })
      }
    }

    return NextResponse.json({ error: 'Unknown command' }, { status: 400 })
  } catch (error) {
    return NextResponse.json({ error: 'Operation failed' }, { status: 500 })
  }
}
