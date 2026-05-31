'use client'

export interface Language {
  name: string
  percentage: number
}

interface LanguageBarsProps {
  languages: Language[]
}

export default function LanguageBars({ languages }: LanguageBarsProps) {
  return (
    <>
      {languages.map((lang) => (
        <div key={lang.name} className="mb-1.5">
          <div className="flex justify-between text-[9px] text-gray-500 mb-0.5">
            <span>{lang.name}</span>
            <span>{lang.percentage}%</span>
          </div>
          <div className="bg-gray-900 h-[2px]">
            <div className="bg-white h-[2px]" style={{ width: `${lang.percentage}%` }} />
          </div>
        </div>
      ))}
    </>
  )
}
