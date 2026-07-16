import React from 'react'
import { FaRegStarHalfStroke, FaRegStar, FaStar } from 'react-icons/fa6'

export const Rating = ({ rating }: { rating: number }) => {
  const allRatings = Array.from({ length: 5 }, (_, i) => i + 1)

  return (
    <div className="flex justify-start items-center gap-1">
      {allRatings.map((r) => {
        const isHalf = rating % 1 !== 0 && r === Math.ceil(rating)
        return isHalf ? (
          <FaRegStarHalfStroke size={20} key={r} className="text-yellow-500" />
        ) : r <= rating ? (
          <FaStar size={20} key={r} className="text-yellow-500" />
        ) : (
          <FaRegStar size={20} key={r} className="text-yellow-500" />
        )
      })}
    </div>
  )
}
