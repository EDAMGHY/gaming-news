import React from 'react'
import Link from 'next/link'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { Gamepad2, Newspaper } from 'lucide-react'

import type { ICategoryBrowseBlock } from '@/payload-types'

export const CategoryBrowseBlock: React.FC<ICategoryBrowseBlock> = async ({ title, description }) => {
  const payload = await getPayload({ config: configPromise })

  const [categoriesRes, genresRes] = await Promise.all([
    payload.find({ collection: 'categories', depth: 0, limit: 12, sort: 'title' }),
    payload.find({ collection: 'genres', depth: 0, limit: 12, sort: 'name' }),
  ])

  const categories = categoriesRes?.docs ?? []
  const genres = genresRes?.docs ?? []

  if (categories.length === 0 && genres.length === 0) return null

  return (
    <section className="container py-6 lg:py-12">
      <div className="mb-8 pb-8 border-b-2 border-brand/20">
        <h2 className="text-4xl lg:text-5xl font-bold text-foreground flex items-center gap-3 mb-2">
          <span className="h-12 w-1 rounded-full bg-brand" />
          {title || 'Browse by Category'}
        </h2>
        {description && <p className="text-muted-foreground max-w-2xl ml-4">{description}</p>}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {categories.length > 0 && (
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center gap-2 mb-4 text-foreground">
              <Newspaper size={20} className="text-brand" />
              <h3 className="text-lg font-bold">Articles by topic</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/articles?category=${category.id}`}
                  className="inline-block bg-brand/10 hover:bg-brand hover:text-white text-brand text-sm font-semibold px-4 py-2 rounded-full transition-colors"
                >
                  {category.title}
                </Link>
              ))}
            </div>
          </div>
        )}

        {genres.length > 0 && (
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center gap-2 mb-4 text-foreground">
              <Gamepad2 size={20} className="text-brand" />
              <h3 className="text-lg font-bold">Games by genre</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {genres.map((genre) => (
                <Link
                  key={genre.id}
                  href={`/games?genre=${genre.id}`}
                  className="inline-block bg-brand/10 hover:bg-brand hover:text-white text-brand text-sm font-semibold px-4 py-2 rounded-full transition-colors"
                >
                  {genre.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
