import { CustomLink } from "../common/CustomLink";

export const TentsModal = ({ data, closeModal }) => {
    return (
        <div className="relative p-6 h-screen overflow-auto hide-scrollbar">
            <div className="absolute inset-0 -z-10 bg-secondary-glass backdrop-blur-[20px] brightness-[50px] h-full "></div>
            <div class="w-full h-[86vh] flex justify-center gap-y-16 gap-6">
                {data.map((category) => {
                    const { name, imageSrc } = category;
                    return (
                        <div className={"group relative h-full w-1/3 flex justify-center border border-primary-border"} key={name}>
                            <div className="absolute inset-6 group-hover:inset-0 transition-[inset] duration-300 ease-in-out">
                                {imageSrc && <img src={imageSrc} alt={name} class="h-full w-full" />}
                            </div>
                            <div className="">
                                <p class="mt-[26px] text-xs uppercase tracking-wider text-secondary-alt font-haasRegular">{name}</p>

                            </div>
                        </div>
                    );
                })}
            </div>

        </div>
    )
}
