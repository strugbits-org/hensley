'use client'

import React from 'react'
import TentsTypes from './TentsTypes'
import BannerStructures from './BannerStructures'
import OurProjects from '../Collections/OurProjects'
import { DownloadButton } from './DownloadButton'
import { FeaturedProjects } from '../Product/FeaturedProjects'

const Tents = ({ data }) => {
    const { tents, projectAndblog, pageDetails, masterClassTentingURL } = data;
    const { featuredProductTitle, downloadBtnLabel } = pageDetails

    return (
        <>
            <TentsTypes data={tents} />
            {projectAndblog.map((item) => {
                return (
                    <div key={item?.tentData?.slug} id={(item?.tentData?.slug || "").replace(/[/]/g, "")}>
                        <BannerStructures tent={item?.tentData} data={item?.tentData?.tent} />
                        <OurProjects data={item.portfolio} />
                        <FeaturedProjects data={item?.blogs} pageDetails={{ featuredProjectTitle: featuredProductTitle }} loop={false} origin="auto" />
                    </div>
                )
            })}

            <div className='w-full flex justify-center items-center'>
                <a href={masterClassTentingURL} download>
                    <DownloadButton text={downloadBtnLabel} classes={"w-[656px]"} iconTrue={"true"} />
                </a>
            </div>
        </>
    )
}

export default Tents