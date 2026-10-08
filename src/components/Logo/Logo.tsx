import { cn } from '@/utilities/ui'
import React from 'react'

interface Props {
  className?: string
  loading?: 'lazy' | 'eager'
  priority?: 'auto' | 'high' | 'low'
}

export const Logo = (props: Props) => {
  const { className } = props

  return (
    <span
      aria-label="Gaming News"
      className={cn('inline-flex items-center gap-2.5 text-foreground', className)}
      role="img"
    >
      <span className="grid size-9 place-items-center rounded-md border border-brand/60 bg-brand font-mono text-[0.7rem] font-black tracking-[-0.08em] text-brand-foreground shadow-[inset_0_-5px_0_hsl(var(--foreground)/0.12)]">
        G/N
      </span>
      <span className="hidden text-[0.72rem] font-black uppercase leading-[0.95] tracking-[0.08em] sm:block">
        Gaming
        <span className="block text-brand">News</span>
      </span>
    </span>
  )
}
