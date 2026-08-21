// discord-bot project content — distilled from components/windows/ProjectDiscord.tsx
// (the interactive chat demo itself is wired as results/demo).

import type { DocContent } from '../../DocFile'

export const readme: DocContent = {
  path: '// overview/README.md',
  title: 'RESEARCH BOT',
  intro: 'A Discord bot that routes research questions across multiple AI models — adversarially.',
  blocks: [
    {
      kind: 'text',
      paras: [
        { text: 'A multi-AI research assistant. Each command selects a different interrogation pattern: one model attacking the question, three models debating it, two models verifying each other, or automatic cost-optimized routing.' },
      ],
    },
    {
      kind: 'table',
      heading: 'COMMANDS',
      headers: ['COMMAND', 'ROUTING', 'WHAT IT DOES'],
      rows: [
        ['!hardmode', 'Claude Opus (Skeptic mode)', 'Aggressively dismantles the question — overfitting, regime change, execution reality'],
        ['!consensus', 'All 3 models', 'Claude, GPT-4 and Gemini answer independently, then converge'],
        ['!crosscheck', 'Claude + GPT-4', 'Two models verify each other’s claims'],
        ['!auto', 'GPT-4o (fast/cheap)', 'Auto-selected for speed and cost'],
      ],
    },
  ],
}

export const architecture: DocContent = {
  path: '// method/ARCHITECTURE.md',
  title: 'ARCHITECTURE',
  intro: 'Routing table with measured cost per exchange (from live demo runs).',
  blocks: [
    {
      kind: 'table',
      heading: 'ROUTING COSTS',
      headers: ['ROUTE', 'COST', 'TOKENS'],
      rows: [
        ['Claude Opus (Skeptic)', '$0.04', '847'],
        ['All 3 models (consensus)', '$0.12', '2,341'],
        ['Claude + GPT-4 (crosscheck)', '$0.07', '1,423'],
        ['GPT-4o (auto, cost-optimized)', '$0.01', '412'],
      ],
    },
    {
      kind: 'bullets',
      heading: 'DESIGN NOTES',
      items: [
        { text: 'Consensus mode surfaces disagreement, not averages — the caveats are the value', mark: 'check' },
        { text: 'Crosscheck exists because single models hallucinate confidently', mark: 'check' },
        { text: 'Auto route defaults to the cheapest model that handles the question class', mark: 'none' },
      ],
    },
  ],
}
