'use client'

export interface Skill {
  name: string
  level: number
}

interface SkillBarsProps {
  skills: Skill[]
}

export default function SkillBars({ skills }: SkillBarsProps) {
  return (
    <>
      {skills.map((skill) => (
        <div key={skill.name} className="mb-2">
          <div className="flex justify-between text-[9px] text-[#777] mb-1">
            <span>{skill.name}</span>
            <span>{skill.level}%</span>
          </div>
          <div className="bg-[#141414] h-[2px]">
            <div
              className="bg-white h-[2px] transition-all"
              style={{ width: `${skill.level}%` }}
            />
          </div>
        </div>
      ))}
    </>
  )
}
