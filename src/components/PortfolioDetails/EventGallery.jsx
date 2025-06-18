import React from 'react'
import { PrimaryImage } from '../common/PrimaryImage'

const EventGallery = ({ data }) => {
    return (
        <div className='w-full px-[24px]'>
            <div className='w-full space-y-[24px]'>
                {data.map((url, index) => {
                    const positionInGroup = index % 3;
                    if (positionInGroup === 0) {
                        return (
                            <div key={index} className="w-full">
                                <PrimaryImage url={url} fit={'fit'} customClasses="h-full w-full object-cover" />
                            </div>
                        );
                    } else if (positionInGroup === 1) {
                        return (
                            <div key={index} className="grid grid-cols-2 gap-[24px]">
                                <PrimaryImage url={url} fit={'fit'} customClasses="h-full w-full object-cover" />
                                {data[index + 1] && (
                                    <PrimaryImage url={data[index + 1]} fit={'fit'} customClasses="h-full w-full object-cover" />
                                )}
                            </div>
                        );
                    }
                    return null;
                }).filter(Boolean)}
            </div>
        </div>
    )
}

export default EventGallery