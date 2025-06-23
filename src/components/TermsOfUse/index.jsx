import React from 'react'
import SectionTitle from '../common/SectionTitle'
import { convertToHTMLRichContent } from '@/utils/renderRichText'

const TermsOfUse = ({ data = "" }) => {
    const { title } = data;

    return (
        <div>
            <SectionTitle text={title} classes="py-[40px] md:mt-6 lg:mt-0 border-t border-b border-primary-border " />
            <div className='w-full flex justify-center items-center sm:px-[100px] px-[40px] py-[60px]'>
                <div className='w-full lg:max-w-[924px]'>
                    {convertToHTMLRichContent({
                        content: data?.content,
                        class_heading: "font-haasRegular text-secondary-alt uppercase text-[32px] leading-[40px] font-bold mt-4",
                        class_p: 'font-haasRegular text-secondary-alt text-[16px] leading-[20px]',
                        class_ul: "list-disc pl-5",
                        class_li: "font-haasRegular text-secondary-alt text-[16px] leading-[20px] mb-6",
                        class_table: "w-full border-collapse border border-secondary-alt mt-4 mb-4",
                        class_table_cell: "font-haasRegular border border-secondary-alt p-4",
                    })}
                </div>
            </div>
        </div>
    )
}

export default TermsOfUse