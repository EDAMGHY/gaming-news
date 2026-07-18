import React from 'react'
import { Target } from 'lucide-react'

export const MissionSection: React.FC = () => {
  return (
    <section className="container py-20">
      <div className="grid items-center gap-12 md:grid-cols-2">
        <div>
          <span className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-brand-400">
            <Target className="h-4 w-4" />
            Our Mission
          </span>
          <h2 className="mt-4 text-3xl font-bold text-foreground md:text-4xl">
            Cut through the noise. Get to what matters.
          </h2>
          <div className="mt-6 space-y-4 text-muted-foreground">
            <p>
              Gaming moves fast — trailers, leaks, patches, and launches land every single day. We
              started Gaming News because keeping up shouldn&apos;t mean drowning in hype or chasing
              clickbait.
            </p>
            <p>
              Our team plays the games, reads the patch notes, and talks to the community so you
              don&apos;t have to. Whether you&apos;re deciding what to buy next or just want the real
              story behind a launch, we&apos;re here to give it to you straight.
            </p>
          </div>
        </div>

        <div className="relative">
          <div className="rounded-2xl border border-brand/20 bg-gradient-to-br from-brand/10 via-background to-cyan-500/5 p-8 md:p-10">
            <blockquote className="text-xl font-medium leading-relaxed text-foreground md:text-2xl">
              &ldquo;A great gaming site earns your trust one honest verdict at a time. That&apos;s
              the only metric we care about.&rdquo;
            </blockquote>
            <div className="mt-6 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-r from-brand-500 to-cyan-400 font-bold text-white">
                AR
              </div>
              <div>
                <div className="font-semibold text-foreground">Alex Rivera</div>
                <div className="text-sm text-muted-foreground">Editor-in-Chief</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
