"use client"
import React from "react"
import { useKeenSlider } from "keen-slider/react"
import "keen-slider/keen-slider.min.css"
import "./styles.css"
import Image from "next/image"
import image from '@/assets/plates.png'

function ThumbnailPlugin(mainRef) {
  return (slider) => {
    function removeActive() {
      slider.slides.forEach((slide) => {
        slide.classList.remove("active")
      })
    }
    function addActive(idx) {
      slider.slides[idx].classList.add("active")
    }

    function addClickEvents() {
      slider.slides.forEach((slide, idx) => {
        slide.addEventListener("click", () => {
          if (mainRef.current) mainRef.current.moveToIdx(idx)
        })
      })
    }

    slider.on("created", () => {
      if (!mainRef.current) return
      addActive(slider.track.details.rel)
      addClickEvents()
      mainRef.current.on("animationStarted", (main) => {
        removeActive()
        const next = main.animator.targetIdx || 0
        addActive(main.track.absToRel(next))
        slider.moveToIdx(Math.min(slider.track.details.maxIdx, next))
      })
    })
  }
}

export default function ProducSlider() {
  const [sliderRef, instanceRef] = useKeenSlider({
    vertical:true,
    initial: 0,
  })
  const [thumbnailRef] = useKeenSlider(
    {
      initial: 0,
      vertical:true,
      slides: {
        perView: 6,
        spacing: 5,
      },
    },
    [ThumbnailPlugin(instanceRef)]
  )

  return (
    <>
    <div className="lg:flex hidden w-full h-[937px] gap-x-[24px] !justify-between">
          <div ref={sliderRef} className="keen-slider !w-[85%]">
        <div className="keen-slider__slide number-slide1">
          <Image src={image} className="h-full w-full object-contain"/>
        </div>
        <div className="keen-slider__slide number-slide2">
           <Image src={image} className="h-full w-full object-contain"/>
        </div>
        <div className="keen-slider__slide number-slide3">
           <Image src={image} className="h-full w-full object-contain"/>
        </div>
        <div className="keen-slider__slide number-slide4">
           <Image src={image} className="h-full w-full object-contain"/>
        </div>
        <div className="keen-slider__slide number-slide5">
           <Image src={image} className="h-full w-full object-contain"/>
        </div>
        <div className="keen-slider__slide number-slide6">
           <Image src={image} className="h-full w-full object-contain"/>
        </div>
      </div>

      <div ref={thumbnailRef} className="keen-slider !w-[15%] thumbnail gird grid-cols-1 overflow-hidden">
        <div className="keen-slider__slide number-slide1 ">
           <Image src={image} className="h-full w-full object-contain"/>
        </div>
        <div className="keen-slider__slide number-slide2">
           <Image src={image} className="h-full w-full object-contain"/>
        </div>
        <div className="keen-slider__slide number-slide3">
           <Image src={image} className="h-full w-full object-contain"/>
        </div>
        <div className="keen-slider__slide number-slide4">
           <Image src={image} className="h-full w-full object-contain"/>
        </div>
        <div className="keen-slider__slide number-slide5">
           <Image src={image} className="h-full w-full object-contain"/>
        </div>
        <div className="keen-slider__slide number-slide6">
           <Image src={image} className="h-full w-full object-contain"/>
        </div>
      </div>
    </div>
    </>
  )
}
