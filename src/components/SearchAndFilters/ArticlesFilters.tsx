'use client'

import React from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { ChevronDown, X } from 'lucide-react'

interface ArticlesFiltersProps {
  categories: Array<{ id: string; name: string; count?: number }>
  selectedCategories: string[]
  onCategoryToggle: (category: string) => void
  onClearAll: () => void
}

export const ArticlesFilters: React.FC<ArticlesFiltersProps> = ({
  categories,
  selectedCategories,
  onCategoryToggle,
  onClearAll,
}) => {
  return (
    <div className="flex flex-col gap-4 mb-8">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <DropdownMenu>
          <Button variant="outline" className="gap-2">
            Categories <ChevronDown className="w-4 h-4" />
          </Button>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {categories.map((category) => (
              <DropdownMenuCheckboxItem
                key={category.id}
                checked={selectedCategories.includes(category.id)}
                onCheckedChange={() => onCategoryToggle(category.id)}
              >
                {category.name}
                {category.count !== undefined && (
                  <span className="ml-auto text-xs text-muted-foreground">({category.count})</span>
                )}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {selectedCategories.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearAll}
            className="text-muted-foreground hover:text-foreground"
          >
            Clear all
          </Button>
        )}
      </div>

      {selectedCategories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedCategories.map((category) => {
            const name = categories.find((c) => c.id === category)?.name || category
            return (
              <Badge key={category} variant="secondary" className="gap-1">
                {name}
                <button onClick={() => onCategoryToggle(category)} className="hover:opacity-70">
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )
          })}
        </div>
      )}
    </div>
  )
}
