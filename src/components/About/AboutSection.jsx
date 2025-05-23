import React from "react";

function AboutSection() {
  const data = {
    title:
      "EVENTS ARE CRUCIAL FOR ENHANCING BRAND AWARENESS, OFFERING EXCLUSIVE CHANCES TO SHOWCASE IDEAS, PRODUCTS, AND SERVICES INTIMATELY.",
    description: `ALIQUAM SIT AMET TELLUS FERMENTUM, SEMPER ORCI FINIBUS, ULTRICES ORCI.
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
TURPIS EGESTAS.`,
  };

  return (
    <div className="flex justify-center items-center px-4 lg:min-h-screen lg:py-0 py-[60px] border">
      <div className="w-full">
        {/* Future Conditional Section (e.g., wedding/social) */}
        {/* <p className="...">...</p> */}

        <h1
          className="text-secondary-alt font-recklessRegular text-2xl
          lg:text-[60px]
          lg:leading-[55px]
          sm:text-[25px]
          sm:leading-[33px]
          text-[35px]
          leading-[30px]
          max-w-7xl mt-4 mb-6 text-center sm:text-left lg:text-left"
        >
          {data.title}
        </h1>

        <p
          className="text-secondary-alt font-haasRegular text-sm 
          md:text-base 
          lg:text-[16px] lg:leading-[20px] 
          sm:mt-[40px]
          mt-[10px]
          text-[14px] leading-[18px]
          max-w-7xl text-center lg:text-left sm:text-left"
        >
          {data.description}
        </p>
      </div>
    </div>
  );
}

export default AboutSection;
