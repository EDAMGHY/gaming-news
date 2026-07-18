import React from 'react'
import { team } from './data'

const initials = (name: string) =>
  name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')

export const TeamSection: React.FC = () => {
  return (
    <section className="border-t border-brand/10 bg-brand/[0.03]">
      <div className="container py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-foreground md:text-4xl">The people behind it</h2>
          <p className="mt-4 text-muted-foreground">
            A small, obsessive team that plays far more games than is probably healthy.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((member) => (
            <div
              key={member.name}
              className="group rounded-2xl border border-brand/15 bg-background p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:border-brand/40 hover:shadow-lg hover:shadow-brand/10"
            >
              <div
                className={`mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br ${member.accent} text-2xl font-bold text-white shadow-lg`}
              >
                {initials(member.name)}
              </div>
              <h3 className="mt-5 text-lg font-semibold text-foreground">{member.name}</h3>
              <div className="text-sm font-medium text-brand-400">{member.role}</div>
              <p className="mt-3 text-sm text-muted-foreground">{member.bio}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
