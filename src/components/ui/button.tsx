import { cn } from '@/utilities/ui'
import { Slot } from '@radix-ui/react-slot'
import { type VariantProps, cva } from 'class-variance-authority'
import { Loader2 } from 'lucide-react'
import * as React from 'react'

/**
 * Filled buttons are "keycaps": a darker ledge along the bottom edge that
 * compresses when pressed, like a face button on a controller.
 */
const keycap =
  'shadow-[inset_0_-3px_0_hsl(270_14%_8%/0.22)] hover:shadow-[inset_0_-3px_0_hsl(270_14%_8%/0.28)] active:translate-y-px active:shadow-[inset_0_-1px_0_hsl(270_14%_8%/0.22)]'

const buttonVariants = cva(
  [
    'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold',
    'ring-offset-background transition-[background-color,border-color,color,box-shadow,transform] duration-150',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    'disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50',
    '[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  ],
  {
    defaultVariants: {
      size: 'default',
      variant: 'primary',
    },
    variants: {
      size: {
        clear: '',
        xs: 'h-8 rounded px-2.5 text-xs [&_svg]:size-3.5',
        sm: 'h-9 px-3',
        default: 'h-10 px-4',
        lg: 'h-11 px-5 text-[0.95rem]',
        xl: 'h-12 px-6 text-base [&_svg]:size-5',
        icon: 'size-10',
        'icon-sm': 'size-8 rounded [&_svg]:size-3.5',
        'icon-lg': 'size-12 [&_svg]:size-5',
      },
      variant: {
        /** The main action on a screen. Coin red. */
        primary: cn('bg-brand text-brand-foreground hover:bg-brand/90', keycap),
        /** Neutral filled action that sits next to a primary. */
        secondary: cn('bg-secondary text-secondary-foreground hover:bg-secondary/80', keycap),
        /** Highest-contrast neutral: ink on light, white on dark. */
        inverse: cn('bg-foreground text-background hover:bg-foreground/90', keycap),
        /** Score yellow, for verdicts and highlights. Use sparingly. */
        accent: cn('bg-quest text-ink hover:bg-quest/90', keycap),
        /** Tinted brand, for secondary calls to action that still need color. */
        soft: 'bg-brand/10 text-brand hover:bg-brand/15',
        outline:
          'border border-border bg-transparent text-foreground hover:border-foreground/30 hover:bg-foreground/5',
        ghost: 'text-foreground hover:bg-foreground/5',
        /** For use on top of images and dark hero artwork. */
        glass:
          'border border-white/25 bg-white/5 text-white backdrop-blur-sm hover:border-white/45 hover:bg-white/10',
        destructive: cn('bg-destructive text-destructive-foreground hover:bg-destructive/90', keycap),
        link: 'h-auto px-0 text-foreground underline decoration-brand/50 decoration-2 underline-offset-4 hover:text-brand hover:decoration-brand',
        /** @deprecated Kept so CMS links saved as "default" keep working. Same as `primary`. */
        default: cn('bg-brand text-brand-foreground hover:bg-brand/90', keycap),
      },
    },
  },
)

type ButtonVariant = NonNullable<VariantProps<typeof buttonVariants>['variant']>
type ButtonSize = NonNullable<VariantProps<typeof buttonVariants>['size']>

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean
  /** Shows a spinner and disables the button. Ignored with `asChild`. */
  loading?: boolean
  ref?: React.Ref<HTMLButtonElement>
}

const Button: React.FC<ButtonProps> = ({
  asChild = false,
  children,
  className,
  disabled,
  loading = false,
  size,
  variant,
  ref,
  ...props
}) => {
  if (asChild) {
    return (
      <Slot className={cn(buttonVariants({ className, size, variant }))} ref={ref} {...props}>
        {children}
      </Slot>
    )
  }

  return (
    <button
      aria-busy={loading || undefined}
      className={cn(buttonVariants({ className, size, variant }))}
      disabled={disabled || loading}
      ref={ref}
      {...props}
    >
      {loading && <Loader2 aria-hidden="true" className="animate-spin" />}
      {children}
    </button>
  )
}

export { Button, buttonVariants, type ButtonSize, type ButtonVariant }
