import React from 'react'
import Link from 'next/link'
import { format } from 'date-fns'

import type { CallToActionBlock as CTABlockProps } from '@/payload-types'

import RichText from '@/components/RichText'
import { CMSLink } from '@/components/Link'
import { appearanceOnDark } from '@/components/Link/onDark'
import { LogoMark } from '@/components/Logo/Logo'
import { cn } from '@/utilities/ui'

export type LibraryStats = {
  lastSaved: string | null
  slots: { count: number; glyph: string; href: string; label: string }[]
}

/**
 * Client-safe: RichText (used by client components) can embed this block inline.
 * Page layouts render `CallToActionWithStats` (Component.server.tsx), which adds live counts.
 */
export const CallToActionBlock: React.FC<CTABlockProps & { stats?: LibraryStats }> = ({
  links,
  richText,
  stats,
}) => {
  const lastSaved = stats?.lastSaved
  const slots = stats?.slots ?? []

  const allSameAppearance =
    (links?.length ?? 0) > 1 &&
    new Set(links?.map(({ link }) => link.appearance ?? 'default')).size === 1

  return (
    <div className="container">
      <section
        className="overflow-hidden rounded-xl border border-white/10 bg-ink text-white"
        data-theme="dark"
      >
        {/* Save-screen status strip */}
        <div className="flex items-center justify-between gap-4 border-b border-white/10 px-5 py-3 font-mono text-[0.62rem] uppercase tracking-[0.16em] text-white/55 sm:px-8 md:px-12">
          <span className="inline-flex items-center gap-2.5">
            <LogoMark className="size-4" />
            Checkpoint
          </span>
          {lastSaved && (
            <span className="inline-flex items-center gap-2">
              <span aria-hidden="true" className="size-1.5 rounded-full bg-glyph-guide" />
              <span className="hidden sm:inline">Last saved</span>
              <time dateTime={lastSaved}>{format(new Date(lastSaved), 'MMM d, yyyy')}</time>
            </span>
          )}
        </div>

        <div
          className={cn(
            'grid gap-10 px-5 py-10 sm:px-8 md:px-12 md:py-14 lg:items-center lg:gap-14',
            slots.length > 0 && 'lg:grid-cols-[1.25fr_1fr]',
          )}
        >
          <div>
            {richText && (
              <RichText
                className="mx-0 mb-0 max-w-none text-white/70 md:max-w-none [&_:is(h1,h2,h3)]:mb-0 [&_:is(h1,h2,h3)]:text-balance [&_:is(h1,h2,h3)]:text-[2.4rem] [&_:is(h1,h2,h3)]:font-black [&_:is(h1,h2,h3)]:uppercase [&_:is(h1,h2,h3)]:leading-[0.92] [&_:is(h1,h2,h3)]:tracking-[-0.01em] [&_:is(h1,h2,h3)]:text-white [&_:is(h1,h2,h3)]:[font-stretch:78%] sm:[&_:is(h1,h2,h3)]:text-5xl lg:[&_:is(h1,h2,h3)]:text-6xl [&_p]:mt-4 [&_p]:max-w-[34rem] [&_p]:text-base [&_p]:leading-7 [&_p]:text-white/65 md:[&_p]:text-lg"
                data={richText}
                enableGutter={false}
              />
            )}

            {Array.isArray(links) && links.length > 0 && (
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                {links.map(({ link }, i) => {
                  const fallback = i === 0 ? 'primary' : 'glass'
                  // Two links saved with the same appearance would render as twin buttons:
                  // fall back to primary + glass so the first one still leads.
                  const appearance = allSameAppearance ? fallback : link.appearance
                  return (
                    <CMSLink
                      key={i}
                      size="lg"
                      {...link}
                      appearance={appearanceOnDark(appearance, fallback)}
                    />
                  )
                })}
              </div>
            )}
          </div>

          {slots.length > 0 && (
            <ul aria-label="In the library" className="grid grid-cols-3 gap-2 sm:gap-3">
              {slots.map((slot) => (
                <li key={slot.href}>
                  <Link
                    className="group flex h-full min-h-[9.5rem] flex-col justify-between rounded-lg border border-white/10 bg-white/[0.03] p-3 transition-colors hover:border-white/25 hover:bg-white/[0.06] focus:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:min-h-[11rem] sm:p-4"
                    href={slot.href}
                  >
                    <span aria-hidden="true" className={`size-2.5 rounded-full ${slot.glyph}`} />
                    <span>
                      <span
                        className="block font-display text-5xl font-black leading-none tabular-nums sm:text-6xl"
                        style={{ fontStretch: '78%' }}
                      >
                        {slot.count}
                      </span>
                      <span className="mt-2 block font-mono text-[0.6rem] uppercase tracking-[0.14em] text-white/55 transition-colors group-hover:text-white sm:text-[0.66rem]">
                        {slot.label}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  )
}
