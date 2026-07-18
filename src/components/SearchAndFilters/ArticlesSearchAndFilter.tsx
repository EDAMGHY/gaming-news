'use client'

import React, { useMemo } from 'react'
import { SearchInput } from './SearchInput'
import { ArticlesFilters } from './ArticlesFilters'
import { useSearchAndFilter } from '@/hooks/useSearchAndFilter'

export interface ArticleDoc {
  id: string
  title: string
  slug: string
  categories?: Array<string | { id: string; title?: string }>
  meta?: {
    image?: any
    description?: string
  }
}

interface ArticlesSearchAndFilterProps {
  articles: ArticleDoc[]
  onFilter: (filteredArticles: ArticleDoc[]) => void
}

export const ArticlesSearchAndFilter: React.FC<ArticlesSearchAndFilterProps> = ({
  articles,
  onFilter,
}) => {
  const options = useMemo(
    () => ({
      searchFields: ['title'],
      filterGetters: {
        categories: (item: ArticleDoc) =>
          item.categories?.map((c: any) => (typeof c === 'string' ? c : c.id)),
      },
    }),
    [],
  )

  const { searchQuery, setSearchQuery, filters, toggleFilter, clearAllFilters, filteredItems } =
    useSearchAndFilter(articles, options)

  // Compute available filter options with counts
  const categories = useMemo(() => {
    const categoryMap = new Map<string, { name: string; count: number }>()

    articles.forEach((article) => {
      article.categories?.forEach((category) => {
        const catId = typeof category === 'string' ? category : category.id
        const catTitle = typeof category === 'string' ? category : (category as any).title || category.id
        const count = categoryMap.get(catId)?.count || 0
        categoryMap.set(catId, {
          name: catTitle,
          count: count + 1,
        })
      })
    })

    return Array.from(categoryMap.entries()).map(([id, { name, count }]) => ({
      id,
      name,
      count,
    }))
  }, [articles])

  React.useEffect(() => {
    onFilter(filteredItems)
  }, [filteredItems, onFilter])

  return (
    <div className="mb-8">
      <div className="flex flex-col gap-4 mb-6">
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search articles by title..."
        />
      </div>

      <ArticlesFilters
        categories={categories}
        selectedCategories={filters.categories || []}
        onCategoryToggle={(category) => toggleFilter('categories', category)}
        onClearAll={clearAllFilters}
      />

      <div className="text-sm text-muted-foreground">
        Showing {filteredItems.length} of {articles.length} articles
      </div>
    </div>
  )
}
