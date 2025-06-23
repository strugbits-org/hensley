"use client";
import React, { useRef, useState } from "react";
import SectionTitle from "../common/SectionTitle";

const CareerOpportunities = ({ data }) => {
  const { subtitle, title, buttonLabel, detail, video } = data;

  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showFullText, setShowFullText] = useState(false);

  const handlePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  };

  const getWixVideoUrl = (wixVideoUri) => {
    const match = wixVideoUri.match(/wix:video:\/\/v1\/([a-zA-Z0-9_]+)/);
    return match
      ? `https://video.wixstatic.com/video/${match[1]}/1080p/mp4/file.mp4`
      : wixVideoUri;
  };

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
          <div className="lg:h-[875px] sm:h-[408px] h-[263px] relative">
            <video
              ref={videoRef}
              src={getWixVideoUrl(video)}
              controls
              loop
              muted
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              className="w-full h-full object-cover"
            >
              Your browser does not support the video tag.
            </video>

            {!isPlaying && (
              <button
                onClick={handlePlay}
                className="absolute inset-0 z-10 flex items-center justify-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="lg:h-[172px] lg:w-[172px] sm:h-[154px] sm:w-[154px] h-[85px] w-[85px]"
                  viewBox="0 0 172 172"
                >
                  <g transform="translate(-0.497 0.001)">
                    <g
                      transform="translate(0.497 -0.001)"
                      fill="none"
                      stroke="#fff"
                      strokeWidth="3"
                    >
                      <circle cx="86" cy="86" r="86" stroke="none" />
                      <circle cx="86" cy="86" r="84.5" fill="none" />
                    </g>
                    <path
                      d="M42,0,84,74H0Z"
                      transform="translate(133.497 45) rotate(90)"
                      fill="#fff"
                    />
                  </g>
                </svg>
              </button>
            )}
          </div>

          <div className="w-full flex justify-between lg:gap-x-[12px] sm:gap-x-[15px] gap-y-[12px] sm:flex-row flex-col py-[30px]">
            <h3 className="text-[35px] leading-[30px] lg:text-[60px] lg:leading-[55px] sm:text-[35px] sm:leading-[30px] text-secondary-alt uppercase font-recklessRegular">
              {subtitle && (
                <>
                  {subtitle.split(" ")[0]} <br /> {subtitle.split(" ")[1]}
                </>
              )}
            </h3>

            <div className="max-w-[608px] lg:w-[608px] sm:w-[360px]">
              <div className="uppercase sm:text-[16px] sm:leading-[20px] text-[14px] leading-[18px] text-secondary-alt space-y-4">
                {showFullText
                  ? paragraphs.map((p, i) => <p key={i}>{p}</p>)
                  : shortParagraphs}
              </div>

              <button
                className="uppercase bg-transparent text-[16px] leading-[20px] text-secondary-alt font-haasRegular hover:font-haasBold mt-[24px]"
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
