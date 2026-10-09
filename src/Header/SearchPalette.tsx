'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { CornerDownLeft, Gamepad2, Newspaper, Search, Star } from 'lucide-react'

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { cn } from '@/utilities/ui'
import { FaceButton } from './Nav'
import { platformShortcuts, sections } from './sections'

type Result = { id: string; title: string; href: string; kind: 'game' | 'review' | 'news' }

const kindMeta = {
  game: { icon: Gamepad2, label: 'Game', className: 'text-glyph-game' },
  review: { icon: Star, label: 'Review', className: 'text-glyph-review' },
  news: { icon: Newspaper, label: 'News', className: 'text-glyph-news' },
} as const

const useLiveResults = (query: string) => {
  const q = query.trim()
  const [settled, setSettled] = React.useState<{ query: string; results: Result[] }>({
    query: '',
    results: [],
  })

  React.useEffect(() => {
    if (q.length < 2) return

    const controller = new AbortController()
    const timer = window.setTimeout(async () => {
      const like = encodeURIComponent(q)
      try {
        const [games, content] = await Promise.all([
          fetch(
            `/api/games?where[title][like]=${like}&limit=4&depth=0&select[title]=true&select[slug]=true`,
            { signal: controller.signal },
          ).then((r) => r.json()),
          fetch(`/api/search?where[title][like]=${like}&limit=6&depth=0`, {
            signal: controller.signal,
          }).then((r) => r.json()),
        ])

        const results: Result[] = [
          ...(games.docs ?? []).map((g: { id: string; title: string; slug: string }) => ({
            id: `game-${g.id}`,
            title: g.title,
            href: `/games/${g.slug}`,
            kind: 'game' as const,
          })),
          ...(content.docs ?? []).map(
            (d: { id: string; title: string; slug: string; relationTo?: string; doc?: { relationTo: string } }) => {
              const collection = d.doc?.relationTo ?? d.relationTo
              return {
                id: `doc-${d.id}`,
                title: d.title,
                href: `/${collection}/${d.slug}`,
                kind: collection === 'reviews' ? ('review' as const) : ('news' as const),
              }
            },
          ),
        ]
        setSettled({ query: q, results })
      } catch (error) {
        if ((error as Error).name !== 'AbortError') setSettled({ query: q, results: [] })
      }
    }, 180)

    return () => {
      controller.abort()
      window.clearTimeout(timer)
    }
  }, [q])

  const current = q.length >= 2 && settled.query === q
  return { results: current ? settled.results : [], loading: q.length >= 2 && !current }
}

export const SearchPalette: React.FC<{
  open: boolean
  onOpenChange: (open: boolean) => void
}> = ({ open, onOpenChange }) => {
  const router = useRouter()
  const [query, setQuery] = React.useState('')
  const { results, loading } = useLiveResults(query)
  const hasQuery = query.trim().length > 0

  const setOpen = (next: boolean) => {
    if (!next) setQuery('')
    onOpenChange(next)
  }

  const go = (href: string) => {
    setOpen(false)
    router.push(href)
  }

  const itemClass =
    'gap-3 rounded-md px-3 py-2.5 data-[selected=true]:bg-foreground/[0.06] data-[selected=true]:text-foreground'

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogContent className="top-[12vh] max-w-[calc(100vw-2rem)] translate-y-0 gap-0 overflow-hidden rounded-xl p-0 sm:max-w-xl [&>button:last-child]:hidden">
        <DialogTitle className="sr-only">Search Save Point</DialogTitle>
        <DialogDescription className="sr-only">
          Find games, reviews and news, or jump to a section.
        </DialogDescription>
        <Command
          className="[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:pb-1.5 [&_[cmdk-group-heading]]:pt-3 [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:text-[0.62rem] [&_[cmdk-group-heading]]:font-normal [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-[0.18em]"
          shouldFilter={false}
        >
          <CommandInput
            className="h-14 text-base"
            onValueChange={setQuery}
            placeholder="Search games, reviews and news"
            value={query}
          />
          <CommandList className="max-h-[min(60vh,26rem)] p-1.5">
            {hasQuery ? (
              <>
                <CommandGroup heading="Search">
                  <CommandItem
                    className={itemClass}
                    onSelect={() => go(`/search?q=${encodeURIComponent(query.trim())}`)}
                    value="__search-all"
                  >
                    <Search aria-hidden="true" className="text-muted-foreground" />
                    <span className="truncate">
                      All results for <strong className="font-semibold">“{query.trim()}”</strong>
                    </span>
                    <CornerDownLeft aria-hidden="true" className="ml-auto text-muted-foreground" />
                  </CommandItem>
                </CommandGroup>
                {results.length > 0 && (
                  <CommandGroup heading="Matches">
                    {results.map((r) => {
                      const meta = kindMeta[r.kind]
                      const Icon = meta.icon
                      return (
                        <CommandItem
                          className={itemClass}
                          key={r.id}
                          onSelect={() => go(r.href)}
                          value={r.id}
                        >
                          <Icon aria-hidden="true" className={meta.className} />
                          <span className="truncate">{r.title}</span>
                          <span className="ml-auto shrink-0 font-mono text-[0.6rem] uppercase tracking-[0.14em] text-muted-foreground">
                            {meta.label}
                          </span>
                        </CommandItem>
                      )
                    })}
                  </CommandGroup>
                )}
                {query.trim().length >= 2 && results.length === 0 && (
                  <p className="px-4 py-3 text-sm text-muted-foreground" role="status">
                    {loading ? 'Searching…' : 'No direct matches. Press Enter to search everything.'}
                  </p>
                )}
              </>
            ) : (
              <>
                <CommandEmpty>Type to search.</CommandEmpty>
                <CommandGroup heading="Go to">
                  {sections.map((s) => (
                    <CommandItem
                      className={itemClass}
                      key={s.key}
                      onSelect={() => go(s.href)}
                      value={s.href}
                    >
                      <FaceButton glyph={s.key} />
                      <span className="font-medium">{s.label}</span>
                      <span className="ml-auto truncate text-xs text-muted-foreground">{s.blurb}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
                <CommandGroup heading="Games by platform">
                  <div className="flex flex-wrap gap-1.5 px-2 pb-2">
                    {platformShortcuts.map((p) => (
                      <CommandItem
                        className={cn(
                          'rounded-md border border-border px-2.5 py-1.5 font-mono text-[0.68rem] uppercase tracking-[0.08em]',
                          'data-[selected=true]:border-glyph-game/60 data-[selected=true]:bg-glyph-game/10',
                        )}
                        key={p.value}
                        onSelect={() => go(`/games?platform=${p.value}`)}
                        value={`platform-${p.value}`}
                      >
                        {p.label}
                      </CommandItem>
                    ))}
                  </div>
                </CommandGroup>
              </>
            )}
          </CommandList>
          <div className="flex items-center gap-4 border-t border-border px-4 py-2.5 font-mono text-[0.6rem] uppercase tracking-[0.14em] text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <kbd className="keycap">↑↓</kbd> Move
            </span>
            <span className="inline-flex items-center gap-1.5">
              <kbd className="keycap">↵</kbd> Open
            </span>
            <span className="inline-flex items-center gap-1.5">
              <kbd className="keycap">Esc</kbd> Close
            </span>
          </div>
        </Command>
      </DialogContent>
    </Dialog>
  )
}
