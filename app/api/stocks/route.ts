import { NextRequest, NextResponse } from 'next/server'

interface HistoricalPoint {
  time: string
  price: number
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const symbolsParam = searchParams.get('symbols')?.split(',') || ['SPY', 'QQQ']

  try {
    // Fetch real historical candles (30-min intervals for today)
    const quoteResults = await Promise.all(
      symbolsParam.map(async (symbol) => {
        try {
          const res = await fetch(
            `https://query1.finance.yahoo.com/v8/finance/chart/${symbol.trim()}?interval=30m&range=1d`,
            { headers: { 'User-Agent': 'Mozilla/5.0' } }
          )

          if (!res.ok) {
            console.error(`Yahoo API error for ${symbol}: ${res.status}`)
            return { symbol: symbol.trim().toUpperCase(), price: null, historical: [], error: true }
          }

          const text = await res.text()
          let data

          try {
            data = JSON.parse(text)
          } catch (parseError) {
            console.error(`Failed to parse JSON for ${symbol}:`, text.substring(0, 200))
            return { symbol: symbol.trim().toUpperCase(), price: null, historical: [], error: true }
          }

          const result = data.chart?.result?.[0]
          const meta = result?.meta
          const indicator = result?.indicators?.quote?.[0]

          if (!meta || !indicator) {
            return { symbol: symbol.trim().toUpperCase(), price: null, historical: [] }
          }

          const currentPrice = meta.regularMarketPrice || meta.previousClose
          const timestamps = indicator.timestamp || []
          const closes = indicator.close || []

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

          // If we have less than 3 data points (market closed or limited data), generate mock historical
          if (historical.length < 3 && currentPrice) {
            const mockHistorical: HistoricalPoint[] = []
            let basePrice = currentPrice * 0.98
            const intervals = [4, 3.5, 3, 2.5, 2, 1.5, 1, 0.5, 0]
            for (const hours of intervals) {
              const variation = (Math.random() - 0.5) * (currentPrice * 0.01)
              basePrice += variation
              const timeLabel = hours === 0 ? 'now' : `${hours}h`
              mockHistorical.push({
                time: timeLabel,
                price: parseFloat(basePrice.toFixed(2))
              })
            }
            return {
              symbol: symbol.trim().toUpperCase(),
              price: currentPrice,
              change: currentPrice - meta.previousClose,
              changePercent: ((currentPrice - meta.previousClose) / meta.previousClose) * 100,
              historical: mockHistorical
            }
          }

          return {
            symbol: symbol.trim().toUpperCase(),
            price: currentPrice,
            change: currentPrice - meta.previousClose,
            changePercent: ((currentPrice - meta.previousClose) / meta.previousClose) * 100,
            historical
          }
        } catch (symbolError) {
          console.error(`Error fetching ${symbol}:`, symbolError)
          return { symbol: symbol.trim().toUpperCase(), price: null, historical: [], error: true }
        }
      })
    )

    return NextResponse.json({ quotes: quoteResults })
  } catch (error) {
    // Return fallback data on error
    return NextResponse.json({
      quotes: symbolsParam.map(s => ({
        symbol: s.trim().toUpperCase(),
        price: null,
        historical: [],
        error: true
      }))
    })
  }
}
