import { ButtonLink } from '@/components/ui/button-link'
import { ArrowRight } from 'lucide-react'
import type { ReactNode } from 'react'

export function ContentSectionHeader({
  actionHref,
  actionLabel = 'View all',
  description,
  eyebrow,
  title,
}: {
  actionHref?: string | null
  actionLabel?: string
  description?: ReactNode
  eyebrow: string
  title: string
}) {
  return (
    <header className="mb-8 flex flex-col gap-5 border-t border-border pt-5 sm:flex-row sm:items-end sm:justify-between lg:mb-10">
      <div className="max-w-2xl">
        <p className="mb-3 font-mono text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-brand">
          {eyebrow}
        </p>
        <h2 className="text-balance text-3xl font-bold tracking-[-0.02em] sm:text-4xl lg:text-5xl">
          {title}
        </h2>
        {description && (
          <div className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">
            {description}
          </div>
        )}
      </div>
      {actionHref && (
        <ButtonLink className="w-fit" href={actionHref} variant="outline">
          {actionLabel} <ArrowRight aria-hidden="true" />
        </ButtonLink>
      )}
    </header>
  )
}
