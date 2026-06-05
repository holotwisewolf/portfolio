'use client'

import { useContext, useState } from 'react'
import { ExplosionModeContext } from '@/contexts/ExplosionModeContext'

type GraceMode = 'enabled' | 'disabled' | 'constant'
type CrystalMode = 'enabled' | 'disabled' | 'constant'
type ConnectorState = 'auto' | 'zen-only' | 'crystal-only' | 'none'

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
    setCalmnessEnabled
  } = useContext(ExplosionModeContext)!

  const [expanded, setExpanded] = useState(true)

  const toggleExplosionMode = () => {
    const newMode = explosionMode === 'space' ? 'radial' : 'space'
    setExplosionMode(newMode)
  }

  return (
    <div className="h-full bg-black font-mono text-xs p-4 flex flex-col">
      {/* Navigation Header */}
      <div className="border-b border-white pb-2 mb-4">
        <div
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-2 cursor-pointer hover:bg-white/10 px-2 py-1"
        >
          <span className="text-green-400">{'>'}</span>
          <span className="text-white">BG Particle</span>
          <span className="text-gray-500 ml-auto">{expanded ? '▼' : '▶'}</span>
        </div>
      </div>

      {/* Settings */}
      {expanded && (
        <div className="flex-1 overflow-y-auto space-y-4">
          {/* Explosion Mode */}
          <div className="border border-gray-700 p-3">
            <div className="text-gray-400 text-[9px] tracking-widest uppercase mb-3">
              Explosion Mode
            </div>
            <div className="flex items-center justify-between">
              <div className="text-gray-300">
                <div className="mb-1">
                  <span className="text-white">Current:</span> {explosionMode === 'space' ? 'Space Finder' : 'Radial Blast'}
                </div>
                <div className="text-gray-500 text-[10px]">
                  {explosionMode === 'space'
                    ? 'Space-finders push 60-70% stronger toward empty spaces'
                    : 'Radial blast is 20-25% stronger than space-finding'}
                </div>
              </div>
              <button
                onClick={toggleExplosionMode}
                className="px-4 py-2 border border-white hover:bg-white hover:text-black transition-colors"
              >
                Toggle
              </button>
            </div>
          </div>

          {/* Grace Period */}
          <div className="border border-gray-700 p-3">
            <div className="text-gray-400 text-[9px] tracking-widest uppercase mb-3">
              Grace Period
            </div>
            <div className="flex items-center justify-between">
              <div className="text-gray-300">
                <div className="mb-1">
                  <span className="text-white">Mode:</span> {graceMode.charAt(0).toUpperCase() + graceMode.slice(1)}
                </div>
                <div className="text-gray-500 text-[10px]">
                  {graceMode === 'enabled'
                    ? 'Probabilistic slow-mo periods'
                    : graceMode === 'constant'
                    ? 'Always in slow-mo'
                    : 'No grace periods'}
                </div>
              </div>
              <select
                value={graceMode}
                onChange={(e) => setGraceMode(e.target.value as GraceMode)}
                className="px-3 py-2 bg-black border border-white text-white hover:bg-white hover:text-black transition-colors cursor-pointer"
              >
                <option value="enabled">Enabled</option>
                <option value="disabled">Disabled</option>
                <option value="constant">Constant</option>
              </select>
            </div>
          </div>

          {/* Frame Freeze */}
          <div className="border border-gray-700 p-3">
            <div className="text-gray-400 text-[9px] tracking-widest uppercase mb-3">
              Frame Freeze
            </div>
            <div className="flex items-center justify-between">
              <div className="text-gray-300">
                <div className="mb-1">
                  <span className="text-white">Status:</span> {frameFreezeEnabled ? 'ENABLED' : 'DISABLED'}
                </div>
                <div className="text-gray-500 text-[10px]">
                  {frameFreezeEnabled
                    ? 'Particle positions frozen (glow still calculated)'
                    : 'Normal particle movement'}
                </div>
              </div>
              <button
                onClick={() => setFrameFreezeEnabled(!frameFreezeEnabled)}
                className="px-4 py-2 border border-white hover:bg-white hover:text-black transition-colors"
              >
                {frameFreezeEnabled ? 'Disable' : 'Enable'}
              </button>
            </div>
          </div>

          {/* Crystallization */}
          <div className="border border-gray-700 p-3">
            <div className="text-gray-400 text-[9px] tracking-widest uppercase mb-3">
              Crystallization
            </div>
            <div className="flex items-center justify-between">
              <div className="text-gray-300">
                <div className="mb-1">
                  <span className="text-white">Mode:</span> {crystalMode.charAt(0).toUpperCase() + crystalMode.slice(1)}
                </div>
                <div className="text-gray-500 text-[10px]">
                  {crystalMode === 'enabled'
                    ? 'Random crystal formation when connectors cluster'
                    : crystalMode === 'constant'
                    ? 'Connectors always in crystal formation'
                    : 'Crystallization disabled'}
                </div>
              </div>
              <select
                value={crystalMode}
                onChange={(e) => setCrystalMode(e.target.value as CrystalMode)}
                className="px-3 py-2 bg-black border border-white text-white hover:bg-white hover:text-black transition-colors cursor-pointer"
              >
                <option value="enabled">Enabled</option>
                <option value="disabled">Disabled</option>
                <option value="constant">Constant</option>
              </select>
            </div>
          </div>

          {/* Connector State */}
          <div className="border border-gray-700 p-3">
            <div className="text-gray-400 text-[9px] tracking-widest uppercase mb-3">
              Connector State
            </div>
            <div className="flex items-center justify-between">
              <div className="text-gray-300">
                <div className="mb-1">
                  <span className="text-white">Mode:</span> {connectorState === 'auto' ? 'Auto' : connectorState === 'zen-only' ? 'Zen Only' : connectorState === 'crystal-only' ? 'Crystal Only' : 'None'}
                </div>
                <div className="text-gray-500 text-[10px]">
                  {connectorState === 'auto'
                    ? 'Random zen (3%) and crystal (2.5%) triggers'
                    : connectorState === 'zen-only'
                    ? 'Only zen mode triggers enabled'
                    : connectorState === 'crystal-only'
                    ? 'Only crystallization triggers enabled'
                    : 'All special states disabled'}
                </div>
              </div>
              <select
                value={connectorState}
                onChange={(e) => setConnectorState(e.target.value as ConnectorState)}
                className="px-3 py-2 bg-black border border-white text-white hover:bg-white hover:text-black transition-colors cursor-pointer"
              >
                <option value="auto">Auto</option>
                <option value="zen-only">Zen Only</option>
                <option value="crystal-only">Crystal Only</option>
                <option value="none">None</option>
              </select>
            </div>
          </div>

          {/* Calmness */}
          <div className="border border-gray-700 p-3">
            <div className="text-gray-400 text-[9px] tracking-widest uppercase mb-3">
              Calmness
            </div>
            <div className="flex items-center justify-between">
              <div className="text-gray-300">
                <div className="mb-1">
                  <span className="text-white">Status:</span> {calmnessEnabled ? 'ENABLED' : 'DISABLED'}
                </div>
                <div className="text-gray-500 text-[10px]">
                  {calmnessEnabled
                    ? 'Fitness-based and zen calmness active'
                    : 'No calmness - full force always'}
                </div>
              </div>
              <button
                onClick={() => setCalmnessEnabled(!calmnessEnabled)}
                className="px-4 py-2 border border-white hover:bg-white hover:text-black transition-colors"
              >
                {calmnessEnabled ? 'Disable' : 'Enable'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="border-t border-gray-700 pt-2 mt-4 text-gray-600 text-[10px]">
        Changes take effect on toggle
      </div>
    </div>
  )
}
