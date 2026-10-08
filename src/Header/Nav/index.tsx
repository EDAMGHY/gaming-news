'use client'

import React from 'react'

import type { Header as HeaderType } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import Link from 'next/link'
import { SearchIcon } from 'lucide-react'

export const HeaderNav: React.FC<{ data: HeaderType }> = ({ data }) => {
  const navItems = data?.navItems || []

  return (
    <div className="flex gap-2 md:gap-1 items-center flex-col md:flex-row">
      {navItems.map(({ link }, i) => {
        return (
          <CMSLink
            key={i}
            {...link}
            appearance="link"
            className="gaming-nav-item group relative rounded-lg px-3 py-2 text-sm font-medium transition-all duration-300 hover:text-brand md:text-base"
          />
        )
      })}
      <Link
        href="/search"
        className="gaming-nav-item group rounded-lg p-2 transition-all duration-300 hover:bg-brand/10 hover:text-brand md:p-1.5"
      >
        <span className="sr-only">Search</span>
        <SearchIcon className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
      </Link>
    </div>
  )
}
