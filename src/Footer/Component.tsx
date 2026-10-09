import { getCachedGlobal } from '@/utilities/getGlobals'
import Link from 'next/link'
import React from 'react'

import type { Footer } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { LogoMark } from '@/components/Logo/Logo'

const sections = [
  { glyph: 'bg-glyph-news', href: '/articles', label: 'News' },
  { glyph: 'bg-glyph-review', href: '/reviews', label: 'Reviews' },
  { glyph: 'bg-glyph-game', href: '/games', label: 'Games' },
]

export async function Footer() {
  const footerData: Footer = await getCachedGlobal('footer', 1)()

  const navItems = footerData?.navItems || []
  const year = new Date().getFullYear()

  return (
    <footer className="mt-auto border-t border-border bg-card">
      <div className="container grid gap-12 py-14 md:grid-cols-[1.4fr_1fr_1fr] md:py-16">
        <div className="space-y-5">
          <Link
            className="inline-flex items-center gap-3 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            href="/"
          >
            <LogoMark className="size-10" />
            <span className="sr-only">Save Point home</span>
          </Link>
          <p className="max-w-sm text-balance font-display text-2xl font-extrabold leading-[1.05] tracking-[-0.02em] sm:text-3xl">
            What&apos;s worth playing, and why.
          </p>
          <p className="max-w-sm text-sm leading-6 text-muted-foreground">
            Independent news, reviews scored after we finish the game, and a database of the
            releases worth tracking.
          </p>
        </div>

        <nav aria-label="Sections" className="space-y-4">
          <h2 className="font-mono text-[0.68rem] font-medium uppercase tracking-[0.16em] text-muted-foreground">
            Read
          </h2>
          <ul className="space-y-2.5">
            {sections.map((section) => (
              <li key={section.href}>
                <Link
                  className="group inline-flex items-center gap-2.5 font-medium transition-colors hover:text-brand"
                  href={section.href}
                >
                  <span
                    aria-hidden="true"
                    className={`size-2 rounded-full ${section.glyph} transition-transform group-hover:scale-125`}
                  />
                  {section.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {navItems.length > 0 && (
          <nav aria-label="Site" className="space-y-4">
            <h2 className="font-mono text-[0.68rem] font-medium uppercase tracking-[0.16em] text-muted-foreground">
              Save Point
            </h2>
            <ul className="space-y-2.5">
              {navItems.map(({ link }, i) => (
                <li key={i}>
                  <CMSLink
                    className="font-medium text-foreground/80 transition-colors hover:text-brand"
                    {...link}
                  />
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>

      {/* Oversized wordmark, stretched to the container width: the one loud moment in the footer */}
      <div aria-hidden="true" className="border-t border-border">
        <div className="container pt-6 sm:pt-8">
          <svg className="block h-auto w-full select-none" viewBox="0 0 1000 150">
            <text
              className="fill-foreground/[0.08] font-display font-black uppercase"
              dominantBaseline="alphabetic"
              fontSize="168"
              lengthAdjust="spacingAndGlyphs"
              style={{ fontStretch: '140%' }}
              textLength="1000"
              x="0"
              y="150"
            >
              Save Point
            </text>
          </svg>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="container flex flex-col gap-3 py-5 font-mono text-[0.68rem] uppercase tracking-[0.12em] text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p className="inline-flex items-center gap-2">
            <span aria-hidden="true" className="size-1.5 rounded-full bg-glyph-guide" />© {year}{' '}
            Save Point · Progress saved
          </p>
          <p>
            Game data and images by{' '}
            <a
              className="text-foreground underline-offset-4 transition-colors hover:text-brand hover:underline"
              href="https://rawg.io"
              rel="noreferrer"
              target="_blank"
            >
              RAWG
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
