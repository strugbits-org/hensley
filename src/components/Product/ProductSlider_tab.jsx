"use client"

import React, { useState } from 'react'
import { useKeenSlider } from "keen-slider/react"
import "keen-slider/keen-slider.min.css"
import "./styles.css"
import image from '@/assets/plates.png'
import Image from "next/image"
import { PrimaryImage } from '../common/PrimaryImage'

const ProductSlider_tab = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [loaded, setLoaded] = useState(false)

  const totalSlides = 6

  const [sliderRef, instanceRef] = useKeenSlider({
    loop: true,
    rtl: true,
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
  })

  return (
    <>
      <div ref={sliderRef} className="lg:!hidden block keen-slider !h-[492px]">
        {[...Array(totalSlides)].map((_, idx) => {
          const isActive = currentSlide % totalSlides === idx
          return (
            <div key={idx} className="keen-slider__slide relative bg-white">
              <Image
                src={image}
                alt={`slide-${idx}`}
                className="h-full w-full object-contain"
              />

              {/* Show cart icon only on active (centered) slide on tablet */}
              <div className={`absolute right-[24px] top-[23px] border border-black rounded-full w-[56px] h-[56px] flex items-center justify-center shrink-0 cursor-pointer transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0 pointer-events-none'} md:pointer-events-auto`}>
                <PrimaryImage
                  url="https://static.wixstatic.com/shapes/0e0ac5_28d83eb7d9a4476e9700ce3a03f5a414.svg"
                  alt="Cart Icon"
                  customClasses="block group-hover/cart:hidden"
                />
                <PrimaryImage
                  url="https://static.wixstatic.com/shapes/0e0ac5_f78bb7f1de5841d1b00852f89dbac4e6.svg"
                  alt="Cart Icon"
                  customClasses="hidden group-hover/cart:block"
                />
              </div>
            </div>
          )
        })}
      </div>

      {/* Dots only on mobile */}
      {loaded && instanceRef.current && (
        <div className="sm:!hidden flex justify-center mt-4 gap-2">
          {[...Array(instanceRef.current.track.details.slides.length).keys()].map((idx) => (
            <button
              key={idx}
              onClick={() => instanceRef.current?.moveToIdx(idx)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                currentSlide === idx ? 'bg-black scale-110' : 'bg-white border border-black'
              }`}
            />
          ))}
        </div>
      )}
    </>
  )
}

export default ProductSlider_tab
