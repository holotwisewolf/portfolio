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

---

## Connector Mesh Settings

| Variable | Value | Description | Category |
|----------|-------|-------------|----------|
| `CONNECTOR_SPACING` | 120 | Optimal distance between connectors | Distance |
| `CONNECTOR_ATTRACT` | 0.003 | Connector-to-connector attraction | Force |
| `densityRadius` | 150px | Radius for density calculations | Distance |
| `targetSeekForce` | 0.1 | Force toward target when breaking free | Force |

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
| `CRYSTAL_TRIGGER_CHANCE` | 0.025 (2.5%) | Per frame chance to crystallize | Probability |
| `CRYSTAL_MIN_DURATION` | 180 (3s) | Minimum crystal mode frames | Time |
| `CRYSTAL_MAX_DURATION` | 720 (12s) | Maximum crystal mode frames | Time |
| `CRYSTAL_MIN_CONNECTORS` | 5 | Minimum connectors nearby to trigger | Threshold |
| `CRYSTAL_CONST_MIN_CONNECTORS` | 3 | For constant mode (lower threshold) | Threshold |
| `crystalAttractMult` | 8.0x | Mesh attraction multiplier during crystal | Multiplier |
| `crystalRepelMult` | 0.3x (70%) | Mesh repulsion reduction during crystal | Multiplier |

---

## Explosion Settings

| Variable | Value | Description | Category |
|----------|-------|-------------|----------|
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
| `connectorBrightness.0` | 0.2 | 25% of connectors | Visual |
| `connectorBrightness.1` | 0.25 | 25% of connectors | Visual |
| `connectorBrightness.2` | 0.3 | 30% of connectors | Visual |
| `connectorBrightness.3` | 0.5 | 20% of connectors | Visual |
| `densityGlow.divisor` | 6 | Neighbors count for max glow | Threshold |
| `densityGlow.bonus` | 0.5 | Max brightness bonus from density | Visual |
