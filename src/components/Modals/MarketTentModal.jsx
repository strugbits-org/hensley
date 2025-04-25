import Image from "next/image";
import { CustomLink } from "../common/CustomLink";
import arrowIconLg from "@/assets/icons/arrow-lg.svg";

export const MarketTentModal = ({ data, closeModal }) => {
    return (
        <div onMouseLeave={closeModal} className="relative p-6 h-screen overflow-auto hide-scrollbar">
            <div className="absolute inset-0 -z-10 bg-secondary-glass backdrop-blur-[20px] brightness-[50px] h-full "></div>
            <div class="w-full lg:h-[54vh] 2xl:h-[86vh] flex justify-center gap-y-16 gap-6">
                {data.map((category) => {
                    const { name, description, slug, imageSrc } = category;

                    return (
                        <CustomLink key={name} to={`/tents/${slug}`} className={"group relative h-full w-1/3 flex justify-center border border-primary-border"}>
                            <div className="absolute inset-6 group-hover:inset-0 transition-[inset] duration-300 ease-in-out">
                                {imageSrc && <img src={imageSrc} alt={name} class="h-full w-full object-cover" />}
                            </div>
                            <div className="z-10 py-[47px] px-[78px] flex flex-col">
                                <h2 class="mt-[26px] lg:text-[38px] 2xl:text-[64px] uppercase tracking-wider text-primary-alt font-haasLight">{name}</h2>
                                {description && (
                                    <>
                                        <hr className="mb-1 border-primary-alt" />
                                        <p class="my-[16px] text-[16px] uppercase tracking-wider text-primary-alt font-haasRegular">
                                            {description}
                                        </p>
                                        <hr className="border-primary-alt" />
                                    </>
                                )}
                                <div className="relative grow mt-8">
                                    <Image
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
