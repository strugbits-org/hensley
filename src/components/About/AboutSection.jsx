// import React from "react";

// function AboutSection() {
//   return (
//     <div className="flex justify-center items-center px-4 lg:min-h-screen lg:py-0 py-[60px] border">
//       <div
//         className="lg:w-full lg:max-w-[1556px] w-[492px]
//       "
//       >
//         {/* for the being time commented not concern */}
//         {/* <p className="hidden sm:hidden lg:block uppercase font-haasRegular text-sm md:text-base mb-2 lg:text-left sm:text-left text-center">
//           wedding
//         </p>
//         <p className="sm:hidden block uppercase font-haasRegular text-sm md:text-base mb-2 lg:text-left sm:text-left text-center">
//           Social
//         </p> */}

//         <h1
//           className="text-[#2C2216] font-recklessRegular text-2xl
//          sm:text-[25px]
//          lg:text-5xl
//          md:leading-[23px]
//          text-[35px]
//          leading-[30px]
//          mt-4 mb-6 max-w-4xl text-center sm:text-left lg:text-left"
//         >
//           EVENTS ARE CRUCIAL FOR ENHANCING BRAND AWARENESS, OFFERING EXCLUSIVE
//           CHANCES TO SHOWCASE IDEAS, PRODUCTS, AND SERVICES INTIMATELY.
//         </h1>

//         <p
//           className="text-[#2C2216] font-haasRegular text-sm
//         md:text-base
//          lg:text-[16px] lg:leading-[20px]
//          text-[14px] leading-[18px]
//          max-w-3xl text-center lg:text-left sm:text-left

//         "
//         >
//           ALIQUAM SIT AMET TELLUS FERMENTUM, SEMPER ORCI FINIBUS, ULTRICES ORCI.
//           MAECENAS FAUCIBUS FEUGIAT TINCIDUNT. PELLENTESQUE NON LEO CONGUE,
//           DICTUM MAGNA AC, LAOREET ERAT. NUNC VENENATIS TRISTIQUE ENIM, ET
//           FINIBUS FELIS ULTRICIES A. SUSPENDISSE AC VIVERRA ORCI, ET CONSEQUAT
//           DOLOR. FUSCE CONVALLIS EST EU FELIS VENENATIS, AT VIVERRA EST SEMPER.
//           PROIN ULTRICIES FELIS NEC ARCU VESTIBULUM, NON CURSUS DUI MOLLIS.
//           NULLAM RISUS DIAM, VOLUTPAT NON CURSUS EU, PRETIUM VEL ORCI. ORCI
//           VARIUS NATOQUE PENATIBUS ET MAGNIS DIS PARTURIENT MONTES, NASCETUR
//           RIDICULUS MUS. ALIQUAM ALIQUAM, LECTUS AT VESTIBULUM TINCIDUNT, ENIM
//           SEM VESTIBULUM ERAT, ET FEUGIAT VELIT EROS VITAE URNA. PELLENTESQUE
//           HABITANT MORBI TRISTIQUE SENECTUS ET NETUS ET MALESUADA FAMES AC
//           TURPIS EGESTAS.
//         </p>
//       </div>
//     </div>
//   );
// }

// export default AboutSection;

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
      <div className="lg:w-full lg:max-w-[1556px] w-[492px]">
        {/* Future Conditional Section (e.g., wedding/social) */}
        {/* <p className="...">...</p> */}

        <h1
          className="text-[#2C2216] font-recklessRegular text-2xl
          sm:text-[25px] 
          lg:text-5xl 
          md:leading-[23px] 
          text-[35px]
          leading-[30px]
          mt-4 mb-6 max-w-4xl text-center sm:text-left lg:text-left"
        >
          {data.title}
        </h1>

        <p
          className="text-[#2C2216] font-haasRegular text-sm 
          md:text-base 
          lg:text-[16px] lg:leading-[20px] 
          text-[14px] leading-[18px]
          max-w-3xl text-center lg:text-left sm:text-left"
        >
          {data.description}
        </p>
      </div>
    </div>
  );
}

export default AboutSection;
