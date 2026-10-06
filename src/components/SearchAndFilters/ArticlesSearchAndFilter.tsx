'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { SearchInput } from './SearchInput'
import { ArticlesFilters } from './ArticlesFilters'
import type { CategoryOption } from './ReviewsSearchAndFilter'

interface ArticlesSearchAndFilterProps {
  categories: CategoryOption[]
}

/**
 * URL-driven search + category filter for articles. Updates `search` / `category`
 * query params (resetting `page`) so the server can paginate and filter.
 */
export const ArticlesSearchAndFilter: React.FC<ArticlesSearchAndFilterProps> = ({ categories }) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const currentSearch = searchParams.get('search') ?? ''
  const selectedCategories = searchParams.getAll('category')

  const [searchValue, setSearchValue] = useState(currentSearch)

  // Keep the input in sync if the URL changes externally (e.g. back/forward).
  useEffect(() => {
    setSearchValue(currentSearch)
  }, [currentSearch])

  const pushParams = useCallback(
    (params: URLSearchParams) => {
      // Any filter/search change returns to the first page.
      params.delete('page')
      const qs = params.toString()
      router.push(qs ? `${pathname}?${qs}` : pathname)
    },
    [pathname, router],
  )

  // Debounce search input before writing it to the URL.
  useEffect(() => {
    if (searchValue === currentSearch) return
    const handler = setTimeout(() => {
      const params = new URLSearchParams(Array.from(searchParams.entries()))
      if (searchValue) params.set('search', searchValue)
      else params.delete('search')
      pushParams(params)
    }, 350)
    return () => clearTimeout(handler)
  }, [searchValue, currentSearch, searchParams, pushParams])

  const toggleCategory = useCallback(
    (id: string) => {
      const params = new URLSearchParams(Array.from(searchParams.entries()))
      const current = params.getAll('category')
      params.delete('category')
      const next = current.includes(id) ? current.filter((c) => c !== id) : [...current, id]
      next.forEach((c) => params.append('category', c))
      pushParams(params)
    },
    [searchParams, pushParams],
  )

  const clearAllCategories = useCallback(() => {
    const params = new URLSearchParams(Array.from(searchParams.entries()))
    params.delete('category')
    pushParams(params)
  }, [searchParams, pushParams])

  return (
    <div className="mb-6 flex flex-col items-stretch gap-4 sm:flex-row sm:items-start">
      <SearchInput
        value={searchValue}
        onChange={setSearchValue}
        placeholder="Search articles by title..."
      />

      <ArticlesFilters
        categories={categories}
        selectedCategories={selectedCategories}
        onCategoryToggle={toggleCategory}
        onClearAll={clearAllCategories}
      />
    </div>
  )
}
