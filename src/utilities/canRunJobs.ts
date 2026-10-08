import type { RunJobAccess } from 'payload'

export const canRunJobs: RunJobAccess = ({ req }) => {
  if (req.user) return true

  const cronSecret = process.env.CRON_SECRET?.trim()

  if (!cronSecret) return false

  return req.headers.get('authorization') === `Bearer ${cronSecret}`
}
