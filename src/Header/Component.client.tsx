'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import type { Header } from '@/payload-types'

import { Logo } from '@/components/Logo/Logo'
import { HeaderNav } from './Nav'
import { cn } from '@/utilities/ui'
import { ThemeSelector } from '@/providers/Theme/ThemeSelector'

interface HeaderClientProps {
  data: Header
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data }) => {
  /* Storing the value in a useState to avoid hydration errors */
  const [theme, setTheme] = useState<string | null>(null)
  const [isStuck, setIsStuck] = useState(false)
  const { headerTheme, setHeaderTheme } = useHeaderTheme()
  const pathname = usePathname()

  useEffect(() => {
    setHeaderTheme(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  useEffect(() => {
    if (headerTheme && headerTheme !== theme) setTheme(headerTheme)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headerTheme])

  useEffect(() => {
    const onScroll = () => {
      // tweak threshold if you want it to trigger later
      setIsStuck(window.scrollY > 4)
    }

    onScroll() // set initial state
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={cn(
        'sticky top-0 left-0 z-20 transition-colors duration-300 ease-in-out',
        isStuck && 'bg-background/70 backdrop-blur-md shadow-sm',
      )}
      {...(theme ? { 'data-theme': theme } : {})}
    >
      <div className="container">
        <div className="py-4 flex justify-between">
          <Link href="/" className="shrink-0">
            <Logo loading="eager" priority="high" />
          </Link>
          <div className="flex gap-4 items-center">
            <HeaderNav data={data} />
            <ThemeSelector />
          </div>
        </div>
      </div>
    </header>
  )
}
