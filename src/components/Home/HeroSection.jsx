"use client";
import { useEffect, useRef } from "react";
import { CustomLink } from "../common/CustomLink";
import { PrimaryButton } from "../common/PrimaryButton";
import { resolveCoreMediaUrl } from "../../utils";

export const HeroSection = ({ data }) => {
  const videoRef = useRef(null);

  const { title, subTitle, estd, backgroundVideo, buttonLabel, buttonAction } =
    data;

  const videoSrc = resolveCoreMediaUrl(backgroundVideo) || null;

  useEffect(() => {
    const video = videoRef.current;

    if (!video) return;

    video.muted = true;
    video.playsInline = true;

    const playPromise = video.play();

    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // iOS low power mode may block autoplay
      });
    }
  }, []);

  return (
    <div className="relative h-[100dvh] isolate px-6 lg:px-8 flex flex-col items-center justify-between pb-[70px] pt-[120px] lg:pb-[70px] lg:pt-[140px] xl:pb-[80px] xl:pt-[150px] 2xl:pb-[90px] 2xl:pt-[160px] overflow-hidden">
      {videoSrc && (
        <video
          ref={videoRef}
          src={videoSrc}
          className="hero-video absolute inset-0 -z-10 h-full w-full object-cover pointer-events-none"
          muted
          loop
          playsInline
          webkit-playsinline="true"
          preload="auto"
          disablePictureInPicture
        />
      )}

      <span className="text-primary-alt text-[16px] font-haasRegular max-w-[250px] mx-auto text-center">
        {subTitle}
      </span>

      <div className="flex flex-col items-center gap-y-6">
        <h1 style={{ fontSize: 'clamp(32px, 7vw, 200px)' }} className="text-[32px] xs:text-[45px] md:text-[60px] lg:text-[90px] xl:text-[100px] 2xl:text-[130px] leading-[1.05] text-primary-alt font-recklessRegular text-center max-w-[90vw]">
          {title}
        </h1>

        <CustomLink to={buttonAction}>
          <PrimaryButton className="border border-primary-alt text-primary-alt text-sm hover:bg-secondary-alt px-8 py-3 lg:py-4">
            {buttonLabel}
          </PrimaryButton>
        </CustomLink>
      </div>

      <span className="text-primary-alt text-base font-haasRegular whitespace-nowrap">
        {estd}
      </span>
    </div>
  );
};
