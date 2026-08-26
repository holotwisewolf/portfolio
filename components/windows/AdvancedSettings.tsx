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
    connectionOpacity, setConnectionOpacity
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
      className={`bg-black border border-[#333] text-white px-2 py-1 w-20 text-[10px] focus:border-white focus:outline-none ${className}`}
    />
  )

  return (
    <div className="h-full bg-[#0a0a0a] font-orbit text-[11px] p-4 flex flex-col">
      {/* Header */}
      <div className="text-[9px] tracking-[0.3em] text-[#555] mb-2">// advanced physics</div>
      <div className="text-[20px] tracking-tight text-[#ccc] font-orbit">Advanced Settings</div>
      <div className="mt-3 h-px bg-[#222] relative mb-4">
        <div className="absolute left-0 top-[-1px] h-[2px] w-10 bg-white" />
      </div>

      {/* Navigation */}
      <div className="flex-1 flex flex-col min-h-0 overflow-y-auto">
        <div className="text-[9px] text-[9px] text-[#555] tracking-[0.25em] uppercase mb-2">Navigation</div>

        {/* Particles Section */}
        <div>
          <div
            onClick={() => setExpanded({ ...expanded, particles: !expanded.particles })}
            className="py-1.5 border-b border-[#161616] cursor-pointer tracking-wider text-[#777] hover:text-white"
          >
            <span className="text-[#333]">&gt;</span> particles
          </div>

          <div className={`overflow-hidden transition-all duration-300 ease-out ${expanded.particles ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="pl-4 py-2 space-y-2">
              <div className="flex justify-between items-center border-b border-[#161616] pb-1">
                <span className="text-[#666]">Count</span>
                <NumberInput value={particleCount} onChange={setParticleCount} min={50} max={300} step={10} />
              </div>
              <div className="flex justify-between items-center border-b border-[#161616] pb-1">
                <span className="text-[#666]">Connector Ratio</span>
                <NumberInput value={connectorRatio} onChange={setConnectorRatio} min={0.05} max={0.25} step={0.01} />
              </div>
              <div className="flex justify-between items-center border-b border-[#161616] pb-1">
                <span className="text-[#666]">Space Finder Ratio</span>
                <NumberInput value={spaceFinderRatio} onChange={setSpaceFinderRatio} min={0} max={1} step={0.05} />
              </div>
              <div className="text-[#777] text-[10px]">
                50-300 particles | 5%-25% connectors | 0-100% space-finders
              </div>
            </div>
          </div>
        </div>

        {/* Physics Section */}
        <div>
          <div
            onClick={() => setExpanded({ ...expanded, physics: !expanded.physics })}
            className="py-1.5 border-b border-[#161616] cursor-pointer tracking-wider text-[#777] hover:text-white"
          >
            <span className="text-[#333]">&gt;</span> physics
          </div>

          <div className={`overflow-hidden transition-all duration-300 ease-out ${expanded.physics ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="pl-4 py-2 space-y-2">
              <div className="flex justify-between items-center border-b border-[#161616] pb-1">
                <span className="text-[#666]">Max Speed</span>
                <NumberInput value={maxSpeed} onChange={setMaxSpeed} min={0.1} max={2.0} step={0.1} />
              </div>
              <div className="flex justify-between items-center border-b border-[#161616] pb-1">
                <span className="text-[#666]">Damping</span>
                <NumberInput value={damping} onChange={setDamping} min={0.90} max={0.99} step={0.01} />
              </div>
              <div className="flex justify-between items-center border-b border-[#161616] pb-1">
                <span className="text-[#666]">Cluster Radius</span>
                <NumberInput value={clusterRadius} onChange={setClusterRadius} min={30} max={100} step={5} />
              </div>
              <div className="flex justify-between items-center border-b border-[#161616] pb-1">
                <span className="text-[#666]">Attraction</span>
                <NumberInput value={attract} onChange={setAttract} min={0.001} max={0.02} step={0.001} />
              </div>
              <div className="flex justify-between items-center border-b border-[#161616] pb-1">
                <span className="text-[#666]">Connection Distance</span>
                <NumberInput value={connectionDistance} onChange={setConnectionDistance} min={50} max={200} step={10} />
              </div>
              <div className="flex justify-between items-center border-b border-[#161616] pb-1">
                <span className="text-[#666]">Connection Opacity</span>
                <NumberInput value={connectionOpacity} onChange={setConnectionOpacity} min={0.1} max={1.0} step={0.1} />
              </div>
              <div className="text-[#777] text-[10px]">
                Speed: 0.1-2.0 | Damping: 0.90-0.99 | Radius: 30-100px
              </div>
            </div>
          </div>
        </div>

        {/* Connectors Section */}
        <div>
          <div
            onClick={() => setExpanded({ ...expanded, connectors: !expanded.connectors })}
            className="py-1.5 border-b border-[#161616] cursor-pointer tracking-wider text-[#777] hover:text-white"
          >
            <span className="text-[#333]">&gt;</span> connectors
          </div>

          <div className={`overflow-hidden transition-all duration-300 ease-out ${expanded.connectors ? 'max-h-[300px] opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="pl-4 py-2 space-y-2">
              <div className="flex justify-between items-center border-b border-[#161616] pb-1">
                <span className="text-[#666]">Spacing</span>
                <NumberInput value={connectorSpacing} onChange={setConnectorSpacing} min={50} max={200} step={10} />
              </div>
              <div className="flex justify-between items-center border-b border-[#161616] pb-1">
                <span className="text-[#666]">Edge Margin</span>
                <NumberInput value={edgeMargin} onChange={setEdgeMargin} min={5} max={50} step={5} />
              </div>
              <div className="text-[#777] text-[10px]">
                Spacing: 50-200px | Margin: 5-50px from edge
              </div>
            </div>
          </div>
        </div>

        {/* Mesh Section */}
        <div>
          <div
            onClick={() => setExpanded({ ...expanded, mesh: !expanded.mesh })}
            className="py-1.5 border-b border-[#161616] cursor-pointer tracking-wider text-[#777] hover:text-white"
          >
            <span className="text-[#333]">&gt;</span> mesh network
          </div>

          <div className={`overflow-hidden transition-all duration-300 ease-out ${expanded.mesh ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="pl-4 py-2 space-y-2">
              <div className="flex justify-between items-center border-b border-[#161616] pb-1">
                <span className="text-[#666]">Base Attract</span>
                <NumberInput value={connectorAttract} onChange={setConnectorAttract} min={0.001} max={0.01} step={0.001} />
              </div>
              <div className="flex justify-between items-center border-b border-[#161616] pb-1">
                <span className="text-[#666]">Attract Multiplier</span>
                <NumberInput value={connectorAttractBase} onChange={setConnectorAttractBase} min={0.01} max={0.2} step={0.01} />
              </div>
              <div className="flex justify-between items-center border-b border-[#161616] pb-1">
                <span className="text-[#666]">Attract Range (Normal)</span>
                <NumberInput value={connectorAttractRangeNormal} onChange={setConnectorAttractRangeNormal} min={200} max={500} step={20} />
              </div>
              <div className="flex justify-between items-center border-b border-[#161616] pb-1">
                <span className="text-[#666]">Attract Range (Crystal)</span>
                <NumberInput value={connectorAttractRangeCrystal} onChange={setConnectorAttractRangeCrystal} min={100} max={300} step={10} />
              </div>
              <div className="flex justify-between items-center border-b border-[#161616] pb-1">
                <span className="text-[#666]">Repel Strength</span>
                <NumberInput value={connectorRepelStrength} onChange={setConnectorRepelStrength} min={0.01} max={0.1} step={0.01} />
              </div>
              <div className="flex justify-between items-center border-b border-[#161616] pb-1">
                <span className="text-[#666]">Repel Range</span>
                <NumberInput value={connectorRepelRange} onChange={setConnectorRepelRange} min={50} max={150} step={10} />
              </div>
              <div className="flex justify-between items-center border-b border-[#161616] pb-1">
                <span className="text-[#666]">Target Force</span>
                <NumberInput value={targetSeekForce} onChange={setTargetSeekForce} min={0.1} max={0.5} step={0.05} />
              </div>
              <div className="flex justify-between items-center border-b border-[#161616] pb-1">
                <span className="text-[#666]">Edge Force (Normal)</span>
                <NumberInput value={edgeRepelForceNormal} onChange={setEdgeRepelForceNormal} min={0.01} max={0.1} step={0.01} />
              </div>
              <div className="flex justify-between items-center border-b border-[#161616] pb-1">
                <span className="text-[#666]">Edge Force (Urgent)</span>
                <NumberInput value={edgeRepelForceUrgent} onChange={setEdgeRepelForceUrgent} min={0.02} max={0.2} step={0.01} />
              </div>
              <div className="flex justify-between items-center border-b border-[#161616] pb-1">
                <span className="text-[#666]">Edge Urgent Zone</span>
                <NumberInput value={edgeUrgent} onChange={setEdgeUrgent} min={5} max={20} step={1} />
              </div>
              <div className="flex justify-between items-center border-b border-[#161616] pb-1">
                <span className="text-[#666]">Momentum Reaction</span>
                <NumberInput value={edgeMomentumReaction} onChange={setEdgeMomentumReaction} min={0.1} max={1.0} step={0.1} />
              </div>
              <div className="text-[#777] text-[10px]">
                Mesh network physics for connector behavior
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-[#333] pt-2 mt-4">
        <button
          onClick={resetToDefaults}
          className="w-full px-4 py-1.5 border border-[#333] text-[#666] hover:bg-white hover:text-black transition-colors text-[10px]"
        >
          Reset to Defaults
        </button>
      </div>
    </div>
  )
}
