'use client'

import Autoplay from 'embla-carousel-autoplay'
import { Pause, Play } from 'lucide-react'
import * as React from 'react'

import { Button } from '@/components/ui/button'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel'
import { cn } from '@/utilities/ui'

import type { SliderProps, SliderSize } from './types'

/**
 * Slide widths per breakpoint. Below the full-width size, mobile always shows
 * a sliver of the next slide so the row reads as swipeable.
 */
const slideSizes: Record<SliderSize, string> = {
  full: 'basis-full',
  wide: 'basis-[88%] md:basis-1/2',
  card: 'basis-[84%] sm:basis-1/2 lg:basis-1/3',
  compact: 'basis-[62%] sm:basis-[38%] md:basis-1/3 lg:basis-1/4 xl:basis-1/5',
}

const pad = (value: number) => String(value).padStart(2, '0')

function usePrefersReducedMotion() {
  const [reduced, setReduced] = React.useState(false)

  React.useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(query.matches)
    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  return reduced
}

/**
 * General-purpose content slider. Each child becomes one slide.
 *
 * Pagination is a row of "save slots": one per page, the current one wider
 * and, while autoplaying, filling up until the next slide loads.
 */
export function Slider({
  autoplay = false,
  children,
  className,
  label,
  loop = false,
  opts,
  size = 'card',
  slideClassName,
}: SliderProps) {
  const slides = React.Children.toArray(children).filter(React.isValidElement)
  const delay = typeof autoplay === 'number' ? autoplay : 7000

  const autoplayPlugin = React.useMemo(
    () =>
      autoplay
        ? Autoplay({
            delay,
            playOnInit: false,
            stopOnFocusIn: false,
            stopOnInteraction: false,
            stopOnMouseEnter: false,
          })
        : null,
    [autoplay, delay],
  )

  const [api, setApi] = React.useState<CarouselApi>()
  const [snapCount, setSnapCount] = React.useState(0)
  const [selected, setSelected] = React.useState(0)
  const [timerRun, setTimerRun] = React.useState(0)
  const [timerActive, setTimerActive] = React.useState(false)

  const [userPaused, setUserPaused] = React.useState(false)
  const [hovered, setHovered] = React.useState(false)
  const [focused, setFocused] = React.useState(false)
  const reducedMotion = usePrefersReducedMotion()

  const shouldPlay = Boolean(autoplayPlugin) && !userPaused && !hovered && !focused && !reducedMotion

  React.useEffect(() => {
    if (!api) return

    const sync = () => {
      setSnapCount(api.scrollSnapList().length)
      setSelected(api.selectedScrollSnap())
    }
    const onTimerSet = () => {
      setTimerActive(true)
      setTimerRun((run) => run + 1)
    }
    const onTimerStopped = () => setTimerActive(false)

    sync()
    api.on('select', sync).on('reInit', sync)
    api.on('autoplay:timerset', onTimerSet).on('autoplay:timerstopped', onTimerStopped)

    return () => {
      api.off('select', sync).off('reInit', sync)
      api.off('autoplay:timerset', onTimerSet).off('autoplay:timerstopped', onTimerStopped)
    }
  }, [api])

  React.useEffect(() => {
    const plugin = api?.plugins().autoplay
    if (!api || !plugin) return
    if (shouldPlay) plugin.play()
    else plugin.stop()

    // Embla restarts autoplay after every drag; keep it stopped while paused.
    const onPointerUp = () => {
      if (!shouldPlay) plugin.stop()
    }
    api.on('pointerUp', onPointerUp)
    return () => {
      api.off('pointerUp', onPointerUp)
    }
  }, [api, shouldPlay])

  if (slides.length === 0) return null

  const hasPages = snapCount > 1
  const showProgress = shouldPlay && timerActive

  return (
    <Carousel
      aria-label={label}
      className={cn('group/slider', className)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocused(false)
      }}
      onFocusCapture={() => setFocused(true)}
      onPointerEnter={(event) => event.pointerType === 'mouse' && setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      opts={{
        align: 'start',
        containScroll: 'trimSnaps',
        loop,
        slidesToScroll: 'auto',
        ...opts,
      }}
      plugins={autoplayPlugin ? [autoplayPlugin] : undefined}
      setApi={setApi}
    >
      {/* Viewport bleeds vertically so card hover lift and shadow aren't clipped */}
      <CarouselContent className="-ml-3 sm:-ml-5" viewportClassName="-mb-8 -mt-2 pb-8 pt-2">
        {slides.map((slide, index) => (
          <CarouselItem
            aria-label={`${index + 1} of ${slides.length}`}
            className={cn('pl-3 sm:pl-5 [&>*]:h-full', slideSizes[size], slideClassName)}
            key={slide.key ?? index}
          >
            {slide}
          </CarouselItem>
        ))}
      </CarouselContent>

      {hasPages && (
        <div className="mt-6 flex items-center gap-3 sm:gap-4">
          <div className="flex min-w-0 max-w-xs flex-1 items-center gap-1">
            {Array.from({ length: snapCount }, (_, index) => {
              const isCurrent = index === selected

              return (
                <button
                  aria-current={isCurrent ? 'true' : undefined}
                  aria-label={`Go to page ${index + 1} of ${snapCount}`}
                  className={cn(
                    'group/slot flex h-6 min-w-2 items-center rounded-sm transition-[flex-grow] duration-300 ease-out',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                    isCurrent ? 'flex-[3]' : 'flex-1',
                  )}
                  key={index}
                  onClick={() => api?.scrollTo(index)}
                  type="button"
                >
                  <span
                    className={cn(
                      'relative block h-1.5 w-full overflow-hidden rounded-full transition-colors',
                      isCurrent
                        ? 'bg-foreground/15'
                        : 'bg-foreground/15 group-hover/slot:bg-foreground/35',
                    )}
                  >
                    {isCurrent && (
                      <span
                        className={cn(
                          'absolute inset-0 origin-left rounded-full bg-brand',
                          showProgress && 'animate-slot-fill',
                        )}
                        key={showProgress ? timerRun : 'static'}
                        style={showProgress ? { animationDuration: `${delay}ms` } : undefined}
                      />
                    )}
                  </span>
                </button>
              )
            })}
          </div>

          <p
            aria-live={shouldPlay ? 'off' : 'polite'}
            className="shrink-0 font-mono text-xs tabular-nums tracking-wider text-muted-foreground"
          >
            <span className="text-foreground">{pad(selected + 1)}</span>
            <span aria-hidden="true"> / </span>
            <span className="sr-only"> of </span>
            {pad(snapCount)}
          </p>

          <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2">
            {autoplayPlugin && !reducedMotion && (
              <Button
                aria-label={userPaused ? 'Resume autoplay' : 'Pause autoplay'}
                className="text-muted-foreground hover:text-foreground"
                onClick={() => setUserPaused((paused) => !paused)}
                size="icon-sm"
                variant="ghost"
              >
                {userPaused ? <Play aria-hidden="true" /> : <Pause aria-hidden="true" />}
              </Button>
            )}
            <CarouselPrevious className="size-9 sm:size-10" />
            <CarouselNext className="size-9 sm:size-10" />
          </div>
        </div>
      )}
    </Carousel>
  )
}
