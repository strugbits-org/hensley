'use client'

import React from 'react'
import TentsTypes from './TentsTypes'
import BannerStructures from './BannerStructures'
import OurProjects from '../Collections/OurProjects'
import { DownloadButton } from './DownloadButton'
import { FeaturedBlogs } from '../Product/FeaturedBlogs'

const Tents = ({ data }) => {
    const { tents, fullTentData, pageDetails } = data;
    const { featuredProductTitle, downloadBtnLabel, masterClassTentingURL } = pageDetails

    return (
        <>
            <TentsTypes data={tents} />
            {fullTentData.map((item) => {
                const tentSlug = (item?.tentData?.slug || item?.tentData?.tent?.slug || "").replace(/^\//, "");
                return (
                    <div key={tentSlug || item?.tentData?._id} id={tentSlug}>
                        <BannerStructures key={tentSlug || item?.tentData?._id} tent={item?.tentData} data={item?.tentData?.tent} />
                        <OurProjects key={tentSlug || item?.tentData?._id} data={item.portfolio} />
                        <FeaturedBlogs key={tentSlug || item?.tentData?._id} data={item?.blogs} pageDetails={{ featuredProjectTitle: featuredProductTitle }} loop={false} origin="auto" />
                    </div>
                )
            })}

            <div className='w-full flex justify-center items-center'>
                <a href={masterClassTentingURL} download target='_blank'>
                    <DownloadButton text={downloadBtnLabel} classes={"w-full sm:w-[656px] max-w-full"} iconTrue={"true"} />
                </a>
            </div>
        </>
    )
}

export default Tents