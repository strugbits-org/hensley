"use client";
import React, { useMemo, useState } from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { PrimaryImage } from "../common/PrimaryImage";
import Loading from "@/app/loading";

const THUMBNAIL_CLASSES = {
  ACTIVE: "opacity-60",
  BASE: "keen-slider__slide",
};

const SLIDER_CONFIG = {
  MAIN: {
    vertical: true,
    initial: 0,
  },
  THUMBNAIL: {
    initial: 0,
    vertical: true,
    slides: {
      perView: 6,
      spacing: 26,
    },
  },
};

function createThumbnailPlugin(mainRef) {
  return (slider) => {
    let clickHandlers = [];

    const toggleActiveState = (slides, activeIdx = -1) => {
      slides.forEach((slide, idx) => {
        slide.classList.toggle(THUMBNAIL_CLASSES.ACTIVE, idx === activeIdx);
      });
    };

    const addClickEvents = () => {
      clickHandlers.forEach(({ slide, handler }) => {
        slide.removeEventListener("click", handler);
      });
      clickHandlers = [];

      slider.slides.forEach((slide, idx) => {
        const handler = () => {
          if (mainRef.current) {
            mainRef.current.moveToIdx(idx);
          }
        };

        slide.addEventListener("click", handler);
        clickHandlers.push({ slide, handler });
      });
    };

    const handleMainSliderAnimation = (main) => {
      const targetIdx = main.animator.targetIdx || 0;
      const relativeIdx = main.track.absToRel(targetIdx);

      toggleActiveState(slider.slides, relativeIdx);

      const maxIdx = slider.track.details.maxIdx;
      slider.moveToIdx(Math.min(maxIdx, targetIdx));
    };

    slider.on("created", () => {
      if (!mainRef.current) return;

      const initialIdx = slider.track.details.rel;
      toggleActiveState(slider.slides, initialIdx);
      addClickEvents();

      mainRef.current.on("animationStarted", handleMainSliderAnimation);
    });

    slider.on("destroyed", () => {
      clickHandlers.forEach(({ slide, handler }) => {
        slide.removeEventListener("click", handler);
      });
      clickHandlers = [];
    });
  };
}

const SlideImage = React.memo(({ item, index, isMain = false }) => (
  <div
    className={`${THUMBNAIL_CLASSES.BASE} number-slide-${index + 1}`}
    key={`${isMain ? 'main' : 'thumb'}-${item.id || index}`}
  >
    <PrimaryImage
      min_h={200}
      min_w={200}
      fit="fit"
      url={item.src}
      alt={item.alt || `Product image ${index + 1}`}
      customClasses={`bg-white p-4 border border-black cursor-pointer h-full w-full object-contain transition-opacity duration-200 ${!isMain ? 'hover:opacity-80 max-h-[150px]' : 'max-h-[800px]'}`}
    />
  </div>
));

SlideImage.displayName = 'SlideImage';

export default function ProductSlider({ product }) {
  const [isSliderReady, setIsSliderReady] = useState(false);

  const thumbnailPlugin = useMemo(() => createThumbnailPlugin, []);
  const [sliderRef, instanceRef] = useKeenSlider({
    ...SLIDER_CONFIG.MAIN,
    created() {
      setIsSliderReady(true);
    },
  });

  const [thumbnailRef] = useKeenSlider(
    SLIDER_CONFIG.THUMBNAIL,
    [thumbnailPlugin(instanceRef)]
  );

  const mediaItems = useMemo(() => product?.mediaItems || [], [product?.mediaItems]);

  if (!mediaItems.length) {
    return (
      <div className="lg:flex hidden w-full h-[937px] gap-x-[24px] items-center justify-center">
        <div className="text-gray-500">No images available</div>
      </div>
    );
  }

  return (
    <>
      {!isSliderReady && (
        <div className="w-full h-[937px] flex items-center justify-center text-gray-400">
          <Loading custom type="secondary" />
        </div>
      )}

      <div
        className={`lg:flex hidden w-full h-full gap-x-[24px] justify-between transition-opacity duration-300 ${!isSliderReady ? 'invisible opacity-0' : 'visible opacity-100'
          }`}
      >
        {/* Main Slider */}
        <div
          ref={sliderRef}
          className="keen-slider !w-[85%]"
          role="region"
          aria-label="Product images"
        >
          {mediaItems.map((item, index) => (
            <SlideImage
              key={`main-${item.id || index}`}
              item={item}
              index={index}
              isMain={true}
            />
          ))}
        </div>

        {/* Thumbnail Slider */}
        <div
          ref={thumbnailRef}
          className="keen-slider !w-[15%] thumbnail grid grid-cols-1 overflow-hidden"
          role="region"
          aria-label="Product image thumbnails"
        >
          {mediaItems.map((item, index) => (
            <SlideImage
              key={`thumb-${item.id || index}`}
              item={item}
              index={index}
              isMain={false}
            />
          ))}
        </div>
      </div>
    </>
  );
}