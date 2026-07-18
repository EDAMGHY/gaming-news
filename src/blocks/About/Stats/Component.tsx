import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

import type { IAboutStatsBlock } from '@/payload-types'

const formatCount = (n: number): string => {
  if (n >= 1000) return `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k+`
  if (n === 0) return '—'
  return `${n}+`
}

export const AboutStatsBlock: React.FC<IAboutStatsBlock> = async ({ autoCounts, stats }) => {
  const items = (stats || []).map((s) => ({ value: s.value, label: s.label }))

  if (autoCounts) {
    const payload = await getPayload({ config: configPromise })
    const [games, reviews, articles] = await Promise.all([
      payload.count({ collection: 'games', where: { _status: { equals: 'published' } } }),
      payload.count({ collection: 'reviews', where: { _status: { equals: 'published' } } }),
      payload.count({ collection: 'articles', where: { _status: { equals: 'published' } } }),
    ])
    const live = [games.totalDocs, reviews.totalDocs, articles.totalDocs]
    live.forEach((count, i) => {
      if (items[i]) items[i].value = formatCount(count)
    })
  }

  if (items.length === 0) return null

  return (
    <section className="border-y border-brand/10 bg-gradient-to-b from-brand/5 to-transparent">
      <div className="container py-14">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {items.map((stat, i) => (
            <div key={i} className="text-center">
              <div className="bg-gradient-to-r from-brand-500 to-cyan-400 bg-clip-text text-4xl font-bold text-transparent md:text-5xl">
                {stat.value}
              </div>
              <div className="mt-2 text-sm font-medium uppercase tracking-wider text-muted-foreground">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
