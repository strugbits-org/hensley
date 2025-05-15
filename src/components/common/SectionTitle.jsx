import React from "react";

function SectionTitle({ text, classes }) {
  return (
    <h1
      className={`w-full uppercase text-secondary-alt font-recklessRegular text-4xl 
          md:text-[65px]
          lg:text-[160px]
          xl:text-[200px]
          md:leading-[50px] 
          lg:leading-[160px]
          text-center
          leading-[50px]
          tracking-wide
          ${classes}`}
    >
      {text}
    </h1>
  );
}

export default SectionTitle;
