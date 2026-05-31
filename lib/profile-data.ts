import { Skill } from '@/components/ui/SkillBars'

export interface ProfilePanel {
  identity: {
    name: string
    role: string
    location: string
    status: string
    experience: string
  }
  skills: Skill[]
  stack: string[]
}
