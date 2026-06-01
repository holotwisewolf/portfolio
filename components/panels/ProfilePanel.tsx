'use client'

import { ProfilePanel as ProfilePanelType } from '@/lib/profile-data'
import SkillBars from '@/components/ui/SkillBars'
import ActivityGrid from '@/components/ui/ActivityGrid'
import StatRow from '@/components/ui/StatRow'

export default function ProfilePanel() {
  const profile: ProfilePanelType = {
    identity: {
      name: 'Your Name',
      role: 'Full-Stack Developer',
      location: 'Kuala Lumpur, MY',
      status: 'OPEN TO WORK',
      experience: '3 yrs'
    },
    skills: [
      { name: 'React', level: 90 },
      { name: 'Node.js', level: 80 },
      { name: 'Python', level: 70 },
      { name: 'CSS/UI', level: 85 }
    ],
    stack: ['React', 'Next.js', 'Node', 'Supabase', 'Figma']
  }

  return (
    <div className="h-full bg-black font-mono text-xs flex flex-col p-3">
      {/* Panel Label */}
      <div className="text-[9px] tracking-widest text-white uppercase pb-2 mb-3">
        Profile
      </div>

      {/* Identity Block */}
      <div className="mb-4">
        <div className="text-[9px] text-gray-600 tracking-widest uppercase mb-2">Identity</div>
        <StatRow label="NAME" value={profile.identity.name} />
        <StatRow label="ROLE" value={profile.identity.role} />
        <StatRow label="LOCATION" value={profile.identity.location} />
        <StatRow label="STATUS" value={profile.identity.status} valueClass="text-white" />
        <StatRow label="EXPERIENCE" value={profile.identity.experience} />
      </div>

      {/* Skills Block */}
      <div className="mb-4">
        <div className="text-[9px] text-gray-600 tracking-widest uppercase mb-2">Skills proficiency</div>
        <SkillBars skills={profile.skills} />
      </div>

      {/* Contact Block - at bottom */}
      <div className="mt-auto">
        <div className="text-[9px] text-gray-600 tracking-widest uppercase mb-2">Contact</div>
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
      className="flex justify-between py-1 text-gray-400 border-b border-gray-900 hover:text-white cursor-pointer transition-colors"
    >
      <span>{label}</span>
      <span>↗</span>
    </a>
  )
}
