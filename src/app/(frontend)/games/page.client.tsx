'use client'

import React, { useCallback, useEffect, useState } from 'react'

import { CollectionArchive } from '@/components/CollectionArchive'
import {
  GamesSearchAndFilter,
  type GameDoc,
} from '@/components/SearchAndFilters/GamesSearchAndFilter'
import { PageRange } from '@/components/PageRange'
import { useHeaderTheme } from '@/providers/HeaderTheme'

interface GamesPageClientProps {
  games?: GameDoc[]
}

const EMPTY_GAMES: GameDoc[] = []

function haveSameGames(previous: GameDoc[], next: GameDoc[]): boolean {
  return (
    previous.length === next.length && previous.every((game, index) => game.id === next[index]?.id)
  )
}

const GamesPageClient: React.FC<GamesPageClientProps> = ({ games = EMPTY_GAMES }) => {
  const { setHeaderTheme } = useHeaderTheme()
  const [filteredGames, setFilteredGames] = useState<GameDoc[]>(games)

  useEffect(() => {
    setHeaderTheme('light')
  }, [setHeaderTheme])

  const handleFilter = useCallback((filtered: GameDoc[]) => {
    setFilteredGames((previous) => {
      return haveSameGames(previous, filtered) ? previous : filtered
    })
  }, [])

  return (
    <div className="container">
      <GamesSearchAndFilter games={games} onFilter={handleFilter} />

      {filteredGames.length > 0 ? (
        <>
          <div className="mb-8">
            <PageRange
              collection="games"
              currentPage={1}
              limit={filteredGames.length}
              totalDocs={filteredGames.length}
            />
          </div>

          <CollectionArchive games={filteredGames as any} />
        </>
      ) : (
        <div className="py-12 text-center">
          <p className="text-muted-foreground">No games found matching your criteria.</p>
        </div>
      )}
    </div>
  )
}

export default GamesPageClient
