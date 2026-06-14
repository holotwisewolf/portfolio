# Portfolio Context Document

**Last Updated:** 2026-06-13
**Project Location:** `C:\Users\YJ\Desktop\portfolio`
**Framework:** Next.js 14+ (App Router), React, TypeScript, Tailwind CSS

---

## Vision & Aesthetic

- **Style:** Brutalist eDEX-UI terminal interface
- **Vibe:** "Wanna-be quant. Paper trading only." - Self-aware, honest, slightly tongue-in-cheek
- **Inspiration:** Instagram creative coding scene, terminal aesthetic, data-dense dashboards
- **Color Scheme:** Black background, white borders, green accents (#00ff9d, #00cc77), monospace fonts

---

## Current Architecture

### Main Layout (3-Panel eDEX-UI)
```
┌──────────────────────────────────────────────────────────────────┐
│ StatusBar (24px) - PORTFOLIO | SERVER_ONLINE | LATENCY | TIME    │
├──────────────┬────────────────────────────┬──────────────────────┤
│ Profile      │ Terminal / Navigation      │ Market + Dev        │
│ (280px)      │ (flex-grow)                │ (320px)             │
│              │                            │                     │
│ - Identity   │ Navigation items:          │ Market watch:       │
│ - Skills     │ - Welcome                  │ - SPY chart         │
│ - Stack      │ - Projects                 │ - QQQ chart         │
│ - Activity   │ - Blog                     │ - VIX               │
│              │ - About                    │ - Status            │
│              │ - Contact                  │                     │
│              │                            │ Dev activity:       │
│              │ Content renders below       │ - Commits           │
│              │                            │ - Stars             │
│              │                            │ - Language bars     │
└──────────────┴────────────────────────────┴──────────────────────┤
│ TerminalBar (bottom, expandable - 3 states: expanded/collapsing) │
└──────────────────────────────────────────────────────────────────┘
```

### Key Components

**Panels:**
- `ProfilePanel.tsx` - Identity, skills, stack tags, GitHub-style activity dot grid
- `TerminalNavPanel.tsx` - Navigation with terminal aesthetic
- `MarketDevPanel.tsx` - Combined market + dev stats panel
- `StockCharts.tsx` - Market data visualization

**Window System:**
- `useWindows.tsx` - Window state management with global singleton registry
- `Window.tsx` - Draggable window component
- Window content registry pattern for all project windows

**UI Components:**
- `TradingLineChart.tsx` - Line charts with area, reference lines, custom tooltips
- `TradingBarChart.tsx` - Bar charts (horizontal/vertical)
- `TradingMetricsCard.tsx` - Metric cards with 4 slots + chart children
- `ActivityGrid.tsx` - GitHub-style activity dot grid
- `SkillBars.tsx` - Skill proficiency bars
- `LanguageBars.tsx` - Language percentage bars

**Terminal:**
- `TerminalBar.tsx` - Bottom terminal with 3 states (expanded/collapsed/minimized)
- Terminal filesystem with cd, ls, cat commands
- Command history with arrow key navigation

---

## Trading Projects (Window-Based)

All trading projects follow the **Zone Classifier pattern**:
- Tab-based UI with consistent styling
- Real-time chart updates when settings change (useMemo)
- TradingMetricsCard components for data visualization
- Line charts for P&L/equity curves, Bar charts for comparisons

### Projects List

**Main Projects:**
1. **Zone Classifier** - Market regime classification using symbolic regression
2. **Orderflow Research** - Delta acceleration and elasticity analysis
3. **VPOC Analysis** - Volume Point of Control study (legacy)
4. **IB Strategy** - Initial Balance range trading (Break & Retest + Mean Reversion)
5. **HMM Analysis** - Hidden Markov Models for regime detection
6. **Walk Forward Analytics** - Time-based validation framework

**Supporting Projects:**
7. **Symbolic Regression** - Genetic programming for interpretable formulas
8. **ML Consolidation** - Machine learning consolidation detection
9. **Orderflow Viz** - Tick data quality diagnostic tool
10. **Neutral Candle** - Grid search optimizer with Monte Carlo (legacy)

---

## Pending Tasks (Fresh Session Start)

These are the current TODO items - work on these in priority order:

### UI/UX Improvements
- [x] **Settings about section with site version** - Add settings modal with version info, build info, credits ✓ DONE (2026-06-13)
- [ ] **SoundCloud-style music player at bottom left** - Hardcoded fallback tracks, progress bar, play/pause
- [ ] **Terminal folder navigation** - Make projects navigable as folders (cd/ls/cat commands)
- [ ] **Instagram ASCII art particle option** - BG particles can show Instagram logo ASCII
- [ ] **Instagram aesthetic research** - Study Insta aesthetic, find typing sound reference
- [ ] **Click-and-hold particle spawning** - Spawn connectors/particles, clear canvas option
- [ ] **Mobile fallback mode (low priority)** - Basic mobile view for unsupported screen sizes

### Content Features
- [x] **Interactive candle bar examples in trading results** - Added TradingCandleChart component with interactive patterns for Breakout/Consolidation/Neutral zones ✓ DONE (2026-06-13)
- [ ] **Admin password easter egg** - Hidden password unlocks secret "Twitter" blog section
- [ ] **Instagram-style gallery** - Cool art showcase with credits to artists
- [ ] **Text-rendered FPS game** - Working FPS game with ASCII/text rendering

### Advanced Integration
- [ ] **Obsidian vault integration via MCP** - Connect note-taking vault for AI organization, accessible via admin panel
- [ ] **Window snap-to-half-screen (low priority)** - Windows Aero Snap-style edge snapping

### Documentation
- [ ] **Document HMM, IB Strategy, and Walk-Forward analytics** - Add methodology docs for these projects
- [x] **PORTFOLIO_CONTEXT.md** - This context file for fresh sessions ✓

---

## Important Technical Notes

### Window Registry Pattern
- Uses `globalThis.windowContentRegistry` singleton pattern
- All window registrations in `useWindows.tsx`
- Window IDs: 'welcome', 'projects', 'blog', 'about', 'contact', 'admin', 'settings', plus all trading project IDs

### Chart Data Patterns
- Use `useMemo` for real-time updates when settings change
- Generator functions return arrays of objects with consistent keys
- TradingMetricsCard always takes 4 metrics + chart children

### Styling Constants
- Green accent: `#00ff9d` (labels), `#00cc77` (filled)
- Dark gray: `#555` (subtitles), `#333` (notes)
- Border: `0.5px solid #1c2e1c` (very thin, subtle green tint)
- Font: 9-12px monospace, letter-spacing 0.1-0.2em on uppercase
- Dots: Square (border-radius: 1-2px max), not fully round

---

## Admin System

- **Status:** Hidden system with login
- **Access:** Desktop icon or specific command
- **Planned:** Obsidian vault integration, blog management

---

## Data Sources

### Stock Data
- SPY, QQQ from existing `/api/stocks` endpoint
- 30-min intervals implemented
- VIX can be added to same API call

### GitHub/Dev Stats
- Currently mock data
- Future: GitHub API integration for real stats

---

## Easter Eggs & Secrets (Planned)

1. **Admin Password** - Hidden somewhere in the site
2. **"Twitter" Blog Section** - Unlocked by finding admin password, shows daily thoughts
3. **Instagram ASCII Art** - Hidden particle option in settings
4. **Typing Sound** - From Instagram edit video reference

---

## Development Commands

```bash
# Run dev server
npm run dev

# Build
npm run build

# Start production
npm start
```

---

## Key Files Reference

```
app/
├── page.tsx                    # Main layout with 3 panels
├── layout.tsx                  # Root layout
├── api/
│   └── stocks/
│       └── route.ts           # Stock data API

components/
├── panels/
│   ├── ProfilePanel.tsx       # Left panel (identity, skills)
│   ├── TerminalNavPanel.tsx   # Center panel (nav)
│   └── MarketDevPanel.tsx     # Right panel (market+dev)
├── windows/
│   ├── Welcome.tsx
│   ├── Projects.tsx
│   ├── Blog.tsx
│   ├── About.tsx
│   ├── Contact.tsx
│   ├── Admin.tsx
│   └── Project*.tsx           # All trading project windows
├── charts/
│   ├── TradingLineChart.tsx
│   ├── TradingBarChart.tsx
│   ├── TradingCandleChart.tsx    # Interactive candlestick with zone highlighting
│   └── TradingMetricsCard.tsx
├── window-manager/
│   ├── Window.tsx
│   └── useWindows.tsx         # Window state + registry
├── terminal/
│   └── TerminalBar.tsx
└── ui/
    ├── StatusBar.tsx
    └── ... (reusable UI components)
```

---

## Vision for Future

The portfolio should feel like:
- **A living workspace** - Not just a static page, but an environment
- **Authentic to the creator** - "Wanna-be quant" self-awareness
- **Data-dense but readable** - Information density without clutter
- **Playful but functional** - Easter eggs, games, but real content delivery
- **Interconnected thinking** - Blog posts link to each other, Obsidian notes form a web of learning

---

## Quick Start for New Sessions

1. Read this file: `PORTFOLIO_CONTEXT.md`
2. Check `components/` for current component structure
3. Review task list for TODO items
4. Follow established patterns (window registry, chart components, styling constants)
5. Test in browser after changes

---

## Gallery Items (Art Showcase)

### Item 1: Interactive Peony (p5.js)

**Type:** Interactive 3D flower with multiple render modes  
**Tech:** p5.js, vanilla JavaScript  
**Features:**
- 3D peony flower (stem, leaves, petals, center)
- 3 render modes: ASCII characters → dots → squares
- Mouse-controlled 3D rotation
- Glitch effects (slice displacement, color shifting)
- Brutalist loading screen with progress bar
- Grows, blooms, wilts, transitions automatically

**Aesthetic notes:**
- Black background (#000)
- Pink/magenta flower palette
- Courier New monospace font
- ASCII characters: `@#$%&*0123456789`
- Smooth easing functions (easeInOutCubic, easeOutQuart)
- Dark, brutalist foundation with organic subject rendered digitally

**Code (save for integration):**
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Peonia</title>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.9.3/p5.min.js"></script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: #000; overflow: hidden; height: 100vh; width: 100vw; }
    canvas { display: block; }
    #canvas-container { width: 100%; height: 100%; }
    #loader {
      position: fixed; inset: 0; z-index: 999; background: #000;
      display: flex; flex-direction: column;
      justify-content: center; align-items: center;
      transition: opacity 0.8s ease;
    }
    #loader.fade { opacity: 0; pointer-events: none; }
    #loader .title {
      color: #fff; font-family: 'Courier New', monospace;
      font-size: 14px; letter-spacing: 4px; opacity: 0.7; margin-bottom: 24px;
    }
    #loader .bar-bg { width: 180px; height: 3px; background: #222; border-radius: 2px; overflow: hidden; }
    #loader .bar-fill { height: 100%; width: 0%; background: linear-gradient(90deg, #c77, #e9b); transition: width 0.15s; }
    #loader .pct { color: #555; font-family: 'Courier New', monospace; font-size: 11px; margin-top: 10px; }
  </style>
</head>
<body>
  <div id="canvas-container"></div>
  <div id="loader">
    <div class="title">LOADING</div>
    <div class="bar-bg"><div class="bar-fill" id="loader-bar"></div></div>
    <div class="pct" id="loader-pct">0%</div>
  </div>
  <!-- Full p5.js sketch code here - see saved file for complete implementation -->
</body>
</html>
```

**To integrate:** Embed as iframe or adapt p5.js sketch to React component when gallery feature is built.

---

**Remember:** The user wants to start fresh sessions with full context. Update this file when:
- Major architecture changes happen
- New patterns are established
- Important decisions are made
- Tasks are completed/added
