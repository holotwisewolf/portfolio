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
      <div className="bg-gray-950 border border-gray-800 p-2 flex-shrink-0 overflow-y-auto max-h-[140px]">
        <div className="text-[9px] tracking-wider text-white uppercase mb-1">Settings commands</div>

        <div className="text-gray-700 mb-0.5">$ help</div>
        <div className="text-gray-400 mb-1 text-[10px]">→ explosion-mode, grace-period, frame-freeze, etc.</div>

        <div className="text-gray-700 mb-0.5">$ config</div>
        <div className="text-gray-400 mb-1 text-[10px]">→ Current configuration loaded.</div>

        {/* Settings descriptions */}
        <div className="text-[9px] tracking-wider text-white uppercase mb-1 pt-1 border-t border-gray-800 mt-1">Settings info</div>

        <div className="text-gray-700 mb-0.5">explosion-mode</div>
        <div className="text-gray-400 mb-0.5 text-[10px]">→ Controls particle explosion pattern</div>

        <div className="text-gray-700 mb-0.5">grace-period</div>
        <div className="text-gray-400 mb-0.5 text-[10px]">→ Initial slow-motion phase duration</div>

        <div className="text-gray-700 mb-0.5">frame-freeze</div>
        <div className="text-gray-400 mb-0.5 text-[10px]">→ Pauses updates on window interaction</div>

        <div className="text-gray-700 mb-0.5">crystallization</div>
        <div className="text-gray-400 mb-0.5 text-[10px]">→ Forms geometric grid structures</div>

        <div className="text-gray-700 mb-0.5">connector-state</div>
        <div className="text-gray-400 mb-0.5 text-[10px]">→ Controls connector visibility modes</div>

        <div className="text-gray-700 mb-0.5">calmness</div>
        <div className="text-gray-400 mb-0.5 text-[10px]">→ Reduces particle velocity over time</div>

        <div className="text-gray-700 mb-0.5">connector-highlight</div>
        <div className="text-gray-400 mb-2 text-[10px]">→ Color overlay for connector visibility</div>

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
                <div className="text-gray-400 text-[9px] tracking-widest uppercase mb-2">Explosion Mode</div>
                <div className="flex items-center justify-between">
                  <div className="text-gray-300 text-[10px]">
                    {explosionMode === 'space' ? 'Space Finder' : 'Radial Blast'}
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
                <div className="text-gray-400 text-[9px] tracking-widest uppercase mb-2">Grace Period</div>
                <div className="flex items-center justify-between">
                  <div className="text-gray-300 text-[10px]">
                    {graceMode.charAt(0).toUpperCase() + graceMode.slice(1)}
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
                <div className="text-gray-400 text-[9px] tracking-widest uppercase mb-2">Frame Freeze</div>
                <div className="flex items-center justify-between">
                  <div className="text-gray-300 text-[10px]">
                    {frameFreezeEnabled ? 'Enabled' : 'Disabled'}
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); setFrameFreezeEnabled(!frameFreezeEnabled); }}
                    className="px-3 py-1.5 border border-white text-white hover:bg-white hover:text-black transition-colors text-[10px] w-[80px]"
                  >
                    {frameFreezeEnabled ? 'Disable' : 'Enable'}
                  </button>
                </div>
              </div>

              {/* Crystallization */}
              <div className="border border-gray-800 p-2">
                <div className="text-gray-400 text-[9px] tracking-widest uppercase mb-2">Crystallization</div>
                <div className="flex items-center justify-between">
                  <div className="text-gray-300 text-[10px]">
                    {crystalMode.charAt(0).toUpperCase() + crystalMode.slice(1)}
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
                <div className="text-gray-400 text-[9px] tracking-widest uppercase mb-2">Connector State</div>
                <div className="flex items-center justify-between">
                  <div className="text-gray-300 text-[10px]">
                    {connectorState === 'auto' ? 'Auto' : connectorState === 'zen-only' ? 'Zen Only' : connectorState === 'crystal-only' ? 'Crystal Only' : 'None'}
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
                <div className="text-gray-400 text-[9px] tracking-widest uppercase mb-2">Calmness</div>
                <div className="flex items-center justify-between">
                  <div className="text-gray-300 text-[10px]">
                    {calmnessEnabled ? 'Enabled' : 'Disabled'}
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); setCalmnessEnabled(!calmnessEnabled); }}
                    className="px-3 py-1.5 border border-white text-white hover:bg-white hover:text-black transition-colors text-[10px] w-[80px]"
                  >
                    {calmnessEnabled ? 'Disable' : 'Enable'}
                  </button>
                </div>
              </div>

              {/* Connector Highlight */}
              <div className="border border-gray-800 p-2">
                <div className="text-gray-400 text-[9px] tracking-widest uppercase mb-2">Connector Highlight</div>
                <div className="flex items-center justify-between">
                  <div className="text-gray-300 text-[10px]">
                    {connectorHighlight === 'disabled' ? 'Disabled' : connectorHighlight.charAt(0).toUpperCase() + connectorHighlight.slice(1)}
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
