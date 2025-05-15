import React from 'react'

const JobBoard = () => {
    return (
        <div className='min-h-screen w-full border-t border-b flex justify-center items-center'>
           <div className="w-full min-h-screen px-8 py-16">
 

  <div className="space-y-10 lg:max-w-[1557px] sm:w-full mx-auto">
           <h2 className="text-[40px] 
           uppercase
  col-span-3
  font-recklessMedium mb-12 text-secondary-alt">Jobs Board</h2>
    {Array(7).fill().map((_, idx) => (
      <div
        key={idx}
        className="grid grid-cols-3 items-start border-t border-b py-8 gap-x-8"
      >
        {/* Column 1 - Job Title */}

        <div className="text-[22px] font-haasBold text-secondary-alt uppercase">
          Event Manager
        </div>

        {/* Column 2 - Details */}
        <div className="grid grid-cols-2 gap-y-2 text-[14px] text-secondary-alt font-haasRegular">
          <div className="uppercase">Local</div>
          <div className='text-[25px]'>Brisbane, CA</div>

          <div className="uppercase">Job Type</div>
          <div className='text-[25px]'>Full-time</div>

          <div className="uppercase">Pay</div>
          <div className="font-haasBold text-[25px]">$65,000 - $75,000 A Year</div>
        </div>

        {/* Column 3 - Apply Button */}
        <div className="flex justify-end sm:col-span-1 col-span-2">
          <button className="border border-secondary-alt h-[60px] w-[280px] font-haasRegular text-secondary-alt text-[14px] uppercase tracking-wider">
            Apply Now
          </button>
        </div>
      </div>
    ))}
  </div>
</div>

        </div>

    )
}

export default JobBoard