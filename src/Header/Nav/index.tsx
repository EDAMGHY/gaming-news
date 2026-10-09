'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ArrowRight } from 'lucide-react'

import type { Header as HeaderType } from '@/payload-types'
import type { HeaderFeed } from '../getHeaderFeed'

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu'
import { cn } from '@/utilities/ui'
import { platformShortcuts, primaryHrefs, sections, type SectionKey } from '../sections'

type NavLink = NonNullable<HeaderType['navItems']>[number]['link']

export const getHref = (link: NavLink): string | null => {
  if (link.type === 'reference' && typeof link.reference?.value === 'object') {
    const { relationTo, value } = link.reference
    if (!value.slug) return null
    return `${relationTo !== 'pages' ? `/${relationTo}` : ''}/${value.slug}`
  }
  return link.url ?? null
}

export const isActive = (pathname: string, href: string | null) => {
  if (!href) return false
  if (href === '/' || href === '/home') return pathname === '/'
  return pathname === href || pathname.startsWith(`${href}/`)
}

/** CMS nav items that are not already one of the primary sections (About, etc.). */
export const getSecondaryLinks = (data: HeaderType) =>
  (data?.navItems || [])
    .map(({ link }) => ({ href: getHref(link), label: link.label?.trim(), newTab: link.newTab }))
    .filter(
      (l): l is { href: string; label: string; newTab: boolean | null | undefined } =>
        Boolean(l.href && l.label) && !primaryHrefs.has(l.href as string),
    )

/** A face button: the glyph dot with a physical lip that presses in. */
export const FaceButton = ({ glyph, className }: { glyph: SectionKey | 'neutral'; className?: string }) => (
  <span aria-hidden="true" className={cn('face-button', className)} data-glyph={glyph} />
)

const PanelLink = ({
  href,
  children,
  className,
}: {
  href: string
  children: React.ReactNode
  className?: string
}) => (
  <NavigationMenuLink asChild>
    <Link
      className={cn(
        'block rounded-md outline-none transition-colors hover:bg-foreground/[0.05] focus-visible:bg-foreground/[0.05] focus-visible:ring-2 focus-visible:ring-ring',
        className,
      )}
      href={href}
    >
      {children}
    </Link>
  </NavigationMenuLink>
)

const PanelHeading = ({ children }: { children: React.ReactNode }) => (
  <p className="mb-2 px-3 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-muted-foreground">
    {children}
  </p>
)

const PanelFooter = ({ href, label, glyph }: { href: string; label: string; glyph: SectionKey }) => (
  <PanelLink
    className="group/footer mt-3 flex items-center justify-between border-t border-border px-3 pb-1 pt-3 hover:bg-transparent focus-visible:bg-transparent"
    href={href}
  >
    <span className="inline-flex items-center gap-2 text-sm font-semibold">
      <FaceButton glyph={glyph} />
      {label}
    </span>
    <ArrowRight
      aria-hidden="true"
      className="size-4 text-muted-foreground transition-transform group-hover/footer:translate-x-1 group-hover/footer:text-foreground"
    />
  </PanelLink>
)

const NewsPanel = ({ feed }: { feed: HeaderFeed }) => (
  <div className="w-[26rem] p-3">
    <PanelHeading>Latest news</PanelHeading>
    <ul className="space-y-0.5">
      {feed.articles.map((a) => (
        <li key={a.slug}>
          <PanelLink className="px-3 py-2.5" href={`/articles/${a.slug}`}>
            {a.category && (
              <span className="mb-1 block font-mono text-[0.6rem] uppercase tracking-[0.16em] text-glyph-news">
                {a.category}
              </span>
            )}
            <span className="line-clamp-2 font-display text-[1.02rem] font-bold leading-snug">
              {a.title}
            </span>
          </PanelLink>
        </li>
      ))}
    </ul>
    <PanelFooter glyph="news" href="/articles" label="All news" />
  </div>
)

const ReviewsPanel = ({ feed }: { feed: HeaderFeed }) => (
  <div className="w-[26rem] p-3">
    <PanelHeading>Latest verdicts</PanelHeading>
    <ul className="space-y-0.5">
      {feed.reviews.map((r) => (
        <li key={r.slug}>
          <PanelLink className="flex items-center gap-3 px-3 py-2.5" href={`/reviews/${r.slug}`}>
            <span className="score-chip" title={r.rating !== null ? `${r.rating} out of 5` : undefined}>
              {r.rating ?? '–'}
            </span>
            <span className="min-w-0">
              {r.game && (
                <span className="block truncate font-mono text-[0.6rem] uppercase tracking-[0.16em] text-muted-foreground">
                  {r.game}
                </span>
              )}
              <span className="line-clamp-2 font-display text-[1.02rem] font-bold leading-snug">
                {r.title}
              </span>
            </span>
          </PanelLink>
        </li>
      ))}
    </ul>
    <PanelFooter glyph="review" href="/reviews" label="All reviews" />
  </div>
)

const GamesPanel = ({ feed }: { feed: HeaderFeed }) => (
  <div className="w-[32rem] p-3">
    <div className="grid grid-cols-[1.1fr_1fr] gap-3">
      <div>
        <PanelHeading>Play on</PanelHeading>
        <ul className="grid grid-cols-2 gap-1.5 px-1">
          {platformShortcuts.map((p) => (
            <li key={p.value}>
              <PanelLink
                className="whitespace-nowrap border border-border px-2 py-2 text-center font-mono text-[0.64rem] uppercase tracking-[0.06em] hover:border-glyph-game/60 hover:bg-glyph-game/10"
                href={`/games?platform=${p.value}`}
              >
                {p.label}
              </PanelLink>
            </li>
          ))}
        </ul>
      </div>
      {feed.genres.length > 0 && (
        <div>
          <PanelHeading>By genre</PanelHeading>
          <ul className="grid grid-cols-2 gap-x-1">
            {feed.genres.map((g) => (
              <li key={g.id}>
                <PanelLink className="truncate px-3 py-1.5 text-sm" href={`/games?genre=${g.id}`}>
                  {g.name}
                </PanelLink>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
    <PanelFooter glyph="game" href="/games" label="Browse the full database" />
  </div>
)

const panels: Record<SectionKey, React.FC<{ feed: HeaderFeed }>> = {
  news: NewsPanel,
  review: ReviewsPanel,
  game: GamesPanel,
}

const navItemClass =
  'nav-item group/nav relative inline-flex h-10 items-center gap-2 rounded-md px-3 font-display text-[0.95rem] font-bold uppercase tracking-[0.04em] text-foreground/70 outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring data-[state=open]:text-foreground'

export const HeaderNav: React.FC<{
  data: HeaderType
  feed: HeaderFeed
  onSectionHover: (key: SectionKey | null) => void
}> = ({ data, feed, onSectionHover }) => {
  const pathname = usePathname()
  const [value, setValue] = React.useState('')
  const [lastPathname, setLastPathname] = React.useState(pathname)
  const secondary = getSecondaryLinks(data)

  // Close any open panel after navigating.
  if (pathname !== lastPathname) {
    setLastPathname(pathname)
    setValue('')
  }

  return (
    <NavigationMenu
      className="header-nav"
      delayDuration={120}
      onValueChange={setValue}
      value={value}
    >
      <NavigationMenuList className="gap-0.5 space-x-0">
        {sections.map((section) => {
          const Panel = panels[section.key]
          const active = isActive(pathname, section.href)
          const hasItems =
            section.key === 'news'
              ? feed.articles.length > 0
              : section.key === 'review'
                ? feed.reviews.length > 0
                : true

          const label = (
            <>
              <FaceButton glyph={section.key} />
              <span style={{ fontStretch: '85%' }}>{section.label}</span>
            </>
          )

          return (
            <NavigationMenuItem
              key={section.key}
              onPointerEnter={() => onSectionHover(section.key)}
              onPointerLeave={() => onSectionHover(null)}
              value={section.key}
            >
              {hasItems ? (
                <>
                  <NavigationMenuTrigger
                    asChild
                    className={cn(navItemClass, active && 'is-active text-foreground')}
                    data-glyph={section.key}
                  >
                    <Link aria-current={active ? 'page' : undefined} href={section.href}>
                      {label}
                    </Link>
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <Panel feed={feed} />
                  </NavigationMenuContent>
                </>
              ) : (
                <NavigationMenuLink asChild>
                  <Link
                    aria-current={active ? 'page' : undefined}
                    className={cn(navItemClass, active && 'is-active text-foreground')}
                    data-glyph={section.key}
                    href={section.href}
                  >
                    {label}
                  </Link>
                </NavigationMenuLink>
              )}
            </NavigationMenuItem>
          )
        })}

        {secondary.length > 0 && (
          <li aria-hidden="true" className="mx-2 h-5 w-px bg-border" role="presentation" />
        )}

        {secondary.map((link) => {
          const active = isActive(pathname, link.href)
          return (
            <NavigationMenuItem key={link.href}>
              <NavigationMenuLink asChild>
                <Link
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'inline-flex h-10 items-center rounded-md px-3 text-sm font-medium text-foreground/60 outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring',
                    active && 'text-foreground',
                  )}
                  href={link.href}
                  {...(link.newTab ? { rel: 'noopener noreferrer', target: '_blank' } : {})}
                >
                  {link.label}
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          )
        })}
      </NavigationMenuList>
    </NavigationMenu>
  )
}
