'use client'

interface StatRowProps {
  label: string
  value: string
  valueClass?: string
}

export default function StatRow({ label, value, valueClass }: StatRowProps) {
  return (
    <div className="flex justify-between py-1.5 border-b border-gray-900">
      <span className="text-gray-600">{label}</span>
      <span className={`text-gray-300 ${valueClass || ''}`}>{value}</span>
    </div>
  )
}
