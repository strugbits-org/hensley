"use client";
import React, { useRef, useState, useEffect } from "react";
import SectionTitle from "../common/SectionTitle";

import { resolveCoreMediaUrl } from "@/utils";

const CareerOpportunities = ({ data }) => {
  const { subtitle, title, detail, video } = data;

  const videoRef = useRef(null);
  const [showFullText, setShowFullText] = useState(false);

  const videoSrc = resolveCoreMediaUrl(video);

  useEffect(() => {
    const videoElement = videoRef.current;

    if (!videoElement) return;

    videoElement.muted = true;
    videoElement.playsInline = true;

    const playPromise = videoElement.play();

    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // iOS low power mode may block autoplay
      });
    }
  }, []);

  const paragraphs = detail
    ?.split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  // Limit to 400 characters across multiple <p> tags
  const shortParagraphs = (() => {
    let totalLength = 0;
    const result = [];

    for (let i = 0; i < paragraphs.length; i++) {
      const p = paragraphs[i];
      if (totalLength + p.length <= 400) {
        result.push(<p key={i}>{p}</p>);
        totalLength += p.length;
      } else {
        const remaining = 400 - totalLength;
        if (remaining > 0) {
          result.push(<p key={i}>{p.slice(0, remaining)}...</p>);
        }
        break;
      }
    }

    return result;
  })();

  return (
    <div>
      <div className="flex flex-col gap-x-[48px] pt-[48px] pb-[56px] lg:px-0 sm:px-[60px]">
        <SectionTitle
          text={title}
          classes="lg:!text-[140px] xl:!px-[200px] lg:!leading-[140px] sm:!text-[55px] sm:!leading-[50px] !leading-[35px] border-none"
        />
        <div className="w-full text-center"></div>
      </div>

      <div className="w-full flex flex-col justify-center items-center border-t border-b border-primary-border">
        <div className="lg:w-[80%] w-[95%] pt-[24px] relative">
          {videoSrc && (
            <div className="lg:h-[875px] sm:h-[408px] h-[263px] relative">
              <video
                ref={videoRef}
                src={videoSrc}
                autoPlay
                muted
                loop
                playsInline
                webkit-playsinline="true"
                preload="auto"
                disablePictureInPicture
                className="w-full h-full object-cover pointer-events-none"
              >
                Your browser does not support the video tag.
              </video>
            </div>
          )}

          <div className="w-full flex justify-between lg:gap-x-[12px] sm:gap-x-[15px] gap-y-[12px] sm:flex-row flex-col py-[30px]">
            <h3 className="text-[35px] leading-[30px] lg:text-[60px] 3xl:text-[100px] lg:leading-[55px] 3xl:leading-[100px] sm:text-[35px] sm:leading-[30px] text-secondary-alt uppercase font-recklessRegular">
              {subtitle && (
                <>
                  {subtitle.split(" ")[0]} <br className="3xl:hidden block" />{" "}
                  {subtitle.split(" ")[1]}
                </>
              )}
            </h3>

            <div className="3xl:max-w-[1200px] max-w-[360px] lg:max-w-[608px] w-full ">
              <div className="uppercase 3xl:text-[24px] sm:text-[16px] 3xl:leading-[40px] sm:leading-[20px] text-[14px] leading-[18px] text-secondary-alt space-y-4">
                {showFullText
                  ? paragraphs.map((p, i) => <p key={i}>{p}</p>)
                  : shortParagraphs}
              </div>

              <button
                className="uppercase bg-transparent 3xl:text-[24px] text-[16px] 3xl:leading-[30px] leading-[20px] text-secondary-alt font-haasRegular hover:font-haasBold mt-[24px]"
                onClick={() => setShowFullText((prev) => !prev)}
              >
                {showFullText ? "See Less -" : "See More +"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareerOpportunities;
