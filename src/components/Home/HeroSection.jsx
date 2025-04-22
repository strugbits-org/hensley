import { PrimaryButton } from "../common/PrimaryButton"

export const HeroSection = () => {
    const videoSrc = "https://video.wixstatic.com/video/8ba81b_e3e22b54200e46778b25e639b4bc4b5a/1080p/mp4/file.mp4";
    return (
        <div className="h-screen flex justify-center items-center relative isolate px-6 pt-14 lg:px-8">
            <video src={videoSrc} className="absolute inset-0 -z-10 h-full w-full object-cover bg-blend-overlay" autoPlay loop muted/>
            <div className="mx-auto max-w-7xl">
                <div className="text-primary-alt sm:mb-8 sm:flex sm:justify-center">
                    SOCIAL, CORPORATE & NONPROFIT EVENTS
                </div>
                <div className="text-center">
                    <h1 className="text-4xl sm:text-5xl lg:text-9xl text-primary-alt font-recklessLight">
                        CREATING UNFORGETTABLE MOMENTS, TOGETHER
                    </h1>
                    <div className="mt-10 flex items-center justify-center gap-x-6">
                        <PrimaryButton>Call Us</PrimaryButton>
                    </div>
                </div>
                <div className="sm:mb-8 sm:flex sm:justify-center">
                    ESTD. 1980
                </div>
            </div>
        </div>
    )
}