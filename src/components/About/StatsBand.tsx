import React from 'react'

export type Stat = {
  label: string
  value: string
}

export const StatsBand: React.FC<{ stats: Stat[] }> = ({ stats }) => {
  return (
    <section className="border-b border-brand/10 bg-gradient-to-b from-brand/5 to-transparent">
      <div className="container py-14">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="bg-gradient-to-r from-brand-500 to-cyan-400 bg-clip-text text-4xl font-bold text-transparent md:text-5xl">
                {stat.value}
              </div>
              <div className="mt-2 text-sm font-medium uppercase tracking-wider text-muted-foreground">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
