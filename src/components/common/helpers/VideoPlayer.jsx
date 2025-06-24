"use client";

import { generateVideoURL } from "@/utils/generateImageURL";
import { useState, useRef } from "react";

export const VideoPlayer = ({ url, classes, controls = false }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const videoRef = useRef(null);
    const formattedUrl = generateVideoURL(url);

    // Function to toggle play/pause
    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    if (!formattedUrl) {
        return <div className="w-full h-full">No video available</div>;
    }

    return (
        <div
            className={`video-player relative w-full h-full" ${classes}`}
        >
            <video
                ref={videoRef}
                className="aspect-video h-full w-full object-cover"
                controls={controls}
                src={formattedUrl}
                type="video/mp4"
                onClick={togglePlay}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
            />

            {!controls && !isPlaying && (
                <button
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                    onClick={togglePlay}
                >
                    <svg className="size-20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36" preserveAspectRatio="xMidYMin slice"><g fill="none" fillRule="evenodd"><circle cx="18" cy="18" r="17" stroke="#fff" strokeWidth="2"></circle><path fill="#fff" d="m23.935 17.708-10.313 6.033V11.676z"></path></g></svg>
                </button>
            )}
        </div>
    )
}
