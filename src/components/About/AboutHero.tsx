import Link from 'next/link'
import React from 'react'
import { Gamepad2 } from 'lucide-react'

export const AboutHero: React.FC = () => {
  return (
    <section className="relative overflow-hidden border-b-2 border-brand/20">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 left-1/2 h-72 w-[42rem] max-w-[90vw] -translate-x-1/2 rounded-full bg-brand/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl" />
      </div>

      <div className="container py-20 md:py-28 text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-4 py-1.5 text-sm font-medium text-brand-400">
          <Gamepad2 className="h-4 w-4" />
          About Gaming News
        </span>

        <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-bold leading-tight tracking-tight text-foreground md:text-6xl">
          Where players come to{' '}
          <span className="bg-gradient-to-r from-brand-500 to-cyan-400 bg-clip-text text-transparent">
            stay ahead of the game
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
          We&apos;re an independent gaming publication delivering trustworthy news, honest reviews,
          and a living database of every release worth your time — written by players, for players.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/articles"
            className="inline-flex items-center justify-center rounded-lg bg-brand px-6 py-3 font-semibold text-white transition-all duration-300 hover:bg-brand-700 hover:shadow-lg hover:shadow-brand/30"
          >
            Read the latest
          </Link>
          <Link
            href="/reviews"
            className="inline-flex items-center justify-center rounded-lg border border-brand/30 px-6 py-3 font-semibold text-foreground transition-all duration-300 hover:border-brand/60 hover:bg-brand/5"
          >
            Browse reviews
          </Link>
        </div>
      </div>
    </section>
  )
}
