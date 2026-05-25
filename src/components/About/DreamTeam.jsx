'use client'
import React, { useState } from 'react';
import { PrimaryButton } from '../common/PrimaryButton';
import SectionTitle from "../common/SectionTitle";
import { PrimaryImage } from '../common/PrimaryImage';

function DreamTeam({ dreamTeamData = [], pageTitle }) {  
  const pageSize = dreamTeamData.length;
  const [pageLimit, setPageLimit] = useState(pageSize);
  const handleLoadMore = () => setPageLimit((prev) => prev + pageSize);;

  return (
    <>
      <div className='py-[20px]'>
        <SectionTitle text={pageTitle} classes="border-t border-b border-primary-border text-[55px] pt-[40px] pb-[40px]" />
        <div className="min-h-screen flex flex-col items-center justify-center lg:pb-[130px] sm:pb-[140px] pb-[131px] border border-primary-border">
          <div className="flex flex-wrap px-4 mb-[30px] justify-center">
            {dreamTeamData.slice(0, pageLimit).map((dt, index) => (
              <div key={index} className="w-1/2 lg:w-1/4 mt-8 3xl:mt-12">
                <div className='flex flex-col gap-2 3xl:gap-4 px-3 3xl:px-5'>
                  <div className="w-full aspect-[3/4] overflow-hidden">
                    <PrimaryImage
                      timeout={0}
                      url={dt.photo || dt.image}
                      size="card"
                      customClasses="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="uppercase font-recklessLight text-secondary-alt text-[20px] md:text-[25px] lg:text-[32px] lg:leading-[35px] 3xl:text-[52px] 3xl:leading-[56px] leading-[20px] mt-[12px] 3xl:mt-[20px]">
                      {dt.name}
                    </h3>
                    <p className="uppercase font-haasRegular text-[12px] md:text-[12px] lg:text-[16px] 3xl:text-[24px] leading-[20px] 3xl:leading-[30px] text-secondary-alt lg:mt-[6px] 3xl:mt-[10px] mt-[3px]">
                      {dt.jobTitle || dt.title || ""}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {pageLimit < dreamTeamData.length && (
            <PrimaryButton
              onClick={handleLoadMore}
              className="border border-secondary-alt text-secondary-alt hover:bg-primary hover:text-secondary-alt max-h-[60px] 3xl:max-h-[90px] max-w-[280px] 3xl:max-w-[420px] px-8 py-4 3xl:px-12 3xl:py-6 3xl:text-xl hover:[letter-spacing:4px] lg:mt-[83px] sm:mt-[42px] mt-[44px] 3xl:mt-[120px]"
            >
              load more
            </PrimaryButton>
          )}
        </div>
      </div>
    </>
  );
}

export default DreamTeam;
