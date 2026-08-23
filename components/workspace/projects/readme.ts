// README.md content for the workspace root (~/projects/) — orients visitors to
// the folder structure and reading conventions before they dive in.

import type { DocContent } from '../DocFile'

export const rootReadme: DocContent = {
  path: '~/projects/README.md',
  title: 'HOW TO READ THIS',
  intro: 'Everything here is a filesystem. Thirty seconds on this page and the rest makes sense.',
  blocks: [
    {
      kind: 'text',
      heading: 'THE LAYOUT',
      paras: [
        { text: 'categories → projects → three folders each.', tone: 'key' },
      ],
    },
    {
      kind: 'table',
      headers: ['LEVEL', 'WHAT IT IS', 'EXAMPLE'],
      rows: [
        ['Category', 'A group of projects', 'trading/, discord/, other/'],
        ['Project', 'One research effort, lands on a hub page', 'trading/orderflow'],
        ['overview/', 'What it is and what was found — start here', 'README.md, FINDINGS.md'],
        ['method/', 'How it works: exact formulas, parameters, data pipeline', 'METHODOLOGY.md, FILTERS.md'],
        ['results/', 'The proof: measured numbers, real-data demos, false-positive autopsies', 'equity logs, explorers, predictions'],
      ],
    },
    {
      kind: 'text',
      heading: 'READING CONVENTIONS',
      paras: [
        { text: 'REAL MARKET DATA — the numbers came off actual Databento tick files; the source line at the bottom of each page names the artifact.' },
        { text: 'ILLUSTRATIVE — the chart shape is representative, not measured. These exist only where no real data survived, and they say so loudly.' },
        { text: 'WHY THIS IS LIKELY A FALSE POSITIVE — every page with a positive result carries its own counter-argument. The positive numbers were computed honestly; the skepticism blocks are why they still shouldn’t be trusted blindly.' },
      ],
    },
    {
      kind: 'text',
      heading: 'WHERE TO START',
      paras: [
        { text: 'trading/TERMS.md defines every term with its formula — elasticity, delta, VPOC, the cloned box, EV. Then any project’s overview/, then its results/.' },
        { text: 'The best visuals live in zone-classifier/results/ (the labeled-zone benchmark, live model predictions) and orderflow/results/demo (real delta vs price).', tone: 'good' },
      ],
    },
    {
      kind: 'text',
      heading: 'THE ONE-LINE STORY',
      paras: [
        { text: 'A quant research archive, told honestly: rigorous methods, real data, mostly dead ends — and the specific reasons each one died. That is the work.' },
      ],
    },
  ],
}
