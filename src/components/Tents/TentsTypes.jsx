// import React from 'react'
// import SectionTitle from '../common/SectionTitle'
// import Image from 'next/image'
// import image from '@/assets/tent-page-1.png'
// import TentTypesSlider from './TentTypesSlider'

// const TentsTypes = () => {
//     return (
//         <>
//             <SectionTitle text="types of tents" classes="py-[40px] md:mt-6 lg:mt-0 border-t border-b" />
//             <div className='lg:grid hidden w-full  grid-cols-3 gap-x-[24px] px-[24px] py-[31px]'>
//                 <div
//                     className="max-w-[608px] h-[687px] px-[24px] py-[24px] border relative bg-cover bg-center"

//                 >
//                     <div className='h-full w-full border xl:px-[54px] lg:px-[30px] py-[35px] flex flex-col justify-between items-center' style={{ backgroundImage: `url(${image.src})` }}>
//                         <div className='border-b border-white pb-[17px] w-full'>
//                             <h3 className='w-full break-words 
//                             xl:text-[70px] 
//                             xl:leading-[55px]
//                             lg:text-[40px]
//                             lg:leading-[35px]
//                             text-white font-recklessRegular uppercase'>structures</h3>
//                         </div>
//                         <svg xmlns="http://www.w3.org/2000/svg" width="120.423" height="120.676" viewBox="0 0 120.423 120.676">
//                             <g id="Group_3704" data-name="Group 3704" transform="translate(120.256 60.545) rotate(135)">
//                                 <g id="Group_2072" data-name="Group 2072" transform="translate(0 0.117)">
//                                     <path id="Path_3283" data-name="Path 3283" d="M.354.5H84.221V84.368" transform="translate(-0.066 -0.501)" fill="none" stroke="#f4f1ec" strokeMiterlimit="10" strokeWidth="1" />
//                                     <line id="Line_13" data-name="Line 13" x1="84.445" y2="84.445" transform="translate(0 0.355)" fill="none" stroke="#f4f1ec" strokeMiterlimit="10" strokeWidth="1" />
//                                     <line id="Line_14" data-name="Line 14" x1="84.445" y2="84.445" transform="translate(0 0.355)" fill="none" stroke="#f4f1ec" strokeMiterlimit="10" strokeWidth="1" />
//                                 </g>
//                             </g>
//                         </svg>

//                     </div>
//                 </div>

//                 <div
//                     className="max-w-[608px] h-[687px] px-[24px] py-[24px] border relative bg-cover bg-center"

//                 >
//                     <div className='h-full w-full border xl:px-[54px] lg:px-[30px] py-[35px] flex flex-col justify-between items-center' style={{ backgroundImage: `url(${image.src})` }}>
//                         <div className='border-b border-white pb-[17px] w-full'>
//                             <h3 className='w-full break-words 
//                             xl:text-[70px] 
//                             xl:leading-[55px]
//                             lg:text-[40px]
//                             lg:leading-[35px]
//                             text-white font-recklessRegular uppercase'>TENSION
//                                 TENTS</h3>
//                         </div>
//                         <svg xmlns="http://www.w3.org/2000/svg" width="120.423" height="120.676" viewBox="0 0 120.423 120.676">
//                             <g id="Group_3704" data-name="Group 3704" transform="translate(120.256 60.545) rotate(135)">
//                                 <g id="Group_2072" data-name="Group 2072" transform="translate(0 0.117)">
//                                     <path id="Path_3283" data-name="Path 3283" d="M.354.5H84.221V84.368" transform="translate(-0.066 -0.501)" fill="none" stroke="#f4f1ec" strokeMiterlimit="10" strokeWidth="1" />
//                                     <line id="Line_13" data-name="Line 13" x1="84.445" y2="84.445" transform="translate(0 0.355)" fill="none" stroke="#f4f1ec" strokeMiterlimit="10" strokeWidth="1" />
//                                     <line id="Line_14" data-name="Line 14" x1="84.445" y2="84.445" transform="translate(0 0.355)" fill="none" stroke="#f4f1ec" strokeMiterlimit="10" strokeWidth="1" />
//                                 </g>
//                             </g>
//                         </svg>

//                     </div>
//                 </div>

//                 <div
//                     className="max-w-[608px] h-[687px] px-[24px] py-[24px] border relative bg-cover bg-center"

//                 >
//                     <div className='h-full w-full border xl:px-[54px] lg:px-[30px] py-[35px] flex flex-col justify-between items-center' style={{ backgroundImage: `url(${image.src})` }}>
//                         <div className='border-b border-white pb-[17px] w-full'>
//                             <h3 className='w-full break-words 
//                             xl:text-[70px] 
//                             xl:leading-[55px]
//                             lg:text-[40px]
//                             lg:leading-[35px]
//                             text-white font-recklessRegular uppercase'>FRAME
//                                 TENTS</h3>
//                         </div>
//                         <svg xmlns="http://www.w3.org/2000/svg" width="120.423" height="120.676" viewBox="0 0 120.423 120.676">
//                             <g id="Group_3704" data-name="Group 3704" transform="translate(120.256 60.545) rotate(135)">
//                                 <g id="Group_2072" data-name="Group 2072" transform="translate(0 0.117)">
//                                     <path id="Path_3283" data-name="Path 3283" d="M.354.5H84.221V84.368" transform="translate(-0.066 -0.501)" fill="none" stroke="#f4f1ec" strokeMiterlimit="10" strokeWidth="1" />
//                                     <line id="Line_13" data-name="Line 13" x1="84.445" y2="84.445" transform="translate(0 0.355)" fill="none" stroke="#f4f1ec" strokeMiterlimit="10" strokeWidth="1" />
//                                     <line id="Line_14" data-name="Line 14" x1="84.445" y2="84.445" transform="translate(0 0.355)" fill="none" stroke="#f4f1ec" strokeMiterlimit="10" strokeWidth="1" />
//                                 </g>
//                             </g>
//                         </svg>

//                     </div>
//                 </div>

//             </div>
//             <TentTypesSlider />
//         </>
//     )
// }

// export default TentsTypes








// import React from 'react'
// import Image from 'next/image'
// import SectionTitle from '../common/SectionTitle'
// import { PrimaryImage } from '../common/PrimaryImage'
// import { getAdditionalInfoSection } from '@/utils'
// import { CustomLink } from '../common/CustomLink'


// const TentCards = ({ data }) => {
//     const { tent } = data;
//     const info = (tent?.additionalInfoSections && getAdditionalInfoSection(tent.additionalInfoSections, "INFO")) || '';


//     return (
//         <CustomLink to={`/tent/${tent.slug}`} className="group p-[24px] h-[973px] border overflow-hidden ">
//             <div className="w-full border h-full flex lg:flex-col lg:justify-between justify-center sm:px-[50px] px-[20px] lg:py-[24px] py-[44px] relative">
//                 <PrimaryImage url={tent?.mainMedia} alt={tent?.name} customClasses="absolute top-0 left-0 w-full h-full object-cover" />
//                 <div className='z-10 w-full'>
//                     <span className='
//                             text-white
//                             text-[70px]
//                             leading-[55px]
//                             uppercase
//                             font-recklessRegular
//                             w-full break-words
//                             '>{tent?.name}</span>
//                     <div className='mt-[21px] flex flex-col gap-y-[10px] border-t border-b border-white py-7 text-[16px] leading-[25px] text-white font-haasRegular uppercase'>
//                         {info}
//                     </div>
//                 </div>
//                 <Image
//                     className='z-10 self-start lg:block hidden group-hover:w-[400px] group-hover:h-[400px] transition-all duration-300 ease-in-out'
//                     height={34}
//                     width={34}
//                     src={"https://static.wixstatic.com/shapes/0e0ac5_7f17be7b63744aaf83be995827c7ff34.svg"}
//                 />

//             </div>
//         </CustomLink>
//     )
// }

// const TentTypes = ({ data }) => {
//     return (
//         <div className='lg:px-[24px] px-[12px] w-full h-full'>
//             <SectionTitle text="TENTS OF TYPE" classes="lg:py-[40px] py-[14px] lg:!text-[45px] lg:!leading-[70PX] !text-[35px] !leading-[50px]" />
//             <div className='w-full h-full grid lg:grid-cols-3 sm:grid-cols-1 gap-x-[24px] lg:gap-y-[20px] gap-y-[13px]'>
//                 {data.map((item, index) => (
//                     <TentCards key={index} data={item} />
//                 ))}
//             </div>
//         </div>
//     )
// }

// export default TentTypes



import React from 'react';
import SectionTitle from '../common/SectionTitle';
import Image from 'next/image';
import TentTypesSlider from './TentTypesSlider';
import { generateImageURL } from '@/utils/generateImageURL';

const TentsTypes = ({ data }) => {
    return (
        <>
            <SectionTitle text="types of tents" classes="py-[40px] md:mt-6 lg:mt-0 border-t border-b" />
            <div className='lg:grid hidden w-full grid-cols-3 gap-x-[24px] px-[24px] py-[31px]'>
                {data.map((item, index) => {
                    const { tent } = item;
                    const imageURL = generateImageURL({ wix_url: tent?.mainMedia });

                    return (
                        <div
                            key={index}
                            className="max-w-[608px] h-[687px] px-[24px] py-[24px] border relative bg-cover bg-center"
                        >
                            <div
                                className='h-full w-full border xl:px-[54px] lg:px-[30px] py-[35px] flex flex-col justify-between items-center'
                                style={{ backgroundImage: `url(${imageURL})` }}
                            >
                                <div className='border-b border-white pb-[17px] w-full'>
                                    <h3 className='w-full break-words 
                                        xl:text-[70px] 
                                        xl:leading-[55px]
                                        lg:text-[40px]
                                        lg:leading-[35px]
                                        text-white font-recklessRegular uppercase'
                                    >
                                        {tent?.name}
                                    </h3>
                                </div>
                                <svg xmlns="http://www.w3.org/2000/svg" width="120.423" height="120.676" viewBox="0 0 120.423 120.676">
                                    <g id="Group_3704" data-name="Group 3704" transform="translate(120.256 60.545) rotate(135)">
                                        <g id="Group_2072" data-name="Group 2072" transform="translate(0 0.117)">
                                            <path id="Path_3283" data-name="Path 3283" d="M.354.5H84.221V84.368" transform="translate(-0.066 -0.501)" fill="none" stroke="#f4f1ec" strokeMiterlimit="10" strokeWidth="1" />
                                            <line id="Line_13" data-name="Line 13" x1="84.445" y2="84.445" transform="translate(0 0.355)" fill="none" stroke="#f4f1ec" strokeMiterlimit="10" strokeWidth="1" />
                                            <line id="Line_14" data-name="Line 14" x1="84.445" y2="84.445" transform="translate(0 0.355)" fill="none" stroke="#f4f1ec" strokeMiterlimit="10" strokeWidth="1" />
                                        </g>
                                    </g>
                                </svg>
                            </div>
                        </div>
                    );
                })}
            </div>
            <TentTypesSlider data={data}/>
        </>
    );
};

export default TentsTypes;
