# portfolio

Terminal-style portfolio: an eDEX-inspired desktop that opens into a fullscreen
filesystem workspace where quantitative trading research lives as files.

## What it is

- **Desktop layer** — windows, terminal, CRT overlay (Next.js 15, React, Tailwind, Zustand)
- **Workspace** — `~/projects/` as a filesystem: categories → projects → `overview/ method/ results/`
- **Every number is measured.** Results pages show real computed outputs from the
  underlying research (Databento NQ/ES tick data, grid-search CSVs, model runs),
  each with a source line. Procedural charts are stamped ILLUSTRATIVE. Positive
  results carry their own false-positive autopsy.

## Where things live

| Path | Purpose |
|---|---|
| `components/workspace/` | Workspace chrome: hub, folder view, breadcrumb, DocFile renderer |
| `components/workspace/projects/` | Per-project content as plain data (`content.ts`) + interactive viewers |
| `components/workspace/DocFile.tsx` | The doc renderer + `makeDoc`/`makeDemo` factories — one design system for every page |
| `components/charts/` | Chart primitives (line/bar/metrics + animated draw-on) |
| `public/data/*.json` | Real-data datasets for the explorers/galleries (lazy-fetched) |
| `scripts/` | Data builders and model runners that produce the numbers the site shows |

## Scripts

| Script | What it does |
|---|---|
| `scripts/build_demo_data.py` | Builds candle datasets + labeled-zone windows from real parquet ticks → `public/data/` |
| `scripts/build_zone_predictions.py` | Trains the RF zone classifier, predicts an unseen month → `public/data/zone-predictions.json` |
| `scripts/run_real_models.py` | Zone-classifier training run (real features CSV) |
| `scripts/run_real_models2.py` | HMM re-run on real NQ bars (patched numerics) |
| `scripts/run_symbolic.py` | gplearn symbolic regression run (utf-8 safe) |
| `scripts/run_real_ib.py` | IB-strategy backtest on real ticks → trade-log.csv |
| `scripts/analyze_real_results.py` | Summaries of the research result CSVs |

Research data (parquet ticks, result CSVs, the thesis) is not stored in this repo —
scripts read it from the author's local research folders.

## Conventions

- Brutalist print system: sharp corners, Orbit, dotted baseline grid, register marks
- Green = data and active state; white = hover; boxes only where data earns them
- Copy follows a STE-spirit house style: one fact per sentence, plain verbs, numbers over adjectives
- `npm run build` must pass before every commit
