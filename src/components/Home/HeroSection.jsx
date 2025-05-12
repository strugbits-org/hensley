import { generateVideoURL } from "@/utils/generateImageURL";
import { CustomLink } from "../common/CustomLink";
import { PrimaryButton } from "../common/PrimaryButton"

export const HeroSection = ({ data }) => {
    const { title, subTitle, estd, backgroundVideo, buttonLabel, buttonAction } = data;

    return (
        <div className="relative h-screen isolate px-6 lg:px-8 flex items-center">
            <video src={generateVideoURL(backgroundVideo)} className="absolute inset-0 -z-10 h-full w-full object-cover bg-blend-overlay" autoPlay loop muted />
            <div className="mx-auto lg:max-w-[90rem] text-center font-haasRegular">
                <div className="text-primary-alt text-[16px] font-haasRegular max-w-[250px] mx-auto">
                    {subTitle}
                </div>
                <h1 className="mt-28 text-[45px] md:text-[60px] lg:text-[100px] xl:text-[120px] leading-[45px] lg:leading-[90px] xl:leading-[100px] text-primary-alt font-recklessLight">
                    {title}
                </h1>
                <div className="mt-16">
                    <CustomLink to={buttonAction}>
                        <PrimaryButton className="border border-primary-alt text-primary-alt text-sm hover:bg-secondary-alt max-h-[60px] max-w-[280px] px-8 py-4 hover:[letter-spacing:4px]">{buttonLabel}</PrimaryButton>
                    </CustomLink>
                </div>
                <div className="mt-44 text-primary-alt text-base font-haasRegular">
                    {estd}
                </div>
            </div>
        </div>
    )
}