'use client'

// Generic workspace document renderer: per-project content lives in content.ts files as
// plain data (DocContent), and tree.ts wires files via makeDoc(content). One renderer
// instead of ~60 bespoke file components.

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
  default: 'text-gray-400',
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
      <span className="w-[9px] h-[9px] mt-[3px] border border-[#00ff9d] flex items-center justify-center flex-shrink-0">
        <span className="w-[3px] h-[3px] bg-[#00ff9d]" />
      </span>
    )
  if (kind === 'cross')
    return <span className="w-[9px] h-[9px] mt-[3px] border border-[#ef4444] flex-shrink-0" />
  return <span className="w-[9px] h-[1px] mt-[7px] bg-[#444] flex-shrink-0" />
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
        <div className="text-[9px] tracking-[0.2em] text-[#eab308] mb-1">
          ILLUSTRATIVE — NOT ACTUAL BACKTEST OUTPUT
        </div>
      )}
      {chart}
    </>
  )
}

function BlockView({ block }: { block: Block }) {
  switch (block.kind) {
    case 'text':
      return (
        <div>
          {block.heading && (
            <div className="text-[10px] tracking-[0.2em] text-[#00ff9d] mb-2">{block.heading}</div>
          )}
          <div className="space-y-2">
            {block.paras.map((p, i) => (
              <p key={i} className={`text-[11px] leading-relaxed ${TONE_CLASS[p.tone ?? 'default']}`}>
                {p.text}
              </p>
            ))}
          </div>
        </div>
      )

    case 'bullets':
      return (
        <div>
          {block.heading && (
            <div className="text-[10px] tracking-[0.2em] text-[#00ff9d] mb-2">{block.heading}</div>
          )}
          <div className="space-y-1">
            {block.items.map((item, i) => (
              <div key={i} className="flex gap-2 text-[11px] text-gray-400 leading-relaxed">
                <Mark kind={item.mark} />
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      )

    case 'stats':
      return (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-[1px] bg-[#1c2e1c] border border-[#1c2e1c]">
          {block.items.map((item) => (
            <div key={item.label} className="bg-[#0a0a0a] p-3">
              <div className="text-[9px] tracking-[0.25em] text-[#444] mb-1">{item.label}</div>
              <div className="text-white text-[13px]">{item.value}</div>
            </div>
          ))}
        </div>
      )

    case 'table':
      return (
        <div>
          {block.heading && (
            <div className="text-[10px] tracking-[0.2em] text-[#00ff9d] mb-2">{block.heading}</div>
          )}
          <div className="border border-[#1c2e1c] overflow-x-auto">
            <table className="w-full text-left min-w-[480px]">
              <thead>
                <tr className="border-b border-[#1c2e1c]">
                  {block.headers.map((h) => (
                    <th key={h} className="text-[9px] tracking-[0.2em] text-[#444] font-normal px-3 py-2">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {block.rows.map((row, ri) => (
                  <tr key={ri} className={ri < block.rows.length - 1 ? 'border-b border-[#1c2e1c]' : ''}>
                    {row.map((cell, ci) => {
                      const { text, tone } = cellText(cell)
                      return (
                        <td key={ci} className={`text-[11px] px-3 py-2 ${TONE_CLASS[tone]}`}>
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
        <div className="border border-[#1c2e1c] bg-black p-4">
          {block.heading && (
            <div className="text-[10px] tracking-[0.2em] text-[#00ff9d] mb-2">{block.heading}</div>
          )}
          {block.formulas.map((f, i) => (
            <div key={i} className="text-[13px] text-[#00ff9d] font-orbit mb-2 tracking-wider">
              {f}
            </div>
          ))}
          {block.notes && (
            <div className="space-y-2 mt-3">
              {block.notes.map((p, i) => (
                <p key={i} className={`text-[11px] leading-relaxed ${TONE_CLASS[p.tone ?? 'default']}`}>
                  {p.text}
                </p>
              ))}
            </div>
          )}
        </div>
      )

    case 'metrics':
      return (
        <TradingMetricsCard title={block.title} metrics={block.metrics}>
          {block.chart && <Chart spec={block.chart} />}
        </TradingMetricsCard>
      )
  }
}

export function DocFile({ content }: { content: DocContent }) {
  return (
    <div className="p-6 space-y-4 max-w-[1200px]">
      <div className="text-[9px] tracking-[0.3em] text-[#444]">{content.path}</div>
      <h1 className="text-[26px] tracking-[0.15em] text-white">{content.title}</h1>
      {content.intro && (
        <p className="text-[11px] text-gray-500 leading-relaxed max-w-[600px]">{content.intro}</p>
      )}
      {content.blocks.map((block, i) => (
        <BlockView key={i} block={block} />
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

// Factory: wraps an interactive demo component (OrderflowDemo, VPOCDemo, ...) in the
// standard file header + a SIMULATED DATA tag, for tree.ts results/demo nodes.
export function makeDemo(
  Demo: ComponentType,
  meta: { path: string; title: string; intro: string }
): ComponentType {
  function GeneratedDemo() {
    return (
      <div className="p-6 space-y-3 max-w-[1400px]">
        <div className="text-[9px] tracking-[0.3em] text-[#444]">{meta.path}</div>
        <h1 className="text-[26px] tracking-[0.15em] text-white">{meta.title}</h1>
        <p className="text-[11px] text-gray-500 leading-relaxed max-w-[600px]">{meta.intro}</p>
        <div className="text-[9px] tracking-[0.2em] text-[#eab308]">SIMULATED DATA — ILLUSTRATIVE</div>
        <div className="border border-[#1c2e1c]">
          <Demo />
        </div>
      </div>
    )
  }
  GeneratedDemo.displayName = `Demo(${meta.title})`
  return GeneratedDemo
}
