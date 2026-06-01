import { NextRequest, NextResponse } from 'next/server'

interface HistoricalPoint {
  time: string
  price: number
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const symbols = searchParams.get('symbols')?.split(',') || ['SPY', 'QQQ']

  try {
    // Fetch real historical candles (30-min intervals for today)
    const quotes = await Promise.all(
      symbols.map(async (symbol) => {
        const res = await fetch(
          `https://query1.finance.yahoo.com/v8/finance/chart/${symbol.trim()}?interval=30m&range=1d`,
          { headers: { 'User-Agent': 'Mozilla/5.0' } }
        )
        const data = await res.json()

        const result = data.chart?.result?.[0]
        const meta = result?.meta
        const quotes = result?.indicators?.quote?.[0]

        if (!meta || !quotes) {
          return { symbol: symbol.trim().toUpperCase(), price: null, historical: [] }
        }

        const currentPrice = meta.regularMarketPrice || meta.previousClose
        const timestamps = quotes.timestamp || []
        const closes = quotes.close || []

        // Build historical data from real candles
        const historical: HistoricalPoint[] = []
        const now = Date.now() / 1000

        // Get last 9 data points (last 4.5 hours)
        const startIndex = Math.max(0, timestamps.length - 9)

        for (let i = startIndex; i < timestamps.length; i++) {
          const price = closes[i]
          if (price && timestamps[i]) {
            const hoursAgo = Math.round((now - timestamps[i]) / 3600)
            historical.push({
              time: hoursAgo === 0 ? 'now' : `${hoursAgo}h`,
              price: parseFloat(price.toFixed(2))
            })
          }
        }

        // Always add current price as "now" if not present
        if (historical.length === 0 || historical[historical.length - 1].time !== 'now') {
          historical.push({
            time: 'now',
            price: parseFloat(currentPrice.toFixed(2))
          })
        }

        return {
          symbol: symbol.trim().toUpperCase(),
          price: currentPrice,
          change: currentPrice - meta.previousClose,
          changePercent: ((currentPrice - meta.previousClose) / meta.previousClose) * 100,
          historical
        }
      })
    )

    return NextResponse.json({ quotes })
  } catch (error) {
    // Return fallback data on error
    return NextResponse.json({
      quotes: symbols.map(s => ({
        symbol: s.trim().toUpperCase(),
        price: null,
        historical: [],
        error: 'Failed to fetch'
      }))
    })
  }
}
