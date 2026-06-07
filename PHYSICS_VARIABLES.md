# Particle Physics - Changeable Variables

All tunable constants in `PixelBackground.tsx` and Settings UI.

---

## Settings UI Options

All these settings persist to localStorage and take effect immediately (no page reload).

| Setting | Options | Default | Description |
|---------|---------|---------|-------------|
| `explosionMode` | 'space' / 'radial' | 'radial' | Space-finder vs radial blast |
| `graceMode` | 'enabled' / 'disabled' / 'constant' | 'enabled' | Probabilistic slow-mo periods |
| `frameFreezeEnabled` | true / false | false | Freeze particle positions |
| `crystalMode` | 'enabled' / 'disabled' / 'constant' | 'enabled' | Crystal formation mode |
| `connectorState` | 'auto' / 'zen-only' / 'crystal-only' / 'none' | 'auto' | Which special states can trigger |
| `calmnessEnabled` | true / false | true | Fitness and zen calmness effects |
| `connectorHighlight` | 'disabled' / 'red' / 'yellow' / 'cyan' | 'disabled' | Visual connector highlight color |
| `discoMode` | 'disabled' / 'enabled' / 'extreme' | 'disabled' | Rainbow particle colors |
| `woozyMode` | 'disabled' / 'enabled' / 'extreme' | 'disabled' | Pulsing particle sizes |
| `particleShape` | 'square' / 'circle' / 'triangle' / 'pentagon' / 'hexagon' | 'square' | Shape of particles |
| `cursorInteractionMode` | 'none' / 'push' / 'attract' | 'none' | Cursor interaction with particles |
| `cursorRippleEnabled` | true / false | false | Visual ripple on cursor movement |
| `cursorConnectParticles` | true / false | false | Draw lines from cursor to nearby particles |
| `cursorClickExplodeCluster` | true / false | false | Click creates explosion |
| `iconAttractParticles` | true / false | false | Icons attract particles (edge-based) |
| `iconCollideParticles` | true / false | false | Icons have physical collision with particles |
| `iconConnectParticles` | true / false | false | Draw lines from icon edges to nearby particles |

---

## Cursor Interaction Settings

### Settings UI Controls

| Setting | Options | Default | Description |
|---------|---------|---------|-------------|
| `cursorInteractionMode` | 'none' / 'push' / 'attract' | 'none' | Cursor interaction with particles |
| `cursorRippleEnabled` | true / false | false | Visual ripple on cursor movement |
| `cursorConnectParticles` | true / false | false | Draw lines from cursor to nearby particles |
| `cursorClickExplodeCluster` | true / false | false | Click creates explosion |

### Physics Constants

| Variable | Value | Description | Category |
|----------|-------|-------------|----------|
| `COLLISION_RADIUS` | 18px | Cursor physical collision radius | Distance |
| `CURSOR_PUSH_FORCE` | 0.8× | Multiplier for cursor push based on velocity | Force |
| `CURSOR_ATTRACT_FORCE` | 0.06 | Attraction force when mode is 'attract' | Force |
| `MOUSE_VELOCITY_SMOOTHING` | 0.15 | Cursor velocity smoothing factor | Physics |

### Mechanics

**Push Mode (Momentum-based)**:
- Collision radius: 18px (smaller for less "invisible wall" feel)
- Push force scales with cursor velocity (faster movement = stronger push)
- Push multiplier: 0.8× (reduced from 2× for gentler feel)
- Velocity smoothing: 0.15 (prevents jittery reactions)

**Attract Mode**:
- Particles within collision radius are drawn toward cursor
- Attraction force: 0.06 (gentle pull)

**Click to Explode**:
- Triggers explosion at cursor position
- Uses standard explosion mechanics (see Explosion Settings)

**Cursor Connect**:
- Draws lines from cursor to particles within connection distance
- Uses same connection distance as particle-particle connections

---

## Icon Interaction Settings

### Settings UI Controls

| Setting | Options | Default | Description |
|---------|---------|---------|-------------|
| `iconAttractParticles` | true / false | false | Icons attract particles to edges |
| `iconCollideParticles` | true / false | false | Icons have physical collision with particles |
| `iconConnectParticles` | true / false | false | Draw lines from icon edges to nearby particles |

### Physics Constants

| Variable | Value | Description | Category |
|----------|-------|-------------|----------|
| `ICON_ATTRACT_FORCE` | 0.08 | Attraction to icons (edge-based) | Force |
| `ICON_CONNECT_DISTANCE` | 100px | Max distance for icon-to-particle lines | Distance |
| `ICON_SIZE` | 64×88px | Desktop icon dimensions | Geometry |

### Mechanics

**Edge-Based Attraction**:
- Finds nearest point on icon rectangle (clamps to bounds)
- Not center-based - treats icon as solid object
- Attraction force: 0.08 (weak, subtle pull)
- Scales with distance (stronger when closer)

**Physical Collision**:
- Treats icon boundaries as solid walls
- Particles bounce off icon edges
- Uses same collision mechanics as cursor

**Icon Connect**:
- Draws lines from icon edges (not center) to nearby particles
- Uses shorter distance (100px vs 130px for particle-particle)
- Creates visual "field" around icons

---

## Visual Effects Settings

### Settings UI Controls

| Setting | Options | Default | Description |
|---------|---------|---------|-------------|
| `discoMode` | 'disabled' / 'enabled' / 'extreme' | 'disabled' | Rainbow particle colors |
| `woozyMode` | 'disabled' / 'enabled' / 'extreme' | 'disabled' | Pulsing particle sizes |
| `particleShape` | 'square' / 'circle' / 'triangle' / 'pentagon' / 'hexagon' | 'square' | Shape of particles |

### Mechanics

**Disco Mode**:
- Each particle changes colors at random intervals
- Smooth hue transitions (5% per frame toward target hue)
- Particles pick new target hues every 0.5-2.5 seconds
- Color format: HSLA with 80% saturation, 60% lightness
- Creates dynamic, non-uniform rainbow effect
- **Enabled**: Connector lines between same-colored particles take that color
  - Particles with similar hues (within 15°) are considered "same color"
  - Line uses particle's hue when colors match
  - Dimmed white line (50% opacity) when colors differ
- **Extreme**: Every connection line gets random colors
  - Each connection line has its own hue based on time and particle indices
  - Creates chaotic rainbow web effect

**Woozy Mode**:
- Particles pulse in size using sine wave
- **Enabled**: Size range 0.8× to 1.4×, slow pulse (200ms period)
- **Extreme**: Random size explosions
  - 20% chance: 2× size (1.5s duration)
  - 10% chance: 4× size (1s duration)
  - 5% chance: 6× size (0.8s duration)
  - 3% chance: 8× size (0.7s duration)
  - 2% chance: 16× size (0.5s duration)
  - 40% total chance per frame for any particle to go extreme

**Particle Shape**:
- **Square**: Default rectangular particles (fillRect)
- **Circle**: Round particles using arc()
- **Triangle**: 3-sided polygon pointing up
- **Pentagon**: 5-sided polygon
- **Hexagon**: 6-sided polygon
- All shapes render centered on particle position
- Size varies by woozy mode, density, and base particle size

---

## Global Particle Settings

| Variable | Value | Description | Category |
|----------|-------|-------------|----------|
| `particleCount` | 150 | Total number of particles | Count |
| `CONNECTOR_RATIO` | 10% | `(i % 10 >= 9)` = 1 out of 10 | Ratio |
| `MAX_SPEED` | 0.8 | Base maximum speed | Speed |
| `DAMPING` | 0.98 | Velocity retention per frame (0.98 = 98%) | Physics |
| `CLUSTER_RADIUS` | 55 | Attraction zone for regular clusters | Distance |
| `ATTRACT` | 0.006 | Cluster attraction strength | Force |
| `CONNECTION_DISTANCE` | 130 | Max distance for web connections | Distance |
| `CLOSE_REPEL_DIST` | 12px | Close-range repulsion distance for particles | Distance |
| `SPACE_SCAN_RADIUS` | 200px | Radius for space-finder explosion scan | Distance |
| `DENSITY_SEARCH_RADIUS` | 150px | Radius for all density calculations | Distance |
| `TARGET_PROXIMITY` | 30px | Minimum distance before reaching break-free target | Distance |

---

## Connector Mesh Settings

**All of these are now adjustable in Advanced Settings → Mesh Network section**

| Variable | Value | Description | Category |
|----------|-------|-------------|----------|
| `CONNECTOR_SPACING` | 120 | Optimal distance between connectors | Distance |
| `CONNECTOR_ATTRACT` | 0.003 | Connector-to-connector base attraction | Force |
| `CONNECTOR_ATTRACT_BASE` | 0.0625 | Connector mesh attraction multiplier | Force |
| `CONNECTOR_ATTRACT_RANGE_NORMAL` | 360 | Attraction range normally | Distance |
| `CONNECTOR_ATTRACT_RANGE_CRYSTAL` | 180 | Attraction range during crystal | Distance |
| `CONNECTOR_REPEL_STRENGTH` | 0.03 | Connector-to-connector repulsion | Force |
| `CONNECTOR_REPEL_RANGE` | 96 | Repulsion range | Distance |
| `TARGET_SEEK_FORCE` | 0.2 | Force toward target when breaking free | Force |
| `EDGE_MARGIN` | 15px | Distance from edge for repulsion to activate | Distance |
| `EDGE_REPEL_FORCE_NORMAL` | 0.03 | Connector edge repulsion (normal zone) | Force |
| `EDGE_REPEL_FORCE_URGENT` | 0.06 | Connector edge repulsion (urgent zone) | Force |
| `EDGE_URGENT` | 10px | Threshold for urgent stronger push | Distance |
| `EDGE_MOMENTUM_REACTION` | 0.5 (50%) | Opposite reaction factor from incoming velocity | Multiplier |

### Edge Repulsion Mechanics

Connectors have proactive edge avoidance to prevent lining up along screen borders:

- **15px margin**: Repulsion activates when connector is within 15px of any edge
- **Two-zone force**:
  - **10-15px from edge**: `0.03 × distance` (gentle push)
  - **0-10px from edge**: `0.06 × distance` (2x stronger, urgent push)
- **Opposite reaction**: Adds 50% of incoming velocity as repulsion force
  - If connector is moving toward edge at velocity 0.5, adds 0.25 extra push back
  - Creates realistic "bounce" effect before hitting the actual wall
  - Faster approach = stronger opposite reaction
- **Applies to**: Connectors only, when NOT in break-free mode
- **Purpose**: Prevents connectors from clustering along edges while maintaining natural movement near borders

---

## Zen Mode Settings

| Variable | Value | Description | Category |
|----------|-------|-------------|----------|
| `ZEN_TRIGGER_CHANCE` | 0.03 (3%) | Per frame chance to enter zen mode | Probability |
| `ZEN_MIN_DURATION` | 300 (5s) | Minimum zen mode frames | Time |
| `ZEN_MAX_DURATION` | 600 (10s) | Maximum zen mode frames | Time |
| `zenMovementSpeed` | 0.4x | Speed multiplier during zen mode | Speed |
| `zenForceReduction` | 0.2x (80%) | Force multiplier during zen mode | Multiplier |

---

## Crystallization Settings

| Variable | Value | Description | Category |
|----------|-------|-------------|----------|
| `CRYSTAL_TRIGGER_CHANCE` | 0.025 (2.5%) | Per frame chance to crystallize (enabled mode) | Probability |
| `CRYSTAL_MIN_DURATION` | 180 (3s) | Minimum crystal mode frames | Time |
| `CRYSTAL_MAX_DURATION` | 720 (12s) | Maximum crystal mode frames | Time |
| `CRYSTAL_MIN_CONNECTORS` | 5 | Minimum connectors nearby to trigger (enabled mode) | Threshold |
| `CRYSTAL_CONST_MIN_CONNECTORS` | 3 | Minimum connectors nearby to trigger (constant mode) | Threshold |
| `crystalAttractMult` | 8.0x | Mesh attraction multiplier during crystal | Multiplier |
| `crystalRepelMult` | 0.3x (70%) | Mesh repulsion reduction during crystal | Multiplier |
| `crystalDensityFactor.ignored` | true | Density factor ignored during crystal | Optimization |

---

## Explosion Settings

| Variable | Value | Description | Category |
|----------|-------|-------------|----------|
| `SPACE_FINDER_RATIO` | 30% | (i % 10 >= 7) = 3 out of 10 particles | Ratio |
| `HARD_CAP` | 7 | Neighbors count for instant explosion | Threshold |
| `UNSTABLE_MIN` | 4 | Min neighbors for unstable state | Threshold |
| `UNSTABLE_MAX` | 6 | Max neighbors for unstable state | Threshold |
| `UNSTABLE_DURATION` | 75 | Frames before unstable explodes (~1.25s) | Time |
| `EXPLOSION_FORCE` | 3.5 | Base explosion blast force | Force |
| `COOLDOWN_FRAMES` | 80 | Immunity frames after explosion (~1.3s) | Time |

---

## Grace Period Settings

| Variable | Value | Description | Category |
|----------|-------|-------------|----------|
| `GRACE_MIN_DURATION` | 120 (2s) | Minimum grace frames | Time |
| `GRACE_MAX_DURATION` | 720 (12s) | Maximum grace frames | Time |
| `graceSkipChance` | 35% | Chance to skip grace check per frame | Probability |
| `graceEnterChance.base` | 0.0008 (0.08%) | Base enter chance per frame | Probability |
| `graceEnterBonus.chaos3` | +0.0015 | Bonus at 3+ explosions | Probability |
| `graceEnterBonus.chaos6` | +0.002 | Bonus at 6+ explosions | Probability |
| `graceEnterBonus.chaos10` | +0.002 | Bonus at 10+ explosions | Probability |
| `graceHardCapChance` | 10% | Chance to get grace on hard cap | Probability |

---

## Social Battery Settings

| Variable | Value | Description | Category |
|----------|-------|-------------|----------|
| `SOCIAL_BATTERY_DRAIN` | 0.02 | Battery drain per frame when ≥3 connectors | Rate |
| `SOCIAL_BATTERY_RECHARGE_FAST` | 0.02 | Fast recharge when ≤2 connectors (loner) | Rate |
| `SOCIAL_BATTERY_RECHARGE_NORMAL` | 0.01 | Normal recharge rate | Rate |
| `batteryBonus.max` | 2.0 | Max tolerance bonus from full battery | Bonus |

---

## Break-Free Settings

| Variable | Value | Description | Category |
|----------|-------|-------------|----------|
| `shortBreakTimer` | 90 (1.5s) | Frames before short break check | Time |
| `longBreakTimer` | 180 (3s) | Frames before long break check | Time |
| `breakChanceShort.base` | 25% | Base short break chance | Probability |
| `breakChanceLong.base` | 50% | Base long break chance | Probability |
| `densityBonus.cap` | 0.25 | Max bonus from high connector density | Probability |
| `fitnessBonus.forceReduction` | 20% | Break-free chance reduction from fitness | Probability |
| `lonerBonus` | 2.0 | Extra tolerance when density ≤2 | Bonus |
| `breakFreeCooldown.min` | 120 (2s) | Minimum cooldown frames | Time |
| `breakFreeCooldown.max` | 210 (3.5s) | Maximum cooldown frames | Time |
| `breakFreeCooldown.weakenFactor` | 0.2x (80%) | Mesh attraction reduction during cooldown | Multiplier |

---

## Stay Timer Settings

| Variable | Value | Description | Category |
|----------|-------|-------------|----------|
| `desyncNoise.tickChance` | 85% | Chance stay timer ticks per frame | Probability |
| `uniquePatience.min` | 120 (2s) | Minimum frames before break-free | Time |
| `uniquePatience.max` | 240 (4s) | Maximum frames before break-free | Time |
| `dynamicTolerance.base` | 2.0 | Base tolerance for staying | Bonus |
| `dynamicTolerance.contrastMult` | 0.4 | Contrast multiplier for tolerance | Multiplier |

---

## Fitness Settings

| Variable | Value | Description | Category |
|----------|-------|-------------|----------|
| `fitness.divisor` | 8 | Neighbors count for fitness = 0 | Threshold |
| `fitnessFactor.forceReduction` | 70% | Max force reduction at fitness = 1.0 | Multiplier |
| `fitness.enabled` | via calmnessEnabled | Requires calmness to be enabled | Setting |

---

## Speed Multipliers

| Variable | Value | Description | Category |
|----------|-------|-------------|----------|
| `speedMultiplier.dispersing` | 6× | Max speed when dispersing | Speed |
| `speedMultiplier.breakFree` | 6× | Max speed during break-free | Speed |
| `speedMultiplier.regularGrace` | 0.6× | Regular particle speed during grace | Speed |
| `speedMultiplier.connectorGrace` | 0.8× | Connector speed during grace | Speed |
| `speedMultiplier.zenMode` | 0.4× | Connector speed during zen mode | Speed |

---

## Target Finding Settings

| Variable | Value | Description | Category |
|----------|-------|-------------|----------|
| `targetRecalcInterval` | 15 | Frames between target recalculations | Performance |
| `targetGridSize` | 50px | Grid size for most isolated point search | Distance |
| `densitySearchRadius` | 150px | Radius for density calculations | Distance |

---

## Wall Bounce Settings

| Variable | Value | Description | Category |
|----------|-------|-------------|----------|
| `wallBounceDamping` | -0.98 | Velocity retention after bounce (98%) | Physics |
| `cornerEscapeThreshold` | 2 bounces | Bounces before speed boost | Threshold |
| `cornerEscapeBoost` | +30% per bounce | Speed boost per consecutive bounce | Physics |

---

## Connector Highlight Colors

| Color | RGB Values | Description |
|-------|------------|-------------|
| `disabled` | (255, 255, 255) | Default white |
| `red` | (255, 100, 100) | Soft red |
| `yellow` | (255, 255, 100) | Soft yellow |
| `cyan` | (100, 255, 255) | Soft cyan |

---

## Glow/Visual Settings

| Variable | Value | Description | Category |
|----------|-------|-------------|----------|
| `particleSize.small` | 2px | 70% of particles | Visual |
| `particleSize.large` | 3px | 30% of particles | Visual |
| `connectorBrightness` | 0.2-0.5 | Randomized: 0.2 (25%), 0.25 (25%), 0.3 (30%), 0.5 (20%) | Visual |
| `densityGlow.divisor` | 6 | Neighbors count for max glow | Threshold |
| `densityGlow.bonus` | 0.5 | Max brightness bonus from density | Visual |

