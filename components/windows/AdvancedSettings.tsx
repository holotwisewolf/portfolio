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
    edgeMargin, setEdgeMargin,
    connectorAttract, setConnectorAttract,
    connectorAttractBase, setConnectorAttractBase,
    connectorAttractRangeNormal, setConnectorAttractRangeNormal,
    connectorAttractRangeCrystal, setConnectorAttractRangeCrystal,
    connectorRepelStrength, setConnectorRepelStrength,
    connectorRepelRange, setConnectorRepelRange,
    targetSeekForce, setTargetSeekForce,
    edgeRepelForceNormal, setEdgeRepelForceNormal,
    edgeRepelForceUrgent, setEdgeRepelForceUrgent,
    edgeUrgent, setEdgeUrgent,
    edgeMomentumReaction, setEdgeMomentumReaction,
    spaceFinderRatio, setSpaceFinderRatio,
    cursorInteractionMode, setCursorInteractionMode,
    cursorRippleEnabled, setCursorRippleEnabled,
    cursorConnectParticles, setCursorConnectParticles,
    connectionOpacity, setConnectionOpacity,
    iconAttractParticles, setIconAttractParticles,
    iconCollideParticles, setIconCollideParticles
  } = useContext(ExplosionModeContext)!

  const [expanded, setExpanded] = useState({
    particles: false,
    physics: false,
    connectors: false,
    mesh: false
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
    setConnectorAttract(0.003)
    setConnectorAttractBase(0.0625)
    setConnectorAttractRangeNormal(360)
    setConnectorAttractRangeCrystal(180)
    setConnectorRepelStrength(0.03)
    setConnectorRepelRange(96)
    setTargetSeekForce(0.2)
    setEdgeRepelForceNormal(0.03)
    setEdgeRepelForceUrgent(0.06)
    setEdgeUrgent(10)
    setEdgeMomentumReaction(0.5)
    setSpaceFinderRatio(0.3)
    setConnectionOpacity(0.3)
  }

  // Helper for number input with fixed width
  const NumberInput = ({ value, onChange, min, max, step, className = '' }: {
    value: number
    onChange: (v: number) => void
    min: number
    max: number
    step: number
    className?: string
  }) => (
    <input
      type="number"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value) || min)}
      className={`bg-black border border-gray-700 text-white px-2 py-1 w-20 text-[10px] focus:border-white focus:outline-none ${className}`}
    />
  )

  return (
    <div className="h-full bg-black font-mono text-xs p-4 flex flex-col">
      {/* Header */}
      <div className="text-[10px] tracking-wider text-white uppercase border-b border-gray-800 pb-2 mb-4">
        Advanced Physics Settings
      </div>

      {/* Navigation */}
      <div className="flex-1 flex flex-col min-h-0 overflow-y-auto">
        <div className="text-[9px] text-gray-600 tracking-widest uppercase mb-2">Navigation</div>

        {/* Particles Section */}
        <div>
          <div
            onClick={() => setExpanded({ ...expanded, particles: !expanded.particles })}
            className="py-1.5 border-b border-gray-900 cursor-pointer tracking-wider text-gray-500 hover:text-white"
          >
            <span className="text-gray-800">&gt;</span> particles
          </div>

          <div className={`overflow-hidden transition-all duration-300 ease-out ${expanded.particles ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="pl-4 py-2 space-y-2">
              <div className="flex justify-between items-center border-b border-gray-900 pb-1">
                <span className="text-gray-400">Count</span>
                <NumberInput value={particleCount} onChange={setParticleCount} min={50} max={300} step={10} />
              </div>
              <div className="flex justify-between items-center border-b border-gray-900 pb-1">
                <span className="text-gray-400">Connector Ratio</span>
                <NumberInput value={connectorRatio} onChange={setConnectorRatio} min={0.05} max={0.25} step={0.01} />
              </div>
              <div className="flex justify-between items-center border-b border-gray-900 pb-1">
                <span className="text-gray-400">Space Finder Ratio</span>
                <NumberInput value={spaceFinderRatio} onChange={setSpaceFinderRatio} min={0} max={1} step={0.05} />
              </div>
              <div className="text-gray-500 text-[10px]">
                50-300 particles | 5%-25% connectors | 0-100% space-finders
              </div>
            </div>
          </div>
        </div>

        {/* Physics Section */}
        <div>
          <div
            onClick={() => setExpanded({ ...expanded, physics: !expanded.physics })}
            className="py-1.5 border-b border-gray-900 cursor-pointer tracking-wider text-gray-500 hover:text-white"
          >
            <span className="text-gray-800">&gt;</span> physics
          </div>

          <div className={`overflow-hidden transition-all duration-300 ease-out ${expanded.physics ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="pl-4 py-2 space-y-2">
              <div className="flex justify-between items-center border-b border-gray-900 pb-1">
                <span className="text-gray-400">Max Speed</span>
                <NumberInput value={maxSpeed} onChange={setMaxSpeed} min={0.1} max={2.0} step={0.1} />
              </div>
              <div className="flex justify-between items-center border-b border-gray-900 pb-1">
                <span className="text-gray-400">Damping</span>
                <NumberInput value={damping} onChange={setDamping} min={0.90} max={0.99} step={0.01} />
              </div>
              <div className="flex justify-between items-center border-b border-gray-900 pb-1">
                <span className="text-gray-400">Cluster Radius</span>
                <NumberInput value={clusterRadius} onChange={setClusterRadius} min={30} max={100} step={5} />
              </div>
              <div className="flex justify-between items-center border-b border-gray-900 pb-1">
                <span className="text-gray-400">Attraction</span>
                <NumberInput value={attract} onChange={setAttract} min={0.001} max={0.02} step={0.001} />
              </div>
              <div className="flex justify-between items-center border-b border-gray-900 pb-1">
                <span className="text-gray-400">Connection Distance</span>
                <NumberInput value={connectionDistance} onChange={setConnectionDistance} min={50} max={200} step={10} />
              </div>
              <div className="flex justify-between items-center border-b border-gray-900 pb-1">
                <span className="text-gray-400">Connection Opacity</span>
                <NumberInput value={connectionOpacity} onChange={setConnectionOpacity} min={0.1} max={1.0} step={0.1} />
              </div>
              <div className="text-gray-500 text-[10px]">
                Speed: 0.1-2.0 | Damping: 0.90-0.99 | Radius: 30-100px
              </div>

              {/* Cursor Interactions subsection */}
              <div className="mt-4 pt-2 border-t border-gray-900">
                <div className="text-gray-500 text-[10px] mb-2">CURSOR INTERACTIONS</div>

                <div className="flex justify-between items-center border-b border-gray-900 pb-1">
                  <span className="text-gray-400">Cursor Mode</span>
                  <select
                    value={cursorInteractionMode}
                    onChange={(e) => setCursorInteractionMode(e.target.value as 'none' | 'attract' | 'collide')}
                    className="px-2 py-1 bg-black border border-gray-700 text-white hover:border-white focus:outline-none text-[10px] w-20"
                  >
                    <option value="none">None</option>
                    <option value="attract">Attract</option>
                    <option value="collide">Collide</option>
                  </select>
                </div>

                <div className="flex justify-between items-center border-b border-gray-900 pb-1">
                  <span className="text-gray-400">Ripple on Click</span>
                  <button
                    onClick={() => setCursorRippleEnabled(!cursorRippleEnabled)}
                    className={`px-2 py-1 text-[10px] w-20 transition-colors ${
                      cursorRippleEnabled
                        ? 'bg-green-900 text-green-400 border border-green-700'
                        : 'bg-gray-900 text-gray-400 border border-gray-700 hover:border-white'
                    }`}
                  >
                    {cursorRippleEnabled ? 'On' : 'Off'}
                  </button>
                </div>

                <div className="flex justify-between items-center border-b border-gray-900 pb-1">
                  <span className="text-gray-400">Connect Particles</span>
                  <button
                    onClick={() => setCursorConnectParticles(!cursorConnectParticles)}
                    className={`px-2 py-1 text-[10px] w-20 transition-colors ${
                      cursorConnectParticles
                        ? 'bg-green-900 text-green-400 border border-green-700'
                        : 'bg-gray-900 text-gray-400 border border-gray-700 hover:border-white'
                    }`}
                  >
                    {cursorConnectParticles ? 'On' : 'Off'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Connectors Section */}
        <div>
          <div
            onClick={() => setExpanded({ ...expanded, connectors: !expanded.connectors })}
            className="py-1.5 border-b border-gray-900 cursor-pointer tracking-wider text-gray-500 hover:text-white"
          >
            <span className="text-gray-800">&gt;</span> connectors
          </div>

          <div className={`overflow-hidden transition-all duration-300 ease-out ${expanded.connectors ? 'max-h-[300px] opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="pl-4 py-2 space-y-2">
              <div className="flex justify-between items-center border-b border-gray-900 pb-1">
                <span className="text-gray-400">Spacing</span>
                <NumberInput value={connectorSpacing} onChange={setConnectorSpacing} min={50} max={200} step={10} />
              </div>
              <div className="flex justify-between items-center border-b border-gray-900 pb-1">
                <span className="text-gray-400">Edge Margin</span>
                <NumberInput value={edgeMargin} onChange={setEdgeMargin} min={5} max={50} step={5} />
              </div>
              <div className="text-gray-500 text-[10px]">
                Spacing: 50-200px | Margin: 5-50px from edge
              </div>

              {/* Window Interactions subsection */}
              <div className="mt-4 pt-2 border-t border-gray-900">
                <div className="text-gray-500 text-[10px] mb-2">DESKTOP ICONS</div>

                <div className="flex justify-between items-center border-b border-gray-900 pb-1">
                  <span className="text-gray-400">Attract Particles</span>
                  <button
                    onClick={() => setIconAttractParticles(!iconAttractParticles)}
                    className={`px-2 py-1 text-[10px] w-20 transition-colors ${
                      iconAttractParticles
                        ? 'bg-green-900 text-green-400 border border-green-700'
                        : 'bg-gray-900 text-gray-400 border border-gray-700 hover:border-white'
                    }`}
                  >
                    {iconAttractParticles ? 'On' : 'Off'}
                  </button>
                </div>

                <div className="flex justify-between items-center border-b border-gray-900 pb-1">
                  <span className="text-gray-400">Collide Particles</span>
                  <button
                    onClick={() => setIconCollideParticles(!iconCollideParticles)}
                    className={`px-2 py-1 text-[10px] w-20 transition-colors ${
                      iconCollideParticles
                        ? 'bg-green-900 text-green-400 border border-green-700'
                        : 'bg-gray-900 text-gray-400 border border-gray-700 hover:border-white'
                    }`}
                  >
                    {iconCollideParticles ? 'On' : 'Off'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mesh Section */}
        <div>
          <div
            onClick={() => setExpanded({ ...expanded, mesh: !expanded.mesh })}
            className="py-1.5 border-b border-gray-900 cursor-pointer tracking-wider text-gray-500 hover:text-white"
          >
            <span className="text-gray-800">&gt;</span> mesh network
          </div>

          <div className={`overflow-hidden transition-all duration-300 ease-out ${expanded.mesh ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="pl-4 py-2 space-y-2">
              <div className="flex justify-between items-center border-b border-gray-900 pb-1">
                <span className="text-gray-400">Base Attract</span>
                <NumberInput value={connectorAttract} onChange={setConnectorAttract} min={0.001} max={0.01} step={0.001} />
              </div>
              <div className="flex justify-between items-center border-b border-gray-900 pb-1">
                <span className="text-gray-400">Attract Multiplier</span>
                <NumberInput value={connectorAttractBase} onChange={setConnectorAttractBase} min={0.01} max={0.2} step={0.01} />
              </div>
              <div className="flex justify-between items-center border-b border-gray-900 pb-1">
                <span className="text-gray-400">Attract Range (Normal)</span>
                <NumberInput value={connectorAttractRangeNormal} onChange={setConnectorAttractRangeNormal} min={200} max={500} step={20} />
              </div>
              <div className="flex justify-between items-center border-b border-gray-900 pb-1">
                <span className="text-gray-400">Attract Range (Crystal)</span>
                <NumberInput value={connectorAttractRangeCrystal} onChange={setConnectorAttractRangeCrystal} min={100} max={300} step={10} />
              </div>
              <div className="flex justify-between items-center border-b border-gray-900 pb-1">
                <span className="text-gray-400">Repel Strength</span>
                <NumberInput value={connectorRepelStrength} onChange={setConnectorRepelStrength} min={0.01} max={0.1} step={0.01} />
              </div>
              <div className="flex justify-between items-center border-b border-gray-900 pb-1">
                <span className="text-gray-400">Repel Range</span>
                <NumberInput value={connectorRepelRange} onChange={setConnectorRepelRange} min={50} max={150} step={10} />
              </div>
              <div className="flex justify-between items-center border-b border-gray-900 pb-1">
                <span className="text-gray-400">Target Force</span>
                <NumberInput value={targetSeekForce} onChange={setTargetSeekForce} min={0.1} max={0.5} step={0.05} />
              </div>
              <div className="flex justify-between items-center border-b border-gray-900 pb-1">
                <span className="text-gray-400">Edge Force (Normal)</span>
                <NumberInput value={edgeRepelForceNormal} onChange={setEdgeRepelForceNormal} min={0.01} max={0.1} step={0.01} />
              </div>
              <div className="flex justify-between items-center border-b border-gray-900 pb-1">
                <span className="text-gray-400">Edge Force (Urgent)</span>
                <NumberInput value={edgeRepelForceUrgent} onChange={setEdgeRepelForceUrgent} min={0.02} max={0.2} step={0.01} />
              </div>
              <div className="flex justify-between items-center border-b border-gray-900 pb-1">
                <span className="text-gray-400">Edge Urgent Zone</span>
                <NumberInput value={edgeUrgent} onChange={setEdgeUrgent} min={5} max={20} step={1} />
              </div>
              <div className="flex justify-between items-center border-b border-gray-900 pb-1">
                <span className="text-gray-400">Momentum Reaction</span>
                <NumberInput value={edgeMomentumReaction} onChange={setEdgeMomentumReaction} min={0.1} max={1.0} step={0.1} />
              </div>
              <div className="text-gray-500 text-[10px]">
                Mesh network physics for connector behavior
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-700 pt-2 mt-4">
        <button
          onClick={resetToDefaults}
          className="w-full px-4 py-1.5 border border-gray-600 text-gray-400 hover:bg-white hover:text-black transition-colors text-[10px]"
        >
          Reset to Defaults
        </button>
      </div>
    </div>
  )
}
