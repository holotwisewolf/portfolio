// TERMS.md content — shared terminology for the trading projects, served at the
// trading category root so visitors can decode any project page.

import type { DocContent } from '../../DocFile'

export const terms: DocContent = {
  path: '// trading/TERMS.md',
  title: 'TERMS',
  intro: 'The vocabulary every project here uses, with the actual formulas.',
  blocks: [
    {
      kind: 'formula',
      heading: 'DELTA (δ)',
      formulas: ['δ = volume(aggressive buys) − volume(aggressive sells)'],
      notes: [
        { text: 'Net aggressive volume. Each trade is signed by who crossed the spread: aggressor buying (+) or selling (−). The orderflow explorer charts this per bar and cumulatively.', tone: 'default' },
      ],
    },
    {
      kind: 'formula',
      heading: 'ELASTICITY (E) — TWO DEFINITIONS USED ACROSS THE RESEARCH',
      formulas: [
        'Thesis version:   E = price_change / delta      (movement per unit of flow)',
        'Ratio version:    E = R / |Δ|                    (range / absolute delta)',
      ],
      notes: [
        { text: 'Low elasticity = large aggressive flow but price barely moves = absorption by passive liquidity. The core finding: low E predicts continuation better than high E — the opposite of the initial hypothesis.', tone: 'key' },
      ],
    },
    {
      kind: 'formula',
      heading: 'DELTA ACCELERATION (A)',
      formulas: ['A = (Δ_recent − Δ_prior) / max(|Δ_prior|, ε)'],
      notes: [
        { text: 'How fast the aggressive side is gaining or losing momentum. Fast deceleration = exhaustion of the pushers — the best-performing cell when combined with low elasticity.' },
      ],
    },
    {
      kind: 'formula',
      heading: 'VPOC — VOLUME POINT OF CONTROL',
      formulas: ['VPOC = argmax_price  Σ volume traded at price'],
      notes: [
        { text: 'The price level where the most volume traded in a session — the market\'s "fair value" for that day. The VPOC explorer pins every return to it.', tone: 'default' },
      ],
    },
    {
      kind: 'formula',
      heading: 'INITIAL BALANCE & THE CLONED BOX',
      formulas: [
        'IB        = high/low of 09:30–10:30 ET',
        'Ext_100   = IB_High + Height  /  IB_Low − Height',
      ],
      notes: [
        { text: 'The first hour\'s range, cloned once above and below (100%) or half (50%). Mean reversion fades the extensions; sustained auction trades the break and retest.' },
      ],
    },
    {
      kind: 'formula',
      heading: 'MBP-1 vs TRADE DATA',
      formulas: ['MBP-1 = orderbook top-of-book changes   ·   Trades = fills only'],
      notes: [
        { text: 'Trade ticks show what already happened; MBP-1 shows the book moving before it happens. The orderflow project\'s central data limitation: without book data you measure noise, not flow.', tone: 'warn' },
      ],
    },
    {
      kind: 'formula',
      heading: 'WALK-FORWARD VALIDATION',
      formulas: ['train [t₀, t₁] → test [t₁, t₂] → roll → repeat'],
      notes: [
        { text: 'Optimize on the past, validate on the future, roll forward. Never shuffle a time series — random splits leak the future into the past (look-ahead bias).' },
      ],
    },
    {
      kind: 'formula',
      heading: 'PARSIMONY PRESSURE (SYMBOLIC REGRESSION)',
      formulas: ['Score = fitness − λ × complexity'],
      notes: [
        { text: 'Genetic programming evolves formulas; parsimony penalizes their size. The result prefers short equations that still fit — interpretable by construction.' },
      ],
    },
    {
      kind: 'formula',
      heading: 'SLIPPAGE, FILLS & FEES — THE REALITY-CHECK LAYER',
      formulas: [
        'fill_price = price + (direction × slippage_ticks × tick_size)',
        'net_pnl    = raw_pnl − commissions_per_trade',
      ],
      notes: [
        { text: 'From core/skepticism.py — "if it looks too good to be true, run this module." Buys pay more, sells receive less; friction always cuts against you. Every positive result on these pages was computed with this layer applied, and most still died under the skepticism notes that follow them.', tone: 'key' },
      ],
    },
    {
      kind: 'formula',
      heading: 'EXPECTED VALUE PER TRADE (EV)',
      formulas: ['EV = (win_rate × avg_win) − (loss_rate × avg_loss) − costs'],
      notes: [
        { text: 'The only number that pays. The IB backtest is the canonical warning: 80–90% win rates with negative EV, against a 30% win rate that made money.' },
      ],
    },
  ],
}
