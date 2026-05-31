'use client'

export default function ProfilePanel() {
  // Profile data
  const profile = {
    name: 'Your Name',
    role: 'Full-Stack Developer',
    location: 'Kuala Lumpur, MY',
    status: 'OPEN TO WORK',
    experience: '3 yrs',
    skills: [
      { name: 'React', level: 90 },
      { name: 'Node.js', level: 80 },
      { name: 'Python', level: 70 },
      { name: 'CSS/UI', level: 85 }
    ],
    stack: ['React', 'Next.js', 'Node', 'MongoDB', 'Figma', 'AWS'],
    activity: generateActivityPattern()
  }

  return (
    <div className="h-full bg-black font-mono text-xs flex flex-col p-3">
      {/* Panel Label */}
      <div className="text-[9px] tracking-widest text-white uppercase border-b border-gray-800 pb-2 mb-3">
        Profile
      </div>

      {/* Identity Block */}
      <div className="mb-4">
        <div className="text-[9px] text-gray-600 tracking-widest uppercase mb-2">Identity</div>
        <StatRow label="NAME" value={profile.name} />
        <StatRow label="ROLE" value={profile.role} />
        <StatRow label="LOCATION" value={profile.location} />
        <StatRow label="STATUS" value={profile.status} valueClass="text-white" />
        <StatRow label="EXPERIENCE" value={profile.experience} />
      </div>

      {/* Skills Block */}
      <div className="mb-4">
        <div className="text-[9px] text-gray-600 tracking-widest uppercase mb-2">Skills proficiency</div>
        {profile.skills.map((skill) => (
          <div key={skill.name} className="mb-2">
            <div className="flex justify-between text-[9px] text-gray-500 mb-1">
              <span>{skill.name}</span>
              <span>{skill.level}%</span>
            </div>
            <div className="bg-gray-900 h-[2px]">
              <div
                className="bg-white h-[2px] transition-all"
                style={{ width: `${skill.level}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Stack Tags Block */}
      <div className="mb-4">
        <div className="text-[9px] text-gray-600 tracking-widest uppercase mb-2">Stack tags</div>
        <div className="flex flex-wrap gap-1">
          {profile.stack.map((tag) => (
            <span
              key={tag}
              className="border border-gray-700 text-gray-300 text-[9px] px-2 py-0.5"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Activity Block */}
      <div className="flex-1">
        <div className="text-[9px] text-gray-600 tracking-widest uppercase mb-2">Activity (last 30d)</div>
        <div className="flex flex-wrap gap-[2px]">
          {profile.activity.map((active, i) => (
            <div
              key={i}
              className={`w-[5px] h-[5px] ${
                active === 'high' ? 'bg-white' : active === 'mid' ? 'bg-gray-600' : 'bg-gray-900'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function StatRow({ label, value, valueClass }: { label: string; value: string; valueClass?: string }) {
  return (
    <div className="flex justify-between py-1.5 border-b border-gray-900">
      <span className="text-gray-600">{label}</span>
      <span className={`text-gray-300 ${valueClass || ''}`}>{value}</span>
    </div>
  )
}

// Generate activity pattern with three levels
function generateActivityPattern(): ('high' | 'mid' | 'low')[] {
  const pattern: ('high' | 'mid' | 'low')[] = []
  for (let i = 0; i < 35; i++) {
    const rand = Math.random()
    if (rand > 0.6) pattern.push('high')
    else if (rand > 0.3) pattern.push('mid')
    else pattern.push('low')
  }
  return pattern
}
