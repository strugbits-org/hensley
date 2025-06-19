import React from 'react'
import SectionTitle from '../common/SectionTitle'
import { convertToHTML } from '@/utils/renderRichText'

const TermsOfUse = ({data=""}) => {

    const {title} = data

    return (
        <div>
            <SectionTitle text={title} classes="py-[40px] md:mt-6 lg:mt-0 border-t border-b border-primary-border " />
            <div className='w-full flex justify-center items-center sm:px-[100px] px-[40px] py-[60px]'>
                <div className='w-full lg:max-w-[924px]'>
                    {convertToHTML({content:data?.content, class_p:'font-haasRegular text-secondary-alt text-[16px] leading-[20px] uppercase', class_heading:"font-haasRegular text-secondary-alt uppercase",class_ul: "list-disc"}) }
                </div>
            </div>
        </div>
    )
}

export default TermsOfUse