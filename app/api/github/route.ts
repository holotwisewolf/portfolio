import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Replace with your actual GitHub username
    const username = process.env.GITHUB_USERNAME || 'your-username'

    const headers: Record<string, string> = {
      'User-Agent': 'Portfolio-Stats',
      'X-GitHub-Api-Version': '2022-11-28',
    }

    // Add token if available (for higher rate limits)
    if (process.env.GITHUB_TOKEN) {
      headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`
    }

    const response = await fetch(`https://api.github.com/users/${username}`, {
      headers,
    })

    if (!response.ok) {
      throw new Error('GitHub API request failed')
    }

    const data = await response.json()

    return NextResponse.json({
      publicRepos: data.public_repos || 0,
      followers: data.followers || 0,
      following: data.following || 0,
      bio: data.bio || '',
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch GitHub stats' },
      { status: 500 }
    )
  }
}
