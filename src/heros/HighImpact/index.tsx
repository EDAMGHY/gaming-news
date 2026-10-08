'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import React, { useEffect } from 'react'

import type { Page } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import Link from 'next/link'
import { ArrowDownRight } from 'lucide-react'

export const HighImpactHero: React.FC<Page['hero']> = ({ links, media, richText }) => {
  const { setHeaderTheme } = useHeaderTheme()

  useEffect(() => {
    setHeaderTheme('dark')
  }, [setHeaderTheme])

  return (
    <div
      className="relative -mt-[5.25rem] flex min-h-[48rem] items-end overflow-hidden bg-ink text-white md:min-h-[52rem]"
      data-theme="dark"
      data-block-type="highImpact"
      data-block-id="hero"
    >
      {media && typeof media === 'object' && (
        <div className="absolute inset-0 select-none">
          <Media
            fill
            imgClassName="object-cover animate-hero-ken-burns"
            priority
            resource={media}
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,12,24,.96)_0%,rgba(8,12,24,.82)_42%,rgba(8,12,24,.3)_72%,rgba(8,12,24,.58)_100%)]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#080c18] via-transparent to-black/35" />
        </div>
      )}

      <div className="container relative z-10 grid gap-12 pb-10 pt-36 md:pb-16 lg:grid-cols-[minmax(0,1fr)_19rem] lg:items-end lg:gap-20">
        <div className="max-w-[52rem]">
          <div className="mb-7 flex items-center gap-3 font-mono text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-brand animate-hero-fade-up">
            <span className="size-2 rounded-full bg-brand shadow-[0_0_0_5px_hsl(var(--brand)/0.14)]" />
            Independent gaming desk
          </div>
          {richText && (
            <RichText
              className={[
                'mb-8 animate-hero-fade-up',
                '[&_:is(h1,h2,h3)]:max-w-[13ch] [&_:is(h1,h2,h3)]:text-balance [&_:is(h1,h2,h3)]:text-[3rem] [&_:is(h1,h2,h3)]:font-black [&_:is(h1,h2,h3)]:leading-[0.94] [&_:is(h1,h2,h3)]:tracking-[-0.06em] sm:[&_:is(h1,h2,h3)]:text-6xl md:[&_:is(h1,h2,h3)]:text-7xl lg:[&_:is(h1,h2,h3)]:text-[5.4rem]',
                '[&_p]:mt-6 [&_p]:max-w-[38rem] [&_p]:text-base [&_p]:leading-7 [&_p]:text-white/70 sm:[&_p]:text-lg',
                '[&_a]:text-white [&_a]:underline [&_a]:decoration-brand [&_a]:underline-offset-4',
              ].join(' ')}
              data={richText}
              enableGutter={false}
            />
          )}
          {Array.isArray(links) && links.length > 0 && (
            <ul className="flex flex-wrap gap-3 animate-hero-fade-up-delay">
              {links.map(({ link }, i) => (
                <li key={i}>
                  <CMSLink {...link} />
                </li>
              ))}
            </ul>
          )}
        </div>

        <nav
          aria-label="Explore coverage"
          className="hidden border-l border-white/20 pl-7 lg:block"
        >
          <p className="mb-5 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-white/50">
            Choose your feed
          </p>
          {[
            ['Articles', '/articles', 'News, guides, features'],
            ['Reviews', '/reviews', 'Played, tested, scored'],
            ['Games', '/games', 'Releases and details'],
          ].map(([label, href, detail]) => (
            <Link
              className="group flex items-center justify-between gap-4 border-t border-white/15 py-4 last:border-b"
              href={href}
              key={href}
            >
              <span>
                <span className="block font-semibold">{label}</span>
                <span className="mt-0.5 block text-xs text-white/50">{detail}</span>
              </span>
              <ArrowDownRight
                aria-hidden="true"
                className="size-4 text-brand transition-transform group-hover:translate-x-1 group-hover:translate-y-1"
              />
            </Link>
          ))}
        </nav>
      </div>
    </div>
  )
}
