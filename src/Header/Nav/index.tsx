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
            className="gaming-nav-item px-3 py-2 rounded-lg relative group text-sm md:text-base font-medium transition-all duration-300 hover:text-cyan-400"
          />
        )
      })}
      <Link
        href="/search"
        className="gaming-nav-item p-2 md:p-1.5 rounded-lg transition-all duration-300 hover:text-cyan-400 hover:bg-white/5 group"
      >
        <span className="sr-only">Search</span>
        <SearchIcon className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
      </Link>
    </div>
  )
}
