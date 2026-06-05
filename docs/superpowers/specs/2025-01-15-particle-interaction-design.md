# Particle Interaction System Design

**Date:** 2025-01-15
**Status:** Approved

## Overview

Add toggleable interactions between cursor/windows and background particles. Users can enable playful visual effects through Settings UI.

## Features

### Cursor Interactions
- **Ripple:** Click to create burst wave that pushes particles away
- **Attract:** Particles swarm toward cursor position
- **Collide:** Cursor physically pushes particles on contact
- **Connections:** Draw lines from cursor to nearby particles (web-style)

All cursor modes can combine with ripple for layered effects.

### Desktop Icon Interactions
- **Attract:** Particles gather around open windows
- **Collide:** Windows push particles when dragged

## Settings UI Structure

Two new expandable sections in Settings.tsx (under bg particles):

```
> cursor interactions
  - Cursor Mode: none / attract / collide
  - Ripple: toggle
  - Connections: toggle

> desktop icons interaction
  - Attract Particles: toggle
  - Collide Particles: toggle
```

Same toggles also available in Advanced Settings for power users.

## Context Variables

Added to `ExplosionModeContext`:

```typescript
// Cursor interactions
cursorInteractionMode: 'none' | 'attract' | 'collide'
cursorRippleEnabled: boolean
cursorConnectParticles: boolean

// Window interactions
windowAttractParticles: boolean
windowCollideParticles: boolean
```

All persist to localStorage.

## Implementation

### Files to Modify

1. **ExplosionModeContext.tsx** (~50 lines)
   - Add 5 state variables with localStorage
   - Add setter handlers

2. **Settings.tsx** (~60 lines)
   - Add `> cursor interactions` section
   - Add `> desktop icons interaction` section
   - Follow existing expandable pattern

3. **AdvancedSettings.tsx** (~20 lines)
   - Add same toggles in appropriate sections
   - Cursor section under Physics
   - Window section under existing

4. **PixelBackground.tsx** (~180 lines)
   - Track cursor position via event listeners
   - Read window positions from useWindowStore
   - Apply forces in particle update loop
   - Render cursor connection lines

### PixelBackground Changes

**State tracking:**
```typescript
const mousePos = useRef({ x: 0, y: 0 })
const mouseDownRef = useRef(false)
const rippleActiveRef = useRef(false)
const ripplePosRef = useRef({ x: 0, y: 0, frame: 0 })
```

**Event listeners:**
```typescript
useEffect(() => {
  const handleMouseMove = (e: MouseEvent) => {
    mousePos.current = { x: e.clientX, y: e.clientY }
  }
  const handleMouseDown = (e: MouseEvent) => {
    if (cursorRippleEnabled) {
      rippleActiveRef.current = true
      ripplePosRef.current = { x: e.clientX, y: e.clientY, frame: 0 }
    }
  }
  // ... add/remove listeners
}, [cursorRippleEnabled])
```

**Force application (in particle update):**
```typescript
// Cursor interactions
if (cursorInteractionMode !== 'none') {
  const dx = p.x - mousePos.current.x
  const dy = p.y - mousePos.current.y
  const dist = Math.sqrt(dx * dx + dy * dy)

  if (dist < cursorRange) {
    if (cursorInteractionMode === 'attract') {
      // Pull toward cursor
    } else if (cursorInteractionMode === 'collide') {
      // Push away if overlapping
    }
  }
}

// Ripple (expanding ring)
if (cursorRippleEnabled && rippleActiveRef.current) {
  const ringDist = Math.abs(dist - rippleFrame * rippleSpeed)
  if (ringDist < rippleWidth) {
    // Apply outward force
  }
}

// Window interactions
if (windowAttractParticles || windowCollideParticles) {
  for (const window of openWindows) {
    // Apply attract/collide forces
  }
}
```

**Connection line rendering:**
```typescript
if (cursorConnectParticles) {
  for (const p of particles) {
    const dist = distance(p, mousePos)
    if (dist < connectionDistance) {
      ctx.beginPath()
      ctx.moveTo(mousePos.x, mousePos.y)
      ctx.lineTo(p.x, p.y)
      ctx.strokeStyle = `rgba(255,255,255,${1 - dist/connectionDistance})`
      ctx.stroke()
    }
  }
}
```

### Constants

```typescript
CURSOR_RANGE = 150          // Distance for cursor interaction
CURSOR_FORCE = 0.05         // Attraction strength
COLLISION_RADIUS = 20       // Cursor physical collision
WINDOW_MARGIN = 50          // Buffer around windows
RIPPLE_SPEED = 8            // Pixels per frame
RIPPLE_WIDTH = 30           // Wave thickness
RIPPLE_FORCE = 0.3          // Outward push strength
RIPPLE_DURATION = 60        // Frames (~1 second)
```

### Performance Considerations

- Cursor position: Single `mousemove` listener, updates ref (no re-render)
- Window positions: Cached per frame, not re-read every particle
- Distance checks: Only when interactions enabled
- Line drawing: Reuses existing `connectionDistance` constant
- All calculations in existing animation loop (no extra RAF)

## Success Criteria

1. Settings UI shows new sections with correct toggles
2. Cursor modes work independently and combined with ripple
3. Window attract/collide only affect open windows
4. Connection lines use same visual style as particle mesh
5. All settings persist across page reloads
6. Performance impact < 5% FPS drop when all enabled

## Future Extensions (Out of Scope)

- Keyboard-triggered effects
- Sound on ripple
- Different visual styles for connections
- Per-window interaction settings
