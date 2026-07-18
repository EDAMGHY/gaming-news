'use client'

import React from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { ChevronDown, X } from 'lucide-react'
import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu'

interface GamesFiltersProps {
  platforms: Array<{ label: string; value: string; count?: number }>
  genres: Array<{ id: string; name: string; count?: number }>
  narrativeTags: Array<{ id: string; name: string; count?: number }>
  selectedPlatforms: string[]
  selectedGenres: string[]
  selectedNarrativeTags: string[]
  onPlatformToggle: (platform: string) => void
  onGenreToggle: (genre: string) => void
  onNarrativeTagToggle: (tag: string) => void
  onClearAll: () => void
}

export const GamesFilters: React.FC<GamesFiltersProps> = ({
  platforms,
  genres,
  narrativeTags,
  selectedPlatforms,
  selectedGenres,
  selectedNarrativeTags,
  onPlatformToggle,
  onGenreToggle,
  onNarrativeTagToggle,
  onClearAll,
}) => {
  const hasActiveFilters =
    selectedPlatforms.length > 0 || selectedGenres.length > 0 || selectedNarrativeTags.length > 0
  console.log('filtersfiltersfiltersfilters', { platforms, genres, narrativeTags })
  return (
    <div className="flex flex-col gap-4 mb-8">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                Platforms <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuLabel>Filter by Platform</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {platforms.map((platform) => (
                <DropdownMenuCheckboxItem
                  key={platform.value}
                  checked={selectedPlatforms.includes(platform.value)}
                  onCheckedChange={() => onPlatformToggle(platform.value)}
                >
                  {platform.label}
                  {platform.count !== undefined && (
                    <span className="ml-auto text-xs text-muted-foreground">
                      ({platform.count})
                    </span>
                  )}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                Genres <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuLabel>Filter by Genre</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {genres.map((genre) => (
                <DropdownMenuCheckboxItem
                  key={genre.id}
                  checked={selectedGenres.includes(genre.id)}
                  onCheckedChange={() => onGenreToggle(genre.id)}
                >
                  {genre.name}
                  {genre.count !== undefined && (
                    <span className="ml-auto text-xs text-muted-foreground">({genre.count})</span>
                  )}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                Narrative Tags <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuLabel>Filter by Narrative Tag</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {narrativeTags.map((tag) => (
                <DropdownMenuCheckboxItem
                  key={tag.id}
                  checked={selectedNarrativeTags.includes(tag.id)}
                  onCheckedChange={() => onNarrativeTagToggle(tag.id)}
                >
                  {tag.name}
                  {tag.count !== undefined && (
                    <span className="ml-auto text-xs text-muted-foreground">({tag.count})</span>
                  )}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearAll}
            className="text-muted-foreground hover:text-foreground"
          >
            Clear all
          </Button>
        )}
      </div>

      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {selectedPlatforms.map((platform) => {
            const label = platforms.find((p) => p.value === platform)?.label || platform
            return (
              <Badge key={platform} variant="secondary" className="gap-1">
                {label}
                <button onClick={() => onPlatformToggle(platform)} className="hover:opacity-70">
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )
          })}
          {selectedGenres.map((genre) => {
            const name = genres.find((g) => g.id === genre)?.name || genre
            return (
              <Badge key={genre} variant="secondary" className="gap-1">
                {name}
                <button onClick={() => onGenreToggle(genre)} className="hover:opacity-70">
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )
          })}
          {selectedNarrativeTags.map((tag) => {
            const name = narrativeTags.find((t) => t.id === tag)?.name || tag
            return (
              <Badge key={tag} variant="secondary" className="gap-1">
                {name}
                <button onClick={() => onNarrativeTagToggle(tag)} className="hover:opacity-70">
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )
          })}
        </div>
      )}
    </div>
  )
}
