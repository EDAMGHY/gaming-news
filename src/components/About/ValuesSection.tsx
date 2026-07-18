import React from 'react'
import { values } from './data'

export const ValuesSection: React.FC = () => {
  return (
    <section className="container py-20">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold text-foreground md:text-4xl">What we stand for</h2>
        <p className="mt-4 text-muted-foreground">
          The principles behind every story, score, and headline we publish.
        </p>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {values.map((value) => {
          const Icon = value.icon
          return (
            <div
              key={value.title}
              className="flex gap-5 rounded-2xl border border-brand/15 bg-gradient-to-br from-brand/[0.04] to-transparent p-6 transition-colors duration-300 hover:border-brand/30"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-cyan-400 text-white">
                <Icon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">{value.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{value.description}</p>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
