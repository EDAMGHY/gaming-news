import type { LucideIcon } from 'lucide-react'
import {
  Gamepad2,
  Newspaper,
  Star,
  Trophy,
  ShieldCheck,
  Sparkles,
  Users,
  Zap,
} from 'lucide-react'

export type Value = {
  icon: LucideIcon
  title: string
  description: string
}

export type Coverage = {
  icon: LucideIcon
  title: string
  description: string
  href: string
}

export type TeamMember = {
  name: string
  role: string
  bio: string
  accent: string // tailwind gradient classes for the avatar
}

export const values: Value[] = [
  {
    icon: ShieldCheck,
    title: 'Editorial Independence',
    description:
      'Our reviews and coverage are never for sale. Scores reflect real play time, not publisher pressure.',
  },
  {
    icon: Zap,
    title: 'Fast, But Never Sloppy',
    description:
      'We break news quickly, but every story is checked against primary sources before it goes live.',
  },
  {
    icon: Users,
    title: 'Built With The Community',
    description:
      'From comment threads to Discord, the players we write for shape what we cover next.',
  },
  {
    icon: Sparkles,
    title: 'Love For The Craft',
    description:
      'We treat games as an art form — celebrating the studios, artists, and designers behind them.',
  },
]

export const coverage: Coverage[] = [
  {
    icon: Newspaper,
    title: 'News',
    description: 'Breaking announcements, patch notes, and industry shifts as they happen.',
    href: '/articles',
  },
  {
    icon: Star,
    title: 'Reviews',
    description: 'In-depth, score-backed verdicts after we finish the game — not before.',
    href: '/reviews',
  },
  {
    icon: Gamepad2,
    title: 'Games',
    description: 'A living database of releases, upcoming titles, and everything to play next.',
    href: '/games',
  },
  {
    icon: Trophy,
    title: 'Guides & Features',
    description: 'Deep dives, retrospectives, and the stories behind the games we love.',
    href: '/articles',
  },
]

export const team: TeamMember[] = [
  {
    name: 'Alex Rivera',
    role: 'Editor-in-Chief',
    bio: 'Fifteen years covering the industry, from indie darlings to AAA blockbusters.',
    accent: 'from-brand-500 to-cyan-400',
  },
  {
    name: 'Mira Chen',
    role: 'Reviews Lead',
    bio: 'Believes a great review is honest, specific, and finishes the credits first.',
    accent: 'from-fuchsia-500 to-purple-500',
  },
  {
    name: 'Jordan Okafor',
    role: 'News Editor',
    bio: 'Always three tabs deep in dev blogs, patch notes, and leak-hunting threads.',
    accent: 'from-amber-400 to-orange-500',
  },
  {
    name: 'Sam Delacroix',
    role: 'Features Writer',
    bio: 'Loves the weird, the experimental, and the games nobody else is talking about.',
    accent: 'from-emerald-400 to-teal-500',
  },
]
