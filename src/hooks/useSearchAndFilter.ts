import { useState, useMemo, useCallback } from 'react'

export interface SearchAndFilterOptions {
  searchFields: string[]
  filterGetters?: {
    [key: string]: (item: any) => string | string[] | undefined
  }
}

export function useSearchAndFilter<T extends Record<string, any>>(
  items: T[],
  options: SearchAndFilterOptions,
) {
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<Record<string, string[]>>({})

  const toggleFilter = useCallback((filterKey: string, value: string) => {
    setFilters((prev) => {
      const currentValues = prev[filterKey] || []
      const newValues = currentValues.includes(value)
        ? currentValues.filter((v) => v !== value)
        : [...currentValues, value]

      if (newValues.length === 0) {
        const { [filterKey]: _, ...rest } = prev
        return rest
      }

      return {
        ...prev,
        [filterKey]: newValues,
      }
    })
  }, [])

  const clearAllFilters = useCallback(() => {
    setFilters({})
  }, [])

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase()
        const matchesSearch = options.searchFields.some((field) => {
          const value = field.split('.').reduce((obj, key) => obj?.[key], item as any)
          return value && String(value).toLowerCase().includes(query)
        })

        if (!matchesSearch) return false
      }

      // Other filters
      for (const [filterKey, selectedValues] of Object.entries(filters)) {
        if (selectedValues.length === 0) continue

        const getter = options.filterGetters?.[filterKey]
        if (!getter) continue

        const itemValue = getter(item)
        if (!itemValue) return false

        const values = Array.isArray(itemValue) ? itemValue : [itemValue]
        const hasMatch = selectedValues.some((selected) => values.includes(selected))

        if (!hasMatch) return false
      }

      return true
    })
  }, [items, searchQuery, filters, options])

  return {
    searchQuery,
    setSearchQuery,
    filters,
    toggleFilter,
    clearAllFilters,
    filteredItems,
  }
}
