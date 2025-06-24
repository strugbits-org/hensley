import React from 'react';
import SectionTitle from '../common/SectionTitle';
import { PrimaryButton } from '../common/PrimaryButton';
import { CustomLink } from '../common/CustomLink';

const jobs = [
  {
    title: 'Event Manager',
    location: 'Brisbane, CA',
    type: 'Full time',
    pay: '$65,000 - $75,000 a year'
  },
  {
    title: 'Marketing Specialist',
    location: 'Austin, TX',
    type: 'Part time',
    pay: '$40,000 - $50,000 a year'
  },
  {
    title: 'Software Engineer',
    location: 'Remote',
    type: 'Full time',
    pay: '$90,000 - $120,000 a year'
  }
];

const JobBoard = ({ data, jobs }) => {

  const { title, buttonLabel } = data

  return (
    <>
      {
        (jobs && jobs.length > 0) && <div className='min-h-screen w-full border py-[20px] flex justify-center items-center px-[20px]'>
          <div className='lg:w-[1557px] sm:w-full'>
            <div className='w-full lg:text-left text-center mb-[40px]'>
              <span className='font-recklessRegular text-[60px] text-secondary-alt uppercase'>jobs board</span>
            </div>

            {jobs.map((job, index) => (
              <div key={index} className='w-full grid 
            sm:grid-cols-[minmax(100px,474px)_auto_minmax(100px,300px)]
            grid-cols-[120px_auto]
            lg:gap-y-0
            gap-y-[10px]
            border-t items-start pt-[24px] pb-[24px]'>

                {/* Left Column */}
                <span className='font-haasBold lg:text-[30px] sm:text-[14px] row-span-2 uppercase lg:pr-0 pr-[10px]'>
                  {job.title}
                </span>

                {/* Middle Column */}
                <div className='grid 
              lg:grid-cols-[minmax(50px,150px)_max-content]
              lg:pr-[15px]
              sm:gap-x-[10px]
              sm:grid-cols-[minmax(50px,150px)_300px]
              grid-cols-[minmax(50px,150px)_max-content]
              items-start gap-y-[6px]'>

                  <span className='text-[14px] font-haasLight text-secondary-alt uppercase'>Local</span>
                  <span className='lg:text-[24px] sm:text-[14px] leading-[1.1] font-haasLight text-secondary-alt uppercase'>{job.location}</span>

                  <span className='text-[14px] font-haasLight text-secondary-alt uppercase'>Job type</span>
                  <span className='lg:text-[24px] sm:text-[14px] leading-[1.1] font-haasLight text-secondary-alt uppercase'>{job.jobType}</span>

                  <span className='text-[14px] font-haasLight text-secondary-alt uppercase'>Pay</span>
                  <span className='lg:text-[24px] sm:text-[14px] leading-[1.1] font-haasBold text-secondary-alt uppercase'>{job.pay}</span>
                </div>

                {/* Right Column */}
                <div className='sm:col-span-1 w-full justify-self-end'>
                  {/* <button className="border border-secondary-alt 
                h-[60px] lg:max-w-[280px] w-full
                font-haasRegular text-secondary-alt text-[14px] uppercase tracking-wider">
                Apply Now
              </button> */}
                  <CustomLink to={data.url}>
                    <PrimaryButton
                      className="border border-black text-secondary-alt hover:bg-primary hover:border-secondary-alt 
                           !h-[60px] lg:!max-w-[280px] !w-full !min-w-min !px-[0] !py-[0]
                        hover:[letter-spacing:4px]"
                    >
                      Apply Now
                    </PrimaryButton>
                  </CustomLink>
                </div>
              </div>
            ))}
          </div>

        </div>}



      <div className='flex flex-col gap-x-[48px] 
       sm:pt-[175px] sm:pb-[223px]
       justify-center
       items-center
       pt-[50px] pb-[113px]
       '>
        <SectionTitle text={title} classes={"lg:!text-[140px] lg:!leading-[140px] sm:!text-[55px] sm:!leading-[50px] !leading-[35px] border-none"} />
        <div className='w-full text-center '>
          <button className='group sm:w-[656px] w-[95%] relative bg-primary lg:h-[130px] h-[90px] lg:mt-[85px] sm:mt-[61px] mt-[40px] group transition-all duration-300 hover:bg-secondary-alt'>
            <span className='font-haasLight uppercase text-[16px] hover:border-secondary-alt  group-hover:[letter-spacing:8px]
                        transition-all duration-300
                        tracking-[5px] group-hover:font-haasBold
                        group-hover:text-primary
                        '>
              {buttonLabel}
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="19.877"
              height="19.67"
              viewBox="0 0 19.877 19.67"
              className='ml-2 transition-all duration-300 stroke-secondary-alt  group-hover:stroke-primary absolute right-[5%] top-1/2 -translate-y-1/2'
            >
              <g transform="translate(9.835 0.5) rotate(45)">
                <path
                  d="M0,0H13.2V13.2"
                  fill="none"
                  strokeMiterlimit="10"
                  strokeWidth="1"
                />
                <line
                  x1="13.202"
                  y2="13.202"
                  fill="none"
                  strokeMiterlimit="10"
                  strokeWidth="1"
                />
              </g>
            </svg>
          </button>
        </div>
      </div>
    </>
  );
};

export default JobBoard;
