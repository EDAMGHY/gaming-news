import type { Metadata } from 'next'

import { cn } from '@/utilities/ui'
import { Anybody, Martian_Mono, Schibsted_Grotesk } from 'next/font/google'
import React from 'react'

import { AdminBar } from '@/components/AdminBar'
import { Footer } from '@/Footer/Component'
import { Header } from '@/Header/Component'
import { Providers } from '@/providers'
import { InitTheme } from '@/providers/Theme/InitTheme'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { draftMode } from 'next/headers'

import './globals.css'
import { getServerSideURL } from '@/utilities/getURL'
import { siteConfig } from '@/config/site'

const display = Anybody({
  axes: ['wdth'],
  display: 'swap',
  subsets: ['latin'],
  variable: '--font-display',
})

const sans = Schibsted_Grotesk({
  display: 'swap',
  subsets: ['latin'],
  variable: '--font-sans',
})

const mono = Martian_Mono({
  axes: ['wdth'],
  display: 'swap',
  subsets: ['latin'],
  variable: '--font-mono',
})

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled } = await draftMode()

  return (
    <html className={cn(display.variable, sans.variable, mono.variable)} lang="en" suppressHydrationWarning>
      <head>
        <InitTheme />
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/apple-touch-icon.png" rel="apple-touch-icon" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
      </head>
      {/* Extensions (e.g. ColorZilla) add attributes to <body> before hydration */}
      <body className="relative min-h-screen" suppressHydrationWarning>
        <Providers>
          <AdminBar
            adminBarProps={{
              preview: isEnabled,
            }}
          />

          <Header />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  metadataBase: new URL(getServerSideURL()),
  title: siteConfig.name,
  description: siteConfig.description,
  openGraph: mergeOpenGraph(),
  twitter: {
    card: 'summary_large_image',
    creator: siteConfig.twitter.creator,
  },
}
