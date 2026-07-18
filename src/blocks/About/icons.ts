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
  Target,
  Heart,
  Rocket,
  Award,
  Eye,
  MessageCircle,
} from 'lucide-react'

/**
 * Registry of icons that can be picked in the admin for About blocks.
 * The keys are stored on the document; the values render on the frontend.
 */
export const iconMap: Record<string, LucideIcon> = {
  gamepad: Gamepad2,
  newspaper: Newspaper,
  star: Star,
  trophy: Trophy,
  shield: ShieldCheck,
  sparkles: Sparkles,
  users: Users,
  zap: Zap,
  target: Target,
  heart: Heart,
  rocket: Rocket,
  award: Award,
  eye: Eye,
  message: MessageCircle,
}

export const iconOptions = Object.keys(iconMap).map((key) => ({
  label: key.charAt(0).toUpperCase() + key.slice(1),
  value: key,
}))

export const getIcon = (key?: string | null): LucideIcon => (key && iconMap[key]) || Sparkles
