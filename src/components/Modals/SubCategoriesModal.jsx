import { CustomLink } from "../common/CustomLink";
import { PrimaryImage } from "../common/PrimaryImage";

export const SubCategoriesModal = ({ selectedMenu, closeModal }) => {
    const { data } = selectedMenu;
    if (!data) return null;

    return (
        <div onMouseLeave={closeModal} className="relative px-4 sm:px-8 md:px-12 lg:px-24 xl:px-60 pt-8 sm:pt-12 md:pt-16 lg:pt-[120px] pb-6 sm:pb-8 md:pb-12 lg:pb-[105px]">
            <div className="absolute inset-0 -z-10 bg-secondary-glass backdrop-blur-[20px] brightness-[50px] h-full"></div>

            <div className="flex flex-wrap justify-center gap-0 lg:gap-y-[62px] max-h-[75vh] overflow-auto hide-scrollbar">
                {data.map(({ title, category, redirection }) => {
                    return (
                        <div key={title} className="w-1/5 flex flex-col items-center">
                            <CustomLink to={`${redirection ? redirection : "/subcategory"}/${category.slug}`}>
                                <div className="relative bg-primary-alt rounded-full w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 lg:w-[169px] lg:h-[169px] overflow-hidden">
                                    {category.mainMedia && <PrimaryImage timeout={0} url={category.mainMedia} alt={title} customClasses="h-full w-full object-cover" />}
                                </div>
                                <p className="mt-3 sm:mt-4 md:mt-5 lg:mt-[26px] text-xs uppercase tracking-wider text-secondary-alt font-haasRegular text-center">
                                    {title}
                                </p>
                            </CustomLink>
                        </div>
                    );
                })}
            </div>
        </div>
    )
}