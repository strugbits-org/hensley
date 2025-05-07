import React from "react";

function AboutSection() {
  return (
    <div className="flex justify-center items-center px-4 lg:min-h-screen lg:py-0 py-[60px] border">
      <div className="lg:w-full lg:max-w-[1556px] w-[492px] 
      ">
        <p className="hidden sm:hidden lg:block uppercase font-haasRegular text-sm md:text-base mb-2 lg:text-left sm:text-left text-center">
          wedding
        </p>
        <p className="sm:hidden block uppercase font-haasRegular text-sm md:text-base mb-2 lg:text-left sm:text-left text-center">
          Social
        </p>

        <h1 className="text-[#2C2216] font-recklessRegular text-2xl
         md:text-[25px] 
         lg:text-5xl 
        text-[35px]
        leading-[30px]
         md:leading-[23px] 
         mt-4 mb-6 max-w-4xl text-center sm:text-left lg:text-left">
          EVENTS ARE CRUCIAL FOR ENHANCING BRAND AWARENESS, OFFERING EXCLUSIVE
          CHANCES TO SHOWCASE IDEAS, PRODUCTS, AND SERVICES INTIMATELY.
        </h1>

        <p className="text-[#2C2216] font-haasRegular text-sm 
        md:text-base 
         lg:text-[16px] lg:leading-[20px] 
         md:text-[14px] md:leading-[18px] 
         text-[14px] leading-[18px]
         max-w-3xl text-center lg:text-left sm:text-left
        
        ">
          ALIQUAM SIT AMET TELLUS FERMENTUM, SEMPER ORCI FINIBUS, ULTRICES ORCI.
          MAECENAS FAUCIBUS FEUGIAT TINCIDUNT. PELLENTESQUE NON LEO CONGUE,
          DICTUM MAGNA AC, LAOREET ERAT. NUNC VENENATIS TRISTIQUE ENIM, ET
          FINIBUS FELIS ULTRICIES A. SUSPENDISSE AC VIVERRA ORCI, ET CONSEQUAT
          DOLOR. FUSCE CONVALLIS EST EU FELIS VENENATIS, AT VIVERRA EST SEMPER.
          PROIN ULTRICIES FELIS NEC ARCU VESTIBULUM, NON CURSUS DUI MOLLIS.
          NULLAM RISUS DIAM, VOLUTPAT NON CURSUS EU, PRETIUM VEL ORCI. ORCI
          VARIUS NATOQUE PENATIBUS ET MAGNIS DIS PARTURIENT MONTES, NASCETUR
          RIDICULUS MUS. ALIQUAM ALIQUAM, LECTUS AT VESTIBULUM TINCIDUNT, ENIM
          SEM VESTIBULUM ERAT, ET FEUGIAT VELIT EROS VITAE URNA. PELLENTESQUE
          HABITANT MORBI TRISTIQUE SENECTUS ET NETUS ET MALESUADA FAMES AC
          TURPIS EGESTAS.
        </p>
      </div>
    </div>
  );
}

export default AboutSection;