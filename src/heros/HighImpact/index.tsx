'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import React, { useEffect } from 'react'

import type { Page } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'

export const HighImpactHero: React.FC<Page['hero']> = ({ links, media, richText }) => {
  const { setHeaderTheme } = useHeaderTheme()

  useEffect(() => {
    setHeaderTheme('dark')
  })

  return (
    <div
      className="relative -mt-[10.4rem] flex min-h-[92vh] items-center justify-center overflow-hidden text-white"
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
          {/* Dark overlay for text legibility + smooth fade into the page below */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/40 to-background" />
          {/* Soft vignette to draw the eye toward the centered content */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(0,0,0,0.55)_100%)]" />
        </div>
      )}

      {/* Decorative colored glow accent behind the headline */}
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-[36rem] w-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-[130px]" />

      <div className="container z-10 relative flex items-center justify-center pt-[10.4rem]">
        <div className="max-w-[48rem] text-center">
          {richText && (
            <RichText
              className={[
                'mb-8 animate-hero-fade-up',
                // Big, bold, gradient headline (targets whichever heading level the editor used)
                '[&_:is(h1,h2,h3)]:text-[2.75rem] [&_:is(h1,h2,h3)]:font-extrabold [&_:is(h1,h2,h3)]:leading-[1.05] [&_:is(h1,h2,h3)]:tracking-tight sm:[&_:is(h1,h2,h3)]:text-6xl md:[&_:is(h1,h2,h3)]:text-7xl',
                '[&_:is(h1,h2,h3)]:bg-gradient-to-b [&_:is(h1,h2,h3)]:from-white [&_:is(h1,h2,h3)]:via-white [&_:is(h1,h2,h3)]:to-white/55 [&_:is(h1,h2,h3)]:bg-clip-text [&_:is(h1,h2,h3)]:text-transparent',
                '[&_:is(h1,h2,h3)]:drop-shadow-[0_4px_30px_rgba(0,0,0,0.55)]',
                // Refined supporting copy
                '[&_p]:mt-5 [&_p]:text-lg [&_p]:text-white/75 sm:[&_p]:text-xl',
              ].join(' ')}
              data={richText}
              enableGutter={false}
            />
          )}
          {Array.isArray(links) && links.length > 0 && (
            <ul className="flex flex-wrap justify-center gap-4 animate-hero-fade-up-delay">
              {links.map(({ link }, i) => {
                return (
                  <li key={i}>
                    <CMSLink {...link} />
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </div>

      {/* Scroll cue */}
      <div className="pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-white/40">
        <svg
          width="26"
          height="26"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M12 5v14M19 12l-7 7-7-7" />
        </svg>
      </div>
    </div>
  )
}
