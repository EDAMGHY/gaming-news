import React from 'react'

import type { IGridBlocksBlock } from '@/payload-types'

import { RenderBlocks } from '@/blocks/RenderBlocks'

export const GridBlocks: React.FC<IGridBlocksBlock> = ({ blocks }) => {
  return (
    <section className="container mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:[&>*:first-child]:col-span-1 lg:[&>*:last-child]:col-span-2">
        {blocks && blocks?.length > 0 && <RenderBlocks blocks={blocks ?? []} />}
      </div>
    </section>
  )
}
