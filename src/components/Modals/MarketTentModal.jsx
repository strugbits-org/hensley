import { convertToHTML } from "@/utils/renderRichText";
import { CustomLink } from "../common/CustomLink";
import { PrimaryImage } from "../common/PrimaryImage";
import { PrimaryButton } from "../common/PrimaryButton";

export const MarketTentModal = ({ selectedMenu, closeModal }) => {

    const { data = [], type } = selectedMenu;
    if (!data) return null;

    return (
        <div onMouseLeave={closeModal} className="relative lg:p-6 lg:h-screen lg:overflow-auto lg:hide-scrollbar mt-4 lg:mt-0">
            <div className="absolute inset-0 -z-10 bg-secondary-glass backdrop-blur-[20px] brightness-[50px] h-full "></div>
            <div className={"w-full lg:h-[54vh] 2xl:h-[86vh] flex justify-center gap-y-3 lg:gap-y-16 lg:gap-6 lg:flex-row flex-col"}>
                {data.map((category) => {
                    const { title, description, tagline, slug, headerCoverImage, tent, buttonLabel, buttonLabelMenu } = category;

                    return (
                        <CustomLink key={title} to={`/${type === "markets" ? "market" : "tent"}${slug}`} className={"group relative min-h-[34rem] lg:h-full w-full lg:w-1/3 flex justify-center lg:border border-primary-border"} onClick={closeModal}>
                            <div className="absolute font-semibold inset-0 lg:inset-6 group-hover:inset-0 transition-[inset] duration-300 ease-in-out">
                                {(headerCoverImage || tent.mainMedia) && <PrimaryImage timeout={0} url={headerCoverImage || tent.mainMedia} alt={title} customClasses="w-full h-full object-cover brightness-[90%]" />}
                            </div>
                            <div className="z-10 py-[41px] lg:py-[47px] px-[25px] lg:px-[78px] flex flex-col">
                                <h2 className="lg:mt-[26px] text-[45px] leading-[45px] lg:text-[36px] lg:leading-[32px] 2xl:text-[70px] 2xl:leading-[65px] uppercase tracking-wider text-primary-alt font-recklessRegular mb-2">{title}</h2>
                                <hr className="mb-4 border-primary-alt" />
                                <div className="flex items-center justify-between gap-2">
                                    {tagline ? (
                                        <div>
                                            <p className="my-[16px] text-[12px] lg:text-[16px] uppercase tracking-wider text-primary-alt font-haasLight">
                                                {tagline}
                                            </p>
                                        </div>
                                    ) : description && (
                                        <div>
                                            {convertToHTML({ content: description, class_p: "text-[12px] lg:text-[16px] uppercase tracking-wider text-primary-alt font-haasLight" })}
                                        </div>
                                    )}
                                    <CustomLink className={"hidden sm:block lg:hidden"} to={`/${type === "markets" ? "market" : "tent"}${slug}`}>
                                        <PrimaryButton className="border border-primary-alt text-primary-alt hover:bg-primary-alt hover:text-secondary font-haasRegular tracking-widest text-sm min-w-[198px]">{buttonLabel || buttonLabelMenu}</PrimaryButton>
                                    </CustomLink>
                                </div>
                                <hr className="border-primary-alt my-4" />
                                <div className="hidden lg:block relative grow mt-8">
                                    <PrimaryImage url={"https://static.wixstatic.com/shapes/8ba81b_2be7b3074d224933a0484d17c7885b75.svg"} alt={title} customClasses="absolute fill-primary-alt left-0 bottom-0 w-[34px] h-[34px] transition-all duration-500 ease-in-out group-hover:w-full group-hover:h-full" />
                                </div>

                            </div>
                        </CustomLink>
                    );
                })}
            </div>

        </div>
    )
}
