import React from 'react'

export const Tag = ({ text, classes, active = false, onClick }) => {
    return (
        <button onClick={onClick} className={`border uppercase bg-white font-haasLight text-[10px] leading-[15px] p-1 ${classes} ${active ? '!bg-transparent border border-secondary-alt' : ''}`}>{text}</button>
    )
}