'use client'

import { useContext, useState } from 'react'
import { ExplosionModeContext } from '@/contexts/ExplosionModeContext'

export default function AdvancedSettings() {
  const {
    particleCount, setParticleCount,
    connectorRatio, setConnectorRatio,
    maxSpeed, setMaxSpeed,
    damping, setDamping,
    clusterRadius, setClusterRadius,
    attract, setAttract,
    connectionDistance, setConnectionDistance,
    connectorSpacing, setConnectorSpacing,
    edgeMargin, setEdgeMargin
  } = useContext(ExplosionModeContext)!

  const [expanded, setExpanded] = useState({
    particles: true,
    physics: true,
    connectors: true
  })

  const resetToDefaults = () => {
    setParticleCount(150)
    setConnectorRatio(0.1)
    setMaxSpeed(0.8)
    setDamping(0.98)
    setClusterRadius(55)
    setAttract(0.006)
    setConnectionDistance(130)
    setConnectorSpacing(120)
    setEdgeMargin(15)
  }

  return (
    <div className="h-full bg-black font-mono text-xs p-4 flex flex-col">
      {/* Navigation Header */}
      <div className="border-b border-white pb-2 mb-4">
        <div
          onClick={() => setExpanded({ particles: true, physics: true, connectors: true })}
          className="flex items-center gap-2 cursor-pointer hover:bg-white/10 px-2 py-1"
        >
          <span className="text-green-400">{'>'}</span>
          <span className="text-white">Advanced Physics</span>
        </div>
      </div>

      {/* Settings */}
      <div className="flex-1 overflow-y-auto space-y-4">
        {/* Particles Section */}
        <div className="border border-gray-700 p-3">
          <div
            onClick={() => setExpanded({ ...expanded, particles: !expanded.particles })}
            className="flex items-center justify-between cursor-pointer hover:bg-white/10 px-2 py-1 mb-3"
          >
            <div className="text-gray-400 text-[9px] tracking-widest uppercase">Particles</div>
            <span className="text-gray-500">{expanded.particles ? '▼' : '▶'}</span>
          </div>

          {expanded.particles && (
            <div className="space-y-3">
              {/* Particle Count */}
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-300">Count</span>
                  <span className="text-green-400">{particleCount}</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="300"
                  step="10"
                  value={particleCount}
                  onChange={(e) => setParticleCount(parseInt(e.target.value))}
                  className="w-full h-1 bg-gray-800 appearance-none cursor-pointer"
                />
                <div className="text-gray-500 text-[10px] mt-1">
                  50 (sparse) — 300 (dense)
                </div>
              </div>

              {/* Connector Ratio */}
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-300">Connector Ratio</span>
                  <span className="text-green-400">{Math.round(connectorRatio * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.05"
                  max="0.25"
                  step="0.01"
                  value={connectorRatio}
                  onChange={(e) => setConnectorRatio(parseFloat(e.target.value))}
                  className="w-full h-1 bg-gray-800 appearance-none cursor-pointer"
                />
                <div className="text-gray-500 text-[10px] mt-1">
                  5% — 25%
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Physics Section */}
        <div className="border border-gray-700 p-3">
          <div
            onClick={() => setExpanded({ ...expanded, physics: !expanded.physics })}
            className="flex items-center justify-between cursor-pointer hover:bg-white/10 px-2 py-1 mb-3"
          >
            <div className="text-gray-400 text-[9px] tracking-widest uppercase">Physics</div>
            <span className="text-gray-500">{expanded.physics ? '▼' : '▶'}</span>
          </div>

          {expanded.physics && (
            <div className="space-y-3">
              {/* Max Speed */}
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-300">Max Speed</span>
                  <span className="text-green-400">{maxSpeed.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="2.0"
                  step="0.1"
                  value={maxSpeed}
                  onChange={(e) => setMaxSpeed(parseFloat(e.target.value))}
                  className="w-full h-1 bg-gray-800 appearance-none cursor-pointer"
                />
                <div className="text-gray-500 text-[10px] mt-1">
                  0.1 (slow) — 2.0 (fast)
                </div>
              </div>

              {/* Damping */}
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-300">Damping</span>
                  <span className="text-green-400">{damping.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0.90"
                  max="0.99"
                  step="0.01"
                  value={damping}
                  onChange={(e) => setDamping(parseFloat(e.target.value))}
                  className="w-full h-1 bg-gray-800 appearance-none cursor-pointer"
                />
                <div className="text-gray-500 text-[10px] mt-1">
                  0.90 (slippery) — 0.99 (sticky)
                </div>
              </div>

              {/* Cluster Radius */}
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-300">Cluster Radius</span>
                  <span className="text-green-400">{clusterRadius}</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="100"
                  step="5"
                  value={clusterRadius}
                  onChange={(e) => setClusterRadius(parseInt(e.target.value))}
                  className="w-full h-1 bg-gray-800 appearance-none cursor-pointer"
                />
                <div className="text-gray-500 text-[10px] mt-1">
                  30px (tight) — 100px (loose)
                </div>
              </div>

              {/* Attraction Strength */}
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-300">Attraction</span>
                  <span className="text-green-400">{attract.toFixed(3)}</span>
                </div>
                <input
                  type="range"
                  min="0.001"
                  max="0.02"
                  step="0.001"
                  value={attract}
                  onChange={(e) => setAttract(parseFloat(e.target.value))}
                  className="w-full h-1 bg-gray-800 appearance-none cursor-pointer"
                />
                <div className="text-gray-500 text-[10px] mt-1">
                  0.001 (weak) — 0.02 (strong)
                </div>
              </div>

              {/* Connection Distance */}
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-300">Connection Distance</span>
                  <span className="text-green-400">{connectionDistance}</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="200"
                  step="10"
                  value={connectionDistance}
                  onChange={(e) => setConnectionDistance(parseInt(e.target.value))}
                  className="w-full h-1 bg-gray-800 appearance-none cursor-pointer"
                />
                <div className="text-gray-500 text-[10px] mt-1">
                  50px (sparse) — 200px (dense web)
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Connectors Section */}
        <div className="border border-gray-700 p-3">
          <div
            onClick={() => setExpanded({ ...expanded, connectors: !expanded.connectors })}
            className="flex items-center justify-between cursor-pointer hover:bg-white/10 px-2 py-1 mb-3"
          >
            <div className="text-gray-400 text-[9px] tracking-widest uppercase">Connectors</div>
            <span className="text-gray-500">{expanded.connectors ? '▼' : '▶'}</span>
          </div>

          {expanded.connectors && (
            <div className="space-y-3">
              {/* Connector Spacing */}
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-300">Spacing</span>
                  <span className="text-green-400">{connectorSpacing}</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="200"
                  step="10"
                  value={connectorSpacing}
                  onChange={(e) => setConnectorSpacing(parseInt(e.target.value))}
                  className="w-full h-1 bg-gray-800 appearance-none cursor-pointer"
                />
                <div className="text-gray-500 text-[10px] mt-1">
                  50px (tight) — 200px (loose)
                </div>
              </div>

              {/* Edge Margin */}
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-300">Edge Margin</span>
                  <span className="text-green-400">{edgeMargin}</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="50"
                  step="5"
                  value={edgeMargin}
                  onChange={(e) => setEdgeMargin(parseInt(e.target.value))}
                  className="w-full h-1 bg-gray-800 appearance-none cursor-pointer"
                />
                <div className="text-gray-500 text-[10px] mt-1">
                  5px (close to edge) — 50px (far from edge)
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-700 pt-2 mt-4">
        <button
          onClick={resetToDefaults}
          className="w-full px-4 py-2 border border-gray-600 text-gray-400 hover:bg-white hover:text-black transition-colors text-[10px]"
        >
          Reset to Defaults
        </button>
      </div>
    </div>
  )
}
