'use client'

import React from 'react'
import TentsTypes from './TentsTypes'
import BannerStructures from './BannerStructures'
import OurProjects from '../Collections/OurProjects'
import { DownloadButton } from './DownloadButton'
import { FeaturedProjects } from '../Product/FeaturedProjects'

const Tents = ({ data }) => {

    const { tents, projectandblog, pageDetails } = data

    const { featuredProductTitle, downloadBtnLabel } = pageDetails

    return (
        <>
            <TentsTypes data={tents} />

            {projectandblog.map((item) => {
                return (
                    <>
                        <BannerStructures title={item?.tentData?.productData?.title} data={item?.tentData?.tent} />
                        <OurProjects data={item.portfolio} />
                        <FeaturedProjects data={item?.blogs} pageDetails={{ featuredProjectTitle: featuredProductTitle }} loop={false} origin="start" />

                    </>
                )
            })}

            <div className='w-full flex justify-center items-center'>
                <DownloadButton text={downloadBtnLabel} classes={"w-[656px]"} iconTrue={"true"} />
            </div>
        </>
    )
}

export default Tents