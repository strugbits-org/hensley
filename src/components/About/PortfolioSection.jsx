import React from "react";
import PortfolioSlider from "../common/PortfolioSlider";
import SectionTitle from "../common/SectionTitle";

function Section3() {
  return (
    <>
      <SectionTitle
        text="How we do it"
        classes={
          "md:bg-[#F0DEA2] lg:bg-[#F4F1EC] bg-[#F0DEA2] pt-[40px] pb-[40px] hidden lg:flex"
        }
      />
      <div className="flex flex-col ">
        <div className="bg-[#F0DEA2] pb-11">
          <PortfolioSlider />
        </div>
      </div>
    </>
  );
}

export default Section3;
