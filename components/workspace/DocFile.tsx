'use client'

// Generic workspace document renderer, typeset like scientific print: a display
// title over a rule, figure-caption labels, a data strip instead of stat tiles,
// margin-ruled formulas, and book-style tables. Boxes only where data earns them.

import type { ComponentType } from 'react'
import TradingMetricsCard from '@/components/charts/TradingMetricsCard'
import TradingLineChart from '@/components/charts/TradingLineChart'
import TradingBarChart from '@/components/charts/TradingBarChart'
import AnimatedLineChart from '@/components/charts/AnimatedLineChart'

export type Tone = 'default' | 'good' | 'warn' | 'bad' | 'key'

export interface Para {
  text: string
  tone?: Tone
}

export interface ChartSpec {
  kind: 'line' | 'bar' | 'anim-line'
  data: Record<string, any>[]
  xKey: string
  yKey: string
  color?: string
  area?: boolean
  colors?: string[]
  illustrative?: boolean
}

export type Block =
  | { kind: 'text'; heading?: string; paras: Para[] }
  | { kind: 'bullets'; heading?: string; items: { text: string; mark?: 'check' | 'cross' | 'none' }[] }
  | { kind: 'stats'; items: { label: string; value: string }[] }
  | { kind: 'table'; heading?: string; headers: string[]; rows: (string | { text: string; tone?: Tone })[][] }
  | { kind: 'formula'; heading?: string; formulas: string[]; notes?: Para[] }
  | {
      kind: 'metrics'
      title: string
      metrics: { label: string; value: string; trend?: 'up' | 'down' | 'neutral' }[]
      chart?: ChartSpec
    }

export interface DocContent {
  path: string
  title: string
  intro?: string
  blocks: Block[]
}

const TONE_CLASS: Record<Tone, string> = {
  default: 'text-[#999]',
  good: 'text-[#00ff9d]',
  warn: 'text-[#eab308]',
  bad: 'text-[#ef4444]',
  key: 'text-white',
}

function cellText(cell: string | { text: string; tone?: Tone }) {
  return typeof cell === 'string' ? { text: cell, tone: 'default' as Tone } : { text: cell.text, tone: cell.tone ?? 'default' }
}

// ASCII-style list marks (no unicode glyphs): checked = bordered box with a filled
// inner dot, cross = empty bordered rectangle, none = short dim dash.
function Mark({ kind }: { kind?: 'check' | 'cross' | 'none' }) {
  if (kind === 'check')
    return (
      <span className="w-[9px] h-[9px] mt-[4px] border border-[#00ff9d] flex items-center justify-center flex-shrink-0">
        <span className="w-[3px] h-[3px] bg-[#00ff9d]" />
      </span>
    )
  if (kind === 'cross')
    return <span className="w-[9px] h-[9px] mt-[4px] border border-[#ef4444] flex-shrink-0" />
  return <span className="w-[9px] h-[1px] mt-[8px] bg-[#444] flex-shrink-0" />
}

function Caption({ children }: { children?: React.ReactNode }) {
  if (!children) return null
  return (
    <div className="text-[9px] tracking-[0.25em] text-[#555] mb-3">
      <span className="text-[#00ff9d] mr-2">—</span>
      {children}
    </div>
  )
}

function Chart({ spec }: { spec: ChartSpec }) {
  const chart =
    spec.kind === 'anim-line' ? (
      <AnimatedLineChart data={spec.data} xKey={spec.xKey} yKey={spec.yKey} color={spec.color} />
    ) : spec.kind === 'bar' ? (
      <TradingBarChart data={spec.data} xKey={spec.xKey} yKey={spec.yKey} colors={spec.colors} />
    ) : (
      <TradingLineChart data={spec.data} xKey={spec.xKey} yKey={spec.yKey} color={spec.color} area={spec.area} />
    )
  return (
    <>
      {spec.illustrative && (
        <div className="inline-block border border-[#eab308] text-[#eab308] text-[8px] tracking-[0.2em] px-2 py-[2px] mb-2 rotate-[-1deg]">
          ILLUSTRATIVE — NOT ACTUAL BACKTEST OUTPUT
        </div>
      )}
      {chart}
    </>
  )
}

function BlockView({ block, index }: { block: Block; index: number }) {
  switch (block.kind) {
    case 'text':
      return (
        <div className="zc-rise" style={{ animationDelay: `${index * 60}ms` }}>
          <Caption>{block.heading}</Caption>
          <div className="space-y-2 max-w-[68ch]">
            {block.paras.map((p, i) => (
              <p key={i} className={`text-[12px] leading-[1.8] ${TONE_CLASS[p.tone ?? 'default']}`}>
                {p.text}
              </p>
            ))}
          </div>
        </div>
      )

    case 'bullets':
      return (
        <div className="zc-rise" style={{ animationDelay: `${index * 60}ms` }}>
          <Caption>{block.heading}</Caption>
          <div className={`grid gap-x-10 gap-y-2 ${block.items.length > 6 ? 'md:grid-cols-2' : ''} max-w-[85ch]`}>
            {block.items.map((item, i) => (
              <div key={i} className="flex gap-3 text-[12px] text-[#999] leading-[1.7]">
                <Mark kind={item.mark} />
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      )

    case 'stats':
      return (
        <div className="zc-rise flex flex-wrap gap-x-12 gap-y-6" style={{ animationDelay: `${index * 60}ms` }}>
          {block.items.map((item, i) => (
            <div key={item.label}>
              <div className={`font-orbit leading-none ${i === 0 ? 'text-[32px] text-white' : 'text-[24px] text-[#00ff9d]'}`}>
                {item.value}
              </div>
              <div className="text-[9px] tracking-[0.2em] text-[#555] mt-2">{item.label}</div>
            </div>
          ))}
        </div>
      )

    case 'table':
      return (
        <div className="zc-rise" style={{ animationDelay: `${index * 60}ms` }}>
          <Caption>{block.heading}</Caption>
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[480px] table-fixed border-t-2 border-white">
              <thead>
                <tr className="border-b border-[#2a2a2a]">
                  {block.headers.map((h) => (
                    <th key={h} className="text-[9px] tracking-[0.2em] text-[#555] font-normal px-3 py-2 align-top overflow-hidden">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {block.rows.map((row, ri) => (
                  <tr key={ri} className="border-b border-[#161616]">
                    {row.map((cell, ci) => {
                      const { text, tone } = cellText(cell)
                      return (
                        <td key={ci} className={`text-[11px] px-3 py-2 align-top break-words ${TONE_CLASS[tone]}`}>
                          {text}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )

    case 'formula':
      return (
        <div className="zc-rise border-l-2 border-[#00ff9d] pl-5" style={{ animationDelay: `${index * 60}ms` }}>
          <Caption>{block.heading}</Caption>
          <div className="space-y-2">
            {block.formulas.map((f, i) => (
              <div key={i} className="text-[15px] text-white font-orbit leading-[1.7] tracking-wide">
                {f}
              </div>
            ))}
          </div>
          {block.notes && (
            <div className="space-y-2 mt-4 max-w-[68ch]">
              {block.notes.map((p, i) => (
                <p key={i} className={`text-[11px] leading-[1.7] ${TONE_CLASS[p.tone ?? 'default']}`}>
                  {p.text}
                </p>
              ))}
            </div>
          )}
        </div>
      )

    case 'metrics':
      return (
        <div className="zc-rise" style={{ animationDelay: `${index * 60}ms` }}>
          <TradingMetricsCard title={block.title} metrics={block.metrics}>
            {block.chart && <Chart spec={block.chart} />}
          </TradingMetricsCard>
        </div>
      )
  }
}

export function DocFile({ content }: { content: DocContent }) {
  return (
    <div className="px-8 py-10 max-w-[1100px] space-y-10">
      <header className="zc-rise">
        <div className="text-[9px] tracking-[0.3em] text-[#555]">{content.path}</div>
        <h1 className="text-[42px] md:text-[52px] leading-[1.02] tracking-tight text-white mt-3 font-orbit">
          {content.title}
        </h1>
        <div className="mt-5 h-px bg-[#222] w-full relative">
          <div className="absolute left-0 top-[-1px] h-[3px] w-16 bg-white" />
        </div>
        {content.intro && (
          <p className="text-[13px] text-[#777] leading-[1.8] max-w-[62ch] mt-5">{content.intro}</p>
        )}
      </header>
      {content.blocks.map((block, i) => (
        <BlockView key={i} block={block} index={i} />
      ))}
    </div>
  )
}

// Factory: wraps a DocContent in a standalone component for tree.ts file nodes.
export function makeDoc(c: DocContent): ComponentType {
  function GeneratedDoc() {
    return <DocFile content={c} />
  }
  GeneratedDoc.displayName = `Doc(${c.title})`
  return GeneratedDoc
}

// Factory: wraps an interactive demo component in the standard file header +
// a data-provenance tag, for tree.ts results/demo nodes.
export function makeDemo(
  Demo: ComponentType,
  meta: { path: string; title: string; intro: string; realData?: boolean }
): ComponentType {
  function GeneratedDemo() {
    return (
      <div className="px-8 py-10 max-w-[1400px] space-y-6">
        <div className="text-[9px] tracking-[0.3em] text-[#555]">{meta.path}</div>
        <h1 className="text-[42px] md:text-[52px] leading-[1.02] tracking-tight text-white font-orbit">
          {meta.title}
        </h1>
        <div className="mt-5 h-px bg-[#222] w-full relative">
          <div className="absolute left-0 top-[-1px] h-[3px] w-16 bg-white" />
        </div>
        <p className="text-[13px] text-[#777] leading-[1.8] max-w-[62ch]">{meta.intro}</p>
        <div
          className={`inline-block border px-2 py-[2px] text-[9px] tracking-[0.2em] rotate-[-1deg] ${
            meta.realData ? 'border-[#00ff9d] text-[#00ff9d]' : 'border-[#eab308] text-[#eab308]'
          }`}
        >
          {meta.realData ? 'REAL MARKET DATA' : 'SIMULATED DATA — ILLUSTRATIVE'}
        </div>
        <div className="mt-2">
          <Demo />
        </div>
      </div>
    )
  }
  GeneratedDemo.displayName = `Demo(${meta.title})`
  return GeneratedDemo
}
