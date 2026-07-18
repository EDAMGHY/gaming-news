import React from 'react'

import type { CallToActionBlock as CTABlockProps } from '@/payload-types'

import RichText from '@/components/RichText'
import { CMSLink } from '@/components/Link'

export const CallToActionBlock: React.FC<CTABlockProps> = ({ links, richText }) => {
  return (
    <div className="container">
      <div className="group relative overflow-hidden rounded-2xl">
        {/* Rotating conic gradient border */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 aspect-square w-[140%] -translate-x-1/2 -translate-y-1/2 animate-border-spin bg-[conic-gradient(from_0deg,transparent_0deg,#06b6d4_60deg,#7c3aed_140deg,transparent_200deg,transparent_360deg)] opacity-60 blur-[2px] transition-opacity duration-500 group-hover:opacity-100"
        />

        {/* Inner panel */}
        <div className="relative m-[2px] overflow-hidden rounded-[calc(1rem-2px)] bg-gradient-to-br from-slate-950 via-[#0b1020] to-slate-950 px-6 py-10 md:px-12 md:py-14">
          {/* Grid pattern */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.15] [background-image:linear-gradient(to_right,rgba(255,255,255,0.15)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.15)_1px,transparent_1px)] [background-size:36px_36px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]"
          />

          {/* Glow orbs */}
          <div
            aria-hidden
            className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-cyan-500/25 blur-3xl transition-all duration-700 group-hover:bg-cyan-400/40"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-fuchsia-500/25 blur-3xl transition-all duration-700 group-hover:bg-fuchsia-400/40"
          />

          <div className="relative flex flex-col items-start gap-8 md:flex-row md:items-center md:justify-between md:gap-12">
            <div
              className="max-w-[46rem] text-slate-200
                [&_h1]:animate-shimmer-move [&_h1]:bg-gradient-to-r [&_h1]:from-cyan-300 [&_h1]:via-white [&_h1]:to-fuchsia-300 [&_h1]:bg-clip-text [&_h1]:text-3xl [&_h1]:font-extrabold [&_h1]:leading-tight [&_h1]:tracking-tight [&_h1]:text-transparent md:[&_h1]:text-5xl
                [&_h2]:animate-shimmer-move [&_h2]:bg-gradient-to-r [&_h2]:from-cyan-300 [&_h2]:via-white [&_h2]:to-fuchsia-300 [&_h2]:bg-clip-text [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:leading-tight [&_h2]:tracking-tight [&_h2]:text-transparent md:[&_h2]:text-4xl
                [&_p]:mt-3 [&_p]:text-base [&_p]:text-slate-400 md:[&_p]:text-lg"
            >
              {richText && <RichText className="mb-0" data={richText} enableGutter={false} />}
            </div>

            <div className="flex w-full shrink-0 flex-col gap-4 sm:w-auto sm:flex-row md:flex-col lg:flex-row">
              {(links || []).map(({ link }, i) => {
                const isPrimary = i === 0
                return (
                  <CMSLink
                    key={i}
                    size="lg"
                    className={
                      isPrimary
                        ? 'group/btn relative overflow-hidden border-0 bg-gradient-to-r from-cyan-500 to-fuchsia-600 font-semibold text-white shadow-[0_0_28px_-6px_rgba(6,182,212,0.7)] transition-all duration-300 hover:shadow-[0_0_36px_-4px_rgba(217,70,239,0.8)] hover:brightness-110'
                        : 'border border-white/20 bg-white/5 font-medium text-slate-100 backdrop-blur-sm transition-colors duration-300 hover:border-cyan-400/60 hover:bg-white/10'
                    }
                    {...link}
                  />
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
