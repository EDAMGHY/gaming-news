import { HeaderClient } from './Component.client'
import { getCachedGlobal } from '@/utilities/getGlobals'
import { getCachedHeaderFeed } from './getHeaderFeed'
import React from 'react'

import type { Header } from '@/payload-types'

export async function Header() {
  const [headerData, feed] = await Promise.all([
    getCachedGlobal('header', 1)() as Promise<Header>,
    getCachedHeaderFeed(),
  ])

  return <HeaderClient data={headerData} feed={feed} />
}
