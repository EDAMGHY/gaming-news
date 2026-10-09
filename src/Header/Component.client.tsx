'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState, useSyncExternalStore } from 'react'
import { Search } from 'lucide-react'

import type { Header } from '@/payload-types'
import type { HeaderFeed } from './getHeaderFeed'

import { Logo } from '@/components/Logo/Logo'
import { HeaderNav } from './Nav'
import { MobileMenu } from './MobileMenu'
import { SearchPalette } from './SearchPalette'
import { sectionForPath, type SectionKey } from './sections'
import { cn } from '@/utilities/ui'
import { ThemeSelector } from '@/providers/Theme/ThemeSelector'

interface HeaderClientProps {
  data: Header
  feed: HeaderFeed
}

const noopSubscribe = () => () => {}

const isTypingTarget = (target: EventTarget | null) =>
  target instanceof HTMLElement &&
  (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName))

export const HeaderClient: React.FC<HeaderClientProps> = ({ data, feed }) => {
  const [theme, setTheme] = useState<string | null>(null)
  const [isStuck, setIsStuck] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [hoveredSection, setHoveredSection] = useState<SectionKey | null>(null)
  const { headerTheme, setHeaderTheme } = useHeaderTheme()
  const pathname = usePathname()
  const shortcut = useSyncExternalStore(
    noopSubscribe,
    () => (/Mac|iPhone|iPad/.test(navigator.platform) ? '⌘K' : 'Ctrl K'),
    () => 'Ctrl K',
  )

  useEffect(() => {
    setHeaderTheme(null)
    setIsMobileMenuOpen(false)
    setHoveredSection(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  useEffect(() => {
    if (headerTheme && headerTheme !== theme) setTheme(headerTheme)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headerTheme])

  useEffect(() => {
    const onScroll = () => {
      setIsStuck(window.scrollY > 4)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // ⌘K / Ctrl+K anywhere, or "/" when not typing, opens search.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setIsSearchOpen((open) => !open)
      } else if (e.key === '/' && !isTypingTarget(e.target)) {
        e.preventDefault()
        setIsSearchOpen(true)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const overHero = theme === 'dark' && !isStuck
  // The logo mark doubles as a controller: the dot for the hovered (or current)
  // section stays lit while the others dim.
  const litSection = hoveredSection ?? sectionForPath(pathname)

  const openSearchFromMenu = () => {
    setIsMobileMenuOpen(false)
    setIsSearchOpen(true)
  }

  return (
    <header
      className={cn(
        'sticky top-0 left-0 z-40 transition-[background-color,box-shadow] duration-300 ease-in-out',
        overHero
          ? 'bg-gradient-to-b from-ink/80 to-transparent'
          : 'bg-background/85 backdrop-blur-xl',
        isStuck && 'gaming-header-stuck',
      )}
      data-lit={litSection ?? undefined}
      {...(theme ? { 'data-theme': theme } : {})}
    >
      <div className="container max-w-7xl">
        <div className="flex h-16 items-center justify-between gap-4 lg:h-[4.5rem] lg:gap-6">
          <Link
            aria-label="Save Point home"
            className="shrink-0 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background"
            href="/"
          >
            <Logo loading="eager" priority="high" />
          </Link>

          {/* Desktop navigation */}
          <div className="hidden min-w-0 flex-1 items-center lg:flex">
            <HeaderNav data={data} feed={feed} onSectionHover={setHoveredSection} />
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-3">
            <button
              aria-keyshortcuts="Meta+K Control+K /"
              aria-label="Search"
              className={cn(
                'group inline-flex h-10 items-center gap-2.5 rounded-lg text-sm text-muted-foreground transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                'w-10 justify-center hover:bg-foreground/5 hover:text-foreground',
                'lg:w-auto lg:justify-start lg:border lg:border-border lg:bg-foreground/[0.03] lg:pl-3 lg:pr-1.5 lg:hover:border-foreground/25',
              )}
              onClick={() => setIsSearchOpen(true)}
              type="button"
            >
              <Search aria-hidden="true" className="size-5 lg:size-4" />
              <span className="hidden xl:inline">Search games, reviews…</span>
              <kbd className="keycap hidden lg:inline-flex">{shortcut}</kbd>
            </button>

            <span aria-hidden="true" className="hidden h-6 w-px bg-border lg:block" />
            <div className="hidden lg:block">
              <ThemeSelector />
            </div>

            <div className="lg:hidden">
              <MobileMenu
                data={data}
                onOpenChange={setIsMobileMenuOpen}
                onSearch={openSearchFromMenu}
                open={isMobileMenuOpen}
              />
            </div>
          </div>
        </div>
      </div>

      <SearchPalette onOpenChange={setIsSearchOpen} open={isSearchOpen} />
    </header>
  )
}
