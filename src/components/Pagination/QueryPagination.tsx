'use client'

import React, { useCallback, useMemo } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import {
  Pagination as PaginationComponent,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { cn } from '@/utilities/ui'

// Build a compact page list: 1 … (page-1) page (page+1) … total
function getPageNumbers(currentPage: number, totalPages: number): Array<number | 'ellipsis'> {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }

  const pages: Array<number | 'ellipsis'> = [1]
  const start = Math.max(2, currentPage - 1)
  const end = Math.min(totalPages - 1, currentPage + 1)

  if (start > 2) pages.push('ellipsis')
  for (let page = start; page <= end; page++) pages.push(page)
  if (end < totalPages - 1) pages.push('ellipsis')

  pages.push(totalPages)
  return pages
}

interface QueryPaginationProps {
  page: number
  totalPages: number
  className?: string
}

/**
 * Server-driven pagination: navigates by updating the `page` query param while
 * preserving any existing filters/search params in the URL.
 */
export const QueryPagination: React.FC<QueryPaginationProps> = ({
  page,
  totalPages,
  className,
}) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const goToPage = useCallback(
    (target: number) => {
      const next = Math.min(Math.max(1, target), totalPages)
      const params = new URLSearchParams(Array.from(searchParams.entries()))

      if (next <= 1) params.delete('page')
      else params.set('page', String(next))

      const qs = params.toString()
      router.push(qs ? `${pathname}?${qs}` : pathname)

      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    },
    [pathname, router, searchParams, totalPages],
  )

  const pageNumbers = useMemo(() => getPageNumbers(page, totalPages), [page, totalPages])

  return (
    <PaginationComponent className={cn('my-12', className)}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious disabled={page <= 1} onClick={() => goToPage(page - 1)} />
        </PaginationItem>

        {pageNumbers.map((p, index) =>
          p === 'ellipsis' ? (
            <PaginationItem key={`ellipsis-${index}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={p}>
              <PaginationLink isActive={p === page} onClick={() => goToPage(p)}>
                {p}
              </PaginationLink>
            </PaginationItem>
          ),
        )}

        <PaginationItem>
          <PaginationNext disabled={page >= totalPages} onClick={() => goToPage(page + 1)} />
        </PaginationItem>
      </PaginationContent>
    </PaginationComponent>
  )
}
