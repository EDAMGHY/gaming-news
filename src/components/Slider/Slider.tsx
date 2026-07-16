'use client'
import { useState } from 'react'
import { Swiper } from 'swiper/react'
import { Navigation, Pagination, Scrollbar, A11y, Autoplay } from 'swiper/modules'

import { ISlider } from './types'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/scrollbar'
import { ArrowLeftCircle, ArrowRightCircle } from 'lucide-react'
import { Button } from '../ui/button'

export const Slider = ({
  pagination = {
    dynamicBullets: true,
  },
  loop,
  autoplay = { delay: 10000 },
  children,
  ...props
}: ISlider) => {
  const [prevEl, setPrevEl] = useState<HTMLElement | null>(null)
  const [nextEl, setNextEl] = useState<HTMLElement | null>(null)
  return (
    <>
      <Swiper
        modules={[Navigation, Pagination, Scrollbar, A11y, Autoplay]}
        spaceBetween={10}
        slidesPerView={1}
        autoplay={autoplay}
        breakpoints={{
          1024: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
        }}
        navigation={{
          prevEl, // Pass the previous element reference
          nextEl, // Pass the next element reference
        }}
        pagination={pagination}
        onSlideChange={() => console.log('slide change')}
        onSwiper={(swiper) => console.log(swiper)}
        loop={loop}
        {...props}
      >
        {children}
      </Swiper>
      {/* Custom Navigation Buttons */}
      <div className="flex items-center justify-end w-full gap-2">
        <Button
          ref={(node) => setPrevEl(node)}
          className="inline-flex gap-2 justify-center items-center"
          size="sm"
        >
          <ArrowLeftCircle></ArrowLeftCircle>
          Prev
        </Button>
        <Button
          size="sm"
          ref={(node) => setNextEl(node)}
          className="inline-flex gap-2 justify-center items-center"
        >
          Next
          <ArrowRightCircle></ArrowRightCircle>
        </Button>
      </div>
    </>
  )
}
