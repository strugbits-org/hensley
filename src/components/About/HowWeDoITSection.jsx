import React from "react";
import PortfolioSlider from "../common/PortfolioSlider";
import SectionTitle from "../common/SectionTitle";

function HowWeDoITSection({ data, pageTitle }) {
  return (
    <>
      <SectionTitle
        text={pageTitle}
        classes={
          "md:bg-primary lg:bg-primary-alt bg-primary pt-[36px] pb-[44px] 3xl:pt-[52px] 3xl:pb-[64px] 3xl:!text-[280px] 3xl:!leading-[230px] hidden lg:block"
        }
      />
      <div className="flex flex-col ">
        <div className="bg-primary pb-11 3xl:min-h-[1500px] max-3xl:min-h-screen relative">
          <PortfolioSlider data={data} />
        </div>
      </div>
    </>
  );
}

export default HowWeDoITSection;
