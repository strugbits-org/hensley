import React from "react";
import { getAdditionalInfoSection, resolveCoreMediaUrl } from "@/utils";
import { CustomLink } from "../common/CustomLink";

const BannerStructures = ({ title, data }) => {
  const { additionalInfoSections = [] } = data;
  const info = getAdditionalInfoSection(additionalInfoSections, "INFO");
  const pros = getAdditionalInfoSection(additionalInfoSections, "PROS");
  const cons = getAdditionalInfoSection(additionalInfoSections, "CONS");

  const bgUrl = resolveCoreMediaUrl(data.mainMedia, "tablet");
  const bgUrlHi = resolveCoreMediaUrl(data.mainMedia, { w: 3840 });

  return (
    <div
      className="relative overflow-hidden w-full flex flex-col items-center sm:px-0 px-[18px] lg:py-0 py-[48px] justify-between lg:h-[1872px] 3xl:h-[calc(100vw_-_5rem)] sm:h-[950px] bg-cover bg-no-repeat bg-top "
      style={{ backgroundImage: `url(${bgUrl})` }}
    >
      <div
        className="hidden 3xl:block absolute inset-0 z-0 bg-cover bg-no-repeat bg-top"
        style={{ backgroundImage: `url(${bgUrlHi})` }}
      />
      <div className="relative z-10 lg:px-[10px] lg:max-w-[1557px] 3xl:max-w-[3200px] sm:max-w-[490px] lg:mt-[197px] 3xl:mt-[280px] w-full flex flex-col justify-center items-center border-t border-t-primary-alt">
        <div className="w-full flex flex-col lg:flex-row lg:items-center justify-between gap-y-4 gap-x-12 3xl:gap-x-20 mb-14 3xl:mb-20 mt-14 3xl:mt-20">
          <h3
            className="text-[38px] sm:text-[58px] lg:text-[120px] 3xl:text-[160px]
                        leading-[48px] sm:leading-[60px] lg:leading-[120px] 3xl:leading-[160px]
                        text-white font-recklessRegular uppercase"
          >
            {title}
          </h3>
          <CustomLink
            to={"/types-of-tents"}
            className="flex items-center justify-center tracking-[5px] hover:tracking-[8px] transform transition-all duration-300 border border-white h-[45px] 3xl:h-[80px] lg:w-[292px] 3xl:w-[440px] w-full text-white uppercase text-[12px] 3xl:text-[20px] font-haasRegular"
          >
            see gallery
          </CustomLink>
        </div>

        <div
          className={`w-full py-[16px] 3xl:py-[28px] flex lg:flex-row flex-col lg:border-b border-t border-t-primary-alt ${!info && !pros && !cons ? "lg:border-b-0" : ""}`}
        >
          {[info, pros, cons].filter(Boolean).map((item, index) => (
            <div
              key={index}
              className="lg:w-1/2 flex flex-col gap-y-[24px] 3xl:gap-y-[40px] lg:mb-0 mb-[16px] border-b border-b-primary-alt lg:border-0 pb-4 3xl:pb-8"
            >
              <div className="text-[16px] 3xl:text-[24px] leading-[25px] 3xl:leading-[34px] text-white font-haasRegular uppercase [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mb-1 3xl:[&_strong]:text-[26px] 3xl:[&_b]:text-[26px]">
                {item}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BannerStructures;
