'use client'

interface ActivityGridProps {
  dots?: number
  pattern?: ('high' | 'mid' | 'low')[]
}

export default function ActivityGrid({ dots = 35, pattern }: ActivityGridProps) {
  const activityPattern = pattern || generateActivityPattern(dots)

  return (
    <div className="flex flex-wrap gap-[2px]">
      {activityPattern.map((active, i) => (
        <div
          key={i}
          className={`w-[5px] h-[5px] rounded-sm ${
            active === 'high' ? 'bg-white' : active === 'mid' ? 'bg-gray-600' : 'bg-gray-900'
          }`}
        />
      ))}
    </div>
  )
}

// Generate activity pattern with three levels
function generateActivityPattern(count: number): ('high' | 'mid' | 'low')[] {
  const pattern: ('high' | 'mid' | 'low')[] = []
  for (let i = 0; i < count; i++) {
    const rand = Math.random()
    if (rand > 0.6) pattern.push('high')
    else if (rand > 0.3) pattern.push('mid')
    else pattern.push('low')
  }
  return pattern
}
