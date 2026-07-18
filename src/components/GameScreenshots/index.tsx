'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react'
import type { Media } from '@/payload-types'
import { Lightbox } from '@/components/Lightbox'

interface GameScreenshotsProps {
  screenshots?: (string | Media)[]
  gameTitle: string
}

export function GameScreenshots({ screenshots, gameTitle }: GameScreenshotsProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)

  if (!screenshots || screenshots.length === 0) return null

  // Extract image URLs from Media objects or use string directly
  const imageUrls = screenshots
    .map((item) => {
      if (typeof item === 'string') return item
      if (typeof item === 'object' && item?.url) return item.url
      return null
    })
    .filter(Boolean) as string[]

  if (imageUrls.length === 0) return null

  const currentImage = imageUrls[selectedIndex]

  const handlePrevious = () => {
    setSelectedIndex((prev) => (prev === 0 ? imageUrls.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setSelectedIndex((prev) => (prev === imageUrls.length - 1 ? 0 : prev + 1))
  }

  return (
    <>
      {/* Main Gallery */}
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-2xl font-bold text-foreground">Gallery</h3>
            <p className="text-sm text-muted-foreground">
              {selectedIndex + 1} of {imageUrls.length}
            </p>
          </div>
          <button
            onClick={() => setIsFullscreen(true)}
            className="p-2 hover:bg-card rounded-lg transition-colors"
            aria-label="View fullscreen"
          >
            <Maximize2 className="w-5 h-5 text-muted-foreground hover:text-foreground" />
          </button>
        </div>

        {/* Main Image Viewer */}
        <div className="relative group">
          <button
            type="button"
            onClick={() => setIsFullscreen(true)}
            className="relative aspect-video w-full bg-black rounded-xl overflow-hidden cursor-zoom-in"
            aria-label="View screenshot fullscreen"
          >
            <Image
              src={currentImage}
              alt={`${gameTitle} screenshot ${selectedIndex + 1}`}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 800px"
            />
          </button>

          {/* Navigation Buttons */}
          {imageUrls.length > 1 && (
            <>
              <button
                onClick={handlePrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-all opacity-0 group-hover:opacity-100"
                aria-label="Previous screenshot"
              >
                <ChevronLeft className="w-6 h-6 text-white" />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-all opacity-0 group-hover:opacity-100"
                aria-label="Next screenshot"
              >
                <ChevronRight className="w-6 h-6 text-white" />
              </button>
            </>
          )}
        </div>

        {/* Thumbnail Strip */}
        {imageUrls.length > 1 && (
          <div className="space-y-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Screenshots
            </p>
            <div className="flex gap-2 overflow-x-auto pb-2 snap-x snap-mandatory">
              {imageUrls.map((url, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedIndex(index)}
                  className={`relative flex-shrink-0 w-24 h-16 rounded-lg overflow-hidden border-2 transition-all snap-start ${
                    index === selectedIndex
                      ? 'border-brand ring-2 ring-brand/50'
                      : 'border-border hover:border-brand/50'
                  }`}
                  aria-label={`Screenshot ${index + 1}`}
                >
                  <Image
                    src={url}
                    alt={`${gameTitle} thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Fullscreen Modal */}
      <Lightbox
        images={imageUrls}
        isOpen={isFullscreen}
        onClose={() => setIsFullscreen(false)}
        index={selectedIndex}
        onIndexChange={setSelectedIndex}
        alt={`${gameTitle} screenshot`}
      />
    </>
  )
}
