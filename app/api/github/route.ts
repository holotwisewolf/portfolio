import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const username = process.env.GITHUB_USERNAME || 'your-username'

    const headers: Record<string, string> = {
      'User-Agent': 'Portfolio-Stats',
      'X-GitHub-Api-Version': '2022-11-28',
    }

    if (process.env.GITHUB_TOKEN) {
      headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`
    }

    // Fetch user profile
    const userResponse = await fetch(`https://api.github.com/users/${username}`, { headers })
    if (!userResponse.ok) {
      throw new Error('GitHub API request failed')
    }
    const userData = await userResponse.json()

    // Fetch user's repos
    const reposResponse = await fetch(
      `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`,
      { headers }
    )

    let languages: Record<string, number> = {}

    if (reposResponse.ok) {
      const repos = await reposResponse.json()

      // Fetch languages for each repo (limited to first 30 to avoid rate limits)
      const languagePrompts = repos.slice(0, 30).map(async (repo: any) => {
        try {
          const langResponse = await fetch(repo.languages_url, { headers })
          if (langResponse.ok) {
            const repoLangs = await langResponse.json()
            return repoLangs
          }
        } catch {
          return {}
        }
        return {}
      })

      const allLanguages = await Promise.all(languagePrompts)

      // Aggregate all languages
      for (const repoLangs of allLanguages) {
        for (const [lang, bytes] of Object.entries(repoLangs)) {
          languages[lang] = (languages[lang] || 0) + (bytes as number)
        }
      }
    }

    // Convert to percentages
    const totalBytes = Object.values(languages).reduce((sum, bytes) => sum + bytes, 0)
    const languagePercentages = Object.entries(languages)
      .map(([lang, bytes]) => ({ language: lang, percentage: Math.round((bytes / totalBytes) * 100) }))
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, 5) // Top 5 languages

    // Fetch commit activity (last 35 days)
    const activityResponse = await fetch(
      `https://api.github.com/users/${username}/events/public?per_page=100`,
      { headers }
    )

    let commitActivity: number[] = new Array(35).fill(0)

    if (activityResponse.ok) {
      const events = await activityResponse.json()

      // Calculate commits per day for last 35 days
      const now = Date.now() / 1000
      const daySeconds = 24 * 60 * 60

      for (const event of events) {
        if (event.type === 'PushEvent') {
          const eventTime = new Date(event.created_at).getTime() / 1000
          const daysAgo = Math.floor((now - eventTime) / daySeconds)

          if (daysAgo >= 0 && daysAgo < 35) {
            // Count commits in this push (size = number of commits)
            const commitCount = event.payload?.size || 1
            commitActivity[34 - daysAgo] += commitCount
          }
        }
      }
    }

    return NextResponse.json({
      publicRepos: userData.public_repos || 0,
      followers: userData.followers || 0,
      following: userData.following || 0,
      bio: userData.bio || '',
      commitActivity,
      languages: languagePercentages
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch GitHub stats' },
      { status: 500 }
    )
  }
}
