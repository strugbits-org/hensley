import { convertToHTML } from "@/utils/renderRichText";
import React from "react";

function AboutSection({richcontent}) {
  
  return (
    <div className="flex items-center lg:px-[182px] sm:px-[138px] px-4 lg:min-h-screen lg:py-0 py-[60px] border border-primary-border">
      <div className="lg:max-w-[1082px] w-full">

        {convertToHTML({content:richcontent, class_p:'text-secondary-alt font-haasRegular text-sm md:text-base lg:text-[16px] lg:leading-[20px] sm:mt-[40px] mt-[10px] text-[14px] leading-[18px] max-w-7xl text-center lg:text-left sm:text-left',class_heading:"text-secondary-alt font-recklessRegular text-2xl lg:text-[60px] lg:leading-[55px] sm:text-[25px] sm:leading-[33px] text-[35px] leading-[30px] max-w-7xl mt-4 mb-6 text-center sm:text-left lg:text-left"})}

      </div>
    </div>
  );
}

export default AboutSection;
