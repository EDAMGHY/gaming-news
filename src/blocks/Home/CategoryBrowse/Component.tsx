import React from 'react'
import Link from 'next/link'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { Gamepad2, Newspaper } from 'lucide-react'

import type { ICategoryBrowseBlock } from '@/payload-types'
import { ContentSectionHeader } from '@/components/ContentSectionHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const CategoryBrowseBlock: React.FC<ICategoryBrowseBlock> = async ({
  title,
  description,
}) => {
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
      <ContentSectionHeader
        description={description}
        eyebrow="Discovery"
        title={title || 'Browse by category'}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {categories.length > 0 && (
          <Card className="border-border bg-card shadow-none">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Newspaper size={20} className="text-brand" />
                Articles by topic
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/articles?category=${category.id}`}
                  className="inline-block rounded-full border border-brand/20 bg-brand/5 px-4 py-2 text-sm font-semibold text-brand transition-colors hover:bg-brand hover:text-brand-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                >
                  {category.title}
                </Link>
              ))}
            </CardContent>
          </Card>
        )}

        {genres.length > 0 && (
          <Card className="border-border bg-card shadow-none">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Gamepad2 size={20} className="text-brand" />
                Games by genre
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {genres.map((genre) => (
                <Link
                  key={genre.id}
                  href={`/games?genre=${genre.id}`}
                  className="inline-block rounded-full border border-brand/20 bg-brand/5 px-4 py-2 text-sm font-semibold text-brand transition-colors hover:bg-brand hover:text-brand-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                >
                  {genre.name}
                </Link>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  )
}
