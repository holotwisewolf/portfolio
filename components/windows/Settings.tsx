'use client'

import { useState, useEffect, useContext } from 'react'
import { ExplosionModeContext } from '@/contexts/ExplosionModeContext'

interface SettingsProps {
  onClose?: () => void
}

export default function Settings({ onClose }: SettingsProps) {
  const { explosionMode, setExplosionMode } = useContext(ExplosionModeContext)

  const toggleExplosionMode = () => {
    const newMode = explosionMode === 'space' ? 'radial' : 'space'
    setExplosionMode(newMode)
  }

  return (
    <div className="h-full bg-black font-mono text-xs p-4 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 border-b border-white pb-2">
        <h1 className="text-white text-sm font-bold">SETTINGS</h1>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white px-2 py-1"
        >
          ✕
        </button>
      </div>

      {/* Settings */}
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

        {/* Info */}
        <div className="border border-gray-700 p-3">
          <div className="text-gray-400 text-[9px] tracking-widest uppercase mb-2">
            About
          </div>
          <div className="text-gray-500 text-[10px] space-y-1">
            <div>⚡ Space Finder: Particles aggressively seek empty spaces during explosions</div>
            <div>⚡ Radial Blast: Particles blast outward from cluster center (classic behavior)</div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-700 pt-2 mt-4 text-gray-600 text-[10px]">
        Changes take effect on toggle
      </div>
    </div>
  )
}
