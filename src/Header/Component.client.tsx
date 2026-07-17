'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'

import type { Header } from '@/payload-types'

import { Logo } from '@/components/Logo/Logo'
import { HeaderNav } from './Nav'
import { cn } from '@/utilities/ui'
import { ThemeSelector } from '@/providers/Theme/ThemeSelector'

interface HeaderClientProps {
  data: Header
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data }) => {
  const [theme, setTheme] = useState<string | null>(null)
  const [isStuck, setIsStuck] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
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
      setIsStuck(window.scrollY > 4)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <header
        className={cn(
          'sticky top-0 left-0 z-40 transition-all duration-300 ease-in-out border-b',
          'border-transparent',
          isStuck
            ? 'bg-background/80 backdrop-blur-xl shadow-lg border-brand/20 gaming-header-stuck'
            : 'bg-gradient-to-b from-background/50 to-transparent',
        )}
        {...(theme ? { 'data-theme': theme } : {})}
      >
        <div className="container max-w-7xl">
          <div className="py-4 flex justify-between items-center">
            {/* Logo with pulse animation */}
            <Link
              href="/"
              className="shrink-0 group relative"
            >
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-cyan-500/0 via-cyan-500/10 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-lg" />
              <div className="relative hover:scale-105 transition-transform duration-300">
                <Logo loading="eager" priority="high" />
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex gap-8 items-center">
              <nav className="gaming-nav">
                <HeaderNav data={data} />
              </nav>
              <div className="flex gap-3 items-center">
                <ThemeSelector />
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex gap-3 items-center">
              <ThemeSelector />
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg hover:bg-white/5 transition-colors duration-200"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
            style={{
              animation: 'fadeIn 0.3s ease-out',
            }}
          />

          {/* Slide-out Menu */}
          <nav
            className="fixed right-0 top-0 h-full w-64 bg-background border-l border-white/10 z-40 md:hidden flex flex-col gap-6 p-6 pt-24 overflow-y-auto"
            style={{
              animation: 'slideInRight 0.3s ease-out',
            }}
          >
            <div className="flex flex-col gap-4">
              <HeaderNav data={data} />
            </div>
          </nav>
        </>
      )}
    </>
  )
}
