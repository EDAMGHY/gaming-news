import Link from 'next/link'
import React from 'react'
import { ArrowRight } from 'lucide-react'

export const CTASection: React.FC = () => {
  return (
    <section className="container py-20">
      <div className="relative overflow-hidden rounded-3xl border border-brand/20 bg-gradient-to-br from-brand/15 via-background to-cyan-500/10 px-6 py-14 text-center md:px-12 md:py-20">
        <div className="pointer-events-none absolute -top-20 left-1/2 h-52 w-[36rem] max-w-[90vw] -translate-x-1/2 rounded-full bg-brand/20 blur-3xl" />
        <h2 className="relative text-3xl font-bold text-foreground md:text-4xl">
          Never miss a launch again
        </h2>
        <p className="relative mx-auto mt-4 max-w-xl text-muted-foreground">
          Dive into our latest reviews and news, or explore the full games database to plan your
          next obsession.
        </p>
        <div className="relative mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/games"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand px-6 py-3 font-semibold text-white transition-all duration-300 hover:bg-brand-700 hover:shadow-lg hover:shadow-brand/30"
          >
            Explore the games
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/search"
            className="inline-flex items-center justify-center rounded-lg border border-brand/30 px-6 py-3 font-semibold text-foreground transition-all duration-300 hover:border-brand/60 hover:bg-brand/5"
          >
            Search everything
          </Link>
        </div>
      </div>
    </section>
  )
}
