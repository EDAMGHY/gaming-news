'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { SearchInput } from './SearchInput'
import { GamesFilters } from './GamesFilters'

export interface PlatformOption {
  value: string
  label: string
  count?: number
}

export interface NamedOption {
  id: string
  name: string
  count?: number
}

interface GamesSearchAndFilterProps {
  platforms: PlatformOption[]
  genres: NamedOption[]
  narrativeTags: NamedOption[]
}

/**
 * URL-driven search + filters for games. Updates `search` / `platform` / `genre`
 * / `tag` query params (resetting `page`) so the server can paginate and filter.
 */
export const GamesSearchAndFilter: React.FC<GamesSearchAndFilterProps> = ({
  platforms,
  genres,
  narrativeTags,
}) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const currentSearch = searchParams.get('search') ?? ''
  const selectedPlatforms = searchParams.getAll('platform')
  const selectedGenres = searchParams.getAll('genre')
  const selectedNarrativeTags = searchParams.getAll('tag')

  const [searchValue, setSearchValue] = useState(currentSearch)

  // Keep the input in sync if the URL changes externally (e.g. back/forward).
  useEffect(() => {
    setSearchValue(currentSearch)
  }, [currentSearch])

  const pushParams = useCallback(
    (params: URLSearchParams) => {
      // Any filter/search change returns to the first page.
      params.delete('page')
      const qs = params.toString()
      router.push(qs ? `${pathname}?${qs}` : pathname)
    },
    [pathname, router],
  )

  // Debounce search input before writing it to the URL.
  useEffect(() => {
    if (searchValue === currentSearch) return
    const handler = setTimeout(() => {
      const params = new URLSearchParams(Array.from(searchParams.entries()))
      if (searchValue) params.set('search', searchValue)
      else params.delete('search')
      pushParams(params)
    }, 350)
    return () => clearTimeout(handler)
  }, [searchValue, currentSearch, searchParams, pushParams])

  const toggleParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(Array.from(searchParams.entries()))
      const current = params.getAll(key)
      params.delete(key)
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value]
      next.forEach((v) => params.append(key, v))
      pushParams(params)
    },
    [searchParams, pushParams],
  )

  const clearAll = useCallback(() => {
    const params = new URLSearchParams(Array.from(searchParams.entries()))
    params.delete('platform')
    params.delete('genre')
    params.delete('tag')
    pushParams(params)
  }, [searchParams, pushParams])

  return (
    <div className="mb-6 flex gap-4 justify-start items-start">
      <SearchInput
        value={searchValue}
        onChange={setSearchValue}
        placeholder="Search games by title..."
      />

      <GamesFilters
        platforms={platforms}
        genres={genres}
        narrativeTags={narrativeTags}
        selectedPlatforms={selectedPlatforms}
        selectedGenres={selectedGenres}
        selectedNarrativeTags={selectedNarrativeTags}
        onPlatformToggle={(platform) => toggleParam('platform', platform)}
        onGenreToggle={(genre) => toggleParam('genre', genre)}
        onNarrativeTagToggle={(tag) => toggleParam('tag', tag)}
        onClearAll={clearAll}
      />
    </div>
  )
}
