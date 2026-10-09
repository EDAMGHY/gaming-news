'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, Search } from 'lucide-react'

import type { Header as HeaderType } from '@/payload-types'

import { Logo } from '@/components/Logo/Logo'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { ThemeSelector } from '@/providers/Theme/ThemeSelector'
import { cn } from '@/utilities/ui'
import { FaceButton, getSecondaryLinks, isActive } from './Nav'
import { platformShortcuts, sections } from './sections'

export const MobileMenu: React.FC<{
  data: HeaderType
  open: boolean
  onOpenChange: (open: boolean) => void
  onSearch: () => void
}> = ({ data, open, onOpenChange, onSearch }) => {
  const pathname = usePathname()
  const secondary = getSecondaryLinks(data)

  return (
    <Sheet onOpenChange={onOpenChange} open={open}>
      <SheetTrigger
        aria-label="Open menu"
        className="inline-flex size-10 items-center justify-center rounded-md text-foreground transition-colors hover:bg-foreground/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Menu className="size-6" />
      </SheetTrigger>
      <SheetContent
        className="flex w-[88vw] flex-col gap-0 overflow-y-auto p-0 sm:max-w-sm"
        side="right"
      >
        <SheetHeader className="border-b border-border px-5 pb-4 pt-5 text-left">
          <SheetTitle asChild>
            <span>
              <Logo />
            </span>
          </SheetTitle>
          <SheetDescription className="font-mono text-[0.62rem] uppercase tracking-[0.16em]">
            What&apos;s worth playing, and why
          </SheetDescription>
        </SheetHeader>

        <div className="px-5 pt-5">
          <button
            className="flex w-full items-center gap-3 rounded-lg border border-border bg-muted/50 px-4 py-3 text-left text-sm text-muted-foreground transition-colors hover:bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            onClick={onSearch}
            type="button"
          >
            <Search aria-hidden="true" className="size-4" />
            Search games, reviews and news
          </button>
        </div>

        <nav aria-label="Main" className="px-3 pt-4">
          <ul className="pause-menu">
            {sections.map((s) => {
              const active = isActive(pathname, s.href)
              return (
                <li key={s.key}>
                  <Link
                    aria-current={active ? 'page' : undefined}
                    className={cn('pause-menu-item', active && 'is-active')}
                    data-glyph={s.key}
                    href={s.href}
                  >
                    <FaceButton className="face-button-lg" glyph={s.key} />
                    <span className="min-w-0">
                      <span
                        className="block font-display text-2xl font-black uppercase leading-none"
                        style={{ fontStretch: '85%' }}
                      >
                        {s.label}
                      </span>
                      <span className="mt-1.5 block font-mono text-[0.62rem] uppercase leading-relaxed tracking-[0.12em] text-muted-foreground">
                        {s.blurb}
                      </span>
                    </span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="px-5 pt-6">
          <p className="mb-2.5 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-muted-foreground">
            Games by platform
          </p>
          <ul className="flex flex-wrap gap-1.5">
            {platformShortcuts.map((p) => (
              <li key={p.value}>
                <Link
                  className="inline-flex rounded-md border border-border px-3 py-2 font-mono text-[0.68rem] uppercase tracking-[0.08em] transition-colors hover:border-glyph-game/60 hover:bg-glyph-game/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  href={`/games?platform=${p.value}`}
                >
                  {p.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-auto flex items-center justify-between gap-4 border-t border-border px-5 py-4">
          <ul className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
            {secondary.map((link) => (
              <li key={link.href}>
                <Link
                  className="text-foreground/70 hover:text-foreground"
                  href={link.href}
                  {...(link.newTab ? { rel: 'noopener noreferrer', target: '_blank' } : {})}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <ThemeSelector />
        </div>
      </SheetContent>
    </Sheet>
  )
}
