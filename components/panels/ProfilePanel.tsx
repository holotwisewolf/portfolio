'use client'

import { ProfilePanel as ProfilePanelType } from '@/lib/profile-data'
import SkillBars from '@/components/ui/SkillBars'
import ActivityGrid from '@/components/ui/ActivityGrid'
import StatRow from '@/components/ui/StatRow'

export default function ProfilePanel() {
  const profile: ProfilePanelType = {
    identity: {
      name: 'CHOONG YANG JIN',
      role: 'System Architecture',
      location: 'Subang Jaya, Selangor',
      status: 'OPEN TO WORK',
      experience: '5 months'
    },
    skills: [
      { name: 'English', level: 90 },
      { name: 'Chinese', level: 70 },
      { name: 'Malay', level: 60 }
    ],
    stack: ['React', 'Next.js', 'Node', 'Supabase', 'Figma']
  }

  return (
    <div className="h-full bg-black font-orbit text-xs flex flex-col p-3">
      {/* Panel Label */}
      <div className="text-[10px] tracking-[0.25em] text-white uppercase pb-2 mb-3 border-b border-[#222]">
        Profile
      </div>

      {/* Identity Block */}
      <div className="mb-4">
        <div className="text-[9px] text-[#999] tracking-[0.25em] uppercase mb-1 pb-1 border-b border-[#161616]">Identity</div>
        <StatRow label="NAME" value={profile.identity.name} />
        <StatRow label="ROLE" value={profile.identity.role} />
        <StatRow label="LOCATION" value={profile.identity.location} />
        <StatRow label="STATUS" value={profile.identity.status} valueClass="text-white" />
        <StatRow label="EXPERIENCE" value={profile.identity.experience} />
      </div>

      {/* Language Proficiency Block */}
      <div className="mb-4">
        <div className="text-[9px] text-[#999] tracking-[0.25em] uppercase mb-2">Language proficiency</div>
        <SkillBars skills={profile.skills} />
      </div>

      {/* Contact Block */}
      <div className="mb-4">
        <div className="text-[9px] text-[#999] tracking-[0.25em] uppercase mb-2">Contact</div>
        <ContactLink label="GitHub" href="https://github.com/holotwisewolf" />
        <ContactLink label="LinkedIn" href="https://linkedin.com" />
        <ContactLink label="Email" href="mailto:hello@example.com" />
      </div>
    </div>
  )
}

function ContactLink({ label, href }: { label: string; href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex justify-between py-1 text-[#666] border-b border-[#161616] hover:text-white cursor-pointer transition-colors"
    >
      <span>{label}</span>
      <span>↗</span>
    </a>
  )
}
