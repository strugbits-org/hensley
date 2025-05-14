import React from "react";

function SectionTitle({ text, classes }) {
  return (
    <h1
      className={`uppercase text-secondary-alt font-recklessRegular text-4xl 
          md:text-[65px]
          lg:text-[160px]
          xl:text-[200px]
          md:leading-[50px] 
          lg:leading-[160px]
          text-center
          tracking-wide lg:pt-[30px] lg:pb-[30px] sm:border ${classes}`}
    >
      {text}
    </h1>
  );
}

export default SectionTitle;
