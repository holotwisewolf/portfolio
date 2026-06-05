'use client'

import { useContext, useState, useEffect } from 'react'
import { ExplosionModeContext } from '@/contexts/ExplosionModeContext'
import { useWindowStore } from '@/components/window-manager/useWindows'

type GraceMode = 'enabled' | 'disabled' | 'constant'
type CrystalMode = 'enabled' | 'disabled' | 'constant'
type ConnectorState = 'auto' | 'zen-only' | 'crystal-only' | 'none'
type ConnectorHighlight = 'disabled' | 'red' | 'yellow' | 'cyan'
type Preset = 'conservative' | 'balanced' | 'chaotic'

export default function Settings() {
  const {
    explosionMode,
    setExplosionMode,
    graceMode,
    setGraceMode,
    frameFreezeEnabled,
    setFrameFreezeEnabled,
    crystalMode,
    setCrystalMode,
    connectorState,
    setConnectorState,
    calmnessEnabled,
    setCalmnessEnabled,
    connectorHighlight,
    setConnectorHighlight,
    particleCount,
    setParticleCount,
    maxSpeed,
    setMaxSpeed,
    attract,
    setAttract,
    clusterRadius,
    setClusterRadius,
    connectorSpacing,
    setConnectorSpacing
  } = useContext(ExplosionModeContext)!

  const openWindow = useWindowStore((state) => state.openWindow)

  const [expanded, setExpanded] = useState(false) // Default collapsed
  const [currentPreset, setCurrentPreset] = useState<Preset>('balanced')

  // Detect current preset from settings values
  useEffect(() => {
    if (particleCount === 100 && maxSpeed === 0.5 && attract === 0.004 && clusterRadius === 40 && connectorSpacing === 150) {
      setCurrentPreset('conservative')
    } else if (particleCount === 200 && maxSpeed === 1.2 && attract === 0.01 && clusterRadius === 70 && connectorSpacing === 100) {
      setCurrentPreset('chaotic')
    } else {
      setCurrentPreset('balanced')
    }
  }, [particleCount, maxSpeed, attract, clusterRadius, connectorSpacing])

  const applyPreset = (preset: Preset) => {
    setCurrentPreset(preset)
    switch (preset) {
      case 'conservative':
        setParticleCount(100)
        setMaxSpeed(0.5)
        setAttract(0.004)
        setClusterRadius(40)
        setConnectorSpacing(150)
        break
      case 'balanced':
        setParticleCount(150)
        setMaxSpeed(0.8)
        setAttract(0.006)
        setClusterRadius(55)
        setConnectorSpacing(120)
        break
      case 'chaotic':
        setParticleCount(200)
        setMaxSpeed(1.2)
        setAttract(0.01)
        setClusterRadius(70)
        setConnectorSpacing(100)
        break
    }
  }

  const toggleExplosionMode = () => {
    const newMode = explosionMode === 'space' ? 'radial' : 'space'
    setExplosionMode(newMode)
  }

  return (
    <div className="h-full bg-black font-mono text-xs p-4 flex flex-col">
      {/* Header */}
      <div className="text-[10px] tracking-wider text-white uppercase border-b border-gray-800 pb-2 mb-4">
        Settings Overview
      </div>

      {/* Terminal Output */}
      <div className="bg-gray-950 border border-gray-800 p-2 flex-shrink-0 overflow-y-auto max-h-[180px]">
        <div className="text-[9px] tracking-wider text-white uppercase mb-1">Settings reference</div>

        <div className="text-gray-700 mb-0.5">$ explosion-mode</div>
        <div className="text-gray-400 mb-0.5 text-[10px]">→ Space Finder: particles spread to fill space</div>
        <div className="text-gray-400 mb-1 text-[10px]">→ Radial Blast: particles burst outward from center</div>

        <div className="text-gray-700 mb-0.5">$ grace-period</div>
        <div className="text-gray-400 mb-0.5 text-[10px]">→ Enabled: slow-mo on explosion, then normal</div>
        <div className="text-gray-400 mb-0.5 text-[10px]">→ Disabled: no slow-mo, immediate normal speed</div>
        <div className="text-gray-400 mb-1 text-[10px]">→ Constant: always in slow-mo</div>

        <div className="text-gray-700 mb-0.5">$ frame-freeze</div>
        <div className="text-gray-400 mb-1 text-[10px]">→ Pauses physics when you interact with windows</div>

        <div className="text-gray-700 mb-0.5">$ crystallization</div>
        <div className="text-gray-400 mb-0.5 text-[10px]">→ Enabled: connectors form geometric grid patterns</div>
        <div className="text-gray-400 mb-0.5 text-[10px]">→ Disabled: connectors stay in flowing state</div>
        <div className="text-gray-400 mb-1 text-[10px]">→ Constant: always crystallized, no flowing</div>

        <div className="text-gray-700 mb-0.5">$ connector-state</div>
        <div className="text-gray-400 mb-0.5 text-[10px]">→ Auto: shows in zen, crystallizes in crystal mode</div>
        <div className="text-gray-400 mb-0.5 text-[10px]">→ Zen Only: only during zen (non-crystal) state</div>
        <div className="text-gray-400 mb-0.5 text-[10px]">→ Crystal Only: only during crystallization</div>
        <div className="text-gray-400 mb-1 text-[10px]">→ None: connectors completely hidden</div>

        <div className="text-gray-700 mb-0.5">$ calmness</div>
        <div className="text-gray-400 mb-1 text-[10px]">→ Gradually slows particles over time for zen effect</div>

        <div className="text-gray-700 mb-0.5">$ connector-highlight</div>
        <div className="text-gray-400 mb-1 text-[10px]">→ Color overlay (red/yellow/cyan) for visibility</div>

        <div className="text-gray-700 mb-0.5">$ advanced-settings</div>
        <div className="text-gray-400 mb-0.5 text-[10px]">→ Fine-tune 21 physics variables: particle count,</div>
        <div className="text-gray-400 mb-0.5 text-[10px]">→ max speed, attraction force, mesh network,</div>
        <div className="text-gray-400 mb-1 text-[10px]">→ edge repulsion with momentum reaction</div>

        <div className="text-gray-700 mb-0.5">$ presets</div>
        <div className="text-gray-400 mb-0.5 text-[10px]">→ Conservative: 100 particles, slower flow</div>
        <div className="text-gray-400 mb-0.5 text-[10px]">→ Balanced: 150 particles, medium flow</div>
        <div className="text-gray-400 mb-1 text-[10px]">→ Chaotic: 200 particles, fast chaotic flow</div>

        <div className="text-gray-700">
          ~/settings{' '}
          <span className="inline-block w-2 h-2 bg-white align-middle animate-pulse" />
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 flex flex-col mt-4">
        <div className="text-[9px] text-gray-600 tracking-widest uppercase mb-2">Navigation</div>

        {/* BG Particle - expandable with animation */}
        <div className="flex-1 overflow-y-auto">
          <div
            onClick={() => setExpanded(!expanded)}
            className="py-1.5 border-b border-gray-900 cursor-pointer tracking-wider text-gray-500 hover:text-white"
          >
            <span className="text-gray-800">
              &gt;
            </span>{' '}
            bg particles
          </div>

          {/* Animated expansion */}
          <div
            className={`overflow-hidden transition-all duration-300 ease-out ${
              expanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="pl-4 py-2 space-y-2">
              {/* Explosion Mode */}
              <div className="border border-gray-800 p-2">
                <div className="text-gray-400 text-[9px] tracking-widest uppercase mb-1">Explosion Mode</div>
                <div className="flex items-center justify-between">
                  <div className="text-gray-300 text-[10px]">
                    {explosionMode === 'space'
                      ? 'Space-finders, particles push 60-70% stronger toward empty spaces'
                      : 'Radial blast, particles are 20-25% stronger than space-finding'}
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleExplosionMode(); }}
                    className="px-3 py-1.5 border border-white text-white hover:bg-white hover:text-black transition-colors text-[10px] w-[80px]"
                  >
                    Toggle
                  </button>
                </div>
              </div>

              {/* Grace Period */}
              <div className="border border-gray-800 p-2">
                <div className="text-gray-400 text-[9px] tracking-widest uppercase mb-1">Grace Period</div>
                <div className="flex items-center justify-between">
                  <div className="text-gray-300 text-[10px]">
                    Stability period after instability
                  </div>
                  <select
                    value={graceMode}
                    onChange={(e) => setGraceMode(e.target.value as GraceMode)}
                    className="px-3 py-1.5 bg-black border border-white text-white hover:bg-white hover:text-black transition-colors cursor-pointer text-[10px] w-[80px]"
                  >
                    <option value="enabled">Enabled</option>
                    <option value="disabled">Disabled</option>
                    <option value="constant">Constant</option>
                  </select>
                </div>
              </div>

              {/* Frame Freeze */}
              <div className="border border-gray-800 p-2">
                <div className="text-gray-400 text-[9px] tracking-widest uppercase mb-1">Frame Freeze</div>
                <div className="flex items-center justify-between">
                  <div className="text-gray-300 text-[10px]">
                    Pauses particles when toggled
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); setFrameFreezeEnabled(!frameFreezeEnabled); }}
                    className="px-3 py-1.5 border border-white text-white hover:bg-white hover:text-black transition-colors text-[10px] w-[80px]"
                  >
                    {frameFreezeEnabled ? 'Enabled' : 'Disabled'}
                  </button>
                </div>
              </div>

              {/* Crystallization */}
              <div className="border border-gray-800 p-2">
                <div className="text-gray-400 text-[9px] tracking-widest uppercase mb-1">Crystallization</div>
                <div className="flex items-center justify-between">
                  <div className="text-gray-300 text-[10px]">
                    Connector attraction increases, more likely to form stable connections
                  </div>
                  <select
                    value={crystalMode}
                    onChange={(e) => setCrystalMode(e.target.value as CrystalMode)}
                    className="px-3 py-1.5 bg-black border border-white text-white hover:bg-white hover:text-black transition-colors cursor-pointer text-[10px] w-[80px]"
                  >
                    <option value="enabled">Enabled</option>
                    <option value="disabled">Disabled</option>
                    <option value="constant">Constant</option>
                  </select>
                </div>
              </div>

              {/* Connector State */}
              <div className="border border-gray-800 p-2">
                <div className="text-gray-400 text-[9px] tracking-widest uppercase mb-1">Connector State</div>
                <div className="flex items-center justify-between">
                  <div className="text-gray-300 text-[10px]">
                    Controls which connector modes activate
                  </div>
                  <select
                    value={connectorState}
                    onChange={(e) => setConnectorState(e.target.value as ConnectorState)}
                    className="px-3 py-1.5 bg-black border border-white text-white hover:bg-white hover:text-black transition-colors cursor-pointer text-[10px] w-[80px]"
                  >
                    <option value="auto">Auto</option>
                    <option value="zen-only">Zen Only</option>
                    <option value="crystal-only">Crystal Only</option>
                    <option value="none">None</option>
                  </select>
                </div>
              </div>

              {/* Calmness */}
              <div className="border border-gray-800 p-2">
                <div className="text-gray-400 text-[9px] tracking-widest uppercase mb-1">Calmness</div>
                <div className="flex items-center justify-between">
                  <div className="text-gray-300 text-[10px]">
                    Reduces connector velocity over time
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); setCalmnessEnabled(!calmnessEnabled); }}
                    className="px-3 py-1.5 border border-white text-white hover:bg-white hover:text-black transition-colors text-[10px] w-[80px]"
                  >
                    {calmnessEnabled ? 'Enabled' : 'Disabled'}
                  </button>
                </div>
              </div>

              {/* Connector Highlight */}
              <div className="border border-gray-800 p-2">
                <div className="text-gray-400 text-[9px] tracking-widest uppercase mb-1">Connector Highlight</div>
                <div className="flex items-center justify-between">
                  <div className="text-gray-300 text-[10px]">
                    Connector color overlay
                  </div>
                  <select
                    value={connectorHighlight}
                    onChange={(e) => setConnectorHighlight(e.target.value as ConnectorHighlight)}
                    className="px-3 py-1.5 bg-black border border-white text-white hover:bg-white hover:text-black transition-colors cursor-pointer text-[10px] w-[80px]"
                  >
                    <option value="disabled">Disabled</option>
                    <option value="red">Red</option>
                    <option value="yellow">Yellow</option>
                    <option value="cyan">Cyan</option>
                  </select>
                </div>
              </div>

              {/* Presets */}
              <div>
                <div className="text-gray-500 text-[10px] mb-2">PRESETS</div>
                <div className="flex gap-2">
                  <button
                    onClick={(e) => { e.stopPropagation(); applyPreset('conservative'); }}
                    className={`flex-1 px-4 py-1.5 border text-[10px] transition-colors ${
                      currentPreset === 'conservative'
                        ? 'border-green-400 text-green-400'
                        : 'border-gray-600 text-gray-400 hover:bg-white hover:text-black'
                    }`}
                  >
                    Conservative
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); applyPreset('balanced'); }}
                    className={`flex-1 px-4 py-1.5 border text-[10px] transition-colors ${
                      currentPreset === 'balanced'
                        ? 'border-green-400 text-green-400'
                        : 'border-gray-600 text-gray-400 hover:bg-white hover:text-black'
                    }`}
                  >
                    Balanced
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); applyPreset('chaotic'); }}
                    className={`flex-1 px-4 py-1.5 border text-[10px] transition-colors ${
                      currentPreset === 'chaotic'
                        ? 'border-green-400 text-green-400'
                        : 'border-gray-600 text-gray-400 hover:bg-white hover:text-black'
                    }`}
                  >
                    Chaotic
                  </button>
                </div>
              </div>

              {/* Advanced Settings */}
              <button
                onClick={(e) => { e.stopPropagation(); openWindow('advanced-physics-settings'); }}
                className="w-full px-4 py-1.5 border border-white text-white hover:bg-white hover:text-black transition-colors text-[10px]"
              >
                Advanced Settings
              </button>

              <div className="text-gray-600 text-[10px]">
                Changes take effect on toggle
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
