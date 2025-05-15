import React from 'react'

export const Tag = ({ text, onClick }) => {
    return (
        <li
            key={text}
            onClick={onClick}
            className={`cursor-pointer bg-white px-2 py-1 text-[10px] font-haasRegular text-secondary-alt`}
        >
            <span>{text}</span>
        </li>
    )
}
