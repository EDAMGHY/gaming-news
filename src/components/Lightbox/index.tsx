'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import canUseDOM from '@/utilities/canUseDOM'

interface LightboxProps {
  /** Ordered list of image URLs to display. */
  images: string[]
  /** Whether the lightbox is currently open. */
  isOpen: boolean
  /** Called when the lightbox requests to close (ESC, backdrop, close button). */
  onClose: () => void
  /** Currently visible image index. */
  index: number
  /** Called when the visible index should change. */
  onIndexChange: (index: number) => void
  /** Accessible label prefix for each image, e.g. the game title. */
  alt?: string
}

/**
 * A portal-rendered fullscreen image viewer.
 *
 * Keyboard shortcuts:
 *  - Escape        → close
 *  - ArrowLeft     → previous image
 *  - ArrowRight    → next image
 *  - Home / End    → first / last image
 *
 * Also handles body scroll locking, backdrop click-to-close, and focus
 * restoration to the element that had focus before opening.
 */
export function Lightbox({
  images,
  isOpen,
  onClose,
  index,
  onIndexChange,
  alt = 'Image',
}: LightboxProps) {
  const [mounted, setMounted] = useState(false)
  const previouslyFocused = useRef<HTMLElement | null>(null)
  const closeButtonRef = useRef<HTMLButtonElement | null>(null)

  const hasMultiple = images.length > 1

  useEffect(() => {
    setMounted(true)
  }, [])

  const goPrevious = useCallback(() => {
    if (!hasMultiple) return
    onIndexChange(index === 0 ? images.length - 1 : index - 1)
  }, [hasMultiple, images.length, index, onIndexChange])

  const goNext = useCallback(() => {
    if (!hasMultiple) return
    onIndexChange(index === images.length - 1 ? 0 : index + 1)
  }, [hasMultiple, images.length, index, onIndexChange])

  // Keyboard shortcuts
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'Escape':
          onClose()
          break
        case 'ArrowLeft':
          goPrevious()
          break
        case 'ArrowRight':
          goNext()
          break
        case 'Home':
          event.preventDefault()
          onIndexChange(0)
          break
        case 'End':
          event.preventDefault()
          onIndexChange(images.length - 1)
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose, goPrevious, goNext, onIndexChange, images.length])

  // Lock body scroll while open + restore focus on close
  useEffect(() => {
    if (!isOpen) return

    previouslyFocused.current = document.activeElement as HTMLElement | null
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    // Move focus into the modal for keyboard users
    closeButtonRef.current?.focus()

    return () => {
      document.body.style.overflow = originalOverflow
      previouslyFocused.current?.focus?.()
    }
  }, [isOpen])

  if (!mounted || !canUseDOM || !isOpen) return null

  const currentImage = images[index]
  if (!currentImage) return null

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${alt} viewer`}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        // Close only when the backdrop itself is clicked
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <button
        ref={closeButtonRef}
        onClick={onClose}
        className="absolute top-4 right-4 z-10 p-2 rounded-lg text-white hover:bg-white/10 transition-colors"
        aria-label="Close fullscreen (Esc)"
      >
        <X className="w-6 h-6" />
      </button>

      <div className="relative flex h-full w-full items-center justify-center p-4 sm:p-8">
        <Image
          key={currentImage}
          src={currentImage}
          alt={`${alt} ${index + 1} fullscreen`}
          fill
          className="object-contain"
          priority
          sizes="100vw"
        />

        {hasMultiple && (
          <>
            <button
              onClick={goPrevious}
              className="absolute left-4 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all"
              aria-label="Previous image (Left arrow)"
            >
              <ChevronLeft className="w-8 h-8 text-white" />
            </button>
            <button
              onClick={goNext}
              className="absolute right-4 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all"
              aria-label="Next image (Right arrow)"
            >
              <ChevronRight className="w-8 h-8 text-white" />
            </button>
          </>
        )}

        {hasMultiple && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-black/50">
            <p className="text-white text-sm font-semibold">
              {index + 1} / {images.length}
            </p>
          </div>
        )}
      </div>
    </div>,
    document.body,
  )
}
