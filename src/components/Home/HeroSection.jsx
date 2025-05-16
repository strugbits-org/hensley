import { generateVideoURL } from "@/utils/generateImageURL";
import { CustomLink } from "../common/CustomLink";
import { PrimaryButton } from "../common/PrimaryButton"

export const HeroSection = ({ data }) => {
    const { title, subTitle, estd, backgroundVideo, buttonLabel, buttonAction } = data;

    return (
        <div className="relative h-screen isolate pt-24 lg:pt-40 px-6 lg:px-8 flex items-center">
            <video src={generateVideoURL(backgroundVideo)} className="absolute inset-0 -z-10 h-full w-full object-cover bg-blend-overlay" autoPlay loop muted />
            <div className="mx-auto lg:max-w-[90rem] text-center font-haasRegular flex flex-col items-center gap-y-40 lg:gap-y-16 xl:gap-y-20">
                <span className="text-primary-alt text-[16px] font-haasRegular max-w-[250px] mx-auto">
                    {subTitle}
                </span>
                <div className="flex flex-col items-center gap-6 lg:gap-6">
                    <h1 className="text-[24px] xs:text-[45px] md:text-[60px] lg:text-[100px] xl:text-[120px] leading-[24px] xs:leading-[45px] lg:leading-[90px] xl:leading-[100px] text-primary-alt font-recklessRegular">
                        {title}
                    </h1>
                    <CustomLink to={buttonAction}>
                        <PrimaryButton className="border border-primary-alt text-primary-alt text-sm hover:bg-secondary-alt max-h-[60px] max-w-[280px] px-8 py-4 hover:[letter-spacing:4px]">{buttonLabel}</PrimaryButton>
                    </CustomLink>
                </div>
                <span className="text-primary-alt text-base font-haasRegular">
                    {estd}
                </span>
            </div>
        </div>
    )
}