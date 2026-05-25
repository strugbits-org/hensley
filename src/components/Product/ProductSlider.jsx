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
      spacing: 20,
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

// Added WheelControls Plugin for mouse wheel scrolling
function WheelControls(slider) {
  let touchTimeout;
  let position;
  let wheelActive;

  function dispatch(e, name) {
    position.x -= e.deltaX;
    position.y -= e.deltaY;
    slider.container.dispatchEvent(
      new CustomEvent(name, {
        detail: {
          x: position.x,
          y: position.y,
        },
      })
    );
  }

  function wheelStart(e) {
    position = {
      x: e.pageX,
      y: e.pageY,
    };
    dispatch(e, "ksDragStart");
  }

  function wheel(e) {
    dispatch(e, "ksDrag");
  }

  function wheelEnd(e) {
    dispatch(e, "ksDragEnd");
  }

  function eventWheel(e) {
    e.preventDefault(); 
    if (!wheelActive) {
      wheelStart(e);
      wheelActive = true;
    }
    wheel(e);
    clearTimeout(touchTimeout);
    touchTimeout = setTimeout(() => {
      wheelActive = false;
      wheelEnd(e);
    }, 50);
  }

  slider.on("created", () => {
    slider.container.addEventListener("wheel", eventWheel, {
      passive: false,
    });
  });
}

const SlideImage = React.memo(({ item, index, isMain = false }) => (
  <div
    className={`${THUMBNAIL_CLASSES.BASE} number-slide-${index + 1} flex items-center justify-center w-full h-full`}
    key={`${isMain ? 'main' : 'thumb'}-${item.id || index}`}
  >
    {isMain ? (
      <div className="w-[calc(100%-2px)] h-[calc(100%-2px)] mx-[1px] my-[1px] flex items-center justify-center bg-white border border-black px-[35px] py-[33px] overflow-hidden cursor-pointer">
        <PrimaryImage
          min_h={727}
          min_w={580}
          fit="fit"
          url={item.src}
          size="tablet"
          priority={index === 0}
          loading={index === 0 ? "eager" : "lazy"}
          alt={item.alt || `Product image ${index + 1}`}
          customClasses="w-full h-full object-contain transition-opacity duration-200"
        />
      </div>
    ) : (
      <div className="w-[calc(100%-2px)] h-[calc(100%-2px)] mx-[1px] my-[1px] flex items-center justify-center bg-white border border-black px-[15px] py-[14px] overflow-hidden cursor-pointer">
        <PrimaryImage
          min_h={85}
          min_w={89}
          fit="fit"
          url={item.src}
          size="thumbnail"
          priority={index === 0}
          loading={index === 0 ? "eager" : "lazy"}
          alt={item.alt || `Product image ${index + 1}`}
          customClasses="w-full h-full object-contain transition-opacity duration-200 hover:opacity-80"
        />
      </div>
    )}
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

  // Updated to include WheelControls
  const [thumbnailRef] = useKeenSlider(
    SLIDER_CONFIG.THUMBNAIL,
    [thumbnailPlugin(instanceRef), WheelControls] 
  );

  const mediaItems = useMemo(() => product?.mediaItems || [], [product]);

  if (!mediaItems.length) {
    return (
      <div className="lg:flex hidden w-full h-[795px] gap-x-[24px] items-center justify-center">
        <div className="text-gray-500">No images available</div>
      </div>
    );
  }

  return (
    <>
      {!isSliderReady && (
        <div className="w-full h-[795px] flex items-center justify-center text-gray-400">
          <Loading custom type="secondary" />
        </div>
      )}

      <div
        className={`lg:flex hidden w-full max-w-[794px] 3xl:max-w-[1700px] h-[795px] 3xl:h-full gap-x-[24px] 3xl:gap-x-[40px] justify-between transition-opacity duration-300 ${!isSliderReady ? 'invisible opacity-0' : 'visible opacity-100'
          }`}
      >
        {/* Main Slider */}
        <div
          ref={sliderRef}
          className="keen-slider !w-[calc(100%-144px)] 3xl:!w-[calc(100%-220px)] h-[795px] 3xl:h-full p-[1px]"
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
          className="keen-slider !w-[120px] 3xl:!w-[180px] shrink-0 h-[795px] 3xl:h-full thumbnail grid grid-cols-1 overflow-hidden p-[1px]"
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