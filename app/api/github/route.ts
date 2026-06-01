import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Replace with your actual GitHub username
    const username = 'your-username' // TODO: Set your GitHub username

    const response = await fetch(`https://api.github.com/users/${username}`, {
      headers: {
        'User-Agent': 'Portfolio-Stats',
        // Optional: Add a GitHub personal access token for higher rate limits
        // 'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
      },
    })

    if (!response.ok) {
      throw new Error('GitHub API request failed')
    }

    const data = await response.json()

    return NextResponse.json({
      publicRepos: data.public_repos || 0,
      followers: data.followers || 0,
      // Note: GitHub doesn't provide total commits or stars via user API
      // Those would require additional API calls to repositories
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch GitHub stats' },
      { status: 500 }
    )
  }
}
