import React from 'react';
import SectionTitle from '../common/SectionTitle';
import TentTypesSlider from './TentTypesSlider';
import { resolveCoreMediaUrl } from '@/utils';

const TentsTypes = ({ data }) => {
    return (
        <>
            <SectionTitle text="types of tents" classes="py-[40px] 3xl:!py-[56px] 3xl:!text-[280px] 3xl:!leading-[230px] md:mt-6 lg:mt-0 border-t border-b" />
            <div className='lg:grid hidden w-full grid-cols-3 gap-x-[24px] 3xl:gap-x-[40px] px-[24px] 3xl:px-[40px] py-[31px] 3xl:py-[48px]'>
                {data.map((item, index) => {
                    const { tent } = item;
                    const imageURL = resolveCoreMediaUrl(tent?.mainMedia, "card");

                    const tentSlug = (tent?.slug || "").replace(/^\//, "");

                    return (
                        <div
                            key={index}
                            className="max-w-[608px] 3xl:max-w-[1000px] h-[687px] 3xl:h-[1040px] px-[24px] py-[24px] 3xl:px-[36px] 3xl:py-[36px] border relative"
                        >
                            <div
                                className='h-full w-full border xl:px-[54px] lg:px-[30px] 3xl:px-[80px] py-[35px] 3xl:py-[52px] flex flex-col justify-between items-center bg-cover bg-no-repeat bg-center'
                                style={{ backgroundImage: `url(${imageURL})` }}
                            >
                                <div className='border-b border-white pb-[17px] 3xl:pb-[26px] w-full'>
                                    <h3 className='w-full break-words 
                                        xl:text-[70px] 
                                        xl:leading-[55px]
                                        lg:text-[40px]
                                        lg:leading-[35px]
                                        3xl:text-[100px]
                                        3xl:leading-[88px]
                                        text-white font-recklessRegular uppercase'
                                    >
                                        {tent?.name}
                                    </h3>
                                </div>
                                <a href={`#${tentSlug}`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="120.423" height="120.676" viewBox="0 0 120.423 120.676" className="3xl:w-[170px] 3xl:h-[170px]">
                                        <g id="Group_3704" data-name="Group 3704" transform="translate(120.256 60.545) rotate(135)">
                                            <g id="Group_2072" data-name="Group 2072" transform="translate(0 0.117)">
                                                <path id="Path_3283" data-name="Path 3283" d="M.354.5H84.221V84.368" transform="translate(-0.066 -0.501)" fill="none" stroke="#f4f1ec" strokeMiterlimit="10" strokeWidth="1" />
                                                <line id="Line_13" data-name="Line 13" x1="84.445" y2="84.445" transform="translate(0 0.355)" fill="none" stroke="#f4f1ec" strokeMiterlimit="10" strokeWidth="1" />
                                                <line id="Line_14" data-name="Line 14" x1="84.445" y2="84.445" transform="translate(0 0.355)" fill="none" stroke="#f4f1ec" strokeMiterlimit="10" strokeWidth="1" />
                                            </g>
                                        </g>
                                    </svg>
                                </a>
                            </div>
                        </div>
                    );
                })}
            </div>
            <TentTypesSlider data={data} />
        </>
    );
};

export default TentsTypes;
