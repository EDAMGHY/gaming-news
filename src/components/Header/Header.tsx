import React from 'react'
import RichText from '../RichText'

interface HeaderProps {
  title?: string | null
  description?:
    | {
        root: {
          type: string
          children: {
            type: string
            version: number
            [k: string]: unknown
          }[]
          direction: ('ltr' | 'rtl') | null
          format: 'left' | 'start' | 'center' | 'right' | 'end' | 'justify' | ''
          indent: number
          version: number
        }
        [k: string]: unknown
      }
    | string
    | null
  link?: string | null
}

export const Header = ({ title, description, link }: HeaderProps) => {
  if (!title && !description && !link) {
    return null
  }
  return (
    <header className="mb-6 flex items-end justify-between gap-6">
      <div className="max-w-2xl">
        {title && <h2 className="text-3xl font-semibold">{title}</h2>}
        {description && typeof description === 'string' && (
          <p className="mt-2 text-muted-foreground">{description}</p>
        )}
        {description && typeof description === 'object' && (
          <RichText className="text-muted-foreground" data={description} enableGutter={false} />
        )}
      </div>
      {link && (
        <a href={link} className="text-sm font-medium underline underline-offset-4">
          View all
        </a>
      )}
    </header>
  )
}
