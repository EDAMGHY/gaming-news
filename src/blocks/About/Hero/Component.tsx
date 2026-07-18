import React from 'react'
import { Gamepad2 } from 'lucide-react'

import type { IAboutHeroBlock } from '@/payload-types'
import { CMSLink } from '@/components/Link'

export const AboutHeroBlock: React.FC<IAboutHeroBlock> = ({
  badge,
  headingLead,
  headingHighlight,
  subheading,
  buttons,
}) => {
  return (
    <section className="relative overflow-hidden border-y-2 border-brand/20">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 left-1/2 h-72 w-[42rem] max-w-[90vw] -translate-x-1/2 rounded-full bg-brand/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl" />
      </div>

      <div className="container py-20 md:py-28 text-center">
        {badge && (
          <span className="inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-4 py-1.5 text-sm font-medium text-brand-400">
            <Gamepad2 className="h-4 w-4" />
            {badge}
          </span>
        )}

        <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-bold leading-tight tracking-tight text-foreground md:text-6xl">
          {headingLead}{' '}
          <span className="bg-gradient-to-r from-brand-500 to-cyan-400 bg-clip-text text-transparent">
            {headingHighlight}
          </span>
        </h1>

        {subheading && (
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
            {subheading}
          </p>
        )}

        {Array.isArray(buttons) && buttons.length > 0 && (
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            {buttons.map((item, i) => (
              <CMSLink
                key={i}
                {...item.link}
                appearance={i === 0 ? 'default' : 'outline'}
                className="px-6 py-3"
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
