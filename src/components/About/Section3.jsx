import React from "react";
import CartSlider from "../common/CartSlider";

function Section3() {
  return (
    <div className="flex flex-col border border-black">
      <div className="w-full flex items-center justify-center min-h-[200px] ">
        <h1 className="text-[#2C2216] font-recklessRegular text-4xl md:text-[100px] xl:text-[150px] 2xl:text-[200px] leading-tight tracking-tight">
          HOW WE DO IT
        </h1>
      </div>
      <div className="bg-[#F0DEA2] pb-11">
        <CartSlider />
      </div>
    </div>
  );
}

export default Section3;
