import { getCachedGlobal } from '@/utilities/getGlobals'
import Link from 'next/link'
import React from 'react'

import type { Footer } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Logo } from '@/components/Logo/Logo'

export async function Footer() {
  const footerData: Footer = await getCachedGlobal('footer', 1)()

  const navItems = footerData?.navItems || []

  return (
    <footer className="mt-auto border-t-2 border-brand/20 bg-gradient-to-b from-background via-background to-brand/5 dark:to-brand/10">
      <div className="container py-12 gap-12 flex flex-col md:flex-row md:items-start md:justify-between">
        <div className="shrink-0 space-y-4">
          <Link href="/" className="inline-block hover:opacity-80 transition-opacity">
            <Logo />
          </Link>
          <p className="text-sm text-muted-foreground max-w-xs">
            Your ultimate source for gaming news, reviews, and upcoming releases.
          </p>
        </div>

        <nav className="flex flex-col md:flex-row gap-6 md:gap-12">
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-foreground">Navigation</h4>
            <ul className="flex flex-col gap-2">
              {navItems.slice(0, Math.ceil(navItems.length / 2)).map(({ link }, i) => (
                <li key={i}>
                  <CMSLink className="text-sm text-muted-foreground hover:text-brand transition-colors" {...link} />
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-foreground">More</h4>
            <ul className="flex flex-col gap-2">
              {navItems.slice(Math.ceil(navItems.length / 2)).map(({ link }, i) => (
                <li key={i}>
                  <CMSLink className="text-sm text-muted-foreground hover:text-brand transition-colors" {...link} />
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </div>

      <div className="border-t border-brand/10 py-6">
        <div className="container text-center text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Gaming News. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
