'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import React, { useEffect, useState, useCallback } from 'react'
import { ArticlesSearchAndFilter, ArticleDoc } from '@/components/SearchAndFilters/ArticlesSearchAndFilter'
import { CollectionArchive } from '@/components/CollectionArchive'
import { PageRange } from '@/components/PageRange'

interface ArticlesPageClientProps {
  articles?: ArticleDoc[]
}

const ArticlesPageClient: React.FC<ArticlesPageClientProps> = ({ articles = [] }) => {
  const { setHeaderTheme } = useHeaderTheme()
  const [filteredArticles, setFilteredArticles] = useState<ArticleDoc[]>(articles)

  useEffect(() => {
    setHeaderTheme('light')
  }, [setHeaderTheme])

  const handleFilter = useCallback((filtered: ArticleDoc[]) => {
    setFilteredArticles(filtered)
  }, [])

  return (
    <div className="container">
      <ArticlesSearchAndFilter articles={articles} onFilter={handleFilter} />

      {filteredArticles && filteredArticles.length > 0 && (
        <>
          <div className="mb-8">
            <PageRange
              collection="articles"
              currentPage={1}
              limit={filteredArticles.length}
              totalDocs={filteredArticles.length}
            />
          </div>

          <CollectionArchive articles={filteredArticles as any} />
        </>
      )}

      {(!filteredArticles || filteredArticles.length === 0) && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No articles found matching your criteria.</p>
        </div>
      )}
    </div>
  )
}

export default ArticlesPageClient
