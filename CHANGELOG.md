# Particle System Changes - Connector Distribution Fix

## Session Date: 2026-06-03

## Problem
Connectors were stabilizing in one area (typically left side) instead of spreading evenly across screen.

## Root Cause
Density calculations (`_localDensity` and `globalMinDensity`) only considered **connectors**, not **all particles**. This made the `densityGap` comparison meaningless - connectors saw "empty" spaces that were actually full of regular particles.

## The Fix
Changed both density calculations to count **ALL 150 particles** (not just 30 connectors):

```typescript
// BEFORE (wrong)
for (let j = 0; j < particleCount; j++) {
  if (!particles[j]._isConnector) continue  // ← Filtered out regular particles
  // ...
}

// AFTER (fixed)
for (let j = 0; j < particleCount; j++) {
  // No filter - consider all particles
  // ...
}
```

---

## All Changes This Session

### `components/ui/PixelBackground.tsx`

| Feature | Before | After | Keep? |
|---------|--------|-------|-------|
| **Connectors ratio** | 10% (15/150) | 20% (30/150) | ? |
| **React Context** | - | Added for graceMode/frameFreeze | ✓ |
| **Grace modes** | Probabilistic only | Enabled/Disabled/Constant | ✓ |
| **Frame freeze** | - | Added (skip position updates) | ✓ |
| **NaN protection** | - | Added position validation | ✓ |
| **Speed limit** | MAX_SPEED × 6 | × 8 dispersing, × 20 break-free | ? |
| **Free roam mode** | - | Emergency escape (immune to forces) | ? |
| **_localDensity** | Connectors only | ALL particles | ✓ **THE FIX** |
| **globalMinDensity** | Connectors only | ALL particles | ✓ **THE FIX** |
| **Target caching** | Every frame | Every 5 frames | ✓ |
| **Break-free duration** | Shorter | 3-6 seconds | ? |
| **Right-side bias** | - | Added to counteract left skew | ? |
| **Emergency free roam** | - | 25% chance during break-free | ? |
| **Wall bounce damping** | -0.8 (80% retained) | -0.98 (98% retained) | ? |

### `contexts/ExplosionModeContext.tsx`
- Added `graceMode: 'enabled' | 'disabled' | 'constant'`
- Added `frameFreezeEnabled: boolean`
- Both persist to localStorage

### `components/windows/Settings.tsx`
- Added accordion header "> BG Particle"
- Grace period dropdown (Enabled/Disabled/Constant)
- Frame freeze toggle
- Changed footer to "Changes take effect immediately"

### `components/window-manager/useWindows.tsx`
- Settings window title: "Dispersing Settings"

---

## Questionable Changes (Consider Reverting)

These were attempts to fix the distribution issue that may no longer be needed:

1. **20% connectors** - was 10%, more aggressive than needed?
2. **Free roam mode** - emergency escape mechanism, may be overkill
3. **Right-side bias** - added to counteract left skew
4. **Higher speed limits** - MAX_SPEED × 20 during break-free
5. **Emergency free roam chance** - 25% during break-free

The core fix (density counting all particles) may make these unnecessary.

---

## Next Steps
- Test if connectors achieve equilibrium without the "questionable" changes
- If yes, revert them one by one to find minimal solution
