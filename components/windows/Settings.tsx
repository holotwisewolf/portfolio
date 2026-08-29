'use client'

import { useContext, useState, useEffect } from 'react'
import { ExplosionModeContext } from '@/contexts/ExplosionModeContext'
import { useWindowStore } from '@/components/window-manager/useWindows'

type GraceMode = 'enabled' | 'disabled' | 'constant'
type CrystalMode = 'enabled' | 'disabled' | 'constant'
type ConnectorState = 'auto' | 'zen-only' | 'crystal-only' | 'none'
type ConnectorHighlight = 'disabled' | 'red' | 'yellow' | 'cyan'
type Preset = 'conservative' | 'balanced' | 'chaotic'
type CursorInteractionMode = 'none' | 'attract' | 'collide'
type WoozyMode = 'disabled' | 'enabled' | 'extreme'
type DiscoMode = 'disabled' | 'enabled' | 'extreme'
type ParticleShape = 'square' | 'circle' | 'triangle' | 'pentagon' | 'hexagon'

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
    setConnectorSpacing,
    cursorInteractionMode,
    setCursorInteractionMode,
    cursorRippleEnabled,
    setCursorRippleEnabled,
    cursorConnectParticles,
    setCursorConnectParticles,
    cursorClickExplodeCluster,
    setCursorClickExplodeCluster,
    iconAttractParticles,
    setIconAttractParticles,
    iconCollideParticles,
    setIconCollideParticles,
    iconConnectParticles,
    setIconConnectParticles,
    discoMode,
    setDiscoMode,
    woozyMode,
    setWoozyMode,
    particleShape,
    setParticleShape
  } = useContext(ExplosionModeContext)!

  const openWindow = useWindowStore((state) => state.openWindow)

  const [expanded, setExpanded] = useState(false) // Default collapsed for bg particles
  const [cursorExpanded, setCursorExpanded] = useState(false) // Cursor interactions section
  const [windowExpanded, setWindowExpanded] = useState(false) // Window interactions section
  const [visualExpanded, setVisualExpanded] = useState(false) // Visual effects section
  const [aboutExpanded, setAboutExpanded] = useState(false) // About section
  const [currentPreset, setCurrentPreset] = useState<Preset>('balanced')
  const [selectFocused, setSelectFocused] = useState(false) // Track if any select is focused
  const [cursorSize, setCursorSize] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = parseInt(localStorage.getItem('cursorSize') || '20')
      document.documentElement.style.setProperty('--cursor-size', `${saved}px`)
      return saved
    }
    return 20
  })

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
    <div className="h-full bg-[#0a0a0a] font-orbit text-[11px] p-4 flex flex-col">
      {/* Header */}
      <div className="text-[9px] tracking-[0.3em] text-[#555] mb-2">// settings</div>
      <div className="flex items-baseline justify-between">
        <div className="text-[20px] tracking-tight text-white font-orbit">Settings</div>
      </div>
      <div className="mt-3 h-px bg-[#222] relative mb-4">
        <div className="absolute left-0 top-[-1px] h-[2px] w-10 bg-white" />
      </div>

      {/* Terminal Output */}
      <div className="bg-black border border-[#2a2a2a] p-3 flex-shrink-0 overflow-y-auto max-h-[180px]">
        <div className="text-[9px] tracking-wider text-white uppercase mb-1">Settings reference</div>

        <div className="text-[#00ff9d] mb-0.5">$ explosion-mode</div>
        <div className="text-[#999] mb-0.5 text-[10px]">→ Space Finder: particles spread to fill space</div>
        <div className="text-[#999] mb-1 text-[10px]">→ Radial Blast: particles burst outward from center</div>

        <div className="text-[#00ff9d] mb-0.5">$ grace-period</div>
        <div className="text-[#999] mb-0.5 text-[10px]">→ Enabled: slow-mo on explosion, then normal</div>
        <div className="text-[#999] mb-0.5 text-[10px]">→ Disabled: no slow-mo, immediate normal speed</div>
        <div className="text-[#999] mb-1 text-[10px]">→ Constant: always in slow-mo</div>

        <div className="text-[#00ff9d] mb-0.5">$ frame-freeze</div>
        <div className="text-[#999] mb-1 text-[10px]">→ Pauses physics when you interact with windows</div>

        <div className="text-[#00ff9d] mb-0.5">$ crystallization</div>
        <div className="text-[#999] mb-0.5 text-[10px]">→ Enabled: connectors form geometric grid patterns</div>
        <div className="text-[#999] mb-0.5 text-[10px]">→ Disabled: connectors stay in flowing state</div>
        <div className="text-[#999] mb-1 text-[10px]">→ Constant: always crystallized, no flowing</div>

        <div className="text-[#00ff9d] mb-0.5">$ connector-state</div>
        <div className="text-[#999] mb-0.5 text-[10px]">→ Auto: shows in zen, crystallizes in crystal mode</div>
        <div className="text-[#999] mb-0.5 text-[10px]">→ Zen Only: only during zen (non-crystal) state</div>
        <div className="text-[#999] mb-0.5 text-[10px]">→ Crystal Only: only during crystallization</div>
        <div className="text-[#999] mb-1 text-[10px]">→ None: connectors completely hidden</div>

        <div className="text-[#00ff9d] mb-0.5">$ calmness</div>
        <div className="text-[#999] mb-1 text-[10px]">→ Gradually slows particles over time for zen effect</div>

        <div className="text-[#00ff9d] mb-0.5">$ connector-highlight</div>
        <div className="text-[#999] mb-1 text-[10px]">→ Color overlay (red/yellow/cyan) for visibility</div>

        <div className="text-[#00ff9d] mb-0.5">$ cursor-interactions</div>
        <div className="text-[#999] mb-0.5 text-[10px]">→ None: cursor doesn't affect particles</div>
        <div className="text-[#999] mb-0.5 text-[10px]">→ Push: momentum-based collision (faster = stronger)</div>
        <div className="text-[#999] mb-0.5 text-[10px]">→ Attract: particles drawn to cursor</div>
        <div className="text-[#999] mb-0.5 text-[10px]">→ Ripple: visual trail on movement</div>
        <div className="text-[#999] mb-0.5 text-[10px]">→ Connect: lines from cursor to particles</div>
        <div className="text-[#999] mb-1 text-[10px]">→ Click Explode: click triggers explosion</div>

        <div className="text-[#00ff9d] mb-0.5">$ icon-interactions</div>
        <div className="text-[#999] mb-0.5 text-[10px]">→ Attract: particles orbit icons in circular paths</div>
        <div className="text-[#999] mb-0.5 text-[10px]">→ Collide: icons act as walls + block connections</div>
        <div className="text-[#999] mb-1 text-[10px]">→ Connect: lines from icon edges to particles</div>

        <div className="text-[#00ff9d] mb-0.5">$ visual-effects</div>
        <div className="text-[#999] mb-0.5 text-[10px]">→ Disco Mode: rainbow particle colors</div>
        <div className="text-[#999] mb-0.5 text-[10px]">→ Enabled: particles change color, similar hues connect</div>
        <div className="text-[#999] mb-0.5 text-[10px]">→ Extreme: every connection line gets random colors</div>
        <div className="text-[#999] mb-0.5 text-[10px]">→ Particle Shape: square, circle, triangle, pentagon, hexagon</div>
        <div className="text-[#999] mb-0.5 text-[10px]">→ Woozy Mode: particles pulse in size</div>
        <div className="text-[#999] mb-0.5 text-[10px]">→ Enabled: smooth pulsing (0.8-1.4x)</div>
        <div className="text-[#999] mb-1 text-[10px]">→ Extreme: 40%/frame for random explosions (2-16x)</div>

        <div className="text-[#00ff9d] mb-0.5">$ advanced-settings</div>
        <div className="text-[#999] mb-0.5 text-[10px]">→ Fine-tune 21 physics variables: particle count,</div>
        <div className="text-[#999] mb-0.5 text-[10px]">→ max speed, attraction force, mesh network,</div>
        <div className="text-[#999] mb-1 text-[10px]">→ edge repulsion with momentum reaction</div>

        <div className="text-[#00ff9d] mb-0.5">$ presets</div>
        <div className="text-[#999] mb-0.5 text-[10px]">→ Conservative: 100 particles, slower flow</div>
        <div className="text-[#999] mb-0.5 text-[10px]">→ Balanced: 150 particles, medium flow</div>
        <div className="text-[#999] mb-1 text-[10px]">→ Chaotic: 200 particles, fast chaotic flow</div>

        <div className="text-[#00ff9d]">
          ~/settings{' '}
          <span className="inline-block w-2 h-2 bg-white align-middle animate-pulse" />
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 flex flex-col mt-4 min-h-0">
        <div className="text-[9px] text-[#555] tracking-[0.25em] uppercase mb-2">Navigation</div>

        {/* All navigation items in a single scrollable container */}
        <div className={`flex-1 min-h-0 ${selectFocused ? 'overflow-visible' : 'overflow-y-auto'}`}>
          {/* About - expandable with animation */}
          <div
            onClick={() => setAboutExpanded(!aboutExpanded)}
            className="py-1.5 border-b border-[#161616] cursor-pointer tracking-wider text-[#777] hover:text-white"
          >
            <span className="text-[#333]">
              &gt;
            </span>{' '}
            about
          </div>

          {/* Animated expansion for about */}
          <div
            className={`overflow-hidden transition-all duration-300 ease-out ${
              aboutExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="pl-4 py-2 space-y-2">
              {/* Version */}
              <div className="border border-[#2a2a2a] bg-[#101010] p-3">
                <div className="text-[9px] tracking-[0.25em] text-[#555] uppercase mb-2">Version</div>
                <div className="text-[#999] text-[10px]">
                  v0.1.0
                </div>
              </div>

              {/* Build Info */}
              <div className="border border-[#2a2a2a] bg-[#101010] p-3">
                <div className="text-[9px] tracking-[0.25em] text-[#555] uppercase mb-2">Build</div>
                <div className="text-[#666] text-[9px]">
                  Next.js 15.1.0 / React 18.3.1 / TypeScript 5.6.0
                </div>
              </div>

              {/* Credits */}
              <div className="border border-[#2a2a2a] bg-[#101010] p-3">
                <div className="text-[9px] tracking-[0.25em] text-[#555] uppercase mb-2">Credits</div>
                <div className="text-[#666] text-[9px]">
                  Built with brutalist love<br/>
                  Wanna-be quant aesthetic
                </div>
              </div>

              {/* GitHub */}
              <div className="border border-[#2a2a2a] bg-[#101010] p-3">
                <div className="text-[9px] tracking-[0.25em] text-[#555] uppercase mb-2">Source</div>
                <div className="text-[#666] text-[9px]">
                  github.com/yjchoong/portfolio
                </div>
              </div>
            </div>
          </div>

          {/* BG Particle - expandable with animation */}
          <div
            onClick={() => setExpanded(!expanded)}
            className="py-1.5 border-b border-[#161616] cursor-pointer tracking-wider text-[#777] hover:text-white"
          >
            <span className="text-[#333]">
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
              <div className="border border-[#2a2a2a] bg-[#101010] p-3">
                <div className="text-[9px] tracking-[0.25em] text-[#555] uppercase mb-2">Explosion Mode</div>
                <div className="flex items-center justify-between">
                  <div className="text-[#999] text-[10px]">
                    {explosionMode === 'space'
                      ? 'Space-finders, particles push 60-70% stronger toward empty spaces'
                      : 'Radial blast, particles are 20-25% stronger than space-finding'}
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleExplosionMode(); }}
                    className="px-2 py-1 text-[10px] w-20 bg-black border border-[#333] text-[#666] hover:border-white transition-colors"
                  >
                    Toggle
                  </button>
                </div>
              </div>

              {/* Grace Period */}
              <div className="border border-[#2a2a2a] bg-[#101010] p-3">
                <div className="text-[9px] tracking-[0.25em] text-[#555] uppercase mb-2">Grace Period</div>
                <div className="flex items-center justify-between">
                  <div className="text-[#999] text-[10px]">
                    Stability period after instability
                  </div>
                  <select
                    value={graceMode}
                    onChange={(e) => setGraceMode(e.target.value as GraceMode)}
                    className="px-2 py-1 bg-black border border-[#333] text-white hover:border-white focus:outline-none text-[10px] w-20 appearance-none text-center"
                  >
                    <option value="enabled">Enabled</option>
                    <option value="disabled">Disabled</option>
                    <option value="constant">Constant</option>
                  </select>
                </div>
              </div>

              {/* Frame Freeze */}
              <div className="border border-[#2a2a2a] bg-[#101010] p-3">
                <div className="text-[9px] tracking-[0.25em] text-[#555] uppercase mb-2">Frame Freeze</div>
                <div className="flex items-center justify-between">
                  <div className="text-[#999] text-[10px]">
                    Pauses particles when toggled
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); setFrameFreezeEnabled(!frameFreezeEnabled); }}
                    className={`px-2 py-1 text-[10px] w-20 transition-colors ${
                      frameFreezeEnabled
                        ? 'bg-[#0a2216] text-[#00ff9d] border border-[#00ff9d]'
                        : 'bg-[#101010] text-[#777] border border-[#333] hover:border-white'
                    }`}
                  >
                    {frameFreezeEnabled ? 'Enabled' : 'Disabled'}
                  </button>
                </div>
              </div>

              {/* Crystallization */}
              <div className="border border-[#2a2a2a] bg-[#101010] p-3">
                <div className="text-[9px] tracking-[0.25em] text-[#555] uppercase mb-2">Crystallization</div>
                <div className="flex items-center justify-between">
                  <div className="text-[#999] text-[10px]">
                    Connector attraction increases, more likely to form stable connections
                  </div>
                  <select
                    value={crystalMode}
                    onChange={(e) => setCrystalMode(e.target.value as CrystalMode)}
                    className="px-2 py-1 bg-black border border-[#333] text-white hover:border-white focus:outline-none text-[10px] w-20 appearance-none text-center"
                  >
                    <option value="enabled">Enabled</option>
                    <option value="disabled">Disabled</option>
                    <option value="constant">Constant</option>
                  </select>
                </div>
              </div>

              {/* Connector State */}
              <div className="border border-[#2a2a2a] bg-[#101010] p-3">
                <div className="text-[9px] tracking-[0.25em] text-[#555] uppercase mb-2">Connector State</div>
                <div className="flex items-center justify-between">
                  <div className="text-[#999] text-[10px]">
                    Controls which connector modes activate
                  </div>
                  <select
                    value={connectorState}
                    onChange={(e) => setConnectorState(e.target.value as ConnectorState)}
                    className="px-2 py-1 bg-black border border-[#333] text-white hover:border-white focus:outline-none text-[10px] w-20 appearance-none text-center"
                  >
                    <option value="auto">Auto</option>
                    <option value="zen-only">Zen Only</option>
                    <option value="crystal-only">Crystal Only</option>
                    <option value="none">None</option>
                  </select>
                </div>
              </div>

              {/* Calmness */}
              <div className="border border-[#2a2a2a] bg-[#101010] p-3">
                <div className="text-[9px] tracking-[0.25em] text-[#555] uppercase mb-2">Calmness</div>
                <div className="flex items-center justify-between">
                  <div className="text-[#999] text-[10px]">
                    Reduces connector velocity over time
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); setCalmnessEnabled(!calmnessEnabled); }}
                    className={`px-2 py-1 text-[10px] w-20 transition-colors ${
                      calmnessEnabled
                        ? 'bg-[#0a2216] text-[#00ff9d] border border-[#00ff9d]'
                        : 'bg-[#101010] text-[#777] border border-[#333] hover:border-white'
                    }`}
                  >
                    {calmnessEnabled ? 'Enabled' : 'Disabled'}
                  </button>
                </div>
              </div>

              {/* Connector Highlight */}
              <div className="border border-[#2a2a2a] bg-[#101010] p-3">
                <div className="text-[9px] tracking-[0.25em] text-[#555] uppercase mb-2">Connector Highlight</div>
                <div className="flex items-center justify-between">
                  <div className="text-[#999] text-[10px]">
                    Connector color overlay
                  </div>
                  <select
                    value={connectorHighlight}
                    onChange={(e) => setConnectorHighlight(e.target.value as ConnectorHighlight)}
                    className="px-2 py-1 bg-black border border-[#333] text-white hover:border-white focus:outline-none text-[10px] w-20 appearance-none text-center"
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
                <div className="text-[#777] text-[10px] mb-2">PRESETS</div>
                <div className="flex gap-2">
                  <button
                    onClick={(e) => { e.stopPropagation(); applyPreset('conservative'); }}
                    className={`flex-1 px-4 py-1.5 border text-[10px] transition-colors ${
                      currentPreset === 'conservative'
                        ? 'border-[#00ff9d] text-[#00ff9d]'
                        : 'border-[#333] text-[#666] hover:bg-white hover:text-black'
                    }`}
                  >
                    Conservative
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); applyPreset('balanced'); }}
                    className={`flex-1 px-4 py-1.5 border text-[10px] transition-colors ${
                      currentPreset === 'balanced'
                        ? 'border-[#00ff9d] text-[#00ff9d]'
                        : 'border-[#333] text-[#666] hover:bg-white hover:text-black'
                    }`}
                  >
                    Balanced
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); applyPreset('chaotic'); }}
                    className={`flex-1 px-4 py-1.5 border text-[10px] transition-colors ${
                      currentPreset === 'chaotic'
                        ? 'border-[#00ff9d] text-[#00ff9d]'
                        : 'border-[#333] text-[#666] hover:bg-white hover:text-black'
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

              <div className="text-[#555] text-[10px]">
                Changes take effect on toggle
              </div>
            </div>
          </div>

          {/* Visual Effects - expandable with animation */}
          <div
            onClick={() => setVisualExpanded(!visualExpanded)}
            className="py-1.5 border-b border-[#161616] cursor-pointer tracking-wider text-[#777] hover:text-white"
          >
            <span className="text-[#333]">
              &gt;
            </span>{' '}
            visual effects
          </div>

          {/* Animated expansion for visual effects */}
          <div
            className={`overflow-hidden transition-all duration-300 ease-out ${
              visualExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="pl-4 py-2 space-y-2">
              {/* Disco Mode */}
              <div className="border border-[#2a2a2a] bg-[#101010] p-3">
                <div className="text-[9px] tracking-[0.25em] text-[#555] uppercase mb-2">Disco Mode</div>
                <div className="flex items-center justify-between">
                  <div className="text-[#999] text-[10px]">
                    Rainbow particles, flashing colors
                  </div>
                  <select
                    value={discoMode}
                    onChange={(e) => { e.stopPropagation(); setDiscoMode(e.target.value as DiscoMode); }}
                    onFocus={() => setSelectFocused(true)}
                    onBlur={() => setSelectFocused(false)}
                    className="appearance-none bg-black border border-[#333] text-white px-2 py-1 text-[10px] w-20 text-center focus:border-white focus:outline-none cursor-pointer"
                  >
                    <option value="disabled">Disabled</option>
                    <option value="enabled">Enabled</option>
                    <option value="extreme">Extreme</option>
                  </select>
                </div>
              </div>

              {/* Woozy Mode */}
              <div className="border border-[#2a2a2a] bg-[#101010] p-3">
                <div className="text-[9px] tracking-[0.25em] text-[#555] uppercase mb-2">Woozy Mode</div>
                <div className="flex items-center justify-between">
                  <div className="text-[#999] text-[10px]">
                    Particles pulse and change size
                  </div>
                  <select
                    value={woozyMode}
                    onChange={(e) => { e.stopPropagation(); setWoozyMode(e.target.value as WoozyMode); }}
                    onFocus={() => setSelectFocused(true)}
                    onBlur={() => setSelectFocused(false)}
                    className="appearance-none bg-black border border-[#333] text-white px-2 py-1 text-[10px] w-20 text-center focus:border-white focus:outline-none cursor-pointer"
                  >
                    <option value="disabled">Disabled</option>
                    <option value="enabled">Enabled</option>
                    <option value="extreme">Extreme</option>
                  </select>
                </div>
              </div>

              {/* Particle Shape */}
              <div className="border border-[#2a2a2a] bg-[#101010] p-3">
                <div className="text-[9px] tracking-[0.25em] text-[#555] uppercase mb-2">Particle Shape</div>
                <div className="flex items-center justify-between">
                  <div className="text-[#999] text-[10px]">
                    Shape of particles
                  </div>
                  <select
                    value={particleShape}
                    onChange={(e) => { e.stopPropagation(); setParticleShape(e.target.value as ParticleShape); }}
                    onFocus={() => setSelectFocused(true)}
                    onBlur={() => setSelectFocused(false)}
                    className="appearance-none bg-black border border-[#333] text-white px-2 py-1 text-[10px] w-20 text-center focus:border-white focus:outline-none cursor-pointer"
                  >
                    <option value="square">Square</option>
                    <option value="circle">Circle</option>
                    <option value="triangle">Triangle</option>
                    <option value="pentagon">Pentagon</option>
                    <option value="hexagon">Hexagon</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Cursor Interactions - expandable with animation */}
          <div
            onClick={() => setCursorExpanded(!cursorExpanded)}
            className="py-1.5 border-b border-[#161616] cursor-pointer tracking-wider text-[#777] hover:text-white"
          >
            <span className="text-[#333]">
              &gt;
            </span>{' '}
            cursor interactions
          </div>

          {/* Animated expansion for cursor interactions */}
          <div
            className={`overflow-hidden transition-all duration-300 ease-out ${
              cursorExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="pl-4 py-2 space-y-2">
              {/* Cursor Mode */}
              <div className="border border-[#2a2a2a] bg-[#101010] p-3">
                <div className="text-[9px] tracking-[0.25em] text-[#555] uppercase mb-2">Cursor Mode</div>
                <div className="flex items-center justify-between">
                  <div className="text-[#999] text-[10px]">
                    {cursorInteractionMode === 'none'
                      ? 'No cursor interaction'
                      : cursorInteractionMode === 'attract'
                      ? 'Particles swarm toward cursor'
                      : cursorInteractionMode === 'collide'
                      ? 'Cursor pushes particles on contact'
                      : 'Particles form a rippling ring around cursor'}
                  </div>
                  <select
                    value={cursorInteractionMode}
                    onChange={(e) => setCursorInteractionMode(e.target.value as CursorInteractionMode)}
                    className="px-2 py-1 bg-black border border-[#333] text-white hover:border-white focus:outline-none text-[10px] w-20 appearance-none text-center"
                  >
                    <option value="none">None</option>
                    <option value="attract">Attract</option>
                    <option value="collide">Collide</option>
                    <option value="ring">Ring</option>
                  </select>
                </div>
              </div>

              {/* Cursor Size */}
              <div className="border border-[#2a2a2a] bg-[#101010] p-3">
                <div className="text-[9px] tracking-[0.25em] text-[#555] uppercase mb-2">Cursor Size</div>
                <div className="flex items-center justify-between">
                  <div className="text-[#999] text-[10px]">
                    Visual size of the custom cursor
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#555] text-[9px]">{cursorSize}px</span>
                    <div className="relative w-20 h-[12px] flex items-center">
                      {/* track line */}
                      <div className="absolute left-0 right-0 h-px bg-[#333]" />
                      {/* fill from left to handle */}
                      <div className="absolute left-0 h-px bg-[#666]" style={{ width: `${((cursorSize - 12) / 24) * 100}%` }} />
                      {/* square handle */}
                      <div
                        className="absolute w-[8px] h-[12px] bg-[#999] cursor-pointer hover:bg-white transition-colors"
                        style={{ left: `calc(${((cursorSize - 12) / 24) * 100}% - 4px)` }}
                      />
                      {/* invisible input overlay for drag */}
                      <input
                        type="range"
                        min="12"
                        max="36"
                        step="2"
                        value={cursorSize}
                        onChange={(e) => {
                          const v = parseInt(e.target.value)
                          setCursorSize(v)
                          document.documentElement.style.setProperty('--cursor-size', `${v}px`)
                          localStorage.setItem('cursorSize', String(v))
                        }}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Cursor Ripple */}
              <div className="border border-[#2a2a2a] bg-[#101010] p-3">
                <div className="text-[9px] tracking-[0.25em] text-[#555] uppercase mb-2">Cursor Ripple</div>
                <div className="flex items-center justify-between">
                  <div className="text-[#999] text-[10px]">
                    Click to create burst wave
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); setCursorRippleEnabled(!cursorRippleEnabled); }}
                    className={`px-2 py-1 text-[10px] w-20 transition-colors ${
                      cursorRippleEnabled
                        ? 'bg-[#0a2216] text-[#00ff9d] border border-[#00ff9d]'
                        : 'bg-[#101010] text-[#777] border border-[#333] hover:border-white'
                    }`}
                  >
                    {cursorRippleEnabled ? 'Enabled' : 'Disabled'}
                  </button>
                </div>
              </div>

              {/* Cursor Connections */}
              <div className="border border-[#2a2a2a] bg-[#101010] p-3">
                <div className="text-[9px] tracking-[0.25em] text-[#555] uppercase mb-2">Cursor Connections</div>
                <div className="flex items-center justify-between">
                  <div className="text-[#999] text-[10px]">
                    Draw lines to nearby particles
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); setCursorConnectParticles(!cursorConnectParticles); }}
                    className={`px-2 py-1 text-[10px] w-20 transition-colors ${
                      cursorConnectParticles
                        ? 'bg-[#0a2216] text-[#00ff9d] border border-[#00ff9d]'
                        : 'bg-[#101010] text-[#777] border border-[#333] hover:border-white'
                    }`}
                  >
                    {cursorConnectParticles ? 'Enabled' : 'Disabled'}
                  </button>
                </div>
              </div>

              {/* Click Explodes Cluster */}
              <div className="border border-[#2a2a2a] bg-[#101010] p-3">
                <div className="text-[9px] tracking-[0.25em] text-[#555] uppercase mb-2">Click Explodes</div>
                <div className="flex items-center justify-between">
                  <div className="text-[#999] text-[10px]">
                    Click to explode nearby particles
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); setCursorClickExplodeCluster(!cursorClickExplodeCluster); }}
                    className={`px-2 py-1 text-[10px] w-20 transition-colors ${
                      cursorClickExplodeCluster
                        ? 'bg-[#0a2216] text-[#00ff9d] border border-[#00ff9d]'
                        : 'bg-[#101010] text-[#777] border border-[#333] hover:border-white'
                    }`}
                  >
                    {cursorClickExplodeCluster ? 'Enabled' : 'Disabled'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Icons Interaction - expandable with animation */}
          <div
            onClick={() => setWindowExpanded(!windowExpanded)}
            className="py-1.5 border-b border-[#161616] cursor-pointer tracking-wider text-[#777] hover:text-white"
          >
            <span className="text-[#333]">
              &gt;
            </span>{' '}
            icon interactions
          </div>

          {/* Animated expansion for icon interactions */}
          <div
            className={`overflow-hidden transition-all duration-300 ease-out ${
              windowExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="pl-4 py-2 space-y-2">
              {/* Icon Attract */}
              <div className="border border-[#2a2a2a] bg-[#101010] p-3">
                <div className="text-[9px] tracking-[0.25em] text-[#555] uppercase mb-2">Attract Particles</div>
                <div className="flex items-center justify-between">
                  <div className="text-[#999] text-[10px]">
                    Particles gather around icons
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); setIconAttractParticles(!iconAttractParticles); }}
                    className={`px-2 py-1 text-[10px] w-20 transition-colors ${
                      iconAttractParticles
                        ? 'bg-[#0a2216] text-[#00ff9d] border border-[#00ff9d]'
                        : 'bg-[#101010] text-[#777] border border-[#333] hover:border-white'
                    }`}
                  >
                    {iconAttractParticles ? 'Enabled' : 'Disabled'}
                  </button>
                </div>
              </div>

              {/* Icon Collide */}
              <div className="border border-[#2a2a2a] bg-[#101010] p-3">
                <div className="text-[9px] tracking-[0.25em] text-[#555] uppercase mb-2">Collide Particles</div>
                <div className="flex items-center justify-between">
                  <div className="text-[#999] text-[10px]">
                    Icons push particles away
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); setIconCollideParticles(!iconCollideParticles); }}
                    className={`px-2 py-1 text-[10px] w-20 transition-colors ${
                      iconCollideParticles
                        ? 'bg-[#0a2216] text-[#00ff9d] border border-[#00ff9d]'
                        : 'bg-[#101010] text-[#777] border border-[#333] hover:border-white'
                    }`}
                  >
                    {iconCollideParticles ? 'Enabled' : 'Disabled'}
                  </button>
                </div>
              </div>

              {/* Icon Connect */}
              <div className="border border-[#2a2a2a] bg-[#101010] p-3">
                <div className="text-[9px] tracking-[0.25em] text-[#555] uppercase mb-2">Connect Particles</div>
                <div className="flex items-center justify-between">
                  <div className="text-[#999] text-[10px]">
                    Draw lines to nearby particles
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); setIconConnectParticles(!iconConnectParticles); }}
                    className={`px-2 py-1 text-[10px] w-20 transition-colors ${
                      iconConnectParticles
                        ? 'bg-[#0a2216] text-[#00ff9d] border border-[#00ff9d]'
                        : 'bg-[#101010] text-[#777] border border-[#333] hover:border-white'
                    }`}
                  >
                    {iconConnectParticles ? 'Enabled' : 'Disabled'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
