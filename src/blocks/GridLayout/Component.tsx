import React from 'react'

import type { IGridLayoutBlock } from '@/payload-types'

import RichText from '@/components/RichText'
import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'

export const GridLayoutBlock: React.FC<IGridLayoutBlock> = ({ media, title, description }) => {
  return (
    <div id="grid-layout-block" className="container">
      <div className="bg-card rounded border-border border p-4 flex flex-col gap-8 md:flex-row md:justify-between md:items-center">
        {title && <h2 className="text-2xl font-semibold">{title}</h2>}
        <div className="max-w-[48rem] flex items-center">
          {description && <RichText className="mb-0" data={description} enableGutter={false} />}
        </div>

        {media && (
          <Media imgClassName={cn('border border-border rounded-[0.8rem]')} resource={media} />
        )}
      </div>
    </div>
  )
}
