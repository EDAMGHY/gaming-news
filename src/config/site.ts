export const siteConfig = {
  name: 'Gaming News',
  description: 'Latest gaming news, reviews, and game database',
  url: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
  twitter: {
    creator: '@gamingnews', // Update this with actual Twitter handle
  },
  openGraph: {
    siteName: 'Gaming News',
    type: 'website' as const,
  },
}
