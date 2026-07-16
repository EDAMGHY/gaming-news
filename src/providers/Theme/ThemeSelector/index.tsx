'use client'

import React from 'react'
import { Moon, Sun } from 'lucide-react'

import type { Theme } from './types'

import { useTheme } from '..'
import { themeLocalStorageKey } from './types'
import { cn } from '@/utilities/ui'

export const ThemeSelector: React.FC = () => {
  const { setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)
  const [value, setValue] = React.useState<'light' | 'dark'>('light')

  React.useEffect(() => {
    setMounted(true)

    const preference = window.localStorage.getItem(themeLocalStorageKey)

    // If saved theme is "dark" use dark, otherwise fallback to light.
    // (If "auto" is stored, you can also detect system preference here if you want)
    if (preference === 'dark') {
      setValue('dark')
    } else if (preference === 'light') {
      setValue('light')
    } else {
      // "auto" or missing -> derive from system
      const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches
      setValue(prefersDark ? 'dark' : 'light')
    }
  }, [])

  const isDark = value === 'dark'

  const toggleTheme = () => {
    const nextTheme: Theme = isDark ? 'light' : 'dark'
    setTheme(nextTheme)
    setValue(nextTheme)
  }

  // Avoid hydration mismatch flicker
  if (!mounted) {
    return (
      <button
        type="button"
        aria-label="Toggle theme"
        className="relative inline-flex h-9 w-16 items-center rounded-full border border-border bg-muted px-1"
      >
        <span className="inline-block h-7 w-7 rounded-full bg-background shadow" />
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      aria-pressed={isDark}
      className={cn(
        'relative inline-flex h-9 w-16 items-center rounded-full p-1 transition-colors',
        'border border-border',
        isDark ? 'bg-zinc-900' : 'bg-zinc-200',
      )}
    >
      {/* Sliding thumb */}
      <span
        className={cn(
          'absolute top-[3px] h-7 w-7 rounded-full bg-background shadow-md transition-transform duration-300',
          isDark ? 'translate-x-7' : 'translate-x-0',
        )}
      />

      {/* Icons */}
      <span className="relative z-10 flex w-full items-center justify-between px-1">
        <Sun
          className={cn(
            'h-4 w-4 transition-opacity',
            isDark ? 'opacity-40' : 'opacity-100 text-amber-500',
          )}
        />
        <Moon
          className={cn(
            'h-4 w-4 transition-opacity',
            isDark ? 'opacity-100 text-slate-200' : 'opacity-40',
          )}
        />
      </span>
    </button>
  )
}
