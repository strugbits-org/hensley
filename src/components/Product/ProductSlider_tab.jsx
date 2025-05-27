"use client"

import React, { useMemo, useState, useCallback } from 'react'
import { useKeenSlider } from "keen-slider/react"
import "keen-slider/keen-slider.min.css"
import { PrimaryImage } from '../common/PrimaryImage'

const ProductSlider_tab = ({ product }) => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [loaded, setLoaded] = useState(false)

  const mediaItems = useMemo(() => product?.mediaItems || [], [product?.mediaItems])


  const sliderConfig = useMemo(() => ({
    loop: true,
    slides: {
      perView: 2.4,
      spacing: 10,
      origin: 'center',
    },
    breakpoints: {
      "(max-width: 768px)": {
        slides: {
          perView: 1,
          spacing: 10,
          origin: 'center',
        },
      },
    },
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel)
    },
    created() {
      setLoaded(true)
    },
  }), [])

  const [sliderRef, instanceRef] = useKeenSlider(sliderConfig)


  const handleDotClick = useCallback((idx) => {
    instanceRef.current?.moveToIdx(idx)
  }, [instanceRef])


  const slideItems = useMemo(() =>
    mediaItems.map((slide, idx) => {
      const isActive = currentSlide === idx

      return (
        <div key={`slide-${idx}`} className="keen-slider__slide relative bg-white">
          <PrimaryImage
            url={slide.src}
            alt={`Product image ${idx + 1}`}
            customClasses="h-full w-full object-contain"
          />

          {/* Cart icon with improved conditional rendering */}
          <div
            className={`absolute right-6 top-6 border border-black rounded-full w-14 h-14 flex items-center justify-center shrink-0 cursor-pointer transition-opacity duration-300 group/cart ${isActive
              ? 'opacity-100'
              : 'opacity-0 pointer-events-none md:opacity-100 md:pointer-events-auto'
              }`}
          >
            <PrimaryImage
              url="https://static.wixstatic.com/shapes/0e0ac5_28d83eb7d9a4476e9700ce3a03f5a414.svg"
              alt="Add to cart"
              customClasses="block group-hover/cart:hidden"
            />
            <PrimaryImage
              url="https://static.wixstatic.com/shapes/0e0ac5_f78bb7f1de5841d1b00852f89dbac4e6.svg"
              alt="Add to cart hover"
              customClasses="hidden group-hover/cart:block"
            />
          </div>
        </div>
      )
    }), [mediaItems, currentSlide]);

  const dots = useMemo(() => {
    if (!loaded || !mediaItems.length) return null

    return (
      <div className="sm:hidden flex justify-center mt-4 gap-2">
        {mediaItems.map((_, idx) => (
          <button
            key={`dot-${idx}`}
            onClick={() => handleDotClick(idx)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${currentSlide === idx
              ? 'bg-black scale-110'
              : 'bg-white border border-black'
              }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    )
  }, [loaded, mediaItems, currentSlide, handleDotClick]);

  return (
    <>
      <div ref={sliderRef} className="lg:!hidden block keen-slider h-[492px]">
        {slideItems}
      </div>
      {dots}
    </>
  )
}

export default ProductSlider_tab;