# Particle Physics - Changeable Variables

All tunable constants in `PixelBackground.tsx` that could be exposed in Settings.

---

## Global Particle Settings

| Variable | Value | Description | Category |
|----------|-------|-------------|----------|
| `particleCount` | 150 | Total number of particles | Count |
| `CONNECTOR_RATIO` | 20% | `(i % 10 >= 8)` = 2 out of 10 | Ratio |
| `MAX_SPEED` | 0.8 | Base maximum speed | Speed |
| `DAMPING` | 0.98 | Velocity retention per frame (0.98 = 98%) | Physics |
| `CLUSTER_RADIUS` | 55 | Attraction zone for regular clusters | Distance |
| `ATTRACT` | 0.006 | Cluster attraction strength | Force |
| `CONNECTION_DISTANCE` | 130 | Max distance for web connections | Distance |

## Connector Mesh Settings

| Variable | Value | Description | Category |
|----------|-------|-------------|----------|
| `CONNECTOR_SPACING` | 120 | Optimal distance between connectors | Distance |
| `CONNECTOR_ATTRACT` | 0.003 | Connector-to-connector attraction | Force |
| `repelStrength.medium` | 0.08 | Medium-range (50-250px) repulsion | Force |
| `repelStrength.close` | 0.12 | Close-range (<96px) repulsion | Force |
| `attractStrength.long` | 0.02 | Long-range (>360px) attraction | Force |
| `densityRadius` | 150px | Radius for density calculations | Distance |

## Explosion Settings

| Variable | Value | Description | Category |
|----------|-------|-------------|----------|
| `HARD_CAP` | 7 | Neighbors count for instant explosion | Threshold |
| `UNSTABLE_MIN` | 4 | Min neighbors for unstable state | Threshold |
| `UNSTABLE_MAX` | 6 | Max neighbors for unstable state | Threshold |
| `UNSTABLE_DURATION` | 75 | Frames before unstable explodes (~1.25s) | Time |
| `EXPLOSION_FORCE` | 3.5 | Base explosion blast force | Force |
| `COOLDOWN_FRAMES` | 80 | Immunity frames after explosion (~1.3s) | Time |

## Grace Period Settings

| Variable | Value | Description | Category |
|----------|-------|-------------|----------|
| `graceMode` | 'enabled' | 'enabled'/'disabled'/'constant' | Mode |
| `GRACE_MIN_DURATION` | 120 | Minimum grace frames (2 seconds) | Time |
| `GRACE_MAX_DURATION` | 720 | Maximum grace frames (12 seconds) | Time |
| `graceSkipChance` | 35% | Chance to skip grace check | Probability |
| `graceEnterChance.base` | 0.0008 | Base enter chance per frame (0.08%) | Probability |
| `graceEnterBonus.chaos3` | +0.0015 | Bonus at 3+ explosions | Probability |
| `graceEnterBonus.chaos6` | +0.002 | Bonus at 6+ explosions | Probability |
| `graceEnterBonus.chaos10` | +0.002 | Bonus at 10+ explosions | Probability |
| `graceHardCapChance` | 10% | Chance to get grace on hard cap | Probability |

## Break-Free Settings

| Variable | Value | Description | Category |
|----------|-------|-------------|----------|
| `breakFreeChance.constant` | 40% | Per frame chance when timer expired | Probability |
| `breakFreeDuration.min` | 180 | Minimum break-free frames (3 seconds) | Time |
| `breakFreeDuration.max` | 360 | Maximum break-free frames (6 seconds) | Time |
| `shortBreakTimer` | 90 | Frames before short break check (~1.5s) | Time |
| `longBreakTimer` | 180 | Frames before long break check (~3s) | Time |
| `breakChanceShort.base` | 25% | Base short break chance | Probability |
| `breakChanceLong.base` | 50% | Base long break chance | Probability |
| `densityBonus.cap` | 0.25 | Max bonus from high density | Probability |
| `fitnessBonus.cap` | 0.15 | Max bonus from low fitness | Probability |
| `forceOutChance.highDensity` | 60% | Chance when forced out of high density | Probability |
| `forceOutChance.medDensity` | 25% | Chance when forced out of medium density | Probability |

## Free Roam Settings

| Variable | Value | Description | Category |
|----------|-------|-------------|----------|
| `freeRoamChance` | 25% | Chance to enter free roam during break-free | Probability |
| `freeRoamDuration.min` | 120 | Minimum free roam frames (2 seconds) | Time |
| `freeRoamDuration.max` | 180 | Maximum free roam frames (3 seconds) | Time |

## Speed Multipliers

| Variable | Value | Description | Category |
|----------|-------|-------------|----------|
| `speedMultiplier.dispersing` | 8× | Max speed when dispersing (was 6×) | Speed |
| `speedMultiplier.breakFree` | 20× | Max speed during break-free | Speed |
| `speedMultiplier.freeRoam` | 20× | Max speed during free roam | Speed |
| `speedMultiplier.cornerEscape` | 3× | Max speed during corner escape | Speed |
| `speedMultiplier.connectorsGrace` | 1.5× | Connector speed during grace period | Speed |
| `speedMultiplier.regularGrace` | 0.6× | Regular particle speed during grace | Speed |

## Target Finding Settings

| Variable | Value | Description | Category |
|----------|-------|-------------|----------|
| `targetRecalcInterval` | 5 | Frames between target recalculations | Performance |
| `targetChoice.randomEdge` | 40% | Chance to target random edge/corner | Probability |
| `targetChoice.mostIsolated` | 60% | Chance to target most isolated point | Probability |
| `targetGridSize` | 100px | Grid size for global density search | Distance |
| `densitySearchRadius.global` | 150px | Radius for global min density | Distance |
| `densitySearchRadius.local` | 150px | Radius for local density | Distance |
| `freeRoamSearchRadius` | 100px | Radius for free roam target search | Distance |
| `mostIsolatedGridSize` | 50px | Grid size for most isolated point | Distance |
| `rightSideBias` | 5/12 options | Extra right-side targets to counteract left skew | Bias |

## Wall Bounce Settings

| Variable | Value | Description | Category |
|----------|-------|-------------|----------|
| `wallBounceDamping` | -0.98 | Velocity retention after bounce (98%) | Physics |
| `cornerEscapeThreshold` | 2 bounces | Bounces before speed boost | Threshold |
| `cornerEscapeBoost` | +30% per bounce | Speed boost per consecutive bounce | Physics |

## Force Settings (Mesh Network)

| Variable | Value | Description | Category |
|----------|-------|-------------|----------|
| `regularParticleAvoidance` | 0-200px | Range for gentle push from regular particles | Distance |
| `regularParticleWeight` | 0.02 | Strength of regular particle avoidance | Force |
| `connectorRepulsionRange.medium` | 50-250px | Medium-range repulsion range | Distance |
| `connectorRepulsionRange.close` | <96px | Close-range repulsion range | Distance |
| `connectorAttractionRange.long` | >360px | Long-range attraction range | Distance |
| `densityFactor.cap` | 2.0× | Max density multiplier for forces | Multiplier |
| `densityFactor.divisor` | 4 | Neighbors count for max density factor | Threshold |
| `fitnessFactor.forceReduction` | 70% | Force reduction for high fitness | Multiplier |

## Glow/Visual Settings

| Variable | Value | Description | Category |
|----------|-------|-------------|----------|
| `particleSize.small` | 2px | 70% of particles | Visual |
| `particleSize.large` | 3px | 30% of particles | Visual |
| `connectorBrightness.0` | 0.15 | 25% of connectors | Visual |
| `connectorBrightness.1` | 0.2 | 25% of connectors | Visual |
| `connectorBrightness.2` | 0.25 | 30% of connectors | Visual |
| `connectorBrightness.3` | 0.5 | 20% of connectors | Visual |
| `densityGlow.cap` | 6 neighbors | Max neighbors for glow calculation | Threshold |
| `densityGlow.bonus` | +0.5 | Max brightness bonus from density | Visual |

## Randomness Settings

| Variable | Value | Description | Category |
|----------|-------|-------------|----------|
| `initialVelocityRange` | ±0.2 | Initial random velocity | Range |
| `wanderAmount` | 0.08 | Random wander force for connectors | Force |
| `targetJitter` | ±0.5 | Random jitter when targeting | Force |

---

## Settings UI Groups

For the Settings window, group related variables:

### 1. Particle Count
- particleCount (50-300)
- Connector ratio (5%-50%)

### 2. Speed & Physics
- MAX_SPEED (0.2 - 2.0)
- DAMPING (0.9 - 0.999)
- Speed multipliers

### 3. Forces
- ATTRACT strength
- CONNECTOR_ATTRACT strength
- Repulsion strengths
- Explosion force

### 4. Explosions & Grace
- HARD_CAP (3-10)
- UNSTABLE range (2-8)
- Grace mode dropdown
- Grace duration range

### 5. Connector Behavior
- Break-free chance (0-100%)
- Break-free duration
- Free roam chance
- Target finding weights

### 6. Visuals
- Particle sizes
- Connector brightness
- Glow sensitivity

### 7. Walls
- Bounce damping
- Corner escape
