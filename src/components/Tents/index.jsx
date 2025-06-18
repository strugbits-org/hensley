'use client'

import React from 'react'
import TentsTypes from './TentsTypes'
import BannerStructures from './BannerStructures'
import OurProjects from '../Collections/OurProjects'
import { DownloadButton } from './DownloadButton'
import { FeaturedProjects } from '../Product/FeaturedProjects'

const Tents = ({ data }) => {

    const { tents, projectandblog } = data

    return (
        <>
            <TentsTypes data={tents} />

            {projectandblog.map((item) => {
                return (
                    <>
                        <BannerStructures title={item?.tentData?.productData?.title} data={item?.tentData?.tent} />
                        <OurProjects data={item.portfolio} />
                        <FeaturedProjects data={item?.blogs} pageDetails={{ featuredProjectTitle: "Products featured in this PROJECT entry:" }} loop={false} origin="start" />

                    </>
                )
            })}

            <div className='w-full flex justify-center items-center'>
                <DownloadButton text="DOWNLOAD MASTERCLASS TENTING 101" classes={"w-[656px]"} iconTrue={"true"} />
            </div>
        </>
    )
}

export default Tents