import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const symbols = searchParams.get('symbols')?.split(',') || ['SPY', 'QQQ']

  try {
    // Using Yahoo Finance API (no auth required for basic quotes)
    const quotes = await Promise.all(
      symbols.map(async (symbol) => {
        const res = await fetch(
          `https://query1.finance.yahoo.com/v8/finance/chart/${symbol.trim()}?interval=1m&range=1d`,
          { headers: { 'User-Agent': 'Mozilla/5.0' } }
        )
        const data = await res.json()

        const meta = data.chart?.result?.[0]?.meta
        if (meta) {
          return {
            symbol: symbol.trim().toUpperCase(),
            price: meta.regularMarketPrice || meta.previousClose,
            change: meta.regularMarketPrice - meta.previousClose,
            changePercent: ((meta.regularMarketPrice - meta.previousClose) / meta.previousClose) * 100
          }
        }
        return { symbol: symbol.trim().toUpperCase(), price: null }
      })
    )

    return NextResponse.json({ quotes })
  } catch (error) {
    // Return fallback data on error
    return NextResponse.json({
      quotes: symbols.map(s => ({
        symbol: s.trim().toUpperCase(),
        price: null,
        error: 'Failed to fetch'
      }))
    })
  }
}
