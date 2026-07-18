import type { Metadata } from 'next/types'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import GamesPageClient from './page.client'
import { siteConfig } from '@/config/site'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { getServerSideURL } from '@/utilities/getURL'

export const dynamic = 'force-static'
export const revalidate = 600

export default async function Page() {
  const games = await getGames()

  return (
    <div className="">
      <div className="bg-gradient-to-br from-brand/10 via-brand/5 to-transparent border-b border-brand/20 py-16 mb-16">
        <div className="container">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="h-1 w-12 rounded-full bg-brand" />
              <p className="text-brand font-semibold uppercase text-sm tracking-wide">
                Game Database
              </p>
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold text-foreground">Games Catalogue</h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Explore our comprehensive game database with detailed information, platforms, and
              release dates.
            </p>
          </div>
        </div>
      </div>

      <GamesPageClient games={games as any} />

      <div className="pb-24" />
    </div>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: `Games | ${siteConfig.name}`,
    description:
      'Explore our comprehensive game database with reviews, releases, platforms, and more.',
    openGraph: mergeOpenGraph({
      title: `Games | ${siteConfig.name}`,
      description:
        'Explore our comprehensive game database with reviews, releases, platforms, and more.',
      url: `${getServerSideURL()}/games`,
    }),
  }
}

export const getGames = async () => {
  const payload = await getPayload({ config: configPromise })

  try {
    const games = await payload.find({
      collection: 'games',
      limit: 1000,
      overrideAccess: true,
    })
    return games.docs
  } catch (error) {
    console.error('Error fetching games:', error instanceof Error ? error.message : String(error))
    return []
  }
}
