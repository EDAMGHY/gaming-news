import React from 'react'

import type { IAboutTeamBlock } from '@/payload-types'
import { Media } from '@/components/Media'

const initials = (name: string) =>
  name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')

const accentMap: Record<string, string> = {
  brand: 'from-brand-500 to-cyan-400',
  fuchsia: 'from-fuchsia-500 to-purple-500',
  amber: 'from-amber-400 to-orange-500',
  emerald: 'from-emerald-400 to-teal-500',
}

export const AboutTeamBlock: React.FC<IAboutTeamBlock> = ({ heading, subheading, members }) => {
  const list = members || []

  return (
    <section className="border-t border-brand/10 bg-brand/[0.03]">
      <div className="container py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-foreground md:text-4xl">{heading}</h2>
          {subheading && <p className="mt-4 text-muted-foreground">{subheading}</p>}
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {list.map((member, i) => {
            const hasAvatar = member.avatar && typeof member.avatar === 'object'
            const accent = accentMap[member.accent || 'brand'] || accentMap.brand
            return (
              <div
                key={i}
                className="group rounded-2xl border border-brand/15 bg-background p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:border-brand/40 hover:shadow-lg hover:shadow-brand/10"
              >
                {hasAvatar ? (
                  <Media
                    resource={member.avatar}
                    imgClassName="mx-auto h-20 w-20 rounded-full object-cover shadow-lg"
                    className="mx-auto h-20 w-20"
                  />
                ) : (
                  <div
                    className={`mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br ${accent} text-2xl font-bold text-white shadow-lg`}
                  >
                    {initials(member.name)}
                  </div>
                )}
                <h3 className="mt-5 text-lg font-semibold text-foreground">{member.name}</h3>
                <div className="text-sm font-medium text-brand-400">{member.role}</div>
                {member.bio && <p className="mt-3 text-sm text-muted-foreground">{member.bio}</p>}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
