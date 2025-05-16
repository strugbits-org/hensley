import React from "react";
import SectionTitle from "../common/SectionTitle";
import logo from "@/assets/testimonialLogo.png";
import Image from "next/image";
import { PrimaryButton } from "../common/PrimaryButton";

const Cards = ({ logo, paragraph1, paragraph2, buttonLabel }) => {
  return (
    <div className="lg:max-w-[608px] md:min-h-[902px] bg-[rgb(44,34,22)] flex justify-center items-center p-11">
      <div className="flex flex-col items-center justify-center">
        <Image src={logo} alt="logo" />
        <p className="max-w-[417px] text-center text-[#FFFFFF] font-haasRegular md:text-[18px] leading-[30px] sm:text-[14px] sm:leading-[18px] lg:mt-[61px] mt-[22px]">
          {paragraph1}
        </p>
        <p className="max-w-[417px] text-center text-[#FFFFFF] font-haasRegular md:text-[18px] leading-[30px] sm:text-[14px] sm:leading-[18px] lg:mt-11 mt-10 lg:mb-[48px] mb-[44px]">
          {paragraph2}
        </p>
        <PrimaryButton className="border border-white text-white hover:bg-primary hover:text-secondary-alt max-h-[60px] max-w-[280px] px-8 py-4 hover:[letter-spacing:4px]">
          {buttonLabel}
        </PrimaryButton>
      </div>
    </div>
  );
};

function MeetFamily() {
  const cardsData = [
    {
      logo,
      paragraph1:
        "VIDENT EXHIBITS IS OUR IN-HOUSE EXHIBIT STUDIO. SPECIALIZING IN THE DESIGN AND PRODUCTION OF CORPORATE EXHIBIT ENVIRONMENTS",
      paragraph2:
        "VIDENT COMBINES CUTTING-EDGE TECHNOLOGY, INGENUITY, AND CRAFTSMANSHIP TO MANUFACTURE CREATIVE, QUALITY TRADE SHOW DISPLAYS, EXHIBITS AND EMPOWERING ACTIVATIONS THAT ENABLE EXHIBITORS TO ENGAGE THEIR CUSTOMERS IN THE MOST INNOVATIVE WAYS.",
      buttonLabel: "learn more",
    },
    {
      logo,
      paragraph1:
        "VIDENT EXHIBITS IS OUR IN-HOUSE EXHIBIT STUDIO. SPECIALIZING IN THE DESIGN AND PRODUCTION OF CORPORATE EXHIBIT ENVIRONMENTS",
      paragraph2:
        "VIDENT COMBINES CUTTING-EDGE TECHNOLOGY, INGENUITY, AND CRAFTSMANSHIP TO MANUFACTURE CREATIVE, QUALITY TRADE SHOW DISPLAYS, EXHIBITS AND EMPOWERING ACTIVATIONS THAT ENABLE EXHIBITORS TO ENGAGE THEIR CUSTOMERS IN THE MOST INNOVATIVE WAYS.",
      buttonLabel: "see work",
    },
    {
      logo,
      paragraph1:
        "VIDENT EXHIBITS IS OUR IN-HOUSE EXHIBIT STUDIO. SPECIALIZING IN THE DESIGN AND PRODUCTION OF CORPORATE EXHIBIT ENVIRONMENTS",
      paragraph2:
        "VIDENT COMBINES CUTTING-EDGE TECHNOLOGY, INGENUITY, AND CRAFTSMANSHIP TO MANUFACTURE CREATIVE, QUALITY TRADE SHOW DISPLAYS, EXHIBITS AND EMPOWERING ACTIVATIONS THAT ENABLE EXHIBITORS TO ENGAGE THEIR CUSTOMERS IN THE MOST INNOVATIVE WAYS.",
      buttonLabel: "get started",
    },
  ];

  return (
    <>
     <div className="w-full">
       <SectionTitle text="meet the family" classes=" text-[55px] sm:pt-[40px] sm:pb-[40px]" />
     </div>
      <div className="w-full grid grid-cols-1 lg:grid-cols-3 xl:gap-10 lg:gap-3 lg:px-8 px-2 pt-10 pb-10 gap-0">
        {cardsData.map((card, idx) => (
          <Cards key={idx} {...card} />
        ))}
      </div>
    </>
  );
}

export default MeetFamily;
