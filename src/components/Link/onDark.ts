import type { ButtonVariant } from '@/components/ui/button'

/**
 * Maps a CMS link appearance to the variant that reads correctly on a dark,
 * image-backed surface (heroes, the call-to-action panel).
 */
export const appearanceOnDark = (
  appearance: ButtonVariant | null | undefined,
  fallback: ButtonVariant,
): ButtonVariant => {
  if (!appearance) return fallback
  if (appearance === 'outline' || appearance === 'ghost') return 'glass'
  if (appearance === 'secondary') return 'inverse'
  return appearance
}
