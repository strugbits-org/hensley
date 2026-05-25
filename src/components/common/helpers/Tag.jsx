import React from 'react'

export const Tag = ({ text, classes, active = false, onClick }) => {
    return (
        <button onClick={onClick} className={`border uppercase bg-white font-haasLight text-[10px] 3xl:text-[18px] leading-[15px] 3xl:leading-[24px] p-1 3xl:px-3 3xl:py-1.5 ${classes} ${active ? '!bg-transparent border border-secondary-alt' : ''}`}>{text}</button>
    )
}