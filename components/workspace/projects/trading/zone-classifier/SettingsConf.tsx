'use client'

import { useState } from 'react'
import { defaultSettings, type ZoneSettings } from './data'

export default function SettingsConf() {
  const [settings, setSettings] = useState<ZoneSettings>(defaultSettings)

  const update = <K extends keyof ZoneSettings>(key: K, value: ZoneSettings[K]) =>
    setSettings((s) => ({ ...s, [key]: value }))

  return (
    <div className="p-6 space-y-3 max-w-[1100px]">
      <div className="text-[9px] tracking-[0.3em] text-[#444]">// settings.conf</div>
      <h1 className="text-[26px] tracking-[0.15em] text-white">SETTINGS</h1>
      <p className="text-[11px] text-gray-500 leading-relaxed max-w-[600px]">
        Model parameters. Adjust to see real-time updates in results files.
      </p>

      <div className="border border-[#1c2e1c]">
        <div className="bg-[#0f1a0f] border-b border-[#1c2e1c] px-3 py-1 text-[9px] tracking-[0.3em] text-[#00ff9d]">
          # ZONE_CLASSIFIER_CONFIG
        </div>

        <div className="divide-y divide-[#1c2e1c]">
          <SettingRow
            label="LOOKBACK_WINDOW"
            comment="# days to look back for pattern detection (5-60)"
            value={settings.lookbackWindow.toString()}
            displayValue={`${settings.lookbackWindow} days`}
          >
            <input
              type="range"
              min={5}
              max={60}
              value={settings.lookbackWindow}
              onChange={(e) => update('lookbackWindow', parseInt(e.target.value))}
              className="w-full h-[2px] bg-[#1c2e1c] appearance-none cursor-pointer accent-[#00ff9d]"
            />
          </SettingRow>

          <SettingRow
            label="VOLATILITY_THRESHOLD"
            comment="# sensitivity for zone classification (0.5-3.0)"
            value={settings.volatilityThreshold.toString()}
            displayValue={settings.volatilityThreshold.toFixed(1)}
          >
            <input
              type="range"
              min={0.5}
              max={3}
              step={0.1}
              value={settings.volatilityThreshold}
              onChange={(e) => update('volatilityThreshold', parseFloat(e.target.value))}
              className="w-full h-[2px] bg-[#1c2e1c] appearance-none cursor-pointer accent-[#00ff9d]"
            />
          </SettingRow>

          <SettingRow
            label="VOLUME_WEIGHT"
            comment="# weight for volume-derived features (0.0-1.0)"
            value={settings.volumeWeight.toString()}
            displayValue={`${(settings.volumeWeight * 100).toFixed(0)}%`}
          >
            <input
              type="range"
              min={0}
              max={1}
              step={0.1}
              value={settings.volumeWeight}
              onChange={(e) => update('volumeWeight', parseFloat(e.target.value))}
              className="w-full h-[2px] bg-[#1c2e1c] appearance-none cursor-pointer accent-[#00ff9d]"
            />
          </SettingRow>

          <SettingRow
            label="MOMENTUM_WEIGHT"
            comment="# weight for momentum features (0.0-1.0)"
            value={settings.momentumWeight.toString()}
            displayValue={`${(settings.momentumWeight * 100).toFixed(0)}%`}
          >
            <input
              type="range"
              min={0}
              max={1}
              step={0.1}
              value={settings.momentumWeight}
              onChange={(e) => update('momentumWeight', parseFloat(e.target.value))}
              className="w-full h-[2px] bg-[#1c2e1c] appearance-none cursor-pointer accent-[#00ff9d]"
            />
          </SettingRow>
        </div>
      </div>

      <div className="border border-[#1c2e1c] p-3 bg-black">
        <div className="text-[9px] tracking-[0.3em] text-[#444] mb-2">PREVIEW</div>
        <pre className="text-[11px] text-gray-400 font-orbit leading-relaxed">
{`lookback_window = ${settings.lookbackWindow}
volatility_threshold = ${settings.volatilityThreshold.toFixed(1)}
volume_weight = ${settings.volumeWeight.toFixed(1)}
momentum_weight = ${settings.momentumWeight.toFixed(1)}`}
        </pre>
      </div>
    </div>
  )
}

interface SettingRowProps {
  label: string
  comment: string
  value: string
  displayValue: string
  children: React.ReactNode
}

function SettingRow({ label, comment, value, displayValue, children }: SettingRowProps) {
  return (
    <div className="p-3">
      <div className="flex justify-between items-baseline mb-1">
        <div className="text-[11px] tracking-[0.1em] text-white font-orbit">
          {label} <span className="text-[#666]">= {value}</span>
        </div>
        <div className="text-[11px] text-[#00ff9d] font-orbit">{displayValue}</div>
      </div>
      <div className="text-[10px] text-[#444] font-orbit mb-2">{comment}</div>
      {children}
    </div>
  )
}
