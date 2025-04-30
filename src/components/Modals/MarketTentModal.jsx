import Image from "next/image";
import { CustomLink } from "../common/CustomLink";
import arrowIconLg from "@/assets/icons/arrow-lg.svg";

export const MarketTentModal = ({ data, closeModal }) => {
    return (
        <div onMouseLeave={closeModal} className="relative lg:p-6 lg:h-screen lg:overflow-auto lg:hide-scrollbar mt-12 lg:mt-0">
            <div className="absolute inset-0 -z-10 bg-secondary-glass backdrop-blur-[20px] brightness-[50px] h-full "></div>
            <div className={"w-full lg:h-[54vh] 2xl:h-[86vh] flex justify-center gap-y-3 lg:gap-y-16 lg:gap-6 lg:flex-row flex-col"}>
                {data.map((category) => {
                    const { name, description, slug, imageSrc } = category;

                    return (
                        <CustomLink key={name} to={`/tents/${slug}`} className={"group relative min-h-[34rem] lg:h-full w-full lg:w-1/3 flex justify-center lg:border border-primary-border"}>
                            <div className="absolute font-semibold inset-0 lg:inset-6 group-hover:inset-0 transition-[inset] duration-300 ease-in-out">
                                {imageSrc && <img src={imageSrc} alt={name} className="h-full w-full object-cover" />}
                            </div>
                            <div className="z-10 py-[41px] lg:py-[47px] px-[25px] lg:px-[78px] flex flex-col">
                                <h2 className="lg:mt-[26px] text-[45px] lg:text-[38px] 2xl:text-[64px] uppercase tracking-wider text-primary-alt font-recklessLight">{name}</h2>
                                {description && (
                                    <>
                                        <hr className="mb-1 border-primary-alt" />
                                        <p className="my-[16px] text-[12px] lg:text-[16px] uppercase tracking-wider text-primary-alt font-haasRegular">
                                            {description}
                                        </p>
                                        <hr className="border-primary-alt" />
                                    </>
                                )}
                                <div className="hidden lg:block relative grow mt-8">
                                    <Image
                                        alt=""
                                        src={arrowIconLg}
                                        className="absolute fill-primary-alt left-0 bottom-0 w-[34px] h-[34px] transition-all duration-500 ease-in-out group-hover:w-full group-hover:h-full"
                                    />
                                </div>

                            </div>
                        </CustomLink>
                    );
                })}
            </div>

        </div>
    )
}
