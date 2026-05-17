import { CustomLink } from "../common/CustomLink";
import { PrimaryButton } from "../common/PrimaryButton"
import { resolveCoreMediaUrl } from "../../utils";

export const HeroSection = ({ data }) => {

    const { title, subTitle, estd, backgroundVideo, buttonLabel, buttonAction } = data;
    const videoSrc = resolveCoreMediaUrl(backgroundVideo) || null;

    return (
            <div className="relative h-[100dvh] isolate px-6 lg:px-8 flex flex-col items-center justify-between pb-[70px] pt-[160px] overflow-hidden">
                {videoSrc && (
                    <video src={videoSrc} className="absolute inset-0 -z-10 h-full w-full object-cover bg-blend-overlay" autoPlay loop muted />
                )}
                
                <span className="text-primary-alt text-[16px] font-haasRegular max-w-[250px] mx-auto text-center">
                    {subTitle}
                </span>
   
                <div className="flex flex-col items-center gap-y-6">
                    <h1 className="text-[32px] xs:text-[45px] md:text-[60px] lg:text-[75px] xl:text-[85px] leading-[1.1] text-primary-alt font-recklessRegular      text-center">
                        {title}
                    </h1>
                    <CustomLink to={buttonAction}>
                        <PrimaryButton className="border border-primary-alt text-primary-alt text-sm hover:bg-secondary-alt px-8 py-3 lg:py-4">
                            {buttonLabel}
                        </PrimaryButton>
                    </CustomLink>
                </div>
   
                <span className="text-primary-alt text-base font-haasRegular whitespace-nowrap">
                    {estd}
                </span>
            </div>
        )
    }