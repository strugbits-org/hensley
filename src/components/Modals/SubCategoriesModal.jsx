import { CustomLink } from "../common/CustomLink";

export const SubCategoriesModal = ({ data, closeModal }) => {
    return (
        <div onMouseLeave={closeModal} className="relative px-60 pt-[120px] pb-[105px] overflow-auto hide-scrollbar">
            <div className="absolute inset-0 -z-10 bg-secondary-glass backdrop-blur-[20px] brightness-[50px] h-full"></div>

            <div class="flex flex-wrap justify-center gap-y-[62px]">
                {data.map((category) => {
                    const { name, imageSrc } = category;
                    return (
                        <CustomLink className={"w-1/5 flex flex-col items-center"} key={name}>
                            <div class="relative bg-primary-alt rounded-full w-[169px] h-[169px] overflow-hidden">
                                {imageSrc && <img src={imageSrc} alt={name} class="h-full w-full" />}
                            </div>
                            <p class="mt-[26px] text-xs uppercase tracking-wider text-secondary-alt font-haasRegular">{name}</p>
                        </CustomLink>
                    );
                })}
            </div>

        </div>
    )
}
