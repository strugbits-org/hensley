import React from "react";
import PortfolioSlider from "../common/PortfolioSlider";
import SectionTitle from "../common/SectionTitle";

function HowWeDoITSection() {
  return (
    <>
      <SectionTitle
        text="How we do it"
        classes={
          "md:bg-primary lg:bg-primary-alt bg-primary pt-[36px] pb-[44px] hidden lg:block"
        }
      />
      <div className="flex flex-col ">
        <div className="bg-primary pb-11 min-h-screen relative">
          <PortfolioSlider />
        </div>
      </div>
    </>
  );
}

export default HowWeDoITSection;
