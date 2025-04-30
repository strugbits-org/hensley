import { PrimaryButton } from "../common/PrimaryButton"

export const HeroSection = () => {
    const videoSrc = "https://video.wixstatic.com/video/8ba81b_e3e22b54200e46778b25e639b4bc4b5a/1080p/mp4/file.mp4";
    return (
        <div className="relative h-screen isolate px-6 pt-44 lg:px-8 mb-[500rem] flex items-center">
            <video src={videoSrc} className="absolute inset-0 -z-10 h-full w-full object-cover bg-blend-overlay" autoPlay loop muted />
            <div className="mx-auto lg:max-w-[90rem] text-center font-haasRegular">
                <div className="text-primary-alt text-base font-haasRegular">
                    SOCIAL, CORPORATE & <br /> NONPROFIT EVENTS
                </div>
                <h1 className="mt-28 text-[2.8rem] lg:text-[6rem] 2xl:text-[7.5rem] text-primary-alt font-recklessLight leading-[0.9]">
                    CREATING UNFORGETTABLE MOMENTS, TOGETHER
                </h1>
                <div className="mt-16">
                    <PrimaryButton className="">Call Us</PrimaryButton>
                </div>
                <div className="mt-44 text-primary-alt text-base font-haasRegular">
                    ESTD. 1980
                </div>
            </div>
        </div>
    )
}