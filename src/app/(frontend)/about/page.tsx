import type { Metadata } from 'next/types'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'

import {
  AboutHero,
  StatsBand,
  MissionSection,
  CoverageSection,
  ValuesSection,
  TeamSection,
  CTASection,
  type Stat,
} from '@/components/About'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'

export const dynamic = 'force-static'
export const revalidate = 3600

const formatCount = (n: number): string => {
  if (n >= 1000) return `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k+`
  if (n === 0) return '—'
  return `${n}+`
}

async function getStats(): Promise<Stat[]> {
  const payload = await getPayload({ config: configPromise })

  const [games, reviews, articles] = await Promise.all([
    payload.count({ collection: 'games', where: { _status: { equals: 'published' } } }),
    payload.count({ collection: 'reviews', where: { _status: { equals: 'published' } } }),
    payload.count({ collection: 'articles', where: { _status: { equals: 'published' } } }),
  ])

  return [
    { label: 'Games tracked', value: formatCount(games.totalDocs) },
    { label: 'Reviews published', value: formatCount(reviews.totalDocs) },
    { label: 'Articles written', value: formatCount(articles.totalDocs) },
    { label: 'Powered by players', value: '100%' },
  ]
}

export default async function AboutPage() {
  const stats = await getStats()

  return (
    <main>
      <AboutHero />
      <StatsBand stats={stats} />
      <MissionSection />
      <CoverageSection />
      <ValuesSection />
      <TeamSection />
      <CTASection />
    </main>
  )
}

export function generateMetadata(): Metadata {
  const title = 'About | Gaming News'
  const description =
    'Gaming News is an independent publication delivering trustworthy gaming news, honest reviews, and a living database of every release worth your time.'

  return {
    title,
    description,
    openGraph: mergeOpenGraph({
      title,
      description,
      url: '/about',
    }),
  }
}
