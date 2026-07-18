'use client'

import React, { useMemo, useEffect } from 'react'
import { SearchInput } from './SearchInput'
import { GamesFilters } from './GamesFilters'
import { useSearchAndFilter } from '@/hooks/useSearchAndFilter'

export interface GameDoc {
  id: string
  title: string
  slug: string
  platforms?: string[]
  genres?: Array<string | { id: string; name: string }>
  narrativeTags?: Array<string | { id: string; name: string }>
  meta?: {
    image?: any
    description?: string
  }
}

interface GamesSearchAndFilterProps {
  games: GameDoc[]
  onFilter: (filteredGames: GameDoc[]) => void
}

export const GamesSearchAndFilter: React.FC<GamesSearchAndFilterProps> = ({ games, onFilter }) => {
  const options = useMemo(
    () => ({
      searchFields: ['title'],
      filterGetters: {
        platforms: (item: GameDoc) => item.platforms,
        genres: (item: GameDoc) => item.genres?.map((g: any) => (typeof g === 'string' ? g : g.id)),
        narrativeTags: (item: GameDoc) =>
          item.narrativeTags?.map((t: any) => (typeof t === 'string' ? t : t.id)),
      },
    }),
    [],
  )

  console.log('gamesgames', games)

  const { searchQuery, setSearchQuery, filters, toggleFilter, clearAllFilters, filteredItems } =
    useSearchAndFilter(games, options)

  // Compute available filter options with counts
  const platforms = useMemo(() => {
    const platformMap = new Map<string, { label: string; count: number }>()
    const platformLabels: Record<string, string> = {
      pc: 'PC',
      ps5: 'PS5',
      ps4: 'PS4',
      'xbox-series': 'Xbox Series',
      'xbox-one': 'Xbox One',
      switch: 'Nintendo Switch',
      'switch-2': 'Nintendo Switch 2',
      mobile: 'Mobile',
    }

    games.forEach((game) => {
      game.platforms?.forEach((platform) => {
        const count = platformMap.get(platform)?.count || 0
        platformMap.set(platform, {
          label: platformLabels[platform] || platform,
          count: count + 1,
        })
      })
    })

    return Array.from(platformMap.entries()).map(([value, { label, count }]) => ({
      value,
      label,
      count,
    }))
  }, [games])

  const genres = useMemo(() => {
    const genreMap = new Map<string, { name: string; count: number }>()

    games.forEach((game) => {
      game.genres?.forEach((genre) => {
        const genreId = typeof genre === 'string' ? genre : genre.id
        const genreName = typeof genre === 'string' ? genre : genre.name
        const count = genreMap.get(genreId)?.count || 0
        genreMap.set(genreId, {
          name: genreName,
          count: count + 1,
        })
      })
    })

    return Array.from(genreMap.entries()).map(([id, { name, count }]) => ({
      id,
      name,
      count,
    }))
  }, [games])

  const narrativeTags = useMemo(() => {
    const tagMap = new Map<string, { name: string; count: number }>()

    games.forEach((game) => {
      game.narrativeTags?.forEach((tag) => {
        const tagId = typeof tag === 'string' ? tag : tag.id
        const tagName = typeof tag === 'string' ? tag : tag.name
        const count = tagMap.get(tagId)?.count || 0
        tagMap.set(tagId, {
          name: tagName,
          count: count + 1,
        })
      })
    })

    return Array.from(tagMap.entries()).map(([id, { name, count }]) => ({
      id,
      name,
      count,
    }))
  }, [games])

  useEffect(() => {
    onFilter(filteredItems)
  }, [filteredItems, onFilter])

  return (
    <div className="mb-8">
      <div className="flex flex-col gap-4 mb-6">
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search games by title..."
        />
      </div>

      <GamesFilters
        platforms={platforms}
        genres={genres}
        narrativeTags={narrativeTags}
        selectedPlatforms={filters.platforms || []}
        selectedGenres={filters.genres || []}
        selectedNarrativeTags={filters.narrativeTags || []}
        onPlatformToggle={(platform) => toggleFilter('platforms', platform)}
        onGenreToggle={(genre) => toggleFilter('genres', genre)}
        onNarrativeTagToggle={(tag) => toggleFilter('narrativeTags', tag)}
        onClearAll={clearAllFilters}
      />

      <div className="text-sm text-muted-foreground">
        Showing {filteredItems.length} of {games.length} games
      </div>
    </div>
  )
}
