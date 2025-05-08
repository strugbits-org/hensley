import React from "react";

function SectionTitle({ text, classes }) {
  return (
    <div
      className={`w-full flex items-center justify-center lg:pt-30px lg:pb-30px sm:border ${classes}`}
    >
      <h1
        className="w-[286px] uppercase text-[#2C2216] font-recklessRegular text-4xl 
    md:text-[65px]
    md:leading-[50px] 
    lg:text-[200px]
    lg:leading-[160px]
     lg:text-left
     sm:w-max
     text-[55px]
     text-center
      leading-tight tracking-wide "
      >
        {text}
      </h1>
    </div>
  );
}

export default SectionTitle;
