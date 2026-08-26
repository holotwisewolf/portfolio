'use client'

interface StatRowProps {
  label: string
  value: string
  valueClass?: string
}

export default function StatRow({ label, value, valueClass }: StatRowProps) {
  return (
    <div className="flex justify-between py-1.5 border-b border-[#161616]">
      <span className="text-[#555]">{label}</span>
      <span className={`text-[10px] text-[#ddd] ${valueClass || ''}`}>{value}</span>
    </div>
  )
}
