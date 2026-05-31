# Portfolio Website Design

**Date:** 2026-05-29
**Author:** YJ
**Status:** Approved

---

## Overview

A minimal, brutalist portfolio website with an integrated blog for book reviews. The aesthetic is pure black and white — terminal-inspired with sharp edges and no rounded corners. The site showcases trading/backtest projects with interactive demos and includes an admin panel for real-time blog publishing.

---

## Visual Language

- **Colors:** Pure black (#000000) and white (#FFFFFF) — no grays, no accents
- **Typography:** Orbit font for headings, clean monospace for body text
- **Edges:** Sharp everywhere — no rounded corners, no border-radius
- **Effects:** Hover effects invert colors (white bg, black text)
- **Style:** Flat design, no shadows, no gradients
- **Hints:** Subtle grid or scan-line effects if they fit the terminal aesthetic

## Window Manager UI

**Window States:**
- **Normal:** Draggable, resizable window
- **Minimized:** Hidden from viewport, shown in taskbar
- **Maximized:** Fills entire viewport
- **Closed:** Removed from viewport and taskbar

**Window Controls:**
- Title bar with: window name, minimize button `[–]`, maximize button `[□]`, close button `[×]`
- Active window has higher contrast (white border)
- Windows can be dragged by title bar
- Click anywhere to bring window to front (z-index)

**Taskbar:**
- Fixed at bottom of viewport
- Shows icons for all open windows
- Click icon to minimize/restore
- Active window highlighted

**Desktop:**
- Black background with optional grid
- Icons for: Projects, Blog, About, Admin
- Double-click icon to open window

---

## Site Structure: Window Manager UI

**Concept:** Desktop-style window manager instead of traditional page navigation

**Windows (draggable, minimizable, closable, maximizable):**
- `Welcome` → Hero/intro (opens on load)
- `Projects` → Portfolio with interactive demos
- `Blog` → Book reviews
- `About` → About page
- `Admin` → Admin panel for writing blog posts

**Desktop Elements:**
- Desktop icons (double-click to open windows)
- Taskbar/dock at bottom (shows open windows, minimizes/restores)
- Windows stack with z-index management
- Window positions persist in localStorage

---

## Page Specifications

### Landing Page (`/`)

**Sections:**
- Hero with name and one-liner
- Terminal-style prompt animation: `> initializing portfolio...`
- Minimal top nav: `PROJECTS | BLOG | ABOUT` (sharp-edged links)
- Featured work section highlighting 2-3 projects

**Visual treatment:**
- Black background, white text
- Sharp-edged containers with 1px white borders
- Hover effects: color inversion

---

### Projects Page (`/projects`)

**Layout:**
- Grid of project cards
- Each card: title, description, tech stack, "Launch Demo" button

**Project Cards:**
- Orderflow Research — Interactive zone classification demo
- Backtest Projects — Parameter-adjustable backtest runner
- Other projects — Screenshots, code snippets, or embedded iframes

**Interactive Demo Features:**
- **Orderflow Research:** Adjust parameters (timeframe, symbol) and see zone classifications on a chart
- **Backtests:** Before/after charts, preset strategies, parameter sliders
- Implementation: React components embedded in project detail pages
- Charting: Lightweight library (recharts or chart.js)

---

### Blog Page (`/blog`)

**Layout:**
- List of book reviews: title, author, date, read time
- Individual review pages with full markdown

**Book Review Template:**
- Title, author, rating (1-5 stars)
- Summary
- Takeaways
- Recommendation (yes/no)

**Visual treatment:**
- Same black/white aesthetic
- Code blocks for quotes/excerpts
- Sharp-edged separators

---

### About Page (`/about`)

**Sections:**
- Brief bio
- Skills/tech stack
- Contact info (GitHub, email, etc.)

---

### Admin Page (`/admin`)

**Purpose:** Write and publish blog posts via GUI

**Features:**
- Form fields: title, book author, rating, content
- Preview mode
- Publish/Unpublish posts
- Edit existing posts
- Simple password protection (env variable)

**Implementation:**
- File-based MDX generation — no database
- Admin form writes directly to `content/blog/` as `.mdx` files
- Rich text or markdown editor

---

## Technical Implementation

### Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Content:** MDX for blog posts
- **Styling:** Tailwind CSS
- **Deployment:** Vercel

### Key Libraries

- `react-draggable` or `@dnd-kit/core` — Window drag-and-drop
- `recharts` or `chart.js` — Trading visualizations
- `next-mdx` — Blog post rendering
- `zustand` or `jotai` — Window manager state
- `framer-motion` — Subtle animations (optional)

### Project Structure

```
portfolio/
├── app/
│   ├── page.tsx          # Main desktop entry
│   ├── layout.tsx        # Root layout
│   └── api/              # API routes for admin
├── components/
│   ├── window-manager/   # Window system
│   │   ├── Window.tsx    # Individual window component
│   │   ├── Taskbar.tsx   # Bottom taskbar
│   │   ├── Desktop.tsx   # Desktop with icons
│   │   └── useWindows.ts # Window state hook
│   ├── windows/          # Window content components
│   │   ├── Welcome.tsx
│   │   ├── Projects.tsx
│   │   ├── Blog.tsx
│   │   ├── About.tsx
│   │   └── Admin.tsx
│   ├── ui/               # Reusable UI components
│   ├── projects/         # Project demo components
│   └── blog/             # Blog-related components
├── content/
│   └── blog/             # MDX blog posts
├── lib/
│   └── window-state.ts   # Window state management
├── public/
│   └── images/
├── styles/
│   └── globals.css
└── package.json
```

---

## Content

### Projects to Showcase

1. **Orderflow Research** — ML Zone Classification System
   - Interactive demo: parameter adjustment, zone classification visualization
   - Tech: Python, ML, FastAPI

2. **Backtest Projects** — Trading strategy backtests
   - Interactive demo: before/after charts, strategy selection
   - Tech: Python, pandas, trading libraries

3. **Shitty Website** — Previous web project
   - Screenshot/code snippet showcase

---

## Success Criteria

1. Portfolio site deploys successfully on Vercel
2. Window manager UI works (drag, minimize, close, maximize)
3. Window positions persist across sessions (localStorage)
4. Trading demos are interactive and functional
5. Blog can be updated via admin panel without touching code
6. Visual aesthetic matches black/white terminal theme
7. Site is responsive (window manager adapts to mobile)
