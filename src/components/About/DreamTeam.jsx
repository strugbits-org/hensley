'use client'
import React, { useState } from 'react';
import { PrimaryButton } from '../common/PrimaryButton';
import SectionTitle from "../common/SectionTitle";
import { PrimaryImage } from '../common/PrimaryImage';

function DreamTeam({ dreamTeamData = [] }) {
  const pageSize = dreamTeamData.length;
  const [pageLimit, setPageLimit] = useState(pageSize);
  const handleLoadMore = () => {
    setPageLimit((prev) => prev + pageSize);
  };

  return (
    <>
      <SectionTitle text={dreamTeamData[0].sectionTitle} classes="text-[55px] pt-[40px] pb-[40px]" />
      <div className="min-h-screen flex flex-col items-center justify-center lg:pb-[130px] sm:pb-[140px] pb-[131px] border">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 px-4 mb-[30px] sm:w-full">
          {dreamTeamData.slice(0, pageLimit).map((dt, index) => (
            <div key={index} className="lg:max-w-[450px] sm:w-auto mt-8">
              <div className="lg:max-h-[500px] sm:h-auto border">
                <PrimaryImage
                  timeout={0}
                  url={dt.image}
                  min_h={500}
                  customClasses="h-full w-full object-cover"
                />
              </div>
              <div>
                <h3 className="uppercase font-recklessLight text-secondary-alt
                  md:text-[25px]
                  lg:text-[35px]
                  lg:leading-[35px]
                  text-[20px]
                  leading-[20px]
                  mt-[12px]">
                  {dt.name}
                </h3>
                <p className="uppercase font-haasRegular 
                  md:text-[12px]
                  lg:text-[16px]
                  text-[12px]
                  leading-[20px] text-secondary-alt lg:mt-[6px] mt-[3px]">
                  {dt.title || ""}
                </p>
              </div>
            </div>
          ))}
        </div>

        {pageLimit < dreamTeamData.length && (
          <PrimaryButton
            onClick={handleLoadMore}
            className="border border-secondary-alt text-secondary-alt hover:bg-primary hover:text-secondary-alt max-h-[60px] max-w-[280px] px-8 py-4 hover:[letter-spacing:4px] lg:mt-[83px] sm:mt-[42px] mt-[44px]"
          >
            load more
          </PrimaryButton>
        )}
      </div>
    </>
  );
}

export default DreamTeam;
