export const siteConfig = {
  name: 'Save Point',
  description: "What's worth playing, and why. Independent gaming news, reviews, and a game database.",
  url: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
  twitter: {
    creator: '@savepoint', // Update this with the real handle once registered
  },
  openGraph: {
    siteName: 'Save Point',
    type: 'website' as const,
  },
}
