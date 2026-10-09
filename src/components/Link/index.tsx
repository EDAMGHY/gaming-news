import { type ButtonSize, type ButtonVariant } from '@/components/ui/button'
import { ButtonLink } from '@/components/ui/button-link'
import { cn } from '@/utilities/ui'
import Link from 'next/link'
import React from 'react'

import type { Page, Article, Review, Game } from '@/payload-types'

type CMSLinkType = {
  appearance?: 'inline' | ButtonVariant | null
  children?: React.ReactNode
  className?: string
  label?: string | null
  newTab?: boolean | null
  reference?: {
    relationTo: 'pages' | 'articles' | 'reviews' | 'games'
    value: Page | Article | Review | Game | string | number
  } | null
  size?: ButtonSize | null
  type?: 'custom' | 'reference' | null
  url?: string | null
}

export const CMSLink: React.FC<CMSLinkType> = (props) => {
  const {
    type,
    appearance = 'inline',
    children,
    className,
    label,
    newTab,
    reference,
    size: sizeFromProps,
    url,
  } = props

  const href =
    type === 'reference' && typeof reference?.value === 'object' && reference.value.slug
      ? `${reference?.relationTo !== 'pages' ? `/${reference?.relationTo}` : ''}/${
          reference.value.slug
        }`
      : url

  if (!href) return null

  const size = appearance === 'link' ? 'clear' : (sizeFromProps ?? undefined)
  const newTabProps = newTab ? { rel: 'noopener noreferrer', target: '_blank' } : {}

  /* Ensure we don't break any styles set by richText */
  if (appearance === 'inline') {
    return (
      <Link className={cn(className)} href={href || url || ''} {...newTabProps}>
        {label && label}
        {children && children}
      </Link>
    )
  }

  return (
    <ButtonLink
      className={className}
      external={Boolean(newTab)}
      href={href}
      size={size}
      variant={appearance ?? undefined}
    >
      {label && label}
      {children && children}
    </ButtonLink>
  )
}
