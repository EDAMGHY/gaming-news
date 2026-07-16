import { Article, IUpcomingGamesBlock } from '@/payload-types'
import { addDays } from './date'

export function isArticle(value: Article | string | null | undefined): value is Article {
  return (
    !!value && typeof value === 'object' && 'id' in value // best simple discriminator
  )
}

export function resolveWindow(block: IUpcomingGamesBlock) {
  const now = new Date()
  const preset = block.rangePreset ?? '30d'

  if (preset === 'custom') {
    const start = block.startDate ? new Date(block.startDate) : now
    const end = block.endDate ? new Date(block.endDate) : addDays(start, 30)
    return { start, end }
  }

  const daysMap: Record<string, number> = {
    '30d': 30,
    '90d': 90,
    '180d': 180,
    '365d': 365,
  }

  const days = daysMap[preset] ?? 30
  return { start: now, end: addDays(now, days) }
}
