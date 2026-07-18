import Link from 'next/link'
import React from 'react'
import { ArrowRight } from 'lucide-react'

import type { IAboutFeaturesBlock } from '@/payload-types'
import { getIcon } from '../icons'

export const AboutFeaturesBlock: React.FC<IAboutFeaturesBlock> = ({
  heading,
  subheading,
  style,
  items,
}) => {
  const list = items || []
  const isRow = style === 'row'

  return (
    <section className={isRow ? 'container py-20' : 'border-y border-brand/10 bg-brand/[0.03]'}>
      <div className={isRow ? '' : 'container py-20'}>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-foreground md:text-4xl">{heading}</h2>
          {subheading && <p className="mt-4 text-muted-foreground">{subheading}</p>}
        </div>

        {isRow ? (
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {list.map((item, i) => {
              const Icon = getIcon(item.icon)
              return (
                <div
                  key={i}
                  className="flex gap-5 rounded-2xl border border-brand/15 bg-gradient-to-br from-brand/[0.04] to-transparent p-6 transition-colors duration-300 hover:border-brand/30"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-cyan-400 text-white">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {list.map((item, i) => {
              const Icon = getIcon(item.icon)
              const Wrapper = item.href ? Link : 'div'
              const wrapperProps = item.href ? { href: item.href } : {}
              return (
                <Wrapper
                  key={i}
                  {...(wrapperProps as { href: string })}
                  className="group relative flex flex-col rounded-2xl border border-brand/15 bg-background p-6 transition-all duration-300 hover:-translate-y-1 hover:border-brand/40 hover:shadow-lg hover:shadow-brand/10"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand/10 text-brand-400 transition-colors duration-300 group-hover:bg-brand group-hover:text-white">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-foreground">{item.title}</h3>
                  <p className="mt-2 flex-1 text-sm text-muted-foreground">{item.description}</p>
                  {item.href && (
                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-brand-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      Explore
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  )}
                </Wrapper>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
