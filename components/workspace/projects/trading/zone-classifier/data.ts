export interface ZoneSettings {
  lookbackWindow: number
  volatilityThreshold: number
  volumeWeight: number
  momentumWeight: number
}

export const defaultSettings: ZoneSettings = {
  lookbackWindow: 20,
  volatilityThreshold: 1.5,
  volumeWeight: 0.3,
  momentumWeight: 0.5,
}

export interface BacktestDay {
  day: number
  date: string
  equity: number
  return: number
  zone: number
}

export interface BacktestResult {
  data: BacktestDay[]
  metrics: Record<string, string>
}

export function generateBacktestData(settings: ZoneSettings): BacktestResult {
  const days = 90
  const data: BacktestDay[] = []
  let equity = 10000
  let peak = equity
  let maxDrawdown = 0
  let wins = 0
  let losses = 0

  for (let i = 0; i < days; i++) {
    const lookbackEffect = (60 - settings.lookbackWindow) / 60
    const volEffect = settings.volatilityThreshold / 3
    const momentumEffect = settings.momentumWeight

    const baseReturn = (Math.random() - 0.45) * 200 * (lookbackEffect * 0.5 + volEffect * 0.3 + momentumEffect * 0.2)
    equity += baseReturn

    if (equity > peak) peak = equity
    const drawdown = ((peak - equity) / peak) * 100
    if (drawdown > maxDrawdown) maxDrawdown = drawdown

    if (baseReturn > 0) wins++
    else losses++

    const volatility = Math.abs(baseReturn)
    let zone = 1
    if (volatility > 100 * volEffect) zone = 3
    else if (volatility > 50 * volEffect) zone = 2

    data.push({
      day: i + 1,
      date: new Date(2025, 9, i + 1).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      equity: Math.round(equity),
      return: baseReturn,
      zone,
    })
  }

  const winRate = ((wins / (wins + losses)) * 100).toFixed(1)
  const totalReturnNum = ((equity - 10000) / 10000 * 100)
  const totalReturn = totalReturnNum.toFixed(1)
  const sharpe = (totalReturnNum / 100 / Math.max(maxDrawdown, 1) * 10).toFixed(2)

  return {
    data,
    metrics: {
      'Final Equity': `$${equity.toFixed(0)}`,
      'Total Return': `${totalReturn}%`,
      'Win Rate': `${winRate}%`,
      'Max Drawdown': `${maxDrawdown.toFixed(1)}%`,
      'Sharpe Ratio': sharpe,
      'Total Trades': (wins + losses).toString(),
    },
  }
}

export interface FeatureImportance {
  name: string
  importance: string
}

export function generateFeatureImportance(settings: ZoneSettings): FeatureImportance[] {
  const baseFeatures = [
    { name: 'Volume Diff', importance: 0.85 + settings.volumeWeight * 0.1 },
    { name: 'Zone Range', importance: 0.72 + (settings.lookbackWindow / 60) * 0.15 },
    { name: 'Wick Ratio', importance: 0.68 },
    { name: 'Price Entropy', importance: 0.61 },
    { name: 'Volume Accel', importance: 0.55 + settings.volumeWeight * 0.2 },
    { name: 'Body Ratio', importance: 0.48 + settings.momentumWeight * 0.1 },
  ]
  return baseFeatures.map(f => ({ name: f.name, importance: (f.importance * 100).toFixed(1) }))
}

export interface ZoneDistribution {
  zone: string
  count: number
}

export function generateZoneDistribution(settings: ZoneSettings): ZoneDistribution[] {
  const volEffect = settings.volatilityThreshold / 3
  return [
    { zone: 'Neutral', count: Math.round(30 + volEffect * 10) },
    { zone: 'Consolidation', count: Math.round(40 - volEffect * 5) },
    { zone: 'Breakout', count: Math.round(30 - volEffect * 5) },
  ]
}

export const BREAKOUT_EXAMPLE = [
  { time: '09:30', open: 450.50, high: 451.00, low: 450.00, close: 450.80, volume: 1200, zone: 'neutral' as const },
  { time: '09:45', open: 450.80, high: 451.50, low: 450.50, close: 451.20, volume: 1500, zone: 'neutral' as const },
  { time: '10:00', open: 451.20, high: 452.00, low: 451.00, close: 451.80, volume: 2100, zone: 'consolidation' as const },
  { time: '10:15', open: 451.80, high: 452.20, low: 451.50, close: 451.90, volume: 1800, zone: 'consolidation' as const },
  { time: '10:30', open: 451.90, high: 452.50, low: 451.70, close: 452.30, volume: 2400, zone: 'consolidation' as const },
  { time: '10:45', open: 452.30, high: 454.80, low: 452.20, close: 454.50, volume: 5800, zone: 'breakout' as const, annotation: 'entry' as const },
  { time: '11:00', open: 454.50, high: 456.00, low: 454.00, close: 455.80, volume: 6200, zone: 'breakout' as const },
  { time: '11:15', open: 455.80, high: 457.50, low: 455.50, close: 457.20, volume: 5500, zone: 'breakout' as const },
  { time: '11:30', open: 457.20, high: 457.80, low: 456.50, close: 456.90, volume: 3200, zone: 'breakout' as const, annotation: 'exit' as const },
]

export const CONSOLIDATION_EXAMPLE = [
  { time: '13:30', open: 455.00, high: 456.00, low: 454.50, close: 455.50, volume: 2800, zone: 'neutral' as const },
  { time: '13:45', open: 455.50, high: 456.00, low: 455.00, close: 455.70, volume: 2200, zone: 'consolidation' as const },
  { time: '14:00', open: 455.70, high: 456.20, low: 455.30, close: 455.80, volume: 1900, zone: 'consolidation' as const },
  { time: '14:15', open: 455.80, high: 456.10, low: 455.40, close: 455.60, volume: 1700, zone: 'consolidation' as const },
  { time: '14:30', open: 455.60, high: 456.00, low: 455.20, close: 455.70, volume: 1600, zone: 'consolidation' as const },
  { time: '14:45', open: 455.70, high: 455.90, low: 455.30, close: 455.50, volume: 1500, zone: 'consolidation' as const },
  { time: '15:00', open: 455.50, high: 455.80, low: 455.10, close: 455.40, volume: 1400, zone: 'consolidation' as const },
]

export const NEUTRAL_EXAMPLE = [
  { time: '09:30', open: 448.00, high: 449.50, low: 447.50, close: 449.00, volume: 3500, zone: 'neutral' as const },
  { time: '09:45', open: 449.00, high: 450.00, low: 448.50, close: 449.80, volume: 2800, zone: 'neutral' as const },
  { time: '10:00', open: 449.80, high: 450.50, low: 449.20, close: 449.50, volume: 2200, zone: 'neutral' as const },
  { time: '10:15', open: 449.50, high: 450.00, low: 448.80, close: 449.20, volume: 2000, zone: 'neutral' as const },
  { time: '10:30', open: 449.20, high: 449.80, low: 448.50, close: 448.90, volume: 1900, zone: 'neutral' as const },
  { time: '10:45', open: 448.90, high: 449.50, low: 448.30, close: 448.70, volume: 1800, zone: 'neutral' as const },
]
