import { cn } from '@/utilities/ui'
import Link from 'next/link'
import * as React from 'react'

import { type ButtonSize, type ButtonVariant, buttonVariants } from './button'

export interface ButtonLinkProps extends Omit<React.ComponentProps<typeof Link>, 'href'> {
  href: string
  variant?: ButtonVariant
  size?: ButtonSize
  /** Opens in a new tab with safe `rel` attributes. */
  external?: boolean
  /** Renders as a non-interactive, dimmed link. */
  disabled?: boolean
}

/**
 * A link that looks like a button. It takes the same `variant` and `size` as `<Button>`.
 * Use it for navigation; use `<Button>` for actions.
 */
export const ButtonLink: React.FC<ButtonLinkProps> = ({
  className,
  disabled,
  external,
  href,
  size,
  variant,
  ...props
}) => (
  <Link
    aria-disabled={disabled || undefined}
    className={cn(buttonVariants({ size, variant }), className)}
    href={href}
    tabIndex={disabled ? -1 : props.tabIndex}
    {...(external ? { rel: 'noopener noreferrer', target: '_blank' } : {})}
    {...props}
  />
)
