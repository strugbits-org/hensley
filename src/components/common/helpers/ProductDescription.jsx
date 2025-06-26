import { useState } from 'react';
import parse from 'html-react-parser';

export default function ProductDescription({ text, maxChars = 200 }) {
    const [expanded, setExpanded] = useState(false);
    const isLong = text.replace(/<[^>]+>/g, '').trim().length > maxChars;
    const displayedText = expanded ? text : text.slice(0, maxChars) + (isLong ? '...' : '');

    if (!text) return null;
    return (
        <div className='w-full flex flex-col gap-y-[15px]'>
            <h2 className='uppercase text-[16px] text-secondary-alt font-haasLight block'>Description</h2>
            <div className='uppercase text-[16px] text-secondary-alt font-haasLight block'>
                {parse(displayedText)}
            </div>
            {isLong && (
                <div>
                    <button
                        onClick={() => setExpanded(prev => !prev)}
                        className="flex items-center gap-2 text-sm font-medium text-secondary-alt font-haasBold uppercase"
                    >
                        <span className='border-b border-secondary-alt border-spacing-0'>
                            {expanded ? 'Read less' : 'Read more'}
                        </span>
                        <svg className={expanded ? 'rotate-180' : ''} xmlns="http://www.w3.org/2000/svg" width="12.231" height="13.578" viewBox="0 0 12.231 13.578">
                            <path id="SETA" d="M13.578,6.115,6.458,12.231l-.884-.756L11.2,6.658H0V5.548H11.2L5.574.755,6.458,0Z" transform="translate(12.231) rotate(90)" fill="#2c2216" />
                        </svg>
                    </button>
                </div>
            )}
        </div>
    );
}